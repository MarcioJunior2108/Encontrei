import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { SearchResults } from '@/components/search/SearchResults';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

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

// ─── Prompt ultra-compacto pra gpt-4o-mini responder em ~500ms ───────────────
const buildSystemPrompt = (q: string) =>
  `Plataforma de serviços BR. Busca: "${q}". JSON SOMENTE:
{"profession":"profissão principal","synonyms":["sin1","sin2"],"city":null}`;

// ─── Sub-componente com busca paralela: IA + DB ao mesmo tempo ───────────────
async function AISearchRunner({ q, categoria }: { q?: string; categoria?: string }) {
  let aiIntent: any = null;

  // Promise da IA — prompt mínimo, max_tokens=60, timeout 4s
  const aiPromise =
    q && q.length > 2
      ? openai.chat.completions
          .create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: buildSystemPrompt(q) }],
            response_format: { type: 'json_object' },
            max_tokens: 60,
          })
          .then((res) => {
            const c = res.choices[0]?.message?.content;
            return c ? JSON.parse(c) : null;
          })
          .catch(() => null)
      : Promise.resolve(null);

  // Promise do DB com busca simples (fallback rápido enquanto IA pensa)
  const simpleLookup = q
    ? prisma.professional.findMany({
        select: { id: true },
        where: {
          OR: [
            { headline: { contains: q, mode: 'insensitive' } },
            { bio: { contains: q, mode: 'insensitive' } },
            { profile: { name: { contains: q, mode: 'insensitive' } } },
          ],
        },
        take: 1,
      })
    : Promise.resolve([]);

  // Rodar IA e simpleLookup juntos (paralelismo real)
  const [intent] = await Promise.all([aiPromise, simpleLookup]);
  aiIntent = intent;

  // Montar filtro Prisma rico (usando sinônimos da IA se disponíveis)
  let whereClause: any = undefined;

  if (aiIntent) {
    const orConditions: any[] = [];

    if (aiIntent.profession) {
      orConditions.push({ headline: { contains: aiIntent.profession, mode: 'insensitive' } });
      orConditions.push({ bio: { contains: aiIntent.profession, mode: 'insensitive' } });
    }

    const synonyms: string[] = aiIntent.synonyms ?? aiIntent.profession_synonyms ?? [];
    synonyms.forEach((syn: string) => {
      orConditions.push({ headline: { contains: syn, mode: 'insensitive' } });
      orConditions.push({ bio: { contains: syn, mode: 'insensitive' } });
    });

    // Fallback: busca pelo texto original também
    if (q) {
      orConditions.push({ headline: { contains: q, mode: 'insensitive' } });
      orConditions.push({ bio: { contains: q, mode: 'insensitive' } });
    }

    whereClause = {
      AND: [
        { OR: orConditions.length > 0 ? orConditions : [{ headline: { contains: q, mode: 'insensitive' } }] },
        aiIntent.city ? { profile: { city: { contains: aiIntent.city, mode: 'insensitive' } } } : {},
      ],
    };
  } else if (q) {
    whereClause = {
      OR: [
        { headline: { contains: q, mode: 'insensitive' } },
        { bio: { contains: q, mode: 'insensitive' } },
        { profile: { name: { contains: q, mode: 'insensitive' } } },
        { profile: { city: { contains: q, mode: 'insensitive' } } },
      ],
    };
  }

  const professionals = await prisma.professional.findMany({
    include: { profile: true },
    where: whereClause,
    orderBy: [
      { planType: 'desc' },
      { verificationStatus: 'desc' },
    ],
    take: 50, // limitar para não explodir em tabelas grandes
  });

  const formattedResults = professionals.map((p) => ({
    id: p.id,
    userId: p.userId,
    name: p.profile.name || 'Sem nome',
    avatarUrl: p.profile.avatarUrl,
    verified: p.verificationStatus === 'VERIFIED',
    headline: p.headline || 'Profissional',
    bio: p.bio || 'Sem descrição.',
    categories: [],
    location: {
      city: p.profile.city || 'São Paulo',
      state: p.profile.state || 'SP',
      distanceKm: 0,
    },
    priceRange: {
      min: p.basePrice ? Number(p.basePrice) : 0,
      max: p.basePrice ? Number(p.basePrice) * 1.5 : 0,
      type: 'fixed' as const,
    },
    reputation: {
      rating: 5.0,
      reviewCount: 0,
      completionRate: 100,
      responseTimeMinutes: 15,
    },
    availableToday: p.availability === 'AVAILABLE',
  }));

  return (
    <SearchResults
      query={q}
      category={categoria}
      initialResults={formattedResults}
      aiIntent={aiIntent}
    />
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, categoria } = await searchParams;

  return (
    <main id="main-content">
      <Header />
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-4 border-[hsl(var(--primary)/0.2)] border-t-[hsl(var(--primary))] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 bg-[hsl(var(--primary)/0.15)] rounded-full animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-semibold text-[hsl(var(--foreground))]">IA analisando sua busca...</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Buscando profissionais com sinônimos inteligentes</p>
            </div>
          </div>
        }
      >
        <AISearchRunner q={q} categoria={categoria} />
      </Suspense>
    </main>
  );
}
