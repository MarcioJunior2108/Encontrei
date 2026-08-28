import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { SearchResults } from '@/components/search/SearchResults';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Buscar profissionais',
  description: 'Encontre profissionais verificados para qualquer serviço.',
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, categoria } = await searchParams;

  let aiIntent = null;
  let whereClause: any = undefined;

  // Busca ultra rápida direta no banco de dados (sem bloquear o carregamento da página com chamadas de IA)
  // Como o cliente quer resposta em < 1 segundo, a busca deve ser estritamente no DB.
  if (q) {
    whereClause = {
      OR: [
        { headline: { contains: q, mode: 'insensitive' } },
        { bio: { contains: q, mode: 'insensitive' } },
        { profile: { name: { contains: q, mode: 'insensitive' } } },
        { profile: { city: { contains: q, mode: 'insensitive' } } }
      ]
    };
  }

  if (categoria) {
    // TODO: Adicionar filtro de categoria
  }

  // 3. Buscar com Ordenação Lucrativa (PRO primeiro)
  const professionals = await prisma.professional.findMany({
    include: { profile: true },
    where: whereClause,
    orderBy: [
      { planType: 'desc' }, // PRO primeiro
      { verificationStatus: 'desc' } // VERIFIED segundo
    ]
  });

  // Convert Prisma objects to the format expected by SearchResults (serializable)
  const formattedResults = professionals.map(p => ({
    id: p.id,
    userId: p.userId,
    name: p.profile.name || 'Sem nome',
    avatarUrl: p.profile.avatarUrl,
    verified: p.verificationStatus === 'VERIFIED',
    headline: p.headline || 'Profissional',
    bio: p.bio || 'Sem descrição.',
    categories: [], // Add real categories later
    location: { 
      city: p.profile.city || 'São Paulo', 
      state: p.profile.state || 'SP', 
      distanceKm: 0 
    },
    priceRange: { 
      min: p.basePrice ? Number(p.basePrice) : 0, 
      max: p.basePrice ? Number(p.basePrice) * 1.5 : 0, 
      type: 'fixed' as const 
    },
    reputation: { 
      rating: 5.0, // Mock for now
      reviewCount: 0, 
      completionRate: 100, 
      responseTimeMinutes: 15 
    },
    availableToday: p.availability === 'AVAILABLE',
  }));

  return (
    <main id="main-content">
      <Header />
      <SearchResults 
        query={q} 
        category={categoria} 
        initialResults={formattedResults} 
        aiIntent={aiIntent}
      />
    </main>
  );
}
