'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Grid2X2, LayoutList, Star, MapPin, Clock, ArrowRight, SearchX, CheckCircle2, Zap } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IntentInput } from '@/components/intent/IntentInput';
import { formatCurrency, formatResponseTime, formatNumber, cn } from '@/lib/utils';

interface SearchResultsProps {
  query?: string;
  category?: string;
  initialResults?: any[];
  aiIntent?: any;
}

type SortKey = 'rating' | 'price' | 'response' | 'services';

export function SearchResults({ query, category, initialResults = [], aiIntent }: SearchResultsProps) {
  const [sort, setSort] = useState<SortKey>('rating');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);

  const filtered = useMemo(() => {
    let results = [...initialResults];

    // Se houver intenção da IA, o Prisma já filtrou com sinônimos de forma inteligente.
    // Só fazemos fallback de filtro manual no frontend se não tiver aiIntent.
    if (query && !aiIntent) {
      const q = query.toLowerCase();
      results = results.filter(
        p =>
          p.name?.toLowerCase().includes(q) ||
          p.headline?.toLowerCase().includes(q) ||
          p.bio?.toLowerCase().includes(q)
      );
    }

    if (verifiedOnly) {
      results = results.filter(p => p.verified);
    }
    if (availableOnly) {
      results = results.filter(p => p.availableToday);
    }

    results.sort((a, b) => {
      if (sort === 'rating') return (b.reputation?.rating || 0) - (a.reputation?.rating || 0);
      if (sort === 'price') return (a.priceRange?.min || 0) - (b.priceRange?.min || 0);
      if (sort === 'response') return (a.reputation?.responseTimeMinutes || 0) - (b.reputation?.responseTimeMinutes || 0);
      if (sort === 'services') return (b.reputation?.completedServices || 0) - (a.reputation?.completedServices || 0);
      return 0;
    });

    return results;
  }, [query, category, verifiedOnly, availableOnly, sort, initialResults]);

  const displayQuery = query || category;

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">
              {filtered.length > 0
                ? `${filtered.length} profissionais encontrados`
                : 'Nenhum resultado'}
            </h1>
            {displayQuery && !aiIntent && (
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
                para &ldquo;{displayQuery}&rdquo;
              </p>
            )}
            {aiIntent && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[hsl(var(--primary)/0.1)] border border-[hsl(var(--primary)/0.2)]">
                <Zap className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
                <span className="text-xs font-medium text-[hsl(var(--primary))]">
                  IA detectou necessidade de: <strong className="font-bold">{aiIntent.profession || category}</strong> 
                  {aiIntent.city ? ` em ${aiIntent.city}` : ''}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setVerifiedOnly(v => !v)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1',
                verifiedOnly
                  ? 'bg-[hsl(var(--primary))] border-[hsl(var(--primary))] text-white'
                  : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary))]'
              )}
            >
              ✓ Verificados
            </button>
            <button
              onClick={() => setAvailableOnly(v => !v)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1',
                availableOnly
                  ? 'bg-[hsl(var(--primary))] border-[hsl(var(--primary))] text-white'
                  : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary))]'
              )}
            >
              ⚡ Disponível hoje
            </button>

            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortKey)}
              className="text-xs px-3 py-1.5 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] outline-none focus:border-[hsl(var(--primary))] transition-colors"
            >
              <option value="rating">Melhor avaliação</option>
              <option value="price">Menor preço</option>
              <option value="response">Mais rápido</option>
              <option value="services">Mais experiente</option>
            </select>

            <div className="flex items-center border border-[hsl(var(--border))] rounded-[var(--radius-lg)] overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={cn('p-2 transition-colors', view === 'grid' ? 'bg-[hsl(var(--primary))] text-white' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]')}
              >
                <Grid2X2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setView('list')}
                className={cn('p-2 transition-colors', view === 'list' ? 'bg-[hsl(var(--primary))] text-white' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]')}
              >
                <LayoutList className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {filtered.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="relative mb-8">
              {/* Radar Rings */}
              <motion.div 
                animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-[hsl(var(--primary)/0.2)] blur-xl"
              />
              <motion.div 
                animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full border border-[hsl(var(--primary)/0.3)]"
              />
              <motion.div 
                animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute inset-0 rounded-full border border-[hsl(var(--primary)/0.5)]"
              />
              
              {/* Center Icon */}
              <div className="relative h-20 w-20 bg-[hsl(var(--card))] rounded-full border border-[hsl(var(--border))] shadow-lg flex items-center justify-center z-10">
                <SearchX className="h-8 w-8 text-[hsl(var(--muted-foreground))]" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-2">
              Nenhum profissional encontrado
            </h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-sm mb-6">
              Ainda não temos profissionais dessa categoria na sua região, ou os filtros estão muito restritos. Tente buscar por outro termo.
            </p>
            <Button variant="outline" className="rounded-full px-6" onClick={() => { setVerifiedOnly(false); setAvailableOnly(false); }}>
              Limpar filtros
            </Button>
          </motion.div>
        )}

        <motion.div
          className={cn('gap-4', view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'flex flex-col')}
          layout
        >
          {filtered.map((pro, i) => (
            <motion.div key={pro.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}>
              <Link href={`/perfil/${pro.id}`}>
                <div className={cn("group rounded-[var(--radius-xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary)/0.3)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-200 flex overflow-hidden", view === 'grid' ? 'flex-col h-full p-5' : 'flex-row items-center p-5 gap-6')}>
                  
                  {view === 'grid' ? (
                    <>
                      {/* Grid View: Matches FeaturedProfessional exactly */}
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={pro.avatarUrl} name={pro.name} verified={pro.verified} size="lg" />
                          <div>
                            <div className="flex items-center flex-wrap gap-2">
                              <h3 className="font-semibold text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors text-sm">
                                {pro.name}
                              </h3>
                              {pro.planType === 'ELITE' && (
                                <Badge variant="secondary" className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white border-none font-semibold px-2 py-0.5 flex items-center gap-1 shrink-0 text-[10px]">
                                  <Star className="h-2.5 w-2.5 fill-white" /> Selo Ouro
                                </Badge>
                              )}
                              {pro.planType === 'PRO' && (
                                <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-none font-semibold px-2 py-0.5 shrink-0 text-[10px]">
                                  Selo PRO
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 line-clamp-1">
                              {pro.headline}
                            </p>
                          </div>
                        </div>
                        {pro.availableToday && (
                          <Badge variant="success" className="flex-shrink-0 text-[10px]">
                            <Zap className="h-2.5 w-2.5" aria-hidden="true" />
                            Hoje
                          </Badge>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" aria-hidden="true" />
                          <span className="text-sm font-bold text-[hsl(var(--foreground))]">
                            {pro.reputation?.rating?.toFixed(1) || '5.0'}
                          </span>
                          <span className="text-xs text-[hsl(var(--muted-foreground))]">
                            ({formatNumber(pro.reputation?.reviewCount || 0)})
                          </span>
                        </div>
                        <span className="text-[hsl(var(--border))]">·</span>
                        <span className="text-xs text-[hsl(var(--muted-foreground))]">
                          {formatNumber(pro.reputation?.completedServices || 0)} serviços
                        </span>
                      </div>

                      {/* Categories (Mocked tags if empty) */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(pro.categories && pro.categories.length > 0 ? pro.categories : [{id: 1, name: 'Serviço Profissional'}]).slice(0, 3).map((cat: any) => (
                          <span key={cat.id} className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                            {cat.name}
                          </span>
                        ))}
                      </div>

                      {/* Info row */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[hsl(var(--muted-foreground))] mb-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" aria-hidden="true" />
                          {pro.location?.city || 'Brasil'}, {pro.location?.state || 'BR'}
                          {pro.location?.distanceKm ? ` · ${pro.location.distanceKm}km` : ''}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          Resp. em {formatResponseTime(pro.reputation?.responseTimeMinutes || 15)}
                        </span>
                        {pro.verified && (
                          <span className="flex items-center gap-1 text-[hsl(var(--success))]">
                            <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                            Verificado
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[hsl(var(--border))]">
                        <div>
                          <p className="text-xs text-[hsl(var(--muted-foreground))]">A partir de</p>
                          <p className="text-sm font-bold text-[hsl(var(--foreground))]">
                            {formatCurrency(pro.priceRange?.min || 50)}
                            <span className="text-xs font-normal text-[hsl(var(--muted-foreground))]">
                              /serviço
                            </span>
                          </p>
                        </div>
                        <span className="text-xs font-medium text-[hsl(var(--primary))] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                          Ver perfil <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* List View: Keep it similar but better aligned */}
                      <div className="flex gap-4 p-0">
                        <Avatar src={pro.avatarUrl} name={pro.name} verified={pro.verified} size="lg" />
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center flex-wrap gap-2">
                              <h3 className="font-bold text-lg text-[hsl(var(--foreground))] truncate group-hover:text-[hsl(var(--primary))] transition-colors">
                                {pro.name}
                              </h3>
                              {pro.planType === 'ELITE' && (
                                <Badge variant="secondary" className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white border-none font-semibold px-2 py-0.5 flex items-center gap-1 shrink-0 text-[10px]">
                                  <Star className="h-2.5 w-2.5 fill-white" /> Selo Ouro
                                </Badge>
                              )}
                              {pro.planType === 'PRO' && (
                                <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-none font-semibold px-2 py-0.5 shrink-0 text-[10px]">
                                  Selo PRO
                                </Badge>
                              )}
                            </div>
                            {pro.availableToday && (
                              <Badge variant="success" className="flex-shrink-0 text-[10px]">
                                <Zap className="h-2.5 w-2.5" aria-hidden="true" />
                                Hoje
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5 line-clamp-1">{pro.headline}</p>
                          
                          <div className="flex items-center gap-3 mt-3 text-xs text-[hsl(var(--muted-foreground))]">
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                              <span className="font-bold text-[hsl(var(--foreground))]">{pro.reputation?.rating?.toFixed(1) || '5.0'}</span>
                              <span>({formatNumber(pro.reputation?.reviewCount || 0)})</span>
                            </div>
                            <span className="text-[hsl(var(--border))]">·</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{pro.location?.city || 'Local não informado'}</span>
                            </div>
                            <span className="text-[hsl(var(--border))]">·</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Resp. em {formatResponseTime(pro.reputation?.responseTimeMinutes || 15)}</span>
                            </div>
                            {pro.verified && (
                              <>
                                <span className="text-[hsl(var(--border))]">·</span>
                                <span className="flex items-center gap-1 text-[hsl(var(--success))]">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Verificado
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="ml-auto min-w-[150px] text-right flex flex-col justify-center border-l pl-6 border-[hsl(var(--border))]">
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">A partir de</p>
                        <p className="text-lg font-bold text-[hsl(var(--foreground))] mb-2">
                          {formatCurrency(pro.priceRange?.min || 50)}
                        </p>
                        <Button size="sm" variant="outline" className="w-full text-xs">
                          Ver perfil
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
