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
  console.log('--- DEBUG AVATAR UPLOAD ---');
  console.log('Avatar File exists?', !!avatarFile);
  console.log('Avatar File size:', avatarFile?.size);
  console.log('Avatar File type:', avatarFile?.type);
  
  let avatarUrl: string | undefined = undefined;
  if (avatarFile && avatarFile.size > 0) {
    const arrayBuffer = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    avatarUrl = `data:${avatarFile.type};base64,${base64}`;
    console.log('Avatar URL generated! Length:', avatarUrl.length);
  } else {
    console.log('No avatar file provided or size is 0.');
  }
  console.log('---------------------------');
  
  try {
    await prisma.profile.update({
      where: { id: user.id },
      data: {
        city,
        state,
        ...(avatarUrl && { avatarUrl })
      }
    });

    await prisma.professional.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        headline,
        bio,
        basePrice,
      },
      update: {
        headline,
        bio,
        basePrice,
      }
    });
    
    revalidatePath('/profissional');
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar perfil do profissional:', error);
    return { error: 'Falha ao salvar as informações.' };
  }
}
