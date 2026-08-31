'use client';

import { Loader2 } from 'lucide-react';
import { Skeleton, SkeletonCard, SkeletonMetricCard } from '@/components/ui/skeleton';

export default function AdminLoading() {
  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Global elegant spinner loader */}
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="bg-card/60 backdrop-blur-md p-5 rounded-[var(--radius-xl)] border shadow-xl flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
            <div className="relative flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                <Loader2 className="h-7 w-7 text-primary animate-spin" />
            </div>
            <span className="font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Carregando dados...</span>
        </div>
      </div>

      {/* Background skeletons to make it feel responsive */}
      <div className="opacity-40 pointer-events-none flex flex-col gap-6">
        <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-8 w-64 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SkeletonMetricCard />
            <SkeletonMetricCard />
            <SkeletonMetricCard />
            <SkeletonMetricCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
            <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-[400px] w-full rounded-[var(--radius-xl)]" />
            </div>
            <div className="space-y-4">
                <SkeletonCard />
                <SkeletonCard />
            </div>
        </div>
      </div>
    </div>
  );
}
