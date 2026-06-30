/**
 * OkCheff — Script de População do Banco (v2.1)
 * Lógica: 1 combinação por vez, busca 10 receitas, salva em 4 idiomas.
 * Agora considera a ocasião no ID para não confundir receitas de Geladeira com Inspiração.
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const LANGUAGES = ['pt', 'es', 'fr'];
const LANGUAGE_NAMES = { pt: 'Brazilian Portuguese', es: 'Spanish', fr: 'French' };

let totalSaved = 0;
let totalTranslated = 0;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function log(msg) { console.log(`[${new Date().toLocaleTimeString()}] ${msg}`); }

async function fetchMealsByCategory(category, limit = 10) {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    const data = await res.json();
    return (data.meals || []).slice(0, limit);
  } catch (e) { log(`Erro categoria ${category}: ${e.message}`); return []; }
}

async function fetchMealsByArea(area, limit = 10) {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    const data = await res.json();
    return (data.meals || []).slice(0, limit);
  } catch (e) { log(`Erro área ${area}: ${e.message}`); return []; }
}

async function fetchMealDetails(mealId) {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await res.json();
    return data.meals?.[0] ?? null;
  } catch { return null; }
}

function parseIngredients(meal) {
  const out = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];
    if (ing && ing.trim()) out.push(`${meas?.trim() ?? ''} ${ing.trim()}`.trim());
  }
  return out;
}

function parseSteps(meal) {
  if (!meal.strInstructions) return [];
  return meal.strInstructions.split(/\r\n|\n/).map(s => s.trim()).filter(s => s.length > 10).slice(0, 15);
}

async function translate(text, lang) {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + OPENAI_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4.1-nano',
        messages: [
          { role: 'system', content: `You are a culinary translator. Translate to ${LANGUAGE_NAMES[lang]}. Return only the translation.` },
          { role: 'user', content: text }
        ],
        max_tokens: 1000, temperature: 0.3
      })
    });
    const data = await res.json();
    totalTranslated++;
    return data.choices?.[0]?.message?.content ?? text;
  } catch (e) { log(`Erro tradução: ${e.message}`); return text; }
}

async function saveRecipe(recipe) {
  const { error } = await supabase.from('recipes').upsert(recipe, { onConflict: 'id' });
  if (error) { log(`Erro ao salvar: ${error.message}`); return false; }
  totalSaved++;
  return true;
}

function buildId(mealId, occasion, lang) {
  const occPart = occasion ? '_' + occasion.replace(/\s+/g, '') : '';
  return `mealdb_${mealId}${occPart}_${lang}`;
}

async function alreadyExists(mealId, occasion) {
  const id = buildId(mealId, occasion, 'en');
  const { data } = await supabase.from('recipes').select('id').eq('id', id).single();
  return !!data;
}

async function processMeal(meal, diet, mealType, occasion) {
  if (await alreadyExists(meal.idMeal, occasion)) {
    log(`  ⏭️  Pulando (já existe): ${meal.strMeal}`);
    return;
  }

  const details = await fetchMealDetails(meal.idMeal);
  if (!details) return;

  const ingredients = parseIngredients(details);
  const steps = parseSteps(details);
  const nameEN = details.strMeal;
  const descEN = `${details.strCategory} recipe from ${details.strArea || 'International'} cuisine.`;

  log(`  📝 ${nameEN}`);

  await saveRecipe({
    id: buildId(details.idMeal, occasion, 'en'), name: nameEN, description: descEN, image: details.strMealThumb,
    time_minutes: 30, difficulty: 'medio', servings: 4, diet, meal_type: mealType, occasion,
    ingredients, steps, shopping_list: ingredients, tags: [diet, mealType, occasion].filter(Boolean),
    is_cache: true, language: 'en', source_id: details.idMeal,
  });

  for (const lang of LANGUAGES) {
    const tName = await translate(nameEN, lang);
    const tDesc = await translate(descEN, lang);
    const tIng = await translate(ingredients.join('\n'), lang);
    const tSteps = await translate(steps.join('\n'), lang);

    await saveRecipe({
      id: buildId(details.idMeal, occasion, lang), name: tName, description: tDesc, image: details.strMealThumb,
      time_minutes: 30, difficulty: 'medio', servings: 4, diet, meal_type: mealType, occasion,
      ingredients: tIng.split('\n').filter(Boolean), steps: tSteps.split('\n').filter(Boolean),
      shopping_list: tIng.split('\n').filter(Boolean), tags: [diet, mealType, occasion].filter(Boolean),
      is_cache: true, language: lang, source_id: details.idMeal,
    });
  }
}

async function runCombination(label, fetchFn, diet, mealType, occasion) {
  log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  log(`▶️  COMBINAÇÃO: ${label}`);
  log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  const meals = await fetchFn();
  if (meals.length === 0) {
    log(`  ⚠️  Nenhuma receita encontrada para: ${label}`);
    return;
  }
  log(`  🔎 ${meals.length} receitas encontradas, processando...`);
  for (const meal of meals) {
    await processMeal(meal, diet, mealType, occasion);
  }
  log(`✅ Combinação concluída: ${label}`);
}

const GELADEIRA_COMBOS = [
  { label: 'Geladeira > Rápida > Tradicional', fetch: () => fetchMealsByCategory('Chicken', 10), diet: 'tradicional', type: 'rapida' },
  { label: 'Geladeira > Rápida > Vegetariana', fetch: () => fetchMealsByCategory('Vegetarian', 10), diet: 'vegetariana', type: 'rapida' },
  { label: 'Geladeira > Rápida > Vegana', fetch: () => fetchMealsByCategory('Vegan', 10), diet: 'vegana', type: 'rapida' },
  { label: 'Geladeira > Clássica > Tradicional', fetch: () => fetchMealsByCategory('Beef', 10), diet: 'tradicional', type: 'classica' },
  { label: 'Geladeira > Clássica > Vegetariana', fetch: () => fetchMealsByCategory('Side', 10), diet: 'vegetariana', type: 'classica' },
  { label: 'Geladeira > Clássica > Vegana', fetch: () => fetchMealsByCategory('Starter', 10), diet: 'vegana', type: 'classica' },
  { label: 'Geladeira > Internacional > Tradicional', fetch: () => fetchMealsByCategory('Seafood', 10), diet: 'tradicional', type: 'internacional' },
  { label: 'Geladeira > Internacional > Vegetariana', fetch: () => fetchMealsByArea('Indian', 10), diet: 'vegetariana', type: 'internacional' },
  { label: 'Geladeira > Internacional > Vegana', fetch: () => fetchMealsByArea('Moroccan', 10), diet: 'vegana', type: 'internacional' },
];

const INSPIRACAO_COMBOS = [
  { label: 'Inspiração > Dia das Mães > Tradicional', fetch: () => fetchMealsByArea('French', 10), diet: 'tradicional', occasion: 'Dia das Mães' },
  { label: 'Inspiração > Dia das Mães > Vegetariana', fetch: () => fetchMealsByCategory('Vegetarian', 10), diet: 'vegetariana', occasion: 'Dia das Mães' },
  { label: 'Inspiração > Dia das Mães > Vegana', fetch: () => fetchMealsByCategory('Vegan', 10), diet: 'vegana', occasion: 'Dia das Mães' },
  { label: 'Inspiração > Jantar Romântico > Tradicional', fetch: () => fetchMealsByArea('Italian', 10), diet: 'tradicional', occasion: 'Jantar Romântico' },
  { label: 'Inspiração > Jantar Romântico > Vegetariana', fetch: () => fetchMealsByArea('Greek', 10), diet: 'vegetariana', occasion: 'Jantar Romântico' },
  { label: 'Inspiração > Jantar Romântico > Vegana', fetch: () => fetchMealsByCategory('Vegan', 10), diet: 'vegana', occasion: 'Jantar Romântico' },
  { label: 'Inspiração > Aniversário > Tradicional', fetch: () => fetchMealsByCategory('Dessert', 10), diet: 'tradicional', occasion: 'Aniversário' },
  { label: 'Inspiração > Aniversário > Vegetariana', fetch: () => fetchMealsByCategory('Pasta', 10), diet: 'vegetariana', occasion: 'Aniversário' },
  { label: 'Inspiração > Aniversário > Vegana', fetch: () => fetchMealsByArea('Moroccan', 10), diet: 'vegana', occasion: 'Aniversário' },
  { label: 'Inspiração > Natal > Tradicional', fetch: () => fetchMealsByCategory('Chicken', 10), diet: 'tradicional', occasion: 'Natal' },
  { label: 'Inspiração > Natal > Vegetariana', fetch: () => fetchMealsByCategory('Side', 10), diet: 'vegetariana', occasion: 'Natal' },
  { label: 'Inspiração > Natal > Vegana', fetch: () => fetchMealsByArea('Indian', 10), diet: 'vegana', occasion: 'Natal' },
  { label: 'Inspiração > Páscoa > Tradicional', fetch: () => fetchMealsByCategory('Lamb', 10), diet: 'tradicional', occasion: 'Páscoa' },
  { label: 'Inspiração > Páscoa > Vegetariana', fetch: () => fetchMealsByArea('Greek', 10), diet: 'vegetariana', occasion: 'Páscoa' },
  { label: 'Inspiração > Páscoa > Vegana', fetch: () => fetchMealsByArea('Moroccan', 10), diet: 'vegana', occasion: 'Páscoa' },
  { label: 'Inspiração > Churrasco > Tradicional', fetch: () => fetchMealsByCategory('Beef', 10), diet: 'tradicional', occasion: 'Churrasco' },
  { label: 'Inspiração > Churrasco > Vegetariana', fetch: () => fetchMealsByCategory('Side', 10), diet: 'vegetariana', occasion: 'Churrasco' },
  { label: 'Inspiração > Churrasco > Vegana', fetch: () => fetchMealsByArea('Mexican', 10), diet: 'vegana', occasion: 'Churrasco' },
  { label: 'Inspiração > Réveillon > Tradicional', fetch: () => fetchMealsByArea('French', 10), diet: 'tradicional', occasion: 'Réveillon' },
  { label: 'Inspiração > Réveillon > Vegetariana', fetch: () => fetchMealsByArea('Greek', 10), diet: 'vegetariana', occasion: 'Réveillon' },
  { label: 'Inspiração > Réveillon > Vegana', fetch: () => fetchMealsByCategory('Starter', 10), diet: 'vegana', occasion: 'Réveillon' },
  { label: 'Inspiração > Dia dos Pais > Tradicional', fetch: () => fetchMealsByCategory('Pork', 10), diet: 'tradicional', occasion: 'Dia dos Pais' },
  { label: 'Inspiração > Dia dos Pais > Vegetariana', fetch: () => fetchMealsByArea('Italian', 10), diet: 'vegetariana', occasion: 'Dia dos Pais' },
  { label: 'Inspiração > Dia dos Pais > Vegana', fetch: () => fetchMealsByCategory('Vegan', 10), diet: 'vegana', occasion: 'Dia dos Pais' },
];

async function main() {
  log('🚀 OkCheff — População do Banco v2.1 (IDs únicos por ocasião)');
  log(`📊 Total de combinações: ${GELADEIRA_COMBOS.length + INSPIRACAO_COMBOS.length}`);

  log('\n📂 ═══ ABA GELADEIRA ═══');
  for (const combo of GELADEIRA_COMBOS) {
    await runCombination(combo.label, combo.fetch, combo.diet, combo.type, null);
  }

  log('\n🎉 ═══ ABA INSPIRAÇÃO ═══');
  for (const combo of INSPIRACAO_COMBOS) {
    await runCombination(combo.label, combo.fetch, combo.diet, 'classica', combo.occasion);
  }

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('✅ TUDO CONCLUÍDO!');
  log(`📊 Receitas salvas: ${totalSaved}`);
  log(`🌐 Traduções: ${totalTranslated}`);
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main().catch(e => { log(`❌ ERRO FATAL: ${e.message}`); process.exit(1); });
