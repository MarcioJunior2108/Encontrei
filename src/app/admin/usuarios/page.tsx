import { prisma } from '@/lib/prisma';
import { UsersTable } from './UsersTable';

export default async function AdminUsersPage() {
  const users = await prisma.profile.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Usuários</h1>
        <p className="text-[hsl(var(--muted-foreground))] mt-1">Veja e modere todos os clientes e profissionais cadastrados.</p>
      </div>

      <UsersTable initialUsers={users} />
    </div>
  );
}
