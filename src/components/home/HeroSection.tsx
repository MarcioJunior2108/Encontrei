'use client';

import { motion } from 'framer-motion';
import { IntentInput } from '@/components/intent/IntentInput';
import { MOCK_METRICS } from '@/mock/data';
import { formatNumber } from '@/lib/utils';

const stats = [
  { label: 'Profissionais', value: formatNumber(MOCK_METRICS.professionals) },
  { label: 'Serviços realizados', value: formatNumber(MOCK_METRICS.requestsCompleted) },
  { label: 'Usuários ativos', value: formatNumber(MOCK_METRICS.activeUsers) },
  { label: 'Cidades atendidas', value: '127' },
];

const floatingCards = [
  { name: 'João S.', service: 'Eletricista', rating: 4.9, color: '#F59E0B' },
  { name: 'Maria L.', service: 'Designer', rating: 5.0, color: '#8B5CF6' },
  { name: 'Carlos R.', service: 'Encanador', rating: 4.8, color: '#3B82F6' },
];

export function HeroSection() {
  return (
    <section
      className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden gradient-hero"
      aria-label="Seção principal"
    >
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Floating ambient cards — decorative */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {floatingCards.map((card, i) => (
          <motion.div
            key={i}
            className="absolute hidden lg:flex items-center gap-2.5 px-3.5 py-2.5 rounded-[var(--radius-xl)] bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-[var(--shadow-lg)]"
            style={{
              top: `${25 + i * 22}%`,
              left: i % 2 === 0 ? `${6 + i * 2}%` : undefined,
              right: i % 2 !== 0 ? `${8 + i * 2}%` : undefined,
            }}
            animate={{ y: [0, -10, 0], rotate: [0, 1, 0] }}
            transition={{
              duration: 6 + i * 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 1.2,
            }}
          >
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: card.color }}
            >
              {card.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-xs font-semibold text-[hsl(var(--foreground))]">{card.name}</p>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{card.service}</p>
            </div>
            <div className="ml-1 flex items-center gap-0.5">
              <svg className="h-3 w-3 text-amber-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-[10px] font-semibold text-[hsl(var(--foreground))]">{card.rating}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[hsl(var(--primary)/0.2)] bg-[hsl(var(--primary-muted))] text-[hsl(var(--primary))] text-xs font-semibold tracking-wide mb-8"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
          Plataforma em beta — acesso gratuito
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.08]"
        >
          <span className="text-[hsl(var(--foreground))]">O que você</span>
          <br />
          <span className="gradient-text">precisa?</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-6 text-base sm:text-lg text-[hsl(var(--muted-foreground))] text-balance max-w-xl mx-auto leading-relaxed"
        >
          Diga o que precisa, em qualquer formato. Encontramos o profissional certo para você
          — rápido, seguro e verificado.
        </motion.p>

        {/* Intent input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10"
        >
          <IntentInput size="large" autoFocus={false} />
        </motion.div>

        {/* Quick action pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-6 flex flex-wrap justify-center gap-2"
        >
          {['Eletricista', 'Faxina', 'Designer', 'Encanador', 'Aulas', 'Reformas'].map((term) => (
            <a
              key={term}
              href={`/buscar?q=${encodeURIComponent(term)}`}
              className="px-3 py-1.5 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.8)] text-xs text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary)/0.5)] hover:bg-[hsl(var(--primary-muted))] hover:text-[hsl(var(--primary))] transition-all duration-150 backdrop-blur-sm"
            >
              {term}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="relative z-10 mt-20 w-full max-w-3xl mx-auto"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[hsl(var(--border))] rounded-[var(--radius-2xl)] overflow-hidden border border-[hsl(var(--border))]">
          {stats.map(({ label, value }, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center py-5 px-4 bg-[hsl(var(--card)/0.9)] backdrop-blur-sm text-center"
            >
              <span className="text-xl sm:text-2xl font-bold text-[hsl(var(--foreground))]">{value}</span>
              <span className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{label}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-[10px] text-[hsl(var(--muted-foreground)/0.6)] mt-2">
          * Dados demonstrativos — ambiente beta
        </p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        <div className="h-8 w-5 rounded-full border-2 border-[hsl(var(--border))] flex items-start justify-center pt-1.5">
          <div className="h-1.5 w-1 rounded-full bg-[hsl(var(--muted-foreground))]" />
        </div>
      </motion.div>
    </section>
  );
}
