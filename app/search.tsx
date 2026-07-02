import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Animated,
  Platform,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { useApp } from '../hooks/useApp';
import { generateRecipes } from '../services/recipeService';
import { Recipe, DietType } from '../constants/data';
import { RecipeCard } from '../components';
import {
  getSearchHistory,
  addSearchHistory,
  removeSearchHistoryItem,
  clearSearchHistory,
  formatRelativeTime,
  SearchHistoryItem,
} from '../services/searchService';

// ── Filter types ────────────────────────────────────────────────────────────

type TimeRange = '0-15' | '15-30' | '30+' | 'todas';
type DifficultyFilter = 'facil' | 'medio' | 'dificil' | 'todas';

const TIME_RANGE_OPTIONS: Array<{ value: TimeRange; label: string; icon: string; desc: string }> = [
  { value: 'todas', label: 'Qualquer tempo', icon: 'schedule', desc: 'Sem filtro de tempo' },
  { value: '0-15', label: 'Até 15 min', icon: 'flash-on', desc: 'Super rápido' },
  { value: '15-30', label: '15 – 30 min', icon: 'timer', desc: 'Moderado' },
  { value: '30+', label: '30+ min', icon: 'hourglass-bottom', desc: 'Com cuidado' },
];

const DIFFICULTY_OPTIONS: Array<{ value: DifficultyFilter; label: string; color: string }> = [
  { value: 'todas', label: 'Qualquer', color: Colors.textSubtle },
  { value: 'facil', label: 'Fácil', color: Colors.success },
  { value: 'medio', label: 'Médio', color: Colors.warning },
  { value: 'dificil', label: 'Difícil', color: Colors.error },
];

const DIET_OPTIONS: Array<{ value: DietType | 'todas'; label: string; emoji: string }> = [
  { value: 'todas', label: 'Todas', emoji: '🍽️' },
  { value: 'tradicional', label: 'Tradicional', emoji: '🍗' },
  { value: 'vegetariana', label: 'Vegetariana', emoji: '🥦' },
  { value: 'vegana', label: 'Vegana', emoji: '🌱' },
];

// ── Helper ───────────────────────────────────────────────────────────────────

function filterByTime(recipe: Recipe, timeRange: TimeRange): boolean {
  if (timeRange === 'todas') return true;
  if (timeRange === '0-15') return recipe.time <= 15;
  if (timeRange === '15-30') return recipe.time > 15 && recipe.time <= 30;
  return recipe.time > 30;
}

function filterByDifficulty(recipe: Recipe, difficulty: DifficultyFilter): boolean {
  if (difficulty === 'todas') return true;
  return recipe.difficulty === difficulty;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile } = useApp();
  const inputRef = useRef<TextInput>(null);

  // Search state
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Filters
  const [timeRange, setTimeRange] = useState<TimeRange>('todas');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('todas');
  const [diet, setDiet] = useState<DietType | 'todas'>('todas');
  const [showFilters, setShowFilters] = useState(true);

  // Results
  const [allResults, setAllResults] = useState<Recipe[]>([]);
  const [displayResults, setDisplayResults] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // History
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Animation
  const filterAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadHistory();
  }, []);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (timeRange !== 'todas') count++;
    if (difficulty !== 'todas') count++;
    if (diet !== 'todas') count++;
    setActiveFiltersCount(count);
  }, [timeRange, difficulty, diet]);

  // Re-filter when local filters change (without re-fetching)
  useEffect(() => {
    if (allResults.length > 0) {
      applyLocalFilters(allResults);
    }
  }, [timeRange, difficulty]);

  const loadHistory = async () => {
    const h = await getSearchHistory();
    setHistory(h);
  };

  const applyLocalFilters = (recipes: Recipe[]) => {
    let filtered = recipes.filter(r => filterByTime(r, timeRange) && filterByDifficulty(r, difficulty));
    setDisplayResults(filtered);
  };

  const handleSearch = useCallback(async (overrideQuery?: string) => {
    const searchQuery = (overrideQuery ?? query).trim();
    setIsLoading(true);
    setHasSearched(true);

    try {
      const results = await generateRecipes({
        ingredients: [],
        dishName: searchQuery || undefined,
        diet,
        mealType: 'todas',
        isPremium: profile.isPremium,
      });

      setAllResults(results);

      const filtered = results.filter(
        r => filterByTime(r, timeRange) && filterByDifficulty(r, difficulty)
      );
      setDisplayResults(filtered);

      // Save to history
      const historyEntry = {
        query: searchQuery || 'Todas as receitas',
        filters: { timeRange, difficulty, diet },
        resultsCount: results.length,
      };
      await addSearchHistory(historyEntry);
      await loadHistory();
      setShowFilters(false);
      Animated.spring(filterAnim, { toValue: 0, useNativeDriver: false, tension: 80, friction: 10 }).start();
    } catch {
      setAllResults([]);
      setDisplayResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, diet, timeRange, difficulty, profile.isPremium]);

  const handleHistoryPress = (item: SearchHistoryItem) => {
    setQuery(item.query === 'Todas as receitas' ? '' : item.query);
    setTimeRange(item.filters.timeRange ?? 'todas');
    setDifficulty(item.filters.difficulty ?? 'todas');
    setDiet((item.filters.diet as DietType | 'todas') ?? 'todas');
    handleSearch(item.query === 'Todas as receitas' ? '' : item.query);
  };

  const handleRemoveHistory = async (id: string) => {
    await removeSearchHistoryItem(id);
    await loadHistory();
  };

  const handleClearAll = async () => {
    await clearSearchHistory();
    setHistory([]);
    setShowClearConfirm(false);
  };

  const toggleFilters = () => {
    const toValue = showFilters ? 0 : 1;
    setShowFilters(!showFilters);
    Animated.spring(filterAnim, {
      toValue,
      useNativeDriver: false,
      tension: 80,
      friction: 10,
    }).start();
  };

  const resetFilters = () => {
    setTimeRange('todas');
    setDifficulty('todas');
    setDiet('todas');
  };

  const showHistory = !hasSearched && history.length > 0 && !isLoading;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        {/* Search Input */}
        <View style={[styles.searchBox, isFocused && styles.searchBoxFocused]}>
          <MaterialIcons name="search" size={20} color={Colors.textSubtle} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Buscar pelo nome do prato..."
            placeholderTextColor={Colors.textSubtle}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setQuery('');
                setHasSearched(false);
                setAllResults([]);
                setDisplayResults([]);
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialIcons name="close" size={18} color={Colors.textSubtle} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.filterToggleBtn, activeFiltersCount > 0 && styles.filterToggleBtnActive]}
          onPress={toggleFilters}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name="tune"
            size={20}
            color={activeFiltersCount > 0 ? Colors.textInverse : Colors.primary}
          />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          {/* Time Range */}
          <View style={styles.filterGroup}>
            <View style={styles.filterGroupHeader}>
              <MaterialIcons name="schedule" size={14} color={Colors.textSubtle} />
              <Text style={styles.filterGroupTitle}>Tempo de preparo</Text>
            </View>
            <View style={styles.timeRangeRow}>
              {TIME_RANGE_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.timeRangeCard,
                    timeRange === opt.value && styles.timeRangeCardActive,
                  ]}
                  onPress={() => setTimeRange(opt.value)}
                  activeOpacity={0.75}
                >
                  <MaterialIcons
                    name={opt.icon as any}
                    size={18}
                    color={timeRange === opt.value ? Colors.textInverse : Colors.primary}
                  />
                  <Text
                    style={[
                      styles.timeRangeLabel,
                      timeRange === opt.value && styles.timeRangeLabelActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  <Text
                    style={[
                      styles.timeRangeDesc,
                      timeRange === opt.value && styles.timeRangeDescActive,
                    ]}
                  >
                    {opt.desc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Difficulty + Diet in row */}
          <View style={styles.filterRowDouble}>
            {/* Difficulty */}
            <View style={[styles.filterGroup, { flex: 1 }]}>
              <View style={styles.filterGroupHeader}>
                <MaterialIcons name="signal-cellular-alt" size={14} color={Colors.textSubtle} />
                <Text style={styles.filterGroupTitle}>Dificuldade</Text>
              </View>
              <View style={styles.difficultyRow}>
                {DIFFICULTY_OPTIONS.map(opt => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.difficultyChip,
                      difficulty === opt.value && {
                        backgroundColor: opt.color,
                        borderColor: opt.color,
                      },
                    ]}
                    onPress={() => setDifficulty(opt.value)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.difficultyChipText,
                        difficulty === opt.value && styles.difficultyChipTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Diet */}
          <View style={styles.filterGroup}>
            <View style={styles.filterGroupHeader}>
              <MaterialIcons name="eco" size={14} color={Colors.textSubtle} />
              <Text style={styles.filterGroupTitle}>Dieta</Text>
            </View>
            <View style={styles.dietRow}>
              {DIET_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.dietChip, diet === opt.value && styles.dietChipActive]}
                  onPress={() => setDiet(opt.value)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.dietEmoji}>{opt.emoji}</Text>
                  <Text
                    style={[
                      styles.dietChipText,
                      diet === opt.value && styles.dietChipTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Filter actions */}
          <View style={styles.filterActions}>
            {activeFiltersCount > 0 && (
              <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                <MaterialIcons name="refresh" size={16} color={Colors.primary} />
                <Text style={styles.resetButtonText}>Limpar filtros</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => handleSearch()}
              activeOpacity={0.85}
            >
              <MaterialIcons name="search" size={18} color={Colors.textInverse} />
              <Text style={styles.searchButtonText}>Buscar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Results count bar */}
      {hasSearched && !isLoading && (
        <View style={styles.resultsBar}>
          <Text style={styles.resultsBarText}>
            {displayResults.length === 0
              ? 'Nenhuma receita encontrada'
              : `${displayResults.length} receita${displayResults.length !== 1 ? 's' : ''} encontrada${displayResults.length !== 1 ? 's' : ''}`}
            {allResults.length !== displayResults.length && allResults.length > 0
              ? ` (de ${allResults.length})`
              : ''}
          </Text>
          {activeFiltersCount > 0 && (
            <TouchableOpacity onPress={resetFilters} style={styles.clearFiltersInline}>
              <Text style={styles.clearFiltersInlineText}>Limpar filtros</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Loading */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>OkCheff buscando receitas...</Text>
        </View>
      )}

      {/* Search History */}
      {showHistory && !isLoading && (
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <View style={styles.historyTitleRow}>
              <MaterialIcons name="history" size={18} color={Colors.textSubtle} />
              <Text style={styles.historyTitle}>Buscas recentes</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowClearConfirm(true)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.clearAllText}>Limpar tudo</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={history}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.historyItem}
                onPress={() => handleHistoryPress(item)}
                activeOpacity={0.75}
              >
                <View style={styles.historyItemLeft}>
                  <MaterialIcons name="history" size={18} color={Colors.textSubtle} />
                  <View style={styles.historyItemContent}>
                    <Text style={styles.historyQuery} numberOfLines={1}>
                      {item.query}
                    </Text>
                    <View style={styles.historyMeta}>
                      {item.filters.timeRange && item.filters.timeRange !== 'todas' && (
                        <View style={styles.historyTag}>
                          <MaterialIcons name="schedule" size={10} color={Colors.textSubtle} />
                          <Text style={styles.historyTagText}>{item.filters.timeRange}min</Text>
                        </View>
                      )}
                      {item.filters.difficulty && item.filters.difficulty !== 'todas' && (
                        <View style={styles.historyTag}>
                          <Text style={styles.historyTagText}>{item.filters.difficulty}</Text>
                        </View>
                      )}
                      {item.filters.diet && item.filters.diet !== 'todas' && (
                        <View style={styles.historyTag}>
                          <Text style={styles.historyTagText}>{item.filters.diet}</Text>
                        </View>
                      )}
                      <Text style={styles.historyTime}>{formatRelativeTime(item.timestamp)}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveHistory(item.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialIcons name="close" size={16} color={Colors.textSubtle} />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Empty state - first open */}
      {!hasSearched && !isLoading && history.length === 0 && (
        <View style={styles.emptyState}>
          <MaterialIcons name="search" size={56} color={Colors.border} />
          <Text style={styles.emptyTitle}>Busca Avançada</Text>
          <Text style={styles.emptySubtitle}>
            Filtre por tempo de preparo, dificuldade e dieta para encontrar a receita perfeita.
          </Text>
          <View style={styles.quickSuggestionsRow}>
            {['frango', 'macarrão', 'ovos', 'arroz'].map(s => (
              <TouchableOpacity
                key={s}
                style={styles.quickSuggestion}
                onPress={() => {
                  setQuery(s);
                  handleSearch(s);
                }}
              >
                <Text style={styles.quickSuggestionText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Results */}
      {!isLoading && hasSearched && (
        <ScrollView
          style={styles.resultsScroll}
          contentContainerStyle={styles.resultsContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {displayResults.length === 0 ? (
            <View style={styles.noResults}>
              <MaterialIcons name="no-food" size={48} color={Colors.border} />
              <Text style={styles.noResultsTitle}>Nenhuma receita encontrada</Text>
              <Text style={styles.noResultsSubtitle}>
                Tente remover alguns filtros ou use ingredientes diferentes.
              </Text>
              {activeFiltersCount > 0 && (
                <TouchableOpacity style={styles.resetFiltersBtn} onPress={resetFilters}>
                  <MaterialIcons name="refresh" size={16} color={Colors.textInverse} />
                  <Text style={styles.resetFiltersBtnText}>Remover filtros</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            displayResults.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onPress={() => router.push(`/recipe/${recipe.id}`)}
              />
            ))
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* Clear history confirm modal */}
      {Platform.OS === 'web' ? (
        <Modal visible={showClearConfirm} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Limpar histórico</Text>
              <Text style={styles.modalMessage}>
                Deseja remover todo o histórico de buscas?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setShowClearConfirm(false)}
                >
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalConfirm} onPress={handleClearAll}>
                  <Text style={styles.modalConfirmText}>Limpar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    height: 44,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  searchBoxFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceElevated,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.base,
    color: Colors.text,
    height: '100%',
  },
  filterToggleBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterToggleBtnActive: {
    backgroundColor: Colors.primary,
  },
  filterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.premium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: 9,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },

  // Filters Panel
  filtersPanel: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: Spacing.base,
  },
  filterGroup: {
    gap: Spacing.sm,
  },
  filterGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  filterGroupTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  // Time Range
  timeRangeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  timeRangeCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: 4,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    gap: 3,
    ...Shadows.sm,
  },
  timeRangeCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeRangeLabel: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    textAlign: 'center',
  },
  timeRangeLabelActive: {
    color: Colors.textInverse,
  },
  timeRangeDesc: {
    fontSize: 9,
    color: Colors.textSubtle,
    textAlign: 'center',
  },
  timeRangeDescActive: {
    color: 'rgba(255,255,255,0.75)',
  },

  // Difficulty
  filterRowDouble: {
    flexDirection: 'row',
    gap: Spacing.base,
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  difficultyChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceElevated,
  },
  difficultyChipText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  difficultyChipTextActive: {
    color: Colors.textInverse,
  },

  // Diet
  dietRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dietChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceElevated,
  },
  dietChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dietEmoji: {
    fontSize: 14,
  },
  dietChipText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  dietChipTextActive: {
    color: Colors.textInverse,
  },

  // Filter actions
  filterActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: Spacing.xs,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  resetButtonText: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    ...Shadows.sm,
  },
  searchButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textInverse,
  },

  // Results bar
  resultsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surfaceDark,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  resultsBarText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  clearFiltersInline: {
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
  },
  clearFiltersInlineText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xxl,
  },
  loadingText: {
    fontSize: Typography.sizes.base,
    color: Colors.textSubtle,
    fontStyle: 'italic',
  },

  // History
  historySection: {
    flex: 1,
    paddingTop: Spacing.base,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  historyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  historyTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  clearAllText: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  historyItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginRight: Spacing.sm,
  },
  historyItemContent: {
    flex: 1,
    gap: 4,
  },
  historyQuery: {
    fontSize: Typography.sizes.base,
    color: Colors.text,
    fontWeight: Typography.weights.medium,
  },
  historyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  historyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.surfaceDark,
    borderRadius: Radius.full,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  historyTagText: {
    fontSize: 10,
    color: Colors.textSubtle,
    fontWeight: Typography.weights.medium,
  },
  historyTime: {
    fontSize: 10,
    color: Colors.textSubtle,
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingBottom: 60,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.textSubtle,
    textAlign: 'center',
    lineHeight: 24,
  },
  quickSuggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  quickSuggestion: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickSuggestionText: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },

  // Results scroll
  resultsScroll: {
    flex: 1,
  },
  resultsContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  noResultsTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    textAlign: 'center',
  },
  noResultsSubtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.textSubtle,
    textAlign: 'center',
    lineHeight: 24,
  },
  resetFiltersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.sm,
  },
  resetFiltersBtnText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textInverse,
  },

  // Modal (web)
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
  modalCancel: {
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
  modalConfirm: {
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
