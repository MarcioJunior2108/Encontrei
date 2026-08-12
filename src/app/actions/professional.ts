'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateProfessionalProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: 'Não autorizado.' };
  
  const headline = formData.get('headline') as string;
  const bio = formData.get('bio') as string;
  const city = formData.get('city') as string;
  const state = formData.get('state') as string;
  const basePrice = formData.get('basePrice') ? Number(formData.get('basePrice')) : null;
  const avatarFile = formData.get('avatar') as File | null;
  
  let avatarUrl: string | undefined = undefined;
  if (avatarFile && avatarFile.size > 0) {
    const arrayBuffer = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    avatarUrl = `data:${avatarFile.type};base64,${base64}`;
  }
  
  try {
    await prisma.professional.update({
      where: { userId: user.id },
      data: {
        headline,
        bio,
        basePrice,
        profile: {
          update: {
            city,
            state,
            ...(avatarUrl && { avatarUrl })
          }
        }
      }
    });
    
    revalidatePath('/profissional');
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar perfil do profissional:', error);
    return { error: 'Falha ao salvar as informações.' };
  }
}
