import * as React from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-lg)] text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        default:
          'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary-hover))] shadow-sm active:scale-[0.98]',
        secondary:
          'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--border))] active:scale-[0.98]',
        outline:
          'border border-[hsl(var(--border))] bg-transparent hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] active:scale-[0.98]',
        ghost:
          'hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] active:scale-[0.98]',
        destructive:
          'bg-[hsl(var(--error))] text-white hover:bg-[hsl(var(--error)/0.9)] active:scale-[0.98]',
        link: 'text-[hsl(var(--primary))] underline-offset-4 hover:underline',
        premium:
          'bg-gradient-to-r from-[hsl(243,75%,55%)] to-[hsl(260,75%,60%)] text-white shadow-md hover:shadow-lg hover:from-[hsl(243,75%,50%)] hover:to-[hsl(260,75%,55%)] active:scale-[0.98]',
      },
      size: {
        xs: 'h-7 px-2.5 text-xs rounded-[var(--radius-md)]',
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-base',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled ?? loading}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        <Slottable>{children}</Slottable>
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
