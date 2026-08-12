import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { IntentInput } from '@/components/intent/IntentInput';
import { Card, CardContent } from '@/components/ui/card';
import { MOCK_REQUESTS } from '@/mock/data';
import { formatRelativeTime, getStatusLabel, formatCurrency, cn } from '@/lib/utils';
import { getCurrentProfile } from '@/app/actions/user';
import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, FileText, Star } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Meu Painel',
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  
  if (!profile) {
    redirect('/login');
  }

  const realRequests = await prisma.serviceRequest.findMany({
    where: { clientId: profile.id },
    include: { professional: { include: { profile: true } } },
    orderBy: { createdAt: 'desc' }
  });

  const recentRequests = realRequests.slice(0, 5);

  const statusColors: Record<string, 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary'> = {
    COMPLETED: 'success', PENDING: 'warning', REJECTED: 'error',
    ACCEPTED: 'primary', CANCELLED: 'secondary',
  };

  return (
    <main id="main-content">
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
            Olá, {profile.name?.split(' ')[0] || 'Usuário'} 👋
          </h1>
          <p className="text-[hsl(var(--muted-foreground))] mt-1">O que você precisa hoje?</p>
        </div>

        {/* Intent input */}
        <div className="mb-10">
          <IntentInput />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Solicitações', value: realRequests.length, icon: FileText, color: '#6366F1' },
            { label: 'Aguardando', value: realRequests.filter(r => r.status === 'PENDING').length, icon: Clock, color: '#F59E0B' },
            { label: 'Concluídos', value: realRequests.filter(r => r.status === 'COMPLETED').length, icon: Star, color: '#10B981' },
            { label: 'Tempo médio', value: '18min', icon: Clock, color: '#8B5CF6' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-[var(--radius-lg)] flex items-center justify-center" style={{ backgroundColor: `${color}14` }}>
                  <Icon className="h-5 w-5" style={{ color }} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xl font-bold text-[hsl(var(--foreground))]">{value}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent requests */}
        <Card>
          <div className="px-6 py-4 border-b border-[hsl(var(--border))] flex items-center justify-between">
            <h2 className="font-semibold text-[hsl(var(--foreground))]">Solicitações recentes</h2>
          </div>
          <CardContent className="p-0">
            {recentRequests.length === 0 ? (
              <div className="py-12 text-center">
                <FileText className="h-8 w-8 text-[hsl(var(--muted-foreground)/0.4)] mx-auto mb-3" />
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">Ainda não há solicitações</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Navegue pelos profissionais e peça um orçamento!</p>
              </div>
            ) : (
              <div className="divide-y divide-[hsl(var(--border))]">
                {recentRequests.map(req => (
                  <div key={req.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[hsl(var(--muted)/0.3)] transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate">Para: {req.professional.profile.name}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 truncate">{req.description}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge variant={statusColors[req.status] ?? 'secondary'} className="text-[10px] flex-shrink-0">
                      {req.status === 'PENDING' ? 'Aguardando' : req.status === 'ACCEPTED' ? 'Aceito' : req.status === 'REJECTED' ? 'Recusado' : req.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
