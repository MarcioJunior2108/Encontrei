import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentProfile } from '@/app/actions/user';

export async function GET(req: Request) {
  try {
    const profile = await getCurrentProfile();
    
    // Proteção de rota
    if (!profile || profile.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'ALL_PROFESSIONALS';

    let whereClause: any = {
      role: 'PROFESSIONAL',
      phone: { not: null }, // Apenas quem tem telefone
    };

    if (filter === 'UNCLAIMED') {
      whereClause.status = 'UNCLAIMED';
    } else if (filter === 'ACTIVE') {
      whereClause.status = 'ACTIVE';
    }

    const users = await prisma.profile.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
      }
    });

    // Filtra no Javascript para ter certeza que o telefone tem números
    // e formata para DDI + DDD + Numero (ex: 5571999999999)
    const validUsers = users
      .filter(u => {
        if (!u.phone) return false;
        const digits = u.phone.replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 11;
      })
      .map(u => {
        let digits = u.phone!.replace(/\D/g, '');
        // Se não tiver código de país, assume Brasil (55)
        if (digits.length === 10 || digits.length === 11) {
          digits = `55${digits}`;
        }
        return {
          id: u.id,
          name: u.name || 'Profissional',
          phone: digits,
          status: u.status
        };
      });

    return NextResponse.json({ 
      count: validUsers.length,
      users: validUsers 
    });

  } catch (error: any) {
    console.error('[Broadcast Users API] Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar usuários.' },
      { status: 500 }
    );
  }
}
