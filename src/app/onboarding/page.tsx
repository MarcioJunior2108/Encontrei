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

  // Se já tiver telefone cadastrado, significa que já fez onboarding
  // Redireciona para o painel correto
  if (profile.phone) {
    if (profile.role === 'PROFESSIONAL') {
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
