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
  
  // Buscar perfis para saber quais realmente têm conta de Auth
  const profiles = await prisma.profile.findMany({
    where: { id: { in: userIds } },
    select: { id: true, status: true }
  });

  // Perfis UNCLAIMED não têm conta no Supabase Auth (foram importados)
  // Então só tentamos deletar do Auth os que possivelmente têm conta
  const authUserIds = profiles
    .filter(p => p.status !== 'UNCLAIMED')
    .map(p => p.id);

  if (authUserIds.length > 0) {
    // Deleta em lotes para evitar timeouts e rate limits
    const chunkSize = 10;
    for (let i = 0; i < authUserIds.length; i += chunkSize) {
      const chunk = authUserIds.slice(i, i + chunkSize);
      await Promise.all(
        chunk.map(async (userId) => {
          const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
          if (error && !error.message.includes('not found')) {
            console.error(`Erro ao deletar usuário Auth ${userId}:`, error.message);
          }
        })
      );
    }
  }

  // 1. Limpar registros relacionados que poderiam violar Foreign Keys
  // Chat messages enviadas por esses perfis
  await prisma.chatMessage.deleteMany({
    where: { senderId: { in: userIds } }
  });

  // Service requests onde esses perfis são clientes
  await prisma.serviceRequest.deleteMany({
    where: { clientId: { in: userIds } }
  });

  // Buscar profissionais atrelados aos profiles para limpar dependências se houver
  const professionalRecords = await prisma.professional.findMany({
    where: { userId: { in: userIds } },
    select: { id: true }
  });
  const profIds = professionalRecords.map(p => p.id);

  if (profIds.length > 0) {
    // Limpar Service Requests recebidos por esses profissionais
    await prisma.serviceRequest.deleteMany({
      where: { professionalId: { in: profIds } }
    });
    // Limpar transações
    await prisma.transaction.deleteMany({
      where: { professionalId: { in: profIds } }
    });
    // Limpar profissionais
    await prisma.professional.deleteMany({
      where: { id: { in: profIds } }
    });
  }

  // 2. Deleta do Prisma explicitamente para todos os IDs
  await prisma.profile.deleteMany({
    where: { id: { in: userIds } }
  });

  revalidatePath('/admin/usuarios');
  return { success: true };
}
