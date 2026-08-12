import { NextResponse } from 'next';
import { mpPreference } from '@/lib/mercadopago';
import { getCurrentProfile } from '@/app/actions/user';

export async function POST(request: Request) {
  try {
    const profile = await getCurrentProfile();
    if (!profile || profile.role !== 'PROFESSIONAL') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, description, type } = body;

    // Se a chave não existir no .env, devolvemos um link fake para testes locais
    if (!process.env.MP_ACCESS_TOKEN) {
      return NextResponse.json({
        init_point: 'https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=TEST-FAKE-ID',
        id: 'TEST-FAKE-ID'
      });
    }

    // Criar a preferência real de pagamento
    const result = await mpPreference.create({
      body: {
        items: [
          {
            id: type, // ex: 'ADD_FUNDS' ou 'UPGRADE_PRO'
            title: description,
            quantity: 1,
            unit_price: Number(amount),
            currency_id: 'BRL',
          }
        ],
        payer: {
          email: profile.email,
          name: profile.name || 'Profissional',
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/profissional?payment=success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/profissional?payment=failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/profissional?payment=pending`
        },
        auto_return: 'approved',
        external_reference: profile.id, // Para sabermos de quem é o pagamento no Webhook
      }
    });

    return NextResponse.json({
      id: result.id,
      init_point: result.init_point, // Link para o checkout
    });
  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: 'Erro ao gerar pagamento' }, { status: 500 });
  }
}
