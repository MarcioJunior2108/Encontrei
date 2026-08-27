import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

// Instância única baseada no token (usado para gerar pagamentos)
const mpToken = process.env.MP_ACCESS_TOKEN || '';

export const mercadopago = new MercadoPagoConfig({
  accessToken: mpToken,
  options: {
    timeout: 5000,
    idempotencyKey: 'acheiyou-app-v1'
  }
});

export const mpPreference = new Preference(mercadopago);
export const mpPayment = new Payment(mercadopago);
