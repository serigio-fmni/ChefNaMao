import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import * as Localization from 'expo-localization';
import { supabase } from '../lib/supabase';
import { Recipe, DietType, MealType } from '../constants/data';
import { Language, setLanguage } from '../constants/i18n';

const SUPPORTED_LANGUAGES: Language[] = ['pt', 'en', 'es', 'fr'];

function detectDeviceLanguage(): Language {
  try {
    const locales = Localization.getLocales();
    const deviceLang = locales?.[0]?.languageCode ?? 'en';
    if (SUPPORTED_LANGUAGES.includes(deviceLang as Language)) {
      return deviceLang as Language;
    }
  } catch {
    // silent
  }
  return 'en';
}

export interface UserProfile {
  name: string;
  diet: DietType;
  preferences: MealType[];
  isPremium: boolean;
  language: Language;
  /** 0..100 voice energy balance from Supabase */
  voiceEnergy: number;
}

export interface SavedRecipe extends Recipe {
  savedAt: string;
  dbId?: string; // Supabase notebook_recipes.recipe_id
}

export interface AppContextType {
  // Auth
  session: Session | null;
  user: User | null;
  isAuthLoading: boolean;
  signOut: () => Promise<void>;

  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;

  savedRecipes: SavedRecipe[];
  saveRecipe: (recipe: Recipe) => Promise<void>;
  removeRecipe: (id: string) => Promise<void>;
  isRecipeSaved: (id: string) => boolean;

  eventRecipes: SavedRecipe[];
  saveEventRecipe: (recipe: Recipe) => Promise<void>;
  removeEventRecipe: (id: string) => Promise<void>;
  isEventRecipeSaved: (id: string) => boolean;

  currentIngredients: string[];
  setCurrentIngredients: (ingredients: string[]) => void;

  selectedDiet: DietType | 'todas';
  setSelectedDiet: (diet: DietType | 'todas') => void;

  selectedMealType: MealType | 'todas';
  setSelectedMealType: (type: MealType | 'todas') => void;

  /** Consumes 1 unit of voice energy (syncs with DB if authenticated) */
  consumeVoiceEnergy: () => Promise<void>;

  isLoading: boolean;
}

const defaultProfile: UserProfile = {
  name: 'Visitante',
  diet: 'tradicional',
  preferences: ['rapida', 'classica'],
  isPremium: false,
  language: 'pt',
  voiceEnergy: 100,
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: '@okcheff_profile',
  SAVED_RECIPES: '@okcheff_saved_recipes',
  EVENT_RECIPES: '@okcheff_event_recipes',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [eventRecipes, setEventRecipes] = useState<SavedRecipe[]>([]);
  const [currentIngredients, setCurrentIngredients] = useState<string[]>([]);
  const [selectedDiet, setSelectedDiet] = useState<DietType | 'todas'>('todas');
  const [selectedMealType, setSelectedMealType] = useState<MealType | 'todas'>('todas');
  const [isLoading, setIsLoading] = useState(true);

  // ── AppState handling ─────────────────────────────────────────────────────
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });
    return () => subscription.remove();
  }, []);

  // ── Auth initialization ───────────────────────────────────────────────────
  useEffect(() => {
    // Restore session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setIsAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (event === 'SIGNED_IN' && s) {
        loadUserFromDB(s.user.id);
        loadNotebookFromDB(s.user.id);
      }
      if (event === 'SIGNED_OUT') {
        // Clear data on sign out
        setProfile(defaultProfile);
        setSavedRecipes([]);
        setEventRecipes([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Load local + DB data ──────────────────────────────────────────────────
  useEffect(() => {
    loadLocalData();
  }, []);

  const loadLocalData = async () => {
    try {
      const [profileData, recipesData, eventData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PROFILE),
        AsyncStorage.getItem(STORAGE_KEYS.SAVED_RECIPES),
        AsyncStorage.getItem(STORAGE_KEYS.EVENT_RECIPES),
      ]);
      if (profileData) {
        const parsed: UserProfile = JSON.parse(profileData);
        // Se ainda não tem idioma salvo, detecta o do celular
        if (!parsed.language) {
          parsed.language = detectDeviceLanguage();
        }
        setProfile(parsed);
        setLanguage(parsed.language);
      } else {
        // Primeira abertura: detecta idioma do celular
        const detectedLang = detectDeviceLanguage();
        setLanguage(detectedLang);
        setProfile(prev => ({ ...prev, language: detectedLang }));
      }
      if (recipesData) setSavedRecipes(JSON.parse(recipesData));
      if (eventData) setEventRecipes(JSON.parse(eventData));
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  /** Sync user profile from Supabase users table */
  const loadUserFromDB = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('subscription_type, voice_energy_balance')
        .eq('id', userId)
        .single();

      if (error) {
        // Profile may not exist yet — create it
        if (error.code === 'PGRST116') {
          await supabase.from('users').insert({
            id: userId,
            subscription_type: 'free',
            voice_energy_balance: 100,
          });
          return;
        }
      }

      if (data) {
        const isPremium = data.subscription_type === 'premium';
        const voiceEnergy = data.voice_energy_balance ?? 100;
        setProfile(prev => {
          const updated = { ...prev, isPremium, voiceEnergy };
          AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated)).catch(() => {});
          return updated;
        });
      }
    } catch {
      // silent
    }
  };

  /** Load notebook from Supabase (overrides local cache when authenticated) */
  const loadNotebookFromDB = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('notebook_recipes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) return;

      const mapped: SavedRecipe[] = data.map(row => ({
        id: row.recipe_id,
        dbId: row.recipe_id,
        savedAt: row.created_at,
        name: row.title,
        description: '',
        image: row.ingredients?.image ?? '',
        time: row.ingredients?.time ?? 30,
        difficulty: row.ingredients?.difficulty ?? 'facil',
        diet: row.ingredients?.diet ?? ['tradicional'],
        type: row.ingredients?.type ?? ['classica'],
        dishType: row.ingredients?.dishType ?? 'almoco',
        servings: row.ingredients?.servings ?? 2,
        ingredients: row.ingredients?.list ?? [],
        steps: row.instructions?.steps ?? [],
        tags: row.ingredients?.tags ?? [],
        isPremium: false,
        calories: row.ingredients?.calories,
        isEvent: row.category === 'evento',
        occasion: row.ingredients?.occasion,
        shoppingList: row.ingredients?.shoppingList,
      }));

      const normal = mapped.filter(r => !r.isEvent);
      const events = mapped.filter(r => r.isEvent);

      setSavedRecipes(normal);
      setEventRecipes(events);

      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_RECIPES, JSON.stringify(normal));
      await AsyncStorage.setItem(STORAGE_KEYS.EVENT_RECIPES, JSON.stringify(events));
    } catch {
      // silent
    }
  };

  // ── Auth actions ──────────────────────────────────────────────────────────
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // ── Profile ───────────────────────────────────────────────────────────────
  const updateProfile = async (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    if (updates.language) setLanguage(updates.language);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));

      // Sync premium status to DB if authenticated
      if (updates.isPremium !== undefined && user) {
        await supabase
          .from('users')
          .update({ subscription_type: updates.isPremium ? 'premium' : 'free' })
          .eq('id', user.id);
      }
    } catch {
      // silent
    }
  };

  // ── Save recipe helpers ───────────────────────────────────────────────────
  const buildDBPayload = (recipe: Recipe, userId: string, isEvent: boolean) => ({
    user_id: userId,
    title: recipe.name,
    category: isEvent ? 'evento' : (recipe.dishType ?? 'gourmet'),
    ingredients: {
      list: recipe.ingredients,
      image: recipe.image,
      time: recipe.time,
      difficulty: recipe.difficulty,
      diet: recipe.diet,
      type: recipe.type,
      dishType: recipe.dishType,
      servings: recipe.servings,
      tags: recipe.tags,
      calories: recipe.calories,
      occasion: recipe.occasion,
      shoppingList: recipe.shoppingList,
    },
    instructions: { steps: recipe.steps },
  });

  // ── Saved Recipes (normal) ────────────────────────────────────────────────
  const saveRecipe = async (recipe: Recipe) => {
    if (savedRecipes.find(r => r.id === recipe.id)) return;
    if (!profile.isPremium && savedRecipes.length >= 5) return;

    const saved: SavedRecipe = { ...recipe, savedAt: new Date().toISOString() };
    const updated = [saved, ...savedRecipes];
    setSavedRecipes(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_RECIPES, JSON.stringify(updated)).catch(() => {});

    if (user) {
      await supabase.from('notebook_recipes').insert(buildDBPayload(recipe, user.id, false));
    }
  };

  const removeRecipe = async (id: string) => {
    const updated = savedRecipes.filter(r => r.id !== id);
    setSavedRecipes(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_RECIPES, JSON.stringify(updated)).catch(() => {});

    if (user) {
      await supabase
        .from('notebook_recipes')
        .delete()
        .eq('user_id', user.id)
        .eq('title', savedRecipes.find(r => r.id === id)?.name ?? '');
    }
  };

  const isRecipeSaved = (id: string) => savedRecipes.some(r => r.id === id);

  // ── Event Recipes ─────────────────────────────────────────────────────────
  const saveEventRecipe = async (recipe: Recipe) => {
    if (eventRecipes.find(r => r.id === recipe.id)) return;

    const saved: SavedRecipe = { ...recipe, savedAt: new Date().toISOString() };
    const updated = [saved, ...eventRecipes];
    setEventRecipes(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.EVENT_RECIPES, JSON.stringify(updated)).catch(() => {});

    if (user) {
      await supabase.from('notebook_recipes').insert(buildDBPayload(recipe, user.id, true));
    }
  };

  const removeEventRecipe = async (id: string) => {
    const updated = eventRecipes.filter(r => r.id !== id);
    setEventRecipes(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.EVENT_RECIPES, JSON.stringify(updated)).catch(() => {});

    if (user) {
      await supabase
        .from('notebook_recipes')
        .delete()
        .eq('user_id', user.id)
        .eq('title', eventRecipes.find(r => r.id === id)?.name ?? '');
    }
  };

  const isEventRecipeSaved = (id: string) => eventRecipes.some(r => r.id === id);

  // ── Voice Energy ──────────────────────────────────────────────────────────
  const consumeVoiceEnergy = async () => {
    const newEnergy = Math.max(0, profile.voiceEnergy - 1);
    const updated = { ...profile, voiceEnergy: newEnergy };
    setProfile(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated)).catch(() => {});

    // DB update is handled server-side by the Edge Function when voice mode is active
    // But we keep local state in sync immediately
    if (user) {
      await supabase
        .from('users')
        .update({ voice_energy_balance: newEnergy })
        .eq('id', user.id);
    }
  };

  return (
    <AppContext.Provider
      value={{
        session,
        user,
        isAuthLoading,
        signOut,
        profile,
        updateProfile,
        savedRecipes,
        saveRecipe,
        removeRecipe,
        isRecipeSaved,
        eventRecipes,
        saveEventRecipe,
        removeEventRecipe,
        isEventRecipeSaved,
        currentIngredients,
        setCurrentIngredients,
        selectedDiet,
        setSelectedDiet,
        selectedMealType,
        setSelectedMealType,
        consumeVoiceEnergy,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
