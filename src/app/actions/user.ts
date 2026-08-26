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
