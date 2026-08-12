import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]',
        secondary: 'border-transparent bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
        outline: 'border-[hsl(var(--border))] text-[hsl(var(--foreground))]',
        success: 'border-transparent bg-[hsl(var(--success-muted))] text-[hsl(var(--success))]',
        warning: 'border-transparent bg-[hsl(var(--warning-muted))] text-[hsl(var(--warning))]',
        error: 'border-transparent bg-[hsl(var(--error-muted))] text-[hsl(var(--error))]',
        info: 'border-transparent bg-[hsl(var(--info-muted))] text-[hsl(var(--info))]',
        primary: 'border-transparent bg-[hsl(var(--primary-muted))] text-[hsl(var(--primary))]',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
