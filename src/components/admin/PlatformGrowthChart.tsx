'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ProfileData = {
  createdAt: Date;
};

export function PlatformGrowthChart({ profiles }: { profiles: ProfileData[] }) {
  const [filter, setFilter] = useState<'week' | 'month'>('week');

  // Cálculo para Últimos 7 dias
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  // Array para 7 dias (0 a 6)
  const dailyCounts = new Array(7).fill(0);
  const weekLabels = new Array(7).fill('');
  
  // Nomes dos dias
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    weekLabels[i] = dayNames[d.getDay()];
  }

  // Cálculo para Este Mês (últimos 30 dias ou mês atual)
  // Vamos usar últimos 30 dias para simplificar
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const monthCounts = new Array(30).fill(0);
  const monthLabels = new Array(30).fill('');

  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo);
    d.setDate(d.getDate() + i);
    monthLabels[i] = d.getDate().toString(); // Dia do mês (1, 2, 3...)
  }

  // Preencher os dados
  profiles.forEach(p => {
    // Week
    const dayDiff = Math.floor((new Date(p.createdAt).getTime() - sevenDaysAgo.getTime()) / (1000 * 60 * 60 * 24));
    if (dayDiff >= 0 && dayDiff < 7) {
      dailyCounts[dayDiff]++;
    }
    
    // Month
    const monthDiff = Math.floor((new Date(p.createdAt).getTime() - thirtyDaysAgo.getTime()) / (1000 * 60 * 60 * 24));
    if (monthDiff >= 0 && monthDiff < 30) {
      monthCounts[monthDiff]++;
    }
  });

  const activeCounts = filter === 'week' ? dailyCounts : monthCounts;
  const activeLabels = filter === 'week' ? weekLabels : monthLabels;

  const maxCount = Math.max(...activeCounts, 1);
  const chartHeights = activeCounts.map(count => Math.max((count / maxCount) * 100, 5));

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Crescimento da Plataforma</CardTitle>
        <div className="flex bg-[hsl(var(--muted))] rounded-md p-1">
          <button
            onClick={() => setFilter('week')}
            className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${filter === 'week' ? 'bg-[hsl(var(--background))] shadow-sm' : 'text-[hsl(var(--muted-foreground))] hover:text-foreground'}`}
          >
            7 Dias
          </button>
          <button
            onClick={() => setFilter('month')}
            className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${filter === 'month' ? 'bg-[hsl(var(--background))] shadow-sm' : 'text-[hsl(var(--muted-foreground))] hover:text-foreground'}`}
          >
            Mês
          </button>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full flex items-end justify-between px-2 sm:px-6 pb-2 pt-4 gap-1 sm:gap-2 relative">
          {chartHeights.map((height, i) => (
            <div key={i} className="flex flex-col items-center justify-end w-full h-full relative group">
              <div 
                className="w-full bg-[hsl(var(--primary)/0.7)] hover:bg-[hsl(var(--primary))] transition-colors rounded-t-sm relative flex flex-col items-center justify-start pt-1 sm:pt-2 cursor-pointer" 
                style={{ height: `${height}%` }}
                title={`${activeCounts[i]} novo(s) usuário(s)`}
              >
                <span className={`text-[10px] sm:text-xs font-bold ${height > 15 ? 'text-white' : 'absolute -top-5 sm:-top-6 text-[hsl(var(--foreground))]'}`}>
                  {activeCounts[i]}
                </span>
              </div>
              {/* Label de Baixo (Dia da Semana ou Dia do Mês) */}
              <div className="absolute -bottom-6 text-[9px] sm:text-[10px] text-[hsl(var(--muted-foreground))] w-full text-center truncate">
                {activeLabels[i]}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
