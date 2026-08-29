import { NextResponse } from 'next/server';
import { getCurrentProfile } from '@/app/actions/user';
import { sendAutomatedWhatsAppMessage } from '@/lib/whatsapp';

export async function POST(req: Request) {
  try {
    const profile = await getCurrentProfile();
    
    if (!profile || profile.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { phone, message } = await req.json();

    if (!phone || !message) {
      return NextResponse.json({ error: 'Telefone e mensagem são obrigatórios' }, { status: 400 });
    }

    // Usa exatamente a mesma função do disparo automático (requests.ts)
    // — formatação de telefone, delay, "digitando..." — tudo centralizado
    const result = await sendAutomatedWhatsAppMessage(phone, message);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Erro ao enviar via Evolution API' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('[Broadcast Send API] Erro:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar disparo.' },
      { status: 500 }
    );
  }
}
