'use client';

import React, { useEffect, useState } from 'react';
import { initMercadoPago, Payment, StatusScreen } from '@mercadopago/sdk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  onSuccess?: () => void;
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[hsl(var(--background))] rounded-[var(--radius-xl)] shadow-2xl border border-[hsl(var(--border))] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))]">
            <div>
              <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">Finalizar Pagamento</h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{description}</p>
            </div>
            <button
              onClick={() => {
                if (paymentId && onSuccess) {
                  onSuccess();
                } else {
                  onClose();
                }
              }}
              disabled={isProcessing}
              className="p-2 rounded-full hover:bg-[hsl(var(--muted))] transition-colors text-[hsl(var(--muted-foreground))] disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar">
            {error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                {error}
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
