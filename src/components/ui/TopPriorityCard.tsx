import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './Button';

export function TopPriorityCard({
  itemName,
  quantity,
  unit,
  message,
  meta,
  actionLabel = 'Review order',
  onAction,
  children,
}: {
  itemName: string;
  quantity: number;
  unit: string;
  message: string;
  meta?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}) {
  return (
    <section className="rounded-card bg-navy p-5 text-on-navy sm:p-6" aria-label="Top priority">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-navy">
          <span className="h-1.5 w-1.5 rounded-full bg-navy" aria-hidden="true" />
          Critical
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-on-navy-muted">Top priority</span>
      </div>

      <p className="mt-5 text-caption text-on-navy-muted">{itemName}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="tnum font-display text-stat-lg font-bold leading-none text-mint">{quantity}</span>
        <span className="text-[14px] text-on-navy-muted">{unit}</span>
      </div>
      <p className="mt-3 max-w-[34ch] text-[15px] leading-snug text-on-navy">{message}</p>

      {children}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-navy-700 pt-4">
        {meta ? <span className="text-caption text-on-navy-muted">{meta}</span> : <span />}
        {onAction && (
          <Button
            size="sm"
            variant="secondary"
            onClick={onAction}
            className="group border-navy-700 bg-transparent text-on-navy hover:bg-white/10 hover:text-on-navy"
          >
            {actionLabel}
            <ArrowRight size={15} className="transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
          </Button>
        )}
      </div>
    </section>
  );
}
