import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Recipe, EVENT_OCCASION_LABELS } from '../../constants/data';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/theme';
import { useApp } from '../../hooks/useApp';
import { cleanIngredient } from '../../lib/cleanIngredient';

interface EventRecipeCardProps {
  recipe: Recipe;
  onStartCooking?: () => void;
}

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

export function EventRecipeCard({ recipe: initialRecipe, onStartCooking }: EventRecipeCardProps) {
  const { isEventRecipeSaved, saveEventRecipe, saveRecipe, isRecipeSaved } = useApp();
  const [recipe] = useState(initialRecipe);
  const [unlocking, setUnlocking] = useState(false);

  const saved = isEventRecipeSaved(recipe.id) || isRecipeSaved(recipe.id);

  // Salva a ideia no Caderno (grátis, sem crédito)
  const handleSave = () => {
    if (saved) return;
    saveRecipe(recipe);
    Alert.alert('Salvo!', 'Receita salva no seu Caderno.');
  };

  // Desbloqueia e abre a receita (por enquanto todos têm acesso liberado)
  const handleWantThis = () => {
    setUnlocking(true);
    if (!saved) saveRecipe(recipe);
    setUnlocking(false);
    if (onStartCooking) onStartCooking();
  };

  const ingredientNames = (recipe.ingredients || [])
    .map(cleanIngredient)
    .filter(Boolean);

  return (
    <View style={styles.card}>
      {/* Hero image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.imageBadgesRow}>
          {recipe.occasion && (
            <View style={styles.occasionBadge}>
              <Text style={styles.occasionText}>
                {EVENT_OCCASION_LABELS[recipe.occasion]}
              </Text>
            </View>
          )}
          <View style={styles.gourmetBadge}>
            <MaterialIcons name="restaurant-menu" size={12} color={Colors.textInverse} />
            <Text style={styles.gourmetText}>Gourmet</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{recipe.name}</Text>
        <Text style={styles.description} numberOfLines={3}>{recipe.description}</Text>

        {/* Meta */}
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <MaterialIcons name="schedule" size={14} color={Colors.textSubtle} />
            <Text style={styles.metaText}>{recipe.time} min</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="people" size={14} color={Colors.textSubtle} />
            <Text style={styles.metaText}>{recipe.servings} porções</Text>
          </View>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: DIFFICULTY_COLORS[recipe.difficulty] + '22' },
            ]}
          >
            <Text
              style={[
                styles.difficultyText,
                { color: DIFFICULTY_COLORS[recipe.difficulty] },
              ]}
            >
              {DIFFICULTY_LABELS[recipe.difficulty]}
            </Text>
          </View>
        </View>

        {/* Ingredientes sem quantidade */}
        {ingredientNames.length > 0 && (
          <Text style={styles.ingredientsList}>
            {ingredientNames.join('  ·  ')}
          </Text>
        )}

        {/* Botões */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.btnSave}
            onPress={handleSave}
            disabled={saved}
            activeOpacity={0.85}
          >
            <MaterialIcons
              name={saved ? 'bookmark' : 'bookmark-border'}
              size={16}
              color={saved ? Colors.textSubtle : Colors.primary}
            />
            <Text style={[styles.btnSaveText, saved && { color: Colors.textSubtle }]}>
              {saved ? 'Salvo' : 'Salvar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnWant}
            onPress={handleWantThis}
            disabled={unlocking}
            activeOpacity={0.85}
          >
            <MaterialIcons name="bolt" size={16} color={Colors.textInverse} />
            <Text style={styles.btnWantText}>
              {unlocking ? 'Abrindo...' : 'Quero essa!'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.base,
    ...Shadows.md,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
  },
  imageBadgesRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  occasionBadge: {
    backgroundColor: Colors.premium,
    borderRadius: Radius.full,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  occasionText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  gourmetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(44,24,16,0.75)',
    borderRadius: Radius.full,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  gourmetText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textInverse,
  },
  content: {
    padding: Spacing.base,
    gap: Spacing.md,
  },
  name: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    lineHeight: Typography.sizes.lg * 1.3,
  },
  description: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSubtle,
    fontWeight: Typography.weights.medium,
  },
  difficultyBadge: {
    borderRadius: Radius.full,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginLeft: 'auto',
  },
  difficultyText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  ingredientsList: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSubtle,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  btnSave: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  btnSaveText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
  btnWant: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  btnWantText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textInverse,
  },
});
