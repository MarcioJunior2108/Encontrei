import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Ban, CheckCircle } from 'lucide-react';
import { promoteToAdmin } from '@/app/actions/admin'; // TODO: Implement

export default async function AdminUsersPage() {
  const users = await prisma.profile.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Usuários</h1>
        <p className="text-[hsl(var(--muted-foreground))] mt-1">Veja e modere todos os clientes e profissionais cadastrados.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os Usuários ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[hsl(var(--muted-foreground))] uppercase bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))]">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">Usuário</th>
                  <th className="px-6 py-3">Tipo</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Telefone</th>
                  <th className="px-6 py-3 rounded-tr-lg text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted)/0.3)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[hsl(var(--foreground))]">{u.name}</div>
                      <div className="text-[hsl(var(--muted-foreground))]">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={u.role === 'ADMIN' ? 'primary' : u.role === 'PROFESSIONAL' ? 'success' : 'secondary'}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={u.status === 'ACTIVE' ? 'success' : 'error'}>
                        {u.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-[hsl(var(--muted-foreground))]">
                      {u.phone || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {u.role !== 'ADMIN' && (
                          <Button variant="outline" size="sm" title="Promover a Admin">
                            <Shield className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-500 hover:bg-red-500/10" title="Banir Usuário">
                          <Ban className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
