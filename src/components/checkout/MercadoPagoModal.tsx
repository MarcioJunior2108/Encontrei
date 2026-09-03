'use client';

import React, { useEffect, useState } from 'react';
import { initMercadoPago, Payment, StatusScreen } from '@mercadopago/sdk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Lock, CreditCard, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

// Inicializa o Mercado Pago
if (process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY) {
  initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY);
}

interface MercadoPagoModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  metadata: any;
  onSuccess?: (paymentId: string) => void;
}

export function MercadoPagoModal({ isOpen, onClose, amount, description, metadata, onSuccess }: MercadoPagoModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setIsProcessing(false);
      setPaymentId(null);
    }
  }, [isOpen]);

  const initialization = {
    amount: amount,
  };

  const customization = {
    paymentMethods: {
      bankTransfer: "all",
      creditCard: "all",
    },
    visual: {
      style: {
        theme: "default", // ou 'dark' dependendo do tema da aplicação
      },
    },
  };

  const onSubmit = async ({ selectedPaymentMethod, formData }: any) => {
    setIsProcessing(true);
    setError(null);
    return new Promise<void>((resolve, reject) => {
      fetch("/api/checkout/transparent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData, metadata, description }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
            reject();
          } else {
            setPaymentId(data.id.toString());
            resolve();
          }
        })
        .catch((error) => {
          setError('Ocorreu um erro ao processar seu pagamento. Tente novamente.');
          reject();
        })
        .finally(() => {
          setIsProcessing(false);
        });
    });
  };

  const onError = async (error: any) => {
    console.error('Mercado Pago Brick Error:', error);
  };

  const onReady = async () => {
    // Brick carregado
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-[hsl(var(--background))] rounded-[var(--radius-2xl)] shadow-[var(--shadow-2xl)] border border-[hsl(var(--border))] overflow-hidden flex flex-col md:flex-row max-h-[95vh]"
        >
          {/* Coluna Esquerda: Resumo e Segurança */}
          <div className="w-full md:w-[40%] bg-gradient-to-br from-indigo-950 via-slate-900 to-black p-8 text-white flex flex-col relative overflow-hidden shrink-0 hidden sm:flex">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 flex-1">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Finalizar Pedido</h2>
                <p className="text-white/60 text-sm">Ambiente seguro e criptografado</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8 backdrop-blur-sm">
                <p className="text-white/70 text-sm mb-1 uppercase tracking-wider font-semibold">Resumo da Compra</p>
                <h3 className="text-lg font-medium text-white mb-4">{description}</h3>
                <div className="pt-4 border-t border-white/10 flex items-end justify-between">
                  <span className="text-white/70">Total a pagar:</span>
                  <span className="text-3xl font-black text-white">{formatCurrency(amount)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-500/20 p-2 rounded-full shrink-0">
                    <ShieldCheck className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Pagamento 100% Seguro</h4>
                    <p className="text-xs text-white/60 mt-0.5">Seus dados são protegidos pela tecnologia do Mercado Pago.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500/20 p-2 rounded-full shrink-0">
                    <Lock className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Criptografia de Ponta</h4>
                    <p className="text-xs text-white/60 mt-0.5">Nós não armazenamos os dados do seu cartão.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-amber-500/20 p-2 rounded-full shrink-0">
                    <Zap className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Liberação Imediata</h4>
                    <p className="text-xs text-white/60 mt-0.5">Acesso instantâneo após a confirmação via Pix ou Cartão.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-8 mt-auto border-t border-white/10 flex items-center justify-between opacity-60">
              <span className="text-xs font-medium">Powered by</span>
              <img src="https://logospng.org/download/mercado-pago/logo-mercado-pago-icone-1024.png" alt="Mercado Pago" className="h-6 opacity-80" />
            </div>
          </div>

          {/* Coluna Direita: Checkout Mercado Pago */}
          <div className="w-full md:w-[60%] flex flex-col bg-[hsl(var(--background))] relative h-full">
            {/* Header Mobile Only (Oculto no Desktop já que a coluna esquerda serve de header) */}
            <div className="flex items-center justify-between p-4 sm:hidden border-b border-[hsl(var(--border))]">
              <div>
                <h2 className="text-base font-bold text-[hsl(var(--foreground))]">{description}</h2>
                <p className="text-sm font-black text-[hsl(var(--primary))]">{formatCurrency(amount)}</p>
              </div>
              <button
                onClick={() => {
                  if (paymentId && onSuccess) {
                    onSuccess(paymentId);
                  } else {
                    onClose();
                  }
                }}
                disabled={isProcessing}
                className="p-2 rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Fechar Modal Desktop */}
            <button
              onClick={() => {
                if (paymentId && onSuccess) {
                  onSuccess(paymentId);
                } else {
                  onClose();
                }
              }}
              disabled={isProcessing}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[hsl(var(--muted))] transition-colors text-[hsl(var(--muted-foreground))] disabled:opacity-50 z-20 hidden sm:flex"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Formulário de Pagamento */}
            <div className="p-4 sm:p-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="sm:hidden mb-4 p-3 bg-green-50 text-green-700 border border-green-100 rounded-lg flex items-center gap-2 text-xs font-medium">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                Pagamento processado com segurança pelo Mercado Pago.
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm flex items-start gap-2">
                  <X className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="min-h-[400px]">
                {paymentId ? (
                  <StatusScreen
                    initialization={{ paymentId: paymentId }}
                    onReady={onReady}
                    onError={onError}
                  />
                ) : (
                  <Payment
                    initialization={initialization}
                    customization={customization as any}
                    onSubmit={onSubmit}
                    onReady={onReady}
                    onError={onError}
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
