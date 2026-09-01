import { prisma } from '@/lib/prisma';
import { UsersTable } from './UsersTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, ShieldAlert, TrendingUp } from 'lucide-react';

export default async function AdminUsersPage() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    users,
    totalUsers,
    totalProfessionals,
    totalClients,
    activeProfessionals,
    unclaimedProfessionals,
    newUsers30Days
  ] = await Promise.all([
    prisma.profile.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
      }
    }),
    prisma.profile.count(),
    prisma.profile.count({ where: { role: 'PROFESSIONAL' } }),
    prisma.profile.count({ where: { role: 'CLIENT' } }),
    prisma.profile.count({ where: { role: 'PROFESSIONAL', status: 'ACTIVE' } }),
    prisma.profile.count({ where: { role: 'PROFESSIONAL', status: 'UNCLAIMED' } }),
    prisma.profile.count({ where: { createdAt: { gte: thirtyDaysAgo } } })
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Usuários</h1>
        <p className="text-[hsl(var(--muted-foreground))] mt-1">Veja e modere todos os clientes e profissionais cadastrados.</p>
      </div>

      {/* KPI Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
              Todos cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Cadastrados</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalClients}</div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
              Buscando serviços
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profissionais Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{activeProfessionals}</div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
              De um total de {totalProfessionals}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads (Unclaimed)</CardTitle>
            <ShieldAlert className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{unclaimedProfessionals}</div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
              Aguardando dono
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos (30 dias)</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{newUsers30Days}</div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
              No último mês
            </p>
          </CardContent>
        </Card>
      </div>

      <UsersTable initialUsers={users} />
    </div>
  );
}
