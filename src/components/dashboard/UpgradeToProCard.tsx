'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Briefcase, Loader2, Sparkles, X } from 'lucide-react';
import { upgradeToProfessional } from '@/app/actions/user';

export function UpgradeToProCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    
    try {
      const result = await upgradeToProfessional(formData);
      
      if (result.success) {
        alert('Parabéns! Sua conta foi atualizada para Profissional.');
        setIsOpen(false);
        // Force refresh to update the session and redirect
        router.push('/profissional');
        router.refresh();
      } else {
        alert(result.error || 'Erro ao atualizar conta.');
      }
    } catch (error) {
      alert('Ocorreu um erro inesperado.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Card className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent border-indigo-500/20 overflow-hidden relative">
        {/* Decorative background circle */}
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <Briefcase className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[hsl(var(--foreground))] flex items-center gap-2">
                Você também é um profissional?
                <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
              </h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1 max-w-md">
                Anuncie seus serviços na plataforma, receba pedidos de orçamento todos os dias e aumente sua renda.
              </p>
            </div>
          </div>

          <Button 
            size="lg" 
            onClick={() => setIsOpen(true)}
            className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8"
          >
            Quero Anunciar Meus Serviços
          </Button>
        </CardContent>
      </Card>

      {/* Simple Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-[hsl(var(--border))] w-full max-w-md relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-6 pt-8">
              <h2 className="text-xl font-bold text-[hsl(var(--foreground))] mb-2">Tornar-se Profissional</h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
                Preencha os dados básicos da sua área de atuação para começarmos. Você poderá editar tudo no seu painel depois.
              </p>
              
              <form action={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="service" className="text-sm font-semibold">Qual é a sua Profissão/Serviço?</label>
                  <Input 
                    id="service" 
                    name="service" 
                    placeholder="Ex: Eletricista, Encanador, Energia Solar..." 
                    className="h-12 bg-slate-50 dark:bg-slate-900"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-semibold">Em qual cidade você atende?</label>
                  <Input 
                    id="city" 
                    name="city" 
                    placeholder="Ex: Salvador, Feira de Santana..." 
                    className="h-12 bg-slate-50 dark:bg-slate-900"
                    required 
                  />
                </div>
                <Button type="submit" size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-base font-semibold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Atualizando Conta...
                    </>
                  ) : (
                    'Concluir Upgrade'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
