import { prisma } from '@/lib/prisma';
import { LeadsTable } from './LeadsTable';

export default async function AdminLeadsPage() {
  const requests = await prisma.serviceRequest.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      client: {
        select: {
          name: true,
          email: true,
          phone: true,
        }
      },
      professional: {
        include: {
          profile: {
            select: {
              name: true,
              phone: true,
              status: true,
              claimToken: true,
            }
          }
        }
      }
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leads Pendentes (WhatsApp)</h1>
        <p className="text-[hsl(var(--muted-foreground))] mt-1">Gerencie e dispare mensagens via WhatsApp Web para profissionais não ativados.</p>
      </div>

      <LeadsTable initialRequests={requests} />
    </div>
  );
}
