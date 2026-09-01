import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CheckCircle2, 
  Search, 
  MapPin, 
  MessageSquare, 
  Briefcase, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  CreditCard,
  ChevronDown,
  ArrowRight,
  Star,
  Users,
  Zap
} from 'lucide-react';
import { HomeFooter } from '@/components/home/HomeFooter';

export const metadata: Metadata = {
  title: 'AcheiYou | Encontre novos clientes para sua empresa ou serviço',
  description:
    'Cadastre sua empresa ou serviço gratuitamente no AcheiYou e conecte-se a pessoas que estão procurando profissionais na sua região.',
};

export default function ParaProfissionaisPage() {
  return (
    <main className="min-h-dvh bg-[hsl(var(--background))] selection:bg-[hsl(var(--primary))] selection:text-primary-foreground overflow-hidden" id="main-content">
      
      {/* HEADER PREMIUM */}
      <header className="fixed top-0 z-50 w-full border-b border-[hsl(var(--border))/50] bg-[hsl(var(--background))/60] backdrop-blur-xl transition-all duration-300">
        <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="AcheiYou Logo" 
              width={160} 
              height={45} 
              className="h-11 w-auto object-contain dark:hidden"
            />
            <Image 
              src="/logo-dark.png" 
              alt="AcheiYou Logo" 
              width={160} 
              height={45} 
              className="h-11 w-auto object-contain hidden dark:block"
            />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/cadastro?type=professional" className="hidden sm:block text-sm font-medium hover:text-[hsl(var(--primary))] transition-colors">
              Já tenho conta
            </Link>
            <Link href="/cadastro?type=professional">
              <Button className="font-bold rounded-full px-6 shadow-lg shadow-[hsl(var(--primary))/20] hover:shadow-[hsl(var(--primary))/40] transition-all hover:-translate-y-0.5">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION PREMIUM */}
      <section className="relative pt-32 lg:pt-48 pb-20 lg:pb-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-30 pointer-events-none -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(var(--primary))] rounded-full mix-blend-multiply filter blur-[128px] animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000"></div>
        </div>

        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] -z-20 opacity-20 dark:opacity-10"></div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
          <div className="inline-flex items-center rounded-full border border-[hsl(var(--primary))/20] bg-[hsl(var(--primary))/5] backdrop-blur-sm px-4 py-1.5 text-sm font-bold text-[hsl(var(--primary))] mb-8 shadow-sm">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[hsl(var(--primary))] mr-2.5 animate-pulse shadow-[0_0_8px_hsl(var(--primary))]"></span>
            100% GRATUITO PARA INICIAR
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-[hsl(var(--foreground))] mb-8 leading-[1.1]">
            Clientes procurando por <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--primary))] via-purple-500 to-[hsl(var(--primary))] animate-gradient-x">você agora.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-[hsl(var(--muted-foreground))] mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Você é especialista no que faz. Nós somos especialistas em trazer o cliente até você. Cadastre sua empresa e receba orçamentos diretamente.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/cadastro?type=professional" className="w-full sm:w-auto group">
              <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg font-black rounded-full shadow-[0_0_40px_hsl(var(--primary)/30)] hover:shadow-[0_0_60px_hsl(var(--primary)/50)] transition-all duration-300 hover:scale-105 bg-[hsl(var(--primary))] text-primary-foreground border-2 border-transparent">
                Quero cadastrar meu negócio
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          {/* Social Proof Strip */}
          <div className="flex flex-col items-center justify-center gap-4 pt-8 border-t border-[hsl(var(--border))/40]">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`w-12 h-12 rounded-full border-2 border-[hsl(var(--background))] bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold shadow-sm z-[${5-i}] overflow-hidden`}>
                   <img src={`https://i.pravatar.cc/150?u=acheiyou${i}`} alt="Profissional" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-[hsl(var(--background))] bg-[hsl(var(--muted))] flex items-center justify-center text-xs font-bold shadow-sm z-0">
                +2k
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-sm font-semibold text-[hsl(var(--foreground))]">Junte-se a milhares de profissionais crescendo com o AcheiYou.</p>
            </div>
          </div>
        </div>
      </section>

      {/* A DOR (BENTO GRID PREMIUM) */}
      <section className="py-32 bg-[hsl(var(--card))] relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[hsl(var(--foreground))] mb-6 tracking-tight">
              O modelo antigo de captar clientes quebrou.
            </h2>
            <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto font-medium">
              Viver de indicação não paga as contas. Ficar postando no Instagram sem ter seguidores não traz orçamentos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            <div className="md:col-span-2 group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 p-10 transition-all hover:border-red-500/40">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500">
                <Users className="w-32 h-32 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-4 mt-auto absolute bottom-24">Dependência de Indicações</h3>
              <p className="text-[hsl(var(--muted-foreground))] text-lg absolute bottom-10 max-w-md">Ficar esperando o telefone tocar porque alguém te indicou limita completamente o seu potencial de faturamento.</p>
            </div>

            <div className="group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 p-10 transition-all hover:border-orange-500/40">
               <h3 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-4">Instabilidade</h3>
               <p className="text-[hsl(var(--muted-foreground))]">Semanas lotadas de trabalho, seguidas por semanas vazias. A montanha-russa do profissional autônomo.</p>
            </div>

            <div className="group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 p-10 transition-all hover:border-blue-500/40">
               <h3 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-4">Concorrência</h3>
               <p className="text-[hsl(var(--muted-foreground))]">Profissionais menos qualificados roubando seus clientes apenas porque apareceram primeiro no Google.</p>
            </div>

            <div className="md:col-span-2 group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 p-10 transition-all hover:border-purple-500/40">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500">
                <TrendingUp className="w-32 h-32 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-4 absolute bottom-24">Dinheiro jogado fora</h3>
              <p className="text-[hsl(var(--muted-foreground))] text-lg absolute bottom-10 max-w-md">Imprimir panfletos ou impulsionar posts sem estratégia só drena o seu caixa sem trazer retorno real de clientes interessados.</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA (VISUAL STEPPER) */}
      <section id="como-funciona" className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-24">
            <span className="text-[hsl(var(--primary))] font-bold tracking-wider uppercase text-sm mb-4 block">A Solução</span>
            <h2 className="text-4xl md:text-5xl font-black text-[hsl(var(--foreground))] tracking-tight">
              Apenas 3 passos para a sua agenda lotar
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-1 bg-gradient-to-r from-transparent via-[hsl(var(--primary))/30] to-transparent -z-10 rounded-full"></div>
            
            {[
              { 
                icon: Briefcase, 
                title: '1. Crie sua vitrine', 
                desc: 'Cadastre seus serviços, área de atuação e mostre seu portfólio. Seu perfil será sua nova máquina de vendas.',
                color: 'text-blue-500',
                bg: 'bg-blue-500/10'
              },
              { 
                icon: Search, 
                title: '2. Fique no radar', 
                desc: 'Quando um cliente na sua região procurar exatamente pelo que você faz, seu perfil será recomendado pelo nosso algoritmo.',
                color: 'text-purple-500',
                bg: 'bg-purple-500/10'
              },
              { 
                icon: Zap, 
                title: '3. Feche negócios', 
                desc: 'Receba o contato direto do cliente, envie seu orçamento e feche o serviço. Simples, rápido e sem intermediários na negociação.',
                color: 'text-amber-500',
                bg: 'bg-amber-500/10'
              }
            ].map((step, i) => (
              <div key={i} className="relative group">
                <div className={`w-32 h-32 mx-auto ${step.bg} rounded-[2rem] rotate-3 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 flex items-center justify-center mb-8 border border-white/10 shadow-xl backdrop-blur-sm`}>
                  <step.icon className={`w-14 h-14 ${step.color}`} />
                </div>
                <div className="text-center px-4">
                  <h3 className="text-2xl font-extrabold mb-4 text-[hsl(var(--foreground))]">{step.title}</h3>
                  <p className="text-[hsl(var(--muted-foreground))] text-lg font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPAL BENEFICIO (ULTRA BOLD) */}
      <section className="py-40 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute -top-[300px] -right-[300px] w-[800px] h-[800px] bg-[hsl(var(--primary))] rounded-full mix-blend-screen filter blur-[200px] opacity-30"></div>
        
        <div className="container mx-auto px-4 text-center max-w-5xl relative z-10">
          <h2 className="text-5xl md:text-7xl font-black mb-10 leading-[1.1] tracking-tighter">
            Você executa a obra. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--primary))] to-purple-400">Nós trazemos o cliente.</span>
          </h2>
          <p className="text-2xl md:text-3xl opacity-80 leading-relaxed font-medium max-w-3xl mx-auto">
            Gaste 100% do seu tempo entregando um serviço de excelência. Deixe o marketing pesado e a captação de clientes por nossa conta.
          </p>
          <div className="mt-16">
            <Link href="/cadastro?type=professional">
              <Button size="lg" className="h-16 px-10 text-lg font-bold rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform bg-white text-black hover:bg-gray-100 border-0">
                Quero experimentar agora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ZERO RISCO (GLASSMORPHISM) */}
      <section className="py-32 relative">
        <div className="absolute top-1/2 left-0 w-full h-[500px] bg-gradient-to-b from-green-500/5 to-transparent -translate-y-1/2 -z-10"></div>
        
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[3rem] p-8 md:p-16 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
              <div className="flex-1 space-y-8">
                <div className="inline-flex px-4 py-1.5 bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 rounded-full text-sm font-black uppercase tracking-widest">
                  100% Sem Risco
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-[hsl(var(--foreground))] tracking-tight">
                  Conheça a plataforma primeiro. Pague depois.
                </h2>
                <p className="text-xl text-[hsl(var(--muted-foreground))] font-medium leading-relaxed">
                  Não acreditamos em cobrar antes de você ver o valor. Cadastre-se, crie seu perfil completo e sinta a plataforma funcionando sem colocar a mão no bolso.
                </p>
                
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                  {[
                    'Cadastro gratuito',
                    'Zero cartão de crédito',
                    'Sem fidelidade',
                    'Acesso imediato'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-lg font-bold text-[hsl(var(--foreground))]">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="text-green-500 w-5 h-5" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex-1 w-full flex justify-center">
                <div className="relative w-full max-w-sm">
                  {/* Floating Elements */}
                  <div className="absolute -top-10 -right-10 bg-[hsl(var(--background))] border border-[hsl(var(--border))] p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce" style={{animationDuration: '3s'}}>
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Rápido</p>
                      <p className="text-xs text-muted-foreground">Pronto em 2 min</p>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-10 -left-10 bg-[hsl(var(--background))] border border-[hsl(var(--border))] p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Seguro</p>
                      <p className="text-xs text-muted-foreground">Dados protegidos</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[hsl(var(--primary))] to-purple-600 rounded-[2.5rem] p-10 text-white shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <CreditCard className="w-16 h-16 mb-8 opacity-80" />
                    <h3 className="text-3xl font-black mb-2">Cartão de Crédito?</h3>
                    <p className="text-xl opacity-90 font-medium">Deixe na carteira.<br/>Você não vai precisar dele hoje.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLANO (PRICING CARD PREMIUM) */}
      <section className="py-32 bg-[hsl(var(--muted)/0.3)] border-y border-[hsl(var(--border))]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[hsl(var(--foreground))] mb-6 tracking-tight">
              Um modelo de negócio transparente.
            </h2>
            <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto font-medium">
              Não escondemos o jogo. Você começa de graça e, quando estiver pronto para escalar, nosso plano é simples, único e focado no seu retorno.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-[hsl(var(--background))] rounded-[2.5rem] border-2 border-[hsl(var(--primary))] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative transform hover:-translate-y-2 transition-transform duration-300">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[hsl(var(--primary))] text-primary-foreground px-6 py-2 rounded-full text-sm font-black tracking-widest uppercase shadow-lg">
                Plano Profissional
              </div>
              
              <div className="text-center mt-6 mb-8">
                <div className="flex items-start justify-center gap-1">
                  <span className="text-3xl font-bold text-[hsl(var(--muted-foreground))] mt-2">R$</span>
                  <span className="text-7xl font-black text-[hsl(var(--foreground))] tracking-tighter">99</span>
                </div>
                <span className="text-lg font-semibold text-[hsl(var(--muted-foreground))]">cobrado mensalmente</span>
              </div>
              
              <div className="bg-[hsl(var(--primary))/5] border border-[hsl(var(--primary))/20] rounded-2xl p-6 mb-8">
                <p className="font-bold text-[hsl(var(--primary))] mb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Marketing Reinvestido
                </p>
                <p className="text-sm text-[hsl(var(--muted-foreground))] font-medium leading-relaxed">
                  Usamos o valor da sua assinatura para investir em anúncios pesados no Google e Instagram, garantindo que o AcheiYou sempre tenha clientes buscando serviços.
                </p>
              </div>

              <Link href="/cadastro?type=professional" className="block">
                <Button size="lg" className="w-full h-16 text-lg font-black rounded-2xl bg-[hsl(var(--foreground))] text-[hsl(var(--background))] hover:bg-[hsl(var(--foreground))/90]">
                  Criar conta gratuita
                </Button>
              </Link>
              <p className="text-center text-sm font-bold text-green-600 dark:text-green-400 mt-4">
                Comece grátis. Cancele quando quiser.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[hsl(var(--foreground))] tracking-tight">
              Tudo que você precisa saber
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { q: 'Preciso pagar para me cadastrar?', a: 'Não. O cadastro inicial é 100% gratuito. Você pode criar seu perfil, listar seus serviços e conhecer a plataforma sem nenhum custo.' },
              { q: 'Preciso colocar cartão de crédito agora?', a: 'Absolutamente não. Queremos que você experimente a plataforma sem barreiras ou compromissos financeiros iniciais.' },
              { q: 'Vou receber clientes garantidamente?', a: 'Seria desonesto garantir um número exato de clientes. O AcheiYou é uma ponte entre quem procura e quem faz. O volume depende da sua categoria, região e da demanda do mercado, mas nosso trabalho diário é atrair essas oportunidades para você.' },
              { q: 'Quais tipos de profissionais podem usar?', a: 'De encanadores e eletricistas a designers, fotógrafos e técnicos de TI. Se você presta um serviço, o AcheiYou é para você e sua empresa.' },
              { q: 'Atendo em cidades vizinhas. Como fica?', a: 'Você tem total controle. No seu painel, você configura exatamente o seu raio de atuação ou as cidades específicas que atende.' }
            ].map((faq, i) => (
              <details key={i} className="group bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden shadow-sm hover:shadow-md transition-shadow">
                <summary className="flex items-center justify-between p-6 font-bold text-lg cursor-pointer text-[hsl(var(--foreground))]">
                  {faq.q}
                  <div className="w-10 h-10 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center group-open:bg-[hsl(var(--primary))/10] transition-colors">
                    <ChevronDown className="w-5 h-5 text-[hsl(var(--foreground))] group-open:text-[hsl(var(--primary))] transition-transform group-open:rotate-180" />
                  </div>
                </summary>
                <div className="p-6 pt-0 text-[hsl(var(--muted-foreground))] font-medium text-lg leading-relaxed border-t border-[hsl(var(--border))] mt-2">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL (MASSIVE) */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(var(--primary))/20] -z-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[hsl(var(--primary))] rounded-full mix-blend-multiply filter blur-[250px] opacity-20 -z-10 animate-pulse"></div>
        
        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-[hsl(var(--foreground))] mb-8 leading-[1.1] tracking-tighter">
            Não deixe seu próximo cliente ir para a concorrência.
          </h2>
          <p className="text-2xl text-[hsl(var(--muted-foreground))] mb-12 font-medium">
            Leve apenas 2 minutos para colocar seu negócio no radar.
          </p>
          
          <Link href="/cadastro?type=professional">
            <Button size="lg" className="h-20 px-12 text-2xl font-black rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:scale-110 hover:-translate-y-2 transition-all duration-300 bg-[hsl(var(--primary))] text-primary-foreground border-4 border-transparent hover:border-white/20">
              Criar Perfil Profissional Grátis
            </Button>
          </Link>
          <div className="mt-8 flex items-center justify-center gap-6 text-[hsl(var(--muted-foreground))] font-bold text-sm">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500"/> Zero Custos</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500"/> Sem Cartão</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500"/> Imediato</span>
          </div>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}
