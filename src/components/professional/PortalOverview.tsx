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

import { ProfileSettings } from './ProfileSettings';
import { Badge } from '@/components/ui/badge';
import { MercadoPagoModal } from '@/components/checkout/MercadoPagoModal';

export function PortalOverview({ profile, professional }: { profile: any, professional?: any }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{type: string, amount: number, description: string, requestId?: string} | null>(null);
  const [isRejecting, setIsRejecting] = useState<string | null>(null);

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

  const requests = professional?.receivedRequests || [];
  const planType = professional?.planType || 'BASIC';
  const balance = professional?.walletBalance ? Number(professional.walletBalance) : 0;

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
            {['overview', 'agenda', 'metricas', 'pagamentos', 'perfil'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]'
                    : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                }`}
              >
                {tab === 'overview' ? 'Visão Geral' : tab === 'perfil' ? 'Meu Perfil' : tab}
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
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {requests.length === 0 ? (
                <div className="py-12 text-center text-[hsl(var(--muted-foreground))]">
                  Você ainda não recebeu nenhuma solicitação de orçamento.
                </div>
              ) : (
                requests.map((req: any) => {
                  const isUnlocked = planType === 'PRO' || req.isUnlocked;
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
                                  <Button 
                                    className={`w-full text-white font-semibold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 ${req.isPremiumLead ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' : 'bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)]'}`}
                                    onClick={() => handleCheckout('UNLOCK_LEAD', req.coinPrice || 15, 'Desbloqueio de Contato de Cliente', req.id)}
                                    disabled={isCheckoutModalOpen || isRejecting === req.id}
                                  >
                                    <Phone className="h-4 w-4 mr-2" />
                                    {req.isPremiumLead ? `Liberar Lead Premium (R$ ${req.coinPrice || 15})` : `Liberar Contato (R$ ${req.coinPrice || 15})`}
                                  </Button>
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
                            <Button variant="outline" className="w-full">
                              Ver WhatsApp
                            </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Seu Plano Atual</h3>
                  <div className="flex items-center gap-3 mb-6">
                    <Badge variant={planType === 'PRO' ? 'primary' : 'secondary'} className="text-lg py-1 px-3">
                      {planType === 'PRO' ? 'Plano PRO' : 'Plano Básico'}
                    </Badge>
                  </div>
                  
                  {planType === 'BASIC' ? (
                    <div className="space-y-4">
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        No plano básico, você paga uma pequena taxa (R$ 10) para desbloquear o contato dos clientes que te mandam pedidos.
                      </p>
                      <Button 
                        className="w-full"
                        onClick={() => handleCheckout('UPGRADE_PRO', 97, 'Assinatura Plano PRO Mensal')}
                        disabled={isCheckoutModalOpen}
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Fazer Upgrade para PRO (R$ 97/mês)
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Você tem acesso ilimitado a todos os pedidos e aparece no topo das buscas!
                      </p>
                      <Button variant="outline" className="w-full">Gerenciar Assinatura</Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Sua Carteira</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">Saldo para desbloquear contatos (Plano Básico).</p>
                  
                  <div className="text-4xl font-black mb-6">
                    {formatCurrency(balance)}
                  </div>
                  
                  <Button 
                    className="w-full mb-2 bg-[hsl(var(--success))] hover:bg-[hsl(var(--success-muted))] hover:text-[hsl(var(--success))] text-white"
                    onClick={() => handleCheckout('ADD_FUNDS', 50, 'Adicionar R$50 na Carteira AcheiYou')}
                    disabled={isCheckoutModalOpen}
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Adicionar Créditos (R$ 50)
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
          {activeTab === 'perfil' && (
            <ProfileSettings profile={profile} />
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
