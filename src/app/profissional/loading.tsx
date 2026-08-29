import { Header } from '@/components/layout/Header';
import { Loader2 } from 'lucide-react';

export default function ProfessionalLoading() {
  return (
    <main className="min-h-dvh bg-[hsl(var(--background))] flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <Loader2 className="h-12 w-12 text-[hsl(var(--primary))] animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">Carregando seu portal...</h2>
        <p className="text-[hsl(var(--muted-foreground))] mt-2 text-center max-w-sm">
          Aguarde um momento enquanto buscamos as suas solicitações de serviço.
        </p>
      </div>
    </main>
  );
}
