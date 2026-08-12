'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, UserCheck, FileText, CreditCard,
  BarChart3, Shield, Bell, Settings, ClipboardList,
  Activity, Flag, ChevronLeft, Moon, Sun, LogOut,
  Search, Command, AlertTriangle
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { AdminCommandPalette } from '@/components/admin/AdminCommandPalette';

const navItems = [
  { href: '/admin', label: 'Visão Geral', icon: LayoutDashboard, exact: true },
  { href: '/admin/usuarios', label: 'Usuários', icon: Users },
  { href: '/admin/profissionais', label: 'Profissionais', icon: UserCheck },
  { href: '/admin/solicitacoes', label: 'Solicitações', icon: FileText },
  { href: '/admin/transacoes', label: 'Transações', icon: CreditCard },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/moderacao', label: 'Moderação', icon: Flag, badge: 3 },
  { href: '/admin/notificacoes', label: 'Notificações', icon: Bell, badge: 12 },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: ClipboardList },
  { href: '/admin/relatorios', label: 'Relatórios', icon: Activity },
  { href: '/admin/seguranca', label: 'Segurança', icon: Shield },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Keyboard shortcut for command palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(c => !c);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <div className="flex min-h-screen bg-[hsl(var(--background))]">
      {/* Sidebar */}
      <motion.aside
        className={cn(
          'flex-shrink-0 flex flex-col border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar))] transition-all duration-300 fixed inset-y-0 left-0 z-40',
          collapsed ? 'w-16' : 'w-[260px]'
        )}
        animate={{ width: collapsed ? 64 : 260 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-[hsl(var(--sidebar-border))] flex-shrink-0">
          <Link href="/admin" className="flex items-center gap-2.5 min-w-0">
            <>
              <Image 
                src="/logo.png" 
                alt="Encontrei Logo" 
                width={160} 
                height={60} 
                className="h-12 w-auto flex-shrink-0 object-contain scale-[1.3] origin-left ml-2 dark:hidden"
                priority
              />
              <Image 
                src="/logo-dark.png" 
                alt="Encontrei Logo" 
                width={160} 
                height={60} 
                className="h-12 w-auto flex-shrink-0 object-contain scale-[1.3] origin-left ml-2 hidden dark:block"
                priority
              />
            </>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <span className="font-semibold text-[hsl(var(--sidebar-foreground))] whitespace-nowrap">Admin Console</span>
                  <span className="ml-2 text-[10px] font-semibold text-[hsl(var(--primary))] bg-[hsl(var(--primary-muted))] px-1.5 py-0.5 rounded-full">DEMO</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
          <button
            onClick={() => setCollapsed(c => !c)}
            className="ml-auto h-7 w-7 rounded-[var(--radius-md)] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))] transition-all flex-shrink-0"
            aria-label={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform duration-300', collapsed && 'rotate-180')} aria-hidden="true" />
          </button>
        </div>

        {/* Search / Command palette */}
        {!collapsed && (
          <div className="px-3 pt-3">
            <button
              onClick={() => setCommandOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-[var(--radius-lg)] border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--background)/0.5)] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary)/0.3)] hover:text-[hsl(var(--foreground))] transition-all text-xs"
              aria-label="Abrir paleta de comandos"
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="flex-1 text-left">Buscar...</span>
              <kbd className="flex items-center gap-0.5 text-[10px] bg-[hsl(var(--muted))] px-1.5 py-0.5 rounded">
                <Command className="h-2.5 w-2.5" aria-hidden="true" />K
              </kbd>
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto no-scrollbar" aria-label="Navegação administrativa">
          {navItems.map(({ href, label, icon: Icon, exact, badge }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-lg)] text-sm font-medium transition-all duration-150 relative group',
                  active
                    ? 'bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))]'
                    : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--sidebar-accent)/0.5)] hover:text-[hsl(var(--sidebar-foreground))]'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {badge && !collapsed && (
                  <span className="ml-auto h-5 min-w-5 rounded-full bg-[hsl(var(--error))] text-white text-[10px] font-bold flex items-center justify-center px-1">
                    {badge}
                  </span>
                )}
                {badge && collapsed && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[hsl(var(--error))]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-[hsl(var(--sidebar-border))] space-y-1">
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-lg)] text-sm text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--sidebar-accent)/0.5)] hover:text-[hsl(var(--sidebar-foreground))] transition-all"
              aria-label={isDark ? 'Modo claro' : 'Modo escuro'}
            >
              {isDark ? <Sun className="h-4 w-4 flex-shrink-0" aria-hidden="true" /> : <Moon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />}
              {!collapsed && <span>{isDark ? 'Modo claro' : 'Modo escuro'}</span>}
            </button>
          )}
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-lg)] text-sm text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--sidebar-accent)/0.5)] hover:text-[hsl(var(--sidebar-foreground))] transition-all"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            {!collapsed && <span>Sair</span>}
          </Link>
        </div>
      </motion.aside>

      {/* Main content */}
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 transition-all duration-300',
          collapsed ? 'ml-16' : 'ml-[260px]'
        )}
      >
        {/* Top bar */}
        <header className="h-16 flex items-center gap-4 px-6 border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/0.95)] backdrop-blur-sm sticky top-0 z-30">
          <div className="flex-1 min-w-0">
            <BreadcrumbNav pathname={pathname} />
          </div>
          <div className="flex items-center gap-3">
            {/* Demo badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(var(--warning-muted))] border border-[hsl(var(--warning)/0.2)]">
              <AlertTriangle className="h-3 w-3 text-[hsl(var(--warning))]" aria-hidden="true" />
              <span className="text-[10px] font-semibold text-[hsl(var(--warning))]">DEMO — Dados mockados</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto" id="admin-main">
          {children}
        </main>
      </div>

      {/* Command palette */}
      <AdminCommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  );
}

function BreadcrumbNav({ pathname }: { pathname: string }) {
  const parts = pathname.split('/').filter(Boolean);
  const labels: Record<string, string> = {
    admin: 'Admin', usuarios: 'Usuários', profissionais: 'Profissionais',
    solicitacoes: 'Solicitações', transacoes: 'Transações', analytics: 'Analytics',
    moderacao: 'Moderação', notificacoes: 'Notificações', 'audit-logs': 'Audit Logs',
    relatorios: 'Relatórios', seguranca: 'Segurança', configuracoes: 'Configurações',
  };

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-sm">
        {parts.map((part, i) => (
          <li key={part} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-[hsl(var(--muted-foreground))]">/</span>}
            <span className={cn(
              i === parts.length - 1
                ? 'font-semibold text-[hsl(var(--foreground))]'
                : 'text-[hsl(var(--muted-foreground))]'
            )}>
              {labels[part] ?? part}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
