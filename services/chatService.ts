import { supabase } from '../lib/supabase';
import { FunctionsHttpError } from '@supabase/supabase-js';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface AIChatOptions {
  mode?: 'chat' | 'voice';
  /** Pass the Supabase session token for authenticated AI calls */
  token?: string | null;
}

/** Calls the OkCheff AI Edge Function securely */
export async function getChefAIResponse(
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  options: AIChatOptions = {}
): Promise<{ reply: string; voiceEnergyBalance?: number; error?: string }> {
  const { mode = 'chat', token } = options;

  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const { data, error } = await supabase.functions.invoke('okcheff-ai', {
      body: { messages: conversationHistory, mode },
      headers: token ? headers : undefined,
    });

    if (error) {
      let errorMessage = error.message;
      if (error instanceof FunctionsHttpError) {
        try {
          const statusCode = error.context?.status ?? 500;
          const textContent = await error.context?.text();
          const parsed = textContent ? JSON.parse(textContent) : null;
          errorMessage = parsed?.message || parsed?.error || `[${statusCode}] ${textContent || error.message}`;

          // Return specific error codes for handling in UI
          if (parsed?.error === 'VOICE_REQUIRES_PREMIUM') {
            return { reply: '', error: 'VOICE_REQUIRES_PREMIUM' };
          }
          if (parsed?.error === 'INSUFFICIENT_ENERGY') {
            return { reply: '', error: 'INSUFFICIENT_ENERGY' };
          }
        } catch {
          errorMessage = error.message;
        }
      }
      return { reply: '', error: errorMessage };
    }

    return {
      reply: data?.reply ?? '',
      voiceEnergyBalance: data?.voiceEnergyBalance,
    };
  } catch (err: any) {
    return { reply: '', error: err.message || 'Erro inesperado.' };
  }
}

/** Fallback mock responses when user is not authenticated or AI is unavailable */
import { CHAT_RESPONSES } from '../constants/data';

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export async function getChefResponse(message: string): Promise<string> {
  const delay = 800 + Math.random() * 800;
  await new Promise(resolve => setTimeout(resolve, delay));

  const normalized = normalizeText(message);

  if (/oi|ola|bom dia|boa tarde|boa noite|tudo bem|hey|hello/.test(normalized)) {
    return pickRandom(CHAT_RESPONSES.greeting);
  }
  if (/tenho|ingrediente|geladeira|dispensa|tem em casa|usando/.test(normalized)) {
    return pickRandom(CHAT_RESPONSES.ingredients);
  }
  if (/dica|truque|segredo|como fazer|como faz/.test(normalized)) {
    return pickRandom(CHAT_RESPONSES.tips);
  }
  if (/substituir|substituicao|nao tenho|sem|alternativa/.test(normalized)) {
    return pickRandom(CHAT_RESPONSES.substitute);
  }
  if (/rapido|rapida|tempo|minutos|pressa/.test(normalized)) {
    return pickRandom(CHAT_RESPONSES.time);
  }
  if (/receita|preparar|fazer|cozinhar|prato/.test(normalized)) {
    return pickRandom([
      'Ótima escolha! Me conta quais ingredientes você tem disponíveis e vou criar algo especial para você.',
      'Posso te ajudar com isso! Qual é o seu nível de experiência na cozinha — iniciante, intermediário ou avançado?',
      'Claro! Para te dar a melhor receita possível, me diz: você tem alguma restrição alimentar?',
    ]);
  }
  return pickRandom(CHAT_RESPONSES.default);
}

export function createWelcomeMessage(): ChatMessage {
  return {
    id: 'welcome',
    text: 'Olá! Sou o OkCheff, seu assistente culinário pessoal. Pode me perguntar sobre receitas, dicas de culinária, substituições de ingredientes e muito mais! Como posso te ajudar hoje? 👨‍🍳',
    isUser: false,
    timestamp: new Date(),
  };
}
