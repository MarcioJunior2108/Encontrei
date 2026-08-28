'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Play, Pause, AlertTriangle, CheckCircle2, UserX } from 'lucide-react';

interface TargetUser {
  id: string;
  name: string;
  phone: string;
  status: string;
}

export default function BroadcastPage() {
  const [filter, setFilter] = useState('UNCLAIMED');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<TargetUser[]>([]);
  const [message, setMessage] = useState('Olá {{nome}}, vimos que você é um excelente profissional! Queremos te convidar para o AcheiYou...');
  
  // Progress states
  const [isSending, setIsSending] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<{ id: string; status: 'success' | 'error'; errorMsg?: string }[]>([]);

  // Function to fetch targeted users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/broadcast/users?filter=${filter}`);
      if (!res.ok) throw new Error('Falha ao buscar usuários');
      const data = await res.json();
      setUsers(data.users || []);
      // Reset progress
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
    fetchUsers();
  }, [filter]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const startBroadcast = async () => {
    if (!message.trim()) {
      alert('A mensagem não pode estar vazia.');
      return;
    }
    if (users.length === 0) {
      alert('Nenhum usuário para disparar.');
      return;
    }

    const confirmMsg = `Tem certeza que deseja enviar esta mensagem para ${users.length} profissionais?\n\nDeixe esta janela ABERTA até o final.`;
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
        alert('Disparo finalizado!');
        return;
      }

      const user = users[currentIndex];
      
      // Parse message variables
      const personalizedMessage = message.replace(/\{\{nome\}\}/gi, user.name || 'Profissional');

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

      // Next user - increment index
      setCurrentIndex(prev => prev + 1);
    };

    if (isSending && !isPaused && currentIndex < users.length) {
      // Add random delay between 8 to 15 seconds to avoid WhatsApp Ban
      const randomDelayMs = Math.floor(Math.random() * (15000 - 8000 + 1)) + 8000;
      
      // se for o primeiro não espera tanto
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Disparos em Massa (WhatsApp)</h1>
        <p className="text-[hsl(var(--muted-foreground))] mt-1">
          Envie mensagens automáticas para seus profissionais. O sistema respeita pausas entre mensagens para evitar bloqueio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuração do Disparo</CardTitle>
              <CardDescription>Escreva a mensagem e escolha o público alvo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Público Alvo (Destinatários)</label>
                <div className="flex gap-4">
                  <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)} 
                    disabled={isSending}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-sm ring-offset-[hsl(var(--background))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="UNCLAIMED" className="text-black">Somente Leads/Importados (Sem dono - UNCLAIMED)</option>
                    <option value="ACTIVE" className="text-black">Profissionais Ativos na Plataforma (ACTIVE)</option>
                    <option value="ALL_PROFESSIONALS" className="text-black">Todos os Profissionais</option>
                  </select>
                  <Button variant="outline" onClick={fetchUsers} disabled={loading || isSending}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Atualizar'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Serão listados apenas usuários com números de telefone válidos. 
                  <strong className="text-black ml-1">Total pronto: {users.length}</strong>
                </p>
              </div>

              <div className="space-y-2 mt-6">
                <label className="text-sm font-medium flex justify-between">
                  <span>Mensagem a ser enviada</span>
                  <span className="text-xs text-muted-foreground">Use {'{{nome}}'} para personalizar</span>
                </label>
                <textarea
                  className="w-full min-h-[150px] p-3 rounded-md border border-[hsl(var(--input))] bg-transparent text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSending}
                  placeholder="Olá {{nome}}, seja bem vindo!"
                />
              </div>

              {!isSending && currentIndex === 0 && (
                <Button className="w-full mt-4" size="lg" onClick={startBroadcast} disabled={users.length === 0}>
                  <Send className="w-4 h-4 mr-2" />
                  Iniciar Disparo ({users.length} contatos)
                </Button>
              )}

              {isSending && (
                 <div className="flex gap-4 mt-4">
                   <Button 
                    className="flex-1" 
                    variant={isPaused ? "default" : "secondary"} 
                    onClick={togglePause}
                  >
                     {isPaused ? (
                       <><Play className="w-4 h-4 mr-2" /> Retomar Disparo</>
                     ) : (
                       <><Pause className="w-4 h-4 mr-2" /> Pausar Disparo</>
                     )}
                   </Button>
                 </div>
              )}

            </CardContent>
          </Card>
        </div>

        {/* Right Column - Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Status do Envio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span>Progresso</span>
                  <span>{currentIndex} / {users.length} ({progressPercent}%)</span>
                </div>
                <div className="w-full bg-[hsl(var(--muted))] rounded-full h-2.5">
                  <div 
                    className="bg-[hsl(var(--primary))] h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-emerald-700">{successfulSends}</div>
                    <div className="text-xs text-emerald-600 font-medium">Enviados</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                    <UserX className="w-6 h-6 text-red-500 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-red-700">{errorSends}</div>
                    <div className="text-xs text-red-600 font-medium">Falharam</div>
                  </div>
                </div>

                {isSending && !isPaused && (
                  <div className="bg-orange-50 text-orange-800 p-3 rounded-md text-xs border border-orange-200 flex gap-2 items-start mt-4">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>O sistema está adicionando pausas de 8 a 15 segundos entre as mensagens para evitar bloqueio do WhatsApp. Mantenha esta página aberta!</p>
                  </div>
                )}
                
                {isPaused && (
                  <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-xs border border-blue-200 text-center font-medium mt-4">
                    Disparo Pausado.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
