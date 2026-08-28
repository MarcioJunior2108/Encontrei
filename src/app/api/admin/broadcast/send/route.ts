import { NextResponse } from 'next/server';
import { getCurrentProfile } from '@/app/actions/user';

export async function POST(req: Request) {
  try {
    const profile = await getCurrentProfile();
    
    // Proteção de rota
    if (!profile || profile.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { phone, message } = await req.json();

    if (!phone || !message) {
      return NextResponse.json({ error: 'Telefone e mensagem são obrigatórios' }, { status: 400 });
    }

    const apiUrl = process.env.EVOLUTION_API_URL;
    const apiKey = process.env.EVOLUTION_API_KEY;
    const instanceName = process.env.EVOLUTION_INSTANCE_NAME;

    if (!apiUrl || !apiKey || !instanceName) {
      return NextResponse.json(
        { error: 'Evolution API não está configurada no .env' },
        { status: 400 }
      );
    }

    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    // A Evolution API geralmente usa numero@s.whatsapp.net ou apenas o número com DDI
    // Ex: 5571999999999
    
    const response = await fetch(`${baseUrl}/message/sendText/${instanceName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify({
        number: phone,
        options: {
          delay: 1200,
          presence: "composing", // Mostra "digitando..."
        },
        textMessage: {
          text: message
        }
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || data.error || 'Erro ao enviar via Evolution API' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error('[Broadcast Send API] Erro:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar disparo.' },
      { status: 500 }
    );
  }
}
