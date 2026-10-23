import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

export function buttonStyles({ variant = 'primary', size = 'md', fullWidth, className }: ButtonStyleOptions = {}) {
  return cn(
    'inline-flex select-none items-center justify-center gap-2 rounded-input font-semibold transition-colors duration-150 ease-out',
    'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-ring focus-visible:ring-offset-1 focus-visible:ring-offset-bg',
    'disabled:pointer-events-none disabled:opacity-50',
    size === 'sm' && 'h-11 px-3.5 text-[13px]',
    size === 'md' && 'h-11 px-5 text-[14px]',
    size === 'lg' && 'h-12 px-6 text-[15px]',
    fullWidth && 'w-full',
    variant === 'primary' && 'bg-primary text-navy hover:bg-primary-hover active:bg-primary-hover',
    variant === 'secondary' && 'border border-line bg-surface text-ink hover:bg-surface-soft',
    variant === 'ghost' && 'text-primary-ink hover:bg-primary-tint',
    variant === 'danger' && 'border border-danger bg-surface text-danger-ink hover:bg-danger-tint',
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleOptions {
  loading?: boolean;
  loadingLabel?: string;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', fullWidth, className, loading, loadingLabel = 'Working', children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn('relative', buttonStyles({ variant, size, fullWidth, className }))}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={loading ? loadingLabel : undefined}
      {...props}
    >
      <span className={cn('inline-flex items-center justify-center gap-2', loading && 'invisible')}>{children}</span>
      {loading && <Loader2 size={18} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" aria-hidden="true" />}
    </button>
  );
});
