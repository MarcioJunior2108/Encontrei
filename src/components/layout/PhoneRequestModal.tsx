'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Phone, AlertCircle } from 'lucide-react';
import { updateUserPhone } from '@/app/actions/user';

interface PhoneRequestModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export function PhoneRequestModal({ isOpen, onSuccess }: PhoneRequestModalProps) {
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validação super básica para garantir no mínimo 10-11 dígitos (DDD + número)
    const justNumbers = phone.replace(/\D/g, '');
    if (justNumbers.length < 10) {
      setError('Por favor, insira um número válido com DDD.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await updateUserPhone(phone);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || 'Ocorreu um erro ao salvar o telefone.');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Máscara (XX) XXXXX-XXXX
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
      value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    }
    
    setPhone(value);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Overlay - Sem onClick para forçar interação */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[hsl(var(--background))] rounded-[var(--radius-xl)] shadow-2xl border border-[hsl(var(--border))] overflow-hidden flex flex-col p-6 text-center"
        >
          <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
            <Phone className="h-8 w-8 text-blue-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-2">
            Falta pouco!
          </h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
            Precisamos do seu número de WhatsApp para concluir o seu cadastro. É através dele que conectamos clientes e profissionais.
          </p>

          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-left">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-left">
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Seu WhatsApp (com DDD)
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={15}
                className="w-full px-4 py-3 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-all"
                autoFocus
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full py-6 text-lg font-bold"
              disabled={isSubmitting || phone.length < 14}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar e Continuar'}
            </Button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
