'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function getCurrentProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  let profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { professional: true }
  });
  
  if (!profile) {
    try {
      if (user.email) {
        const existingProfile = await prisma.profile.findUnique({
          where: { email: user.email }
        });
        if (existingProfile && existingProfile.id !== user.id) {
          const profileId = existingProfile.id;

          // Cascade delete chat messages and service requests where they are clients
          await prisma.chatMessage.deleteMany({
            where: { senderId: profileId }
          });
          await prisma.serviceRequest.deleteMany({
            where: { clientId: profileId }
          });

          // Check for professional profile and cascade delete its relations
          const professional = await prisma.professional.findUnique({
            where: { userId: profileId },
            select: { id: true }
          });

          if (professional) {
            await prisma.serviceRequest.deleteMany({
              where: { professionalId: professional.id }
            });
            await prisma.transaction.deleteMany({
              where: { professionalId: professional.id }
            });
            await prisma.professional.delete({
              where: { id: professional.id }
            });
          }

          // Finally, delete the old profile
          await prisma.profile.delete({ where: { id: profileId } });
        }
      }

      profile = await prisma.profile.create({
        data: {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          role: 'CLIENT',
        },
        include: { professional: true }
      });
    } catch (error) {
      console.error('Falha ao auto-criar perfil no Prisma:', error);
      return null;
    }
  }

  if (!profile) return null;

  // Converter campos Decimal para Number para evitar erro em Client Components
  const serializedProfile = {
    ...profile,
    professional: profile.professional ? {
      ...profile.professional,
      walletBalance: profile.professional.walletBalance ? Number(profile.professional.walletBalance) : 0,
      basePrice: profile.professional.basePrice ? Number(profile.professional.basePrice) : null,
    } : null
  };

  return serializedProfile;
}

export async function updateUserPhone(phone: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: 'Usuário não autenticado.' };
  }

  try {
    await prisma.profile.update({
      where: { id: user.id },
      data: { phone }
    });
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar telefone:', error);
    return { success: false, error: 'Erro ao salvar o telefone. Tente novamente.' };
  }
}
