'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, UserCheck, UserX, Eye, MoreHorizontal, Filter } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_USERS } from '@/mock/data';
import { formatRelativeTime, getStatusLabel, getStatusColor, cn } from '@/lib/utils';
import type { UserStatus } from '@/types';

const PAGE_SIZE = 15;

export function AdminUsersTable() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    return MOCK_USERS.filter(u => {
      const matchSearch =
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const statuses: Array<UserStatus | 'ALL'> = ['ALL', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'];
  const statusVariantMap: Record<string, 'success' | 'error' | 'warning' | 'secondary' | 'info'> = {
    ACTIVE: 'success', INACTIVE: 'secondary', SUSPENDED: 'error', PENDING: 'warning',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] tracking-tight">Usuários</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
          {MOCK_USERS.length} usuários cadastrados
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" aria-hidden="true" />
              <input
                type="text"
                placeholder="Buscar por nome ou e-mail..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(0); }}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] outline-none focus:border-[hsl(var(--primary))] transition-colors"
                aria-label="Buscar usuários"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[hsl(var(--muted-foreground))]" aria-hidden="true" />
              {statuses.map(s => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setPage(0); }}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-full border font-medium transition-all whitespace-nowrap',
                    statusFilter === s
                      ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary-muted))] text-[hsl(var(--primary))]'
                      : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary)/0.3)]'
                  )}
                  aria-pressed={statusFilter === s}
                >
                  {s === 'ALL' ? 'Todos' : getStatusLabel(s)}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Tabela de usuários">
              <thead>
                <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)]">
                  {['Usuário', 'E-mail', 'Tipo', 'Status', 'Cadastrado', 'Última atividade', ''].map(col => (
                    <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted)/0.3)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={user.avatar} name={user.name} size="sm" />
                        <span className="font-medium text-[hsl(var(--foreground))] whitespace-nowrap">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[hsl(var(--muted-foreground))] text-xs truncate max-w-[180px]">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={user.role === 'PROFESSIONAL' ? 'primary' : 'secondary'} className="text-[10px]">
                        {getStatusLabel(user.role)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariantMap[user.status] ?? 'secondary'} className="text-[10px]">
                        {getStatusLabel(user.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-[hsl(var(--muted-foreground))] whitespace-nowrap">
                      {formatRelativeTime(user.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-xs text-[hsl(var(--muted-foreground))] whitespace-nowrap">
                      {user.lastActiveAt ? formatRelativeTime(user.lastActiveAt) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          className="h-7 w-7 rounded flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors"
                          aria-label={`Ver detalhes de ${user.name}`}
                        >
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        {user.status === 'ACTIVE' ? (
                          <button
                            className="h-7 w-7 rounded flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--error-muted))] hover:text-[hsl(var(--error))] transition-colors"
                            aria-label={`Suspender ${user.name}`}
                          >
                            <UserX className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        ) : (
                          <button
                            className="h-7 w-7 rounded flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--success-muted))] hover:text-[hsl(var(--success))] transition-colors"
                            aria-label={`Reativar ${user.name}`}
                          >
                            <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        )}
                        <button
                          className="h-7 w-7 rounded flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
                          aria-label={`Mais ações para ${user.name}`}
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-[hsl(var(--border))]">
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              {filtered.length} resultados · Página {page + 1} de {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="xs"
                onClick={() => setPage(p => p - 1)}
                disabled={page === 0}
                aria-label="Página anterior"
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="xs"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages - 1}
                aria-label="Próxima página"
              >
                Próxima
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
