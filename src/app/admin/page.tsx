import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default async function AdminDashboardPage() {
  const [
    totalProfiles,
    totalProfessionals,
    totalRequests,
    recentUsers,
    pendingRequests,
    paidRequests
  ] = await Promise.all([
    prisma.profile.count(),
    prisma.professional.count(),
    prisma.serviceRequest.count(),
    prisma.profile.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.serviceRequest.count({ where: { status: 'PENDING' } }),
    prisma.serviceRequest.count({ where: { isUnlocked: true } })
  ]);

  const totalClients = totalProfiles - totalProfessionals;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
        <p className="text-[hsl(var(--muted-foreground))] mt-1">Métricas em tempo real da plataforma Encontrei.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProfiles}</div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
              {totalClients} Clientes | {totalProfessionals} Profissionais
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamentos (Total)</CardTitle>
            <FileText className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests}</div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
              Pedidos de serviço transacionados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamentos Pendentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests}</div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
              Aguardando resposta do profissional
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Estimada</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(paidRequests * 10)}</div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
              Cálculo baseado na taxa de lead (R$10)
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Gráfico Falso para preencher a tela como Dashboard Premium */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Crescimento da Plataforma (Mock)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full flex items-end justify-between px-6 pb-6 pt-4 gap-2">
              {[30, 45, 25, 60, 75, 45, 90].map((height, i) => (
                <div key={i} className="w-full bg-[hsl(var(--primary-muted))] rounded-t-sm relative group cursor-pointer" style={{ height: `${height}%` }}>
                  <div className="absolute inset-0 bg-[hsl(var(--primary))] opacity-0 group-hover:opacity-100 transition-opacity rounded-t-sm" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cadastros Recentes */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Cadastros Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentUsers.map(u => (
                <div key={u.id} className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center font-medium">
                    {u.name?.charAt(0) || '?'}
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{u.name}</p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{u.email}</p>
                  </div>
                  <div className="ml-auto font-medium text-xs bg-[hsl(var(--muted))] px-2 py-1 rounded">
                    {u.role}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
