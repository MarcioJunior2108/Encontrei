import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Você precisa estar logado para reivindicar o perfil.' }, { status: 401 });
    }

    const { claimToken } = await request.json();

    if (!claimToken) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 400 });
    }

    const shadowProfile = await prisma.profile.findUnique({
      where: { claimToken },
      include: { professional: { include: { receivedRequests: true } } }
    });

    if (!shadowProfile || shadowProfile.status !== 'UNCLAIMED') {
      return NextResponse.json({ error: 'Perfil não encontrado ou já reivindicado' }, { status: 404 });
    }

    const currentProfile = await prisma.profile.findUnique({
      where: { id: user.id },
      include: { professional: true }
    });

    if (!currentProfile) {
      return NextResponse.json({ error: 'Seu perfil não foi encontrado' }, { status: 404 });
    }

    // Se o usuário atual já é um profissional, movemos os requests para ele e deletamos o prof sombra
    if (currentProfile.professional && shadowProfile.professional) {
      await prisma.serviceRequest.updateMany({
        where: { professionalId: shadowProfile.professional.id },
        data: { professionalId: currentProfile.professional.id }
      });
      // Deleta o perfil sombra, que vai deletar o profissional sombra em cascata
      await prisma.profile.delete({ where: { id: shadowProfile.id } });
    } 
    // Se o usuário atual NÃO é profissional, movemos o profissional sombra para ele
    else if (!currentProfile.professional && shadowProfile.professional) {
      // 1. Movemos o profissional sombra para o perfil atual
      await prisma.professional.update({
        where: { id: shadowProfile.professional.id },
        data: { userId: currentProfile.id }
      });
      
      // 2. Atualizamos o role do usuário para PROFESSIONAL
      await prisma.profile.update({
        where: { id: currentProfile.id },
        data: { role: 'PROFESSIONAL' }
      });

      // 3. Deletamos o perfil sombra (que agora não tem mais profissional atrelado a ele)
      await prisma.profile.delete({ where: { id: shadowProfile.id } });
    } else {
      // Caso estranho onde não há profissional sombra. Apenas deleta.
      await prisma.profile.delete({ where: { id: shadowProfile.id } });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error claiming profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
