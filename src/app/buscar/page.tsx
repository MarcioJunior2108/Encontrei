import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { SearchResults } from '@/components/search/SearchResults';
import { IntentInput } from '@/components/intent/IntentInput';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';
import { Suspense } from 'react';

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

// Prompt ultra-compacto pra gpt-4o-mini responder em ~500ms
const buildSystemPrompt = (q: string) =>
  `Plataforma de serviços BR. Busca: "${q}". JSON SOMENTE:
{"profession":"profissão principal","synonyms":["sin1","sin2"],"city":null}`;

// Sub-componente: executa IA + DB em paralelo e retorna só os resultados
async function SearchResultsAI({ q, categoria }: { q?: string; categoria?: string }) {
  let aiIntent: any = null;

  // IA e DB disparam em paralelo
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

  const [intent] = await Promise.all([aiPromise]);
  aiIntent = intent;

  // Montar filtro Prisma rico com sinônimos da IA
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

    // Sempre inclui o texto original como fallback
    if (q) {
      orConditions.push({ headline: { contains: q, mode: 'insensitive' } });
      orConditions.push({ bio: { contains: q, mode: 'insensitive' } });
    }

    whereClause = {
      AND: [
        { OR: orConditions },
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
    orderBy: [{ planType: 'desc' }, { verificationStatus: 'desc' }],
    take: 50,
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

// Skeleton de resultados — mesmo layout da página real sem dados
function ResultsSkeleton({ query }: { query?: string }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-6 w-48 bg-slate-200 rounded-md mb-2" />
          {query && <div className="h-4 w-32 bg-slate-100 rounded-md" />}
        </div>
        <div className="h-9 w-40 bg-slate-100 rounded-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 p-4 space-y-3 bg-white">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-slate-200 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-4/5" />
            <div className="flex gap-2 pt-1">
              <div className="h-5 w-16 bg-slate-100 rounded-full" />
              <div className="h-5 w-20 bg-slate-100 rounded-full" />
            </div>
            <div className="h-8 bg-slate-200 rounded-lg mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, categoria } = await searchParams;

  return (
    <main id="main-content">
      {/* Header e barra de busca carregam IMEDIATAMENTE — fora do Suspense */}
      <Header />
      <div className="sticky top-16 z-30 bg-[hsl(var(--background)/0.95)] backdrop-blur-md border-b border-[hsl(var(--border))] py-4 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <IntentInput defaultValue={q} />
        </div>
      </div>

      {/* Só os resultados ficam em streaming/suspense */}
      <Suspense fallback={<ResultsSkeleton query={q} />}>
        <SearchResultsAI q={q} categoria={categoria} />
      </Suspense>
    </main>
  );
}
