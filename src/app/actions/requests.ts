'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { getCurrentProfile } from './user';
import { revalidatePath } from 'next/cache';
import { sanitizeContactInfo } from '@/lib/sanitizer';
import { sendAutomatedWhatsAppMessage } from '@/lib/whatsapp';

export async function createServiceRequest({ 
  professionalId, 
  description, 
  date,
  imageUrl,
  aiDiagnosis,
  isPremiumLead,
  coinPrice = 15
}: { 
  professionalId: string, 
  description: string, 
  date: string,
  imageUrl?: string,
  aiDiagnosis?: any,
  isPremiumLead?: boolean,
  coinPrice?: number
}) {
  try {
    const clientProfile = await getCurrentProfile();
    
    if (!clientProfile) {
      return { error: 'Você precisa estar logado para solicitar um orçamento.' };
    }

    if (clientProfile.role !== 'CLIENT') {
      return { error: 'Apenas perfis de clientes podem solicitar serviços.' };
    }

    const safeDescription = sanitizeContactInfo(description);

    const newRequest = await prisma.serviceRequest.create({
      data: {
        clientId: clientProfile.id,
        professionalId,
        description: safeDescription,
        scheduledDate: date ? new Date(date) : null,
        imageUrl,
        aiDiagnosis: aiDiagnosis || undefined,
        isPremiumLead: isPremiumLead || false,
        coinPrice: 15, // Valor fixo de 15 moedas para todos os leads
      }
    });

    // Enviar mensagem no WhatsApp automatizada
    const professional = await prisma.professional.findUnique({
      where: { id: professionalId },
      include: { profile: true }
    });

    if (professional && professional.profile.phone) {
      const isUnclaimed = professional.profile.status === 'UNCLAIMED';
      const professionalName = professional.profile.name || 'Profissional';
      const clientName = clientProfile.name || 'Um cliente';
      
      // Copy AIDA: 2 versões — com free lead e sem
      const firstName = professionalName.split(' ')[0];
      const hasFreeLeadAvailable = professional.freeLeadsUsed === 0;
      let message: string;

      if (hasFreeLeadAvailable) {
        // Versão A: Profissional ainda tem o chat gratuito disponível
        message = `🎁 *${firstName}, seu primeiro chat é GRATUITO!*\n\nUm cliente na sua região pediu um orçamento agora. Você pode conversar com ele direto pelo chat da AcheiYou sem pagar nada.`;
        if (isPremiumLead) {
          message += `\n\n📸 _O cliente enviou uma foto detalhada — lead qualificado!_`;
        }
        message += `\n\n⏰ Não perca essa oportunidade — seja o primeiro a responder!`;
      } else {
        // Versão B: Já usou o gratuito
        message = `🚨 *${firstName}, você tem um cliente esperando!*\n\nAlguém na sua região está buscando exatamente o seu serviço e pediu um orçamento agora.`;
        if (isPremiumLead) {
          message += `\n\n📸 _O cliente enviou uma foto detalhada do problema — lead qualificado!_`;
        }
        message += `\n\n⚡ *Seja o primeiro a responder e feche o serviço antes da concorrência.*`;
      }

      if (isUnclaimed) {
        const claimToken = professional.profile.claimToken;
        const magicLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.acheiyou.com.br'}/claim?token=${claimToken}`;
        message += `\n\n👉 ${hasFreeLeadAvailable ? 'Conversar agora (grátis)' : 'Ver o pedido agora'}:\n${magicLink}`;
      } else {
        const loginLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.acheiyou.com.br'}/profissional`;
        message += `\n\n👉 ${hasFreeLeadAvailable ? 'Conversar agora (grátis)' : 'Ver o pedido agora'}:\n${loginLink}`;
      }

      // Envia de forma não bloqueante (não usamos await se não quisermos segurar o carregamento, 
      // mas como é Vercel, precisamos do await para a função não ser morta)
      await sendAutomatedWhatsAppMessage(professional.profile.phone, message);
    }

    revalidatePath('/dashboard');
    revalidatePath('/profissional');
    revalidatePath('/admin', 'layout');

    return { success: true };
  } catch (error: any) {
    console.error('Error creating service request:', error);
    return { error: 'Ocorreu um erro ao enviar sua solicitação.' };
  }
}

export async function updateRequestStatus(requestId: string, status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED') {
  const profile = await getCurrentProfile();
  
  if (!profile) {
    return { error: 'Não autorizado.' };
  }

  try {
    const request = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: { professional: true }
    });

    if (!request) {
      return { error: 'Solicitação não encontrada.' };
    }

    // Verifica se é o profissional dono da solicitação (para aceitar/rejeitar/concluir)
    // ou se é o cliente dono da solicitação (para cancelar)
    const isProfessional = request.professional.userId === profile.id;
    const isClient = request.clientId === profile.id;

    if (!isProfessional && !isClient) {
      return { error: 'Não autorizado para modificar esta solicitação.' };
    }

    if (isClient && status !== 'CANCELLED') {
      return { error: 'Cliente só pode cancelar a solicitação.' };
    }

    if (isProfessional && status === 'CANCELLED') {
      return { error: 'Profissional não pode cancelar, deve rejeitar.' };
    }

    const updatedRequest = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: { status, isUnlocked: status === 'ACCEPTED' ? true : request.isUnlocked },
    });

    revalidatePath('/dashboard');
    revalidatePath('/profissional');

    return { success: true, data: updatedRequest };
  } catch (error: any) {
    console.error('Error updating request:', error);
    return { error: 'Falha ao atualizar solicitação.' };
  }
}
