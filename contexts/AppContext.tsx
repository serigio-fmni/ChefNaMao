import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe, DietType, MealType } from '../constants/data';
import { Language, setLanguage } from '../constants/i18n';

export interface UserProfile {
  name: string;
  diet: DietType;
  preferences: MealType[];
  isPremium: boolean;
  language: Language;
  /** 0..1 voice energy level. Decreases by 1/7 per voice interaction. Resets daily (mock). */
  voiceEnergy: number;
}

export interface SavedRecipe extends Recipe {
  savedAt: string;
}

export interface AppContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;

  savedRecipes: SavedRecipe[];
  saveRecipe: (recipe: Recipe) => void;
  removeRecipe: (id: string) => void;
  isRecipeSaved: (id: string) => boolean;

  eventRecipes: SavedRecipe[];
  saveEventRecipe: (recipe: Recipe) => void;
  removeEventRecipe: (id: string) => void;
  isEventRecipeSaved: (id: string) => boolean;

  currentIngredients: string[];
  setCurrentIngredients: (ingredients: string[]) => void;

  selectedDiet: DietType | 'todas';
  setSelectedDiet: (diet: DietType | 'todas') => void;

  selectedMealType: MealType | 'todas';
  setSelectedMealType: (type: MealType | 'todas') => void;

  /** Consume 1 voice interaction unit (reduces energy by 1/7) */
  consumeVoiceEnergy: () => void;

  isLoading: boolean;
}

const defaultProfile: UserProfile = {
  name: 'Visitante',
  diet: 'tradicional',
  preferences: ['rapida', 'classica'],
  isPremium: false,
  language: 'pt',
  voiceEnergy: 1,
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: '@okcheff_profile',
  SAVED_RECIPES: '@okcheff_saved_recipes',
  EVENT_RECIPES: '@okcheff_event_recipes',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [eventRecipes, setEventRecipes] = useState<SavedRecipe[]>([]);
  const [currentIngredients, setCurrentIngredients] = useState<string[]>([]);
  const [selectedDiet, setSelectedDiet] = useState<DietType | 'todas'>('todas');
  const [selectedMealType, setSelectedMealType] = useState<MealType | 'todas'>('todas');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileData, recipesData, eventData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PROFILE),
        AsyncStorage.getItem(STORAGE_KEYS.SAVED_RECIPES),
        AsyncStorage.getItem(STORAGE_KEYS.EVENT_RECIPES),
      ]);
      if (profileData) {
        const parsed: UserProfile = JSON.parse(profileData);
        setProfile(parsed);
        if (parsed.language) setLanguage(parsed.language);
      }
      if (recipesData) setSavedRecipes(JSON.parse(recipesData));
      if (eventData) setEventRecipes(JSON.parse(eventData));
    } catch (e) {
      // silent fail
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    if (updates.language) setLanguage(updates.language);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    } catch (e) {}
  };

  const saveRecipe = async (recipe: Recipe) => {
    const existing = savedRecipes.find(r => r.id === recipe.id);
    if (existing) return;
    if (!profile.isPremium && savedRecipes.length >= 5) return;
    const saved: SavedRecipe = { ...recipe, savedAt: new Date().toISOString() };
    const updated = [saved, ...savedRecipes];
    setSavedRecipes(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_RECIPES, JSON.stringify(updated));
    } catch (e) {}
  };

  const removeRecipe = async (id: string) => {
    const updated = savedRecipes.filter(r => r.id !== id);
    setSavedRecipes(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_RECIPES, JSON.stringify(updated));
    } catch (e) {}
  };

  const isRecipeSaved = (id: string) => savedRecipes.some(r => r.id === id);

  const saveEventRecipe = async (recipe: Recipe) => {
    const existing = eventRecipes.find(r => r.id === recipe.id);
    if (existing) return;
    const saved: SavedRecipe = { ...recipe, savedAt: new Date().toISOString() };
    const updated = [saved, ...eventRecipes];
    setEventRecipes(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EVENT_RECIPES, JSON.stringify(updated));
    } catch (e) {}
  };

  const removeEventRecipe = async (id: string) => {
    const updated = eventRecipes.filter(r => r.id !== id);
    setEventRecipes(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EVENT_RECIPES, JSON.stringify(updated));
    } catch (e) {}
  };

  const isEventRecipeSaved = (id: string) => eventRecipes.some(r => r.id === id);

  const consumeVoiceEnergy = async () => {
    const step = 1 / 7;
    const newEnergy = Math.max(0, profile.voiceEnergy - step);
    const updated = { ...profile, voiceEnergy: newEnergy };
    setProfile(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    } catch (e) {}
  };

  return (
    <AppContext.Provider
      value={{
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
