'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Receipt, ArrowRight, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WalletViewProps {
  planType: string;
  transactions: any[];
  onGoToPlans: () => void;
}

export function WalletView({ planType, transactions, onGoToPlans }: WalletViewProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
        {/* PLANO ATUAL */}
        <Card className="flex flex-col border-[hsl(var(--primary)/0.2)] shadow-md shadow-[hsl(var(--primary)/0.05)]">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Seu Plano Atual</CardTitle>
            <CardDescription>Status atual da sua conta de profissional</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center items-center text-center p-6 pt-0">
            <Badge variant={planType !== 'BASIC' ? 'primary' : 'secondary'} className="text-lg py-1 px-6 mb-4">
              {planType === 'BASIC' ? 'Plano Básico' : `Plano ${planType}`}
            </Badge>
            <p className="text-[hsl(var(--muted-foreground))] mb-8 max-w-md">
              {planType === 'BASIC' 
                ? 'No plano básico, você paga uma pequena taxa avulsa por cada pedido de orçamento que deseja desbloquear.' 
                : 'Sua assinatura está ativa e você tem acesso a todos os benefícios exclusivos do seu plano.'}
            </p>
            <Button 
              size="lg"
              variant={planType === 'BASIC' ? 'default' : 'outline'} 
              className={`w-full max-w-sm font-semibold ${planType === 'BASIC' ? 'bg-[hsl(var(--primary))]' : ''}`}
              onClick={onGoToPlans}
            >
              {planType === 'BASIC' ? 'Ver Planos de Assinatura' : 'Gerenciar Assinatura'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* HISTÓRICO DE TRANSAÇÕES */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Extrato de Pagamentos</CardTitle>
              <CardDescription>Suas últimas compras de contatos e assinaturas</CardDescription>
            </div>
            <Receipt className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-[hsl(var(--muted-foreground))]">
              Você ainda não possui transações registradas.
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((t) => {
                const dateStr = format(new Date(t.createdAt), "dd 'de' MMM, HH:mm", { locale: ptBR });
                
                let title = 'Pagamento Avulso';
                if (t.type === 'UNLOCK_LEAD') title = 'Desbloqueio de Contato';
                if (t.type === 'UPGRADE_PRO') title = 'Assinatura de Plano';
                
                return (
                  <div key={t.id} className="flex items-center justify-between p-4 rounded-xl border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted)/0.5)] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] flex items-center justify-center shrink-0">
                        <ArrowUpRight className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-[hsl(var(--foreground))]">{title}</p>
                          {t.status === 'RELEASED' || t.status === 'APPROVED' ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <Clock className="h-3 w-3 text-amber-500" />
                          )}
                        </div>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] capitalize">{dateStr} • via {t.paymentMethod || 'MercadoPago'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[hsl(var(--foreground))] block">- {formatCurrency(t.amount)}</span>
                      <span className="text-[10px] text-[hsl(var(--muted-foreground))] uppercase font-medium">{t.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
