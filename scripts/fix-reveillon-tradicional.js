/**
 * OkCheff — Script isolado para Réveillon > Tradicional
 * Usa área Spanish como alternativa ao French que falhou
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

function log(msg) { console.log(`[${new Date().toLocaleTimeString()}] ${msg}`); }

function buildId(mealId, occasion, lang) {
  const occPart = occasion ? '_' + occasion.replace(/\s+/g, '') : '';
  return `mealdb_${mealId}${occPart}_${lang}`;
}

async function alreadyExists(mealId, occasion) {
  const id = buildId(mealId, occasion, 'en');
  const { data } = await supabase.from('recipes').select('id').eq('id', id).single();
  return !!data;
}

async function fetchMealsByArea(area, limit = 10) {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    const data = await res.json();
    return (data.meals || []).slice(0, limit);
  } catch (e) { log(`Erro: ${e.message}`); return []; }
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

async function main() {
  log('🚀 Script isolado: Inspiração > Réveillon > Tradicional');
  log('📍 Usando área: Spanish (alternativa ao French que falhou)');

  const meals = await fetchMealsByArea('Spanish', 10);
  if (meals.length === 0) {
    log('⚠️  Nenhuma receita encontrada. Tente outra área.');
    return;
  }

  log(`🔎 ${meals.length} receitas encontradas, processando...`);
  for (const meal of meals) {
    await processMeal(meal, 'tradicional', 'classica', 'Réveillon');
  }

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('✅ CONCLUÍDO!');
  log(`📊 Receitas salvas: ${totalSaved}`);
  log(`🌐 Traduções: ${totalTranslated}`);
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main().catch(e => { log(`❌ ERRO: ${e.message}`); process.exit(1); });
