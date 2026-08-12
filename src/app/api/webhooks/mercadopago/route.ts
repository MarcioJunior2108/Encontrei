import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

const mpConfig = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});
const paymentClient = new Payment(mpConfig);

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const topic = searchParams.get('topic') || searchParams.get('type');
    let id = searchParams.get('id') || searchParams.get('data.id');

    // Tentar pegar do body se não vier nos query params
    if (!id) {
      try {
        const body = await req.json();
        id = body?.data?.id;
      } catch (e) {
        // Ignora erro de JSON vazio
      }
    }

    if ((topic === 'payment' || topic === 'payment.created' || topic === 'payment.updated') && id) {
      const paymentInfo = await paymentClient.get({ id: String(id) });

      if (paymentInfo.status === 'approved') {
        const type = paymentInfo.metadata?.type;
        const requestId = paymentInfo.metadata?.request_id || paymentInfo.metadata?.requestId;
        const professionalId = paymentInfo.metadata?.professional_id || paymentInfo.metadata?.professionalId;

        if (type === 'UNLOCK_LEAD' && requestId) {
          // Desbloquear o pedido
          await prisma.serviceRequest.update({
            where: { id: requestId },
            data: { isUnlocked: true },
          });

          console.log(`Pedido ${requestId} desbloqueado pelo profissional ${professionalId} via Mercado Pago`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Mercado Pago Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
