import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Boxes,
  ChevronLeft,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Plus,
  Sun,
  Trash2,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { cn, initials } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload bill', icon: Plus },
  { to: '/items', label: 'Items', icon: Boxes },
  { to: '/wastage', label: 'Wastage', icon: Trash2 },
  { to: '/report', label: 'AI report', icon: FileText },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut, theme, toggleTheme, sidebarCollapsed, setSidebarCollapsed } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'group flex items-center gap-3 rounded-input px-3 py-2.5 text-[14px] font-medium transition-colors duration-150',
      'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-ring',
      isActive ? 'bg-primary text-navy' : 'text-on-navy-muted hover:bg-white/5 hover:text-on-navy',
      sidebarCollapsed && 'lg:justify-center lg:px-0',
    );

  return (
    <div className="min-h-screen bg-bg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-input focus:bg-surface focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden flex-col bg-navy transition-[width] duration-200 lg:flex',
          sidebarCollapsed ? 'w-[76px]' : 'w-[248px]',
        )}
      >
        <div className={cn('flex h-16 items-center border-b border-navy-700', sidebarCollapsed ? 'justify-center px-3' : 'px-5')}>
          <NavLink to="/dashboard" aria-label="StockSense dashboard" className="focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-ring">
            {sidebarCollapsed ? (
              <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-white/10">
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] text-mint" fill="none" aria-hidden="true">
                  <path d="M4 16.5 8.5 12l3 3L18 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="18" cy="8" r="2" fill="currentColor" />
                </svg>
              </span>
            ) : (
              <Logo onDark size="sm" />
            )}
          </NavLink>
        </div>

        <nav aria-label="Main navigation" className="flex-1 space-y-1 px-3 py-5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={navLinkClass} title={sidebarCollapsed ? label : undefined}>
              <Icon size={20} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
              {!sidebarCollapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-navy-700 px-3 py-4">
          <button
            type="button"
            onClick={toggleTheme}
            className={cn(
              'flex w-full items-center gap-3 rounded-input px-3 py-2.5 text-[14px] text-on-navy-muted transition-colors hover:bg-white/5 hover:text-on-navy focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-ring',
              sidebarCollapsed && 'justify-center px-0',
            )}
          >
            {theme === 'light' ? <Moon size={20} strokeWidth={1.5} aria-hidden="true" /> : <Sun size={20} strokeWidth={1.5} aria-hidden="true" />}
            {!sidebarCollapsed && <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>}
          </button>

          <div className={cn('mt-2 flex items-center gap-2.5 rounded-input bg-white/5 p-2', sidebarCollapsed && 'justify-center bg-transparent p-0')}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[12px] font-semibold text-mint">
              {initials(user?.name || 'Guest')}
            </span>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-on-navy">{user?.name || 'Guest'}</p>
                <p className="truncate text-[11px] text-on-navy-muted">{user?.shop || 'Your shop'}</p>
              </div>
            )}
            {!sidebarCollapsed && (
              <button
                type="button"
                onClick={handleSignOut}
                aria-label="Sign out"
                className="flex h-8 w-8 items-center justify-center rounded-full text-on-navy-muted transition-colors hover:bg-white/10 hover:text-on-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
              >
                <LogOut size={15} aria-hidden="true" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="mt-1 flex h-9 w-full items-center justify-center rounded-input text-on-navy-muted transition-colors hover:bg-white/5 hover:text-on-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
          >
            <ChevronLeft size={18} className={cn('transition-transform', sidebarCollapsed && 'rotate-180')} aria-hidden="true" />
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-surface/90 px-4 backdrop-blur lg:hidden">
        <NavLink to="/dashboard" aria-label="StockSense dashboard" className="flex h-11 items-center rounded-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <Logo size="sm" />
        </NavLink>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {theme === 'light' ? <Moon size={19} strokeWidth={1.5} /> : <Sun size={19} strokeWidth={1.5} />}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-[rgb(15_23_42_/_0.5)]" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <div className="absolute inset-y-0 right-0 flex w-[280px] animate-rise-in flex-col bg-navy p-4">
            <div className="flex items-center justify-between pb-4">
              <Logo onDark size="sm" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-full text-on-navy-muted hover:bg-white/10 hover:text-on-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
              >
                <X size={18} />
              </button>
            </div>
            <nav aria-label="Mobile navigation" className="space-y-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="mt-auto border-t border-navy-700 pt-4">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[12px] font-semibold text-mint">
                  {initials(user?.name || 'Guest')}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-on-navy">{user?.name || 'Guest'}</p>
                  <p className="truncate text-[11px] text-on-navy-muted">{user?.email || 'Not signed in'}</p>
                </div>
              </div>
              <Button variant="secondary" fullWidth onClick={handleSignOut} className="border-navy-700 bg-transparent text-on-navy hover:bg-white/5">
                <LogOut size={16} aria-hidden="true" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={cn('transition-[padding] duration-200', sidebarCollapsed ? 'lg:pl-[76px]' : 'lg:pl-[248px]')}>
        <main id="main" className="mx-auto w-full max-w-content px-4 pb-24 pt-6 sm:px-8 sm:pt-8 lg:pb-12">
          {children}
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <ul className="grid grid-cols-5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 py-1.5 text-[12px] font-medium leading-none transition-colors',
                    isActive ? 'text-primary-ink' : 'text-muted hover:text-ink',
                  )
                }
              >
                <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                <span className="truncate">{label === 'Upload bill' ? 'Upload' : label === 'AI report' ? 'Report' : label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow mb-1.5">{eyebrow}</p>
        <h1 className="font-display text-h1 font-semibold text-ink">{title}</h1>
        {description && <p className="mt-1 max-w-[65ch] text-[14px] text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
