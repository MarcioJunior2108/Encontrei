'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function getCurrentProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { professional: true }
  });
  
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
