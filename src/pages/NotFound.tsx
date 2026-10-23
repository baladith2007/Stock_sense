import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { buttonStyles } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';

export default function NotFound() {
  const { user } = useApp();

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <div className="mx-auto w-full max-w-content px-4 py-6 sm:px-8">
        <Link to="/" aria-label="StockSense home" className="inline-flex min-h-11 items-center">
          <Logo size="sm" />
        </Link>
      </div>
      <main className="flex flex-1 items-center justify-center px-4 pb-20">
        <div className="max-w-[420px] text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-tint text-primary-ink">
            <Compass size={24} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-ink">404 · Not found</p>
          <h1 className="mt-2 font-display text-[28px] font-semibold text-ink">This shelf is empty.</h1>
          <p className="mt-2 text-[14px] text-muted">The page you are looking for moved or never existed. Everything else is right where you left it.</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <Link to="/" className={buttonStyles()}>
              <ArrowLeft size={16} aria-hidden="true" />
              Back home
            </Link>
            <Link to={user ? '/dashboard' : '/login'} className={buttonStyles({ variant: 'secondary' })}>
              {user ? 'Go to dashboard' : 'Log in'}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
