/**
 * OkCheff — VoiceActivator Component
 *
 * Visual UI for the "Ok Cheff" wake-word command.
 * Chef Energy Meter: visual bar (no numbers) that drains with each voice interaction.
 * Real audio (STT/TTS) requires expo-av / expo-speech (Premium gate).
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/theme';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

interface VoiceActivatorProps {
  isPremium: boolean;
  onActivate?: () => void;
  onDeactivate?: () => void;
  /** Called when a "voice interaction" consumes energy (1 unit per interaction) */
  onEnergyConsumed?: () => void;
  /** 0..1 energy level to control from parent */
  energyLevel?: number;
  compact?: boolean;
}

const MAX_ENERGY_SEGMENTS = 7;

export function VoiceActivator({
  isPremium,
  onActivate,
  onDeactivate,
  onEnergyConsumed,
  energyLevel = 1,
  compact = false,
}: VoiceActivatorProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  // Pulse animation while listening
  useEffect(() => {
    if (voiceState === 'listening') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.18,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
      Animated.loop(
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 1400,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      ).start();
    } else {
      pulseAnim.setValue(1);
      waveAnim.setValue(0);
    }
  }, [voiceState]);

  const handlePress = () => {
    if (!isPremium) return;
    if (voiceState === 'idle') {
      setVoiceState('listening');
      onActivate?.();
      // Simulate listening → processing → idle
      setTimeout(() => setVoiceState('processing'), 2800);
      setTimeout(() => {
        setVoiceState('speaking');
        onEnergyConsumed?.();
      }, 4000);
      setTimeout(() => {
        setVoiceState('idle');
        onDeactivate?.();
      }, 6200);
    } else {
      setVoiceState('idle');
      onDeactivate?.();
    }
  };

  const isActive = voiceState !== 'idle';
  const filledSegments = Math.round(energyLevel * MAX_ENERGY_SEGMENTS);
  const energyColor =
    energyLevel > 0.6
      ? Colors.success
      : energyLevel > 0.3
      ? Colors.warning
      : Colors.error;

  const stateLabel: Record<VoiceState, string> = {
    idle: 'Ok Cheff',
    listening: 'Ouvindo...',
    processing: 'Processando...',
    speaking: 'Falando...',
  };

  if (compact) {
    return (
      <TouchableOpacity
        style={[
          styles.compactButton,
          isActive && styles.compactButtonActive,
          !isPremium && styles.compactButtonLocked,
        ]}
        onPress={handlePress}
        disabled={!isPremium}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <MaterialIcons
            name={isActive ? 'mic' : 'mic-none'}
            size={20}
            color={isActive ? Colors.textInverse : isPremium ? Colors.primary : Colors.textSubtle}
          />
        </Animated.View>
        {!isPremium && (
          <View style={styles.compactLock}>
            <MaterialIcons name="lock" size={10} color={Colors.textInverse} />
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="mic" size={16} color={Colors.primary} />
        <Text style={styles.headerTitle}>Modo Mãos Livres</Text>
        {!isPremium && (
          <View style={styles.premiumTag}>
            <MaterialIcons name="star" size={10} color={Colors.text} />
            <Text style={styles.premiumTagText}>Premium</Text>
          </View>
        )}
      </View>

      {/* Energy Meter */}
      <View style={styles.energySection}>
        <Text style={styles.energyLabel}>Energia do Chef</Text>
        <View style={styles.energyBar}>
          {Array.from({ length: MAX_ENERGY_SEGMENTS }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.energySegment,
                {
                  backgroundColor:
                    i < filledSegments
                      ? energyColor
                      : Colors.borderLight,
                  opacity: isPremium ? 1 : 0.4,
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.energyIcons}>
          <MaterialIcons
            name="battery-full"
            size={14}
            color={energyLevel > 0.3 ? Colors.success : Colors.error}
          />
          <View
            style={[styles.energyDot, { backgroundColor: energyColor }]}
          />
        </View>
      </View>

      {/* Wake button */}
      <View style={styles.wakeSection}>
        <TouchableOpacity
          style={[
            styles.wakeButton,
            isActive && styles.wakeButtonActive,
            !isPremium && styles.wakeButtonLocked,
          ]}
          onPress={handlePress}
          disabled={!isPremium}
          activeOpacity={0.85}
        >
          <Animated.View
            style={[
              styles.wakeInner,
              isActive && styles.wakeInnerActive,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <MaterialIcons
              name={voiceState === 'speaking' ? 'volume-up' : isActive ? 'mic' : 'mic-none'}
              size={28}
              color={isActive ? Colors.textInverse : isPremium ? Colors.primary : Colors.textSubtle}
            />
          </Animated.View>
          {!isPremium && (
            <View style={styles.lockOverlay}>
              <MaterialIcons name="lock" size={14} color={Colors.textInverse} />
            </View>
          )}
        </TouchableOpacity>

        <Text style={[styles.stateText, isActive && styles.stateTextActive]}>
          {stateLabel[voiceState]}
        </Text>

        {voiceState === 'listening' && (
          <View style={styles.waveContainer}>
            {[0, 1, 2, 3, 4].map(i => (
              <Animated.View
                key={i}
                style={[
                  styles.waveLine,
                  {
                    height: waveAnim.interpolate({
                      inputRange: [0, 0.25, 0.5, 0.75, 1],
                      outputRange: [
                        4 + i * 3,
                        16 + i * 2,
                        8 + i * 4,
                        20 - i * 2,
                        4 + i * 3,
                      ],
                    }),
                    backgroundColor: Colors.primary,
                  },
                ]}
              />
            ))}
          </View>
        )}

        {!isPremium && (
          <Text style={styles.lockedHint}>
            Ative o Premium para usar o Ok Cheff
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    gap: Spacing.base,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  premiumTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.premium,
    borderRadius: Radius.full,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  premiumTagText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  // Energy Meter
  energySection: {
    gap: Spacing.xs,
  },
  energyLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  energyBar: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  energySegment: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  energyIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  energyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Wake button
  wakeSection: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  wakeButton: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary + '18',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary + '40',
    position: 'relative',
  },
  wakeButtonActive: {
    backgroundColor: Colors.primary + '30',
    borderColor: Colors.primary,
  },
  wakeButtonLocked: {
    backgroundColor: Colors.surfaceDark,
    borderColor: Colors.border,
    opacity: 0.7,
  },
  wakeInner: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  wakeInnerActive: {
    backgroundColor: Colors.primary,
  },
  lockOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    backgroundColor: Colors.textSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSubtle,
  },
  stateTextActive: {
    color: Colors.primary,
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 28,
  },
  waveLine: {
    width: 4,
    borderRadius: 2,
  },
  lockedHint: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSubtle,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Compact
  compactButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    position: 'relative',
  },
  compactButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  compactButtonLocked: {
    opacity: 0.55,
  },
  compactLock: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.textSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
