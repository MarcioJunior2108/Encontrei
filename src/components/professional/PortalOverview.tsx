'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Assuming we have or will mock a Tabs component
import { MOCK_PROFESSIONALS } from '@/mock/data';
import { MetricsView } from './MetricsView';
import { AgendaView } from './AgendaView';
import { Button } from '@/components/ui/button';
import { Bell, Wallet, TrendingUp, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

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

  const handleCheckoutSuccess = () => {
    setIsCheckoutModalOpen(false);
    // Idealmente faríamos um reload ou atualizaríamos o estado para refletir a mudança
    window.location.reload();
  };

  const handleReject = async (requestId: string) => {
    try {
      setIsRejecting(requestId);
      const res = await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED' }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert('Erro ao recusar pedido.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao recusar pedido.');
    } finally {
      setIsRejecting(null);
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
                  const clientName = isUnlocked ? req.client.name : 'Cliente Confidencial';
                  
                  return (
                    <Card key={req.id} className="overflow-hidden">
                      <CardContent className="p-5 flex flex-col md:flex-row gap-5 justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg">{clientName}</h3>
                            {req.status === 'PENDING' && <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">Novo</Badge>}
                            {req.status === 'REJECTED' && <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">Recusado</Badge>}
                            {req.status === 'ACCEPTED' && <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Aceito</Badge>}
                          </div>
                          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4 whitespace-pre-wrap">{req.description}</p>
                          
                          <div className="flex gap-4 text-xs font-medium">
                            <span className="bg-[hsl(var(--muted))] px-2 py-1 rounded-md">
                              Data: {req.scheduledDate ? new Date(req.scheduledDate).toLocaleDateString() : 'A combinar'}
                            </span>
                            <span className="bg-[hsl(var(--muted))] px-2 py-1 rounded-md">
                              Em: {new Date(req.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[200px] justify-center">
                          {req.status === 'PENDING' && (
                            <>
                              {!isUnlocked ? (
                                <Button 
                                  className="w-full bg-[hsl(var(--primary))]"
                                  onClick={() => handleCheckout('UNLOCK_LEAD', 10, 'Desbloqueio de Contato de Cliente', req.id)}
                                  disabled={isCheckoutModalOpen || isRejecting === req.id}
                                >
                                  <Wallet className="h-4 w-4 mr-2" />
                                  Desbloquear (R$ 10)
                                </Button>
                              ) : (
                                <Button className="w-full bg-[hsl(var(--success))] hover:bg-[hsl(var(--success-muted))] hover:text-[hsl(var(--success))] text-white">
                                  Aceitar Pedido
                                </Button>
                              )}
                              <Button 
                                variant="outline" 
                                className="w-full text-red-500 hover:bg-red-500/10 hover:text-red-500 border-red-200"
                                onClick={() => handleReject(req.id)}
                                disabled={isRejecting === req.id}
                              >
                                {isRejecting === req.id ? 'Recusando...' : 'Recusar'}
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
                    onClick={() => handleCheckout('ADD_FUNDS', 50, 'Adicionar R$50 na Carteira Encontrei')}
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
