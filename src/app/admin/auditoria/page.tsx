'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCog, Settings, Key, Trash2 } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const logs = [
    { id: 'log-1', admin: 'marcio@admin.com', action: 'UPDATE_SYSTEM_FEE', details: 'Alterou taxa de 10% para 12%', icon: Settings, time: 'Hoje, 14:32' },
    { id: 'log-2', admin: 'joao@admin.com', action: 'SUSPEND_USER', details: 'Suspendeu user-42 (FRAUD)', icon: UserCog, time: 'Ontem, 09:15' },
    { id: 'log-3', admin: 'marcio@admin.com', action: 'RESET_PASSWORD', details: 'Forçou reset de senha para user-15', icon: Key, time: '10/08/2026, 16:40' },
    { id: 'log-4', admin: 'sistema', action: 'DELETE_CATEGORY', details: 'Removeu categoria "Outros"', icon: Trash2, time: '05/08/2026, 02:00' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Logs de Auditoria</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Rastreamento de ações administrativas no sistema.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[hsl(var(--muted)/0.5)] text-[hsl(var(--muted-foreground))] uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Ação</th>
                  <th className="px-6 py-4 font-medium">Admin</th>
                  <th className="px-6 py-4 font-medium">Detalhes</th>
                  <th className="px-6 py-4 font-medium">Data/Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--border))]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[hsl(var(--muted)/0.5)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-[hsl(var(--background))] border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))]">
                          <log.icon className="h-4 w-4" />
                        </div>
                        <Badge variant="outline" className="font-mono text-[10px]">{log.action}</Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[hsl(var(--foreground))] font-medium">{log.admin}</td>
                    <td className="px-6 py-4 text-[hsl(var(--muted-foreground))]">{log.details}</td>
                    <td className="px-6 py-4 text-[hsl(var(--muted-foreground))] whitespace-nowrap">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
