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
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  BadgeCheck,
  Target,
  Smartphone
} from 'lucide-react';
import { HomeFooter } from '@/components/home/HomeFooter';

export const metadata: Metadata = {
  title: 'AcheiYou | Seja um Profissional Parceiro',
  description:
    'Cadastre sua empresa ou serviço gratuitamente no AcheiYou e conecte-se a pessoas que estão procurando profissionais na sua região.',
};

export default function ParaProfissionaisPage() {
  return (
    <main className="min-h-dvh bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 selection:bg-blue-600 selection:text-white" id="main-content">
      
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
        <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between max-w-7xl">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="AcheiYou Logo" 
              width={140} 
              height={40} 
              className="h-9 w-auto object-contain dark:hidden"
            />
            <Image 
              src="/logo-dark.png" 
              alt="AcheiYou Logo" 
              width={140} 
              height={40} 
              className="h-9 w-auto object-contain hidden dark:block"
            />
            <span className="hidden sm:inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 ml-2">
              Para Profissionais
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              Entrar
            </Link>
            <Link href="/cadastro?type=professional">
              <Button className="font-medium rounded-lg px-5 bg-blue-600 hover:bg-blue-700 text-white border-0">
                Criar conta grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION - CLEAN & CONVERSION FOCUSED */}
      <section className="relative pt-16 md:pt-24 pb-20 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Esquerda: Copy Forte */}
            <div className="flex-1 text-center lg:text-left z-10">
              <div className="inline-flex items-center rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-300 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                Cadastro 100% gratuito
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
                Receba pedidos de orçamento direto no seu celular.
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                O AcheiYou conecta sua empresa a clientes na sua região que estão procurando exatamente pelo serviço que você presta. Sem intermediários, você negocia direto com o cliente.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link href="/cadastro?type=professional" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm">
                    Cadastrar minha empresa
                  </Button>
                </Link>
                <Link href="#como-funciona" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                    Ver como funciona
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Rápido e fácil</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Sem cartão de crédito</span>
              </div>
            </div>

            {/* Direita: Mockup Clean */}
            <div className="flex-1 w-full max-w-lg mx-auto relative hidden md:block">
              <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl p-6 z-10 transform lg:rotate-2">
                <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl">
                    <BadgeCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Novo Pedido de Orçamento</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Há 2 minutos • Na sua região</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Serviço</span>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Compatível</span>
                    </div>
                    <p className="font-medium text-slate-900 dark:text-slate-200">Manutenção Elétrica Residencial</p>
                    <p className="text-sm text-slate-600 mt-1">"Preciso de um profissional para revisar a fiação do chuveiro..."</p>
                  </div>

                  <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
                    Aceitar e Falar com Cliente
                  </Button>
                </div>
              </div>
              
              {/* Elemento de fundo sutil */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-blue-100 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-[80px] -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* DORES E SOLUÇÕES - DESIGN ESTRUTURADO */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Não dependa apenas da sorte para fechar o mês.
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Profissionais excelentes muitas vezes ficam parados porque o cliente certo não conseguiu encontrá-los. Nós resolvemos os principais gargalos do prestador de serviços.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-transparent">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Viver de indicações</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Indicações são ótimas, mas imprevisíveis. Você precisa de um fluxo constante e controlável de pessoas que estão ativamente buscando o seu serviço hoje.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-transparent">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Marketing complicado</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Fazer panfletos, gerenciar anúncios no Google ou tentar ser um influenciador no Instagram toma o tempo que você deveria usar trabalhando na sua profissão.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-transparent">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Concorrência desleal</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Muitas vezes você perde o serviço para concorrentes menos qualificados simplesmente porque eles têm uma presença digital mais organizada que a sua.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA - SIMPLES E DIRETO */}
      <section id="como-funciona" className="py-24 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Como o AcheiYou atrai clientes para você
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-10">
                Nosso papel é ser a maior vitrine de serviços da sua região. Entenda como funciona a jornada do seu cadastro até o fechamento de um serviço.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold shrink-0">1</div>
                    <div className="w-px h-full bg-slate-200 dark:bg-slate-700 my-2"></div>
                  </div>
                  <div className="pb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Você se cadastra e monta seu perfil</h3>
                    <p className="text-slate-600 dark:text-slate-400">Insira seus dados, a área de cobertura (cidades ou bairros), categorias de serviço e fotos de trabalhos anteriores. Tudo isso forma sua vitrine profissional.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold shrink-0">2</div>
                    <div className="w-px h-full bg-slate-200 dark:bg-slate-700 my-2"></div>
                  </div>
                  <div className="pb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Nós investimos para trazer tráfego</h3>
                    <p className="text-slate-600 dark:text-slate-400">O AcheiYou faz anúncios no Google e redes sociais para atrair pessoas que estão digitando "preciso de [seu serviço] em [sua cidade]".</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold shrink-0">3</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Você recebe as oportunidades</h3>
                    <p className="text-slate-600 dark:text-slate-400">Quando um cliente solicita um serviço compatível, você é notificado. Basta aceitar o pedido, passar seu orçamento e fechar o negócio sem comissões.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Por que os profissionais preferem o AcheiYou?</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Sem taxas sobre o serviço</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Nós não cobramos 10%, 20% ou 30% do valor que você cobra do cliente. O lucro do serviço é 100% seu.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Contato direto</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Você tem acesso ao telefone do cliente para negociar via WhatsApp ou ligação como achar melhor.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Liberdade total</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Atenda quando puder e onde quiser. Você não é funcionário da plataforma, você é um parceiro dono do próprio negócio.</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* RISCO ZERO - APRESENTAÇÃO PRAGMÁTICA */}
      <section className="py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Conheça primeiro. Avalie depois.
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
            Acreditamos na transparência. Você não precisa cadastrar nenhum cartão de crédito ou se comprometer financeiramente para criar o perfil da sua empresa hoje.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <span className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-800">✓ Cadastro Gratuito</span>
            <span className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-800">✓ Sem exigência de cartão</span>
            <span className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-800">✓ Configure seu perfil completo</span>
          </div>

          <Link href="/cadastro?type=professional">
            <Button size="lg" className="h-14 px-8 text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              Criar minha conta gratuita agora
            </Button>
          </Link>
        </div>
      </section>

      {/* PLANO / PRICING - HONESTO E TRANSPARENTE */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Um modelo de negócio sustentável
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Após conhecer a plataforma, caso decida manter seu perfil ativo recebendo solicitações, possuímos um único plano profissional. Simples, sem taxas escondidas e sem comissões.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Plano Profissional</h3>
            <p className="text-sm text-slate-500 mb-6">Tudo que você precisa para captar clientes online.</p>
            
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-2xl font-bold text-slate-400">R$</span>
              <span className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">99</span>
              <span className="text-slate-500">/mês</span>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-6">
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">Para onde vai esse valor?</p>
              <p className="text-sm text-blue-700/80 dark:text-blue-400/80">
                Uma grande parte da receita das assinaturas é destinada ao nosso orçamento de marketing pago (Google, Redes Sociais) para garantir que sempre existam pessoas chegando à plataforma buscando por serviços.
              </p>
            </div>

            <Link href="/cadastro?type=professional">
              <Button className="w-full h-12 text-base font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                Começar gratuitamente hoje
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { q: 'O que o AcheiYou faz exatamente?', a: 'O AcheiYou é uma plataforma que conecta pessoas que precisam de serviços (desde manutenção residencial até profissionais de tecnologia) com prestadores qualificados na região.' },
              { q: 'Eu pago alguma comissão sobre o serviço fechado?', a: 'Não. Você negocia os valores e a forma de pagamento diretamente com o cliente. Não retemos nenhuma porcentagem do seu trabalho.' },
              { q: 'Como sou notificado sobre novos clientes?', a: 'Você receberá notificações através do nosso painel e/ou contatos via WhatsApp quando um cliente demonstrar interesse nos seus serviços.' },
              { q: 'Preciso ter CNPJ para me cadastrar?', a: 'Não. Aceitamos tanto profissionais autônomos (pessoas físicas) quanto empresas constituídas (CNPJ). O importante é a qualidade do serviço prestado.' },
              { q: 'Posso cancelar a assinatura quando quiser?', a: 'Sim, o plano profissional é uma assinatura mensal sem contrato de fidelidade. Você cancela quando achar que não faz mais sentido para o seu negócio.' }
            ].map((faq, i) => (
              <details key={i} className="group border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950 shadow-sm [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 font-semibold text-slate-900 dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-6 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 mt-2">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-24 bg-blue-600 text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para receber novos clientes?
          </h2>
          <p className="text-blue-100 text-lg mb-10">
            Cadastre sua empresa, configure seu perfil em menos de 5 minutos e passe a fazer parte da plataforma AcheiYou.
          </p>
          <Link href="/cadastro?type=professional">
            <Button size="lg" className="h-14 px-8 text-base font-bold rounded-xl bg-white text-blue-600 hover:bg-blue-50 shadow-sm border-0">
              Fazer cadastro gratuito
            </Button>
          </Link>
          <p className="mt-6 text-sm text-blue-200 font-medium">
            Sem compromisso. Comece a usar imediatamente.
          </p>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}
