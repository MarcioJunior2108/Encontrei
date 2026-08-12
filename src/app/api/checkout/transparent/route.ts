import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { getCurrentProfile } from '@/app/actions/user';

const mpConfig = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});
const paymentClient = new Payment(mpConfig);

export async function POST(request: Request) {
  try {
    const profile = await getCurrentProfile();
    if (!profile || (profile.role !== 'PROFESSIONAL' && profile.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
    }

    const body = await request.json();
    const { formData, metadata } = body;

    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      return NextResponse.json({ error: 'Mercado Pago não configurado' }, { status: 500 });
    }

    // Attach metadata securely
    const paymentData = {
      ...formData,
      metadata: {
        ...metadata,
        professionalId: profile.id,
      },
      payer: {
        ...formData.payer,
        email: profile.email,
      },
    };

    const mpResponse = await paymentClient.create({
      body: paymentData
    });

    return NextResponse.json({
      status: mpResponse.status,
      status_detail: mpResponse.status_detail,
      id: mpResponse.id,
    });

  } catch (error: any) {
    console.error('Transparent Checkout Error:', error);
    return NextResponse.json({ error: 'Erro ao processar pagamento' }, { status: 500 });
  }
}
