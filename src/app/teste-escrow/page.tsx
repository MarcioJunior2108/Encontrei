import { EscrowTimeline } from '@/components/escrow/EscrowTimeline';

export default function TesteEscrowPage() {
  // Mock data para demonstrar a UI do Escrow sem precisar de banco de dados real
  const mockMilestones = [
    {
      id: 'm1',
      description: 'Compra de materiais e preparação do local',
      amountPercentage: 30,
      status: 'COMPLETED' as const,
      proofImageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'm2',
      description: 'Instalação da tubulação principal',
      amountPercentage: 40,
      status: 'AWAITING_VERIFICATION' as const,
      proofImageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'm3',
      description: 'Acabamento e teste de pressão',
      amountPercentage: 30,
      status: 'PENDING' as const,
    }
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] p-8">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">Demonstração: Motor de Escrow</h1>
          <p className="text-[hsl(var(--muted-foreground))] mt-2">Visão simulada de como o fluxo de retenção funciona na prática.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Visão do Cliente */}
          <div className="p-6 rounded-[var(--radius-xl)] border-2 border-dashed border-amber-500/30 bg-amber-500/5">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-amber-500 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-sm">1</span>
              Visão do Cliente
            </h2>
            <EscrowTimeline 
              totalAmount={2500} 
              milestones={mockMilestones} 
              userRole="CLIENT" 
            />
          </div>

          {/* Visão do Profissional */}
          <div className="p-6 rounded-[var(--radius-xl)] border-2 border-dashed border-blue-500/30 bg-blue-500/5">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-blue-500 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-sm">2</span>
              Visão do Profissional
            </h2>
            <EscrowTimeline 
              totalAmount={2500} 
              milestones={mockMilestones} 
              userRole="PROFESSIONAL" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
