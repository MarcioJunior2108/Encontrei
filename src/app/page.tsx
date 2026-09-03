import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { FeaturedProfessionals } from '@/components/home/FeaturedProfessionals';
import { HowItWorks } from '@/components/home/HowItWorks';
import { SocialProof } from '@/components/home/SocialProof';
import { HomeFooter } from '@/components/home/HomeFooter';

export const metadata: Metadata = {
  title: 'AcheiYou — O que você precisa?',
  description:
    'Diga o que você precisa e encontramos o profissional certo para você. Elétrica, limpeza, design, tecnologia e muito mais.',
};

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AcheiYou',
    url: 'https://acheiyou.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://acheiyou.app/buscar?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <main className="min-h-dvh bg-[hsl(var(--background))]" id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <HeroSection />
      <CategoriesSection />
      <FeaturedProfessionals />
      <HowItWorks />
      <SocialProof />
      <HomeFooter />
    </main>
  );
}
