import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Search, MessageSquare, ShieldCheck, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Como funciona | Encontrei',
  description: 'Entenda como é fácil e seguro contratar profissionais pela plataforma.',
};

export default function ComoFuncionaPage() {
  const steps = [
    {
      icon: Search,
      title: '1. Encontre o profissional ideal',
      description: 'Use nossa busca inteligente para encontrar especialistas na sua cidade. Filtre por especialidade, preço e avaliação.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: MessageSquare,
      title: '2. Peça um orçamento sem compromisso',
      description: 'Gostou do perfil? Clique em "Contratar agora", descreva o que precisa e envie a solicitação direto para o WhatsApp ou painel do profissional.',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
    {
      icon: ShieldCheck,
      title: '3. Feche negócio com segurança',
      description: 'Receba a resposta rápida do profissional. Em breve, você poderá pagar pelo serviço direto na plataforma com total garantia e segurança antifraude.',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      icon: Star,
      title: '4. Avalie o serviço',
      description: 'Após o trabalho finalizado, deixe sua avaliação. Isso ajuda toda a comunidade a encontrar sempre os melhores talentos!',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <main id="main-content" className="min-h-dvh bg-[hsl(var(--background))] selection:bg-[hsl(var(--primary)/0.2)]">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[hsl(var(--primary)/0.1)] blur-3xl" />
        <div className="absolute top-40 -left-40 w-72 h-72 rounded-full bg-[hsl(var(--primary)/0.05)] blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-[hsl(var(--foreground))] tracking-tight mb-6">
            Sua necessidade resolvida em <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.6))]">4 passos simples</span>.
          </h1>
          <p className="text-lg md:text-xl text-[hsl(var(--muted-foreground))] leading-relaxed max-w-2xl mx-auto">
            A plataforma mais segura e rápida para conectar clientes com profissionais qualificados. Veja como o fluxo funciona do início ao fim.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-6 p-6 md:p-8 rounded-[var(--radius-2xl)] bg-[hsl(var(--card))] border border-[hsl(var(--border))] hover:shadow-[var(--shadow-lg)] transition-all group">
              <div className={`w-16 h-16 rounded-2xl ${step.bgColor} ${step.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <step.icon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[hsl(var(--foreground))] mb-3">{step.title}</h3>
                <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* For Professionals Section */}
      <section className="py-24 px-4 sm:px-6 border-t border-[hsl(var(--border))] mt-12 bg-[hsl(var(--muted)/0.3)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-4">Você é um profissional?</h2>
          <p className="text-[hsl(var(--muted-foreground))] mb-8 max-w-xl mx-auto">
            Crie seu perfil grátis, aumente sua visibilidade e receba orçamentos de clientes direto no seu painel. Assuma o controle dos seus negócios.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/cadastro" className="inline-flex items-center justify-center h-12 px-8 rounded-[var(--radius-lg)] bg-[hsl(var(--primary))] text-white font-medium hover:bg-[hsl(var(--primary)/0.9)] transition-colors">
              Criar Perfil Grátis
            </a>
            <a href="/buscar" className="inline-flex items-center justify-center h-12 px-8 rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-transparent text-[hsl(var(--foreground))] font-medium hover:bg-[hsl(var(--muted))] transition-colors">
              Ver Profissionais
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
