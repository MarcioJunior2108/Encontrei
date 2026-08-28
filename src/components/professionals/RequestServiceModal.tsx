'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createServiceRequest } from '@/app/actions/requests';
import { Button } from '@/components/ui/button';
import { Camera, Sparkles, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiDiagnosis, setAiDiagnosis] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      const saved = sessionStorage.getItem('pendingRequest');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.description) setDescription(parsed.description);
          if (parsed.date) setDate(parsed.date);
        } catch (e) {
          // invalid json
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const needsLogin = error === 'Você precisa estar logado para solicitar um orçamento.';
  const loginNextUrl = `/perfil/${professionalId}?openModal=true`;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    // Always save state before submitting in case they need to login
    sessionStorage.setItem('pendingRequest', JSON.stringify({ description, date }));

    let diagnosisData = null;
    let isPremium = false;

    // Se tiver foto, vamos chamar a IA primeiro
    if (imageBase64) {
      setIsAnalyzing(true);
      try {
        const aiResponse = await fetch('/api/ai/diagnose', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: imageBase64, description })
        });
        
        const aiResult = await aiResponse.json();
        
        if (aiResult.success) {
          diagnosisData = aiResult.diagnosis;
          setAiDiagnosis(diagnosisData);
          isPremium = true; // Virou Lead Premium!
        }
      } catch (err) {
        console.error('Falha ao analisar imagem:', err);
        // Não travar o pedido, apenas seguir sem o premium
      }
      setIsAnalyzing(false);
    }

    const res = await createServiceRequest({ 
      professionalId, 
      description, 
      date,
      imageUrl: imageBase64 || undefined,
      aiDiagnosis: diagnosisData,
      isPremiumLead: isPremium
    });
    
    if (res.error) {
      setError(res.error);
      setIsSubmitting(false);
    } else {
      setSuccess(true);
      setIsSubmitting(false);
      sessionStorage.removeItem('pendingRequest');
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
                <div className={`p-4 rounded-[var(--radius-lg)] text-sm flex flex-col gap-3 ${needsLogin ? 'bg-[hsl(var(--warning)/0.1)] text-[hsl(var(--warning))] border border-[hsl(var(--warning)/0.2)]' : 'bg-red-500/10 text-red-500'}`}>
                  <p className="font-medium text-base">{error}</p>
                  {needsLogin && (
                    <div className="flex gap-2">
                      <Button asChild variant="default" size="sm" className="flex-1 bg-[hsl(var(--warning))] text-white hover:bg-[hsl(var(--warning)/0.8)]">
                        <Link href={`/login?next=${encodeURIComponent(loginNextUrl)}`}>Fazer Login</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="flex-1 border-[hsl(var(--warning)/0.5)] text-[hsl(var(--warning))] hover:bg-[hsl(var(--warning)/0.1)] hover:text-[hsl(var(--warning))]">
                        <Link href={`/cadastro?next=${encodeURIComponent(loginNextUrl)}`}>Criar Conta</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">O que você precisa?</label>
                  
                  {/* AI Photo Button */}
                  <label className="cursor-pointer flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--primary))] bg-[hsl(var(--primary))/0.1] px-2 py-1 rounded-md hover:bg-[hsl(var(--primary))/0.2] transition-colors">
                    <Camera className="h-3.5 w-3.5" />
                    <span>Anexar Foto</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      capture="environment"
                      className="hidden" 
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                
                <textarea
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Descreva o serviço com o máximo de detalhes..."
                  className="w-full min-h-[120px] rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm outline-none focus:border-[hsl(var(--primary))] resize-y"
                />

                <AnimatePresence>
                  {imageBase64 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative rounded-lg overflow-hidden border border-[hsl(var(--border))] mt-2 bg-[hsl(var(--muted))]"
                    >
                      <img src={imageBase64} alt="Preview do Problema" className="w-full max-h-[160px] object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageBase64(null)}
                        className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-6 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-400" />
                        <span className="text-xs font-medium text-white shadow-sm">
                          Nossa IA vai gerar um diagnóstico e a lista de materiais a partir da foto!
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                <Button type="submit" className="flex-1" disabled={isSubmitting || isAnalyzing}>
                  {isAnalyzing ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Analisando Foto (IA)...</>
                  ) : isSubmitting ? (
                    'Enviando Pedido...'
                  ) : (
                    'Enviar Pedido'
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
