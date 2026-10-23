import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { useCountUp } from '@/lib/hooks';
import { cn } from '@/lib/utils';

export function KpiCard({
  label,
  value,
  format,
  trend,
  hint,
  className,
}: {
  label: string;
  value: number;
  format?: (value: number) => string;
  trend?: { value: string; direction: 'up' | 'down' | 'flat'; positive?: boolean };
  hint?: string;
  className?: string;
}) {
  const animated = useCountUp(value);
  const display = format ? format(animated) : Math.round(animated).toLocaleString('en-IN');
  const positive = trend?.positive ?? trend?.direction === 'up';
  const TrendIcon = trend?.direction === 'up' ? ArrowUpRight : trend?.direction === 'down' ? ArrowDownRight : Minus;

  return (
    <div className={cn('rounded-card border border-line bg-surface p-5', className)}>
      <p className="text-caption text-muted">{label}</p>
      <p className="tnum mt-2 font-display text-stat font-bold text-ink">{display}</p>
      <div className="mt-2 flex min-h-[22px] flex-wrap items-center gap-2">
        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[12px] font-semibold',
              positive ? 'bg-primary-tint text-primary-ink' : 'bg-accent-tint text-accent-ink',
            )}
          >
            <TrendIcon size={13} aria-hidden="true" />
            {trend.value}
          </span>
        )}
        {hint && <span className="text-caption text-muted">{hint}</span>}
      </div>
    </div>
  );
}
