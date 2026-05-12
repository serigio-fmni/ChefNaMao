import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/theme';
import { useApp } from '../../hooks/useApp';
import { DietType, MealType, DIET_LABELS, MEAL_TYPE_LABELS } from '../../constants/data';
import { VoiceActivator } from '../../components';
import { LANGUAGE_OPTIONS, Language } from '../../constants/i18n';

const DIET_OPTIONS: DietType[] = ['tradicional', 'vegetariana', 'vegana'];
const MEAL_OPTIONS: MealType[] = ['rapida', 'classica', 'internacional', 'regional'];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile, updateProfile, savedRecipes, eventRecipes, consumeVoiceEnergy } = useApp();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  const saveName = () => {
    if (nameInput.trim()) updateProfile({ name: nameInput.trim() });
    setEditingName(false);
  };

  const togglePreference = (pref: MealType) => {
    const current = profile.preferences;
    const updated = current.includes(pref)
      ? current.filter(p => p !== pref)
      : [...current, pref];
    if (updated.length > 0) updateProfile({ preferences: updated });
  };

  const togglePremium = () => {
    updateProfile({ isPremium: !profile.isPremium });
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{profile.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.profileInfo}>
          {editingName ? (
            <View style={styles.editNameRow}>
              <TextInput
                style={styles.nameInput}
                value={nameInput}
                onChangeText={setNameInput}
                onBlur={saveName}
                onSubmitEditing={saveName}
                autoFocus
                returnKeyType="done"
              />
              <TouchableOpacity onPress={saveName}>
                <MaterialIcons name="check" size={20} color={Colors.success} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.nameRow}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <TouchableOpacity
                onPress={() => setEditingName(true)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialIcons name="edit" size={16} color={Colors.textSubtle} />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.planBadge}>
            <MaterialIcons
              name={profile.isPremium ? 'star' : 'star-border'}
              size={12}
              color={profile.isPremium ? Colors.text : Colors.textSubtle}
            />
            <Text
              style={[
                styles.planText,
                { color: profile.isPremium ? Colors.text : Colors.textSubtle },
              ]}
            >
              {profile.isPremium ? 'Plano Premium' : 'Plano Gratuito'}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{savedRecipes.length}</Text>
          <Text style={styles.statLabel}>Receitas{'\n'}Salvas</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{eventRecipes.length}</Text>
          <Text style={styles.statLabel}>Meus{'\n'}Eventos</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{profile.isPremium ? '∞' : '3'}</Text>
          <Text style={styles.statLabel}>Ingredientes{'\n'}Grátis</Text>
        </View>
      </View>

      {/* Premium toggle */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Plano de Assinatura</Text>
        <View style={styles.premiumCard}>
          <View style={styles.premiumLeft}>
            <View style={styles.premiumIcon}>
              <MaterialIcons name="star" size={22} color={Colors.premium} />
            </View>
            <View>
              <Text style={styles.premiumTitle}>
                {profile.isPremium ? 'Premium Ativo' : 'Ativar Premium'}
              </Text>
              <Text style={styles.premiumDescription}>
                Ingredientes ilimitados, voz, todas as dietas
              </Text>
            </View>
          </View>
          <Switch
            value={profile.isPremium}
            onValueChange={togglePremium}
            trackColor={{ false: Colors.border, true: Colors.premium + 'AA' }}
            thumbColor={profile.isPremium ? Colors.premium : Colors.textSubtle}
          />
        </View>

        {!profile.isPremium && (
          <View style={styles.featuresList}>
            {[
              'Ingredientes ilimitados na busca',
              'Caderno digital ilimitado',
              'Modo Mãos Livres com voz',
              'Comando "Ok Cheff"',
              'Todas as dietas e cozinhas',
              'Acesso offline total',
            ].map(feat => (
              <View key={feat} style={styles.featureItem}>
                <MaterialIcons name="check-circle" size={16} color={Colors.success} />
                <Text style={styles.featureText}>{feat}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Diet preference */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dieta</Text>
        <View style={styles.optionsRow}>
          {DIET_OPTIONS.map(diet => (
            <TouchableOpacity
              key={diet}
              style={[styles.optionChip, profile.diet === diet && styles.optionChipActive]}
              onPress={() => updateProfile({ diet })}
            >
              <Text
                style={[
                  styles.optionChipText,
                  profile.diet === diet && styles.optionChipTextActive,
                ]}
              >
                {DIET_LABELS[diet]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Meal preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferências Culinárias</Text>
        <View style={styles.optionsRow}>
          {MEAL_OPTIONS.map(meal => (
            <TouchableOpacity
              key={meal}
              style={[
                styles.optionChip,
                profile.preferences.includes(meal) && styles.optionChipActive,
              ]}
              onPress={() => togglePreference(meal)}
            >
              <Text
                style={[
                  styles.optionChipText,
                  profile.preferences.includes(meal) && styles.optionChipTextActive,
                ]}
              >
                {MEAL_TYPE_LABELS[meal]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Voice mode section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Modo Mãos Livres — Ok Cheff</Text>
        <VoiceActivator
          isPremium={profile.isPremium}
          energyLevel={profile.voiceEnergy}
          onEnergyConsumed={consumeVoiceEnergy}
        />
        {profile.isPremium && (
          <View style={styles.voiceFeatures}>
            {[
              { icon: 'hearing', label: 'Ativação por voz "Ok Cheff"' },
              { icon: 'record-voice-over', label: 'Text-to-Speech para receitas' },
              { icon: 'mic-none', label: 'Speech-to-Text para dúvidas' },
            ].map(item => (
              <View key={item.label} style={styles.voiceFeatureItem}>
                <MaterialIcons name={item.icon as any} size={14} color={Colors.primary} />
                <Text style={styles.voiceFeatureText}>{item.label}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Language selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Idioma / Language</Text>
        <View style={styles.languageGrid}>
          {LANGUAGE_OPTIONS.map(lang => {
            const isActive = profile.language === lang.value;
            return (
              <TouchableOpacity
                key={lang.value}
                style={[styles.langChip, isActive && styles.langChipActive]}
                onPress={() => updateProfile({ language: lang.value as Language })}
                activeOpacity={0.8}
              >
                <Text style={styles.langFlag}>{lang.flag}</Text>
                <Text style={[styles.langLabel, isActive && styles.langLabelActive]}>
                  {lang.label}
                </Text>
                {isActive && (
                  <MaterialIcons name="check" size={14} color={Colors.primary} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.brandNote}>
          ✦ OkCheff — marca global, não traduzida
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.base,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginTop: Spacing.base,
    ...Shadows.md,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.textInverse,
  },
  profileInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  profileName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  editNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  nameInput: {
    flex: 1,
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    paddingBottom: 2,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceDark,
    borderRadius: Radius.full,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  planText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    ...Shadows.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSubtle,
    textAlign: 'center',
    lineHeight: 15,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.premium + '22',
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.premium + '55',
  },
  premiumLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  premiumIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.premium + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  premiumDescription: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  featuresList: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionChip: {
    height: 38,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionChipText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textSecondary,
  },
  optionChipTextActive: {
    color: Colors.textInverse,
    fontWeight: Typography.weights.semibold,
  },
  voiceFeatures: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  voiceFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  voiceFeatureText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  // Language selector
  languageGrid: {
    gap: Spacing.sm,
  },
  langChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  langChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08',
  },
  langFlag: {
    fontSize: 20,
  },
  langLabel: {
    flex: 1,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: Colors.textSecondary,
  },
  langLabelActive: {
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  brandNote: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSubtle,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
