import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/theme';
import { useApp } from '../../hooks/useApp';
import { getRecipeById } from '../../services/recipeService';
import { Recipe, DISH_TYPE_LABELS } from '../../constants/data';
import { PremiumBanner } from '../../components';

const DIFFICULTY_LABELS: Record<string, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
};
const DIFFICULTY_COLORS: Record<string, string> = {
  facil: Colors.success,
  medio: Colors.warning,
  dificil: Colors.error,
};

export default function RecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isRecipeSaved, saveRecipe, removeRecipe, profile } = useApp();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    if (id) {
      getRecipeById(id).then(found => setRecipe(found || null));
    }
  }, [id]);

  if (!recipe) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIcons name="restaurant" size={48} color={Colors.border} />
        <Text style={styles.loadingText}>Receita não encontrada</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const saved = isRecipeSaved(recipe.id);
  const isLocked = recipe.isPremium && !profile.isPremium;

  const toggleSave = () => {
    if (isLocked) return;
    if (saved) removeRecipe(recipe.id);
    else saveRecipe(recipe);
  };

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [140, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Floating back header */}
      <View style={[styles.floatingHeader, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.circleButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Animated.Text style={[styles.floatingTitle, { opacity: headerOpacity }]} numberOfLines={1}>
          {recipe.name}
        </Animated.Text>
        <TouchableOpacity style={styles.circleButton} onPress={toggleSave} disabled={isLocked}>
          <MaterialIcons
            name={saved ? 'bookmark' : 'bookmark-border'}
            size={22}
            color={saved ? Colors.primary : Colors.text}
          />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        {/* Hero Image */}
        <View style={styles.heroImageContainer}>
          <Image
            source={{ uri: recipe.image }}
            style={styles.heroImage}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.heroGradient} />
          {recipe.isPremium && (
            <View style={styles.heroPremiumBadge}>
              <MaterialIcons name="star" size={14} color={Colors.text} />
              <Text style={styles.heroPremiumText}>Premium</Text>
            </View>
          )}
        </View>

        <View style={styles.contentCard}>
          {/* Title & Meta */}
          <View style={styles.titleSection}>
            <View style={styles.dishTypePill}>
              <Text style={styles.dishTypeText}>{DISH_TYPE_LABELS[recipe.dishType]}</Text>
            </View>
            <Text style={styles.recipeName}>{recipe.name}</Text>
            <Text style={styles.recipeDescription}>{recipe.description}</Text>

            <View style={styles.metaGrid}>
              <View style={styles.metaBox}>
                <MaterialIcons name="schedule" size={20} color={Colors.primary} />
                <Text style={styles.metaValue}>{recipe.time} min</Text>
                <Text style={styles.metaLabel}>Tempo</Text>
              </View>
              <View style={styles.metaBox}>
                <MaterialIcons name="people" size={20} color={Colors.primary} />
                <Text style={styles.metaValue}>{recipe.servings}</Text>
                <Text style={styles.metaLabel}>Porções</Text>
              </View>
              <View style={styles.metaBox}>
                <MaterialIcons name="bar-chart" size={20} color={DIFFICULTY_COLORS[recipe.difficulty]} />
                <Text style={[styles.metaValue, { color: DIFFICULTY_COLORS[recipe.difficulty] }]}>
                  {DIFFICULTY_LABELS[recipe.difficulty]}
                </Text>
                <Text style={styles.metaLabel}>Dificuldade</Text>
              </View>
              {recipe.calories && (
                <View style={styles.metaBox}>
                  <MaterialIcons name="local-fire-department" size={20} color={Colors.secondary} />
                  <Text style={styles.metaValue}>{recipe.calories}</Text>
                  <Text style={styles.metaLabel}>Calorias</Text>
                </View>
              )}
            </View>
          </View>

          {/* Premium locked overlay */}
          {isLocked ? (
            <View style={styles.lockedSection}>
              <View style={styles.lockedIcon}>
                <MaterialIcons name="lock" size={32} color={Colors.premium} />
              </View>
              <Text style={styles.lockedTitle}>Receita Premium</Text>
              <Text style={styles.lockedDescription}>
                Esta receita completa está disponível apenas para assinantes Premium.
              </Text>
              <View style={{ marginTop: Spacing.base }}>
                <PremiumBanner feature="Acesso completo a todas as receitas Premium" />
              </View>
            </View>
          ) : (
            <>
              {/* Tab selector */}
              <View style={styles.tabs}>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'ingredients' && styles.tabActive]}
                  onPress={() => setActiveTab('ingredients')}
                >
                  <Text style={[styles.tabText, activeTab === 'ingredients' && styles.tabTextActive]}>
                    Ingredientes ({recipe.ingredients.length})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'steps' && styles.tabActive]}
                  onPress={() => setActiveTab('steps')}
                >
                  <Text style={[styles.tabText, activeTab === 'steps' && styles.tabTextActive]}>
                    Modo de Preparo
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Ingredients list */}
              {activeTab === 'ingredients' && (
                <View style={styles.listSection}>
                  {recipe.ingredients.map((ing, i) => (
                    <View key={i} style={styles.ingredientRow}>
                      <View style={styles.ingredientDot} />
                      <Text style={styles.ingredientText}>{ing}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Steps list */}
              {activeTab === 'steps' && (
                <View style={styles.listSection}>
                  {/* Premium voice reading banner */}
                  {profile.isPremium ? (
                    <TouchableOpacity style={styles.voiceReadButton} activeOpacity={0.8}>
                      <MaterialIcons name="volume-up" size={16} color={Colors.textInverse} />
                      <Text style={styles.voiceReadText}>Ouvir passos com OkCheff</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={{ marginBottom: Spacing.md }}>
                      <PremiumBanner feature="Leitura em voz alta dos passos da receita" />
                    </View>
                  )}

                  {recipe.steps.map((step, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[styles.stepRow, completedSteps.has(i) && styles.stepRowCompleted]}
                      onPress={() => toggleStep(i)}
                      activeOpacity={0.75}
                    >
                      <View
                        style={[
                          styles.stepNumber,
                          completedSteps.has(i) && styles.stepNumberCompleted,
                        ]}
                      >
                        {completedSteps.has(i) ? (
                          <MaterialIcons name="check" size={14} color={Colors.textInverse} />
                        ) : (
                          <Text style={styles.stepNumberText}>{i + 1}</Text>
                        )}
                      </View>
                      <Text
                        style={[
                          styles.stepText,
                          completedSteps.has(i) && styles.stepTextCompleted,
                        ]}
                      >
                        {step}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  {completedSteps.size === recipe.steps.length && (
                    <View style={styles.doneCard}>
                      <Text style={styles.doneEmoji}>🎉</Text>
                      <Text style={styles.doneText}>OkCheff diz: Bom apetite! 🎉</Text>
                    </View>
                  )}
                </View>
              )}
            </>
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.base,
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: Typography.sizes.lg,
    color: Colors.textSubtle,
  },
  backButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  backButtonText: {
    color: Colors.textInverse,
    fontWeight: Typography.weights.bold,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    zIndex: 100,
    gap: Spacing.md,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  floatingTitle: {
    flex: 1,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  heroImageContainer: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 280,
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: Colors.background,
    opacity: 0.7,
  },
  heroPremiumBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.premium,
    borderRadius: Radius.full,
    paddingVertical: 5,
    paddingHorizontal: 12,
    gap: 5,
    ...Shadows.sm,
  },
  heroPremiumText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  contentCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    marginTop: -30,
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.base,
    minHeight: 400,
    ...Shadows.lg,
  },
  titleSection: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  dishTypePill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '18',
    borderRadius: Radius.full,
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
  dishTypeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
  recipeName: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.extrabold,
    color: Colors.text,
    lineHeight: 34,
  },
  recipeDescription: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  metaBox: {
    flex: 1,
    minWidth: 70,
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  metaValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  metaLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSubtle,
  },
  lockedSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  lockedIcon: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.premium + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  lockedDescription: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: 4,
    marginBottom: Spacing.base,
  },
  tab: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
  },
  tabActive: {
    backgroundColor: Colors.surfaceElevated,
    ...Shadows.sm,
  },
  tabText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textSubtle,
  },
  tabTextActive: {
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  listSection: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  ingredientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    flexShrink: 0,
  },
  ingredientText: {
    fontSize: Typography.sizes.base,
    color: Colors.text,
    flex: 1,
    lineHeight: 22,
  },
  voiceReadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
  },
  voiceReadText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.textInverse,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md,
    padding: Spacing.base,
    ...Shadows.sm,
  },
  stepRowCompleted: {
    opacity: 0.6,
    backgroundColor: Colors.success + '15',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumberCompleted: {
    backgroundColor: Colors.success,
  },
  stepNumberText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textInverse,
  },
  stepText: {
    flex: 1,
    fontSize: Typography.sizes.base,
    color: Colors.text,
    lineHeight: 24,
  },
  stepTextCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textSubtle,
  },
  doneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.success + '18',
    borderRadius: Radius.md,
    padding: Spacing.base,
    marginTop: Spacing.sm,
  },
  doneEmoji: {
    fontSize: 28,
  },
  doneText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.success,
    flex: 1,
  },
});
