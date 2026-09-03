'use client';

import { CheckCircle2, Star, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function PlanosView({ currentPlan, onUpgrade }: { currentPlan: string, onUpgrade: (type: string, amount: number, description: string) => void }) {
  const plans = [
    {
      id: 'BASIC',
      name: 'Básico',
      price: 'R$ 0',
      period: '/mês',
      description: 'Ideal para quem está começando na plataforma.',
      features: [
        'Perfil público na plataforma',
        'Receba pedidos na sua região',
        'Pague apenas pelo lead que quiser',
        'Suporte via e-mail'
      ],
      buttonText: 'Seu Plano Atual',
      buttonVariant: 'outline' as const,
      disabled: currentPlan === 'BASIC',
      popular: false,
    },
    {
      id: 'PRO',
      name: 'Profissional',
      price: 'R$ 97',
      period: '/mês',
      description: 'Para profissionais que querem lotar a agenda todo dia.',
      features: [
        'Acesso ILIMITADO aos orçamentos',
        'Destaque nas buscas (Selo PRO)',
        'Botão direto para o WhatsApp do cliente',
        'Custo ZERO por orçamentos liberados'
      ],
      buttonText: currentPlan === 'PRO' ? 'Seu Plano Atual' : 'Assinar PRO',
      buttonVariant: 'default' as const,
      disabled: currentPlan === 'PRO',
      popular: true,
      priceValue: 97,
    },
    {
      id: 'ELITE',
      name: 'Elite',
      price: 'R$ 197',
      period: '/mês',
      description: 'Domine sua região com IA e prioridade máxima.',
      features: [
        'Tudo do plano Profissional',
        'Acesso aos Leads Premium com IA',
        'Topo das buscas na sua cidade',
        'Selo de Verificação Ouro exclusivo'
      ],
      buttonText: currentPlan === 'ELITE' ? 'Seu Plano Atual' : 'Assinar ELITE',
      buttonVariant: 'default' as const,
      disabled: currentPlan === 'ELITE',
      popular: false,
      priceValue: 197,
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold mb-2 text-[hsl(var(--foreground))]">Sua Assinatura</h2>
        <p className="text-[hsl(var(--muted-foreground))]">Escolha o melhor plano para o seu momento e aumente sua renda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative flex flex-col ${plan.popular ? 'border-[hsl(var(--primary))] shadow-lg shadow-[hsl(var(--primary)/0.1)]' : ''}`}>
            {plan.popular && (
              <div className="absolute top-0 inset-x-0 -translate-y-1/2 flex justify-center">
                <Badge className="bg-[hsl(var(--primary))] text-primary-foreground font-semibold px-3 py-1 text-xs">
                  Mais Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-8 pt-8">
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="mt-2 h-10">{plan.description}</CardDescription>
              <div className="mt-6">
                <span className="text-4xl font-extrabold text-[hsl(var(--foreground))]">{plan.price}</span>
                <span className="text-[hsl(var(--muted-foreground))] font-medium">{plan.period}</span>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1">
              <ul className="space-y-3 text-sm text-[hsl(var(--muted-foreground))]">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    {plan.id === 'ELITE' && i === 1 ? (
                      <Zap className="h-5 w-5 text-amber-500 shrink-0" />
                    ) : plan.popular && i === 0 ? (
                      <Star className="h-5 w-5 text-[hsl(var(--primary))] shrink-0" />
                    ) : (
                      <CheckCircle2 className={`h-5 w-5 shrink-0 ${plan.popular ? 'text-[hsl(var(--primary))]' : 'text-slate-400'}`} />
                    )}
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter className="pt-6">
              <Button 
                variant={plan.buttonVariant} 
                className={`w-full ${plan.popular && !plan.disabled ? 'bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-primary-foreground' : ''}`}
                disabled={plan.disabled}
                onClick={() => {
                  if (!plan.disabled && plan.priceValue) {
                    onUpgrade('UPGRADE_PRO', plan.priceValue, `Assinatura Mensal - Plano ${plan.name}`);
                  }
                }}
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
