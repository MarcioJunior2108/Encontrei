'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { MOCK_REVIEWS, MOCK_METRICS } from '@/mock/data';
import { formatNumber } from '@/lib/utils';

const testimonials = MOCK_REVIEWS.slice(0, 6);

const globalStats = [
  { value: `${MOCK_METRICS.conversionRate.toFixed(0)}%`, label: 'taxa de satisfação' },
  { value: formatNumber(MOCK_METRICS.requestsCompleted), label: 'serviços concluídos' },
  { value: '< 15min', label: 'tempo médio de resposta' },
  { value: '4.8★', label: 'avaliação média' },
];

export function SocialProof() {
  return (
    <section
      className="py-20 sm:py-28 px-4 sm:px-6 bg-[hsl(var(--muted)/0.3)] overflow-hidden"
      aria-labelledby="social-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-xs font-semibold text-[hsl(var(--primary))] uppercase tracking-widest mb-3">
            Depoimentos
          </p>
          <h2
            id="social-heading"
            className="text-3xl sm:text-4xl font-bold text-[hsl(var(--foreground))] tracking-tight"
          >
            O que dizem os usuários.
          </h2>
        </div>

        {/* Testimonials scroll */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {testimonials.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex flex-col gap-3 p-5 rounded-[var(--radius-xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`h-3.5 w-3.5 ${s < Math.round(review.rating) ? 'text-amber-400 fill-amber-400' : 'text-[hsl(var(--muted))]'}`}
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-sm text-[hsl(var(--foreground))] leading-relaxed flex-1">
                &ldquo;{review.comment}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-2.5 pt-2 border-t border-[hsl(var(--border))]">
                <Avatar src={review.author.avatar} name={review.author.name} size="sm" />
                <div>
                  <p className="text-xs font-semibold text-[hsl(var(--foreground))]">
                    {review.author.name}
                  </p>
                  <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                    {review.author.location?.city ?? 'Brasil'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {globalStats.map(({ value, label }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <p className="text-3xl sm:text-4xl font-black text-[hsl(var(--foreground))] tracking-tight">
                {value}
              </p>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
