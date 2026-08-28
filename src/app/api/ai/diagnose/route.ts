import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 60; // Permite até 60s de execução para a IA

export async function POST(request: Request) {
  try {
    // 1. Validar autenticação do usuário
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    // 2. Extrair imagem do corpo
    const { imageUrl, description } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Imagem é obrigatória para o diagnóstico.' }, { status: 400 });
    }

    // 3. Prompt de Visão para a IA (Forçando retorno JSON)
    const prompt = `
    Você é um mestre de obras, encanador e eletricista expert.
    Analise a imagem fornecida (e a descrição do cliente: "${description || 'Sem descrição'}") e faça um diagnóstico preciso.
    
    Retorne EXCLUSIVAMENTE um objeto JSON válido com a seguinte estrutura:
    {
      "problem": "Descrição clara e técnica do problema identificado",
      "materials": ["Item 1", "Item 2"],
      "estimatedCostRange": {
        "min": 100,
        "max": 300
      }
    }
    Não retorne nenhum texto além do JSON.
    `;

    // 4. Chamar a API da OpenAI com Vision
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Modelo Vision mais rápido e barato atual
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
                detail: 'low' // low detail para economizar tokens e ser mais rápido
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' }, // Força o JSON garantido
      max_tokens: 500,
    });

    const aiContent = response.choices[0]?.message?.content;
    
    if (!aiContent) {
      throw new Error('IA não retornou um diagnóstico.');
    }

    const diagnosis = JSON.parse(aiContent);

    // 5. Retornar os dados parseados para o Client Component
    return NextResponse.json({ 
      success: true, 
      diagnosis 
    });

  } catch (error: any) {
    console.error('Erro na API de Diagnóstico Visual:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao processar a imagem.' }, 
      { status: 500 }
    );
  }
}
