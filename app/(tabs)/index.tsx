import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/theme';
import { useApp } from '../../hooks/useApp';
import { generateRecipes, generateInspirationMenu } from '../../services/recipeService';
import { RecipeCard, IngredientChip, EventRecipeCard } from '../../components';
import {
  Recipe,
  DietType,
  MealType,
  EventOccasion,
  EVENT_OCCASIONS,
} from '../../constants/data';

const DIET_OPTIONS: Array<{ value: DietType | 'todas'; label: string }> = [
  { value: 'todas', label: 'Todas' },
  { value: 'tradicional', label: 'Tradicional' },
  { value: 'vegetariana', label: 'Vegetariana' },
  { value: 'vegana', label: 'Vegana' },
];

const MEAL_OPTIONS: Array<{ value: MealType | 'todas'; label: string }> = [
  { value: 'todas', label: 'Todas' },
  { value: 'rapida', label: 'Rápida' },
  { value: 'classica', label: 'Clássica' },
  { value: 'internacional', label: 'Internacional' },
  { value: 'regional', label: 'Regional' },
  { value: 'sobremesa', label: 'Sobremesa' },
];

type HomeTab = 'geladeira' | 'inspiracao';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile, selectedDiet, setSelectedDiet, selectedMealType, setSelectedMealType } = useApp();

  const [activeTab, setActiveTab] = useState<HomeTab>('geladeira');

  const handleOpenSearch = () => router.push('/search');

  // Na Geladeira state
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // Inspiração state
  const [selectedOccasion, setSelectedOccasion] = useState<EventOccasion | null>(null);
  const [inspirationRecipes, setInspirationRecipes] = useState<Recipe[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const maxIngredients = profile.isPremium ? 99 : 3;

  // ── Geladeira actions ──────────────────────────────────────────────────────
  const addIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (!trimmed) return;
    if (ingredients.includes(trimmed.toLowerCase())) return;
    if (ingredients.length >= maxIngredients) return;
    setIngredients(prev => [...prev, trimmed.toLowerCase()]);
    setIngredientInput('');
  };

  const removeIngredient = (item: string) => {
    setIngredients(prev => prev.filter(i => i !== item));
  };

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const results = await generateRecipes({
        ingredients,
        diet: selectedDiet,
        mealType: selectedMealType,
        isPremium: profile.isPremium,
      });
      setRecipes(results);
    } catch (e) {
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  }, [ingredients, selectedDiet, selectedMealType, profile.isPremium]);

  // ── Inspiração actions ────────────────────────────────────────────────────
  const handleInspirationSearch = useCallback(async () => {
    if (!selectedOccasion) return;
    setIsLoading(true);
    setHasSearched(true);
    try {
      const results = await generateInspirationMenu({
        occasion: selectedOccasion,
        diet: selectedDiet,
      });
      setInspirationRecipes(results);
    } catch (e) {
      setInspirationRecipes([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedOccasion, selectedDiet]);

  const handleTabSwitch = (tab: HomeTab) => {
    setActiveTab(tab);
    setHasSearched(false);
    setRecipes([]);
    setInspirationRecipes([]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Header */}
        <View style={[styles.heroContainer, { paddingTop: insets.top + 16 }]}>
          <Image
            source={require('../../assets/images/hero-cooking.png')}
            style={styles.heroBg}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            {profile.isPremium && (
              <View style={styles.premiumIndicator}>
                <MaterialIcons name="star" size={12} color={Colors.text} />
                <Text style={styles.premiumIndicatorText}>Premium</Text>
              </View>
            )}
            <View style={styles.brandRow}>
              <Text style={styles.greeting}>Olá, {profile.name.split(' ')[0]}! 👨‍🍳</Text>
              <View style={styles.brandBadge}><Text style={styles.brandBadgeText}>OkCheff</Text></View>
            </View>
            <Text style={styles.heroTitle}>
              {activeTab === 'geladeira'
                ? 'O que vamos\ncozinhar hoje?'
                : 'Qual a ocasião\nespecial?'}
            </Text>
          </View>
        </View>

        {/* Segmented Control */}
        <View style={styles.segmentedWrapper}>
          <View style={styles.segmented}>
            <TouchableOpacity
              style={[styles.segmentButton, activeTab === 'geladeira' && styles.segmentButtonActive]}
              onPress={() => handleTabSwitch('geladeira')}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="kitchen"
                size={16}
                color={activeTab === 'geladeira' ? Colors.textInverse : Colors.textSubtle}
              />
              <Text
                style={[
                  styles.segmentText,
                  activeTab === 'geladeira' && styles.segmentTextActive,
                ]}
              >
                Na Geladeira
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentButton, activeTab === 'inspiracao' && styles.segmentButtonActive]}
              onPress={() => handleTabSwitch('inspiracao')}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="celebration"
                size={16}
                color={activeTab === 'inspiracao' ? Colors.textInverse : Colors.textSubtle}
              />
              <Text
                style={[
                  styles.segmentText,
                  activeTab === 'inspiracao' && styles.segmentTextActive,
                ]}
              >
                Inspiração
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.segmentButton}
              onPress={handleOpenSearch}
              activeOpacity={0.8}
            >
              <MaterialIcons name="search" size={16} color={Colors.textSubtle} />
              <Text style={styles.segmentText}>Prato Específico</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── NA GELADEIRA TAB ─────────────────────────────────────────── */}
        {activeTab === 'geladeira' && (
          <>
            {/* Search Box */}
            <View style={styles.searchCard}>
              <Text style={styles.sectionTitle}>Ingredientes disponíveis</Text>
              <Text style={styles.sectionSubtitle}>
                {profile.isPremium
                  ? 'Adicione quantos ingredientes quiser'
                  : `Até ${maxIngredients} ingredientes no plano gratuito`}
              </Text>

              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: frango, tomate, alho..."
                  placeholderTextColor={Colors.textSubtle}
                  value={ingredientInput}
                  onChangeText={setIngredientInput}
                  onSubmitEditing={addIngredient}
                  returnKeyType="done"
                  editable={ingredients.length < maxIngredients}
                />
                <TouchableOpacity
                  style={[
                    styles.addButton,
                    ingredients.length >= maxIngredients && styles.addButtonDisabled,
                  ]}
                  onPress={addIngredient}
                  disabled={ingredients.length >= maxIngredients}
                >
                  <MaterialIcons name="add" size={22} color={Colors.textInverse} />
                </TouchableOpacity>
              </View>

              {!profile.isPremium && ingredients.length >= 3 && (
                <View style={styles.limitWarning}>
                  <MaterialIcons name="info" size={14} color={Colors.primary} />
                  <Text style={styles.limitWarningText}>
                    Limite do plano gratuito atingido. Faça upgrade para adicionar mais!
                  </Text>
                </View>
              )}

              {ingredients.length > 0 && (
                <View style={styles.chips}>
                  {ingredients.map(ing => (
                    <IngredientChip
                      key={ing}
                      label={ing}
                      onRemove={() => removeIngredient(ing)}
                    />
                  ))}
                </View>
              )}
            </View>

            {/* Filters */}
            <View style={styles.filtersSection}>
              <Text style={styles.filterLabel}>Dieta</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                <View style={styles.filterRow}>
                  {DIET_OPTIONS.map(opt => (
                    <TouchableOpacity
                      key={opt.value}
                      style={[
                        styles.filterChip,
                        selectedDiet === opt.value && styles.filterChipActive,
                      ]}
                      onPress={() => setSelectedDiet(opt.value)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedDiet === opt.value && styles.filterChipTextActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <Text style={[styles.filterLabel, { marginTop: Spacing.md }]}>Tipo de receita</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                <View style={styles.filterRow}>
                  {MEAL_OPTIONS.map(opt => (
                    <TouchableOpacity
                      key={opt.value}
                      style={[
                        styles.filterChip,
                        selectedMealType === opt.value && styles.filterChipActive,
                      ]}
                      onPress={() => setSelectedMealType(opt.value)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedMealType === opt.value && styles.filterChipTextActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Generate Button */}
            <TouchableOpacity
              style={[styles.generateButton, isLoading && styles.generateButtonLoading]}
              onPress={handleSearch}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator size="small" color={Colors.textInverse} />
                  <Text style={styles.generateButtonText}>Gerando receitas...</Text>
                </>
              ) : (
                <>
                  <MaterialIcons name="auto-awesome" size={20} color={Colors.textInverse} />
                  <Text style={styles.generateButtonText}>
                    {ingredients.length > 0 ? 'Gerar Receitas' : 'Ver Todas as Receitas'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Results */}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>OkCheff está criando suas receitas... 🧑‍🍳</Text>
              </View>
            )}

            {!isLoading && hasSearched && (
              <View style={styles.resultsSection}>
                <View style={styles.resultsHeader}>
                  <Text style={styles.resultsTitle}>
                    {recipes.length > 0
                      ? `${recipes.length} receitas encontradas`
                      : 'Nenhuma receita encontrada'}
                  </Text>
                  {ingredients.length > 0 && (
                    <Text style={styles.resultsMeta}>Com: {ingredients.join(', ')}</Text>
                  )}
                </View>
                {recipes.map(recipe => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onPress={() => router.push(`/recipe/${recipe.id}`)}
                  />
                ))}
              </View>
            )}
          </>
        )}

        {/* ── INSPIRAÇÃO TAB ───────────────────────────────────────────── */}
        {activeTab === 'inspiracao' && (
          <>
            {/* Occasion selector */}
            <View style={styles.searchCard}>
              <Text style={styles.sectionTitle}>Vibe / Ocasião Especial</Text>
              <Text style={styles.sectionSubtitle}>
                Selecione a data e o OkCheff cria o menu perfeito para você
              </Text>
              <View style={styles.occasionGrid}>
                {EVENT_OCCASIONS.map(occ => {
                  const isSelected = selectedOccasion === occ.value;
                  return (
                    <TouchableOpacity
                      key={occ.value}
                      style={[styles.occasionCard, isSelected && styles.occasionCardActive]}
                      onPress={() => setSelectedOccasion(occ.value)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.occasionEmoji}>{occ.emoji}</Text>
                      <Text
                        style={[
                          styles.occasionLabel,
                          isSelected && styles.occasionLabelActive,
                        ]}
                        numberOfLines={2}
                      >
                        {occ.label}
                      </Text>
                      {isSelected && (
                        <View style={styles.occasionCheck}>
                          <MaterialIcons name="check-circle" size={16} color={Colors.primary} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Diet filter for Inspiração */}
              <Text style={[styles.filterLabel, { marginTop: Spacing.md }]}>Restrição alimentar</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                <View style={styles.filterRow}>
                  {DIET_OPTIONS.map(opt => (
                    <TouchableOpacity
                      key={opt.value}
                      style={[
                        styles.filterChip,
                        selectedDiet === opt.value && styles.filterChipActive,
                      ]}
                      onPress={() => setSelectedDiet(opt.value)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedDiet === opt.value && styles.filterChipTextActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Sugerir Menu CTA */}
            <TouchableOpacity
              style={[
                styles.generateButton,
                styles.inspirationButton,
                (!selectedOccasion || isLoading) && styles.generateButtonLoading,
              ]}
              onPress={handleInspirationSearch}
              disabled={!selectedOccasion || isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator size="small" color={Colors.text} />
                  <Text style={[styles.generateButtonText, { color: Colors.text }]}>
                    OkCheff preparando menu exclusivo...
                  </Text>
                </>
              ) : (
                <>
                  <MaterialIcons name="celebration" size={20} color={Colors.text} />
                  <Text style={[styles.generateButtonText, { color: Colors.text }]}>
                    {selectedOccasion ? 'Sugerir Menu Exclusivo' : 'Selecione uma ocasião'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Loading */}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>
                  OkCheff criando o menu perfeito para sua ocasião... ✨
                </Text>
              </View>
            )}

            {/* Inspiration Results */}
            {!isLoading && hasSearched && (
              <View style={styles.resultsSection}>
                <View style={styles.inspirationResultsHeader}>
                  <MaterialIcons name="restaurant-menu" size={20} color={Colors.premium} />
                  <Text style={styles.resultsTitle}>
                    {inspirationRecipes.length > 0
                      ? `Menu Gourmet — ${inspirationRecipes.length} pratos`
                      : 'Nenhuma sugestão disponível'}
                  </Text>
                </View>
                {inspirationRecipes.length > 0 && (
                  <Text style={styles.inspirationNote}>
                    🛒 Lista de compras inclusa · Receitas elaboradas para impressionar
                  </Text>
                )}
                {inspirationRecipes.map(recipe => (
                  <EventRecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onStartCooking={() => router.push(`/recipe/${recipe.id}`)}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: 0,
  },
  heroContainer: {
    height: 200,
    position: 'relative',
    overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(44, 24, 16, 0.55)',
  },
  heroSearchBtn: {
    position: 'absolute',
    top: 12,
    right: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: Radius.full,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  heroSearchText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textInverse,
  },
  heroContent: {
    position: 'absolute',
    bottom: 24,
    left: Spacing.base,
    right: Spacing.base,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 4,
  },
  brandBadge: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  brandBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.extrabold,
    color: Colors.textInverse,
    letterSpacing: 0.5,
  },
  premiumIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.premium,
    borderRadius: Radius.full,
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 4,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  premiumIndicatorText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  greeting: {
    fontSize: Typography.sizes.sm,
    color: 'rgba(255,248,240,0.85)',
    fontWeight: Typography.weights.medium,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.extrabold,
    color: Colors.textInverse,
    lineHeight: 32,
  },
  // ── Segmented Control ──────────────────────────────────────────────────────
  segmentedWrapper: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xs,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceDark,
    borderRadius: Radius.lg,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  segmentButtonActive: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  segmentText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSubtle,
  },
  segmentTextActive: {
    color: Colors.textInverse,
    fontWeight: Typography.weights.bold,
  },
  // ── Shared ─────────────────────────────────────────────────────────────────
  searchCard: {
    backgroundColor: Colors.surface,
    margin: Spacing.base,
    marginBottom: 0,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    ...Shadows.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSubtle,
    marginBottom: Spacing.md,
  },
  // ── Occasion Selector ──────────────────────────────────────────────────────
  occasionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  occasionCard: {
    width: '47%',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'flex-start',
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    gap: 4,
    position: 'relative',
    ...Shadows.sm,
  },
  occasionCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08',
  },
  occasionEmoji: {
    fontSize: 28,
    marginBottom: 2,
  },
  occasionLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    lineHeight: 18,
  },
  occasionLabelActive: {
    color: Colors.primary,
  },
  occasionCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  // ── Geladeira Styles ───────────────────────────────────────────────────────
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    fontSize: Typography.sizes.base,
    color: Colors.text,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: Colors.border,
  },
  limitWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    backgroundColor: Colors.primary + '15',
    borderRadius: Radius.sm,
    padding: Spacing.sm,
  },
  limitWarningText: {
    flex: 1,
    fontSize: Typography.sizes.xs,
    color: Colors.primaryDark,
    lineHeight: 16,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  filtersSection: {
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
  },
  filterLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingRight: Spacing.base,
  },
  filterChip: {
    height: 36,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.textInverse,
    fontWeight: Typography.weights.semibold,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    marginBottom: Spacing.xl,
    height: 56,
    ...Shadows.lg,
  },
  inspirationButton: {
    backgroundColor: Colors.premium,
  },
  generateButtonLoading: {
    opacity: 0.65,
  },
  generateButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textInverse,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  loadingText: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  resultsSection: {
    paddingHorizontal: Spacing.base,
  },
  resultsHeader: {
    marginBottom: Spacing.base,
  },
  inspirationResultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  resultsTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  resultsMeta: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSubtle,
    marginTop: 2,
  },
  inspirationNote: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSubtle,
    marginBottom: Spacing.base,
    lineHeight: 20,
  },
});
