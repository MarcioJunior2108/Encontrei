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

    const result = await sendAutomatedWhatsAppMessage(phone, message);

    if (!result.success) {
      // Se a sessão foi perdida, retorna status 503 para o frontend detectar e pausar
      const statusCode = result.errorCode === 'SESSION_LOST' ? 503 : 500;
      return NextResponse.json(
        { error: result.error || 'Erro ao enviar via Evolution API', errorCode: result.errorCode },
        { status: statusCode }
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
