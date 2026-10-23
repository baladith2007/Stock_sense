import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Table({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  return (
    <div className="scroll-thin w-full overflow-x-auto">
      <table className={cn('w-full border-collapse text-left', className)} aria-label={label}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className }: { children: ReactNode; className?: string }) {
  return <thead className={cn('bg-surface-soft', className)}>{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-line">{children}</tbody>;
}

export function TableRow({ children, className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn('transition-colors duration-150 hover:bg-surface-soft/60', className)} {...props}>
      {children}
    </tr>
  );
}

export function TableHeaderCell({ children, className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cn('whitespace-nowrap px-4 py-3 text-label font-semibold text-muted-strong first:pl-5 last:pr-5', className)}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('px-4 py-3.5 text-[14px] text-ink first:pl-5 last:pr-5', className)} {...props}>
      {children}
    </td>
  );
}
