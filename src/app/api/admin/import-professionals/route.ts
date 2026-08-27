import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    // Basic auth check (can be improved with real admin auth)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY || 'development-secret'}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Body must be an array of professionals' }, { status: 400 });
    }

    const results = [];

    for (const item of data) {
      const { name, phone, city, state, service, basePrice } = item;

      if (!phone) {
        results.push({ error: 'Phone is required', item });
        continue;
      }

      // Check if profile with this phone already exists
      const existingProfile = await prisma.profile.findFirst({
        where: { phone }
      });

      if (existingProfile) {
        results.push({ error: 'Profile with this phone already exists', phone });
        continue;
      }

      const claimToken = uuidv4();
      const fakeEmail = `${phone.replace(/\D/g, '')}@temp.acheiyou.com`;

      // Crie o perfil sombra
      const profile = await prisma.profile.create({
        data: {
          email: fakeEmail,
          name: name || 'Profissional Parceiro',
          phone: phone,
          city: city,
          state: state,
          role: 'PROFESSIONAL',
          status: 'UNCLAIMED',
          claimToken: claimToken,
          professional: {
            create: {
              headline: service || 'Prestador de Serviços',
              basePrice: basePrice ? parseFloat(basePrice) : null,
              verificationStatus: 'UNVERIFIED',
              availability: 'AVAILABLE',
            }
          }
        },
        include: { professional: true }
      });

      results.push({ success: true, profileId: profile.id, claimToken });
    }

    return NextResponse.json({ imported: results.length, results }, { status: 201 });
  } catch (error) {
    console.error('Error importing professionals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
