'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { login, loginWithGoogle } from '@/app/actions/auth';
import { AlertCircle } from 'lucide-react';
import { Slottable } from '@radix-ui/react-slot';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function NextUrlInput() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next');
  if (!next) return null;
  return <input type="hidden" name="next" value={next} />;
}

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
          <>
            <Image 
              src="/logo.png" 
              alt="AcheiYou Logo" 
              width={200} 
              height={80} 
              className="h-16 w-auto object-contain scale-[1.3] dark:hidden"
              priority
            />
            <Image 
              src="/logo-dark.png" 
              alt="AcheiYou Logo" 
              width={200} 
              height={80} 
              className="h-16 w-auto object-contain scale-[1.3] hidden dark:block"
              priority
            />
          </>
        </Link>

        {/* Card */}
        <div className="rounded-[var(--radius-2xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-[var(--shadow-lg)]">
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-1">Bem-vindo de volta</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-8">Entre para continuar na plataforma</p>

          <form action={loginWithGoogle} className="mb-4">
            <Suspense fallback={null}>
              <NextUrlInput />
            </Suspense>
            <Button variant="outline" type="submit" className="w-full bg-[hsl(var(--background))] hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] border-[hsl(var(--border))] h-11">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Entrar com Google
            </Button>
          </form>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[hsl(var(--border))]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[hsl(var(--card))] px-2 text-[hsl(var(--muted-foreground))]">Ou continue com e-mail</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Formulário de login">
            <Suspense fallback={null}>
              <NextUrlInput />
            </Suspense>
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
