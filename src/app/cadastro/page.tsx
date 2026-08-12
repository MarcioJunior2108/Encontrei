'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { signup } from '@/app/actions/auth';
import { AlertCircle } from 'lucide-react';
import { Slottable } from '@radix-ui/react-slot';

export default function CadastroPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const result = await signup(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[hsl(var(--background))] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <Image 
            src="/logo.png" 
            alt="Encontrei Logo" 
            width={200} 
            height={80} 
            className="h-16 w-auto object-contain scale-[1.3]"
            priority
          />
        </Link>

        {/* Card */}
        <div className="rounded-[var(--radius-2xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-[var(--shadow-lg)]">
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-1">Crie sua conta</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-8">Comece a usar a plataforma hoje mesmo</p>

          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Formulário de cadastro">
            {error && (
              <div className="p-3 text-sm rounded-lg bg-[hsl(var(--error)/0.1)] text-[hsl(var(--error))] border border-[hsl(var(--error)/0.2)] flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">
                Nome completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Ex: João da Silva"
                className="w-full h-11 px-4 rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.12)] transition-all"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="seu@email.com"
                className="w-full h-11 px-4 rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.12)] transition-all"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="w-full h-11 px-4 rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.12)] transition-all"
              />
            </div>

            <div className="pt-2">
              <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-3">Como deseja usar a plataforma?</p>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative flex cursor-pointer rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 hover:bg-[hsl(var(--muted))] transition-colors has-[:checked]:border-[hsl(var(--primary))] has-[:checked]:bg-[hsl(var(--primary-muted))]">
                  <input type="radio" name="accountType" value="CLIENT" className="sr-only" defaultChecked />
                  <div>
                    <span className="block text-sm font-semibold text-[hsl(var(--foreground))]">Quero contratar</span>
                    <span className="block text-xs text-[hsl(var(--muted-foreground))] mt-1">Busco profissionais</span>
                  </div>
                </label>
                <label className="relative flex cursor-pointer rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 hover:bg-[hsl(var(--muted))] transition-colors has-[:checked]:border-[hsl(var(--primary))] has-[:checked]:bg-[hsl(var(--primary-muted))]">
                  <input type="radio" name="accountType" value="PROFESSIONAL" className="sr-only" />
                  <div>
                    <span className="block text-sm font-semibold text-[hsl(var(--foreground))]">Sou profissional</span>
                    <span className="block text-xs text-[hsl(var(--muted-foreground))] mt-1">Ofereço serviços</span>
                  </div>
                </label>
              </div>
            </div>

            <Button className="w-full mt-4" size="lg" type="submit" disabled={loading}>
              <Slottable>{loading ? 'Criando conta...' : 'Criar Conta'}</Slottable>
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-[hsl(var(--primary))] font-medium hover:underline">
              Fazer login
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[hsl(var(--muted-foreground)/0.6)]">
          Ao se cadastrar, você concorda com nossos Termos de Uso e Política de Privacidade.
        </p>
      </div>
    </div>
  );
}
