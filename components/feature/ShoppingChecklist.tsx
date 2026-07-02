import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ShoppingItem, SHOPPING_CATEGORY_LABELS } from '../../constants/data';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/theme';

interface ShoppingChecklistProps {
  items: ShoppingItem[];
  onAllChecked?: () => void;
  onSubstitute?: (missingItemNames: string[]) => void;
  substituting?: boolean;
}

export function ShoppingChecklist({ items, onAllChecked, onSubstitute, substituting }: ShoppingChecklistProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [missing, setMissing] = useState<Set<string>>(new Set());

  const toggleMissing = (id: string) => {
    setMissing(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const confirmSubstitution = () => {
    const names = items.filter(i => missing.has(i.id)).map(i => i.name);
    if (names.length > 0) {
      onSubstitute?.(names);
      setMissing(new Set());
    }
  };

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        if (next.size === items.length) {
          onAllChecked?.();
        }
      }
      return next;
    });
  };

  const allChecked = checked.size === items.length;
  const progress = items.length > 0 ? checked.size / items.length : 0;

  // Group items by category
  const grouped = items.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="shopping-cart" size={20} color={Colors.primary} />
          <Text style={styles.headerTitle}>Lista de Compras</Text>
        </View>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>{checked.size}/{items.length}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
      </View>

      {/* Grouped items */}
      {Object.entries(grouped).map(([cat, catItems]) => (
        <View key={cat} style={styles.group}>
          <Text style={styles.groupLabel}>
            {SHOPPING_CATEGORY_LABELS[cat as ShoppingItem['category']]}
          </Text>
          {catItems.map(item => {
            const isChecked = checked.has(item.id);
            const isMissing = missing.has(item.id);
            return (
              <View key={item.id} style={[styles.row, isChecked && styles.rowChecked, isMissing && styles.rowMissing]}>
                <TouchableOpacity
                  style={[styles.checkbox, isChecked && styles.checkboxChecked]}
                  onPress={() => toggle(item.id)}
                  disabled={isMissing}
                  activeOpacity={0.75}
                >
                  {isChecked && (
                    <MaterialIcons name="check" size={14} color={Colors.textInverse} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.rowContent} onPress={() => toggle(item.id)} disabled={isMissing} activeOpacity={0.75}>
                  <Text style={[styles.itemName, isChecked && styles.itemNameChecked, isMissing && styles.itemNameMissing]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.itemQty, isChecked && styles.itemQtyChecked]}>
                    {item.quantity}
                  </Text>
                </TouchableOpacity>
                {onSubstitute && (
                  <TouchableOpacity
                    style={[styles.missingButton, isMissing && styles.missingButtonActive]}
                    onPress={() => toggleMissing(item.id)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.missingButtonText, isMissing && styles.missingButtonTextActive]}>
                      {isMissing ? 'Marcado' : 'Não tenho'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      ))}

      {missing.size > 0 && (
        <TouchableOpacity
          style={styles.substituteButton}
          onPress={confirmSubstitution}
          disabled={substituting}
          activeOpacity={0.85}
        >
          <MaterialIcons name="autorenew" size={18} color={Colors.textInverse} />
          <Text style={styles.substituteButtonText}>
            {substituting ? 'Trocando...' : `Trocar ${missing.size} ${missing.size === 1 ? 'ingrediente' : 'ingredientes'}`}
          </Text>
        </TouchableOpacity>
      )}

      {allChecked && (
        <View style={styles.allCheckedBanner}>
          <Text style={styles.allCheckedEmoji}>🛒</Text>
          <Text style={styles.allCheckedText}>
            Tudo comprado! Pronto para cozinhar.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: Spacing.base,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  progressBadge: {
    backgroundColor: Colors.primary + '18',
    borderRadius: Radius.full,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  progressText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },
  group: {
    gap: Spacing.xs,
  },
  groupLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSubtle,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceElevated,
  },
  rowChecked: {
    backgroundColor: Colors.success + '10',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceElevated,
  },
  checkboxChecked: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  rowContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.text,
    flex: 1,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: Colors.textSubtle,
  },
  itemQty: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSubtle,
    fontWeight: Typography.weights.medium,
  },
  itemQtyChecked: {
    color: Colors.borderLight,
  },
  rowMissing: {
    backgroundColor: Colors.warning + '15',
  },
  itemNameMissing: {
    color: Colors.textSubtle,
  },
  missingButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  missingButtonActive: {
    backgroundColor: Colors.warning,
    borderColor: Colors.warning,
  },
  missingButtonText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSubtle,
  },
  missingButtonTextActive: {
    color: Colors.textInverse,
  },
  substituteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  substituteButtonText: {
    color: Colors.textInverse,
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.sm,
  },
  allCheckedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.success + '18',
    borderRadius: Radius.sm,
    padding: Spacing.md,
  },
  allCheckedEmoji: {
    fontSize: 20,
  },
  allCheckedText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.success,
    flex: 1,
  },
});
