import { NextResponse } from 'next/server';
import { getCurrentProfile } from '@/app/actions/user';

export async function POST() {
  try {
    const profile = await getCurrentProfile();
    
    // Proteção de rota
    if (!profile || profile.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
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

    // Primeiro, vamos tentar criar a instância (se já existir, ele retorna erro, aí tentamos pegar o QR code)
    let response = await fetch(`${baseUrl}/instance/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify({
        instanceName: instanceName,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS'
      })
    });

    let data = await response.json().catch(() => ({}));

    // Se a instância já existir, a Evolution API retorna um erro ou não retorna o QR Code.
    // Vamos chamar o endpoint connect para forçar a geração do QR Code se não tivermos recebido
    if (!response.ok || !data.qrcode) {
      const errorMsg = data.message || data.error || 'Erro desconhecido na Evolution API';
      const connectResponse = await fetch(`${baseUrl}/instance/connect/${instanceName}`, {
        method: 'GET',
        headers: {
          'apikey': apiKey
        }
      });
      const connectData = await connectResponse.json();
      
      if (!connectResponse.ok && connectData.error !== 'Instance already connected') {
         return NextResponse.json({ error: 'Erro ao conectar à instância: ' + JSON.stringify(connectData) }, { status: 500 });
      }

      // Se retornou o QR code do endpoint connect
      if (connectData.base64) {
        return NextResponse.json({ qrcode: { base64: connectData.base64 } });
      } else if (connectData.instance?.state === 'open' || connectData.error === 'Instance already connected') {
        return NextResponse.json({ instance: { state: 'open' } });
      } else {
        // Fallback pra retornar o que quer que tenha vindo
        return NextResponse.json(connectData);
      }
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error('[WhatsApp Setup API] Erro:', error);
    return NextResponse.json(
      { error: 'Erro interno ao comunicar com a Evolution API.' },
      { status: 500 }
    );
  }
}
