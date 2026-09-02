'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  Send, 
  Play, 
  Pause, 
  AlertTriangle, 
  CheckCircle2, 
  UserX, 
  MessageSquareText, 
  Sparkles, 
  Smartphone, 
  Upload, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  ExternalLink,
  Clock,
  Shuffle,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Papa from 'papaparse';

interface TargetUser {
  id: string;
  name: string;
  phone: string;
  status: string;
  variationIndex?: number;
  sentManually?: boolean;
}

const TEMPLATES = [
  {
    id: 'promessa-lucro-direto',
    name: '💰 Promessa Forte: Clientes Direto no Pix (Zero Comissão)',
    icon: Sparkles,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    description: 'Promessa: Mais clientes na sua cidade sem intermediários e 100% do lucro no seu bolso.',
    variations: [
      '{Oi|Olá|Opa} {{nome}}, {{saudacao}}! {Tudo bem?|Tudo certo?}\n\n{Você ainda tem disponibilidade para pegar novos serviços de orçamentos aí na sua região?|Está pegando serviços e reformas na sua cidade essa semana?}',
      '{{saudacao}} {{nome}}, {como vai?|tudo bem contigo?}\n\n{Localizei seu contato de prestador de serviços e queria saber se|Vi seu anúncio e queria checar se} você {atende clientes residenciais e comerciais aí na sua área|está pegando novos clientes na região} atualmente?',
      '{Olá|Oi|Fala} {{nome}}, {{saudacao}}!\n\n{Você faz orçamentos de serviços aí na sua cidade?|Está atendendo novos clientes na sua região esse mês?}'
    ]
  },
  {
    id: 'pergunta-qualificacao',
    name: '🛡️ Gancho de Curiosidade: Seleção de Prestadores',
    icon: ShieldCheck,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    description: 'Faz o prestador se sentir valorizado e responder imediatamente achando que é um pedido.',
    variations: [
      '{Oi|Olá|Opa} {{nome}}, {{saudacao}}! {Tudo bem?|Tudo em ordem?}\n\n{Preciso de uma informação: você atende|Você ainda está pegando} {serviços e reparos|atendimentos} na {sua região|cidade}?',
      '{{saudacao}} {{nome}}, {tudo bem?|como estão os trabalhos?}\n\n{Estamos selecionando os profissionais mais recomendados da cidade para direcionar clientes.|Estamos mapeando os melhores prestadores da região para indicar serviços.}\n\n{Você teria interesse em receber esses contatos?}',
      '{Olá|Fala} {{nome}}, {{saudacao}}! {Tudo certo?}\n\n{Consegui seu contato e gostaria de confirmar se você ainda está ativo com serviços aí na região?|Você está com agenda aberta para novos serviços esse mês?}'
    ]
  },
  {
    id: 'boas-vindas-perfil',
    name: '🚀 Convite Direto: Perfil Gratuito Sem Cartão',
    icon: MessageSquareText,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    description: 'Quebra objeção de custo logo de início (sem taxa de adesão).',
    variations: [
      '{Olá|Oi} {{nome}}, {{saudacao}}!\n\n{Reservamos um espaço gratuito para o seu trabalho no novo catálogo de profissionais da nossa cidade.|Criamos um perfil de destaque para você receber pedidos de orçamento direto no WhatsApp sem pagar comissão.}\n\n{Posso te mandar os detalhes para você conferir?|Quer que eu te envie o acesso para testar?}',
      '{{saudacao}} {{nome}}, {tudo bem?|tudo certo?}\n\n{Temos moradores da sua cidade procurando profissionais da sua área.|Recebemos pedidos de orçamento na sua região e queremos te conectar a esses clientes.}\n\n{Gostaria de receber esses contatos direto no seu WhatsApp? Me dá um alô!}'
    ]
  }
];

// Helper para saudação dinâmica de acordo com o horário do dia
function getDynamicGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'bom dia';
  if (hour >= 12 && hour < 18) return 'boa tarde';
  return 'boa noite';
}

// Parser de Spintax avançado (suporta múltiplos níveis aninhados)
function parseSpintaxAdvanced(text: string): string {
  if (!text) return '';
  let parsed = text;
  const spintaxRegex = /\{([^{}]+)\}/g;
  
  let iterations = 0;
  while (spintaxRegex.test(parsed) && iterations < 10) {
    parsed = parsed.replace(spintaxRegex, (_, match) => {
      const options = match.split('|');
      return options[Math.floor(Math.random() * options.length)] || '';
    });
    iterations++;
  }
  return parsed;
}

// Gera hash/caractere invisível anti-duplicação (Zero-width space)
function generateInvisibleSignature(): string {
  const invisibleChars = ['\u200B', '\u200C', '\u200D', '\uFEFF'];
  const count = Math.floor(Math.random() * 4) + 1;
  let res = '';
  for (let i = 0; i < count; i++) {
    res += invisibleChars[Math.floor(Math.random() * invisibleChars.length)];
  }
  return res;
}

export default function BroadcastCRMPage() {
  const [speedMode, setSpeedMode] = useState<'SAFE' | 'NORMAL' | 'FAST'>('SAFE');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<TargetUser[]>([]);
  
  // Múltiplas variações de mensagem
  const [variations, setVariations] = useState<string[]>([
    '{Oi|Olá|Opa|Fala} {{nome}}, {{saudacao}}! {Tudo bem?|Tudo certo?|Como vai?}\n\n{Você ainda está pegando|Você atende|Está atendendo} {serviços e orçamentos|novos serviços|atendimentos} aí na {sua região|cidade}?',
    '{{saudacao}} {{nome}}, {tudo bem?|como estão as coisas?}\n\n{Consegui seu contato e queria confirmar se|Vi seu anúncio e gostaria de saber se} você {trabalha com serviços/reparos|presta serviços} na região atualmente?',
    '{Olá|Oi} {{nome}}, {{saudacao}}! {Tudo em ordem?|Tudo tranquilo?}\n\n{Você tem disponibilidade para novos orçamentos|Está com a agenda aberta para novos serviços} esse mês?'
  ]);
  const [activeVariationTab, setActiveVariationTab] = useState<number>(0);

  const [activeMode, setActiveMode] = useState<'ROBOT' | 'ONE_CLICK'>('ROBOT');
  const [inputType, setInputType] = useState<'csv' | 'manual'>('csv');
  const [manualInput, setManualInput] = useState('');
  
  const [isSending, setIsSending] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<{ id: string; status: 'success' | 'error'; errorMsg?: string }[]>([]);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [validationDone, setValidationDone] = useState(false);
  const [removedCount, setRemovedCount] = useState(0);
  const [manualSentMap, setManualSentMap] = useState<Record<string, boolean>>({});

  // Auto-Pause mechanism
  useEffect(() => {
    if (consecutiveErrors >= 3) {
      setIsPaused(true);
      alert('⚠️ ATENÇÃO: A campanha foi PAUSADA AUTOMATICAMENTE!\n\nDetectamos 3 erros seguidos de envio. Isso quase sempre indica que:\n1. O seu WhatsApp Web/Evolution API foi desconectado.\n2. O seu número sofreu um bloqueio (banimento) do WhatsApp.\n\nVerifique a conexão do seu aparelho antes de tentar retomar a campanha.');
      setConsecutiveErrors(0);
    }
  }, [consecutiveErrors]);

  // Formata mensagem para um usuário específico
  const formatUserMessage = (user: TargetUser, variationIdx?: number): string => {
    const rawTemplate = variations[variationIdx !== undefined ? (variationIdx % variations.length) : (activeVariationTab % variations.length)] || variations[0] || '';
    
    const firstName = user.name ? user.name.split(' ')[0] : 'Amigo(a)';
    const cleanName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    
    let text = rawTemplate
      .replace(/\{\{nome\}\}/gi, cleanName)
      .replace(/\{\{saudacao\}\}/gi, getDynamicGreeting());
    
    // Aplica Spintax
    text = parseSpintaxAdvanced(text);
    
    // Adiciona assinatura invisível para que o hash de cada mensagem seja 100% único
    text = text + generateInvisibleSignature();

    return text;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (parsedResult) => {
        const parsedUsers: TargetUser[] = [];
        
        parsedResult.data.forEach((row: any, index: number) => {
          const keys = Object.keys(row);
          if (keys.length === 0) return;

          let nomeKey = keys.find(k => k.toLowerCase().includes('nome'));
          let phoneKey = keys.find(k => 
            k.toLowerCase().includes('telefone') || 
            k.toLowerCase().includes('celular') || 
            k.toLowerCase().includes('numero') || 
            k.toLowerCase().includes('phone') || 
            k.toLowerCase().includes('contato')
          );
          
          if (!nomeKey) nomeKey = keys[0];
          if (!phoneKey) phoneKey = keys.length > 1 ? keys[1] : keys[0];

          if (row[phoneKey]) {
            let phone = String(row[phoneKey]).replace(/\D/g, ''); 
            if (phone.length >= 10 && phone.length <= 11) {
                phone = '55' + phone;
            }
            if (phone.length >= 12) {
              parsedUsers.push({
                id: `csv-${index}`,
                name: String(row[nomeKey] || 'Profissional').trim(),
                phone: phone,
                status: 'IMPORTED',
                variationIndex: index % Math.max(1, variations.length)
              });
            }
          }
        });

        setUsers(parsedUsers);
        setLoading(false);
        setCurrentIndex(0);
        setResults([]);
        e.target.value = '';
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao ler a planilha. Verifique o formato CSV.');
        setLoading(false);
      }
    });
  };

  const handleManualSubmit = () => {
    if (!manualInput.trim()) return;
    setLoading(true);
    
    const rawNumbers = manualInput.split(/[\n,]+/);
    const parsedUsers: TargetUser[] = [];
    
    rawNumbers.forEach((raw, index) => {
      let phone = raw.replace(/\D/g, '');
      if (phone.length >= 10 && phone.length <= 11) {
          phone = '55' + phone;
      }
      if (phone.length >= 12) {
        parsedUsers.push({
          id: `manual-${index}`,
          name: 'Profissional',
          phone: phone,
          status: 'IMPORTED',
          variationIndex: index % Math.max(1, variations.length)
        });
      }
    });

    setUsers(parsedUsers);
    setLoading(false);
    setCurrentIndex(0);
    setResults([]);
  };

  const togglePause = () => setIsPaused(!isPaused);

  const validateNumbers = async () => {
    if (users.length === 0) {
      alert('Adicione contatos primeiro antes de validar.');
      return;
    }
    setIsValidating(true);
    setValidationDone(false);
    try {
      const phones = users.map(u => u.phone);
      const BATCH = 50;
      const validPhones = new Set<string>();
      const invalidPhones = new Set<string>();

      for (let i = 0; i < phones.length; i += BATCH) {
        const batch = phones.slice(i, i + BATCH);
        const res = await fetch('/api/admin/broadcast/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phones: batch })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro ao validar');
        (data.valid || []).forEach((p: string) => validPhones.add(p));
        (data.invalid || []).forEach((p: string) => invalidPhones.add(p));
      }

      const filtered = users.filter(u => {
        const clean = u.phone.replace(/\D/g, '');
        const withCode = clean.startsWith('55') ? clean : '55' + clean;
        return validPhones.has(withCode) || !invalidPhones.has(withCode);
      });

      const removed = users.length - filtered.length;
      setRemovedCount(removed);
      setUsers(filtered);
      setValidationDone(true);
    } catch (err: any) {
      alert('Erro na validação: ' + err.message);
    } finally {
      setIsValidating(false);
    }
  };

  const startBroadcast = async () => {
    const hasEmpty = variations.some(v => !v.trim());
    if (hasEmpty || variations.length === 0) {
      alert('Certifique-se de que todas as variações de mensagem estejam preenchidas.');
      return;
    }
    if (users.length === 0) {
      alert('Adicione contatos antes de disparar.');
      return;
    }

    const statusRes = await fetch('/api/admin/whatsapp-setup');
    const statusData = await statusRes.json().catch(() => ({ state: 'error' }));
    
    if (statusData.state !== 'open') {
      alert('❌ SESSÃO DO WHATSAPP DESCONECTADA!\n\nConecte seu WhatsApp no menu lateral em "Robô do WhatsApp" antes de iniciar o disparo.');
      return;
    }

    const confirmMsg = `Sessão WhatsApp ativa!\n\n- Destinatários: ${users.length} contatos\n- Variações ativas: ${variations.length} modelos alternados\n- Velocidade: ${speedMode === 'SAFE' ? '🛡️ Ultra-Seguro (35s a 75s)' : speedMode === 'NORMAL' ? 'Equilibrado (20s a 45s)' : 'Rápido (10s a 25s)'}\n\nDeseja iniciar o disparo? Mantenha esta aba aberta.`;
    if (!confirm(confirmMsg)) return;

    setIsSending(true);
    setIsPaused(false);
  };

  // Loop de disparo do robô
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const processNext = async () => {
      if (!isSending || isPaused) return;
      if (currentIndex >= users.length) {
        setIsSending(false);
        alert('🎉 Disparo finalizado com sucesso!');
        return;
      }

      const user = users[currentIndex];
      const finalMessage = formatUserMessage(user, currentIndex);

      try {
        const res = await fetch('/api/admin/broadcast/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: user.phone,
            message: finalMessage
          })
        });

        const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));

        if (res.ok && data.success) {
          setResults(prev => [...prev, { id: user.id, status: 'success' }]);
          setConsecutiveErrors(0);
        } else {
          const errMsg = data.error || 'Erro desconhecido';
          setResults(prev => [...prev, { id: user.id, status: 'error', errorMsg: errMsg }]);

          if (res.status === 503 || data.errorCode === 'SESSION_LOST') {
            setIsPaused(true);
            setIsSending(false);
            alert('🔴 CAMPANHA PAUSADA!\n\nSua sessão do WhatsApp foi desconectada durante o disparo. Reconecte o QR Code no menu Robô do WhatsApp.');
            return;
          }

          setConsecutiveErrors(prev => prev + 1);
        }
      } catch (err: any) {
        setResults(prev => [...prev, { id: user.id, status: 'error', errorMsg: 'Erro de rede: ' + err.message }]);
        setConsecutiveErrors(prev => prev + 1);
      }

      setCurrentIndex(prev => prev + 1);
    };

    if (isSending && !isPaused && currentIndex < users.length) {
      let randomDelayMs = 40000;
      
      if (speedMode === 'FAST') {
         randomDelayMs = Math.floor(Math.random() * (25000 - 10000 + 1)) + 10000; // 10 a 25s
      } else if (speedMode === 'SAFE') {
         randomDelayMs = Math.floor(Math.random() * (75000 - 35000 + 1)) + 35000; // 35 a 75s (Seguro anti-ban)
      } else {
         randomDelayMs = Math.floor(Math.random() * (45000 - 20000 + 1)) + 20000; // 20 a 45s
      }

      const delay = currentIndex === 0 ? 1000 : randomDelayMs; 
      
      timeoutId = setTimeout(() => {
        processNext();
      }, delay);
    }

    return () => clearTimeout(timeoutId);
  }, [isSending, isPaused, currentIndex, users, variations, speedMode]);

  const successfulSends = results.filter(r => r.status === 'success').length;
  const errorSends = results.filter(r => r.status === 'error').length;
  const progressPercent = users.length > 0 ? Math.round((currentIndex / users.length) * 100) : 0;

  const insertVariable = (variable: string) => {
    setVariations(prev => {
      const copy = [...prev];
      copy[activeVariationTab] = (copy[activeVariationTab] || '') + variable;
      return copy;
    });
  };

  const handleApplyTemplate = (tpl: typeof TEMPLATES[0]) => {
    if (isSending) return;
    setVariations(tpl.variations);
    setActiveVariationTab(0);
  };

  const handleAddVariation = () => {
    if (variations.length >= 4) return;
    setVariations(prev => [...prev, '']);
    setActiveVariationTab(variations.length);
  };

  const handleRemoveVariation = (index: number) => {
    if (variations.length <= 1) return;
    const newVars = variations.filter((_, i) => i !== index);
    setVariations(newVars);
    setActiveVariationTab(Math.max(0, index - 1));
  };

  // Preview dinâmico para a tela do celular
  const previewMessage = useMemo(() => {
    const dummyUser: TargetUser = { id: 'preview', name: 'João Carlos', phone: '5511999999999', status: 'ACTIVE' };
    return formatUserMessage(dummyUser, activeVariationTab);
  }, [variations, activeVariationTab]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">Campanhas & Prospecção Anti-Ban</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Variações Inteligentes
            </span>
          </div>
          <p className="text-[hsl(var(--muted-foreground))] mt-1 max-w-3xl">
            Dispare ou envie mensagens 100% individualizadas com múltiplas variações e Spintax para evitar bloqueios no WhatsApp.
          </p>
        </div>

        {/* Alternador de Modo de Operação */}
        <div className="flex items-center gap-2 bg-[hsl(var(--muted))] p-1 rounded-xl border border-[hsl(var(--border))] self-start md:self-auto">
          <button
            onClick={() => setActiveMode('ROBOT')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
              activeMode === 'ROBOT'
                ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            )}
          >
            <Send className="w-3.5 h-3.5" />
            Robô Automático
          </button>
          <button
            onClick={() => setActiveMode('ONE_CLICK')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
              activeMode === 'ONE_CLICK'
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            )}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Modo 1-Clique (WhatsApp Web)
          </button>
        </div>
      </div>

      {/* Alerta Educativo de Proteção Anti-Ban */}
      <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <p className="font-bold text-sm">💡 Regras de Ouro para NÃO tomar bloqueio no WhatsApp:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>NUNCA envie links na 1ª mensagem:</strong> O WhatsApp coloca banner de denúncia para mensagens com links de números desconhecidos.</li>
              <li><strong>Alterne mensagens:</strong> Usar 2 ou 3 modelos diferentes faz com que cada contato receba um formato único.</li>
              <li><strong>Primeira mensagem em formato de pergunta:</strong> Faça o prestador responder primeiro; após a resposta dele, o número fica imune a denúncias.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Templates Recomendados */}
      {!isSending && currentIndex === 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[hsl(var(--foreground))] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[hsl(var(--primary))]" />
            Modelos Estratégicos Recomendados (Carregam Múltiplas Variações)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TEMPLATES.map((tpl) => (
              <div 
                key={tpl.id}
                onClick={() => handleApplyTemplate(tpl)}
                className={cn(
                  "cursor-pointer p-4 rounded-xl border transition-all hover:scale-[1.02] active:scale-95 flex flex-col justify-between",
                  tpl.bgColor, tpl.borderColor
                )}
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn("p-2 rounded-lg bg-white/60 dark:bg-black/30", tpl.color)}>
                      <tpl.icon className="h-5 w-5" />
                    </div>
                    <h3 className={cn("font-bold text-sm", tpl.color)}>{tpl.name}</h3>
                  </div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] line-clamp-2">
                    {tpl.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] font-semibold text-[hsl(var(--foreground))]">
                  <span>{tpl.variations.length} Variações prontas</span>
                  <span className="text-[hsl(var(--primary))]">Usar Modelo →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left / Middle: Configuração */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-[hsl(var(--border))] shadow-sm">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-[hsl(var(--border))]">
              <CardTitle className="text-lg">Configuração da Campanha</CardTitle>
              <CardDescription>
                Cadastre seus contatos e defina os modelos de mensagem que serão alternados.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              
              {/* 1. Base de Contatos */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-[hsl(var(--foreground))]">1. Base de Contatos</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setInputType('csv')}
                      disabled={isSending}
                      className={cn(
                        "text-xs px-3 py-1 rounded-full transition-colors border", 
                        inputType === 'csv' 
                          ? "bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]" 
                          : "bg-transparent text-[hsl(var(--muted-foreground))]"
                      )}
                    >
                      Planilha CSV
                    </button>
                    <button 
                      onClick={() => setInputType('manual')}
                      disabled={isSending}
                      className={cn(
                        "text-xs px-3 py-1 rounded-full transition-colors border", 
                        inputType === 'manual' 
                          ? "bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]" 
                          : "bg-transparent text-[hsl(var(--muted-foreground))]"
                      )}
                    >
                      Digitar Manualmente
                    </button>
                  </div>
                </div>

                {inputType === 'csv' ? (
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative w-full border-2 border-dashed border-[hsl(var(--border))] rounded-lg hover:border-[hsl(var(--primary))] transition-colors bg-[hsl(var(--muted)/0.3)]">
                      <input 
                        type="file" 
                        accept=".csv"
                        onChange={handleFileUpload}
                        disabled={isSending || loading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center py-6 pointer-events-none">
                        <Upload className="h-8 w-8 text-[hsl(var(--muted-foreground))] mb-2" />
                        <p className="text-sm font-medium">Clique ou arraste a planilha .CSV</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Colunas sugeridas: Nome, Telefone</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <textarea 
                      className="w-full min-h-[120px] p-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/50 resize-y"
                      placeholder="Cole os números aqui (um por linha)...&#10;Ex:&#10;11999998888, João Carlos&#10;71988887777, Maria"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      disabled={isSending}
                    />
                    <Button 
                      variant="secondary" 
                      className="w-full" 
                      onClick={handleManualSubmit}
                      disabled={loading || isSending || !manualInput.trim()}
                    >
                      Processar Números Colados
                    </Button>
                  </div>
                )}
                
                {loading && (
                   <div className="flex items-center gap-2 text-sm text-[hsl(var(--primary))]">
                     <Loader2 className="w-4 h-4 animate-spin" /> Processando contatos...
                   </div>
                )}

                {!loading && users.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm pt-2">
                      <div className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-xs">
                        {users.length} contatos prontos
                      </div>
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">
                        Alternando entre as {variations.length} variações.
                      </span>
                    </div>

                    {!isSending && (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={validateNumbers}
                          disabled={isValidating || isSending}
                          className="w-full flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg border-2 border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isValidating ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Verificando números no WhatsApp...</>
                          ) : (
                            <><Smartphone className="w-4 h-4" /> ✅ Validar Números (Remover sem WhatsApp)</>
                          )}
                        </button>

                        {validationDone && (
                          <div className={cn(
                            "text-xs rounded-lg p-3 border font-medium",
                            removedCount > 0
                              ? "bg-amber-50 border-amber-200 text-amber-800"
                              : "bg-emerald-50 border-emerald-200 text-emerald-800"
                          )}>
                            {removedCount > 0
                              ? `⚠️ ${removedCount} número(s) sem WhatsApp foram removidos. Restaram ${users.length} contatos válidos.`
                              : `✅ Todos os ${users.length} números possuem WhatsApp! Pode prosseguir com segurança.`
                            }
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Múltiplas Variações de Mensagem */}
              <div className="space-y-4 pt-4 border-t border-[hsl(var(--border))]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-sm font-semibold text-[hsl(var(--foreground))] flex items-center gap-2">
                      <Shuffle className="w-4 h-4 text-[hsl(var(--primary))]" />
                      2. Variações de Mensagem (Alternância Automática)
                    </label>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                      Cada contato receberá uma versão diferente para o WhatsApp não detectar padrão repetitivo.
                    </p>
                  </div>

                  {/* Botão para adicionar nova variação */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAddVariation}
                    disabled={isSending || variations.length >= 4}
                    className="text-xs h-8"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Nova Variação ({variations.length}/4)
                  </Button>
                </div>

                {/* Abas das Variações */}
                <div className="flex flex-wrap items-center gap-2">
                  {variations.map((_, idx) => (
                    <div key={idx} className="flex items-center">
                      <button
                        onClick={() => setActiveVariationTab(idx)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5",
                          activeVariationTab === idx
                            ? "bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]"
                            : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                        )}
                      >
                        Variação {String.fromCharCode(65 + idx)}
                      </button>
                      {variations.length > 1 && (
                        <button
                          onClick={() => handleRemoveVariation(idx)}
                          disabled={isSending}
                          className="text-red-500 hover:text-red-700 p-1 -ml-1"
                          title="Remover variação"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Tags Rápidas */}
                <div className="flex flex-wrap gap-2 items-center text-xs">
                  <span className="text-[hsl(var(--muted-foreground))] font-medium">Inserir tags:</span>
                  <button 
                    onClick={() => insertVariable('{{nome}}')}
                    disabled={isSending}
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 px-2 py-1 rounded transition-colors font-medium border"
                  >
                    + {{nome}}
                  </button>
                  <button 
                    onClick={() => insertVariable('{{saudacao}}')}
                    disabled={isSending}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 border border-emerald-200 px-2 py-1 rounded transition-colors font-medium"
                    title="Bom dia / Boa tarde / Boa noite dinâmico"
                  >
                    + {{saudacao}} (Hora)
                  </button>
                  <button 
                    onClick={() => insertVariable('{Opção1|Opção2|Opção3}')}
                    disabled={isSending}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300 border border-indigo-200 px-2 py-1 rounded transition-colors font-medium"
                  >
                    + {Spintax|Sinônimos}
                  </button>
                </div>

                {/* Editor da Variação Ativa */}
                <textarea
                  className="w-full min-h-[160px] p-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/50 resize-y"
                  value={variations[activeVariationTab] || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setVariations(prev => {
                      const copy = [...prev];
                      copy[activeVariationTab] = val;
                      return copy;
                    });
                  }}
                  disabled={isSending}
                  placeholder={`Escreva o texto da Variação ${String.fromCharCode(65 + activeVariationTab)} aqui... Ex: {Oi|Olá} {{nome}}, {{saudacao}}! Tudo bem?`}
                />
              </div>

              {/* 3. Cadência de Disparo (Apenas para modo robô) */}
              {activeMode === 'ROBOT' && (
                <div className="space-y-3 pt-4 border-t border-[hsl(var(--border))]">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-[hsl(var(--foreground))] flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      3. Intervalo Humano Entre Mensagens
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button 
                      onClick={() => setSpeedMode('SAFE')}
                      disabled={isSending}
                      className={cn(
                        "flex flex-col items-center p-3 border rounded-lg transition-colors text-sm",
                        speedMode === 'SAFE' 
                          ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 font-semibold" 
                          : "bg-transparent text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
                      )}
                    >
                      <span className="flex items-center gap-1">🛡️ Ultra-Seguro (Recomendado)</span>
                      <span className="text-xs font-normal opacity-80 mt-1">Pausa de 35s a 75s</span>
                    </button>
                    <button 
                      onClick={() => setSpeedMode('NORMAL')}
                      disabled={isSending}
                      className={cn(
                        "flex flex-col items-center p-3 border rounded-lg transition-colors text-sm",
                        speedMode === 'NORMAL' 
                          ? "border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-950/30 dark:text-blue-300 font-semibold" 
                          : "bg-transparent text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
                      )}
                    >
                      <span>Equilibrado</span>
                      <span className="text-xs font-normal opacity-80 mt-1">Pausa de 20s a 45s</span>
                    </button>
                    <button 
                      onClick={() => setSpeedMode('FAST')}
                      disabled={isSending}
                      className={cn(
                        "flex flex-col items-center p-3 border rounded-lg transition-colors text-sm",
                        speedMode === 'FAST' 
                          ? "border-red-500 bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300 font-semibold" 
                          : "bg-transparent text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
                      )}
                    >
                      <span>Rápido (Risco de Ban)</span>
                      <span className="text-xs font-normal opacity-80 mt-1">Pausa de 10s a 25s</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Botão de Iniciar Disparo Automático */}
              {activeMode === 'ROBOT' && !isSending && currentIndex === 0 && (
                <div className="pt-2">
                  <Button 
                    className="w-full h-12 text-base font-semibold shadow-md bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)]" 
                    size="lg" 
                    onClick={startBroadcast} 
                    disabled={users.length === 0 || variations.some(v => !v.trim())}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Iniciar Disparo com {variations.length} Variações ({users.length} números)
                  </Button>
                </div>
              )}

              {/* Modo 1-Clique Manual (Zero Banimento) */}
              {activeMode === 'ONE_CLICK' && (
                <div className="pt-4 border-t border-[hsl(var(--border))] space-y-4">
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 rounded-xl p-4">
                    <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5" />
                      Modo 1-Clique: Zero Risco de Banimento
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                      Neste modo, você envia as mensagens diretamente pelo seu aplicativo oficial do WhatsApp Web com um clique. O texto já vai preenchido e formatado individualmente para cada prestador!
                    </p>
                  </div>

                  {users.length === 0 ? (
                    <p className="text-xs text-[hsl(var(--muted-foreground))] text-center py-4">
                      Carregue uma planilha ou cole números acima para listar os contatos aqui.
                    </p>
                  ) : (
                    <div className="max-h-96 overflow-y-auto border rounded-xl divide-y">
                      {users.map((u, idx) => {
                        const msgForUser = formatUserMessage(u, idx);
                        const isSent = manualSentMap[u.id];
                        const cleanPhone = u.phone.replace(/\D/g, '');
                        const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msgForUser)}`;

                        return (
                          <div key={u.id} className="p-3 flex items-center justify-between gap-4 hover:bg-[hsl(var(--muted)/0.4)] transition-colors">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-[hsl(var(--foreground))] truncate">{u.name}</span>
                                <span className="text-xs text-[hsl(var(--muted-foreground))]">({u.phone})</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 font-mono">
                                  Var. {String.fromCharCode(65 + (idx % variations.length))}
                                </span>
                              </div>
                              <p className="text-xs text-[hsl(var(--muted-foreground))] truncate mt-1">
                                {msgForUser.replace(/\n/g, ' ')}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => {
                                  setManualSentMap(prev => ({ ...prev, [u.id]: true }));
                                }}
                                className={cn(
                                  "px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all",
                                  isSent 
                                    ? "bg-slate-100 text-slate-600 border" 
                                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                                )}
                              >
                                {isSent ? (
                                  <><Check className="w-3.5 h-3.5 text-emerald-600" /> Enviado</>
                                ) : (
                                  <><ExternalLink className="w-3.5 h-3.5" /> Chamar no WhatsApp</>
                                )}
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

            </CardContent>
          </Card>
        </div>

        {/* Right Column: Preview & Status */}
        <div className="space-y-6">
          
          {(isSending || currentIndex > 0) ? (
            <Card className="border-[hsl(var(--border))] shadow-md overflow-hidden">
              <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Painel da Campanha</h3>
                  <p className="text-slate-400 text-xs">Alternando {variations.length} variações</p>
                </div>
                {isSending && !isPaused && (
                  <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    Enviando
                  </div>
                )}
                {isPaused && (
                  <div className="flex items-center gap-2 bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-semibold">
                    <Pause className="h-3 w-3" />
                    Pausado
                  </div>
                )}
              </div>
              
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm font-semibold mb-2">
                      <span className="text-[hsl(var(--foreground))]">Progresso</span>
                      <span className="text-[hsl(var(--primary))]">{currentIndex} de {users.length} ({progressPercent}%)</span>
                    </div>
                    <div className="w-full bg-[hsl(var(--muted))] rounded-full h-3 shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-[hsl(var(--primary))] to-purple-500 h-3 rounded-full transition-all duration-500 shadow-sm" 
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                      <div className="text-3xl font-black text-emerald-700">{successfulSends}</div>
                      <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider mt-1">Entregues</div>
                    </div>
                    <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 text-center">
                      <UserX className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <div className="text-3xl font-black text-red-700">{errorSends}</div>
                      <div className="text-xs text-red-600 font-bold uppercase tracking-wider mt-1">Falharam</div>
                    </div>
                  </div>

                  {errorSends > 0 && (
                    <div className="bg-red-50/50 border border-red-100 rounded-lg p-3 max-h-40 overflow-y-auto">
                      <h4 className="text-xs font-bold text-red-800 mb-2 uppercase">Detalhes das Falhas:</h4>
                      <ul className="text-xs space-y-1">
                        {results.filter(r => r.status === 'error').map((res, i) => {
                          const errUser = users.find(u => u.id === res.id);
                          return (
                            <li key={i} className="text-red-700">
                              <span className="font-semibold">{errUser?.phone || 'Desconhecido'}:</span> {res.errorMsg}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {isSending && (
                    <Button 
                      className="w-full h-12 text-base font-semibold shadow-sm" 
                      variant={isPaused ? "default" : "secondary"} 
                      onClick={togglePause}
                    >
                      {isPaused ? (
                        <><Play className="w-5 h-5 mr-2" /> Retomar Campanha</>
                      ) : (
                        <><Pause className="w-5 h-5 mr-2" /> Pausar Campanha</>
                      )}
                    </Button>
                  )}

                  {!isSending && currentIndex === users.length && (
                    <Button 
                      className="w-full h-12 text-base font-semibold" 
                      variant="outline" 
                      onClick={() => {
                        setCurrentIndex(0);
                        setResults([]);
                        setUsers([]);
                      }}
                    >
                      Finalizar & Nova Campanha
                    </Button>
                  )}
                  
                  {isSending && !isPaused && (
                    <div className="bg-indigo-50/80 text-indigo-800 p-3 rounded-lg text-xs border border-indigo-200 flex gap-3 items-start mt-4">
                      <AlertTriangle className="w-5 h-5 shrink-0 text-indigo-500" />
                      <p>
                        A tecnologia Anti-Ban está ativa no modo <strong>{speedMode}</strong>, alternando entre <strong>{variations.length} variações</strong> de mensagens. Mantenha esta aba aberta.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="sticky top-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                  <h3 className="font-semibold text-[hsl(var(--foreground))] text-sm">
                    Preview: Variação {String.fromCharCode(65 + activeVariationTab)}
                  </h3>
                </div>
                <span className="text-[10px] text-[hsl(var(--muted-foreground))]">Exemplo com dados simulados</span>
              </div>
              
              <div className="w-full aspect-[9/19] max-w-[300px] mx-auto bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl relative border-[6px] border-slate-800">
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-3xl w-32 mx-auto z-20"></div>
                
                <div className="w-full h-full bg-[#E5DDD5] rounded-[2rem] overflow-hidden flex flex-col relative z-10">
                  <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3 shrink-0 pt-6">
                    <div className="w-8 h-8 rounded-full bg-slate-300 flex-shrink-0 bg-center bg-cover" style={{ backgroundImage: 'url(https://github.com/shadcn.png)' }}></div>
                    <div>
                      <p className="text-sm font-semibold">Prestador / Cliente</p>
                      <p className="text-[10px] text-white/70">Online</p>
                    </div>
                  </div>

                  <div className="flex-1 p-3 overflow-y-auto space-y-3" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'contain' }}>
                    <div className="bg-[#DCF8C6] p-2.5 rounded-lg rounded-tr-none text-sm text-[#303030] shadow-sm ml-auto max-w-[90%] break-words whitespace-pre-wrap leading-relaxed relative">
                      {previewMessage || 'Escreva uma mensagem...'}
                      <span className="text-[9px] text-black/40 float-right mt-2 ml-2">12:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
