'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentProfile } from './user';
import { redirect } from 'next/navigation';

export async function completeOnboarding(formData: FormData) {
  const profile = await getCurrentProfile();
  if (!profile) throw new Error('Não autenticado');

  const city = formData.get('city') as string;
  const state = formData.get('state') as string;
  const phone = formData.get('phone') as string;
  
  // For professionals
  const headline = formData.get('headline') as string;

  try {
    // Update Profile
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        city,
        state,
        phone,
      }
    });

    // If professional, update headline
    if (profile.role === 'PROFESSIONAL' && headline) {
      await prisma.professional.update({
        where: { userId: profile.id },
        data: {
          headline,
        }
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error('Failed to complete onboarding:', error);
    return { error: 'Ocorreu um erro ao salvar seus dados.' };
  }
}
