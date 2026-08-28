'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Mic, Sparkles, Camera, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { INTENT_EXAMPLES } from '@/mock/data';

interface IntentInputProps {
  size?: 'default' | 'large';
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  onSubmit?: (value: string, imageBase64?: string) => void;
  defaultValue?: string;
}

export function IntentInput({
  size = 'default',
  autoFocus = false,
  className,
  onSubmit,
  defaultValue = '',
}: IntentInputProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [showExample, setShowExample] = useState(true);
  const [imageBase64, setImageBase64] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rotate examples when not focused and empty
  useEffect(() => {
    if (isFocused || value) return;
    const interval = setInterval(() => {
      setShowExample(false);
      setTimeout(() => {
        setExampleIndex(prev => (prev + 1) % INTENT_EXAMPLES.length);
        setShowExample(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, [isFocused, value]);

  // Auto resize textarea
  const resize = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  const handleSubmit = useCallback(async () => {
    const trimmed = value.trim();
    if ((!trimmed && !imageBase64) || isLoading) return;

    setIsLoading(true);
    if (onSubmit) {
      onSubmit(trimmed, imageBase64);
    } else {
      router.push(`/buscar?q=${encodeURIComponent(trimmed)}`);
    }
    // Keep loading for brief moment to show feedback
    await new Promise(r => setTimeout(r, 600));
    setIsLoading(false);
  }, [value, imageBase64, isLoading, onSubmit, router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
        setIsFocused(true); // Keep focus to show UI correctly
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isLarge = size === 'large';

  return (
    <div className={cn('w-full', className)}>
      <motion.div
        className={cn(
          'relative rounded-[var(--radius-2xl)] border-2 bg-[hsl(var(--card))] transition-all duration-300',
          isFocused
            ? 'border-[hsl(var(--primary))] shadow-[0_0_0_4px_hsl(var(--primary)/0.08),var(--shadow-lg)]'
            : 'border-[hsl(var(--border))] shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] hover:border-[hsl(var(--primary)/0.3)]'
        )}
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Top row: icon + textarea */}
        <div className="flex items-start gap-3 px-5 pt-5 pb-3">
          <div
            className={cn(
              'flex-shrink-0 mt-1 rounded-[var(--radius-md)] flex items-center justify-center',
              isLarge ? 'h-8 w-8' : 'h-7 w-7',
              isFocused
                ? 'bg-[hsl(var(--primary))] text-white'
                : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
              'transition-all duration-200'
            )}
          >
            <Search className={isLarge ? 'h-4 w-4' : 'h-3.5 w-3.5'} aria-hidden="true" />
          </div>

          <div className="flex-1 relative">
            {/* Animated placeholder */}
            <AnimatePresence mode="wait">
              {!value && !isFocused && (
                <motion.div
                  key={exampleIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: showExample ? 1 : 0, y: showExample ? 0 : -4 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    'absolute top-0 left-0 pointer-events-none select-none text-[hsl(var(--muted-foreground))]',
                    isLarge ? 'text-lg' : 'text-base'
                  )}
                  aria-hidden="true"
                >
                  {INTENT_EXAMPLES[exampleIndex]}
                </motion.div>
              )}
            </AnimatePresence>

            <textarea
              ref={inputRef}
              id="intent-input"
              value={value}
              onChange={e => { setValue(e.target.value); resize(); }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              autoFocus={autoFocus}
              rows={1}
              aria-label="Descreva o que você precisa"
              className={cn(
                'w-full resize-none bg-transparent outline-none font-medium text-[hsl(var(--foreground))] placeholder-transparent',
                isLarge ? 'text-lg' : 'text-base',
                'min-h-[28px] max-h-[200px] leading-relaxed'
              )}
              style={{ lineHeight: '1.6' }}
            />

            {/* Image Preview */}
            <AnimatePresence>
              {imageBase64 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mt-3 relative inline-block rounded-xl overflow-hidden border border-[hsl(var(--border))] shadow-sm"
                >
                  <img src={imageBase64} alt="Problema" className="h-24 w-auto object-cover" />
                  <button
                    onClick={() => setImageBase64(undefined)}
                    className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-black transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom row: hints + actions */}
        <div className="flex items-center justify-between px-5 pb-4">
          <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
            <Sparkles className="h-3 w-3 text-[hsl(var(--primary))]" aria-hidden="true" />
            <span>Powered by IA</span>
            <span className="opacity-40">·</span>
            <span className="hidden sm:inline">Enter para buscar</span>
            <span className="sm:hidden">Toque em →</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Camera input for AI Vision */}
            <button
              type="button"
              title="Anexar foto para Diagnóstico com IA"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 w-8 rounded-full flex items-center justify-center text-[hsl(var(--primary))] bg-[hsl(var(--primary))/0.1] hover:bg-[hsl(var(--primary))/0.2] transition-colors relative"
            >
              <Camera className="h-4 w-4" />
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleImageUpload}
              />
            </button>

            {/* Voice input — UI ready, not functional yet */}
            <button
              type="button"
              title="Entrada por voz (em breve)"
              disabled
              className="h-8 w-8 rounded-full flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Mic className="h-4 w-4" aria-hidden="true" />
            </button>

            {/* Submit */}
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={(!value.trim() && !imageBase64) || isLoading}
              className={cn(
                'h-9 min-w-9 rounded-[var(--radius-lg)] px-3 flex items-center justify-center gap-1.5 text-sm font-semibold transition-all duration-200',
                (value.trim() || imageBase64) && !isLoading
                  ? 'bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary-hover))] shadow-sm cursor-pointer'
                  : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] cursor-not-allowed'
              )}
              whileHover={(value.trim() || imageBase64) ? { scale: 1.03 } : {}}
              whileTap={(value.trim() || imageBase64) ? { scale: 0.97 } : {}}
              aria-label="Buscar"
            >
              {isLoading ? (
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  <span className="hidden sm:inline">Buscar</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Quick suggestions */}
      <AnimatePresence>
        {isFocused && !value && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-3 flex flex-wrap gap-2"
          >
            {INTENT_EXAMPLES.slice(0, 4).map((example, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setValue(example.replace('...', ''));
                  inputRef.current?.focus();
                }}
                className="text-xs px-3 py-1.5 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary)/0.5)] hover:bg-[hsl(var(--primary-muted))] hover:text-[hsl(var(--primary))] transition-all duration-150"
              >
                {example.replace('...', '')}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
