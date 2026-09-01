import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { ProfessionalProfile } from '@/components/professionals/ProfessionalProfile';
import { prisma } from '@/lib/prisma';

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const pro = await prisma.professional.findUnique({
    where: { id },
    include: { profile: true }
  });
  
  if (!pro) return { title: 'Profissional não encontrado' };
  
  return {
    title: `${pro.profile.name || 'Profissional'} — AcheiYou`,
    description: pro.bio || 'Perfil de profissional no AcheiYou.',
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  
  const p = await prisma.professional.findUnique({
    where: { id },
    include: { profile: true }
  });
  
  if (!p) notFound();

  // Convert to expected UI format
  const formattedPro = {
    id: p.id,
    userId: p.userId,
    user: {
      name: p.profile.name || 'Sem nome',
      avatar: p.profile.avatarUrl || '',
      verified: p.verificationStatus === 'VERIFIED'
    },
    headline: p.headline || 'Profissional',
    bio: p.bio || 'Sem descrição.',
    planType: p.planType,
    categories: [], // Add real categories later
    services: [], // Add real services later
    location: { 
      city: p.profile.city || 'Local não informado', 
      state: p.profile.state || '', 
      distanceKm: 0 
    },
    priceRange: { 
      min: p.basePrice ? Number(p.basePrice) : 50, 
      max: p.basePrice ? Number(p.basePrice) * 1.5 : 100, 
      type: 'fixed' as const 
    },
    reputation: { 
      rating: 5.0, // Mock for now
      reviewCount: 0, 
      completionRate: 100, 
      responseTimeMinutes: 15,
      completedServices: 0,
      satisfactionRate: 100
    },
    availableToday: p.availability === 'AVAILABLE',
  };

  return (
    <main id="main-content">
      <Header />
      <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Carregando perfil...</div>}>
        <ProfessionalProfile professional={formattedPro} />
      </Suspense>
    </main>
  );
}
