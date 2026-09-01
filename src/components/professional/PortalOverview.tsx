'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Assuming we have or will mock a Tabs component
import { MOCK_PROFESSIONALS } from '@/mock/data';
import { MetricsView } from './MetricsView';
import { AgendaView } from './AgendaView';
import { Button } from '@/components/ui/button';
import { 
  Bell, Wallet, TrendingUp, Star, Clock, CheckCircle2, 
  Settings, User, MapPin, Calendar, FileText, ChevronRight, MessageSquare, Lock, AlertCircle, Phone, LockKeyhole, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { updateRequestStatus } from '@/app/actions/requests';
import { verifyPaymentStatus } from '@/app/actions/payments';
import { unlockLeadFree } from '@/app/actions/freeLead';

import { ProfileSettings } from './ProfileSettings';
import { PlanosView } from './PlanosView';
import { WalletView } from './WalletView';
import { Badge } from '@/components/ui/badge';
import { MercadoPagoModal } from '@/components/checkout/MercadoPagoModal';
import { DashboardRequests } from '@/components/dashboard/DashboardRequests';

interface PortalOverviewProps {
  profile: any;
  professional: any;
  clientRequests?: any[];
}

export function PortalOverview({ profile, professional, clientRequests = [] }: PortalOverviewProps) {
  const [activeTab, setActiveTab] = useState('geral');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{type: string, amount: number, description: string, requestId?: string} | null>(null);
  const [isRejecting, setIsRejecting] = useState<string | null>(null);
  const [isFreeUnlocking, setIsFreeUnlocking] = useState<string | null>(null);

  const handleCheckout = async (type: string, amount: number, description: string, requestId?: string) => {
    setCheckoutData({ type, amount, description, requestId });
    setIsCheckoutModalOpen(true);
  };

  const handleCheckoutSuccess = async (paymentId: string) => {
    // Para funcionar no localhost onde o Webhook do Mercado Pago não chega,
    // nós fazemos uma verificação manual do status da transação.
    if (paymentId) {
      const result = await verifyPaymentStatus(paymentId);
      if (result.success && result.status === 'approved') {
        alert('Pagamento aprovado com sucesso!');
      } else if (result.success && result.status === 'pending') {
        alert('Pagamento ainda está pendente. Assim que for compensado, o lead será liberado automaticamente.');
      }
    }
    
    setIsCheckoutModalOpen(false);
    window.location.reload();
  };

  const handleReject = async (requestId: string) => {
    try {
      setIsRejecting(requestId);
      const res = await updateRequestStatus(requestId, 'REJECTED');
      if (res.success) {
        window.location.reload();
      } else {
        alert(res.error || 'Erro ao recusar pedido.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao recusar pedido.');
    } finally {
      setIsRejecting(null);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      const res = await updateRequestStatus(requestId, 'ACCEPTED');
      if (res.success) {
        window.location.reload();
      } else {
        alert(res.error || 'Erro ao aceitar pedido.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao aceitar pedido.');
    }
  };

  const handleFreeUnlock = async (requestId: string) => {
    try {
      setIsFreeUnlocking(requestId);
      const res = await unlockLeadFree(requestId);
      if (res.success) {
        window.location.reload();
      } else if (res.needsPayment) {
        // Já usou o gratuito — redireciona para pagamento
        const req = requests.find((r: any) => r.id === requestId);
        if (req) handleCheckout('UNLOCK_LEAD', req.coinPrice || 15, 'Desbloqueio de Contato de Cliente', requestId);
      } else {
        alert(res.error || 'Erro ao desbloquear.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao desbloquear lead.');
    } finally {
      setIsFreeUnlocking(null);
    }
  };

  const requests = professional?.receivedRequests || [];
  const planType = professional?.planType || 'BASIC';
  const balance = professional?.walletBalance ? Number(professional.walletBalance) : 0;
  const freeLeadsUsed = professional?.freeLeadsUsed ?? 0;
  const isPro = planType === 'PRO';
  const isElite = planType === 'ELITE';

  const TABS = [
    { id: 'geral', label: 'Visão Geral', hidden: false },
    { id: 'pedidos', label: 'Meus Pedidos', hidden: false },
    { id: 'agenda', label: 'Agenda', hidden: !isPro && !isElite },
    { id: 'metricas', label: 'Metricas', hidden: !isPro && !isElite },
    { id: 'pagamentos', label: 'Pagamentos', hidden: false },
    { id: 'assinatura', label: 'Assinatura', hidden: false },
    { id: 'perfil', label: 'Meu Perfil', hidden: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] tracking-tight">
            Portal do Profissional
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
            Bem-vindo de volta, {profile?.name?.split(' ')[0] || 'Profissional'}. Você tem {requests.filter((r: any) => r.status === 'PENDING').length} solicitações pendentes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4" aria-hidden="true" />
            Notificações
          </Button>
          <Button size="sm">Ficar Offline</Button>
        </div>
      </div>

      {/* Banner Dourado: Chat Gratuito Disponível */}
      {freeLeadsUsed === 0 && requests.length > 0 && planType !== 'PRO' && planType !== 'ELITE' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 p-4 shadow-lg border border-amber-300"
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative flex items-center gap-4">
            <div className="text-3xl">🎁</div>
            <div className="flex-1">
              <p className="font-black text-amber-900 text-base leading-tight">Seu 1º Chat é GRATUITO!</p>
              <p className="text-amber-800 text-sm mt-0.5">Responda agora e negocie com o cliente sem pagar nada. A partir do 2º lead, cada desbloqueio custa R$ 15.</p>
            </div>
            <div className="shrink-0 bg-amber-900/20 rounded-xl px-3 py-1.5 text-center">
              <p className="text-amber-900 font-black text-xl">1</p>
              <p className="text-amber-900 text-[10px] font-bold uppercase tracking-wider">Grátis</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ganhos (Mês)', value: formatCurrency(0), icon: Wallet, color: '#10B981' },
          { label: 'Serviços Ativos', value: '0', icon: TrendingUp, color: '#6366F1' },
          { label: 'Avaliação Média', value: '0.0', icon: Star, color: '#F59E0B' },
          { label: 'Taxa de Conclusão', value: `0%`, icon: TrendingUp, color: '#8B5CF6' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-[var(--radius-lg)] flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${stat.color}14` }}
                >
                  <stat.icon className="h-5 w-5" style={{ color: stat.color }} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-lg font-bold text-[hsl(var(--foreground))]">{stat.value}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Navigation & Content */}
      <div className="mt-8">
        <div className="border-b border-[hsl(var(--border))] mb-6">
          <div className="flex items-center gap-6 text-sm font-medium">
            {TABS.filter(t => !t.hidden).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 border-b-2 transition-colors capitalize ${
                  activeTab === tab.id
                    ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]'
                    : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'geral' && (
            <div className="space-y-4">
              {requests.length === 0 ? (
                <div className="py-12 text-center text-[hsl(var(--muted-foreground))]">
                  Você ainda não recebeu nenhuma solicitação de orçamento.
                </div>
              ) : (
                requests.map((req: any) => {
                  const isUnlocked = 
                    (req.isPremiumLead ? planType === 'ELITE' : (planType === 'PRO' || planType === 'ELITE')) || req.isUnlocked;
                  const clientFirstName = req.client.name ? req.client.name.split(' ')[0] : 'Cliente';
                  const maskedName = isUnlocked ? req.client.name : `${clientFirstName} ***`;
                  
                  return (
                    <Card key={req.id} className={`overflow-hidden transition-all duration-200 ${!isUnlocked && req.status === 'PENDING' ? (req.isPremiumLead ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'border-[hsl(var(--primary)/0.5)] shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]') : ''}`}>
                      {/* Urgency Banner for Locked Leads */}
                      {!isUnlocked && req.status === 'PENDING' && (
                        <div className={req.isPremiumLead ? "bg-amber-500/10 px-5 py-2.5 flex items-center gap-2 border-b border-amber-500/20" : "bg-[hsl(var(--primary)/0.1)] px-5 py-2.5 flex items-center gap-2 border-b border-[hsl(var(--primary)/0.2)]"}>
                          {req.isPremiumLead ? (
                            <Sparkles className="h-4 w-4 text-amber-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-[hsl(var(--primary))]" />
                          )}
                          <p className={req.isPremiumLead ? "text-xs font-medium text-amber-600" : "text-xs font-medium text-[hsl(var(--primary))]"}>
                            {req.isPremiumLead ? (
                              <>Dica: Este é um <strong className="font-bold">Lead Premium</strong> com diagnóstico gerado por Inteligência Artificial.</>
                            ) : (
                              <>Dica: Profissionais que respondem rápido têm <strong className="font-bold">3x mais chances</strong> de fechar o serviço.</>
                            )}
                          </p>
                        </div>
                      )}

                      <CardContent className="p-5 flex flex-col md:flex-row gap-5 justify-between">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                              {!isUnlocked && <LockKeyhole className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />}
                              {maskedName}
                            </h3>
                            {req.status === 'PENDING' && <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-none font-semibold px-2.5 py-0.5">Novo Pedido</Badge>}
                            {req.isPremiumLead && <Badge variant="secondary" className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white border-none font-semibold px-2.5 py-0.5 flex gap-1 items-center"><Sparkles className="h-3 w-3" /> IA Verificado</Badge>}
                            {req.status === 'REJECTED' && <Badge variant="secondary" className="bg-red-100 text-red-700">Recusado</Badge>}
                            {req.status === 'ACCEPTED' && <Badge variant="secondary" className="bg-green-100 text-green-700">Aceito</Badge>}
                          </div>
                          
                          {/* Descrição Original do Cliente */}
                          <div className="flex gap-4">
                            {req.imageUrl && (
                              <div className="w-20 h-20 shrink-0 rounded-[var(--radius-md)] overflow-hidden bg-[hsl(var(--muted))] border border-[hsl(var(--border))]">
                                <img src={req.imageUrl} alt="Foto enviada pelo cliente" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <p className="text-sm text-[hsl(var(--foreground))] mb-4 whitespace-pre-wrap leading-relaxed relative flex-1">
                              <span className="text-[hsl(var(--muted-foreground))]">"</span>
                              {req.description}
                              <span className="text-[hsl(var(--muted-foreground))]">"</span>
                            </p>
                          </div>

                          {/* Diagnóstico da IA (se destravado) */}
                          {req.isPremiumLead && isUnlocked && req.aiDiagnosis && (
                            <div className="mb-4 mt-2 p-4 bg-amber-500/10 border border-amber-500/20 rounded-[var(--radius-lg)]">
                              <h4 className="text-sm font-bold text-amber-700 flex items-center gap-1.5 mb-2">
                                <Sparkles className="h-4 w-4" /> Diagnóstico Avançado (IA)
                              </h4>
                              <p className="text-xs text-[hsl(var(--foreground))] mb-2">
                                <strong>Problema Identificado:</strong> {req.aiDiagnosis.problem}
                              </p>
                              {req.aiDiagnosis.materials && req.aiDiagnosis.materials.length > 0 && (
                                <p className="text-xs text-[hsl(var(--foreground))] mb-2">
                                  <strong>Materiais Necessários:</strong> {req.aiDiagnosis.materials.join(', ')}
                                </p>
                              )}
                              {req.aiDiagnosis.estimatedCostRange && (
                                <p className="text-xs text-amber-600 font-bold">
                                  Estimativa de Custo Base: {formatCurrency(req.aiDiagnosis.estimatedCostRange.min)} - {formatCurrency(req.aiDiagnosis.estimatedCostRange.max)}
                                </p>
                              )}
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-4 text-xs font-medium text-[hsl(var(--muted-foreground))]">
                            <span className="flex items-center gap-1.5 bg-[hsl(var(--muted))] px-2.5 py-1.5 rounded-md">
                              <Calendar className="h-3.5 w-3.5" />
                              Para: {req.scheduledDate ? new Date(req.scheduledDate).toLocaleDateString() : 'A combinar'}
                            </span>
                            <span className="flex items-center gap-1.5 bg-[hsl(var(--muted))] px-2.5 py-1.5 rounded-md">
                              <Clock className="h-3.5 w-3.5" />
                              Recebido em: {new Date(req.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 min-w-[220px] justify-center border-t md:border-t-0 md:border-l border-[hsl(var(--border))] pt-4 md:pt-0 md:pl-5">
                          {req.status === 'PENDING' && (
                            <>
                              {!isUnlocked ? (
                                <div className="space-y-2">
                                  {freeLeadsUsed === 0 && planType !== 'PRO' ? (
                                    <Button
                                      className="w-full font-bold shadow-md bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-950 border-0"
                                      onClick={() => handleFreeUnlock(req.id)}
                                      disabled={isFreeUnlocking === req.id}
                                    >
                                      {isFreeUnlocking === req.id ? (
                                        <><span className="animate-spin mr-2">⏳</span> Liberando...</>
                                      ) : (
                                        <>
                                          <span className="mr-2">🎁</span>
                                          Conversar (Grátis)
                                        </>
                                      )}
                                    </Button>
                                  ) : (
                                    <Button 
                                      className={`w-full text-white font-semibold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 ${req.isPremiumLead ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' : 'bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)]'}`}
                                      onClick={() => handleCheckout('UNLOCK_LEAD', req.coinPrice || 15, 'Desbloqueio de Contato de Cliente', req.id)}
                                      disabled={isCheckoutModalOpen || isRejecting === req.id}
                                    >
                                      <Phone className="h-4 w-4 mr-2" />
                                      {req.isPremiumLead ? `Liberar Lead Premium (R$ ${req.coinPrice || 15})` : `Desbloquear Chat (R$ ${req.coinPrice || 15})`}
                                    </Button>
                                  )}
                                  <p className="text-[10px] text-center text-[hsl(var(--muted-foreground))]">
                                    O valor é retornado caso o cliente não responda em 24h.
                                  </p>
                                </div>
                              ) : (
                                <Button 
                                  className="w-full bg-[hsl(var(--success))] hover:bg-[hsl(var(--success-muted))] hover:text-[hsl(var(--success))] text-white"
                                  onClick={() => handleAccept(req.id)}
                                >
                                  Aceitar Pedido
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                className="w-full text-[hsl(var(--muted-foreground))] hover:text-red-500 hover:bg-red-500/10 transition-colors text-xs"
                                onClick={() => handleReject(req.id)}
                                disabled={isRejecting === req.id}
                              >
                                {isRejecting === req.id ? 'Recusando...' : 'Não tenho interesse'}
                              </Button>
                            </>
                          )}
                          {req.status === 'ACCEPTED' && isUnlocked && (
                            <div className="flex flex-col gap-3">
                              {planType === 'PRO' ? (
                                // Acesso VIP ao WhatsApp para assinantes PRO
                                <>
                                  <a 
                                    href={`https://wa.me/${req.client?.phone?.replace(/\D/g, '') || ''}?text=Olá,%20sou%20o%20profissional%20do%20AcheiYou!`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full group"
                                  >
                                    <Button 
                                      className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 relative overflow-hidden"
                                    >
                                      {/* Efeito de brilho premium no fundo */}
                                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                      </svg>
                                      <span className="font-bold tracking-wide">Conversar no WhatsApp</span>
                                    </Button>
                                  </a>
                                  {req.client?.phone && (
                                    <p className="text-xs text-center font-medium text-[hsl(var(--muted-foreground))]">
                                      Telefone: {req.client.phone}
                                    </p>
                                  )}
                                </>
                              ) : (
                                // Paywall para usuários Básicos (Chat Interno)
                                <div className="space-y-3 bg-[hsl(var(--muted))] p-3 rounded-lg border border-[hsl(var(--border))]">
                                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-2 py-1.5 rounded text-xs font-medium border border-amber-200">
                                    <LockKeyhole className="h-3.5 w-3.5" />
                                    <span>WhatsApp exclusivo para Plano PRO</span>
                                  </div>
                                  
                                  <Button 
                                    variant="default"
                                    className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white shadow-sm"
                                    onClick={() => {
                                      window.dispatchEvent(new CustomEvent('open-chat', { detail: { requestId: req.id } }));
                                    }}
                                  >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Abrir Chat Interno
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                          {req.status === 'REJECTED' && (
                            <Button variant="outline" className="w-full opacity-50 cursor-not-allowed" disabled>
                              Solicitação Recusada
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          )}
          {activeTab === 'agenda' && <AgendaView requests={requests} />}
          {activeTab === 'metricas' && (
            <div className="py-12 text-center text-[hsl(var(--muted-foreground))]">
              Métricas e estatísticas estarão disponíveis em breve.
            </div>
          )}
          {activeTab === 'pagamentos' && (
            <WalletView 
              planType={planType} 
              transactions={professional?.transactions || []}
              onGoToPlans={() => setActiveTab('assinatura')}
            />
          )}
          {activeTab === 'pedidos' && (
            <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] overflow-hidden">
              <div className="px-6 py-4 border-b border-[hsl(var(--border))] flex items-center justify-between">
                <h2 className="font-semibold text-[hsl(var(--foreground))]">Solicitações que você fez como cliente</h2>
              </div>
              <div className="p-0">
                {clientRequests.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm font-medium text-[hsl(var(--foreground))]">Você ainda não tem pedidos como cliente</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Navegue pelos profissionais e peça um orçamento!</p>
                  </div>
                ) : (
                  <DashboardRequests requests={clientRequests} profileId={profile.id} />
                )}
              </div>
            </div>
          )}
          {activeTab === 'perfil' && (
            <ProfileSettings profile={profile} professional={professional} />
          )}

          {activeTab === 'assinatura' && (
            <PlanosView 
              currentPlan={planType} 
              onUpgrade={handleCheckout} 
            />
          )}
        </motion.div>
      </div>
      
      {checkoutData && (
        <MercadoPagoModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          amount={checkoutData.amount}
          description={checkoutData.description}
          metadata={{ type: checkoutData.type, requestId: checkoutData.requestId }}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  );
}
