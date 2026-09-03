'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Briefcase, CheckCircle2, ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { completeOnboarding } from '@/app/actions/onboarding';

export function OnboardingForm({ profile }: { profile: any }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isProfessional = profile.role === 'PROFESSIONAL';

  const [formData, setFormData] = useState({
    city: profile.city || 'São Paulo',
    state: profile.state || 'SP',
    phone: profile.phone || '',
    headline: profile.professional?.headline || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = async () => {
    if (step < 2) {
      setStep(s => s + 1);
    } else {
      setLoading(true);
      setError(null);
      
      const form = new FormData();
      form.append('city', formData.city);
      form.append('state', formData.state);
      form.append('phone', formData.phone);
      if (isProfessional) {
        form.append('headline', formData.headline);
      }

      const res = await completeOnboarding(form);
      if (res.error) {
        setError(res.error);
        setLoading(false);
      } else {
        setStep(3); // Success step
        setTimeout(() => {
          router.push(isProfessional ? '/profissional' : '/dashboard');
        }, 1500);
      }
    }
  };

  const steps = [
    {
      title: 'Dados Básicos',
      description: isProfessional 
        ? 'Precisamos de algumas informações para os clientes entrarem em contato com você.'
        : 'Sua localização ajuda a encontrar profissionais perto de você.',
      icon: MapPin,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cidade</label>
              <input
                required
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Ex: São Paulo"
                className="w-full h-12 px-4 rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm outline-none focus:border-[hsl(var(--primary))]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado (UF)</label>
              <input
                required
                name="state"
                maxLength={2}
                value={formData.state}
                onChange={handleChange}
                placeholder="Ex: SP"
                className="w-full h-12 px-4 rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm outline-none focus:border-[hsl(var(--primary))] uppercase"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Telefone / WhatsApp</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              <input
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                className="w-full h-12 pl-10 pr-4 rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm outline-none focus:border-[hsl(var(--primary))]"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: isProfessional ? 'Sua Profissão' : 'Tudo certo por aqui',
      description: isProfessional ? 'Como você quer ser encontrado nas buscas?' : 'Quase lá!',
      icon: Briefcase,
      content: (
        <div className="space-y-4">
          {isProfessional ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Sua especialidade principal</label>
              <input
                required
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                placeholder="Ex: Eletricista Residencial, Encanador 24h..."
                className="w-full h-12 px-4 rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm outline-none focus:border-[hsl(var(--primary))]"
              />
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Isso é o que vai aparecer em destaque nas buscas.</p>
            </div>
          ) : (
            <div className="py-6 text-center text-[hsl(var(--muted-foreground))]">
              Clique em Concluir para acessar o seu painel de solicitações.
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Tudo pronto!',
      description: 'Seu perfil foi configurado. Redirecionando...',
      icon: CheckCircle2,
      content: (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="h-16 w-16 rounded-full bg-[hsl(var(--success-muted))] flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-[hsl(var(--success))]" />
          </div>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Sua conta está ativa e pronta para uso.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="w-full max-w-lg">
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))]'}`} />
        ))}
      </div>

      <div className="rounded-[var(--radius-2xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[var(--shadow-lg)] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-[var(--radius-xl)] bg-[hsl(var(--primary-muted))] flex items-center justify-center flex-shrink-0">
                {(() => {
                  const Icon = steps[step - 1].icon;
                  return <Icon className="h-6 w-6 text-[hsl(var(--primary))]" />;
                })()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">{steps[step - 1].title}</h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">{steps[step - 1].description}</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-500/10 text-red-500 text-sm rounded-md">
                {error}
              </div>
            )}

            <div className="mb-8">
              {steps[step - 1].content}
            </div>

            {step < 3 && (
              <Button className="w-full" size="lg" onClick={handleNext} disabled={loading}>
                {step === 2 ? 'Concluir Cadastro' : 'Continuar'} <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
