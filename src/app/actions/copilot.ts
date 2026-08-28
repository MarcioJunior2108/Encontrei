'use server';

import OpenAI from 'openai';
import { getCurrentProfile } from './user';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export async function processCopilotChat(messages: ChatMessage[]) {
  try {
    const profile = await getCurrentProfile();
    const userName = profile?.name?.split(' ')[0] || 'usuário';

    // Construir histórico de mensagens
    const systemPrompt = `Você é a IA da AcheiYou, uma plataforma de serviços.
Sua missão é atuar como um assistente/secretária inteligente para o cliente ${userName}.
O cliente vai dizer o que precisa. Seu objetivo é descobrir exatamente o tipo de profissional que ele precisa, fazendo perguntas curtas e diretas (máximo 1 pergunta por vez).
Assim que você tiver certeza do que ele quer, encerre a conversa definindo a ação "search" e a query refinada.

REGRA ABSOLUTA: Você deve retornar EXCLUSIVAMENTE um objeto JSON válido, com a seguinte estrutura:
{
  "reply": "Sua resposta de chat para o usuário (texto)",
  "action": "chat" | "search",
  "query": "Apenas preencha isso se action for search. Deve ser uma busca refinada (ex: Desenvolvedor Web Front-end São Paulo)"
}
Seja amigável, conciso(a) e rápido(a).`;

    const apiMessages: any[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: apiMessages,
      response_format: { type: 'json_object' },
      max_tokens: 250,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Sem resposta da IA');

    const result = JSON.parse(content);
    
    return { success: true, data: result };

  } catch (error) {
    console.error('Erro no Copilot:', error);
    return { success: false, error: 'Ocorreu um erro ao processar sua solicitação.' };
  }
}
