import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { SearchResults } from '@/components/search/SearchResults';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

  if (q && q.length > 3) {
    try {
      // 1. Extrair Intenção com IA
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // Rápido e barato para texto
        messages: [
          {
            role: 'system',
            content: `Você é uma IA de busca para uma plataforma de serviços.
            Extraia a intenção do cliente na seguinte busca: "${q}"
            Retorne EXCLUSIVAMENTE um JSON:
            {
              "profession": "Nome da profissão principal (ex: Encanador, Eletricista)",
              "profession_synonyms": ["sinonimo1", "sinonimo2"], // Títulos equivalentes (ex: se for Programador, incluir Desenvolvedor, Engenheiro de Software)
              "keywords": ["palavra1", "palavra2"], // Palavras-chave do problema
              "city": "Nome da cidade se mencionada, senao null"
            }`
          }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 150,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        aiIntent = JSON.parse(content);
      }
    } catch (e) {
      console.error("Erro na Busca IA:", e);
    }
  }

  // 2. Construir Filtro Prisma
  if (aiIntent) {
    const orConditions = [];
    
    if (aiIntent.profession) {
      orConditions.push({ headline: { contains: aiIntent.profession, mode: 'insensitive' } });
      orConditions.push({ bio: { contains: aiIntent.profession, mode: 'insensitive' } });
    }

    if (aiIntent.profession_synonyms && aiIntent.profession_synonyms.length > 0) {
      aiIntent.profession_synonyms.forEach((syn: string) => {
        orConditions.push({ headline: { contains: syn, mode: 'insensitive' } });
        orConditions.push({ bio: { contains: syn, mode: 'insensitive' } });
      });
    }
    
    if (aiIntent.keywords && aiIntent.keywords.length > 0) {
      aiIntent.keywords.forEach((kw: string) => {
        orConditions.push({ bio: { contains: kw, mode: 'insensitive' } });
      });
    }

    whereClause = {
      AND: [
        {
          OR: orConditions.length > 0 ? orConditions : [{ headline: { contains: q, mode: 'insensitive' } }]
        },
        aiIntent.city ? { profile: { city: { contains: aiIntent.city, mode: 'insensitive' } } } : {}
      ]
    };
  } else if (q) {
    // Fallback para busca burra
    whereClause = {
      OR: [
        { headline: { contains: q, mode: 'insensitive' } },
        { bio: { contains: q, mode: 'insensitive' } },
        { profile: { name: { contains: q, mode: 'insensitive' } } }
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
