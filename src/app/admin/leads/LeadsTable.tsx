'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Calendar } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export function LeadsTable({ initialRequests }: { initialRequests: any[] }) {
  const [filter, setFilter] = useState('ALL');

  const filteredRequests = initialRequests.filter(req => {
    if (filter === 'ALL') return true;
    if (filter === 'UNCLAIMED') return req.professional.profile.status === 'UNCLAIMED';
    return true;
  });

  const generateWhatsappLink = (req: any) => {
    const phone = req.professional.profile.phone;
    const clientName = req.client.name || 'Um cliente';
    const professionalName = req.professional.profile.name || 'Profissional';
    const isUnclaimed = req.professional.profile.status === 'UNCLAIMED';
    
    let message = `*Encontrei - Novo Orçamento!*\n\nOlá ${professionalName}! Sou da plataforma Encontrei. Temos um cliente (${clientName}) precisando de um serviço seu agora mesmo!\n\n`;

    if (isUnclaimed) {
      const claimToken = req.professional.profile.claimToken;
      const magicLink = `${window.location.origin}/claim?token=${claimToken}`;
      message += `Para visualizar os detalhes do pedido e responder ao cliente, você precisa ativar o seu perfil gratuito.\n\n*Clique no link abaixo para assumir seu perfil e ver o pedido:*\n${magicLink}\n\nEstamos aguardando você! 🚀`;
    } else {
      const loginLink = `${window.location.origin}/login`;
      message += `Para visualizar os detalhes do pedido e responder ao cliente, acesse agora mesmo o seu painel em nosso site.\n\n*Clique no link abaixo para fazer login e ver o pedido:*\n${loginLink}\n\nEstamos aguardando você! 🚀`;
    }

    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    return `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Leads ({filteredRequests.length})</CardTitle>
          <select
            className="h-9 rounded-md border border-[hsl(var(--input))] bg-transparent px-3 py-1 text-sm ring-offset-[hsl(var(--background))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] w-[200px]"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="UNCLAIMED" className="text-black">Pendentes (Não Reivindicados)</option>
            <option value="ALL" className="text-black">Todos os Pedidos</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[hsl(var(--muted-foreground))] uppercase bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))]">
              <tr>
                <th className="px-6 py-3 rounded-tl-lg">Data</th>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Profissional / Status</th>
                <th className="px-6 py-3">Serviço Desejado</th>
                <th className="px-6 py-3 rounded-tr-lg text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-[hsl(var(--muted-foreground))]">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              )}
              {filteredRequests.map((req) => (
                <tr key={req.id} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted)/0.3)] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-[hsl(var(--muted-foreground))]">
                    {formatRelativeTime(req.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-[hsl(var(--foreground))]">{req.client.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{req.professional.profile.name}</div>
                    <Badge variant={req.professional.profile.status === 'UNCLAIMED' ? 'warning' : 'success'} className="mt-1">
                      {req.professional.profile.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate" title={req.description}>
                    {req.description}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {req.professional.profile.phone ? (
                      <Button asChild size="sm" className="bg-[#25D366] hover:bg-[#128C7E] text-white">
                        <a href={generateWhatsappLink(req)} target="_blank" rel="noopener noreferrer">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Avisar no WhatsApp
                        </a>
                      </Button>
                    ) : (
                      <Badge variant="outline">
                        Sem Telefone
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
