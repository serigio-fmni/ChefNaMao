import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { supabase } from '../lib/supabase';

type AuthMode = 'signin' | 'signup';

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Por favor, informe seu nome.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (mode === 'signin') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { name: name.trim() },
          },
        });
        if (signUpError) throw signUpError;
      }
    } catch (err: any) {
      let message = err.message || 'Ocorreu um erro. Tente novamente.';
      if (message.includes('Invalid login credentials')) {
        message = 'E-mail ou senha incorretos.';
      } else if (message.includes('User already registered')) {
        message = 'Este e-mail já está cadastrado. Faça login.';
      } else if (message.includes('Password should be')) {
        message = 'A senha deve ter pelo menos 6 caracteres.';
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand */}
        <View style={styles.brandSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/okcheff-logo.png')}
              style={styles.logo}
              contentFit="contain"
              transition={300}
            />
          </View>
          <Text style={styles.brandName}>OkCheff</Text>
          <Text style={styles.brandTagline}>Seu chef pessoal de gastronomia</Text>
        </View>

        {/* Mode toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'signin' && styles.modeButtonActive]}
            onPress={() => { setMode('signin'); setError(''); }}
          >
            <Text style={[styles.modeButtonText, mode === 'signin' && styles.modeButtonTextActive]}>
              Entrar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'signup' && styles.modeButtonActive]}
            onPress={() => { setMode('signup'); setError(''); }}
          >
            <Text style={[styles.modeButtonText, mode === 'signup' && styles.modeButtonTextActive]}>
              Cadastrar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {mode === 'signup' && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Seu nome</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="person-outline" size={20} color={Colors.textSubtle} />
                <TextInput
                  style={styles.input}
                  placeholder="Como posso te chamar?"
                  placeholderTextColor={Colors.textSubtle}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="email" size={20} color={Colors.textSubtle} />
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor={Colors.textSubtle}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Senha</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock-outline" size={20} color={Colors.textSubtle} />
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={Colors.textSubtle}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleAuth}
              />
              <TouchableOpacity onPress={() => setShowPassword(v => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <MaterialIcons
                  name={showPassword ? 'visibility-off' : 'visibility'}
                  size={20}
                  color={Colors.textSubtle}
                />
              </TouchableOpacity>
            </View>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <MaterialIcons name="error-outline" size={16} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonLoading]}
            onPress={handleAuth}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.textInverse} />
            ) : (
              <>
                <MaterialIcons
                  name={mode === 'signin' ? 'login' : 'person-add'}
                  size={20}
                  color={Colors.textInverse}
                />
                <Text style={styles.submitButtonText}>
                  {mode === 'signin' ? 'Entrar' : 'Criar Conta'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footerNote}>
          Ao continuar, você concorda com os termos de uso do OkCheff.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    alignItems: 'stretch',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    overflow: 'hidden',
    marginBottom: Spacing.base,
    ...Shadows.lg,
  },
  logo: {
    width: 90,
    height: 90,
  },
  brandName: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primary,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  brandTagline: {
    fontSize: Typography.sizes.base,
    color: Colors.textSubtle,
    fontStyle: 'italic',
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceDark,
    borderRadius: Radius.lg,
    padding: 4,
    marginBottom: Spacing.xl,
  },
  modeButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  modeButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSubtle,
  },
  modeButtonTextActive: {
    color: Colors.textInverse,
    fontWeight: Typography.weights.bold,
  },
  form: {
    gap: Spacing.base,
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  inputLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    height: 52,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.sizes.base,
    color: Colors.text,
    height: '100%',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.error + '15',
    borderRadius: Radius.sm,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
  },
  errorText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.error,
    lineHeight: 18,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    height: 56,
    marginTop: Spacing.sm,
    ...Shadows.lg,
  },
  submitButtonLoading: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textInverse,
  },
  footerNote: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSubtle,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: Spacing.sm,
  },
});
