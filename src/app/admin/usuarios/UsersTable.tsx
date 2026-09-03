'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Ban, Search, Trash2, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { bulkBanUsers, bulkDeleteUsers, banUser, promoteToAdmin } from '@/app/actions/admin';

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
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const toggleAll = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map(u => u.id));
    }
  };

  const toggleUser = (id: string) => {
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const handleBulkBan = async () => {
    if (!confirm(`Tem certeza que deseja bloquear ${selectedUserIds.length} usuários?`)) return;
    setIsProcessing(true);
    await bulkBanUsers(selectedUserIds);
    setSelectedUserIds([]);
    setIsProcessing(false);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`ATENÇÃO: Deseja EXCLUIR DEFINITIVAMENTE ${selectedUserIds.length} usuários? Esta ação não pode ser desfeita.`)) return;
    setIsProcessing(true);
    await bulkDeleteUsers(selectedUserIds);
    setSelectedUserIds([]);
    setIsProcessing(false);
  };

  const handlePromote = async (id: string, name: string | null) => {
    if (!confirm(`Tem certeza que deseja promover ${name || 'este usuário'} a Administrador?`)) return;
    setIsProcessing(true);
    await promoteToAdmin(id);
    setIsProcessing(false);
  };

  const handleBan = async (id: string, name: string | null) => {
    if (!confirm(`Tem certeza que deseja banir/suspender ${name || 'este usuário'}?`)) return;
    setIsProcessing(true);
    await banUser(id);
    setIsProcessing(false);
  };

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

        {selectedUserIds.length > 0 && (
          <div className="mt-4 p-3 bg-[hsl(var(--primary-muted))] border border-[hsl(var(--primary)/0.2)] rounded-lg flex items-center justify-between">
            <span className="text-sm font-medium text-[hsl(var(--foreground))]">
              {selectedUserIds.length} usuário(s) selecionado(s)
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-orange-500 hover:text-orange-600 hover:bg-orange-50" onClick={handleBulkBan} disabled={isProcessing}>
                <Ban className="h-4 w-4 mr-2" /> Bloquear
              </Button>
              <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleBulkDelete} disabled={isProcessing}>
                <Trash2 className="h-4 w-4 mr-2" /> Excluir
              </Button>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[hsl(var(--muted-foreground))] uppercase bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))]">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg w-10">
                  <input
                    type="checkbox"
                    className="rounded border-[hsl(var(--border))] bg-transparent"
                    checked={selectedUserIds.length > 0 && selectedUserIds.length === filteredUsers.length}
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-6 py-3">Usuário</th>
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Telefone</th>
                <th className="px-6 py-3 rounded-tr-lg text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-[hsl(var(--muted-foreground))]">
                    Nenhum usuário encontrado para estes filtros.
                  </td>
                </tr>
              )}
              {filteredUsers.map((u) => (
                <tr key={u.id} className={`border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted)/0.3)] transition-colors ${selectedUserIds.includes(u.id) ? 'bg-[hsl(var(--primary-muted)/0.5)]' : ''}`}>
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-[hsl(var(--border))] bg-transparent"
                      checked={selectedUserIds.includes(u.id)}
                      onChange={() => toggleUser(u.id)}
                    />
                  </td>
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
                      {u.phone && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                          title="Conversar no WhatsApp"
                          asChild
                        >
                          <a
                            href={`https://wa.me/${u.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Olá ${u.name ? u.name.split(' ')[0] : ''}! Tudo bem? Sou da equipe do AcheiYou!`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {u.role !== 'ADMIN' && (
                        <Button
                          variant="outline"
                          size="sm"
                          title="Promover a Admin"
                          onClick={() => handlePromote(u.id, u.name)}
                          disabled={isProcessing}
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-500 hover:bg-red-500/10"
                        title="Banir Usuário"
                        onClick={() => handleBan(u.id, u.name)}
                        disabled={isProcessing}
                      >
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
