'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentProfile } from './user';
import { revalidatePath } from 'next/cache';

// Apenas permite execução se o usuário atual for ADMIN
async function verifyAdmin() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== 'ADMIN') {
    throw new Error('Acesso negado.');
  }
}

export async function banUser(userId: string) {
  await verifyAdmin();
  
  await prisma.profile.update({
    where: { id: userId },
    data: { status: 'SUSPENDED' }
  });

  revalidatePath('/admin/usuarios');
  return { success: true };
}

export async function promoteToAdmin(userId: string) {
  await verifyAdmin();
  
  await prisma.profile.update({
    where: { id: userId },
    data: { role: 'ADMIN' }
  });

  revalidatePath('/admin/usuarios');
  return { success: true };
}
