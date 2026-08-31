'use client';

import { Loader2 } from 'lucide-react';

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-card/90 p-6 rounded-2xl border shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
        <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-primary/10">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AcheiYou
          </span>
          <span className="text-sm text-muted-foreground font-medium">
            Carregando...
          </span>
        </div>
      </div>
    </div>
  );
}
