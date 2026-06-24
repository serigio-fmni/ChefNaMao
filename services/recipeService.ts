import { supabase } from '../lib/supabase';
import { Recipe, DietType, MealType, EventOccasion, MOCK_RECIPES } from '../constants/data';

export interface RecipeFilters {
  ingredients: string[];
  diet?: DietType | 'todas';
  mealType?: MealType | 'todas';
  isPremium: boolean;
  userId?: string;
}

export interface InspirationFilters {
  occasion: EventOccasion;
  diet?: DietType | 'todas';
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function calculateMatchScore(recipe: Recipe, ingredients: string[]): number {
  if (ingredients.length === 0) return 1;
  const normalizedIngredients = ingredients.map(normalizeText);
  const recipeIngredients = recipe.ingredients.map(i => normalizeText(i));
  let matches = 0;
  for (const ing of normalizedIngredients) {
    const found = recipeIngredients.some(ri => ri.includes(ing) || ing.includes(ri.split(' ')[0]));
    if (found) matches++;
  }
  return matches / ingredients.length;
}

function mapDBToRecipe(row: any): Recipe {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    image: row.image ?? 'https://images.unsplash.com/photo-1495546968767-f0573cca821e?w=600',
    time: row.time_minutes ?? 30,
    difficulty: row.difficulty ?? 'facil',
    diet: row.diet ? [row.diet] : ['tradicional'],
    type: row.meal_type ? [row.meal_type] : ['classica'],
    dishType: row.occasion ? 'jantar' : 'almoco',
    servings: row.servings ?? 2,
    ingredients: row.ingredients ?? [],
    steps: row.steps ?? [],
    shoppingList: row.shopping_list ?? [],
    tags: row.tags ?? [],
    isPremium: false,
    isEvent: !!row.occasion,
    occasion: row.occasion,
  };
}

export async function generateRecipes(filters: RecipeFilters): Promise<Recipe[]> {
  try {
    // Tenta buscar do cache no Supabase primeiro
    let query = supabase.from('recipes').select('*').eq('is_cache', true);

    if (filters.diet && filters.diet !== 'todas') {
      query = query.eq('diet', filters.diet);
    }
    if (filters.mealType && filters.mealType !== 'todas') {
      query = query.eq('meal_type', filters.mealType);
    }

    const { data, error } = await query.limit(20);

    if (!error && data && data.length > 0) {
      let results = data.map(mapDBToRecipe);

      // Filtra e ordena por ingredientes se fornecidos
      if (filters.ingredients.length > 0) {
        results = results
          .map(r => ({ recipe: r, score: calculateMatchScore(r, filters.ingredients) }))
          .filter(r => r.score > 0)
          .sort((a, b) => b.score - a.score)
          .map(r => r.recipe);
      }

      if (results.length > 0) {
        return results.slice(0, 3);
      }
    }
  } catch {
    // Se falhar, cai no fallback
  }

  // Fallback: usa dados mockados locais
  await new Promise(resolve => setTimeout(resolve, 1500));
  let results = MOCK_RECIPES.filter(recipe => {
    if (recipe.isPremium && !filters.isPremium) return false;
    if (filters.diet && filters.diet !== 'todas') {
      if (!recipe.diet.includes(filters.diet as DietType)) return false;
    }
    if (filters.mealType && filters.mealType !== 'todas') {
      if (!recipe.type.includes(filters.mealType as MealType)) return false;
    }
    return true;
  });

  if (filters.ingredients.length > 0) {
    results = results
      .map(r => ({ recipe: r, score: calculateMatchScore(r, filters.ingredients) }))
      .sort((a, b) => b.score - a.score)
      .filter(r => r.score > 0)
      .map(r => r.recipe);
  }

  if (results.length === 0) {
    results = MOCK_RECIPES.filter(r => !r.isPremium || filters.isPremium);
  }

  return results.slice(0, 3);
}

export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      return mapDBToRecipe(data);
    }
  } catch {
    // fallback
  }

  // Fallback local
  return MOCK_RECIPES.find(r => r.id === id);
}

export async function saveRecipeToCache(recipe: Recipe): Promise<void> {
  try {
    await supabase.from('recipes').upsert({
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      image: recipe.image,
      time_minutes: recipe.time,
      difficulty: recipe.difficulty,
      servings: recipe.servings,
      diet: recipe.diet?.[0],
      meal_type: recipe.type?.[0],
      occasion: recipe.occasion,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      shopping_list: recipe.shoppingList,
      tags: recipe.tags,
      is_cache: true,
    });
  } catch {
    // silent
  }
}

export async function generateInspirationMenu(filters: InspirationFilters): Promise<Recipe[]> {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('occasion', filters.occasion)
      .eq('is_cache', true)
      .limit(3);

    if (!error && data && data.length > 0) {
      return data.map(mapDBToRecipe);
    }
  } catch {
    // fallback
  }

  // Fallback local
  await new Promise(resolve => setTimeout(resolve, 1800));
  const { INSPIRATION_MENUS } = await import('../constants/data') as any;
  if (!INSPIRATION_MENUS) return [];
  const menus = INSPIRATION_MENUS[filters.occasion] || [];
  if (filters.diet && filters.diet !== 'todas') {
    const filtered = menus.filter((r: Recipe) => r.diet.includes(filters.diet as DietType));
    return filtered.length > 0 ? filtered : menus;
  }
  return menus;
}

export function getFeaturedRecipes(isPremium: boolean): Recipe[] {
  return MOCK_RECIPES.filter(r => !r.isPremium || isPremium).slice(0, 4);
}
