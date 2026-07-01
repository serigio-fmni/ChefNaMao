/**
 * OkCheff — Script de População do Banco de Receitas
 * 
 * Fluxo:
 * 1. Busca receitas do TheMealDB (gratuito, ilimitado)
 * 2. Traduz com Gemini (10 por minuto, com retry)
 * 3. Fallback para OpenAI se Gemini falhar (máximo 50 traduções)
 * 4. Salva no Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// ── Configurações ──────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const MAX_PER_MINUTE = 1;         // Gemini: 1 por minuto (teste)
const MAX_OPENAI_FALLBACK = 2000;  // Usando apenas OpenAI agora (Gemini instável)
const MAX_GEMINI_RETRIES = 0;     // Desativado — usando apenas OpenAI

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Contadores de controle ─────────────────────────────────────────────────
let geminiRequestsThisMinute = 0;
let geminiMinuteStart = Date.now();
let openAIFallbackCount = 0;
let totalTranslated = 0;
let totalSaved = 0;

// ── Mapa de categorias do TheMealDB para o OkCheff ────────────────────────
const MEALDB_CATEGORIES = [
  { mealdb: 'Chicken', okcheff_diet: 'tradicional', okcheff_type: 'rapida' },
  { mealdb: 'Beef', okcheff_diet: 'tradicional', okcheff_type: 'classica' },
  { mealdb: 'Seafood', okcheff_diet: 'tradicional', okcheff_type: 'internacional' },
  { mealdb: 'Vegetarian', okcheff_diet: 'vegetariana', okcheff_type: 'rapida' },
  { mealdb: 'Vegan', okcheff_diet: 'vegana', okcheff_type: 'rapida' },
  { mealdb: 'Pasta', okcheff_diet: 'tradicional', okcheff_type: 'classica' },
  { mealdb: 'Dessert', okcheff_diet: 'tradicional', okcheff_type: 'classica' },
  { mealdb: 'Breakfast', okcheff_diet: 'tradicional', okcheff_type: 'rapida' },
  { mealdb: 'Lamb', okcheff_diet: 'tradicional', okcheff_type: 'internacional' },
  { mealdb: 'Pork', okcheff_diet: 'tradicional', okcheff_type: 'classica' },
  { mealdb: 'Side', okcheff_diet: 'vegetariana', okcheff_type: 'rapida' },
  { mealdb: 'Starter', okcheff_diet: 'vegetariana', okcheff_type: 'internacional' },
];

// Ocasiões especiais para a aba Inspiração
const OCCASIONS = [
  { name: 'Dia das Mães', diets: ['tradicional', 'vegetariana', 'vegana'], mealdb_area: 'French' },
  { name: 'Jantar Romântico', diets: ['tradicional', 'vegetariana', 'vegana'], mealdb_area: 'Italian' },
  { name: 'Aniversário', diets: ['tradicional', 'vegetariana', 'vegana'], mealdb_category: 'Dessert' },
  { name: 'Natal', diets: ['tradicional', 'vegetariana', 'vegana'], mealdb_category: 'Chicken' },
  { name: 'Páscoa', diets: ['tradicional', 'vegetariana', 'vegana'], mealdb_category: 'Lamb' },
  { name: 'Churrasco', diets: ['tradicional', 'vegetariana', 'vegana'], mealdb_category: 'Beef' },
  { name: 'Réveillon', diets: ['tradicional', 'vegetariana', 'vegana'], mealdb_area: 'French' },
  { name: 'Dia dos Pais', diets: ['tradicional', 'vegetariana', 'vegana'], mealdb_category: 'Beef' },
];

const LANGUAGES = ['pt', 'es', 'fr'];
const LANGUAGE_NAMES = { pt: 'Brazilian Portuguese', es: 'Spanish', fr: 'French' };

// ── Utilitários ────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function log(msg) {
  console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
}

// ── TheMealDB: buscar receitas ─────────────────────────────────────────────
async function fetchMealsByCategory(category, limit = 10) {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    const data = await res.json();
    if (!data.meals) return [];
    return data.meals.slice(0, limit);
  } catch (e) {
    log(`❌ Erro ao buscar categoria ${category}: ${e.message}`);
    return [];
  }
}

async function fetchMealsByArea(area, limit = 10) {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    const data = await res.json();
    if (!data.meals) return [];
    return data.meals.slice(0, limit);
  } catch (e) {
    log(`❌ Erro ao buscar área ${area}: ${e.message}`);
    return [];
  }
}

async function fetchMealDetails(mealId) {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await res.json();
    return data.meals?.[0] ?? null;
  } catch (e) {
    log(`❌ Erro ao buscar detalhes da receita ${mealId}: ${e.message}`);
    return null;
  }
}

function parseMealIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure?.trim() ?? ''} ${ingredient.trim()}`.trim());
    }
  }
  return ingredients;
}

function parseMealSteps(meal) {
  if (!meal.strInstructions) return [];
  return meal.strInstructions
    .split(/\r\n|\n/)
    .map(s => s.trim())
    .filter(s => s.length > 10)
    .slice(0, 15);
}

// ── Controle de rate limit do Gemini ──────────────────────────────────────
async function waitForGeminiSlot() {
  const now = Date.now();
  if (now - geminiMinuteStart >= 60000) {
    geminiRequestsThisMinute = 0;
    geminiMinuteStart = now;
  }
  if (geminiRequestsThisMinute >= MAX_PER_MINUTE) {
    const wait = 60000 - (now - geminiMinuteStart) + 1000;
    log(`⏳ Limite Gemini atingido. Aguardando ${Math.ceil(wait/1000)}s...`);
    await sleep(wait);
    geminiRequestsThisMinute = 0;
    geminiMinuteStart = Date.now();
  }
  geminiRequestsThisMinute++;
}

// ── Tradução com Gemini ────────────────────────────────────────────────────
async function translateWithGemini(text, targetLang) {
  await waitForGeminiSlot();
  const langName = LANGUAGE_NAMES[targetLang];

  const prompt = `Translate the following cooking recipe text to ${langName}. 
Keep ingredient names, measurements, and cooking terms accurate.
Return ONLY the translated text, nothing else.

Text to translate:
${text}`;

  for (let attempt = 1; attempt <= MAX_GEMINI_RETRIES; attempt++) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 1000 }
          })
        }
      );

      if (res.status === 429) {
        log(`⚠️ Gemini 429 (tentativa ${attempt}/${MAX_GEMINI_RETRIES}). Aguardando 65s...`);
        await sleep(65000);
        geminiRequestsThisMinute = 0;
        geminiMinuteStart = Date.now();
        continue;
      }

      if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);

      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text ?? text;

    } catch (e) {
      log(`❌ Gemini erro (tentativa ${attempt}): ${e.message}`);
      if (attempt === MAX_GEMINI_RETRIES) return null;
      await sleep(5000);
    }
  }
  return null;
}

// ── Tradução com OpenAI (fallback) ────────────────────────────────────────
async function translateWithOpenAI(text, targetLang) {
  if (openAIFallbackCount >= MAX_OPENAI_FALLBACK) {
    log(`🛑 TRAVA: Limite de ${MAX_OPENAI_FALLBACK} traduções pelo OpenAI atingido. Parando.`);
    process.exit(1);
  }

  if (!OPENAI_API_KEY) {
    log(`❌ OpenAI API key não encontrada no .env`);
    return text;
  }

  openAIFallbackCount++;
  const langName = LANGUAGE_NAMES[targetLang];
  log(`🌐 Traduzindo com OpenAI (${openAIFallbackCount}/${MAX_OPENAI_FALLBACK})...`);

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4.1-nano',
        messages: [
          { role: 'system', content: `You are a culinary translator. Translate to ${langName}. Return only the translation.` },
          { role: 'user', content: text }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? text;
  } catch (e) {
    log(`❌ OpenAI erro: ${e.message}`);
    return text;
  }
}

// ── Tradução principal (direto OpenAI) ──────────────────────────────────
async function translate(text, targetLang) {
  return await translateWithOpenAI(text, targetLang);
}

// ── Salvar receita no Supabase ────────────────────────────────────────────
async function saveRecipe(recipe) {
  const { error } = await supabase.from('recipes').upsert(recipe, { onConflict: 'id' });
  if (error) {
    log(`❌ Erro ao salvar receita: ${error.message}`);
    return false;
  }
  totalSaved++;
  return true;
}

// ── Processar uma receita do MealDB ───────────────────────────────────────
async function processMeal(meal, diet, mealType, occasion = null) {
  // Verifica se já existe no Supabase para não duplicar
  const { data: existing } = await supabase
    .from('recipes')
    .select('id')
    .eq('id', `mealdb_${meal.idMeal}_en`)
    .single();

  if (existing) {
    log(`  ⏭️  Pulando (já existe): ${meal.strMeal || meal.idMeal}`);
    return;
  }

  const details = await fetchMealDetails(meal.idMeal);
  if (!details) return;

  const ingredients = parseMealIngredients(details);
  const steps = parseMealSteps(details);
  const nameEN = details.strMeal;
  const descEN = `${details.strCategory} recipe from ${details.strArea || 'International'} cuisine.`;

  log(`  📝 Processando: ${nameEN}`);

  // Salva versão em inglês (já está pronto, sem tradução)
  await saveRecipe({
    id: `mealdb_${details.idMeal}_en`,
    name: nameEN,
    description: descEN,
    image: details.strMealThumb,
    time_minutes: 30,
    difficulty: 'medio',
    servings: 4,
    diet,
    meal_type: mealType,
    occasion,
    ingredients,
    steps,
    shopping_list: ingredients,
    tags: [diet, mealType, occasion].filter(Boolean),
    is_cache: true,
    language: 'en',
    source_id: details.idMeal,
  });

  // Traduz para PT, ES e FR
  for (const lang of LANGUAGES) {
    log(`    🌐 Traduzindo para ${lang.toUpperCase()}...`);

    const translatedName = await translate(nameEN, lang);
    const translatedDesc = await translate(descEN, lang);
    const translatedIngredients = await translate(ingredients.join('\n'), lang);
    const translatedSteps = await translate(steps.join('\n'), lang);

    await saveRecipe({
      id: `mealdb_${details.idMeal}_${lang}`,
      name: translatedName,
      description: translatedDesc,
      image: details.strMealThumb,
      time_minutes: 30,
      difficulty: 'medio',
      servings: 4,
      diet,
      meal_type: mealType,
      occasion,
      ingredients: translatedIngredients.split('\n').filter(Boolean),
      steps: translatedSteps.split('\n').filter(Boolean),
      shopping_list: translatedIngredients.split('\n').filter(Boolean),
      tags: [diet, mealType, occasion].filter(Boolean),
      is_cache: true,
      language: lang,
      source_id: details.idMeal,
    });

    await sleep(1000); // Pequena pausa entre traduções
  }
}

// ── Função principal ───────────────────────────────────────────────────────
async function main() {
  log('🚀 Iniciando população do banco OkCheff...');
  log(`📊 Configuração: ${MAX_PER_MINUTE} req/min Gemini | Trava OpenAI: ${MAX_OPENAI_FALLBACK}`);
  log('─────────────────────────────────────────────');

  // 1. ABA GELADEIRA — por categoria
  log('\n📂 ABA GELADEIRA — Processando categorias...');
  for (const cat of MEALDB_CATEGORIES) {
    log(`\n🍽️  Categoria: ${cat.mealdb} (${cat.okcheff_diet} / ${cat.okcheff_type})`);
    const meals = await fetchMealsByCategory(cat.mealdb, 10);
    for (const meal of meals) {
      await processMeal(meal, cat.okcheff_diet, cat.okcheff_type);
    }
  }

  // 2. ABA INSPIRAÇÃO — por ocasião
  log('\n🎉 ABA INSPIRAÇÃO — Processando ocasiões especiais...');
  for (const occasion of OCCASIONS) {
    log(`\n🎊 Ocasião: ${occasion.name}`);
    for (const diet of occasion.diets) {
      log(`  🥗 Dieta: ${diet}`);
      let meals = [];
      if (occasion.mealdb_category) {
        meals = await fetchMealsByCategory(occasion.mealdb_category, 10);
      } else if (occasion.mealdb_area) {
        meals = await fetchMealsByArea(occasion.mealdb_area, 10);
      }
      for (const meal of meals) {
        await processMeal(meal, diet, 'classica', occasion.name);
      }
    }
  }

  // ── Relatório final ──────────────────────────────────────────────────────
  log('\n─────────────────────────────────────────────');
  log('✅ CONCLUÍDO!');
  log(`📊 Receitas salvas no Supabase: ${totalSaved}`);
  log(`🌐 Traduções realizadas: ${totalTranslated}`);
  log(`🔄 Traduções pelo OpenAI (fallback): ${openAIFallbackCount}`);
  log('─────────────────────────────────────────────');
}

main().catch(e => {
  log(`❌ ERRO FATAL: ${e.message}`);
  process.exit(1);
});