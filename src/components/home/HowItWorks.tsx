'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Users, CheckCircle, Star } from 'lucide-react';

const steps = [
  {
    icon: MessageSquare,
    number: '01',
    title: 'Diga o que precisa',
    description:
      'Descreva sua necessidade com suas próprias palavras. Sem formulários complexos, sem categorias confusas.',
    color: '#6366F1',
  },
  {
    icon: Users,
    number: '02',
    title: 'Encontramos os melhores',
    description:
      'Nossa IA analisa sua intenção e apresenta profissionais verificados disponíveis na sua região.',
    color: '#8B5CF6',
  },
  {
    icon: CheckCircle,
    number: '03',
    title: 'Confirme e resolva',
    description:
      'Compare perfis, avaliações e preços. Contrate com segurança e acompanhe tudo na plataforma.',
    color: '#10B981',
  },
  {
    icon: Star,
    number: '04',
    title: 'Avalie a experiência',
    description:
      'Seu feedback melhora a plataforma para todos e ajuda os melhores profissionais a se destacarem.',
    color: '#F59E0B',
  },
];

export function HowItWorks() {
  return (
    <section
      className="py-20 sm:py-28 px-4 sm:px-6 bg-[hsl(var(--background))]"
      aria-labelledby="how-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-xs font-semibold text-[hsl(var(--primary))] uppercase tracking-widest mb-3">
            Como funciona
          </p>
          <h2
            id="how-heading"
            className="text-3xl sm:text-4xl font-bold text-[hsl(var(--foreground))] tracking-tight"
          >
            Simples como deveria ser.
          </h2>
          <p className="mt-4 text-[hsl(var(--muted-foreground))] text-base leading-relaxed">
            Criamos uma experiência que elimina a complexidade. Você se concentra
            no que precisa, nós cuidamos do resto.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                className="relative"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-7 left-[calc(100%_-_16px)] w-8 h-px bg-gradient-to-r from-[hsl(var(--border))] to-transparent"
                    aria-hidden="true"
                  />
                )}

                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="h-14 w-14 rounded-[var(--radius-xl)] flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${step.color}14` }}
                    >
                      <Icon
                        className="h-6 w-6"
                        style={{ color: step.color }}
                        aria-hidden="true"
                      />
                    </div>
                    <span
                      className="text-4xl font-black leading-none"
                      style={{ color: `${step.color}22` }}
                      aria-hidden="true"
                    >
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[hsl(var(--foreground))] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
