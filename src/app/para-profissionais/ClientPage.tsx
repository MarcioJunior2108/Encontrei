'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CheckCircle2, 
  ChevronDown,
  ArrowRight,
  Users,
  Target,
  BadgeCheck,
  Zap,
  Smartphone,
  MessageCircle,
  Building,
  TrendingUp,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowDown,
  Check,
  Search,
  Wrench,
  Paintbrush,
  Truck,
  Leaf,
  Hammer,
  Wind,
  Camera,
  Home,
  Monitor,
  Droplets,
  Sparkles,
  Lightbulb
} from 'lucide-react';
import { HomeFooter } from '@/components/home/HomeFooter';

// Variantes para animação de scroll
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

// Estilos de animação para o ticker
const tickerStyle = `
  @keyframes ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .ticker-track { animation: ticker 47s linear infinite; }
  .ticker-track:hover { animation-play-state: paused; }
`;

export function ParaProfissionaisClient() {
  const [activeToast, setActiveToast] = useState(0);
  const [serviceValue, setServiceValue] = useState(300);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveToast((prev) => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const toasts = [
    { name: "Ana P.", service: "Reformas", city: "São Paulo, SP" },
    { name: "Carlos M.", service: "Eletricista", city: "Curitiba, PR" },
    { name: "Juliana T.", service: "Limpeza", city: "Belo Horizonte, MG" },
    { name: "Marcos R.", service: "Fretes", city: "Rio de Janeiro, RJ" },
  ];

  const tickerItems = [
    { icon: Zap, text: "Eletricista", city: "Salvador, BA" },
    { icon: Paintbrush, text: "Pintor", city: "Fortaleza, CE" },
    { icon: Droplets, text: "Encanador", city: "São Paulo, SP" },
    { icon: Truck, text: "Frete", city: "Rio de Janeiro, RJ" },
    { icon: Sparkles, text: "Limpeza", city: "Curitiba, PR" },
    { icon: Building, text: "Reformas", city: "Belo Horizonte, MG" },
    { icon: Leaf, text: "Jardineiro", city: "Manaus, AM" },
    { icon: Hammer, text: "Marceneiro", city: "Porto Alegre, RS" },
    { icon: Wind, text: "Ar-condicionado", city: "Recife, PE" },
    { icon: Camera, text: "Fotógrafo", city: "Brasília, DF" },
    { icon: Home, text: "Diarista", city: "Goiânia, GO" },
    { icon: Monitor, text: "TI / Suporte", city: "Florianópolis, SC" },
  ];

  const categories = [
    { icon: Zap, label: "Eletricista", hot: true },
    { icon: Droplets, label: "Encanador", hot: true },
    { icon: Paintbrush, label: "Pintor", hot: true },
    { icon: Sparkles, label: "Limpeza", hot: false },
    { icon: Truck, label: "Fretes", hot: true },
    { icon: Building, label: "Reformas", hot: false },
    { icon: Leaf, label: "Jardineiro", hot: false },
    { icon: Hammer, label: "Marceneiro", hot: false },
    { icon: Wind, label: "Ar-condicionado", hot: true },
    { icon: Home, label: "Diarista", hot: false },
    { icon: Monitor, label: "TI / Suporte", hot: false },
    { icon: Camera, label: "Fotógrafo", hot: false },
  ];

  const netROI = serviceValue - 99;

  return (
    <main className="min-h-dvh bg-[#080d19] font-sans text-slate-50 selection:bg-blue-600 selection:text-white pb-16 md:pb-0" id="main-content">
      
      {/* 1. NAVBAR - FORÇADA EM TEMA ESCURO */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#080d19]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between max-w-7xl">
          <Link href="/" className="flex items-center gap-2 group">
            <Image 
              src="/logo-dark.png" 
              alt="AcheiYou Logo" 
              width={140} 
              height={40} 
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="hidden sm:inline-flex items-center rounded-full bg-blue-900/40 px-3 py-1 text-xs font-semibold text-blue-400 ring-1 ring-inset ring-blue-700/20 ml-2">
              Para Profissionais
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link href="/cadastro?type=professional">
              <Button className="font-semibold rounded-full px-6 bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-sm shadow-blue-900/50 transition-all hover:shadow-blue-600/30 hover:-translate-y-0.5">
                Criar conta grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO / PROMESSA PRINCIPAL */}
      <section className="relative pt-16 md:pt-28 pb-20 border-b border-slate-800/60 overflow-hidden">
        {/* Abstract Background Wallpaper */}
        <div className="absolute inset-0 w-full h-full z-0">
          <Image 
            src="/hero-bg.jpg" 
            alt="Hero Background" 
            fill 
            className="object-cover object-center opacity-30 mix-blend-screen"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080d19]/60 via-[#080d19]/80 to-[#080d19] backdrop-blur-[2px]"></div>
        </div>
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
            
            {/* Esquerda: Copy Focada na Conversão */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex-1 text-center lg:text-left z-10 w-full"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center rounded-full border border-blue-900/50 bg-blue-950/30 backdrop-blur-sm px-3 py-1.5 text-xs font-bold tracking-wide uppercase text-blue-400 mb-8 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                Cadastro Gratuito Para Profissionais
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-[4.2rem] font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
                Seu próximo cliente pode estar procurando <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">exatamente pelo seu serviço.</span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Cadastre seu serviço no AcheiYou, apareça para pessoas da sua região e receba pedidos de orçamento diretamente no seu celular.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col items-center lg:items-start w-full">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <Link href="/cadastro?type=professional" className="w-full sm:w-auto group">
                    <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-bold rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all duration-300 hover:-translate-y-1 border border-blue-500/30">
                      Quero receber clientes
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="#como-funciona" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-bold rounded-full border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors backdrop-blur-sm">
                      Ver como funciona
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-3">
                  <div className="flex -space-x-3 mr-2">
                    <div className="w-10 h-10 rounded-full border-2 border-[#080d19] overflow-hidden shadow-md z-40 ring-1 ring-slate-700">
                      <Image src="/avatars/avatar1.jpg" alt="Cliente" width={40} height={40} className="w-full h-full object-cover" />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-[#080d19] overflow-hidden shadow-md z-30 ring-1 ring-slate-700">
                      <Image src="/avatars/avatar2.jpg" alt="Cliente" width={40} height={40} className="w-full h-full object-cover" />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-[#080d19] overflow-hidden shadow-md z-20 ring-1 ring-slate-700">
                      <Image src="/avatars/avatar3.jpg" alt="Cliente" width={40} height={40} className="w-full h-full object-cover" />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-[#080d19] overflow-hidden shadow-md z-10 ring-1 ring-slate-700">
                      <Image src="/avatars/avatar4.jpg" alt="Cliente" width={40} height={40} className="w-full h-full object-cover" />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-[#080d19] bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 shadow-md z-0 ring-1 ring-slate-700">+</div>
                  </div>
                  <span className="text-sm text-slate-300 font-medium">Mais de <strong className="text-white">1.000 clientes</strong> buscando serviços todos os dias.</span>
                </div>
                
                <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-sm font-semibold text-slate-400">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400"/> Grátis para começar</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400"/> Sem cartão de crédito</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400"/> Menos de 5 minutos</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Direita: Mockup Visual Premium */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", damping: 20 }}
              className="flex-1 w-full max-w-md mx-auto relative lg:mt-0 perspective-1000"
            >
              {/* Decorative glows */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/20 blur-[80px] rounded-full -z-10 animate-pulse"></div>
              
              <motion.div 
                whileHover={{ y: -5, rotateY: -5 }}
                className="relative rounded-3xl border border-slate-700/60 bg-slate-900/90 backdrop-blur-xl shadow-2xl p-6 lg:p-8 transform-gpu"
              >
                {/* Status Bar Fake */}
                <div className="flex justify-between items-center mb-6 opacity-60 text-white">
                  <span className="text-[10px] font-bold">14:32</span>
                  <div className="flex gap-1.5">
                    <Zap className="w-3 h-3 text-white" />
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  </div>
                </div>

                <div className="flex items-start gap-4 border-b border-slate-800 pb-5 mb-5">
                  <div className="w-12 h-12 bg-blue-900/40 rounded-2xl flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/20">
                    <BadgeCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white leading-tight">Novo Pedido de Orçamento</h3>
                    <p className="text-sm text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Agora mesmo
                    </p>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 bg-blue-900/30 px-2.5 py-1 rounded-md border border-blue-800/50">
                        <Zap className="w-3 h-3 fill-current" /> Compatível
                      </span>
                    </div>
                    
                    <h4 className="font-bold text-slate-100 mb-1">Manutenção elétrica</h4>
                    <p className="text-sm text-slate-400 flex items-center gap-1 mb-3">
                      <MapPin className="w-3 h-3" /> Salvador, BA
                    </p>
                    
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800/80">
                      <p className="text-sm text-slate-300 italic">
                        "Preciso de um profissional para revisar a instalação do chuveiro hoje à tarde..."
                      </p>
                    </div>
                  </div>

                  <Button className="w-full h-12 bg-white hover:bg-slate-200 text-slate-900 rounded-xl font-bold shadow-md transition-transform hover:-translate-y-0.5">
                    Ver pedido
                  </Button>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* TICKER - BUSCAS AO VIVO */}
      <section className="py-5 bg-[#050914] border-y border-slate-800/80 overflow-hidden">
        <style>{tickerStyle}</style>
        <div className="relative">
          {/* Fade esquerdo */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050914] to-transparent z-10 pointer-events-none"></div>
          {/* Fade direito */}
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050914] to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex ticker-track w-max">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <div key={i} className="flex items-center gap-2 mx-6 py-2 whitespace-nowrap">
                <div className="w-7 h-7 rounded-lg bg-slate-700/80 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-slate-300" />
                </div>
                <span className="text-sm font-bold text-slate-300">{item.text}</span>
                <span className="text-slate-600 text-xs font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{item.city}
                </span>
                <span className="inline-flex items-center gap-1 bg-emerald-900/40 border border-emerald-700/40 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  buscando agora
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-700 mx-4"></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIAS MAIS BUSCADAS */}
      <section className="py-20 bg-[#080d19]">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold tracking-widest uppercase text-blue-400 mb-3">Demanda na plataforma</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Seu serviço já está sendo procurado.</h2>
            <p className="text-slate-400 mt-3 text-lg font-medium">Estes são os serviços mais buscados por clientes na plataforma agora.</p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4"
          >
            {categories.map((cat, i) => (
              <motion.div key={i} variants={fadeInUp}
                className="relative flex flex-col items-center gap-3 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all duration-300 cursor-default group"
              >
                {cat.hot && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-900/60">
                    top
                  </span>
                )}
                <div className="w-12 h-12 rounded-2xl bg-slate-800 group-hover:bg-blue-900/40 flex items-center justify-center group-hover:scale-110 transition-all duration-300 border border-slate-700 group-hover:border-blue-500/40">
                  <cat.icon className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <span className="text-xs font-bold text-slate-300 text-center leading-tight">{cat.label}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
            className="mt-10 text-center"
          >
            <p className="text-slate-500 font-medium">O seu serviço não está na lista? Também aceitamos <strong className="text-slate-300">dezenas de outras categorias</strong>.</p>
          </motion.div>
        </div>
      </section>

      {/* 3. DOR DO PROFISSIONAL */}
      <section className="py-24 bg-[#050914] border-b border-slate-800/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-[2.5rem] font-bold text-white mb-6 leading-tight text-balance">
              Ser bom no que você faz deveria ser suficiente para conseguir clientes.
            </h2>
            <p className="text-lg md:text-xl text-slate-400 font-medium text-balance">
              Mas nem sempre é assim. Muitos profissionais dependem de indicação, passam períodos sem novos serviços ou perdem oportunidades simplesmente porque o cliente não sabe que eles existem.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {[
              { icon: Users, title: "Depender de indicação", desc: "Indicações são ótimas, mas não são previsíveis. O fluxo de trabalho oscila demais." },
              { icon: TrendingUp, title: "Ficar esperando o cliente", desc: "Dias com a agenda vazia enquanto existem pessoas na sua cidade precisando exatamente do seu serviço." },
              { icon: Target, title: "Perder para concorrência", desc: "Profissionais menos qualificados fecham o serviço apenas porque apareceram primeiro na internet." }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="h-full">
                <Card className="border-slate-800/80 bg-slate-900/40 backdrop-blur-sm hover:bg-slate-800/80 hover:border-slate-700 transition-all duration-300 h-full group">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-slate-800 group-hover:bg-blue-900/40 rounded-2xl flex items-center justify-center mb-6 text-slate-400 group-hover:text-blue-400 transition-colors border border-slate-700/50">
                      <item.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }}
            className="mt-16 text-center"
          >
            <p className="text-xl font-bold text-blue-400 flex items-center justify-center gap-2">
              <ArrowDown className="w-5 h-5 animate-bounce" />
              É exatamente esse problema que o AcheiYou resolve.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4. TRANSFORMAÇÃO */}
      <section className="py-24 bg-[#080d19] relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
              className="space-y-4"
            >
              {[
                "Você precisa correr atrás de clientes.",
                "Seu trabalho depende exclusivamente de indicação.",
                "Você perde oportunidades porque não foi encontrado na internet."
              ].map((text, i) => (
                <motion.div key={i} variants={fadeInUp} className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800/80 opacity-70 grayscale-[0.5]">
                  {i === 0 && <span className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 block">Antes</span>}
                  <p className="text-xl font-semibold text-slate-400">{text}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
              className="space-y-4 md:-mt-8"
            >
              {[
                { text: "Clientes procurando seu serviço na região podem encontrar você.", highlight: true },
                { text: "Você cria uma vitrine e constrói uma presença profissional online sólida.", highlight: false },
                { text: "Você recebe pedidos compatíveis e negocia diretamente com eles.", highlight: false }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeInUp} 
                  className={`${item.highlight ? 'bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.3)] border-blue-500' : 'bg-slate-800 border-slate-700'} p-8 rounded-3xl shadow-xl transform transition-transform hover:-translate-y-2 duration-300 border`}
                >
                  {i === 0 && <span className="text-sm font-bold text-blue-200 uppercase tracking-wider mb-4 block">Com o AcheiYou</span>}
                  <p className={`text-xl font-bold ${item.highlight ? 'text-white' : 'text-slate-100'}`}>
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* 5. COMO FUNCIONA (O MECANISMO) */}
      <section id="como-funciona" className="relative py-28 border-y border-slate-800/80 overflow-hidden bg-[#050914]">
        {/* Abstract Background Wallpaper (Flipped) */}
        <div className="absolute inset-0 w-full h-full z-0 transform -scale-x-100 mix-blend-screen">
          <Image 
            src="/hero-bg.jpg" 
            alt="Section Background" 
            fill 
            className="object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050914] via-[#050914]/80 to-[#050914]"></div>
        </div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-20 text-balance"
          >
            Você trabalha. O AcheiYou ajuda clientes a encontrar você.
          </motion.h2>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 relative"
          >
            {/* Linha conectora desktop */}
            <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-px bg-slate-800 -z-10">
              <div className="h-full bg-blue-600/50 w-full"></div>
            </div>

            {[
              { num: "01", icon: Building, title: "Crie seu perfil", desc: "Informe seus serviços, região de atendimento, adicione fotos e construa sua vitrine profissional." },
              { num: "02", icon: Search, title: "Seja encontrado", desc: "O AcheiYou apresenta seu perfil para pessoas da sua região que estão procurando serviços como o seu." },
              { num: "03", icon: MessageCircle, title: "Receba oportunidades", desc: "Quando surgir uma solicitação compatível, você recebe a oportunidade e pode negociar diretamente com o cliente." }
            ].map((step, i) => (
              <motion.div key={i} variants={fadeInUp} className="flex flex-col items-center group">
                <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-700 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center text-2xl font-black text-white mb-8 relative group-hover:border-blue-500 transition-colors duration-500">
                  {step.num}
                  <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/50 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-slate-400 font-medium text-lg leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
            className="mt-20"
          >
            <Link href="/cadastro?type=professional">
              <Button size="lg" className="rounded-full px-10 bg-blue-600 hover:bg-blue-500 text-white font-bold h-16 text-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] border border-blue-500/50 transition-all hover:-translate-y-1">
                Criar meu perfil grátis
              </Button>
            </Link>
            <p className="mt-4 text-sm font-semibold text-slate-500">Leva menos de 5 minutos.</p>
          </motion.div>
        </div>
      </section>

      {/* 6. DIFERENCIAIS (POR QUE O ACHEIYOU?) */}
      <section className="py-24 bg-[#080d19]">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {[
              { icon: Zap, color: "text-emerald-400", bg: "bg-emerald-900/30", border: "border-emerald-500/20", title: "Sem comissão sobre o serviço", desc: "Você não entrega 15%, 20% ou 30% do seu trabalho. O valor que você cobrar do cliente é 100% seu. Ponto final." },
              { icon: Smartphone, color: "text-blue-400", bg: "bg-blue-900/30", border: "border-blue-500/20", title: "Contato direto", desc: "Negocie diretamente com o cliente por WhatsApp ou ligação. Sem intermediários atrapalhando a sua comunicação." },
              { icon: ShieldCheck, color: "text-purple-400", bg: "bg-purple-900/30", border: "border-purple-500/20", title: "Você continua dono do seu negócio", desc: "O AcheiYou apenas conecta você às oportunidades. Quem decide os preços, prazos, onde e como atender é você." },
              { icon: Building, color: "text-orange-400", bg: "bg-orange-900/30", border: "border-orange-500/20", title: "Presença profissional online", desc: "Tenha uma vitrine digital confiável para apresentar seus serviços, fotos e diferenciais para a sua região." }
            ].map((diff, i) => (
              <motion.div key={i} variants={fadeInUp} className="p-8 lg:p-10 rounded-[2rem] bg-slate-900/50 border border-slate-800 flex flex-col justify-center hover:bg-slate-800/80 transition-colors duration-300 group">
                <div className={`w-14 h-14 ${diff.bg} rounded-2xl flex items-center justify-center mb-6 border ${diff.border} group-hover:scale-110 transition-transform duration-300`}>
                  <diff.icon className={`w-7 h-7 ${diff.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{diff.title}</h3>
                <p className="text-lg text-slate-400 font-medium leading-relaxed">
                  {diff.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 7. CONSTRUÇÃO DE VALOR E PREÇO */}
      <section className="py-24 bg-[#050914] border-t border-slate-800/80">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Calculadora de ROI */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.p variants={fadeInUp} className="text-xs font-bold tracking-widest uppercase text-blue-400 mb-4">Calculadora de retorno</motion.p>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Quanto você ganha com 1 serviço por mês?
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-slate-400 font-medium mb-10 leading-relaxed">
                Ajuste o valor do seu serviço e veja o retorno líquido após o plano.
              </motion.p>

              <motion.div variants={fadeInUp} className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">Valor médio do seu serviço</label>
                    <span className="text-2xl font-black text-white">R$ {serviceValue.toLocaleString('pt-BR')}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="3000"
                    step="50"
                    value={serviceValue}
                    onChange={(e) => setServiceValue(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(59,130,246,0.7)] [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-600 mt-2 font-semibold">
                    <span>R$ 100</span>
                    <span>R$ 3.000</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Plano mensal</p>
                    <p className="text-2xl font-black text-slate-300">R$ 99</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-emerald-900/40 border border-emerald-500/30 text-center">
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-2">Lucro líquido</p>
                    <p className="text-2xl font-black text-emerald-400">R$ {netROI.toLocaleString('pt-BR')}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-900/20 border border-blue-700/30">
                  <p className="text-sm font-semibold text-blue-300 text-center flex items-center justify-center gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-400 shrink-0" />
                    Fechar <strong>1 serviço</strong> de R$ {serviceValue.toLocaleString('pt-BR')} já paga o plano e ainda sobra <strong className="text-emerald-400">R$ {netROI.toLocaleString('pt-BR')}</strong> de lucro.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Preço */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-blue-600/20 blur-[80px] rounded-[3rem]"></div>
              <Card className="relative border border-slate-700 shadow-2xl shadow-blue-900/20 bg-slate-900 rounded-[2.5rem] overflow-hidden">
                <div className="bg-blue-600 text-white text-center py-3 text-sm font-bold tracking-widest uppercase">
                  Plano Profissional
                </div>
                <CardContent className="p-8 sm:p-12">
                  <h3 className="text-2xl font-bold text-white mb-2 text-center">Comece gratuitamente. Continue se fizer sentido.</h3>
                  <div className="flex justify-center items-baseline gap-1 my-10">
                    <span className="text-3xl font-bold text-slate-500">R$</span>
                    <span className="text-[5rem] leading-none font-black text-white tracking-tighter">99</span>
                    <span className="text-xl text-slate-500 font-medium">/mês</span>
                  </div>
                  
                  <div className="space-y-5 mb-10">
                    {[
                      "Perfil profissional ativo",
                      "Recebimento de oportunidades",
                      "Contato direto com clientes",
                      "Sem comissão sobre serviços fechados",
                      "Presença na plataforma"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                        <span className="font-medium text-lg text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>

                  <Link href="/cadastro?type=professional" className="block">
                    <Button className="w-full h-16 rounded-2xl font-bold text-lg bg-white hover:bg-slate-200 text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-transform hover:-translate-y-1">
                      Criar meu perfil grátis
                    </Button>
                  </Link>
                  <p className="text-center text-sm font-semibold text-slate-500 mt-5">Sem cartão de crédito para começar.</p>
                </CardContent>
              </Card>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 8. FAQ (OBJEÇÕES) */}
      <section className="py-24 bg-[#080d19] border-t border-slate-800/80">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white">
              Perguntas Frequentes
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: 'Preciso ter CNPJ?', a: 'Não. Aceitamos tanto profissionais autônomos (pessoas físicas) quanto empresas constituídas (CNPJ). O importante é a qualidade do serviço prestado.' },
              { q: 'Preciso pagar para me cadastrar?', a: 'Não. O cadastro e a criação do seu perfil são 100% gratuitos e não exigem cartão de crédito.' },
              { q: 'Quando começo a pagar?', a: 'Apenas quando você decidir ativar o plano profissional para continuar recebendo os pedidos da sua região, após testar e conhecer a plataforma.' },
              { q: 'Existe comissão sobre o serviço?', a: 'Não. Você não paga nenhuma porcentagem do valor do serviço fechado. O pagamento do cliente é negociado diretamente com você.' },
              { q: 'Como recebo os pedidos?', a: 'Sempre que um cliente solicitar um serviço compatível, você recebe a notificação na plataforma/celular e pode visualizar os detalhes.' },
              { q: 'Posso atender apenas determinadas regiões?', a: 'Sim. Durante a configuração do seu perfil, você define exatamente quais cidades ou bairros deseja atender.' },
              { q: 'Posso cancelar quando quiser?', a: 'Sim. A assinatura (quando ativada) não tem contrato de fidelidade. Você cancela quando achar que não faz mais sentido.' },
              { q: 'Quanto tempo leva para criar meu perfil?', a: 'Menos de 5 minutos. O processo é direto ao ponto.' }
            ].map((faq, i) => (
              <motion.details 
                key={i} 
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/50 shadow-sm [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between p-6 font-bold text-white cursor-pointer hover:bg-slate-800 transition-colors">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform duration-300" />
                </summary>
                <div className="p-6 pt-0 text-slate-400 font-medium leading-relaxed border-t border-slate-800 mt-2">
                  {faq.a}
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CTA FINAL */}
      <section className="relative py-32 bg-blue-700 overflow-hidden">
        {/* Background abstract */}
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-20 mix-blend-screen"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-blue-700/80 mix-blend-multiply"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="container mx-auto px-4 max-w-4xl relative z-10 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 leading-tight text-balance">
            Está na hora de deixar mais clientes encontrarem você.
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 font-medium mb-12 max-w-2xl mx-auto text-balance opacity-90">
            Crie seu perfil profissional no AcheiYou gratuitamente e comece a construir sua presença na plataforma.
          </p>
          
          <Link href="/cadastro?type=professional">
            <Button size="lg" className="h-16 px-12 text-lg font-bold rounded-full bg-white text-blue-700 hover:bg-blue-50 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:-translate-y-1 transition-all duration-300">
              Quero cadastrar meu serviço
            </Button>
          </Link>
          
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-bold text-blue-200">
            <span>Grátis para começar</span>
            <span className="hidden sm:inline">•</span>
            <span>Sem cartão</span>
            <span className="hidden sm:inline">•</span>
            <span>Menos de 5 minutos</span>
          </div>
        </motion.div>
      </section>

      <HomeFooter />

      {/* FOMO TOAST (Live Activity) */}
      <div className="fixed bottom-24 md:bottom-8 left-4 md:left-8 z-50 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeToast}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="bg-slate-900/90 backdrop-blur-xl border border-slate-700 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl p-4 flex items-start gap-4 max-w-[320px]"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-300 leading-snug">
                <strong className="text-white">{toasts[activeToast].name}</strong> de {toasts[activeToast].city} acabou de pedir orçamento para <strong className="text-blue-400">{toasts[activeToast].service}</strong>.
              </p>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Agora mesmo</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* STICKY CTA MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#080d19]/90 backdrop-blur-xl border-t border-slate-800 z-50 md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-full duration-500 delay-1000">
        <Link href="/cadastro?type=professional">
          <Button className="w-full h-14 font-bold text-base rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            Quero receber clientes
          </Button>
        </Link>
      </div>

    </main>
  );
}
