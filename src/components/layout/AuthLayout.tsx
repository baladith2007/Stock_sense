import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export function AuthLayout({
  children,
  panelTitle,
  panelSub,
  bullets,
  accentStat,
}: {
  children: ReactNode;
  panelTitle: string;
  panelSub: string;
  bullets: string[];
  accentStat?: { value: string; label: string };
}) {
  return (
    <div className="flex min-h-screen bg-bg">
      {/* Brand panel */}
      <aside className="hero-gradient relative hidden w-[44%] max-w-[560px] flex-col justify-between p-10 lg:flex xl:p-12">
        <Link
          to="/"
          className="inline-flex w-fit rounded-input focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-ring"
          aria-label="StockSense home"
        >
          <Logo onDark />
        </Link>

        <div className="max-w-[360px]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-mint">
            Smart stock for small shops
          </span>
          <h2 className="mt-6 font-display text-[32px] font-semibold leading-[1.2] text-on-navy">{panelTitle}</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-on-navy-muted">{panelSub}</p>

          <ul className="mt-8 space-y-3">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5 text-[14px] text-on-navy">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-mint">
                  <Check size={12} strokeWidth={2.5} aria-hidden="true" />
                </span>
                {bullet}
              </li>
            ))}
          </ul>

          {accentStat && (
            <div className="mt-10 rounded-card border border-white/10 bg-white/5 p-5">
              <p className="tnum font-display text-[28px] font-bold text-mint">{accentStat.value}</p>
              <p className="mt-1 text-[13px] text-on-navy-muted">{accentStat.label}</p>
            </div>
          )}
        </div>

        <p className="text-[12px] text-on-navy-muted">© {new Date().getFullYear()} StockSense · Built for the corner shop</p>
      </aside>

      {/* Form panel */}
      <div className="flex min-h-screen w-full flex-col lg:w-[56%]">
        <div className="flex items-center justify-between px-5 py-5 sm:px-8">
          <Link to="/" className="lg:hidden" aria-label="StockSense home">
            <Logo size="sm" />
          </Link>
          <Link
            to="/"
            className="ml-auto inline-flex items-center gap-1.5 rounded-input px-2 py-1 text-[13px] font-medium text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back home
          </Link>
        </div>
        <div className="flex flex-1 items-start justify-center px-5 pb-16 pt-4 sm:px-8 sm:pt-10">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>
        <div className="px-5 pb-6 text-center text-[12px] text-muted sm:px-8">
          <Link to="/privacy" className="hover:text-ink hover:underline">
            Privacy
          </Link>
          <span className="mx-2">·</span>
          <Link to="/terms" className="hover:text-ink hover:underline">
            Terms
          </Link>
        </div>
      </div>
    </div>
  );
}
