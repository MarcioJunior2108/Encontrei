'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Rocket, EyeOff, Sparkles, CheckCircle2, TrendingUp, Zap } from 'lucide-react';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function UpsellModal({ isOpen, onClose, onUpgrade }: UpsellModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-[var(--radius-2xl)] bg-[hsl(var(--background))] shadow-[var(--shadow-2xl)] border border-[hsl(var(--border))] z-10"
        >
          {/* Header com gradiente */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 px-6 py-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-md border border-white/30 shadow-inner">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-black text-white mb-2 leading-tight">
              Perfil no ar! 🎉<br />Mas espere...
            </h2>
            <p className="text-white/90 text-sm font-medium">
              Sua visibilidade atual é BAIXA.
            </p>
          </div>

          <div className="p-6">
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-start gap-3">
              <EyeOff className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 leading-relaxed">
                Neste momento, você está no <strong>final da fila</strong> nas buscas da sua cidade. Clientes quase nunca chegam até a página 3.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-bold text-center text-[hsl(var(--foreground))] text-lg">
                Pule a fila com o Plano PRO 🚀
              </h3>
              
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-[hsl(var(--muted-foreground))]">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-[hsl(var(--foreground))]">Apareça no <strong>TOPO</strong> das buscas regionais.</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-[hsl(var(--muted-foreground))]">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-[hsl(var(--foreground))]">Receba <strong>até 10x mais</strong> pedidos de orçamento.</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-[hsl(var(--muted-foreground))]">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-[hsl(var(--foreground))]">Libere o chat VIP direto no <strong>WhatsApp</strong> do cliente.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={onUpgrade}
                className="w-full h-14 text-base font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex flex-col items-center justify-center gap-0.5 group"
              >
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 fill-current" />
                  TURBINAR MEU PERFIL AGORA
                </div>
                <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80 group-hover:opacity-100">Oferta Especial de Lançamento</span>
              </Button>
              
              <button 
                onClick={onClose}
                className="w-full py-2 text-xs font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                Não quero receber mais clientes agora, manter perfil básico.
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
