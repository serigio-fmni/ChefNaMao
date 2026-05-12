import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/theme';
import { useApp } from '../../hooks/useApp';

interface PremiumBannerProps {
  feature: string;
  onUpgrade?: () => void;
}

export function PremiumBanner({ feature, onUpgrade }: PremiumBannerProps) {
  const { updateProfile } = useApp();

  const handleUpgrade = () => {
    updateProfile({ isPremium: true });
    onUpgrade?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="star" size={24} color={Colors.premium} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Recurso Premium</Text>
        <Text style={styles.description}>{feature} está disponível no plano Premium.</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleUpgrade} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Ativar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.premium + '22',
    borderRadius: Radius.md,
    padding: Spacing.base,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.premium + '55',
    ...Shadows.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.premium + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  description: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  button: {
    backgroundColor: Colors.premium,
    borderRadius: Radius.sm,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
});
