'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_REQUESTS } from '@/mock/data';
import { formatRelativeTime } from '@/lib/utils';

export function AgendaView() {
  const activeRequests = MOCK_REQUESTS.filter(r => ['ACCEPTED', 'IN_PROGRESS'].includes(r.status)).slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Agenda da Semana</h2>
        <Button variant="outline" size="sm">Configurar Horários</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeRequests.map((req, i) => (
          <Card key={req.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${i === 0 ? 'bg-[hsl(var(--primary-muted))] text-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'}`}>
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">{req.title}</h3>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">Cliente: {req.user.name}</p>
                  </div>
                </div>
                <Badge variant={req.status === 'IN_PROGRESS' ? 'warning' : 'primary'} className="text-[10px]">
                  {req.status === 'IN_PROGRESS' ? 'Em andamento' : 'Agendado'}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))] border-t border-[hsl(var(--border))] pt-4">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Hoje, 14:00 - 16:00
                </span>
                <span className="flex items-center gap-1.5 text-[hsl(var(--primary))] font-medium cursor-pointer hover:underline">
                  Ver detalhes
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
        {activeRequests.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-[hsl(var(--border))] rounded-[var(--radius-xl)]">
            <Calendar className="h-8 w-8 text-[hsl(var(--muted-foreground)/0.5)] mx-auto mb-3" />
            <p className="text-sm font-medium text-[hsl(var(--foreground))]">Sua agenda está livre</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Aguarde novas solicitações ou ative disponibilidade instantânea.</p>
          </div>
        )}
      </div>
    </div>
  );
}
