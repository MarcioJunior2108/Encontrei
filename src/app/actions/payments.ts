'use server';

import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const mpConfig = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});
const paymentClient = new Payment(mpConfig);

export async function verifyPaymentStatus(paymentId: string) {
  try {
    const paymentInfo = await paymentClient.get({ id: paymentId });

    if (paymentInfo.status === 'approved') {
      const type = paymentInfo.metadata?.type;
      const requestId = paymentInfo.metadata?.request_id || paymentInfo.metadata?.requestId;
      const professionalId = paymentInfo.metadata?.professional_id || paymentInfo.metadata?.professionalId;

      if (type === 'UNLOCK_LEAD' && requestId) {
        // Verifica se já não está desbloqueado para evitar processamento duplo
        const request = await prisma.serviceRequest.findUnique({
          where: { id: requestId },
        });

        if (!request?.isUnlocked) {
          await prisma.serviceRequest.update({
            where: { id: requestId },
            data: { isUnlocked: true },
          });
          console.log(`Pedido ${requestId} desbloqueado via verificação manual (Localhost/Fallback)`);
        }
      } else if (type === 'UPGRADE_PRO' && professionalId) {
        await prisma.professional.update({
          where: { userId: professionalId },
          data: { planType: 'PRO' }
        });
      } else if (type === 'ADD_FUNDS' && professionalId) {
        // Lógica de ADD_FUNDS omitida por simplicidade para não dar conflito,
        // mas seria importante não adicionar fundos duplamente. O ideal é 
        // ter uma tabela de transações para evitar double-spending.
      }
      
      // Registrar a transação para auditoria e cálculo de receita
      if (professionalId) {
        const mercadopagoId = String(paymentId);
        const existingTransaction = await prisma.transaction.findUnique({
          where: { mercadopagoId }
        });

        if (!existingTransaction) {
          // O professionalId do metadata é na verdade o userId (Profile.id). 
          // Precisamos buscar o ID correto da tabela Professional.
          const profRecord = await prisma.professional.findUnique({
            where: { userId: professionalId }
          });

          if (profRecord) {
            await prisma.transaction.create({
              data: {
                professionalId: profRecord.id,
                amount: paymentInfo.transaction_amount || 0,
                type: type || 'UNKNOWN',
                paymentMethod: paymentInfo.payment_method_id || 'unknown',
                mercadopagoId
              }
            });
            console.log(`[Pagamentos] Transação registrada com sucesso para o profissional ${profRecord.id}`);
          } else {
            console.error(`[Pagamentos] Profissional não encontrado para o userId: ${professionalId}`);
          }
        }
      }

      revalidatePath('/profissional');
      return { success: true, status: 'approved' };
    }

    return { success: true, status: paymentInfo.status };
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    return { success: false, error: 'Não foi possível verificar o pagamento.' };
  }
}
