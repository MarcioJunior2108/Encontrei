'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Loader2, Sparkles, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { processCopilotChat, ChatMessage } from '@/app/actions/copilot';

export function AICopilotSearch({ defaultValue = '', className, autoFocus = false }: { defaultValue?: string, className?: string, autoFocus?: boolean, size?: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(autoFocus);
  const [isLoading, setIsLoading] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Auto resize textarea
  const resize = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;

    // Adiciona mensagem do usuário
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(newMessages);
    setValue('');
    setIsLoading(true);

    try {
      const res = await processCopilotChat(newMessages);
      
      if (res.success && res.data) {
        if (res.data.action === 'search') {
          // A IA decidiu que já sabe o suficiente, redireciona para a busca!
          setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply || 'Buscando profissionais...' }]);
          setTimeout(() => {
            router.push(`/buscar?q=${encodeURIComponent(res.data.query || trimmed)}`);
          }, 1500);
        } else {
          // A IA quer fazer mais uma pergunta
          setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
          setIsLoading(false);
          // Foca novamente no input
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      } else {
        // Falha no copilot, fallback pra busca padrão
        router.push(`/buscar?q=${encodeURIComponent(trimmed)}`);
      }
    } catch (err) {
      router.push(`/buscar?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={cn('w-full', className)}>
      
      {/* Histórico do Chat (Só aparece se tiver mensagens) */}
      <AnimatePresence>
        {messages.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 space-y-4 max-h-[300px] overflow-y-auto px-2"
          >
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] flex items-center justify-center shrink-0">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
                <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-slate-800 text-white rounded-tr-none' 
                    : 'bg-white border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start">
                <div className="h-8 w-8 rounded-full bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="px-4 py-2.5 rounded-2xl bg-white border border-[hsl(var(--border))] rounded-tl-none flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce delay-100"></div>
                  <div className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce delay-200"></div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Box principal */}
      <motion.div
        className={cn(
          'relative rounded-[var(--radius-2xl)] border-2 bg-[hsl(var(--card))] transition-all duration-300',
          isFocused || messages.length > 0
            ? 'border-[hsl(var(--primary))] shadow-[0_0_0_4px_hsl(var(--primary)/0.08),var(--shadow-lg)]'
            : 'border-[hsl(var(--border))] shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] hover:border-[hsl(var(--primary)/0.3)]'
        )}
      >
        <div className="flex items-start px-2 py-2 sm:px-4 sm:py-3">
          <div className="mt-2.5 ml-2 hidden sm:block">
            <Search className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
          </div>

          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              resize();
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={messages.length === 0 ? "Ex: Preciso de um pedreiro para reformar meu banheiro..." : "Responda à IA..."}
            className="flex-1 min-h-[44px] max-h-[120px] w-full resize-none bg-transparent px-3 py-2.5 text-base sm:text-lg text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none"
            disabled={isLoading}
            autoFocus={autoFocus}
            rows={1}
            style={{ overflow: 'hidden' }}
          />

          <div className="flex items-center gap-2 mt-1 sm:mt-1.5">
            <button
              onClick={handleSubmit}
              disabled={!value.trim() || isLoading}
              className="group flex h-10 w-10 sm:h-12 sm:w-12 sm:w-auto sm:px-6 items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-md transition-all hover:bg-[hsl(var(--primary)/0.9)] disabled:opacity-50 disabled:hover:bg-[hsl(var(--primary))]"
            >
              <span className="hidden sm:inline font-semibold">
                {messages.length === 0 ? "Buscar" : "Enviar"}
              </span>
              {isLoading ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              )}
            </button>
          </div>
        </div>

        {/* Footer IA Powered (só mostra se não tiver iniciado a conversa) */}
        {messages.length === 0 && (
          <div className="flex items-center justify-between border-t border-[hsl(var(--border))] px-4 py-2.5 bg-slate-50/50 rounded-b-[calc(var(--radius-2xl)-2px)]">
            <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
              <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
              <span className="hidden sm:inline">Copiloto IA inteligente • Enter para buscar</span>
              <span className="sm:hidden">Copiloto IA</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
