import { supabase } from '../lib/supabase';
import { Recipe, DietType, MealType, EventOccasion, MOCK_RECIPES } from '../constants/data';

export interface RecipeFilters {
  ingredients: string[];
  diet?: DietType | 'todas';
  mealType?: MealType | 'todas';
  isPremium: boolean;
  dishName?: string;
}

export interface InspirationFilters {
  occasion: EventOccasion;
  diet?: DietType | 'todas';
}

// Converte a lista de compras para o formato que a tela espera (id, name, quantity, category).
// As receitas podem chegar como texto solto (ex: "2 tomates") em vez de objeto estruturado.
function normalizeShoppingList(list: any): import('../constants/data').ShoppingItem[] {
  if (!Array.isArray(list)) return [];
  return list
    .filter(Boolean)
    .map((item: any, index: number) => {
      if (typeof item === 'string') {
        return {
          id: `item_${index}`,
          name: item,
          quantity: '',
          category: 'outros' as const,
        };
      }
      // já está no formato estruturado (ou parcialmente) — preenche o que faltar
      return {
        id: item.id ?? `item_${index}`,
        name: item.name ?? String(item),
        quantity: item.quantity ?? '',
        category: item.category ?? 'outros',
      };
    });
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
    dishType: 'almoco',
    servings: row.servings ?? 2,
    ingredients: row.ingredients ?? [],
    steps: row.steps ?? [],
    shoppingList: normalizeShoppingList(row.shopping_list),
    tips: row.tips ?? [],
    tags: row.tags ?? [],
    isPremium: false,
    isEvent: !!row.occasion,
    occasion: row.occasion,
  };
}

async function callEdgeFunction(body: object): Promise<any> {
  const { data, error } = await supabase.functions.invoke('okcheff-ai', { body });
  if (error) throw new Error(error.message);
  return data;
}

export async function generateRecipes(filters: RecipeFilters): Promise<Recipe[]> {
  try {
    const result = await callEdgeFunction({
      mode: 'search',
      ingredients: filters.ingredients,
      diet: filters.diet ?? 'todas',
      mealType: filters.mealType ?? 'todas',
      dishName: filters.dishName ?? null,
      language: 'pt',
    });
    if (result?.recipes && result.recipes.length > 0) {
      return result.recipes.map(mapDBToRecipe);
    }
  } catch (e) {
    console.warn('Edge Function error, usando fallback:', e);
  }
  return MOCK_RECIPES.filter(r => !r.isPremium || filters.isPremium).slice(0, 5);
}

export async function generateInspirationMenu(filters: InspirationFilters): Promise<Recipe[]> {
  try {
    const result = await callEdgeFunction({
      mode: 'search',
      ingredients: [],
      diet: filters.diet ?? 'todas',
      mealType: 'todas',
      occasion: filters.occasion,
      language: 'pt',
    });
    if (result?.recipes && result.recipes.length > 0) {
      return result.recipes.map(mapDBToRecipe);
    }
  } catch (e) {
    console.warn('Edge Function error, usando fallback:', e);
  }
  return MOCK_RECIPES.slice(0, 5);
}

export async function unlockRecipe(recipeId: string): Promise<{ recipe: Recipe; creditsRemaining: number } | null> {
  try {
    const result = await callEdgeFunction({ mode: 'unlock', recipeId });
    if (result?.recipe) {
      return { recipe: mapDBToRecipe(result.recipe), creditsRemaining: result.creditsRemaining ?? 0 };
    }
  } catch (e) {
    console.warn('Erro ao desbloquear receita:', e);
  }
  return null;
}

export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  try {
    const { data, error } = await supabase.from('recipes').select('*').eq('id', id).single();
    if (!error && data) return mapDBToRecipe(data);
  } catch {}
  return MOCK_RECIPES.find(r => r.id === id);
}

export async function sendChatMessage(messages: Array<{ role: string; content: string }>): Promise<string> {
  try {
    const result = await callEdgeFunction({ mode: 'chat', messages });
    return result?.reply ?? '';
  } catch (e) {
    return 'Desculpe, nao consegui responder agora. Tente novamente.';
  }
}

export function getFeaturedRecipes(isPremium: boolean): Recipe[] {
  return MOCK_RECIPES.filter(r => !r.isPremium || isPremium).slice(0, 4);
}

// Troca ingredientes que o usuário não tem, ajustando ingredientes, passos e lista de compras.
export async function substituteIngredients(
  recipe: Recipe,
  missingIngredientNames: string[]
): Promise<{ recipe: Recipe; note: string } | null> {
  try {
    const result = await callEdgeFunction({
      mode: 'substitute',
      recipe: {
        name: recipe.name,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        shopping_list: recipe.shoppingList,
      },
      missingIngredients: missingIngredientNames,
      language: 'pt',
    });
    if (result?.ingredients) {
      return {
        recipe: {
          ...recipe,
          ingredients: result.ingredients,
          steps: result.steps ?? recipe.steps,
          shoppingList: normalizeShoppingList(result.shopping_list),
        },
        note: result.substitutionNotes ?? '',
      };
    }
  } catch (e) {
    console.warn('Erro ao trocar ingrediente:', e);
  }
  return null;
}
