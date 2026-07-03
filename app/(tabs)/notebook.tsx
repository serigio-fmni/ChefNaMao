import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/theme';
import { useApp } from '../../hooks/useApp';
import { DISH_TYPE_LABELS, DISH_TYPE_ICONS, EVENT_OCCASION_LABELS } from '../../constants/data';
import { useStrings } from '../../constants/i18n';

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

type NotebookTab = 'ideias' | 'receitas' | 'eventos';

export default function NotebookScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { savedRecipes, removeRecipe, eventRecipes, removeEventRecipe, profile } = useApp();
  const s = useStrings();
  const [activeTab, setActiveTab] = useState<NotebookTab>('ideias');
  const [alertState, setAlertState] = useState<{
    visible: boolean;
    id: string;
    name: string;
    isEvent: boolean;
  }>({
    visible: false,
    id: '',
    name: '',
    isEvent: false,
  });

  const confirmDelete = (id: string, name: string, isEvent = false) => {
    if (Platform.OS === 'web') {
      setAlertState({ visible: true, id, name, isEvent });
    } else {
      Alert.alert(
        s.deleteRecipe,
        s.deleteRecipeConfirm.replace('{name}', name),
        [
          { text: s.cancel, style: 'cancel' },
          { text: s.remove, style: 'destructive', onPress: () => (isEvent ? removeEventRecipe(id) : removeRecipe(id)) },
        ]
      );
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const currentList = activeTab === 'ideias' ? savedRecipes.filter((r: any) => !r.isUnlocked) : activeTab === 'receitas' ? savedRecipes.filter((r: any) => r.isUnlocked) : eventRecipes;
  const isEmpty = currentList.length === 0;
  const atLimit = !profile.isPremium && savedRecipes.length >= 5 && activeTab === 'ideias';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{s.notebookTitle}</Text>
          <Text style={styles.headerSubtitle}>
            {activeTab === 'receitas'
            ? `${savedRecipes.length} ${savedRecipes.length === 1 ? s.notebookRecipeSaved : s.notebookRecipesSaved}${!profile.isPremium ? ` · ${s.notebookLimit}` : ''}`
            : `${eventRecipes.length} ${eventRecipes.length === 1 ? s.notebookEventSaved : s.notebookEventsSaved}`}
          </Text>
        </View>
        <View style={styles.headerBadge}>
          <MaterialIcons name="menu-book" size={20} color={Colors.primary} />
        </View>
      </View>

      {/* Category tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ideias' && styles.tabActive]}
          onPress={() => setActiveTab('ideias')}
        >
          <MaterialIcons
            name="bookmark-border"
            size={16}
            color={activeTab === 'ideias' ? Colors.primary : Colors.textSubtle}
          />
          <Text style={[styles.tabText, activeTab === 'ideias' && styles.tabTextActive]}>{s.notebookTabIdeas}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'receitas' && styles.tabActive]}
          onPress={() => setActiveTab('receitas')}
        >
          <MaterialIcons
            name="menu-book"
            size={16}
            color={activeTab === 'receitas' ? Colors.primary : Colors.textSubtle}
          />
          <Text style={[styles.tabText, activeTab === 'receitas' && styles.tabTextActive]}>{s.notebookTabRecipes}</Text>
          {savedRecipes.filter((r: any) => r.isUnlocked).length > 0 && (
            <View style={[styles.tabBadge, activeTab === 'receitas' && styles.tabBadgeActive]}>
              <Text style={[styles.tabBadgeText, activeTab === 'receitas' && styles.tabBadgeTextActive]}>
                {savedRecipes.filter((r: any) => r.isUnlocked).length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'eventos' && styles.tabActive]}
          onPress={() => setActiveTab('eventos')}
        >
          <MaterialIcons
            name="celebration"
            size={16}
            color={activeTab === 'eventos' ? Colors.premium : Colors.textSubtle}
          />
          <Text style={[styles.tabText, activeTab === 'eventos' && styles.tabTextActive, activeTab === 'eventos' && { color: Colors.premium }]}>{s.notebookTabEvents}</Text>
          {eventRecipes.length > 0 && (
            <View
              style={[
                styles.tabBadge,
                activeTab === 'eventos' && { backgroundColor: Colors.premium },
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  activeTab === 'eventos' && styles.tabBadgeTextActive,
                ]}
              >
                {eventRecipes.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Limit warning */}
      {atLimit && (
        <View style={styles.limitBanner}>
          <MaterialIcons name="info-outline" size={16} color={Colors.primaryDark} />
          <Text style={styles.limitText}>{s.notebookLimitBanner}</Text>
        </View>
      )}

      {isEmpty ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require('../../assets/images/empty-notebook.png')}
            style={styles.emptyImage}
            contentFit="contain"
            transition={300}
          />
          <Text style={styles.emptyTitle}>{activeTab === 'receitas' ? s.notebookEmptyTitle : s.notebookEmptyEventsTitle}</Text>
          <Text style={styles.emptySubtitle}>{activeTab === 'receitas' ? s.notebookEmptySubtitle : s.notebookEmptyEventsSubtitle}</Text>
          <TouchableOpacity
            style={styles.discoverButton}
            onPress={() => router.push('/')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name={activeTab === 'receitas' ? 'search' : 'celebration'}
              size={18}
              color={Colors.textInverse}
            />
            <Text style={styles.discoverButtonText}>{activeTab === 'receitas' ? s.notebookDiscoverBtn : s.notebookCreateMenuBtn}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {currentList.map(recipe => (
            <TouchableOpacity
              key={recipe.id}
              style={[styles.recipeRow, recipe.isEvent && styles.eventRow]}
              onPress={() => router.push(`/recipe/${recipe.id}`)}
              activeOpacity={0.85}
            >
              <Image
                source={{ uri: recipe.image }}
                style={styles.recipeThumb}
                contentFit="cover"
                transition={200}
              />
              {recipe.isEvent && (
                <View style={styles.eventThumbBadge}>
                  <MaterialIcons name="celebration" size={10} color={Colors.text} />
                </View>
              )}
              <View style={styles.recipeInfo}>
                <View style={styles.recipeTopRow}>
                  {recipe.isEvent && recipe.occasion ? (
                    <View style={styles.eventBadge}>
                      <Text style={styles.eventBadgeText}>
                        {EVENT_OCCASION_LABELS[recipe.occasion]}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.dishTypeBadge}>
                      <MaterialIcons
                        name={DISH_TYPE_ICONS[recipe.dishType] as any}
                        size={10}
                        color={Colors.primary}
                      />
                      <Text style={styles.dishTypeText}>
                        {DISH_TYPE_LABELS[recipe.dishType]}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.savedDate}>{formatDate(recipe.savedAt)}</Text>
                </View>
                <Text style={styles.recipeName} numberOfLines={2}>
                  {recipe.name}
                </Text>
                <View style={styles.recipeMeta}>
                  <MaterialIcons name="schedule" size={12} color={Colors.textSubtle} />
                  <Text style={styles.recipeMetaText}>{recipe.time}min</Text>
                  {recipe.shoppingList && recipe.shoppingList.length > 0 && (
                    <>
                      <MaterialIcons
                        name="shopping-cart"
                        size={12}
                        color={Colors.primary}
                        style={{ marginLeft: 4 }}
                      />
                      <Text style={[styles.recipeMetaText, { color: Colors.primary }]}>
                        Lista de Compras
                      </Text>
                    </>
                  )}
                  <View
                    style={[
                      styles.difficultyDot,
                      { backgroundColor: DIFFICULTY_COLORS[recipe.difficulty] },
                    ]}
                  />
                  <Text
                    style={[
                      styles.recipeMetaText,
                      { color: DIFFICULTY_COLORS[recipe.difficulty] },
                    ]}
                  >
                    {DIFFICULTY_LABELS[recipe.difficulty]}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmDelete(recipe.id, recipe.name, recipe.isEvent)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <MaterialIcons name="delete-outline" size={20} color={Colors.error} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          <View style={{ height: 20 }} />
        </ScrollView>
      )}

      {/* Web Alert Modal */}
      {Platform.OS === 'web' && (
        <Modal visible={alertState.visible} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>{s.deleteRecipe}</Text>
              <Text style={styles.modalMessage}>{s.deleteRecipeConfirm.replace('{name}', alertState.name)}</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalCancelButton} onPress={() => setAlertState(s2 => ({ ...s2, visible: false }))}>
                  <Text style={styles.modalCancelText}>{s.cancel}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalConfirmButton} onPress={() => { if (alertState.isEvent) { removeEventRecipe(alertState.id); } else { removeRecipe(alertState.id); } setAlertState(s2 => ({ ...s2, visible: false })); }}>
                  <Text style={styles.modalConfirmText}>{s.remove}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTitle: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSubtle,
    marginTop: 2,
  },
  headerBadge: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingBottom: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textSubtle,
  },
  tabTextActive: {
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  tabBadge: {
    backgroundColor: Colors.surfaceDark,
    borderRadius: Radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeActive: {
    backgroundColor: Colors.primary + '22',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Colors.textSubtle,
  },
  tabBadgeTextActive: {
    color: Colors.textInverse,
  },
  limitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary + '15',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  limitText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.primaryDark,
    lineHeight: 18,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingBottom: 60,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.textSubtle,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  discoverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  discoverButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textInverse,
  },
  recipeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  eventRow: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.premium,
  },
  recipeThumb: {
    width: 80,
    height: 80,
  },
  eventThumbBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    backgroundColor: Colors.premium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeInfo: {
    flex: 1,
    padding: Spacing.md,
    gap: 4,
  },
  recipeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dishTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.primary + '18',
    borderRadius: Radius.full,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  dishTypeText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  eventBadge: {
    backgroundColor: Colors.premium + '22',
    borderRadius: Radius.full,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.premium + '55',
  },
  eventBadgeText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  savedDate: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSubtle,
  },
  recipeName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    lineHeight: 20,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  recipeMetaText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSubtle,
    fontWeight: Typography.weights.medium,
  },
  difficultyDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  deleteButton: {
    padding: Spacing.md,
    alignSelf: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    minWidth: 300,
    maxWidth: 360,
    ...Shadows.lg,
  },
  modalTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  modalMessage: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    justifyContent: 'flex-end',
  },
  modalCancelButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceDark,
  },
  modalCancelText: {
    fontSize: Typography.sizes.base,
    color: Colors.text,
    fontWeight: Typography.weights.medium,
  },
  modalConfirmButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderRadius: Radius.md,
    backgroundColor: Colors.error,
  },
  modalConfirmText: {
    fontSize: Typography.sizes.base,
    color: Colors.textInverse,
    fontWeight: Typography.weights.semibold,
  },
});
