'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { login } from '@/app/actions/auth';
import { AlertCircle } from 'lucide-react';
import { Slottable } from '@radix-ui/react-slot';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[hsl(var(--background))] px-4">
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
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-1">Bem-vindo de volta</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-8">Entre para continuar na plataforma</p>

          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Formulário de login">
            {error && (
              <div className="p-3 text-sm rounded-lg bg-[hsl(var(--error)/0.1)] text-[hsl(var(--error))] border border-[hsl(var(--error)/0.2)] flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            
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
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-[hsl(var(--foreground))]">
                  Senha
                </label>
                <Link href="/recuperar-acesso" className="text-xs text-[hsl(var(--primary))] hover:underline">
                  Esqueci minha senha
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full h-11 px-4 rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.12)] transition-all"
              />
            </div>
            <Button className="w-full" size="lg" type="submit" disabled={loading}>
              <Slottable>{loading ? 'Entrando...' : 'Continuar'}</Slottable>
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
            Não tem conta?{' '}
            <Link href="/cadastro" className="text-[hsl(var(--primary))] font-medium hover:underline">
              Criar conta grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
