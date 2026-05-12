import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Recipe, EVENT_OCCASION_LABELS } from '../../constants/data';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/theme';
import { useApp } from '../../hooks/useApp';
import { ShoppingChecklist } from './ShoppingChecklist';

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

export function EventRecipeCard({ recipe, onStartCooking }: EventRecipeCardProps) {
  const { isEventRecipeSaved, saveEventRecipe, removeEventRecipe } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [shoppingDone, setShoppingDone] = useState(false);

  const saved = isEventRecipeSaved(recipe.id);

  const handleSave = () => {
    if (saved) removeEventRecipe(recipe.id);
    else saveEventRecipe(recipe);
  };

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
        {/* Title row */}
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={2}>{recipe.name}</Text>
          <TouchableOpacity
            onPress={handleSave}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons
              name={saved ? 'bookmark' : 'bookmark-border'}
              size={24}
              color={saved ? Colors.primary : Colors.textSubtle}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.description} numberOfLines={2}>{recipe.description}</Text>

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

        {/* Shopping list toggle */}
        {recipe.shoppingList && recipe.shoppingList.length > 0 && (
          <>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setExpanded(e => !e)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="shopping-cart" size={16} color={Colors.primary} />
              <Text style={styles.toggleText}>
                {expanded ? 'Ocultar' : 'Ver'} Lista de Compras ({recipe.shoppingList.length} itens)
              </Text>
              <MaterialIcons
                name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={18}
                color={Colors.primary}
              />
            </TouchableOpacity>

            {expanded && (
              <ShoppingChecklist
                items={recipe.shoppingList}
                onAllChecked={() => setShoppingDone(true)}
              />
            )}
          </>
        )}

        {/* Iniciar Preparo CTA */}
        <TouchableOpacity
          style={[
            styles.startButton,
            !shoppingDone && recipe.shoppingList && recipe.shoppingList.length > 0
              ? styles.startButtonDisabled
              : styles.startButtonActive,
          ]}
          onPress={onStartCooking}
          disabled={
            !shoppingDone &&
            recipe.shoppingList !== undefined &&
            recipe.shoppingList.length > 0
          }
          activeOpacity={0.85}
        >
          <MaterialIcons
            name="play-circle-filled"
            size={20}
            color={
              !shoppingDone && recipe.shoppingList && recipe.shoppingList.length > 0
                ? Colors.textSubtle
                : Colors.textInverse
            }
          />
          <Text
            style={[
              styles.startButtonText,
              !shoppingDone && recipe.shoppingList && recipe.shoppingList.length > 0
                ? styles.startButtonTextDisabled
                : styles.startButtonTextActive,
            ]}
          >
            {!shoppingDone && recipe.shoppingList && recipe.shoppingList.length > 0
              ? 'Confira a lista de compras primeiro'
              : 'Iniciar Preparo com OkCheff'}
          </Text>
        </TouchableOpacity>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  name: {
    flex: 1,
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
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary + '12',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  toggleText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  startButtonActive: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  startButtonDisabled: {
    backgroundColor: Colors.surfaceDark,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  startButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
  startButtonTextActive: {
    color: Colors.textInverse,
  },
  startButtonTextDisabled: {
    color: Colors.textSubtle,
  },
});
