import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-soft text-muted">
        <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
      </div>
      <h3 className="font-display text-[17px] font-semibold text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-[14px] text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
