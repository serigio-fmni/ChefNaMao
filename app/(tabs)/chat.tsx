import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/theme';
import { useApp } from '../../hooks/useApp';
import {
  getChefAIResponse,
  getChefResponse,
  ChatMessage,
  createWelcomeMessage,
} from '../../services/chatService';
import { PremiumBanner, VoiceActivator } from '../../components';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile, consumeVoiceEnergy, session, updateProfile } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([createWelcomeMessage()]);
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: 'user' | 'assistant'; content: string }>
  >([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const speakText = async (text: string) => {
    if (!ttsEnabled || !profile.isPremium) return;
    try {
      await Speech.stop();
      setIsSpeaking(true);
      Speech.speak(text, {
        language: getLangCode(profile.language),
        pitch: 1.0,
        rate: 0.92,
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
      });
    } catch {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  const getLangCode = (lang: string): string => {
    const map: Record<string, string> = {
      pt: 'pt-BR',
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR',
      it: 'it-IT',
      de: 'de-DE',
    };
    return map[lang] ?? 'pt-BR';
  };

  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText ?? inputText).trim();
    if (!text || isTyping) return;
    setInputText('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const newHistory = [...conversationHistory, { role: 'user' as const, content: text }];

    try {
      let replyText = '';

      if (session?.access_token) {
        const result = await getChefAIResponse(newHistory, {
          mode: 'chat',
          token: session.access_token,
        });

        if (result.error) {
          replyText = await getChefResponse(text);
        } else {
          replyText = result.reply;
          setConversationHistory([...newHistory, { role: 'assistant', content: replyText }]);
        }
      } else {
        replyText = await getChefResponse(text);
      }

      const chefMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, chefMsg]);

      // Auto-speak if TTS enabled
      if (ttsEnabled && profile.isPremium) {
        await speakText(replyText);
      }
    } catch {
      // silent
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceEnergyConsumed = async () => {
    if (!session?.access_token) return;
    if (profile.voiceEnergy <= 0) {
      Alert.alert(
        'Energia Esgotada',
        'Sua energia de voz do OkCheff foi esgotada. Aguarde a recarga diária ou faça upgrade do plano.',
        [{ text: 'OK' }]
      );
      return;
    }
    await consumeVoiceEnergy();
  };

  const toggleTTS = () => {
    if (!profile.isPremium) return;
    const next = !ttsEnabled;
    setTtsEnabled(next);
    if (!next) stopSpeaking();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const QUICK_QUESTIONS = [
    'Dica rápida de culinária',
    'Substituir ovos em receitas',
    'Receitas com frango',
    'Temperos essenciais',
  ];

  const isAuthenticated = !!session;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/okcheff-logo.png')}
          style={styles.logo}
          contentFit="contain"
          transition={200}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>OkCheff</Text>
          <Text style={styles.headerStatus}>
            {isAuthenticated ? 'Chef IA • Online' : 'Chef assistente • Online'}
          </Text>
        </View>

        {/* TTS Toggle (Premium) */}
        <TouchableOpacity
          style={[
            styles.ttsButton,
            ttsEnabled && styles.ttsButtonActive,
            !profile.isPremium && styles.ttsButtonLocked,
          ]}
          onPress={toggleTTS}
          activeOpacity={0.8}
          disabled={!profile.isPremium}
        >
          {isSpeaking ? (
            <ActivityIndicator size="small" color={Colors.textInverse} />
          ) : (
            <MaterialIcons
              name={ttsEnabled ? 'volume-up' : 'volume-off'}
              size={18}
              color={ttsEnabled ? Colors.textInverse : profile.isPremium ? Colors.primary : Colors.textSubtle}
            />
          )}
          {!profile.isPremium && (
            <View style={styles.lockDot}>
              <MaterialIcons name="lock" size={8} color={Colors.textInverse} />
            </View>
          )}
        </TouchableOpacity>

        {/* AI indicator */}
        {isAuthenticated && (
          <View style={styles.aiIndicator}>
            <MaterialIcons name="auto-awesome" size={14} color={Colors.premium} />
            <Text style={styles.aiIndicatorText}>IA</Text>
          </View>
        )}

        {/* Voice toggle */}
        <TouchableOpacity
          style={[styles.voiceToggleBtn, showVoice && styles.voiceToggleBtnActive]}
          onPress={() => setShowVoice(v => !v)}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name="mic"
            size={20}
            color={showVoice ? Colors.textInverse : profile.isPremium ? Colors.primary : Colors.textSubtle}
          />
          {!profile.isPremium && (
            <View style={styles.lockDot}>
              <MaterialIcons name="lock" size={8} color={Colors.textInverse} />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* TTS status bar */}
      {ttsEnabled && profile.isPremium && (
        <View style={styles.ttsBar}>
          <MaterialIcons name={isSpeaking ? 'graphic-eq' : 'volume-up'} size={14} color={Colors.primary} />
          <Text style={styles.ttsBarText}>
            {isSpeaking ? 'OkCheff está falando...' : 'Modo voz ativo — respostas serão lidas em voz alta'}
          </Text>
          {isSpeaking && (
            <TouchableOpacity onPress={stopSpeaking} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialIcons name="stop" size={16} color={Colors.error} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Auth notice */}
      {!isAuthenticated && (
        <TouchableOpacity style={styles.authBanner} onPress={() => router.push('/auth')}>
          <MaterialIcons name="info-outline" size={16} color={Colors.primaryDark} />
          <Text style={styles.authBannerText}>Faça login para usar a IA real do OkCheff</Text>
          <MaterialIcons name="chevron-right" size={16} color={Colors.primaryDark} />
        </TouchableOpacity>
      )}

      {/* Voice Activator panel */}
      {showVoice && (
        <View style={styles.voicePanel}>
          {profile.isPremium ? (
            <VoiceActivator
              isPremium={profile.isPremium}
              energyLevel={profile.voiceEnergy / 100}
              onEnergyConsumed={handleVoiceEnergyConsumed}
            />
          ) : (
            <PremiumBanner feature="Modo Mãos Livres com comando 'Ok Cheff' e voz bidirecional" />
          )}
        </View>
      )}

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map(msg => (
          <View
            key={msg.id}
            style={[styles.messageRow, msg.isUser ? styles.messageRowUser : styles.messageRowChef]}
          >
            {!msg.isUser && (
              <Image
                source={require('../../assets/images/okcheff-logo.png')}
                style={styles.chefAvatar}
                contentFit="contain"
              />
            )}
            <View style={[styles.bubble, msg.isUser ? styles.bubbleUser : styles.bubbleChef]}>
              <Text
                style={[
                  styles.bubbleText,
                  msg.isUser ? styles.bubbleTextUser : styles.bubbleTextChef,
                ]}
              >
                {msg.text}
              </Text>
              <View style={styles.bubbleFooter}>
                <Text style={[styles.timestamp, msg.isUser ? styles.timestampUser : styles.timestampChef]}>
                  {formatTime(msg.timestamp)}
                </Text>
                {!msg.isUser && profile.isPremium && (
                  <TouchableOpacity
                    onPress={() => speakText(msg.text)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.speakBtn}
                  >
                    <MaterialIcons name="volume-up" size={12} color={Colors.textSubtle} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}

        {isTyping && (
          <View style={[styles.messageRow, styles.messageRowChef]}>
            <Image
              source={require('../../assets/images/okcheff-logo.png')}
              style={styles.chefAvatar}
              contentFit="contain"
            />
            <View style={[styles.bubble, styles.bubbleChef, styles.typingBubble]}>
              <View style={styles.typingDots}>
                <View style={[styles.dot, styles.dot1]} />
                <View style={[styles.dot, styles.dot2]} />
                <View style={[styles.dot, styles.dot3]} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick questions */}
      {messages.length <= 2 && (
        <View style={styles.quickContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.quickRow}>
              {QUICK_QUESTIONS.map(q => (
                <TouchableOpacity key={q} style={styles.quickChip} onPress={() => sendMessage(q)}>
                  <Text style={styles.quickChipText}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Input bar */}
      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TextInput
          style={styles.input}
          placeholder="Pergunte ao OkCheff..."
          placeholderTextColor={Colors.textSubtle}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => sendMessage()}
          returnKeyType="send"
          multiline
          maxLength={500}
        />
        <VoiceActivator
          isPremium={profile.isPremium}
          energyLevel={profile.voiceEnergy / 100}
          onEnergyConsumed={handleVoiceEnergyConsumed}
          compact
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || isTyping) && styles.sendButtonDisabled]}
          onPress={() => sendMessage()}
          disabled={!inputText.trim() || isTyping}
        >
          {isTyping ? (
            <ActivityIndicator size="small" color={Colors.textInverse} />
          ) : (
            <MaterialIcons name="send" size={18} color={Colors.textInverse} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  headerStatus: {
    fontSize: Typography.sizes.xs,
    color: Colors.success,
    fontWeight: Typography.weights.medium,
  },
  ttsButton: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ttsButtonActive: {
    backgroundColor: Colors.primary,
  },
  ttsButtonLocked: {
    opacity: 0.5,
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.premium + '25',
    borderRadius: Radius.full,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.premium + '55',
  },
  aiIndicatorText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.premiumDark,
  },
  voiceToggleBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  voiceToggleBtnActive: {
    backgroundColor: Colors.primary,
  },
  lockDot: {
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
  ttsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary + '10',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  ttsBarText: {
    flex: 1,
    fontSize: Typography.sizes.xs,
    color: Colors.primaryDark,
    fontWeight: Typography.weights.medium,
  },
  authBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary + '12',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  authBannerText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.primaryDark,
    fontWeight: Typography.weights.medium,
  },
  voicePanel: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.base,
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowChef: {
    justifyContent: 'flex-start',
  },
  chefAvatar: {
    width: 30,
    height: 30,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceDark,
    flexShrink: 0,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: 4,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: Radius.xs,
  },
  bubbleChef: {
    backgroundColor: Colors.surfaceElevated,
    borderBottomLeftRadius: Radius.xs,
    ...Shadows.sm,
  },
  bubbleText: {
    fontSize: Typography.sizes.base,
    lineHeight: 22,
  },
  bubbleTextUser: {
    color: Colors.textInverse,
  },
  bubbleTextChef: {
    color: Colors.text,
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  timestamp: {
    fontSize: 10,
  },
  timestampUser: {
    color: 'rgba(255,255,255,0.65)',
  },
  timestampChef: {
    color: Colors.textSubtle,
  },
  speakBtn: {
    padding: 2,
  },
  typingBubble: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.textSubtle,
  },
  dot1: {},
  dot2: { opacity: 0.65 },
  dot3: { opacity: 0.4 },
  quickContainer: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  quickRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
  },
  quickChip: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickChipText: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: Colors.background,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    fontSize: Typography.sizes.base,
    color: Colors.text,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.border,
  },
});
