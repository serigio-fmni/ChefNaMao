import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Recipe } from '../../constants/data';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/theme';
import { useApp } from '../../hooks/useApp';
import { ShoppingChecklist } from './ShoppingChecklist';
import { substituteIngredients } from '../../services/recipeService';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
  compact?: boolean;
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

const DIET_LABELS: Record<string, string> = {
  tradicional: 'Tradicional',
  vegetariana: 'Vegetariana',
  vegana: 'Vegana',
};

const DIET_COLORS: Record<string, string> = {
  tradicional: '#8B4513',
  vegetariana: '#2E7D32',
  vegana: '#1B5E20',
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80';

export function RecipeCard({ recipe: initialRecipe, onPress, compact = false }: RecipeCardProps) {
  const { isRecipeSaved, saveRecipe, removeRecipe, profile } = useApp();
  const [recipe, setRecipe] = useState(initialRecipe);
  const saved = isRecipeSaved(recipe.id);
  const isLocked = recipe.isPremium && !profile.isPremium;
  const [expanded, setExpanded] = useState(false);
  const [substituting, setSubstituting] = useState(false);
  const [shoppingDone, setShoppingDone] = useState(false);
  const hasShoppingList = !!recipe.shoppingList && recipe.shoppingList.length > 0;

  const handleSubstitute = async (missingNames: string[]) => {
    setSubstituting(true);
    const result = await substituteIngredients(recipe, missingNames);
    setSubstituting(false);
    if (result) {
      setRecipe(result.recipe);
      Alert.alert('Receita ajustada', result.note || 'Os ingredientes foram trocados.');
    } else {
      Alert.alert('Ops', 'Não consegui trocar agora. Tente novamente.');
    }
  };

  const handleSave = (e: any) => {
    e.stopPropagation();
    if (isLocked) return;
    if (saved) removeRecipe(recipe.id);
    else saveRecipe(recipe);
  };

  const diet = Array.isArray(recipe.diet) ? recipe.diet[0] : recipe.diet;
  const imageUri = recipe.image && recipe.image.startsWith('http') ? recipe.image : FALLBACK_IMAGE;

  // Ingredientes sem quantidade (apenas nome)
  const ingredientNames = (recipe.ingredients || [])
    .slice(0, 5)
    .map((ing: string) => {
      const parts = ing.split(' ');
      return parts.length > 2 ? parts.slice(2).join(' ') : ing;
    });

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress} activeOpacity={0.8}>
        <Image
          source={{ uri: imageUri }}
          style={styles.compactImage}
          contentFit="cover"
          transition={200}
        />
        {isLocked && (
          <View style={styles.lockOverlay}>
            <MaterialIcons name="lock" size={20} color={Colors.textInverse} />
          </View>
        )}
        <View style={styles.compactContent}>
          <Text style={styles.compactName} numberOfLines={2}>{recipe.name}</Text>
          <View style={styles.compactMeta}>
            <MaterialIcons name="schedule" size={12} color={Colors.textSubtle} />
            <Text style={styles.metaText}>{recipe.time}min</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.card}>
      {/* Imagem */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        {isLocked && (
          <View style={styles.lockOverlayFull}>
            <View style={styles.lockBadge}>
              <MaterialIcons name="lock" size={14} color={Colors.premium} />
              <Text style={styles.lockText}>Premium</Text>
            </View>
          </View>
        )}
        {/* Badge de dieta */}
        {diet && DIET_LABELS[diet] && (
          <View style={[styles.dietBadge, { backgroundColor: DIET_COLORS[diet] + 'DD' }]}>
            <Text style={styles.dietText}>{DIET_LABELS[diet]}</Text>
          </View>
        )}
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        {/* Nome + Salvar */}
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>{recipe.name}</Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={isLocked}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons
              name={saved ? 'bookmark' : 'bookmark-border'}
              size={24}
              color={saved ? Colors.primary : Colors.textSubtle}
            />
          </TouchableOpacity>
        </View>

        {/* Descrição */}
        <Text style={styles.description} numberOfLines={2}>{recipe.description}</Text>

        {/* Meta: tempo, porções, dificuldade */}
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <MaterialIcons name="schedule" size={14} color={Colors.textSubtle} />
            <Text style={styles.metaText}>{recipe.time} min</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="people" size={14} color={Colors.textSubtle} />
            <Text style={styles.metaText}>{recipe.servings} porções</Text>
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: DIFFICULTY_COLORS[recipe.difficulty] + '22' }]}>
            <Text style={[styles.difficultyText, { color: DIFFICULTY_COLORS[recipe.difficulty] }]}>
              {DIFFICULTY_LABELS[recipe.difficulty]}
            </Text>
          </View>
        </View>

        {/* Ingredientes sem quantidade */}
        {ingredientNames.length > 0 && (
          <View style={styles.ingredientsSection}>
            <View style={styles.ingredientsHeader}>
              <MaterialIcons name="kitchen" size={13} color={Colors.textSubtle} />
              <Text style={styles.ingredientsLabel}>Ingredientes principais:</Text>
            </View>
            <Text style={styles.ingredientsList} numberOfLines={2}>
              {ingredientNames.join(' · ')}
              {recipe.ingredients.length > 5 ? ` +${recipe.ingredients.length - 5} mais` : ''}
            </Text>
          </View>
        )}

        {/* Lista de compras */}
        {recipe.shoppingList && recipe.shoppingList.length > 0 && (
          <>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={(e: any) => { e.stopPropagation(); setExpanded(v => !v); }}
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
                onSubstitute={handleSubstitute}
                substituting={substituting}
                onAllChecked={() => setShoppingDone(true)}
              />
            )}
          </>
        )}

        {/* Botão iniciar / ver receita completa — igual nas 3 abas */}
        <TouchableOpacity
          style={[
            styles.startButton,
            hasShoppingList && !shoppingDone ? styles.startButtonDisabled : styles.startButtonActive,
          ]}
          onPress={onPress}
          disabled={hasShoppingList && !shoppingDone}
          activeOpacity={0.85}
        >
          <MaterialIcons
            name={hasShoppingList && !shoppingDone ? 'lock-outline' : 'play-circle-filled'}
            size={18}
            color={hasShoppingList && !shoppingDone ? Colors.textSubtle : Colors.textInverse}
          />
          <Text
            style={[
              styles.startButtonText,
              hasShoppingList && !shoppingDone ? styles.startButtonTextDisabled : styles.startButtonTextActive,
            ]}
          >
            {hasShoppingList && !shoppingDone ? 'Confira a lista de compras primeiro' : 'Ver receita completa'}
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
    height: 180,
  },
  lockOverlayFull: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: Radius.full,
    paddingVertical: 6,
    paddingHorizontal: 14,
    gap: 6,
  },
  lockText: {
    color: Colors.premium,
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.sm,
  },
  dietBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    borderRadius: Radius.full,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  dietText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  content: {
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  header: {
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
    lineHeight: Typography.sizes.sm * 1.6,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.xs,
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
  ingredientsSection: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  ingredientsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ingredientsLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSubtle,
    fontWeight: Typography.weights.semibold,
  },
  ingredientsList: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
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
  unlockHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
    paddingTop: Spacing.xs,
  },
  unlockHintText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xs,
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
  // Compact styles
  compactCard: {
    width: 160,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  compactImage: {
    width: 160,
    height: 110,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 110,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactContent: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  compactName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    lineHeight: 18,
  },
});
