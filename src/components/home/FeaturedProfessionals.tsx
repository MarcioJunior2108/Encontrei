'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_PROFESSIONALS } from '@/mock/data';
import { formatCurrency, formatNumber, formatResponseTime } from '@/lib/utils';
import type { Professional } from '@/types';

function ProfessionalCard({ pro }: { pro: Professional }) {
  const primaryCategory = pro.categories[0];

  return (
    <Link
      href="/buscar"
      className="group block rounded-[var(--radius-xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 hover:border-[hsl(var(--primary)/0.3)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-200"
      aria-label={`Ver perfil de ${pro.user.name}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Avatar
            src={pro.user.avatar}
            name={pro.user.name}
            size="lg"
            verified={pro.verificationStatus === 'VERIFIED'}
          />
          <div>
            <h3 className="font-semibold text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors text-sm">
              {pro.user.name}
            </h3>
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
            {pro.reputation.rating.toFixed(1)}
          </span>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            ({formatNumber(pro.reputation.reviewCount)})
          </span>
        </div>
        <span className="text-[hsl(var(--border))]">·</span>
        <span className="text-xs text-[hsl(var(--muted-foreground))]">
          {formatNumber(pro.reputation.completedServices)} serviços
        </span>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {pro.categories.slice(0, 3).map((cat) => (
          <span
            key={cat.id}
            className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
          >
            {cat.name}
          </span>
        ))}
      </div>

      {/* Info row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[hsl(var(--muted-foreground))] mb-4">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" aria-hidden="true" />
          {pro.location.city}, {pro.location.state}
          {pro.distance && ` · ${pro.distance}km`}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" aria-hidden="true" />
          Resp. em {formatResponseTime(pro.reputation.responseTimeMinutes)}
        </span>
        {pro.verificationStatus === 'VERIFIED' && (
          <span className="flex items-center gap-1 text-[hsl(var(--success))]">
            <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
            Verificado
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[hsl(var(--border))]">
        <div>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">A partir de</p>
          <p className="text-sm font-bold text-[hsl(var(--foreground))]">
            {formatCurrency(pro.priceRange.min)}
            <span className="text-xs font-normal text-[hsl(var(--muted-foreground))]">
              /{pro.priceRange.unit === 'service' ? 'serviço' : pro.priceRange.unit}
            </span>
          </p>
        </div>
        <span
          className="text-xs font-medium text-[hsl(var(--primary))] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
        >
          Ver perfil <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

export function FeaturedProfessionals() {
  const featured = MOCK_PROFESSIONALS.filter(p => p.verificationStatus === 'VERIFIED').slice(0, 8);

  return (
    <section
      className="py-20 sm:py-28 px-4 sm:px-6 bg-[hsl(var(--muted)/0.3)]"
      aria-labelledby="featured-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div className="max-w-xl">
            <p className="text-xs font-semibold text-[hsl(var(--primary))] uppercase tracking-widest mb-3">
              Em destaque
            </p>
            <h2
              id="featured-heading"
              className="text-3xl sm:text-4xl font-bold text-[hsl(var(--foreground))] tracking-tight"
            >
              Profissionais verificados,<br />
              <span className="text-[hsl(var(--muted-foreground))] font-normal">prontos para atender.</span>
            </h2>
          </div>
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/buscar">
              Ver todos <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {featured.map((pro) => (
            <motion.div
              key={pro.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
              }}
            >
              <ProfessionalCard pro={pro} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/buscar">Ver todos os profissionais</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
