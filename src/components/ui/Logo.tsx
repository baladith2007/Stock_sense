import { cn } from '@/lib/utils';

export function Logo({
  onDark = false,
  className,
  size = 'md',
}: {
  onDark?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <span
      className={cn(
        'inline-flex select-none items-center gap-2 font-display font-bold tracking-tight',
        size === 'sm' && 'text-[17px]',
        size === 'md' && 'text-[20px]',
        size === 'lg' && 'text-[24px]',
        className,
      )}
    >
      <span
        className={cn(
          'flex items-center justify-center rounded-[9px]',
          size === 'sm' ? 'h-7 w-7' : 'h-8 w-8',
          onDark ? 'bg-white/10' : 'bg-navy',
        )}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className={cn('h-[18px] w-[18px]', onDark ? 'text-mint' : 'text-primary')} fill="none">
          <path d="M4 16.5 8.5 12l3 3L18 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18" cy="8" r="2" fill="currentColor" />
        </svg>
      </span>
      <span className={onDark ? 'text-on-navy' : 'text-ink'}>
        Stock<span className={onDark ? 'text-mint' : 'text-primary-ink'}>Sense</span>
      </span>
    </span>
  );
}
