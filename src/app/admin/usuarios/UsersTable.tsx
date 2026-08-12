'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Ban, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  status: string;
  phone: string | null;
}

export function UsersTable({ initialUsers }: { initialUsers: User[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [phoneTerm, setPhoneTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredUsers = initialUsers.filter((u) => {
    // Busca por Nome ou Email
    const searchMatch = !searchTerm || 
      (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) || 
      (u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    // Busca por Telefone
    const phoneMatch = !phoneTerm || 
      (u.phone?.includes(phoneTerm) || false);
      
    // Filtro por Status
    const statusMatch = statusFilter === 'ALL' || u.status === statusFilter;

    return searchMatch && phoneMatch && statusMatch;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>Todos os Usuários ({filteredUsers.length})</CardTitle>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              <Input
                placeholder="Buscar nome ou email..."
                className="pl-8 w-full md:w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              <Input
                placeholder="Buscar telefone..."
                className="pl-8 w-full md:w-[150px]"
                value={phoneTerm}
                onChange={(e) => setPhoneTerm(e.target.value)}
              />
            </div>

            <select
              className="flex h-10 items-center justify-between rounded-md border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-sm ring-offset-[hsl(var(--background))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-2 w-full md:w-[150px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL" className="text-black">Todos os Status</option>
              <option value="ACTIVE" className="text-black">ACTIVE</option>
              <option value="UNCLAIMED" className="text-black">UNCLAIMED</option>
              <option value="INACTIVE" className="text-black">INACTIVE</option>
              <option value="BANNED" className="text-black">BANNED</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[hsl(var(--muted-foreground))] uppercase bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))]">
              <tr>
                <th className="px-6 py-3 rounded-tl-lg">Usuário</th>
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Telefone</th>
                <th className="px-6 py-3 rounded-tr-lg text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-[hsl(var(--muted-foreground))]">
                    Nenhum usuário encontrado para estes filtros.
                  </td>
                </tr>
              )}
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted)/0.3)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-[hsl(var(--foreground))]">{u.name}</div>
                    <div className="text-[hsl(var(--muted-foreground))]">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={u.role === 'ADMIN' ? 'primary' : u.role === 'PROFESSIONAL' ? 'success' : 'secondary'}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={u.status === 'ACTIVE' ? 'success' : 'error'}>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-[hsl(var(--muted-foreground))]">
                    {u.phone || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {u.role !== 'ADMIN' && (
                        <Button variant="outline" size="sm" title="Promover a Admin">
                          <Shield className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-500 hover:bg-red-500/10" title="Banir Usuário">
                        <Ban className="h-4 w-4" />
                      </Button>
                    </div>
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
