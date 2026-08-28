'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { RequestStatus, MilestoneStatus, TransactionStatus } from '@prisma/client';

/**
 * Cria uma solicitação de serviço com as etapas (Milestones) e gera a transação de Escrow
 */
export async function createEscrowContract(data: {
  professionalId: string;
  description: string;
  totalAmount: number;
  milestones: Array<{ description: string; percentage: number }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autorizado.' };

  // Validar porcentagens
  const totalPercentage = data.milestones.reduce((acc, curr) => acc + curr.percentage, 0);
  if (totalPercentage !== 100) {
    return { error: 'A soma das porcentagens das etapas deve ser exatamente 100%.' };
  }

  try {
    // Usamos transação do prisma para garantir que Request, Milestones e Transaction são criados juntos
    const result = await prisma.$transaction(async (tx) => {
      // 1. Criar a Solicitação
      const request = await tx.serviceRequest.create({
        data: {
          clientId: user.id,
          professionalId: data.professionalId,
          description: data.description,
          proposedPrice: data.totalAmount,
          status: RequestStatus.ACCEPTED, // Assumindo que já houve negociação prévia
          isUnlocked: true,
          milestones: {
            create: data.milestones.map((m) => ({
              description: m.description,
              amountPercentage: m.percentage,
              status: MilestoneStatus.PENDING
            }))
          }
        },
        include: { milestones: true }
      });

      // 2. Criar a Transação "Escrow" (Dinheiro preso na plataforma)
      const transaction = await tx.transaction.create({
        data: {
          professionalId: data.professionalId,
          amount: data.totalAmount,
          type: 'ESCROW_PAYMENT',
          paymentMethod: 'pix',
          status: TransactionStatus.ESCROW,
        }
      });

      return { request, transaction };
    });

    revalidatePath('/dashboard');
    return { success: true, contractId: result.request.id };
  } catch (error) {
    console.error('Erro ao criar contrato de Escrow:', error);
    return { error: 'Falha ao criar o contrato e transação.' };
  }
}

/**
 * Profissional envia a foto comprovando que a etapa foi concluída
 */
export async function submitMilestoneProof(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autorizado.' };

  const milestoneId = formData.get('milestoneId') as string;
  const proofFile = formData.get('proofImage') as File | null;

  if (!milestoneId || !proofFile || proofFile.size === 0) {
    return { error: 'É obrigatório enviar a foto para comprovação.' };
  }

  try {
    // 1. Verificar se o profissional é o dono do request deste milestone
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { request: true }
    });

    if (!milestone) return { error: 'Etapa não encontrada.' };

    const professional = await prisma.professional.findUnique({
      where: { userId: user.id }
    });

    if (milestone.request.professionalId !== professional?.id) {
      return { error: 'Acesso negado.' };
    }

    // 2. Processar a imagem (Em produção, o ideal é salvar no Supabase Storage e pegar a URL)
    const arrayBuffer = await proofFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const proofImageUrl = `data:${proofFile.type};base64,${base64}`;

    // 3. Atualizar o Milestone
    await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        status: MilestoneStatus.AWAITING_VERIFICATION,
        proofImageUrl
      }
    });

    // TODO: Aqui entraria o Épico 2 - Onde a IA do GPT-4 Vision valida se a imagem confere com a descrição!

    revalidatePath('/profissional');
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar prova da etapa:', error);
    return { error: 'Falha ao enviar a comprovação.' };
  }
}

/**
 * Cliente (ou IA) aprova a etapa e libera os fundos (Release)
 */
export async function approveMilestone(milestoneId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autorizado.' };

  try {
    // Usar transação para transferir os fundos e atualizar status simultaneamente
    await prisma.$transaction(async (tx) => {
      const milestone = await tx.milestone.findUnique({
        where: { id: milestoneId },
        include: { request: { include: { professional: true } } }
      });

      if (!milestone || milestone.request.clientId !== user.id) {
        throw new Error('Acesso negado ou etapa inexistente.');
      }

      if (milestone.status !== MilestoneStatus.AWAITING_VERIFICATION) {
        throw new Error('Esta etapa não está aguardando verificação.');
      }

      // 1. Atualizar Milestone para COMPLETED
      await tx.milestone.update({
        where: { id: milestoneId },
        data: { status: MilestoneStatus.COMPLETED }
      });

      // 2. Calcular a fatia do valor com base na porcentagem
      const totalAmount = milestone.request.proposedPrice ? Number(milestone.request.proposedPrice) : 0;
      const milestoneValue = (totalAmount * milestone.amountPercentage) / 100;

      // Subtrair a Taxa da Plataforma (Take Rate) antes de transferir para a carteira
      const platformFee = 0.15; // 15%
      const netValue = milestoneValue * (1 - platformFee);

      // 3. Atualizar a carteira do profissional
      await tx.professional.update({
        where: { id: milestone.request.professionalId },
        data: {
          walletBalance: { increment: netValue }
        }
      });

      // 4. Criar registro de liberação na transação
      await tx.transaction.create({
        data: {
          professionalId: milestone.request.professionalId,
          amount: netValue,
          type: 'MILESTONE_RELEASE',
          paymentMethod: 'escrow_wallet',
          status: TransactionStatus.RELEASED,
        }
      });
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao aprovar etapa:', error);
    return { error: error.message || 'Falha ao liberar os fundos.' };
  }
}
