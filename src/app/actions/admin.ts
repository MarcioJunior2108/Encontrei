'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentProfile } from './user';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

// Inicializa o cliente do Supabase com a chave de serviço (Admin API)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

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

export async function bulkBanUsers(userIds: string[]) {
  await verifyAdmin();
  
  await prisma.profile.updateMany({
    where: { id: { in: userIds } },
    data: { status: 'SUSPENDED' }
  });

  revalidatePath('/admin/usuarios');
  return { success: true };
}

export async function bulkDeleteUsers(userIds: string[]) {
  await verifyAdmin();
  
  // Deleta do Supabase Auth (isso faz o CASCADE para as tabelas 'profiles' e 'professionals')
  for (const userId of userIds) {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      console.error(`Erro ao deletar usuário ${userId}:`, error.message);
      // Opcional: lidar com erro individualmente ou retornar erro
    }
  }

  // Deleta do Prisma explicitamente para garantir que não fiquem órfãos
  // (caso o CASCADE do Supabase falhe ou não esteja configurado corretamente)
  await prisma.profile.deleteMany({
    where: { id: { in: userIds } }
  });

  revalidatePath('/admin/usuarios');
  return { success: true };
}
