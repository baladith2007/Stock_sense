import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton h-4 w-full', className)} aria-hidden="true" />;
}

export function SkeletonCard({ rows = 3 }: { rows?: number }) {
  return (
    <div className="card space-y-4 p-6">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-32" />
      <div className="space-y-2 pt-2">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className={index === rows - 1 ? 'w-2/3' : 'w-full'} />
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading page">
      <div className="space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-56" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index} rows={1} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-6 h-48 w-full" />
        </div>
        <SkeletonCard rows={5} />
      </div>
    </div>
  );
}
