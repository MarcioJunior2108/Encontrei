'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentProfile } from './user';
import { revalidatePath } from 'next/cache';
import { sanitizeContactInfo } from '@/lib/sanitizer';
import { sendWhatsappNotification } from '@/lib/whatsapp';

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

    // Webhook Logic para Shadow Profiles
    const targetProfessional = await prisma.professional.findUnique({
      where: { id: professionalId },
      include: { profile: true }
    });

    if (targetProfessional?.profile.status === 'UNCLAIMED' && targetProfessional.profile.phone) {
      try {
        const magicLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/claim?token=${targetProfessional.profile.claimToken}`;
        
        const messageText = `*Encontrei - Novo Orçamento!*\n\nOlá ${targetProfessional.profile.name || 'Profissional'}! Temos um cliente (${clientProfile.name}) interessado nos seus serviços agora mesmo na nossa plataforma.\n\nPara visualizar os detalhes do pedido e responder ao cliente, você precisa ativar o seu perfil gratuito.\n\n*Clique no link abaixo para assumir seu perfil e ver o pedido:*\n${magicLink}\n\nEstamos aguardando você! 🚀`;

        await sendWhatsappNotification({
          phone: targetProfessional.profile.phone,
          message: messageText
        });

      } catch (webhookErr) {
        console.error('Falha ao disparar whatsapp para shadow profile', webhookErr);
      }
    }

    revalidatePath('/dashboard');
    revalidatePath('/profissional');

    return { success: true };
  } catch (error: any) {
    console.error('Error creating service request:', error);
    return { error: 'Ocorreu um erro ao enviar sua solicitação.' };
  }
}
