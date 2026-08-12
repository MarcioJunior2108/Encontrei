import { NextResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { mpPayment } from '@/lib/mercadopago';

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const topic = url.searchParams.get('topic') || url.searchParams.get('type');
    const id = url.searchParams.get('id') || url.searchParams.get('data.id');

    if (topic === 'payment' && id) {
      // Buscar os detalhes completos do pagamento na API do Mercado Pago
      const paymentInfo = await mpPayment.get({ id });

      if (paymentInfo.status === 'approved') {
        const userId = paymentInfo.external_reference;
        const amount = paymentInfo.transaction_amount;
        const itemType = paymentInfo.additional_info?.items?.[0]?.id; // 'ADD_FUNDS' ou 'UPGRADE_PRO'

        if (userId && amount) {
          if (itemType === 'UPGRADE_PRO') {
            await prisma.professional.update({
              where: { userId },
              data: { planType: 'PRO' }
            });
          } else {
            // Adicionar saldo na carteira
            await prisma.professional.update({
              where: { userId },
              data: {
                walletBalance: {
                  increment: amount
                }
              }
            });
          }
          console.log(`Pagamento de R$${amount} aprovado para o usuário ${userId}`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
