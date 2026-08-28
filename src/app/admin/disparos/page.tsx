'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Play, Pause, AlertTriangle, CheckCircle2, UserX, MessageSquareText, Sparkles, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TargetUser {
  id: string;
  name: string;
  phone: string;
  status: string;
}

const TEMPLATES = [
  {
    id: 'leads-aguardando',
    name: 'Isca: Leads Aguardando',
    icon: Sparkles,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    target: 'UNCLAIMED',
    message: 'Olá {{nome}}, vimos que você atua na sua região!\n\nTemos clientes buscando por profissionais como você no AcheiYou. Acesse a plataforma gratuitamente e não perca esses contatos:\n\n👉 https://acheiyou.app'
  },
  {
    id: 'boas-vindas',
    name: 'Boas Vindas (Importados)',
    icon: MessageSquareText,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    target: 'UNCLAIMED',
    message: 'Olá {{nome}}, seu perfil profissional foi adicionado na AcheiYou, a maior plataforma de serviços da região!\n\nReivindique seu perfil agora para receber orçamentos de clientes direto no seu celular.\n\nAcesse: https://acheiyou.app'
  }
];

export default function BroadcastCRMPage() {
  const [filter, setFilter] = useState('UNCLAIMED');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<TargetUser[]>([]);
  const [message, setMessage] = useState('');
  
  // Progress states
  const [isSending, setIsSending] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<{ id: string; status: 'success' | 'error'; errorMsg?: string }[]>([]);

  const fetchUsers = async (targetFilter = filter) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/broadcast/users?filter=${targetFilter}`);
      if (!res.ok) throw new Error('Falha ao buscar usuários');
      const data = await res.json();
      setUsers(data.users || []);
      setCurrentIndex(0);
      setResults([]);
    } catch (err) {
      console.error(err);
      alert('Erro ao buscar lista de contatos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(filter);
  }, [filter]);

  const togglePause = () => setIsPaused(!isPaused);

  const startBroadcast = async () => {
    if (!message.trim()) {
      alert('A mensagem não pode estar vazia.');
      return;
    }
    if (users.length === 0) {
      alert('Nenhum usuário para disparar.');
      return;
    }

    const confirmMsg = `Campanha de Marketing\n\nTem certeza que deseja enviar esta mensagem para ${users.length} profissionais?\n\nDeixe esta janela ABERTA até o final.`;
    if (!confirm(confirmMsg)) return;

    setIsSending(true);
    setIsPaused(false);
  };

  // The actual sending loop effect
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
      
      const personalizedMessage = message.replace(/\{\{nome\}\}/gi, user.name ? user.name.split(' ')[0] : 'Profissional');

      try {
        const res = await fetch('/api/admin/broadcast/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: user.phone,
            message: personalizedMessage
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
      const randomDelayMs = Math.floor(Math.random() * (15000 - 8000 + 1)) + 8000;
      const delay = currentIndex === 0 ? 1000 : randomDelayMs; 
      
      timeoutId = setTimeout(() => {
        processNext();
      }, delay);
    }

    return () => clearTimeout(timeoutId);
  }, [isSending, isPaused, currentIndex, users, message]);


  const successfulSends = results.filter(r => r.status === 'success').length;
  const errorSends = results.filter(r => r.status === 'error').length;
  const progressPercent = users.length > 0 ? Math.round((currentIndex / users.length) * 100) : 0;

  // Insert Variable helper
  const insertVariable = (variable: string) => {
    setMessage(prev => prev + variable);
  };

  const handleTemplateClick = (template: typeof TEMPLATES[0]) => {
    if (isSending) return;
    setMessage(template.message);
    setFilter(template.target);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">Campanhas de Marketing (CRM)</h1>
        <p className="text-[hsl(var(--muted-foreground))] mt-1 max-w-3xl">
          Atraia profissionais importados para dentro da plataforma. Dispare mensagens persuasivas em massa pelo WhatsApp de forma segura e controlada.
        </p>
      </div>

      {!isSending && currentIndex === 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">Templates Rápidos de Conversão</h2>
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
              <CardDescription>Defina quem vai receber e o que será enviado.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              
              <div className="space-y-3">
                <label className="text-sm font-semibold text-[hsl(var(--foreground))]">1. Público Alvo</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)} 
                    disabled={isSending}
                    className="flex h-11 w-full items-center justify-between rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
                  >
                    <option value="UNCLAIMED">Importados do Google (Sem Dono)</option>
                    <option value="ACTIVE">Profissionais Cadastrados (Ativos)</option>
                    <option value="ALL_PROFESSIONALS">Todos os Profissionais</option>
                  </select>
                  <Button variant="outline" className="h-11 shadow-sm shrink-0" onClick={() => fetchUsers(filter)} disabled={loading || isSending}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {loading ? 'Calculando...' : 'Atualizar Público'}
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="px-2.5 py-0.5 rounded-full bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] font-semibold">
                    {users.length} contatos
                  </div>
                  <span className="text-[hsl(var(--muted-foreground))]">prontos para receber o disparo.</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-[hsl(var(--border))]">
                <div className="flex justify-between items-end mb-2">
                  <label className="text-sm font-semibold text-[hsl(var(--foreground))]">2. Mensagem de Conversão</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => insertVariable('{{nome}}')}
                      disabled={isSending}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition-colors"
                    >
                      + Inserir Nome
                    </button>
                  </div>
                </div>
                <textarea
                  className="w-full min-h-[180px] p-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/50 resize-y"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSending}
                  placeholder="Escreva sua copy matadora aqui..."
                />
              </div>

              {!isSending && currentIndex === 0 && (
                <Button 
                  className="w-full h-12 text-base font-semibold shadow-md bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)]" 
                  size="lg" 
                  onClick={startBroadcast} 
                  disabled={users.length === 0 || !message.trim()}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Iniciar Disparo para {users.length} Profissionais
                </Button>
              )}

            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview & Status */}
        <div className="space-y-6">
          
          {/* Se estiver enviando, mostra o Dashboard de Status */}
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
                  {/* Progress Bar */}
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

                  {/* Metrics */}
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

                  {/* Actions */}
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
                      }}
                    >
                      Nova Campanha
                    </Button>
                  )}
                  
                  {isSending && !isPaused && (
                    <div className="bg-orange-50/80 text-orange-800 p-3 rounded-lg text-xs border border-orange-200 flex gap-3 items-start mt-4">
                      <AlertTriangle className="w-5 h-5 shrink-0 text-orange-500" />
                      <p>O sistema injeta pausas aleatórias (8 a 15 seg) entre envios para evitar banimentos no WhatsApp. <strong>Não feche esta aba.</strong></p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Se NÃO estiver enviando, mostra o Preview do Celular */
            <div className="sticky top-6">
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                <h3 className="font-semibold text-[hsl(var(--foreground))] text-sm">Preview do Cliente</h3>
              </div>
              
              {/* Celular Mockup */}
              <div className="w-full aspect-[9/19] max-w-[300px] mx-auto bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl relative border-[6px] border-slate-800">
                {/* Notch */}
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-3xl w-32 mx-auto z-20"></div>
                
                {/* Tela */}
                <div className="w-full h-full bg-[#E5DDD5] rounded-[2rem] overflow-hidden flex flex-col relative z-10">
                  {/* WA Header */}
                  <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3 shrink-0 pt-6">
                    <div className="w-8 h-8 rounded-full bg-slate-300 flex-shrink-0 bg-center bg-cover" style={{ backgroundImage: 'url(https://github.com/shadcn.png)' }}></div>
                    <div>
                      <p className="text-sm font-semibold">AcheiYou</p>
                      <p className="text-[10px] text-white/70">Online</p>
                    </div>
                  </div>

                  {/* WA Body */}
                  <div className="flex-1 p-3 overflow-y-auto space-y-3" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'contain' }}>
                    <div className="bg-[#DCF8C6] p-2.5 rounded-lg rounded-tr-none text-sm text-[#303030] shadow-sm ml-auto max-w-[85%] break-words whitespace-pre-wrap leading-relaxed relative">
                      {message ? message.replace(/\{\{nome\}\}/gi, 'João (Exemplo)') : 'Escreva uma mensagem...'}
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
