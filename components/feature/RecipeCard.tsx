import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Recipe } from '../../constants/data';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/theme';
import { useApp } from '../../hooks/useApp';
import { useStrings } from '../../constants/i18n';
import { unlockRecipe } from '../../services/recipeService';

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
  const s = useStrings();
  const [recipe, setRecipe] = useState(initialRecipe);
  const saved = isRecipeSaved(recipe.id);
  const [unlocking, setUnlocking] = useState(false);

  // Salva o card no Caderno como ideia (grátis, sem crédito)
  const handleSave = (e?: any) => {
    if (e) e.stopPropagation();
    if (saved) return;
    saveRecipe(recipe);
    Alert.alert('Salvo!', 'Receita salva no seu Caderno.');
  };

  // Desbloqueia a receita completa e abre no Caderno
  // Por enquanto todos têm acesso liberado (fase sem pacotes)
  const handleWantThis = async (e?: any) => {
    if (e) e.stopPropagation();
    setUnlocking(true);
    // Salva no caderno se ainda não estiver salvo
    if (!saved) saveRecipe(recipe);
    setUnlocking(false);
    // Abre a receita
    onPress();
  };

  const diet = Array.isArray(recipe.diet) ? recipe.diet[0] : recipe.diet;
  const imageUri = recipe.image && recipe.image.startsWith('http') ? recipe.image : FALLBACK_IMAGE;

  // Mostra até 4 ingredientes sem quantidade
  const ingredientNames = (recipe.ingredients || [])
    .slice(0, 4)
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
        {/* Nome */}
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>{recipe.name}</Text>
        </View>

        {/* Descrição */}
        <Text style={styles.description} numberOfLines={3}>{recipe.description}</Text>

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
            <Text style={styles.ingredientsList}>
              {ingredientNames.join('  ·  ')}
              {recipe.ingredients.length > 4 ? `  +${recipe.ingredients.length - 4}` : ''}
            </Text>
          </View>
        )}

        {/* Botões do card */}
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
    paddingVertical: Spacing.xs,
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
