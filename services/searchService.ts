import AsyncStorage from '@react-native-async-storage/async-storage';

const SEARCH_HISTORY_KEY = '@okcheff_search_history';
const MAX_HISTORY = 20;

export interface SearchHistoryItem {
  id: string;
  query: string;
  filters: {
    timeRange?: '0-15' | '15-30' | '30+' | 'todas';
    difficulty?: 'facil' | 'medio' | 'dificil' | 'todas';
    diet?: string;
  };
  timestamp: string;
  resultsCount?: number;
}

export async function getSearchHistory(): Promise<SearchHistoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SearchHistoryItem[];
  } catch {
    return [];
  }
}

export async function addSearchHistory(item: Omit<SearchHistoryItem, 'id' | 'timestamp'>): Promise<void> {
  try {
    const history = await getSearchHistory();

    // Remove duplicate queries (same query + same filters)
    const filtered = history.filter(
      h =>
        h.query !== item.query ||
        h.filters.timeRange !== item.filters.timeRange ||
        h.filters.difficulty !== item.filters.difficulty ||
        h.filters.diet !== item.filters.diet
    );

    const newItem: SearchHistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY);
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // silent
  }
}

export async function removeSearchHistoryItem(id: string): Promise<void> {
  try {
    const history = await getSearchHistory();
    const updated = history.filter(h => h.id !== id);
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // silent
  }
}

export async function clearSearchHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch {
    // silent
  }
}

export function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const diff = now - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'agora';
  if (minutes < 60) return `${minutes}min atrás`;
  if (hours < 24) return `${hours}h atrás`;
  if (days === 1) return 'ontem';
  return `${days} dias atrás`;
}
