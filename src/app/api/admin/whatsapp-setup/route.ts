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

    const controller1 = new AbortController();
    const timeout1 = setTimeout(() => controller1.abort(), 8000);

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
      }),
      signal: controller1.signal
    }).finally(() => clearTimeout(timeout1));

    let data = await response.json().catch(() => ({}));

    // Se a API não retornar ok, ou não tiver QR code na primeira tentativa
    let qrcodeBase64 = data?.hash?.qrcode || data?.qrcode?.base64;

    if (!response.ok || !qrcodeBase64) {
      const errorMsg = data.message || data.error || 'Erro desconhecido na Evolution API';
      const controller2 = new AbortController();
      const timeout2 = setTimeout(() => controller2.abort(), 5000);

      const connectResponse = await fetch(`${baseUrl}/instance/connect/${instanceName}`, {
        method: 'GET',
        headers: {
          'apikey': apiKey
        },
        signal: controller2.signal
      }).finally(() => clearTimeout(timeout2));
      const connectData = await connectResponse.json();
      
      if (!connectResponse.ok && connectData.error !== 'Instance already connected' && !connectData?.instance?.state) {
         return NextResponse.json({ error: 'Erro ao conectar à instância: ' + JSON.stringify(connectData) }, { status: 500 });
      }

      qrcodeBase64 = connectData?.hash?.qrcode || connectData?.qrcode?.base64 || connectData?.base64;

      if (qrcodeBase64) {
        return NextResponse.json({ qrcode: { base64: `data:image/png;base64,${qrcodeBase64.replace(/^data:image\/png;base64,/, '')}` } });
      } else if (connectData.instance?.state === 'open' || connectData.instance?.status === 'open' || connectData.error === 'Instance already connected') {
        return NextResponse.json({ instance: { state: 'open' } });
      } else {
        // Fallback pra retornar o que quer que tenha vindo
        return NextResponse.json(connectData);
      }
    }

    return NextResponse.json({
      instance: data.instance,
      qrcode: { base64: `data:image/png;base64,${qrcodeBase64.replace(/^data:image\/png;base64,/, '')}` }
    });

  } catch (error: any) {
    console.error('[WhatsApp Setup API] Erro:', error);
    return NextResponse.json(
      { error: `Falha na conexão com a Evolution API em ${process.env.EVOLUTION_API_URL}. O servidor pode estar offline ou inacessível. Detalhe: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const profile = await getCurrentProfile();
    if (!profile || profile.role !== 'ADMIN') return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const apiUrl = process.env.EVOLUTION_API_URL;
    const apiKey = process.env.EVOLUTION_API_KEY;
    const instanceName = process.env.EVOLUTION_INSTANCE_NAME;

    if (!apiUrl || !apiKey || !instanceName) return NextResponse.json({ error: 'Faltam vars de ambiente' }, { status: 400 });

    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${baseUrl}/instance/connectionState/${instanceName}`, {
      headers: { 'apikey': apiKey },
      signal: controller.signal
    }).finally(() => clearTimeout(timeoutId));
    
    if (!response.ok) return NextResponse.json({ state: 'disconnected' });
    
    const data = await response.json();
    return NextResponse.json({ state: data?.instance?.state || 'disconnected' });
  } catch (error: any) {
    console.error('[WhatsApp Setup GET] Erro:', error);
    return NextResponse.json({ state: 'error', error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const profile = await getCurrentProfile();
    if (!profile || profile.role !== 'ADMIN') return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const apiUrl = process.env.EVOLUTION_API_URL;
    const apiKey = process.env.EVOLUTION_API_KEY;
    const instanceName = process.env.EVOLUTION_INSTANCE_NAME;

    if (!apiUrl || !apiKey || !instanceName) return NextResponse.json({ error: 'Faltam vars de ambiente' }, { status: 400 });

    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    // Tenta fazer o logout gentilmente primeiro
    await fetch(`${baseUrl}/instance/logout/${instanceName}`, {
      method: 'DELETE',
      headers: { 'apikey': apiKey }
    }).catch(() => {});

    // Em seguida, força a DELEÇÃO da instância para desbugar/descongelar a Evolution API
    const response = await fetch(`${baseUrl}/instance/delete/${instanceName}`, {
      method: 'DELETE',
      headers: { 'apikey': apiKey }
    });

    if (!response.ok) {
       const err = await response.json().catch(()=>({}));
       console.error('[WhatsApp Setup DELETE] Erro ao deletar instância:', err, response.status);
       
       // Se a instância já não existir ou a API retornar 400 (Bad Request) ao deletar algo inexistente, é sucesso!
       if (response.status === 404 || response.status === 400) {
         return NextResponse.json({ success: true });
       }

       return NextResponse.json({ error: err.message || err.error || 'Erro ao deletar instância na Evolution API' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[WhatsApp Setup DELETE] Catch:', error);
    return NextResponse.json({ error: 'Erro interno ao desconectar' }, { status: 500 });
  }
}
