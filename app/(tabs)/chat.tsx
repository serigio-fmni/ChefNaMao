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
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/theme';
import { useApp } from '../../hooks/useApp';
import { getChefResponse, ChatMessage, createWelcomeMessage } from '../../services/chatService';
import { PremiumBanner, VoiceActivator } from '../../components';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { profile, consumeVoiceEnergy } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([createWelcomeMessage()]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const text = inputText.trim();
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

    try {
      const response = await getChefResponse(text);
      const chefMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, chefMsg]);
    } catch (e) {
      // silent
    } finally {
      setIsTyping(false);
    }
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={require('../../assets/images/chef-avatar.png')}
            style={styles.avatar}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.onlineIndicator} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>OkCheff</Text>
          <Text style={styles.headerStatus}>Assistente culinário • Online</Text>
        </View>
        {/* Voice toggle button */}
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

      {/* Voice Activator panel */}
      {showVoice && (
        <View style={styles.voicePanel}>
          {profile.isPremium ? (
            <VoiceActivator
              isPremium={profile.isPremium}
              energyLevel={profile.voiceEnergy}
              onEnergyConsumed={consumeVoiceEnergy}
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
              <View style={styles.chefAvatar}>
                <MaterialIcons name="restaurant" size={14} color={Colors.textInverse} />
              </View>
            )}
            <View
              style={[
                styles.bubble,
                msg.isUser ? styles.bubbleUser : styles.bubbleChef,
              ]}
            >
              <Text style={[styles.bubbleText, msg.isUser ? styles.bubbleTextUser : styles.bubbleTextChef]}>
                {msg.text}
              </Text>
              <Text style={[styles.timestamp, msg.isUser ? styles.timestampUser : styles.timestampChef]}>
                {formatTime(msg.timestamp)}
              </Text>
            </View>
          </View>
        ))}

        {isTyping && (
          <View style={[styles.messageRow, styles.messageRowChef]}>
            <View style={styles.chefAvatar}>
              <MaterialIcons name="restaurant" size={14} color={Colors.textInverse} />
            </View>
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
                <TouchableOpacity
                  key={q}
                  style={styles.quickChip}
                  onPress={() => setInputText(q)}
                >
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
          onSubmitEditing={sendMessage}
          returnKeyType="send"
          multiline
          maxLength={500}
        />
        <VoiceActivator
          isPremium={profile.isPremium}
          energyLevel={profile.voiceEnergy}
          onEnergyConsumed={consumeVoiceEnergy}
          compact
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || isTyping) && styles.sendButtonDisabled]}
          onPress={sendMessage}
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
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: Spacing.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceDark,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.surface,
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
  voiceToggleBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary + '18',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  voiceToggleBtnActive: {
    backgroundColor: Colors.primary,
  },
  lockDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.textSubtle,
    alignItems: 'center',
    justifyContent: 'center',
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
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
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
  timestamp: {
    fontSize: 10,
    alignSelf: 'flex-end',
  },
  timestampUser: {
    color: 'rgba(255,255,255,0.65)',
  },
  timestampChef: {
    color: Colors.textSubtle,
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
