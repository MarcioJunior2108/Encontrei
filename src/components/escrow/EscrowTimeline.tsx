'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Upload, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, cn } from '@/lib/utils';
import { submitMilestoneProof, approveMilestone } from '@/app/actions/escrow';

interface Milestone {
  id: string;
  description: string;
  amountPercentage: number;
  status: 'PENDING' | 'AWAITING_VERIFICATION' | 'COMPLETED' | 'DISPUTED';
  proofImageUrl?: string | null;
}

interface EscrowTimelineProps {
  totalAmount: number;
  milestones: Milestone[];
  userRole: 'CLIENT' | 'PROFESSIONAL';
}

export function EscrowTimeline({ totalAmount, milestones, userRole }: EscrowTimelineProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function handleUploadProof(e: React.ChangeEvent<HTMLInputElement>, milestoneId: string) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingId(milestoneId);
    setError('');

    const formData = new FormData();
    formData.append('milestoneId', milestoneId);
    formData.append('proofImage', file);

    const result = await submitMilestoneProof(formData);
    if (result.error) {
      setError(result.error);
    }
    setLoadingId(null);
  }

  async function handleApprove(milestoneId: string) {
    setLoadingId(milestoneId);
    setError('');

    const result = await approveMilestone(milestoneId);
    if (result.error) {
      setError(result.error);
    }
    setLoadingId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-4">
        <div>
          <h3 className="text-lg font-bold text-[hsl(var(--foreground))]">Progresso do Serviço</h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">O pagamento está retido de forma segura e será liberado por etapas.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Valor Total Guardado</p>
          <p className="text-2xl font-bold text-[hsl(var(--primary))]">{formatCurrency(totalAmount)}</p>
        </div>
      </div>

      {error && (
        <div className="p-3 text-sm rounded-[var(--radius-md)] bg-red-500/10 text-red-500">
          {error}
        </div>
      )}

      <div className="relative border-l-2 border-[hsl(var(--muted))] ml-3 space-y-8 pb-4 mt-8">
        {milestones.map((milestone, index) => {
          const value = (totalAmount * milestone.amountPercentage) / 100;
          const isCompleted = milestone.status === 'COMPLETED';
          const isAwaiting = milestone.status === 'AWAITING_VERIFICATION';
          const isPending = milestone.status === 'PENDING';

          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8"
            >
              {/* Timeline Icon */}
              <div className={cn(
                "absolute -left-[17px] top-1 h-8 w-8 rounded-full border-4 border-[hsl(var(--background))] flex items-center justify-center",
                isCompleted ? "bg-[hsl(var(--success))] text-white" :
                isAwaiting ? "bg-amber-400 text-white" :
                "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
              )}>
                {isCompleted ? <CheckCircle2 className="h-4 w-4" /> :
                 isAwaiting ? <Clock className="h-4 w-4" /> :
                 <Circle className="h-2 w-2 fill-current" />}
              </div>

              <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius-lg)] p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                        Etapa {index + 1}
                      </span>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-medium",
                        isCompleted ? "bg-[hsl(var(--success-muted))] text-[hsl(var(--success))]" :
                        isAwaiting ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                        "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                      )}>
                        {isCompleted ? 'Concluída' : isAwaiting ? 'Em Análise' : 'Pendente'}
                      </span>
                    </div>
                    <h4 className="font-semibold text-base text-[hsl(var(--foreground))]">{milestone.description}</h4>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-bold text-[hsl(var(--foreground))]">{formatCurrency(value)}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{milestone.amountPercentage}% do total</p>
                  </div>
                </div>

                {milestone.proofImageUrl && (
                  <div className="mt-4 mb-4 border rounded-[var(--radius-md)] overflow-hidden bg-[hsl(var(--muted))] h-32 w-full max-w-sm relative">
                    <img src={milestone.proofImageUrl} alt="Comprovação" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Ações baseadas no Papel */}
                {userRole === 'PROFESSIONAL' && isPending && (
                  <div className="mt-4">
                    <label className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--ring))] disabled:pointer-events-none disabled:opacity-50 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow hover:bg-[hsl(var(--primary))/0.9] h-9 px-4 py-2">
                      {loadingId === milestone.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {loadingId === milestone.id ? 'Enviando...' : 'Enviar Foto da Entrega'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment" 
                        className="hidden" 
                        onChange={(e) => handleUploadProof(e, milestone.id)} 
                        disabled={loadingId === milestone.id}
                      />
                    </label>
                  </div>
                )}

                {userRole === 'CLIENT' && isAwaiting && (
                  <div className="mt-4 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-[var(--radius-md)] border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      O profissional enviou a comprovação desta etapa. Analise a imagem acima e libere o pagamento se estiver correto.
                    </p>
                    <Button 
                      onClick={() => handleApprove(milestone.id)} 
                      disabled={loadingId === milestone.id}
                      className="bg-amber-500 hover:bg-amber-600 text-white border-0 shrink-0 gap-2"
                    >
                      {loadingId === milestone.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      Liberar Fundos
                    </Button>
                  </div>
                )}

              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
