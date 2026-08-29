'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentProfile } from './user';
import { revalidatePath } from 'next/cache';

/**
 * Tenta desbloquear um lead usando o crédito gratuito do profissional.
 * Se freeLeadsUsed === 0: desbloqueia grátis e incrementa o contador.
 * Se freeLeadsUsed >= 1: retorna erro para o frontend redirecionar ao pagamento.
 */
export async function unlockLeadFree(requestId: string) {
  const profile = await getCurrentProfile();
  if (!profile) return { error: 'Não autorizado.' };

  const professional = await prisma.professional.findUnique({
    where: { userId: profile.id },
    select: { id: true, freeLeadsUsed: true },
  });

  if (!professional) return { error: 'Perfil profissional não encontrado.' };

  // Já usou o crédito gratuito — exige pagamento
  if (professional.freeLeadsUsed >= 1) {
    return { error: 'FREE_LEAD_USED', needsPayment: true };
  }

  // Verificar se o request pertence a este profissional
  const request = await prisma.serviceRequest.findFirst({
    where: { id: requestId, professionalId: professional.id },
  });

  if (!request) return { error: 'Solicitação não encontrada.' };
  if (request.isUnlocked) return { success: true, alreadyUnlocked: true };

  // Desbloquear gratuitamente + incrementar contador
  await prisma.$transaction([
    prisma.serviceRequest.update({
      where: { id: requestId },
      data: { isUnlocked: true },
    }),
    prisma.professional.update({
      where: { id: professional.id },
      data: { freeLeadsUsed: 1 },
    }),
  ]);

  revalidatePath('/profissional');
  return { success: true, wasFree: true };
}
