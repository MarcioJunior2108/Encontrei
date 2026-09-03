import type { Metadata } from 'next';
import { getCurrentProfile } from '@/app/actions/user';
import { redirect } from 'next/navigation';
import { OnboardingForm } from '@/components/auth/OnboardingForm';

export const metadata: Metadata = {
  title: 'Completar Cadastro',
  robots: { index: false, follow: false },
};

export default async function OnboardingPage() {
  const profile = await getCurrentProfile();
  
  if (!profile) {
    redirect('/login');
  }

  // Verifica se o onboarding está completo
  const isProfessional = profile.role === 'PROFESSIONAL';
  const hasPhone = !!profile.phone;
  const hasHeadline = !!profile.professional?.headline;

  const isComplete = isProfessional ? (hasPhone && hasHeadline) : hasPhone;

  // Se já tiver completado, redireciona para o painel correto
  if (isComplete) {
    if (isProfessional) {
      redirect('/profissional');
    } else {
      redirect('/dashboard');
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[hsl(var(--background))] px-4 py-12">
      <OnboardingForm profile={profile} />
    </div>
  );
}
