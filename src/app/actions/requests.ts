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
  date 
}: { 
  professionalId: string, 
  description: string, 
  date: string 
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
        // The status defaults to PENDING
        // isUnlocked defaults to false
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
      let message = `*Encontrei - Novo Orçamento!*\n\nOlá ${professionalName}! Sou da plataforma Encontrei. Temos um cliente (${clientName}) precisando de um serviço seu agora mesmo!\n\n`;

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
