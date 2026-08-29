'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentProfile } from './user';
import { revalidatePath } from 'next/cache';

export async function getActiveChats() {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return { error: 'Não autorizado' };

    // Buscar pedidos onde o usuário é o cliente ou o profissional (se o profissional estiver vinculado a esse profile)
    // E os pedidos estão aceitos e desbloqueados
    const requests = await prisma.serviceRequest.findMany({
      where: {
        status: 'ACCEPTED',
        isUnlocked: true,
        OR: [
          { clientId: profile.id },
          { professional: { userId: profile.id } }
        ]
      },
      include: {
        client: true,
        professional: {
          include: { profile: true }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const serializedRequests = requests.map((req: any) => ({
      ...req,
      proposedPrice: req.proposedPrice ? Number(req.proposedPrice) : null,
      professional: req.professional ? {
        ...req.professional,
        basePrice: req.professional.basePrice ? Number(req.professional.basePrice) : null,
        walletBalance: req.professional.walletBalance ? Number(req.professional.walletBalance) : 0,
      } : null
    }));

    return { success: true, chats: serializedRequests };
  } catch (error) {
    console.error('Erro ao buscar chats ativos:', error);
    return { error: 'Falha ao buscar conversas' };
  }
}

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
