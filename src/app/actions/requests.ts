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
      
      // Montar a mensagem exatamente como fazíamos no painel
      let message = `*AcheiYou - Novo Orçamento!*\n\nOlá ${professionalName}! Sou da plataforma AcheiYou. Temos um cliente (${clientName}) precisando de um serviço seu agora mesmo!\n\n`;

      if (isUnclaimed) {
        const claimToken = professional.profile.claimToken;
        const magicLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://seu-site.com.br'}/claim?token=${claimToken}`;
        message += `Para visualizar os detalhes do pedido e responder ao cliente, você precisa ativar o seu perfil gratuito.\n\n*Clique no link abaixo para assumir seu perfil e ver o pedido:*\n${magicLink}\n\nEstamos aguardando você! 🚀`;
      } else {
        const loginLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://seu-site.com.br'}/login`;
        message += `Para visualizar os detalhes do pedido e responder ao cliente, acesse agora mesmo o seu painel em nosso site.\n\n*Clique no link abaixo para fazer login e ver o pedido:*\n${loginLink}\n\nEstamos aguardando você! 🚀`;
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
