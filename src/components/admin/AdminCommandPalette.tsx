'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserCheck, FileText, CreditCard, BarChart3,
  Flag, Settings, Activity, Search, ArrowRight, X
} from 'lucide-react';

const commands = [
  { id: 'users', label: 'Usuários', description: 'Gerenciar usuários da plataforma', icon: Users, href: '/admin/usuarios' },
  { id: 'professionals', label: 'Profissionais', description: 'Gerenciar profissionais cadastrados', icon: UserCheck, href: '/admin/profissionais' },
  { id: 'requests', label: 'Solicitações', description: 'Ver todas as solicitações', icon: FileText, href: '/admin/solicitacoes' },
  { id: 'transactions', label: 'Transações', description: 'Ver histórico de transações', icon: CreditCard, href: '/admin/transacoes' },
  { id: 'analytics', label: 'Analytics', description: 'Dashboard de métricas', icon: BarChart3, href: '/admin/analytics' },
  { id: 'moderation', label: 'Moderação', description: 'Denúncias e conteúdo', icon: Flag, href: '/admin/moderacao' },
  { id: 'reports', label: 'Relatórios', description: 'Gerar relatórios', icon: Activity, href: '/admin/relatorios' },
  { id: 'settings', label: 'Configurações', description: 'Configurações do sistema', icon: Settings, href: '/admin/configuracoes' },
];

interface AdminCommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function AdminCommandPalette({ open, onClose }: AdminCommandPaletteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSelect = useCallback((href: string) => {
    router.push(href);
    onClose();
  }, [router, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-[hsl(var(--foreground)/0.4)] backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-full max-w-lg"
            role="dialog"
            aria-modal="true"
            aria-label="Paleta de comandos"
          >
            <div className="rounded-[var(--radius-2xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[var(--shadow-xl)] overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[hsl(var(--border))]">
                <Search className="h-4 w-4 text-[hsl(var(--muted-foreground))] flex-shrink-0" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar ação..."
                  className="flex-1 bg-transparent text-sm text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] outline-none"
                  aria-label="Buscar comandos"
                />
                <button
                  onClick={onClose}
                  className="h-6 w-6 rounded flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                  aria-label="Fechar paleta"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>

              {/* Commands */}
              <div className="py-2 max-h-80 overflow-y-auto" role="listbox" aria-label="Comandos disponíveis">
                <p className="px-4 py-1.5 text-[10px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                  Navegação
                </p>
                {commands.map(cmd => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => handleSelect(cmd.href)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[hsl(var(--muted))] transition-colors text-left group"
                      role="option"
                      aria-label={cmd.label}
                    >
                      <div className="h-8 w-8 rounded-[var(--radius-md)] bg-[hsl(var(--muted))] flex items-center justify-center flex-shrink-0 group-hover:bg-[hsl(var(--primary-muted))] transition-colors">
                        <Icon className="h-4 w-4 text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--primary))] transition-colors" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[hsl(var(--foreground))]">{cmd.label}</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{cmd.description}</p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))] opacity-0 group-hover:opacity-100 transition-all" aria-hidden="true" />
                    </button>
                  );
                })}
              </div>

              <div className="px-4 py-2.5 border-t border-[hsl(var(--border))] flex items-center gap-4 text-[10px] text-[hsl(var(--muted-foreground))]">
                <span><kbd className="bg-[hsl(var(--muted))] px-1.5 py-0.5 rounded">↵</kbd> selecionar</span>
                <span><kbd className="bg-[hsl(var(--muted))] px-1.5 py-0.5 rounded">Esc</kbd> fechar</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
