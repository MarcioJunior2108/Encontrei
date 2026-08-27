import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { PlatformGrowthChart } from '@/components/admin/PlatformGrowthChart';

export default async function AdminDashboardPage() {
  const [
    totalProfiles,
    totalProfessionals,
    totalRequests,
    recentUsers,
    pendingRequests,
    paidRequests,
    transactionsSum
  ] = await Promise.all([
    prisma.profile.count(),
    prisma.professional.count(),
    prisma.serviceRequest.count(),
    prisma.profile.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.serviceRequest.count({ where: { status: 'PENDING' } }),
    prisma.serviceRequest.count({ where: { isUnlocked: true } }),
    prisma.transaction.aggregate({ _sum: { amount: true } })
  ]);

  const totalRevenue = Number(transactionsSum._sum.amount || 0);

  const totalClients = totalProfiles - totalProfessionals;

  // Busca cadastros dos últimos 30 dias para o gráfico
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const recentProfilesForChart = await prisma.profile.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
        <p className="text-[hsl(var(--muted-foreground))] mt-1">Métricas em tempo real da plataforma AcheiYou.</p>
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
            <CardTitle className="text-sm font-medium">Orçamentos Gerados</CardTitle>
            <FileText className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests}</div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
              Total de pedidos criados por clientes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Desbloqueados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidRequests}</div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
              Contatos comprados pelos profissionais
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Realizada</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
              Soma de todos os pagamentos aprovados
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Gráfico Interativo de Crescimento */}
        <PlatformGrowthChart profiles={recentProfilesForChart} />

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
