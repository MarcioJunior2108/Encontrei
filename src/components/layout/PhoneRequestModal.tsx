'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Phone, AlertCircle, Briefcase, FileText } from 'lucide-react';
import { completeMiniOnboarding } from '@/app/actions/user';

interface PhoneRequestModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  isProfessional?: boolean;
  initialPhone?: string;
  initialHeadline?: string;
}

export function PhoneRequestModal({ isOpen, onSuccess, isProfessional, initialPhone, initialHeadline }: PhoneRequestModalProps) {
  const [phone, setPhone] = useState(initialPhone || '');
  const [headline, setHeadline] = useState(initialHeadline || '');
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPhone) setPhone(initialPhone);
    if (initialHeadline) setHeadline(initialHeadline);
  }, [initialPhone, initialHeadline]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const justNumbers = phone.replace(/\D/g, '');
    if (!initialPhone && justNumbers.length < 10) {
      setError('Por favor, insira um número válido com DDD.');
      return;
    }

    if (isProfessional && !headline.trim()) {
      setError('Por favor, informe a sua profissão/serviço.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('phone', phone);
      if (isProfessional) {
        formData.append('headline', headline);
        formData.append('bio', bio);
      }

      const res = await completeMiniOnboarding(formData);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || 'Ocorreu um erro ao salvar os dados.');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[hsl(var(--background))] rounded-[var(--radius-xl)] shadow-2xl border border-[hsl(var(--border))] overflow-y-auto max-h-[90vh] flex flex-col p-6 text-center"
        >
          <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 shrink-0">
            {isProfessional && initialPhone && !initialHeadline ? (
               <Briefcase className="h-8 w-8 text-blue-500" />
            ) : (
               <Phone className="h-8 w-8 text-blue-500" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-2 shrink-0">
            Falta pouco!
          </h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6 shrink-0">
            {isProfessional
              ? 'Conclua as informações abaixo para que os clientes encontrem o seu perfil.'
              : 'Precisamos do seu número de WhatsApp para concluir o seu cadastro.'}
          </p>

          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-left shrink-0">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 shrink-0">
            {!initialPhone && (
              <div className="text-left">
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Seu WhatsApp (com DDD)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={15}
                    className="w-full pl-10 pr-4 py-3 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-all"
                    autoFocus={!initialPhone}
                    required={!initialPhone}
                  />
                </div>
              </div>
            )}

            {isProfessional && (!initialHeadline) && (
              <div className="text-left space-y-4">
                <div>
                  <label htmlFor="headline" className="block text-sm font-medium mb-1">
                    Sua profissão ou serviço principal
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                    <input
                      id="headline"
                      type="text"
                      placeholder="Ex: Eletricista, Encanador, Pedreiro..."
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-all"
                      autoFocus={!!initialPhone}
                      required
                    />
                  </div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    Isso é o que vai aparecer em destaque nas buscas.
                  </p>
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium mb-1">
                    Descrição (opcional)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                    <textarea
                      id="bio"
                      placeholder="Fale um pouco sobre o seu trabalho..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full py-6 text-lg font-bold mt-4"
              disabled={isSubmitting || (!initialPhone && phone.length < 14) || (isProfessional && headline.length < 3)}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar e Continuar'}
            </Button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
