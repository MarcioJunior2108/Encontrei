import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getCurrentProfile } from '@/app/actions/user';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-07-29.dahlia',
});

export async function POST(request: Request) {
  try {
    const profile = await getCurrentProfile();
    if (!profile || profile.role !== 'PROFESSIONAL') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, description, type, requestId } = body;

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({
        url: 'https://sandbox.stripe.com/checkout/test-fake-id',
        id: 'TEST-FAKE-ID'
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'pix'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: description,
              description: `Acesso ao lead no Encontrei App`,
            },
            unit_amount: Math.round(Number(amount) * 100), // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/profissional?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/profissional?payment=failure`,
      customer_email: profile.email,
      metadata: {
        type: type, // 'UNLOCK_LEAD'
        requestId: requestId || '',
        professionalId: profile.id,
      },
    });

    return NextResponse.json({
      id: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: 'Erro ao gerar pagamento com Stripe' }, { status: 500 });
  }
}
