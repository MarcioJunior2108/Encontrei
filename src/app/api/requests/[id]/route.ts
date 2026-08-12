import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentProfile } from '@/app/actions/user';
import { RequestStatus } from '@prisma/client';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !Object.values(RequestStatus).includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const params = await context.params;
    const requestId = params.id;

    // Verificar se a requisição existe
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: {
        professional: true,
        client: true,
      }
    });

    if (!serviceRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Verificar autorização
    if (profile.role === 'PROFESSIONAL' && serviceRequest.professional?.userId !== profile.id) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (profile.role === 'CLIENT' && serviceRequest.client?.id !== profile.id) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Atualizar status
    const updatedRequest = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: { status: status as RequestStatus },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Error updating request status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
