'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, TrendingUp, TrendingDown, Users, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import type { Professional } from '@/types';
import { formatNumber, getRatingLabel } from '@/lib/utils';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function MetricsView({ professional: pro }: { professional: Professional }) {
  const chartData = [
    { name: 'Seg', ganhos: 320, servicos: 2 },
    { name: 'Ter', ganhos: 450, servicos: 3 },
    { name: 'Qua', ganhos: 150, servicos: 1 },
    { name: 'Qui', ganhos: 600, servicos: 4 },
    { name: 'Sex', ganhos: 800, servicos: 5 },
    { name: 'Sáb', ganhos: 1200, servicos: 8 },
    { name: 'Dom', ganhos: 300, servicos: 2 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Desempenho da Semana</h2>
      
      {/* Reputation Hero */}
      <Card className="bg-gradient-to-r from-[hsl(var(--primary-muted))] to-[hsl(var(--background))] border-[hsl(var(--primary)/0.2)]">
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
          <div className="text-center sm:text-left flex-shrink-0">
            <p className="text-xs font-semibold text-[hsl(var(--primary))] uppercase tracking-wider mb-2">Seu Nível</p>
            <div className="text-5xl font-black text-[hsl(var(--foreground))] mb-2">
              {pro.reputation.rating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-1 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(pro.reputation.rating) ? 'text-amber-400 fill-amber-400' : 'text-[hsl(var(--border))]'}`} />
              ))}
            </div>
            <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{getRatingLabel(pro.reputation.rating)}</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">{formatNumber(pro.reputation.reviewCount)} avaliações</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 flex-1 w-full">
            <div className="bg-[hsl(var(--background))] rounded-[var(--radius-lg)] p-4 border border-[hsl(var(--border))]">
              <p className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1.5 mb-1"><CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--success))]" /> Conclusão</p>
              <p className="text-xl font-bold text-[hsl(var(--foreground))]">{pro.reputation.completionRate}%</p>
            </div>
            <div className="bg-[hsl(var(--background))] rounded-[var(--radius-lg)] p-4 border border-[hsl(var(--border))]">
              <p className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1.5 mb-1"><AlertTriangle className="h-3.5 w-3.5 text-[hsl(var(--error))]" /> Cancelamentos</p>
              <p className="text-xl font-bold text-[hsl(var(--foreground))]">{pro.reputation.cancellationRate}%</p>
            </div>
            <div className="bg-[hsl(var(--background))] rounded-[var(--radius-lg)] p-4 border border-[hsl(var(--border))]">
              <p className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1.5 mb-1"><Clock className="h-3.5 w-3.5 text-[hsl(var(--warning))]" /> Tempo médio</p>
              <p className="text-xl font-bold text-[hsl(var(--foreground))]">{pro.reputation.responseTimeMinutes}m</p>
            </div>
            <div className="bg-[hsl(var(--background))] rounded-[var(--radius-lg)] p-4 border border-[hsl(var(--border))]">
              <p className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1.5 mb-1"><Users className="h-3.5 w-3.5 text-[hsl(var(--info))]" /> Satisfação</p>
              <p className="text-xl font-bold text-[hsl(var(--foreground))]">{pro.reputation.satisfactionRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ganhos Diários (R$)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="ganhos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
