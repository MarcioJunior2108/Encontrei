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

export async function completeMiniOnboarding(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: 'Usuário não autenticado.' };
  }

  const phone = formData.get('phone') as string;
  const headline = formData.get('headline') as string;
  const bio = formData.get('bio') as string;
  const city = formData.get('city') as string;
  const state = formData.get('state') as string;

  try {
    const profile = await prisma.profile.findUnique({ where: { id: user.id } });
    
    // Atualiza Profile (telefone, cidade, estado se fornecidos)
    const profileUpdateData: any = {};
    if (phone) profileUpdateData.phone = phone;
    if (city) profileUpdateData.city = city;
    if (state) profileUpdateData.state = state;

    if (Object.keys(profileUpdateData).length > 0) {
      await prisma.profile.update({
        where: { id: user.id },
        data: profileUpdateData
      });
    }

    if (profile?.role === 'PROFESSIONAL' && headline) {
      await prisma.professional.update({
        where: { userId: user.id },
        data: { headline, bio: bio || null }
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao completar mini onboarding:', error);
    return { success: false, error: 'Erro ao salvar os dados. Tente novamente.' };
  }
}

export async function upgradeToProfessional(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: 'Usuário não autenticado.' };
  }

  const service = formData.get('service') as string;
  const city = formData.get('city') as string;

  if (!service || !city) {
    return { success: false, error: 'Por favor, preencha o serviço e a cidade.' };
  }

  try {
    // 1. Atualizar o Profile com a cidade e o role
    await prisma.profile.update({
      where: { id: user.id },
      data: { 
        role: 'PROFESSIONAL',
        city: city
      }
    });

    // 2. Criar o registro Professional (apenas os campos que existem no schema)
    await prisma.professional.create({
      data: {
        userId: user.id,
        headline: service, // "service" é salvo como headline
        walletBalance: 0,
        planType: 'BASIC',
        verificationStatus: 'UNVERIFIED',
        availability: 'AVAILABLE'
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar para conta profissional:', error);
    return { success: false, error: 'Ocorreu um erro ao atualizar sua conta. Tente novamente.' };
  }
}
