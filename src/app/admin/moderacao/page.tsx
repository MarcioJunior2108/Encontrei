'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, CheckCircle2, Ban, Eye } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { MOCK_USERS } from '@/mock/data';

export default function AdminModerationPage() {
  const [reports] = useState([
    { id: 'rep-1', targetUser: MOCK_USERS[10], type: 'SPAM', status: 'PENDING', desc: 'Mensagens repetitivas oferecendo serviços fora da plataforma.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    { id: 'rep-2', targetUser: MOCK_USERS[15], type: 'FRAUD', status: 'PENDING', desc: 'Perfil falso solicitando pagamentos adiantados.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
    { id: 'rep-3', targetUser: MOCK_USERS[42], type: 'HARASSMENT', status: 'RESOLVED', desc: 'Comportamento inadequado no chat.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Moderação</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Gerencie denúncias e segurança da plataforma.</p>
      </div>

      <div className="grid gap-4">
        {reports.map(report => (
          <Card key={report.id} className={report.status === 'RESOLVED' ? 'opacity-70' : ''}>
            <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
              <div className="flex gap-4 items-start">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${report.status === 'PENDING' ? 'bg-[hsl(var(--error)/0.1)] text-[hsl(var(--error))]' : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'}`}>
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-[hsl(var(--foreground))]">{report.targetUser.name}</span>
                    <Badge variant={report.status === 'PENDING' ? 'error' : 'secondary'} className="text-[10px]">
                      {report.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">{report.desc}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground)/0.7)]">Reportado há {formatRelativeTime(report.createdAt)}</p>
                </div>
              </div>
              
              <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                {report.status === 'PENDING' ? (
                  <>
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                      <Ban className="h-4 w-4 mr-1.5" /> Suspender
                    </Button>
                    <Button variant="default" size="sm" className="flex-1 sm:flex-none">
                      <CheckCircle2 className="h-4 w-4 mr-1.5" /> Ignorar
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" disabled>Resolvido</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
