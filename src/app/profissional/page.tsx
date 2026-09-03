import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { PortalOverview } from '@/components/professional/PortalOverview';
import { getCurrentProfile } from '@/app/actions/user';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Portal do Profissional',
  robots: { index: false, follow: false },
};

export default async function ProfessionalDashboardPage() {
  const profile = await getCurrentProfile();
  
  if (!profile) {
    redirect('/login');
  }

  if (profile.role !== 'PROFESSIONAL' && profile.role !== 'ADMIN') {
    redirect('/dashboard');
  }



  const professionalData = await prisma.professional.findUnique({
    where: { userId: profile.id },
    include: {
      receivedRequests: {
        include: { client: true },
        orderBy: { createdAt: 'desc' }
      },
      transactions: {
        orderBy: { createdAt: 'desc' },
        take: 20
      }
    }
  });

  // Also fetch the requests they made as a client!
  const clientRequests = await prisma.serviceRequest.findMany({
    where: { clientId: profile.id },
    include: { professional: { include: { profile: true } } },
    orderBy: { createdAt: 'desc' }
  });

  // PROTEÇÃO DE DADOS: Ocultar telefone e e-mail do cliente se o lead não estiver pago!
  if (professionalData?.receivedRequests) {
    professionalData.receivedRequests = professionalData.receivedRequests.map((req: any) => {
      // Se for Premium: apenas ELITE ganha grátis. Se for Regular: PRO e ELITE ganham grátis.
      const isLeadAccessible = 
        (req.isPremiumLead ? professionalData.planType === 'ELITE' : (professionalData.planType === 'PRO' || professionalData.planType === 'ELITE')) || req.isUnlocked;
        
      if (!isLeadAccessible && req.client) {
        req.client.email = '[OCULTO]';
        req.client.phone = '[OCULTO]';
      }
      return req;
    }) as any;
  }

  // Convert Decimals to numbers for the Client Component
  const safeProfessionalData = professionalData ? {
    ...professionalData,
    basePrice: professionalData.basePrice ? Number(professionalData.basePrice) : null,
    walletBalance: professionalData.walletBalance ? Number(professionalData.walletBalance) : 0,
    receivedRequests: professionalData.receivedRequests.map((req: any) => ({
      ...req,
      proposedPrice: req.proposedPrice ? Number(req.proposedPrice) : null
    })),
    transactions: professionalData.transactions.map((t: any) => ({
      ...t,
      amount: Number(t.amount)
    }))
  } : null;

  const safeClientRequests = clientRequests.map((req: any) => ({
    ...req,
    proposedPrice: req.proposedPrice ? Number(req.proposedPrice) : null
  }));

  return (
    <main id="main-content" className="min-h-dvh bg-[hsl(var(--background))]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <PortalOverview profile={profile} professional={safeProfessionalData} clientRequests={safeClientRequests} />
      </div>
    </main>
  );
}
