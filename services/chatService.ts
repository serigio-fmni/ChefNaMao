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
  // Simulate thinking delay
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
    const responses = [
      'Ótima escolha! Me conta quais ingredientes você tem disponíveis e vou criar algo especial para você.',
      'Posso te ajudar com isso! Qual é o seu nível de experiência na cozinha — iniciante, intermediário ou avançado?',
      'Claro! Para te dar a melhor receita possível, me diz: você tem alguma restrição alimentar?',
    ];
    return pickRandom(responses);
  }

  return pickRandom(CHAT_RESPONSES.default);
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function createWelcomeMessage(): ChatMessage {
  return {
    id: 'welcome',
    text: 'Olá! Sou o Chef Na Mão, seu assistente culinário pessoal. Pode me perguntar sobre receitas, dicas de culinária, substituições de ingredientes e muito mais! Como posso te ajudar hoje? 👨‍🍳',
    isUser: false,
    timestamp: new Date(),
  };
}
