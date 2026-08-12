'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Grid2X2, LayoutList, Star, MapPin, Clock, ArrowRight, SearchX } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IntentInput } from '@/components/intent/IntentInput';
import { formatCurrency, formatResponseTime, cn } from '@/lib/utils';

interface SearchResultsProps {
  query?: string;
  category?: string;
  initialResults?: any[];
}

type SortKey = 'rating' | 'price' | 'response' | 'services';

export function SearchResults({ query, category, initialResults = [] }: SearchResultsProps) {
  const [sort, setSort] = useState<SortKey>('rating');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);

  const filtered = useMemo(() => {
    let results = [...initialResults];

    if (query) {
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
      <div className="sticky top-16 z-30 bg-[hsl(var(--background)/0.95)] backdrop-blur-md border-b border-[hsl(var(--border))] py-4 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <IntentInput defaultValue={query} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">
              {filtered.length > 0
                ? `${filtered.length} profissionais encontrados`
                : 'Nenhum resultado'}
            </h1>
            {displayQuery && (
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
                para &ldquo;{displayQuery}&rdquo;
              </p>
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
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <SearchX className="h-12 w-12 text-[hsl(var(--muted-foreground)/0.5)] mb-4" />
            <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">
              Nenhum profissional encontrado
            </h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-sm mb-6">
              Tente ajustar seus filtros ou buscar por outro termo.
            </p>
            <Button variant="outline" onClick={() => { setVerifiedOnly(false); setAvailableOnly(false); }}>
              Limpar filtros
            </Button>
          </div>
        )}

        <motion.div
          className={cn('gap-4', view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'flex flex-col')}
          layout
        >
          {filtered.map((pro, i) => (
            <motion.div key={pro.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}>
              <Link href={`/perfil/${pro.id}`}>
                <div className={cn("group rounded-[var(--radius-xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:shadow-[var(--shadow-md)] transition-all flex overflow-hidden", view === 'grid' ? 'flex-col h-full' : 'flex-row items-center p-4 gap-6')}>
                  
                  <div className={cn("flex gap-4", view === 'grid' ? 'p-5' : '')}>
                    <Avatar src={pro.avatarUrl} name={pro.name} verified={pro.verified} size={view === 'grid' ? 'xl' : 'lg'} />
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-lg text-[hsl(var(--foreground))] truncate group-hover:text-[hsl(var(--primary))] transition-colors">
                          {pro.name}
                        </h3>
                        <div className="flex items-center gap-1 bg-[hsl(var(--warning-muted))] px-2 py-0.5 rounded-full flex-shrink-0">
                          <Star className="h-3.5 w-3.5 fill-[hsl(var(--warning))] text-[hsl(var(--warning))]" />
                          <span className="text-xs font-bold text-[hsl(var(--warning-foreground))]">{pro.reputation?.rating?.toFixed(1) || '5.0'}</span>
                        </div>
                      </div>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5 line-clamp-1">{pro.headline}</p>
                      
                      <div className="flex items-center gap-3 mt-3 text-xs text-[hsl(var(--muted-foreground))]">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{pro.location?.city || 'Local não informado'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Responde em {formatResponseTime(pro.reputation?.responseTimeMinutes || 15)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={cn("mt-auto", view === 'grid' ? 'px-5 pb-4' : 'ml-auto min-w-[200px]')}>
                    <div className="flex items-center justify-between pt-4 border-t border-[hsl(var(--border))]">
                      <div className="text-sm font-medium">
                        A partir de <span className="font-bold text-[hsl(var(--foreground))] text-base">{formatCurrency(pro.priceRange?.min || 50)}</span>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-[hsl(var(--primary-muted))] flex items-center justify-center group-hover:bg-[hsl(var(--primary))] group-hover:text-white transition-colors text-[hsl(var(--primary))]">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
