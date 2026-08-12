'use client';

import { useState } from 'react';
import { createServiceRequest } from '@/app/actions/requests';
import { Button } from '@/components/ui/button';

interface RequestServiceModalProps {
  professionalId: string;
  professionalName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function RequestServiceModal({ professionalId, professionalName, isOpen, onClose }: RequestServiceModalProps) {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const res = await createServiceRequest({ professionalId, description, date });
    if (res.error) {
      setError(res.error);
      setIsSubmitting(false);
    } else {
      setSuccess(true);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[hsl(var(--background))] rounded-[var(--radius-xl)] shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-[hsl(var(--border))] flex justify-between items-center bg-[hsl(var(--card))]">
          <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">
            Solicitar Orçamento
          </h2>
          <button onClick={onClose} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[hsl(var(--success-muted))] rounded-full flex items-center justify-center mx-auto mb-4 text-[hsl(var(--success))] text-3xl">
                ✓
              </div>
              <h3 className="text-xl font-bold text-[hsl(var(--foreground))] mb-2">Pedido Enviado!</h3>
              <p className="text-[hsl(var(--muted-foreground))] mb-6">
                Sua solicitação foi enviada para <strong>{professionalName}</strong>. Você será notificado quando ele responder.
              </p>
              <Button onClick={onClose} className="w-full">Voltar para o Perfil</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 text-red-500 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">O que você precisa?</label>
                <textarea
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Descreva o serviço com o máximo de detalhes..."
                  className="w-full min-h-[120px] rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm outline-none focus:border-[hsl(var(--primary))] resize-y"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Data desejada (Opcional)</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm outline-none focus:border-[hsl(var(--primary))]"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Enviar Pedido'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
