import * as React from 'react';
import Image from 'next/image';
import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  verified?: boolean;
}

const sizeMap = {
  xs: { container: 'h-6 w-6', text: 'text-[9px]', badge: 'h-2.5 w-2.5' },
  sm: { container: 'h-8 w-8', text: 'text-xs', badge: 'h-3 w-3' },
  md: { container: 'h-10 w-10', text: 'text-sm', badge: 'h-3.5 w-3.5' },
  lg: { container: 'h-12 w-12', text: 'text-base', badge: 'h-4 w-4' },
  xl: { container: 'h-16 w-16', text: 'text-lg', badge: 'h-5 w-5' },
  '2xl': { container: 'h-24 w-24', text: 'text-2xl', badge: 'h-6 w-6' },
};

function Avatar({ src, name, size = 'md', className, verified }: AvatarProps) {
  const { container, badge } = sizeMap[size];
  
  // Se não tiver src, gera um avatar divertido baseado no nome
  const finalSrc = src || `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

  return (
    <div className={cn('relative flex-shrink-0', className)}>
      <div
        className={cn(
          container,
          'relative overflow-hidden rounded-full bg-[hsl(var(--muted))] ring-2 ring-[hsl(var(--background))]'
        )}
      >
        <Image
          src={finalSrc}
          alt={name}
          fill
          className="object-cover"
          sizes="96px"
          priority={true}
          unoptimized
        />
      </div>
      {verified && (
        <span
          className={cn(
            badge,
            'absolute -bottom-0.5 -right-0.5 rounded-full bg-[hsl(var(--success))] ring-2 ring-[hsl(var(--background))] flex items-center justify-center'
          )}
          title="Verificado"
        >
          <svg
            className="h-full w-full p-0.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </div>
  );
}

export { Avatar };
