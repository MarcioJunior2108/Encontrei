'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentProfile } from './user';
import { revalidatePath } from 'next/cache';
import { sanitizeContactInfo } from '@/lib/sanitizer';

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

    if (targetProfessional?.profile.status === 'UNCLAIMED') {
      try {
        const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL || 'https://webhook.site/placeholder';
        const magicLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/claim?token=${targetProfessional.profile.claimToken}`;
        
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'new_request_unclaimed',
            professional: {
              name: targetProfessional.profile.name,
              phone: targetProfessional.profile.phone,
            },
            client: {
              name: clientProfile.name,
            },
            magicLink,
          })
        });
      } catch (webhookErr) {
        console.error('Falha ao disparar webhook para shadow profile', webhookErr);
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
