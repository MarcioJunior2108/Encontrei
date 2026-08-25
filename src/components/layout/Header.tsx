'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sun, Moon, Bell, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { createClient } from '@/lib/supabase/client';

const navLinks = [
  { href: '/buscar', label: 'Explorar' },
  { href: '/como-funciona', label: 'Como funciona' },
  { href: '/profissional', label: 'Para profissionais' },
];

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('id, name, avatar_url, role')
          .eq('id', session.user.id)
          .single();
        setProfile(data);
      }
    });

    // Listen for auth state changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('id, name, avatar_url, role')
          .eq('id', session.user.id)
          .single();
        setProfile(data);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isDark = mounted && resolvedTheme === 'dark';
  const isHome = pathname === '/';

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled || !isHome
            ? 'glass-strong border-b border-[hsl(var(--border)/0.5)]'
            : 'bg-transparent'
        )}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-[hsl(var(--foreground))] hover:opacity-80 transition-opacity"
              aria-label="Encontrei — Página inicial"
            >
              <>
                <Image 
                  src="/logo.png" 
                  alt="Encontrei Logo" 
                  width={140} 
                  height={40} 
                  style={{ width: 'auto', height: '40px' }}
                  className="object-contain ml-2 dark:hidden"
                  priority
                />
                <Image 
                  src="/logo-dark.png" 
                  alt="Encontrei Logo" 
                  width={140} 
                  height={40} 
                  style={{ width: 'auto', height: '40px' }}
                  className="object-contain ml-2 hidden dark:block"
                  priority
                />
              </>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
              {navLinks.map(({ href, label }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'px-3 py-2 rounded-[var(--radius-lg)] text-sm font-medium transition-all duration-150',
                      active
                        ? 'bg-[hsl(var(--primary-muted))] text-[hsl(var(--primary))]'
                        : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  className="h-9 w-9 rounded-[var(--radius-lg)] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-all duration-150"
                  aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
                  title={isDark ? 'Modo claro' : 'Modo escuro'}
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
              )}

              {/* Notifications placeholder */}
              <Link
                href="/dashboard/notificacoes"
                className="hidden sm:flex h-9 w-9 rounded-[var(--radius-lg)] items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-all duration-150 relative"
                aria-label="Notificações"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[hsl(var(--primary))]" aria-label="3 notificações não lidas" />
              </Link>

              {/* Auth CTAs / User Profile */}
              <div className="hidden sm:flex items-center gap-2">
                {profile ? (
                  <div className="flex items-center gap-3">
                    <Link href={profile.role === 'PROFESSIONAL' ? '/profissional' : '/dashboard'} className="flex items-center gap-2 hover:bg-[hsl(var(--muted))] p-1 pr-3 rounded-full transition-colors">
                      <Avatar 
                        src={profile.avatar_url} 
                        name={profile.name || 'Usuário'} 
                        size="sm" 
                      />
                      <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                        {profile.name?.split(' ')[0] || 'Painel'}
                      </span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="text-[hsl(var(--muted-foreground))] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      {loggingOut ? 'Saindo...' : 'Sair'}
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/login">Entrar</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/cadastro">Começar</Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(o => !o)}
                className="md:hidden h-9 w-9 rounded-[var(--radius-lg)] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-all"
                aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-x-0 top-16 z-40 glass-strong border-b border-[hsl(var(--border)/0.5)] md:hidden"
        >
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-3 rounded-[var(--radius-lg)] text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
              >
                {label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-[hsl(var(--border))] flex gap-2">
              {profile ? (
                <>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href="/dashboard">Meu Painel</Link>
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    {loggingOut ? 'Saindo...' : 'Sair'}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href="/login">Entrar</Link>
                  </Button>
                  <Button className="flex-1" asChild>
                    <Link href="/cadastro">Começar grátis</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </motion.div>
      )}

      {/* Spacer */}
      {!isHome && <div className="h-16" />}
    </>
  );
}
