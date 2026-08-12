import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-07-29.dahlia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Faltando Stripe signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: 'Verificação de assinatura falhou' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const type = session.metadata?.type;
      const requestId = session.metadata?.requestId;
      const professionalId = session.metadata?.professionalId;

      if (session.payment_status === 'paid' && type === 'UNLOCK_LEAD' && requestId) {
        // Desbloquear o pedido
        await prisma.serviceRequest.update({
          where: { id: requestId },
          data: { isUnlocked: true },
        });

        // Opcional: Adicionar ao histórico de pagamentos, descontar taxa, etc.
        console.log(`Pedido ${requestId} desbloqueado pelo profissional ${professionalId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
