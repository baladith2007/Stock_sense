import { createPortal } from 'react-dom';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useApp, type ToastKind } from '@/context/AppContext';
import { cn } from '@/lib/utils';

const config: Record<ToastKind, { icon: typeof CheckCircle2; className: string }> = {
  success: { icon: CheckCircle2, className: 'text-primary-ink' },
  warning: { icon: AlertTriangle, className: 'text-accent-ink' },
  error: { icon: XCircle, className: 'text-danger-ink' },
  info: { icon: Info, className: 'text-info-ink' },
};

export function ToastViewport() {
  const { toasts, dismissToast } = useApp();

  if (!toasts.length) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-4 sm:bottom-6"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => {
        const { icon: Icon, className } = config[toast.kind];
        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-[420px] animate-toast-in items-start gap-3 rounded-card border border-line bg-surface px-4 py-3 shadow-float"
          >
            <Icon size={20} className={cn('mt-0.5 shrink-0', className)} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium leading-snug text-ink">{toast.title}</p>
              {toast.description && <p className="mt-0.5 text-caption text-muted">{toast.description}</p>}
              {toast.action && (
                <button
                  type="button"
                  onClick={() => {
                    toast.action?.onClick();
                    dismissToast(toast.id);
                  }}
                  className="mt-1.5 text-label font-semibold text-primary-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {toast.action.label}
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X size={15} aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>,
    document.body,
  );
}
