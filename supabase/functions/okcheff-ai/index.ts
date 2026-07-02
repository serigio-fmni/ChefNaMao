import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// ═══════════════════════════════════════════════════════════════
// MANUAL DE IDENTIDADE DO OKCHEFF — usado em TUDO (busca, receitas, chat, futuro áudio)
// ═══════════════════════════════════════════════════════════════
const OKCHEFF_IDENTITY = `You are OkCheff, a master chef with deep expertise across world cuisines (home cooking, professional/haute cuisine, regional and international traditions). Never reveal you are an AI.

TONE: Warm and welcoming like a home cook, but with the authority and precision of a professional chef. Adapt your language to whoever you're talking to — a beginner with no culinary background or a trained chef — always respectful, never condescending, never robotic.

DIET RULES (STRICT — never violate):
- Vegan (vegana): NO meat, poultry, fish, seafood, eggs, dairy, honey, or any animal-derived ingredient. Zero exceptions.
- Vegetarian (vegetariana): NO meat, poultry, fish, or seafood. Eggs and dairy are allowed.
- Traditional (tradicional): no restriction.
- If the source recipe doesn't give enough detail to guarantee it fits the requested diet, DO NOT just flag it — actively substitute the problematic ingredient with a fitting alternative (e.g. replace fish sauce with soy sauce + seaweed for vegan) so the final recipe is fully compliant, and briefly note the substitution was made.

COOKING TIPS: Whenever relevant, add small sensory cues to steps to help the cook judge doneness/readiness by feel — e.g. "espete um garfo para ver se está macio", "a massa deve soltar das mãos", "deve soar oco ao bater de leve". Use these naturally, not on every step.`;

const SYSTEM_PROMPT = `${OKCHEFF_IDENTITY}

## MULTILINGUAL INTELLIGENCE (CRITICAL)
- Detect the language used by the user in their most recent message immediately.
- ALWAYS reply in the EXACT same language the user just used (Portuguese, English, Spanish, French).
- If the user switches language mid-conversation, switch your language immediately.

## COOKING FLOW
- When a recipe is requested or started: first list ALL ingredients clearly, then ask if ready to start step one.
- Guide the user strictly ONE step at a time — NEVER dump the entire recipe at once.
- Wait for user confirmation before proceeding to the next step.
- After the final step, congratulate the user warmly.

## ADAPTABILITY & SAFETY
- If the user lacks an ingredient, immediately suggest one viable substitute.
- Never suggest dangerous techniques or harmful ingredient combinations.
- If the user asks about non-cooking topics, gently redirect: "I specialize in cooking — let us focus on your recipe!"`;

// O app envia a ocasião em snake_case (ex: 'dia_das_maes'), mas as receitas já
// salvas no banco (populadas via TheMealDB) usam o nome em português (ex: 'Dia das Mães').
// Esse mapa traduz para o mesmo formato usado no banco, para achar o cache corretamente.
const OCCASION_LABELS: Record<string, string> = {
  dia_das_maes: 'Dia das Mães',
  jantar_romantico: 'Jantar Romântico',
  aniversario: 'Aniversário',
  natal: 'Natal',
  pascoa: 'Páscoa',
  churrasco: 'Churrasco',
  ano_novo: 'Réveillon',
  dia_dos_pais: 'Dia dos Pais',
};
function normalizeOccasion(occasion: string | null): string | null {
  if (!occasion) return null;
  return OCCASION_LABELS[occasion] ?? occasion;
}

async function searchRecipesInCache(supabase: any, ingredients: string[], diet: string, mealType: string, language: string, occasion: string | null, dishName: string | null) {
  let query = supabase.from('recipes').select('*').eq('is_cache', true).eq('language', language);
  if (diet && diet !== 'todas') query = query.eq('diet', diet);
  if (mealType && mealType !== 'todas') query = query.eq('meal_type', mealType);
  if (occasion) query = query.eq('occasion', occasion);
  if (dishName) query = query.ilike('name', `%${dishName}%`);
  const { data, error } = await query.limit(50);
  if (error || !data || data.length === 0) return [];

  if (dishName) return data.slice(0, 5);

  if (ingredients && ingredients.length > 0) {
    const normalize = (t: string) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const normIngredients = ingredients.map(normalize);
    const scored = data.map((recipe: any) => {
      const recipeIngredients = (recipe.ingredients || []).map((i: string) => normalize(i));
      let matches = 0;
      for (const ing of normIngredients) {
        if (recipeIngredients.some((ri: string) => ri.includes(ing))) matches++;
      }
      return { recipe, score: matches };
    }).filter((r: any) => r.score > 0).sort((a: any, b: any) => b.score - a.score);
    return scored.slice(0, 5).map((r: any) => r.recipe);
  }
  return data.sort(() => Math.random() - 0.5).slice(0, 5);
}

async function generateRecipesWithAI(openaiApiKey: string, ingredients: string[], diet: string, mealType: string, language: string, occasion: string | null, dishName: string | null) {
  const langNames: Record<string, string> = { pt: 'Brazilian Portuguese', en: 'English', es: 'Spanish', fr: 'French' };
  const prompt = `${OKCHEFF_IDENTITY}

${dishName ? `Generate 5 recipe cards for dishes matching this specific name/dish the user searched for: "${dishName}". All 5 should be variations or close matches of this exact dish, in ${langNames[language] || 'Brazilian Portuguese'}.` : `Generate 5 recipe cards in ${langNames[language] || 'Brazilian Portuguese'}.`}
${ingredients.length > 0 ? 'Available ingredients: ' + ingredients.join(', ') : ''}
${diet && diet !== 'todas' ? 'Diet: ' + diet + ' — follow the strict diet rules above without exception.' : ''}
${mealType && mealType !== 'todas' ? 'Meal type: ' + mealType : ''}
${occasion ? 'Occasion: ' + occasion : ''}
Return ONLY a valid JSON array with exactly 5 recipes. Each recipe:
{"name":"","description":"","time_minutes":0,"difficulty":"facil","servings":0,"diet":"","meal_type":"","ingredients":[],"steps":[],"shopping_list":[],"tips":[],"tags":[]}
IMPORTANT: in "steps", always write out the exact quantity of each ingredient used in that step (e.g. "Misture 2 dentes de alho picados com 50g de manteiga"), never just the ingredient name alone. Include sensory doneness cues where natural.`;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + openaiApiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-4.1-nano', messages: [{ role: 'user', content: prompt }], max_tokens: 3000, temperature: 0.8 }),
  });
  if (!response.ok) throw new Error('OpenAI error: ' + response.status);
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? '[]';
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

async function saveRecipesToCache(supabase: any, recipes: any[], language: string, occasion: string | null) {
  const unsplashKey = Deno.env.get('UNSPLASH_ACCESS_KEY');
  const saved: any[] = [];
  for (const recipe of recipes) {
    const id = 'ai_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9) + '_' + language;
    let image = recipe.image;
    if (!image && unsplashKey) {
      image = await fetchUnsplashImage(recipe.name, unsplashKey);
    }
    const withId = { id, ...recipe, image, language, occasion, is_cache: true, use_count: 0 };
    await supabase.from('recipes').upsert(withId);
    saved.push(withId);
  }
  return saved;
}

async function fetchUnsplashImage(query: string, accessKey: string): Promise<string | null> {
  try {
    const url = 'https://api.unsplash.com/search/photos?query=' + encodeURIComponent(query + ' food dish') + '&per_page=1&orientation=landscape';
    const res = await fetch(url, { headers: { Authorization: 'Client-ID ' + accessKey } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.[0]?.urls?.regular ?? null;
  } catch {
    return null;
  }
}

async function getUserPackage(supabase: any, userId: string) {
  const { data } = await supabase.from('user_packages').select('*').eq('user_id', userId).eq('is_active', true).order('created_at', { ascending: false }).limit(1).single();
  return data;
}

async function substituteIngredients(openaiApiKey: string, recipe: any, missingIngredients: string[], language: string) {
  const langNames: Record<string, string> = { pt: 'Brazilian Portuguese', en: 'English', es: 'Spanish', fr: 'French' };
  const prompt = `${OKCHEFF_IDENTITY}

The user is cooking this recipe but is MISSING these ingredients: ${missingIngredients.join(', ')}.

Current recipe (in ${langNames[language] || 'Brazilian Portuguese'}):
Name: ${recipe.name}
Ingredients: ${JSON.stringify(recipe.ingredients)}
Steps: ${JSON.stringify(recipe.steps)}
Shopping list: ${JSON.stringify(recipe.shopping_list ?? recipe.shoppingList)}

Rewrite the recipe replacing EVERY SINGLE missing ingredient listed above with a DIFFERENT sensible substitute — this is MANDATORY for all of them, with zero exceptions, even if an item already looks like a substitute or already looks fine to you. Never leave a listed item unchanged. The final "ingredients" and "shopping_list" arrays must contain ONLY the final, current version of the recipe — REPLACE each missing item in place, do NOT add the new version as an extra line while keeping the old one. No duplicates, no leftover old entries. Adjust the steps to match. Keep everything else the same. Respond ONLY with valid JSON in this exact shape:
{"ingredients":[],"steps":[],"shopping_list":[],"substitutionNotes":""}
substitutionNotes should be one short friendly sentence (in ${langNames[language] || 'Brazilian Portuguese'}) explaining what was swapped.`;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + openaiApiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-4.1-nano', messages: [{ role: 'user', content: prompt }], max_tokens: 2000, temperature: 0.7 }),
  });
  if (!response.ok) throw new Error('OpenAI error: ' + response.status);
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? '{}';
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const body = await req.json();
    const { mode = 'chat' } = body;

    // ── Cliente público (sem login) — usado para busca de cards ──────────
    const publicClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI key not configured' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ── MODO SEARCH: não exige login (busca é gratuita) ───────────────────
    if (mode === 'search') {
      const { ingredients = [], diet = 'todas', mealType = 'todas', occasion: rawOccasion = null, language = 'pt', dishName = null } = body;
      const occasion = normalizeOccasion(rawOccasion);
      let recipes = await searchRecipesInCache(publicClient, ingredients, diet, mealType, language, occasion, dishName);
      if (recipes.length === 0) {
        const generated = await generateRecipesWithAI(openaiApiKey, ingredients, diet, mealType, language, occasion, dishName);
        recipes = await saveRecipesToCache(publicClient, generated, language, occasion);
      }
      return new Response(JSON.stringify({ recipes }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ── MODO SUBSTITUTE: não exige login — troca ingrediente faltante ─────────────
    if (mode === 'substitute') {
      const { recipe, missingIngredients = [], language = 'pt' } = body;
      if (!recipe || missingIngredients.length === 0) {
        return new Response(JSON.stringify({ error: 'Missing recipe or missingIngredients' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      const result = await substituteIngredients(openaiApiKey, recipe, missingIngredients, language);
      return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ── MODOS QUE EXIGEM LOGIN: unlock e chat ──────────────────────────────
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    const token = authHeader.replace('Bearer ', '');
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: 'Bearer ' + token } } });
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    if (mode === 'unlock') {
      const { recipeId } = body;
      const userPackage = await getUserPackage(supabaseClient, user.id);
      const hasCredit = userPackage && (userPackage.recipes_total - userPackage.recipes_used) > 0;
      if (!hasCredit) return new Response(JSON.stringify({ error: 'NO_CREDITS' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      const { data: recipe } = await supabaseClient.from('recipes').select('*').eq('id', recipeId).single();
      if (!recipe) return new Response(JSON.stringify({ error: 'Recipe not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      const adminClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
      await adminClient.from('user_packages').update({ recipes_used: userPackage.recipes_used + 1 }).eq('id', userPackage.id);
      await supabaseClient.from('notebook_recipes').insert({ user_id: user.id, recipe_id: recipeId, name: recipe.name, description: recipe.description, image: recipe.image, ingredients: recipe.ingredients, steps: recipe.steps, shopping_list: recipe.shopping_list, time_minutes: recipe.time_minutes, difficulty: recipe.difficulty, servings: recipe.servings, diet: recipe.diet, meal_type: recipe.meal_type, is_unlocked: true, source: 'cache' });
      return new Response(JSON.stringify({ recipe, creditsRemaining: userPackage.recipes_total - userPackage.recipes_used - 1 }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { messages } = body;
    if (!messages || !Array.isArray(messages)) return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + openaiApiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4.1-nano', messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages], max_tokens: 800, temperature: 0.75 }),
    });
    const openaiData = await openaiResponse.json();
    const reply = openaiData.choices?.[0]?.message?.content ?? '';
    return new Response(JSON.stringify({ reply }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('OkCheff AI error:', error);
    return new Response(JSON.stringify({ error: 'Internal error: ' + error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
