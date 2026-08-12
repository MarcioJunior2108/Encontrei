'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Zap, Droplets, Sparkles, Paintbrush, Truck, Monitor, 
  Leaf, Hammer, Wind, Shield, Palette, Camera, 
  GraduationCap, HeartPulse, Scale, Calculator, 
  PawPrint, Package, Music, PartyPopper 
} from 'lucide-react';
import { MOCK_CATEGORIES } from '@/mock/data';
import { formatNumber } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Zap, Droplets, Sparkles, Paintbrush, Truck, Monitor,
  Leaf, Hammer, Wind, Shield, Palette, Camera,
  GraduationCap, HeartPulse, Scale, Calculator,
  PawPrint, Package, Music, PartyPopper,
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export function CategoriesSection() {
  return (
    <section
      className="py-20 sm:py-28 px-4 sm:px-6 bg-[hsl(var(--background))]"
      aria-labelledby="categories-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold text-[hsl(var(--primary))] uppercase tracking-widest mb-3">
            Categorias
          </p>
          <h2
            id="categories-heading"
            className="text-3xl sm:text-4xl font-bold text-[hsl(var(--foreground))] tracking-tight"
          >
            Qualquer serviço,<br />
            <span className="text-[hsl(var(--muted-foreground))] font-normal">no mesmo lugar.</span>
          </h2>
        </div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {MOCK_CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.icon] ?? Sparkles;
            return (
              <motion.div key={cat.id} variants={itemVariants}>
                <Link
                  href={`/buscar?categoria=${cat.slug}`}
                  className="group flex flex-col items-start gap-3 p-4 rounded-[var(--radius-xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary)/0.3)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all duration-200"
                  aria-label={`Explorar categoria ${cat.name}`}
                >
                  <div
                    className="h-10 w-10 rounded-[var(--radius-lg)] flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: `${cat.color}18` }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: cat.color }}
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors">
                      {cat.name}
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                      {formatNumber(cat.professionalCount ?? 0)} profissionais
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
