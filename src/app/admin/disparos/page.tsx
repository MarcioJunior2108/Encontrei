'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Play, Pause, AlertTriangle, CheckCircle2, UserX, MessageSquareText, Sparkles, Smartphone, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import Papa from 'papaparse';

interface TargetUser {
  id: string;
  name: string;
  phone: string;
  status: string;
}

const TEMPLATES = [
  {
    id: 'isca-promocional',
    name: 'Isca: Spintax Seguro',
    icon: Sparkles,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    message: '{Olá|Oi|Opa|Fala} {{nome}}, {vimos que|notei que} você atua na sua região!\n\nTemos clientes buscando por profissionais como você.\n{Acesse|Entre em} https://acheiyou.app'
  },
  {
    id: 'boas-vindas',
    name: 'Boas Vindas Padrão',
    icon: MessageSquareText,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    message: '{Olá|Saudações|Oi} {{nome}}, seu perfil foi adicionado na AcheiYou!\n\nReivindique agora para receber orçamentos direto no WhatsApp.\nhttps://acheiyou.app'
  }
];

export default function BroadcastCRMPage() {
  const [speedMode, setSpeedMode] = useState('NORMAL');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<TargetUser[]>([]);
  const [message, setMessage] = useState('');
  
  // Progress states
  const [isSending, setIsSending] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<{ id: string; status: 'success' | 'error'; errorMsg?: string }[]>([]);

  // Parser de Spintax: {Oi|Olá} -> Sorteia um
  const parseSpintax = (text: string) => {
    let parsed = text;
    const spintaxRegex = /\{([^{}]+)\}/g;
    let match;
    while ((match = spintaxRegex.exec(parsed)) !== null) {
      const options = match[1].split('|');
      const choice = options[Math.floor(Math.random() * options.length)];
      parsed = parsed.replace(match[0], choice);
      spintaxRegex.lastIndex = 0; // Reinicia a regex
    }
    return parsed;
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

          // Detecta chaves flexivelmente
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
                status: 'IMPORTED'
              });
            }
          }
        });

        setUsers(parsedUsers);
        setLoading(false);
        setCurrentIndex(0);
        setResults([]);
        
        // Reset file input so you can upload same file again if needed
        e.target.value = '';
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao ler a planilha. Verifique o formato CSV.');
        setLoading(false);
      }
    });
  };

  const togglePause = () => setIsPaused(!isPaused);

  const startBroadcast = async () => {
    if (!message.trim()) {
      alert('A mensagem não pode estar vazia.');
      return;
    }
    if (users.length === 0) {
      alert('Faça o upload de uma planilha com contatos antes de disparar.');
      return;
    }

    const confirmMsg = `Tem certeza que deseja iniciar o disparo para ${users.length} números?\n\n- Velocidade: ${speedMode === 'FAST' ? 'Rápida' : speedMode === 'SAFE' ? 'Segura (Anti-ban)' : 'Normal'}\n- Spintax Ativado (A mensagem será variada automaticamente)\n\nDeixe esta aba ABERTA durante todo o processo.`;
    if (!confirm(confirmMsg)) return;

    setIsSending(true);
    setIsPaused(false);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const processNext = async () => {
      if (!isSending || isPaused) return;
      if (currentIndex >= users.length) {
        setIsSending(false);
        alert('Disparo finalizado com sucesso!');
        return;
      }

      const user = users[currentIndex];
      
      // Personaliza Nome
      const personalizedMessage = message.replace(/\{\{nome\}\}/gi, user.name ? user.name.split(' ')[0] : 'Profissional');
      
      // Aplica Spintax
      const finalMessage = parseSpintax(personalizedMessage);

      try {
        const res = await fetch('/api/admin/broadcast/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: user.phone,
            message: finalMessage
          })
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setResults(prev => [...prev, { id: user.id, status: 'success' }]);
        } else {
          setResults(prev => [...prev, { id: user.id, status: 'error', errorMsg: data.error || 'Erro desconhecido' }]);
        }
      } catch (err: any) {
        setResults(prev => [...prev, { id: user.id, status: 'error', errorMsg: err.message }]);
      }

      setCurrentIndex(prev => prev + 1);
    };

    if (isSending && !isPaused && currentIndex < users.length) {
      let randomDelayMs = 10000;
      
      if (speedMode === 'FAST') {
         randomDelayMs = Math.floor(Math.random() * (8000 - 3000 + 1)) + 3000; // 3 a 8s
      } else if (speedMode === 'SAFE') {
         randomDelayMs = Math.floor(Math.random() * (30000 - 15000 + 1)) + 15000; // 15 a 30s
      } else {
         randomDelayMs = Math.floor(Math.random() * (15000 - 8000 + 1)) + 8000; // 8 a 15s
      }

      const delay = currentIndex === 0 ? 1000 : randomDelayMs; 
      
      timeoutId = setTimeout(() => {
        processNext();
      }, delay);
    }

    return () => clearTimeout(timeoutId);
  }, [isSending, isPaused, currentIndex, users, message, speedMode]);

  const successfulSends = results.filter(r => r.status === 'success').length;
  const errorSends = results.filter(r => r.status === 'error').length;
  const progressPercent = users.length > 0 ? Math.round((currentIndex / users.length) * 100) : 0;

  const insertVariable = (variable: string) => {
    setMessage(prev => prev + variable);
  };

  const handleTemplateClick = (template: typeof TEMPLATES[0]) => {
    if (isSending) return;
    setMessage(template.message);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">Campanhas de Marketing (Planilha)</h1>
        <p className="text-[hsl(var(--muted-foreground))] mt-1 max-w-3xl">
          Faça upload de suas planilhas de contatos e dispare mensagens com ferramentas antibanimento (Spintax e Delay Variável).
        </p>
      </div>

      {!isSending && currentIndex === 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">Templates Inteligentes (Com Spintax)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map((tpl) => (
              <div 
                key={tpl.id}
                onClick={() => handleTemplateClick(tpl)}
                className={cn(
                  "cursor-pointer p-4 rounded-xl border transition-all hover:scale-[1.02] active:scale-95",
                  tpl.bgColor, tpl.borderColor
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn("p-2 rounded-lg bg-white/50", tpl.color)}>
                    <tpl.icon className="h-5 w-5" />
                  </div>
                  <h3 className={cn("font-bold text-sm", tpl.color)}>{tpl.name}</h3>
                </div>
                <p className="text-xs text-[hsl(var(--foreground))/70] line-clamp-2">
                  {tpl.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Edição e Público */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-[hsl(var(--border))] shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-[hsl(var(--border))]">
              <CardTitle className="text-lg">Configuração da Campanha</CardTitle>
              <CardDescription>Defina sua planilha de números e a mensagem.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              
              <div className="space-y-3">
                <label className="text-sm font-semibold text-[hsl(var(--foreground))]">1. Base de Contatos (CSV)</label>
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
                {loading && (
                   <div className="flex items-center gap-2 text-sm text-[hsl(var(--primary))]">
                     <Loader2 className="w-4 h-4 animate-spin" /> Lendo planilha...
                   </div>
                )}
                {!loading && users.length > 0 && (
                  <div className="flex items-center gap-2 text-sm pt-2">
                    <div className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                      {users.length} contatos extraídos
                    </div>
                    <span className="text-[hsl(var(--muted-foreground))]">prontos para disparo.</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-[hsl(var(--border))]">
                <div className="flex justify-between items-end mb-2">
                  <label className="text-sm font-semibold text-[hsl(var(--foreground))]">2. Mensagem Matadora (Com Spintax)</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => insertVariable('{{nome}}')}
                      disabled={isSending}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition-colors font-medium border"
                    >
                      + Inserir Nome
                    </button>
                    <button 
                      onClick={() => insertVariable('{Opção1|Opção2}')}
                      disabled={isSending}
                      className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-1 rounded transition-colors font-medium"
                    >
                      + Spintax
                    </button>
                  </div>
                </div>
                <textarea
                  className="w-full min-h-[180px] p-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/50 resize-y"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSending}
                  placeholder="Ex: {Oi|Olá} {{nome}}, tudo bem? Escreva sua copy aqui..."
                />
              </div>

              <div className="space-y-3 pt-4 border-t border-[hsl(var(--border))]">
                <label className="text-sm font-semibold text-[hsl(var(--foreground))]">3. Cadência de Disparo (Anti-Ban)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button 
                    onClick={() => setSpeedMode('FAST')}
                    disabled={isSending}
                    className={cn(
                      "flex flex-col items-center p-3 border rounded-lg transition-colors text-sm",
                      speedMode === 'FAST' ? "border-red-500 bg-red-50 text-red-700 font-semibold" : "bg-transparent text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    <span>Rápido (Risco Alto)</span>
                    <span className="text-xs font-normal opacity-80 mt-1">Pausa de 3s a 8s</span>
                  </button>
                  <button 
                    onClick={() => setSpeedMode('NORMAL')}
                    disabled={isSending}
                    className={cn(
                      "flex flex-col items-center p-3 border rounded-lg transition-colors text-sm",
                      speedMode === 'NORMAL' ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold" : "bg-transparent text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    <span>Normal (Recomendado)</span>
                    <span className="text-xs font-normal opacity-80 mt-1">Pausa de 8s a 15s</span>
                  </button>
                  <button 
                    onClick={() => setSpeedMode('SAFE')}
                    disabled={isSending}
                    className={cn(
                      "flex flex-col items-center p-3 border rounded-lg transition-colors text-sm",
                      speedMode === 'SAFE' ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold" : "bg-transparent text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    <span>Seguro (Anti-Ban)</span>
                    <span className="text-xs font-normal opacity-80 mt-1">Pausa de 15s a 30s</span>
                  </button>
                </div>
              </div>

              {!isSending && currentIndex === 0 && (
                <div className="pt-2">
                  <Button 
                    className="w-full h-12 text-base font-semibold shadow-md bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)]" 
                    size="lg" 
                    onClick={startBroadcast} 
                    disabled={users.length === 0 || !message.trim()}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Iniciar Disparo na Planilha ({users.length} números)
                  </Button>
                </div>
              )}

            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview & Status */}
        <div className="space-y-6">
          
          {(isSending || currentIndex > 0) ? (
            <Card className="border-[hsl(var(--border))] shadow-md overflow-hidden">
              <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Painel da Campanha</h3>
                  <p className="text-slate-400 text-xs">Monitoramento em tempo real</p>
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
                      <p>A tecnologia Anti-Ban está ativa no modo <strong>{speedMode}</strong>. O sistema intercala mensagens com Spintax para evitar bloqueios. <strong>Mantenha esta aba aberta.</strong></p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="sticky top-6">
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                <h3 className="font-semibold text-[hsl(var(--foreground))] text-sm">Exemplo (Sorteio Aleatório)</h3>
              </div>
              
              <div className="w-full aspect-[9/19] max-w-[300px] mx-auto bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl relative border-[6px] border-slate-800">
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-3xl w-32 mx-auto z-20"></div>
                
                <div className="w-full h-full bg-[#E5DDD5] rounded-[2rem] overflow-hidden flex flex-col relative z-10">
                  <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3 shrink-0 pt-6">
                    <div className="w-8 h-8 rounded-full bg-slate-300 flex-shrink-0 bg-center bg-cover" style={{ backgroundImage: 'url(https://github.com/shadcn.png)' }}></div>
                    <div>
                      <p className="text-sm font-semibold">Cliente</p>
                      <p className="text-[10px] text-white/70">Online</p>
                    </div>
                  </div>

                  <div className="flex-1 p-3 overflow-y-auto space-y-3" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'contain' }}>
                    <div className="bg-[#DCF8C6] p-2.5 rounded-lg rounded-tr-none text-sm text-[#303030] shadow-sm ml-auto max-w-[85%] break-words whitespace-pre-wrap leading-relaxed relative">
                      {message ? parseSpintax(message.replace(/\{\{nome\}\}/gi, 'João')) : 'Escreva uma mensagem...'}
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
