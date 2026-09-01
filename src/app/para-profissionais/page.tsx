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
  ChevronDown
} from 'lucide-react';
import { HomeFooter } from '@/components/home/HomeFooter';

export const metadata: Metadata = {
  title: 'AcheiYou | Encontre novos clientes para sua empresa ou serviço',
  description:
    'Cadastre sua empresa ou serviço gratuitamente no AcheiYou e conecte-se a pessoas que estão procurando profissionais na sua região.',
};

export default function ParaProfissionaisPage() {
  return (
    <main className="min-h-dvh bg-[hsl(var(--background))]" id="main-content">
      {/* HEADER SIMPLES */}
      <header className="sticky top-0 z-50 w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--background))/80] backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="AcheiYou Logo" 
              width={140} 
              height={40} 
              className="h-10 w-auto object-contain dark:hidden"
            />
            <Image 
              src="/logo-dark.png" 
              alt="AcheiYou Logo" 
              width={140} 
              height={40} 
              className="h-10 w-auto object-contain hidden dark:block"
            />
          </Link>
          <Link href="/cadastro?type=professional">
            <Button variant="default" className="font-semibold rounded-full shadow-sm">
              Começar gratuitamente
            </Button>
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-32 overflow-hidden border-b border-[hsl(var(--border))]">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary)/0.05)] to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center rounded-full border border-[hsl(var(--primary)/30)] bg-[hsl(var(--primary)/10)] px-3 py-1 text-sm font-semibold text-[hsl(var(--primary))] mb-8">
            <span className="flex h-2 w-2 rounded-full bg-[hsl(var(--primary))] mr-2 animate-pulse"></span>
            CADASTRO GRATUITO
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[hsl(var(--foreground))] mb-6 leading-tight">
            Transforme pessoas procurando serviços em <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.5)]">novos clientes.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[hsl(var(--muted-foreground))] mb-10 max-w-2xl mx-auto leading-relaxed">
            Cadastre sua empresa ou seu serviço no AcheiYou e fique disponível para pessoas que estão procurando profissionais como você.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <Link href="/cadastro?type=professional" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-bold rounded-full shadow-md bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/90)] text-primary-foreground">
                Quero cadastrar meu negócio
              </Button>
            </Link>
            <Link href="#como-funciona" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-bold rounded-full">
                Como funciona?
              </Button>
            </Link>
          </div>
          
          <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
            Comece sem pagar nada. Cadastre seus serviços e experimente a plataforma antes de decidir continuar.
          </p>
          <p className="text-xs text-[hsl(var(--muted-foreground)/70)] mt-2">
            Sem cartão de crédito. Cadastro rápido e gratuito.
          </p>
        </div>
      </section>

      {/* A DOR */}
      <section className="py-24 bg-[hsl(var(--muted)/0.3)] border-b border-[hsl(var(--border))]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] mb-4">
              Seu serviço é bom. Mas novos clientes não aparecem sozinhos.
            </h2>
            <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
              Você já tem o conhecimento e o serviço. O que muitas vezes falta é colocar seu negócio na frente de quem está procurando exatamente pelo que você oferece.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Dependência de indicação', desc: 'Ficar esperando que clientes atuais indiquem seu serviço limita seu crescimento.' },
              { title: 'Pouca previsibilidade', desc: 'Semanas com muito trabalho seguidas por semanas sem nenhum cliente novo.' },
              { title: 'Tempo perdido', desc: 'Gastar horas procurando oportunidades em grupos ou redes sociais sem resultado.' },
              { title: 'Concorrência maior', desc: 'Profissionais menos qualificados pegando os serviços porque apareceram primeiro.' },
              { title: 'Dinheiro gasto sem retorno', desc: 'Investimentos em panfletos ou anúncios difíceis de mensurar o real impacto.' },
              { title: 'Falta de presença digital', desc: 'Não ter um perfil profissional forte para passar credibilidade na internet.' }
            ].map((item, i) => (
              <Card key={i} className="border-[hsl(var(--border))] shadow-sm bg-[hsl(var(--background))]">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-[hsl(var(--foreground))] mb-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    {item.title}
                  </h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="py-24 border-b border-[hsl(var(--border))]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] mb-4">
              Como o AcheiYou funciona para você
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-[hsl(var(--border))] -z-10"></div>
            
            <div className="text-center relative">
              <div className="w-24 h-24 mx-auto bg-[hsl(var(--background))] border-4 border-[hsl(var(--primary)/20)] rounded-full flex items-center justify-center mb-6 relative z-10 shadow-lg">
                <Briefcase className="w-10 h-10 text-[hsl(var(--primary))]" />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-[hsl(var(--primary))] text-primary-foreground rounded-full flex items-center justify-center font-bold border-4 border-[hsl(var(--background))]">1</div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[hsl(var(--foreground))]">Cadastre seu negócio</h3>
              <p className="text-[hsl(var(--muted-foreground))]">Informe sua empresa, serviços, região de atendimento e formas de contato no nosso sistema.</p>
            </div>

            <div className="text-center relative">
              <div className="w-24 h-24 mx-auto bg-[hsl(var(--background))] border-4 border-[hsl(var(--primary)/20)] rounded-full flex items-center justify-center mb-6 relative z-10 shadow-lg">
                <Search className="w-10 h-10 text-[hsl(var(--primary))]" />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-[hsl(var(--primary))] text-primary-foreground rounded-full flex items-center justify-center font-bold border-4 border-[hsl(var(--background))]">2</div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[hsl(var(--foreground))]">Fique disponível</h3>
              <p className="text-[hsl(var(--muted-foreground))]">Seu negócio passa a fazer parte da rede AcheiYou e pode ser encontrado por pessoas procurando serviços.</p>
            </div>

            <div className="text-center relative">
              <div className="w-24 h-24 mx-auto bg-[hsl(var(--background))] border-4 border-[hsl(var(--primary)/20)] rounded-full flex items-center justify-center mb-6 relative z-10 shadow-lg">
                <MessageSquare className="w-10 h-10 text-[hsl(var(--primary))]" />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-[hsl(var(--primary))] text-primary-foreground rounded-full flex items-center justify-center font-bold border-4 border-[hsl(var(--background))]">3</div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[hsl(var(--foreground))]">Receba oportunidades</h3>
              <p className="text-[hsl(var(--muted-foreground))]">Quando surgir uma solicitação compatível com seu serviço, você recebe o contato para enviar um orçamento.</p>
            </div>
          </div>

          <div className="mt-12 text-center p-4 bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] rounded-lg text-sm max-w-2xl mx-auto border border-[hsl(var(--border))]">
            <strong>Observação:</strong> Os resultados podem variar conforme categoria, região, demanda e disponibilidade de oportunidades. Nosso papel é facilitar a conexão.
          </div>
        </div>
      </section>

      {/* PRINCIPAL BENEFICIO */}
      <section className="py-24 bg-[hsl(var(--foreground))] text-[hsl(var(--background))]">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
            Você cuida do serviço. Nós trabalhamos para trazer a demanda.
          </h2>
          <p className="text-xl md:text-2xl opacity-90 leading-relaxed font-medium">
            O AcheiYou foi criado para aproximar quem precisa de um serviço de quem sabe realizá-lo.
            Enquanto você concentra seu tempo no seu negócio, trabalhamos para aumentar a presença da plataforma e atrair pessoas que estão procurando profissionais.
          </p>
        </div>
      </section>

      {/* ZERO RISCO */}
      <section className="py-24 border-b border-[hsl(var(--border))]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-block px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-bold uppercase tracking-wider mb-2">
                100% Gratuito para Começar
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))]">
                Conheça primeiro. Pague depois.
              </h2>
              <p className="text-lg text-[hsl(var(--muted-foreground))]">
                Você não precisa pagar para criar seu perfil e conhecer o funcionamento do AcheiYou. Queremos que você experimente a plataforma na prática.
              </p>
              
              <ul className="space-y-4 mt-6">
                {[
                  'Cadastro inicial gratuito',
                  'Sem cartão de crédito',
                  'Sem compromisso inicial',
                  'Cadastre todos os seus serviços',
                  'Conheça a plataforma por dentro',
                  'Veja como as oportunidades funcionam'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-medium text-[hsl(var(--foreground))]">
                    <CheckCircle2 className="text-green-500 shrink-0 w-6 h-6" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-6">
                <Link href="/cadastro?type=professional">
                  <Button size="lg" className="h-14 px-8 text-base font-bold rounded-full shadow-md">
                    Começar gratuitamente
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="aspect-square max-w-md mx-auto bg-gradient-to-tr from-[hsl(var(--primary)/20)] to-[hsl(var(--primary)/5)] rounded-[2.5rem] p-8 flex items-center justify-center border border-[hsl(var(--primary)/10)] relative">
                <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-xl rounded-[2.5rem]"></div>
                <div className="relative z-10 w-full space-y-4">
                   <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
                     <CardContent className="p-4 flex items-center gap-4">
                       <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                         <ShieldCheck className="w-6 h-6" />
                       </div>
                       <div>
                         <p className="font-bold text-sm text-[hsl(var(--foreground))]">Risco Zero</p>
                         <p className="text-xs text-slate-500 dark:text-slate-400">Experimente sem custos</p>
                       </div>
                     </CardContent>
                   </Card>
                   <Card className="shadow-lg border-0 bg-white dark:bg-slate-900 translate-x-4">
                     <CardContent className="p-4 flex items-center gap-4">
                       <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                         <CreditCard className="w-6 h-6" />
                       </div>
                       <div>
                         <p className="font-bold text-sm text-[hsl(var(--foreground))]">Sem Cartão</p>
                         <p className="text-xs text-slate-500 dark:text-slate-400">Não pedimos seus dados agora</p>
                       </div>
                     </CardContent>
                   </Card>
                   <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
                     <CardContent className="p-4 flex items-center gap-4">
                       <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center shrink-0">
                         <Clock className="w-6 h-6" />
                       </div>
                       <div>
                         <p className="font-bold text-sm text-[hsl(var(--foreground))]">Cadastro Rápido</p>
                         <p className="text-xs text-slate-500 dark:text-slate-400">Leva menos de 2 minutos</p>
                       </div>
                     </CardContent>
                   </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POR QUE CADASTRAR */}
      <section className="py-24 bg-[hsl(var(--muted)/0.3)] border-b border-[hsl(var(--border))]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))]">
              Por que cadastrar sua empresa?
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {[
              { icon: Search, title: 'Mais visibilidade na sua região' },
              { icon: MapPin, title: 'Presença digital profissional' },
              { icon: Briefcase, title: 'Novas oportunidades de orçamentos' },
              { icon: TrendingUp, title: 'Possibilidade de crescimento' },
              { icon: CheckCircle2, title: 'Perfil estruturado para clientes' },
              { icon: MessageSquare, title: 'Conexão direta com interessados' }
            ].map((item, i) => (
              <div key={i} className="bg-[hsl(var(--background))] p-6 rounded-2xl border border-[hsl(var(--border))] text-center hover:border-[hsl(var(--primary)/50)] transition-colors shadow-sm">
                <item.icon className="w-8 h-8 mx-auto text-[hsl(var(--primary))] mb-4" />
                <h3 className="font-semibold text-[hsl(var(--foreground))]">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANO E TRANSPARENCIA */}
      <section className="py-24 border-b border-[hsl(var(--border))]">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] mb-6">
            E depois do período inicial?
          </h2>
          <p className="text-lg text-[hsl(var(--muted-foreground))] mb-12">
            Após o período inicial gratuito para você conhecer a plataforma, você poderá continuar utilizando o AcheiYou através do plano profissional.
          </p>

          <div className="bg-[hsl(var(--background))] border border-[hsl(var(--primary)/20)] rounded-3xl p-8 md:p-12 shadow-xl max-w-2xl mx-auto mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <TrendingUp className="w-32 h-32 text-[hsl(var(--primary))]" />
            </div>
            
            <div className="text-sm font-bold tracking-widest text-[hsl(var(--primary))] uppercase mb-2">Plano Profissional</div>
            <div className="flex items-baseline justify-center gap-1 mb-6">
              <span className="text-2xl font-semibold text-[hsl(var(--muted-foreground))]">R$</span>
              <span className="text-6xl font-black text-[hsl(var(--foreground))]">99</span>
              <span className="text-xl text-[hsl(var(--muted-foreground))]">/mês</span>
            </div>
            
            <div className="bg-[hsl(var(--muted))] p-5 rounded-xl mb-8 border border-[hsl(var(--border))] text-left text-sm md:text-base text-[hsl(var(--foreground))] leading-relaxed relative z-10">
              <p className="mb-2"><strong>Por que cobramos esse valor?</strong></p>
              <p className="text-[hsl(var(--muted-foreground))]">
                Parte da receita das assinaturas é reinvestida na divulgação do AcheiYou através de campanhas de marketing e tráfego pago para atrair continuamente mais pessoas procurando serviços para dentro da plataforma.
              </p>
            </div>

            <Link href="/cadastro?type=professional">
              <Button size="lg" className="w-full h-14 text-base font-bold rounded-full">
                Quero começar gratuitamente
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[hsl(var(--muted)/0.3)] border-b border-[hsl(var(--border))]">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[hsl(var(--foreground))]">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { q: 'Preciso pagar para me cadastrar?', a: 'Não. O cadastro inicial é gratuito.' },
              { q: 'Preciso colocar cartão de crédito?', a: 'Não. Você não precisa inserir dados de pagamento para se cadastrar e conhecer a plataforma.' },
              { q: 'Vou receber clientes garantidamente?', a: 'Não existe garantia de quantidade de clientes. As oportunidades dependem da demanda, categoria, região e disponibilidade. O objetivo do AcheiYou é conectar profissionais a pessoas que procuram pelos serviços oferecidos.' },
              { q: 'Quanto custa para continuar depois?', a: 'O plano profissional custa R$99 por mês.' },
              { q: 'Posso cadastrar minha empresa?', a: 'Sim. Empresas de prestação de serviços de todos os tamanhos são bem-vindas.' },
              { q: 'Posso cadastrar meus serviços?', a: 'Sim, você pode adicionar e descrever os serviços específicos que presta.' },
              { q: 'Atendo mais de uma cidade. Posso informar?', a: 'Sim. Utilize as opções disponíveis no cadastro para informar sua área de atendimento.' }
            ].map((faq, i) => (
              <details key={i} className="group bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 font-semibold cursor-pointer text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted)/0.5)] transition-colors">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-[hsl(var(--muted-foreground))] transition-transform group-open:rotate-180" />
                </summary>
                <div className="p-6 pt-0 text-[hsl(var(--muted-foreground))] border-t border-[hsl(var(--border))] mt-2">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 bg-[hsl(var(--background))] relative overflow-hidden">
        {/* Background blobs for visual interest */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-[hsl(var(--primary)/10)] blur-[100px] rounded-full pointer-events-none -z-10"></div>
        
        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-[hsl(var(--foreground))] mb-6 leading-tight">
            Seu próximo cliente pode estar procurando exatamente pelo que você oferece.
          </h2>
          <p className="text-xl text-[hsl(var(--muted-foreground))] mb-10">
            Cadastre sua empresa ou seu serviço gratuitamente e faça parte do AcheiYou.
          </p>
          
          <Link href="/cadastro?type=professional">
            <Button size="lg" className="h-16 px-10 text-lg font-bold rounded-full shadow-lg hover:scale-105 transition-transform bg-[hsl(var(--primary))] text-primary-foreground">
              Quero cadastrar meu negócio gratuitamente
            </Button>
          </Link>
          <p className="text-sm font-medium text-[hsl(var(--muted-foreground))] mt-6 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            Cadastro rápido • Sem cartão • Sem compromisso inicial
          </p>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}
