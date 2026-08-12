import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getCurrentProfile } from '@/app/actions/user';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-07-29.dahlia', // Mantido para caso precisemos do Stripe depois
});

// Configuração do Mercado Pago
const mpConfig = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});
const preference = new Preference(mpConfig);

export async function POST(request: Request) {
  try {
    const profile = await getCurrentProfile();
    if (!profile || (profile.role !== 'PROFESSIONAL' && profile.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, description, type, requestId, provider = 'mercadopago' } = body;

    // Se explicitly for 'stripe', usa o código antigo do stripe
    if (provider === 'stripe') {
      if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json({
          url: 'https://sandbox.stripe.com/checkout/test-fake-id',
          id: 'TEST-FAKE-ID'
        });
      }

      const session = await stripe.checkout.sessions.create({
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
    }

    // Mercado Pago como padrão (provider === 'mercadopago')
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      // Mock for local dev when no token provided
      return NextResponse.json({
        id: 'TEST-MP-FAKE-ID',
        url: 'https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=TEST-FAKE-ID'
      });
    }

    const mpResponse = await preference.create({
      body: {
        items: [
          {
            id: type,
            title: description,
            description: `Acesso ao lead no Encontrei App`,
            quantity: 1,
            unit_price: Number(amount), // Mercado Pago usa o valor real (não centavos)
            currency_id: 'BRL',
          }
        ],
        payer: {
          email: profile.email,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/profissional?payment=success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/profissional?payment=failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/profissional?payment=pending`,
        },
        auto_return: 'approved',
        metadata: {
          type: type,
          requestId: requestId || '',
          professionalId: profile.id,
        },
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`
      }
    });

    return NextResponse.json({
      id: mpResponse.id,
      url: process.env.NODE_ENV === 'production' ? mpResponse.init_point : mpResponse.sandbox_init_point, 
    });

  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: 'Erro ao gerar pagamento' }, { status: 500 });
  }
}
