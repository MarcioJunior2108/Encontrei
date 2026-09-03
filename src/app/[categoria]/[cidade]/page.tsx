import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { SearchResults } from '@/components/search/SearchResults';
import { IntentInput } from '@/components/intent/IntentInput';
import { prisma } from '@/lib/prisma';
import { Suspense } from 'react';

interface CategoryCityPageProps {
  params: Promise<{ categoria: string; cidade: string }>;
}

// Helper para converter "sao-paulo" para "sao paulo"
function unslugify(slug: string) {
  return decodeURIComponent(slug).replace(/-/g, ' ');
}
// Helper para Capitalizar palavras
function capitalize(str: string) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function generateMetadata({ params }: CategoryCityPageProps): Promise<Metadata> {
  const { categoria, cidade } = await params;
  const categoryName = capitalize(unslugify(categoria));
  const cityName = capitalize(unslugify(cidade));
  
  const title = `${categoryName} em ${cityName}: Encontre os melhores profissionais | AcheiYou`;
  const description = `Precisando de ${categoryName} em ${cityName}? Compare avaliações, preços e encontre profissionais verificados e disponíveis hoje no AcheiYou.`;
  const url = `https://acheiyou.app/${categoria}/${cidade}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  };
}

async function CategoryCityResults({ categoria, cidade }: { categoria: string; cidade: string }) {
  const categoryName = unslugify(categoria);
  const cityName = unslugify(cidade);

  const professionals = await prisma.professional.findMany({
    include: { profile: true },
    where: {
      AND: [
        {
          OR: [
            { headline: { contains: categoryName, mode: 'insensitive' } },
            { bio: { contains: categoryName, mode: 'insensitive' } },
            { profile: { name: { contains: categoryName, mode: 'insensitive' } } },
          ],
        },
        { profile: { city: { contains: cityName, mode: 'insensitive' } } },
      ]
    },
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
    planType: p.planType,
    categories: [],
    location: {
      city: p.profile.city || capitalize(cityName),
      state: p.profile.state || 'BR',
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Profissionais de ${capitalize(categoryName)} em ${capitalize(cityName)}`,
    description: `Lista dos melhores ${capitalize(categoryName)} atendendo em ${capitalize(cityName)}.`,
    itemListElement: formattedResults.map((prof, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'ProfessionalService',
        url: `https://acheiyou.app/perfil/${prof.id}`,
        name: prof.name,
        image: prof.avatarUrl,
        address: {
          '@type': 'PostalAddress',
          addressLocality: prof.location.city,
          addressRegion: prof.location.state,
          addressCountry: 'BR',
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--foreground))]">
          {capitalize(categoryName)} em {capitalize(cityName)}
        </h1>
        <p className="text-[hsl(var(--muted-foreground))] mt-1">
          Encontramos {formattedResults.length} {formattedResults.length === 1 ? 'profissional' : 'profissionais'} para você.
        </p>
      </div>
      <SearchResults
        query=""
        category={capitalize(categoryName)}
        initialResults={formattedResults}
        aiIntent={null}
      />
    </>
  );
}

// Skeleton reutilizado da página de busca
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

export default async function CategoryCityPage({ params }: CategoryCityPageProps) {
  const { categoria, cidade } = await params;
  const categoryName = capitalize(unslugify(categoria));
  const cityName = capitalize(unslugify(cidade));

  return (
    <main id="main-content">
      <Header />
      <div className="sticky top-16 z-30 bg-[hsl(var(--background)/0.95)] backdrop-blur-md border-b border-[hsl(var(--border))] py-4 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* O IntentInput permite nova busca sem sair da página */}
          <IntentInput defaultValue={`${categoryName} em ${cityName}`} />
        </div>
      </div>

      <Suspense fallback={<ResultsSkeleton />}>
        <CategoryCityResults categoria={categoria} cidade={cidade} />
      </Suspense>
    </main>
  );
}
