'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentProfile } from './user';
import { revalidatePath } from 'next/cache';

export async function getChatMessages(requestId: string) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return { error: 'Não autorizado' };

    const messages = await prisma.chatMessage.findMany({
      where: { serviceRequestId: requestId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return { success: true, messages };
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    return { error: 'Falha ao carregar o chat' };
  }
}

export async function sendChatMessage(requestId: string, content: string) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return { error: 'Não autorizado' };

    if (!content || content.trim() === '') {
      return { error: 'Mensagem vazia' };
    }

    // Verificar se o usuário tem permissão para enviar mensagem nesse pedido
    const request = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: { professional: true }
    });

    if (!request) return { error: 'Pedido não encontrado' };

    const isClientOwner = request.clientId === profile.id;
    const isProfessionalOwner = request.professional?.userId === profile.id;

    if (!isClientOwner && !isProfessionalOwner) {
      return { error: 'Você não tem permissão para enviar mensagens neste pedido' };
    }

    const newMessage = await prisma.chatMessage.create({
      data: {
        serviceRequestId: requestId,
        senderId: profile.id,
        content: content.trim()
      }
    });

    revalidatePath(`/dashboard`);
    revalidatePath(`/profissional`);

    return { success: true, message: newMessage };
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    return { error: 'Falha ao enviar mensagem' };
  }
}
