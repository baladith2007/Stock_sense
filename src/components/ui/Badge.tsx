import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BadgeTone = 'critical' | 'low' | 'ok' | 'overstock' | 'danger' | 'info' | 'neutral';

const tones: Record<BadgeTone, string> = {
  critical: 'bg-accent-tint text-accent-ink',
  low: 'bg-accent-tint text-accent-ink',
  ok: 'bg-primary-tint text-primary-ink',
  overstock: 'bg-surface-soft text-muted-strong',
  danger: 'bg-danger-tint text-danger-ink',
  info: 'bg-info-tint text-info-ink',
  neutral: 'bg-surface-soft text-muted-strong',
};

const dots: Record<BadgeTone, string> = {
  critical: 'bg-accent',
  low: 'bg-accent',
  ok: 'bg-primary',
  overstock: 'bg-muted',
  danger: 'bg-danger',
  info: 'bg-info',
  neutral: 'bg-muted',
};

export function Badge({
  tone = 'neutral',
  children,
  dot = false,
  className,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none',
        tones[tone],
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dots[tone])} aria-hidden="true" />}
      {children}
    </span>
  );
}
