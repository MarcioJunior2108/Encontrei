'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export function DashboardRequests({ 
  requests, 
  profileId
}: { 
  requests: any[], 
  profileId: string
}) {

  const statusColors: Record<string, 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary'> = {
    COMPLETED: 'success', PENDING: 'warning', REJECTED: 'error',
    ACCEPTED: 'primary', CANCELLED: 'secondary',
  };

  return (
    <div className="divide-y divide-[hsl(var(--border))]">
      {requests.map(req => (
        <div key={req.id} className="flex flex-col">
          <div className="flex items-center gap-4 px-6 py-4 hover:bg-[hsl(var(--muted)/0.3)] transition-colors">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate">Para: {req.professional?.profile?.name}</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 truncate">{req.description}</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{new Date(req.createdAt).toLocaleDateString()}</p>
            </div>
            
            <div className="flex flex-col gap-2 items-end">
              <Badge variant={statusColors[req.status] ?? 'secondary'} className="text-[10px] flex-shrink-0">
                {req.status === 'PENDING' ? 'Aguardando' : req.status === 'ACCEPTED' ? 'Aceito' : req.status === 'REJECTED' ? 'Recusado' : req.status}
              </Badge>

              {req.status === 'ACCEPTED' && (
                <Button 
                  size="sm" 
                  variant="default"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-chat', { detail: { requestId: req.id } }))}
                  className="text-xs h-8 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white"
                >
                  <MessageSquare className="h-3 w-3 mr-1.5" />
                  Abrir Chat Interno
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
