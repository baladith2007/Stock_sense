import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Clock3,
  PackageCheck,
  Sparkles,
  TrendingDown,
  X,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { buttonStyles } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';

const steps = [
  { n: '01', title: 'Snap your bill', line: 'Photograph any supplier bill.' },
  { n: '02', title: 'We read it', line: 'Items, rates and quantities extracted.' },
  { n: '03', title: "See what's low", line: 'Stock and days left, at a glance.' },
  { n: '04', title: 'Know what’s wasted', line: 'Track spoilage and its cost.' },
  { n: '05', title: 'Order with confidence', line: 'Exact quantities, ready to send.' },
];

const before = [
  'Guessing what is running out',
  'Bills stacked in a drawer',
  'Spoiled stock found too late',
  'Cash tied up in overstock',
];

const after = [
  'Every item counted, with days left',
  'Bills become stock in seconds',
  'Wastage tracked, not discovered',
  'Order exactly what sells',
];

const benefits = [
  {
    icon: Clock3,
    title: 'Never miss a sale',
    body: 'A quiet alert when an item has two days left — not two hours.',
  },
  {
    icon: TrendingDown,
    title: 'Waste less',
    body: 'See slow movers and spoilage before they quietly cost you money.',
  },
  {
    icon: PackageCheck,
    title: 'Decide in seconds',
    body: 'One clear order list, instead of a walk around the shelf.',
  },
];

function PhonePreview() {
  return (
    <div className="relative" aria-hidden="true">
      <div className="relative z-10 w-[272px] rounded-[40px] border border-white/15 bg-navy-800 p-2.5 sm:w-[306px]">
        <div className="overflow-hidden rounded-[32px] bg-bg p-4 text-ink">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-navy">
                <svg viewBox="0 0 24 24" className="h-3 w-3 text-mint" fill="none" aria-hidden="true">
                  <path d="M4 16.5 8.5 12l3 3L18 8" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-[10px] font-semibold">StockSense</span>
            </span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-tint text-[7px] font-semibold text-primary-ink">
              AS
            </span>
          </div>

          <p className="mt-4 text-[8px] text-muted">Good morning, Aarav</p>
          <p className="font-display text-[15px] font-semibold leading-tight">Today&apos;s shelf, sorted.</p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-line bg-surface p-2">
              <p className="text-[7px] text-muted">Stock value</p>
              <p className="tnum mt-0.5 font-display text-[13px] font-bold">₹24.6k</p>
              <p className="mt-0.5 text-[6px] font-medium text-primary-ink">+8% this week</p>
            </div>
            <div className="rounded-lg border border-line bg-surface p-2">
              <p className="text-[7px] text-muted">Needs attention</p>
              <p className="tnum mt-0.5 font-display text-[13px] font-bold">4 items</p>
              <p className="mt-0.5 text-[6px] font-medium text-accent-ink">3 critical</p>
            </div>
          </div>

          <div className="mt-3 rounded-lg border border-line bg-surface p-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[7px] font-semibold">Sales this week</p>
              <p className="text-[6px] text-muted">₹2.04L</p>
            </div>
            <div className="mt-2 flex h-11 items-end gap-1">
              {[38, 52, 30, 46, 58, 68, 73].map((height, index) => (
                <span
                  key={index}
                  className={index === 6 ? 'flex-1 rounded-sm bg-primary' : 'flex-1 rounded-sm bg-primary opacity-60'}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          <div className="mt-2.5 rounded-lg bg-navy p-3 text-on-navy">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-accent px-1.5 py-0.5 text-[5px] font-bold uppercase tracking-wider text-navy">Critical</span>
              <span className="text-[5px] uppercase tracking-wider text-on-navy-muted">Top priority</span>
            </div>
            <p className="mt-2 text-[6px] text-on-navy-muted">Milk 1L</p>
            <p className="tnum font-display text-[18px] font-bold leading-none text-mint">48 <span className="text-[7px] font-medium text-on-navy-muted">pkt</span></p>
            <p className="mt-1 text-[7px] leading-snug text-on-navy">Order 48 units — run out in 2 days.</p>
          </div>

          <div className="mt-2 space-y-1.5">
            {[
              { name: 'Curd 400g', meta: '2 days left', tone: 'bg-accent' },
              { name: 'Atta 5kg', meta: '4 days left', tone: 'bg-accent' },
            ].map((row) => (
              <div key={row.name} className="flex items-center gap-2 rounded-lg border border-line bg-surface px-2 py-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${row.tone}`} aria-hidden="true" />
                <span className="text-[7px] font-medium">{row.name}</span>
                <span className="ml-auto text-[6px] text-muted">{row.meta}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -left-6 bottom-16 z-20 hidden items-center gap-2 rounded-card border border-line bg-surface px-3 py-2 sm:flex">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-tint text-primary-ink">
          <TrendingDown size={14} aria-hidden="true" />
        </span>
        <div>
          <p className="text-[11px] font-semibold leading-tight text-ink">Wastage down 18%</p>
          <p className="text-[9px] text-muted">vs. last month</p>
        </div>
      </div>

      <div className="absolute -right-2 top-20 z-20 hidden items-center gap-1.5 rounded-full border border-white/15 bg-navy-800/90 px-3 py-1.5 text-[10px] font-medium text-on-navy backdrop-blur sm:flex">
        <Sparkles size={12} className="text-mint" aria-hidden="true" />
        AI order ready
      </div>
    </div>
  );
}

export default function Landing() {
  const { user, setOpenPreferences } = useApp();

  return (
    <div className="min-h-screen bg-bg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-input focus:bg-surface focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>

      <header className="hero-gradient relative overflow-hidden">
        <div className="relative z-10 mx-auto flex h-20 max-w-content items-center justify-between px-4 sm:px-8">
          <Link to="/" className="inline-flex min-h-11 items-center rounded-input focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-ring" aria-label="StockSense home">
            <Logo onDark />
          </Link>

          <nav aria-label="Landing" className="hidden items-center gap-8 md:flex">
            <a href="#how" className="inline-flex min-h-11 items-center text-[14px] text-on-navy-muted transition-colors hover:text-on-navy">
              How it works
            </a>
            <a href="#why" className="inline-flex min-h-11 items-center text-[14px] text-on-navy-muted transition-colors hover:text-on-navy">
              Why StockSense
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <Link to="/dashboard" className={buttonStyles({ size: 'sm' })}>
                Open dashboard
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden h-9 items-center rounded-input px-3 text-[13px] font-medium text-on-navy-muted transition-colors hover:bg-white/5 hover:text-on-navy focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-ring sm:flex"
                >
                  Log in
                </Link>
                <Link to="/signup" className={buttonStyles({ size: 'sm' })}>
                  Start free trial
                </Link>
              </>
            )}
          </div>
        </div>

        <div id="main" className="relative z-10 mx-auto grid max-w-content items-center gap-14 px-4 pb-20 pt-10 sm:px-8 sm:pb-24 sm:pt-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:pb-28">
          <div className="animate-fade-in">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-mint">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" aria-hidden="true" />
              Inventory, but calm
            </p>
            <h1 className="mt-5 max-w-[13ch] font-display text-[40px] font-bold leading-[1.05] text-on-navy sm:text-[52px] lg:text-display-lg">
              Know your stock.
              <br />
              <span className="text-mint">Never miss a sale.</span>
            </h1>
            <p className="mt-5 max-w-[48ch] text-[15px] leading-relaxed text-on-navy-muted sm:text-[17px]">
              StockSense reads your purchase bills, tracks every item and tells you exactly what to order — before you run out.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/signup" className={buttonStyles({ size: 'lg', className: 'group' })}>
                Start 3-month free trial
                <ArrowRight size={18} className="transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <Link
                to="/login"
                className={buttonStyles({
                  size: 'lg',
                  variant: 'secondary',
                  className: 'border-white/20 bg-transparent text-on-navy hover:bg-white/10 hover:text-on-navy',
                })}
              >
                Login
              </Link>
            </div>
            <p className="mt-4 text-[12px] text-on-navy-muted">No card needed · Set up in 4 minutes · Cancel anytime</p>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div
              className="pointer-events-none absolute inset-0 -z-0 rounded-full bg-primary opacity-[0.12] blur-[90px]"
              aria-hidden="true"
            />
            <PhonePreview />
          </div>
        </div>
      </header>

      <section aria-label="Results at a glance" className="border-b border-line bg-surface">
        <div className="mx-auto grid max-w-content grid-cols-1 divide-y divide-line px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
          {[
            { value: '18%', label: 'less wastage on average' },
            { value: '4 min', label: 'from sign-up to first bill' },
            { value: '1 photo', label: 'to update your whole stock' },
          ].map((stat) => (
            <div key={stat.value} className="flex items-baseline gap-3 py-6 first:pt-6 last:pb-6 sm:flex-col sm:items-start sm:gap-1 sm:px-8 sm:py-8 sm:first:pl-0 sm:last:pr-0">
              <p className="tnum font-display text-[24px] font-bold text-ink">{stat.value}</p>
              <p className="text-[13px] text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="scroll-mt-20">
        <div className="mx-auto max-w-content px-4 py-20 sm:px-8 sm:py-28">
          <div className="max-w-[620px]">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-2 font-display text-[28px] font-semibold leading-tight text-ink sm:text-[32px]">
              From a paper bill to a calm shelf, in five steps.
            </h2>
            <p className="mt-3 text-[15px] text-muted">No spreadsheets. No stock-taking marathons. Just one photo and a clear next step.</p>
          </div>

          <ol className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step) => (
              <li key={step.n} className="border-t-2 border-primary pt-4">
                <p className="tnum text-[12px] font-semibold text-primary-ink">{step.n}</p>
                <h3 className="mt-1.5 text-[15px] font-semibold text-ink">{step.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{step.line}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="why" className="scroll-mt-20 border-y border-line bg-surface">
        <div className="mx-auto max-w-content px-4 py-20 sm:px-8 sm:py-28">
          <div className="max-w-[620px]">
            <p className="eyebrow">The difference</p>
            <h2 className="mt-2 font-display text-[28px] font-semibold leading-tight text-ink sm:text-[32px]">
              From guesswork to a quiet, confident shop.
            </h2>
            <p className="mt-3 text-[15px] text-muted">Most shops run on memory. StockSense turns that memory into a simple, reliable picture.</p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            <div className="rounded-card border border-line bg-bg p-6 sm:p-8">
              <span className="inline-flex rounded-full bg-surface-soft px-3 py-1 text-[12px] font-semibold text-muted-strong">Before</span>
              <h3 className="mt-4 font-display text-[20px] font-semibold text-ink">Running on memory</h3>
              <ul className="mt-4 space-y-3">
                {before.map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-[14px] text-muted">
                    <X size={16} className="mt-1 shrink-0 text-muted/70" aria-hidden="true" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-card border border-primary-ring bg-primary-tint p-6 sm:p-8">
              <span className="inline-flex rounded-full bg-surface px-3 py-1 text-[12px] font-semibold text-primary-ink">After StockSense</span>
              <h3 className="mt-4 font-display text-[20px] font-semibold text-ink">Running on facts</h3>
              <ul className="mt-4 space-y-3">
                {after.map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-[14px] text-ink">
                    <Check size={16} className="mt-1 shrink-0 text-primary-ink" aria-hidden="true" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {benefits.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-card border border-line bg-surface p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-soft text-primary-ink">
                  <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[15px] font-semibold text-ink">{title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-20 sm:px-8 sm:py-24">
        <div className="rounded-card bg-navy px-6 py-12 text-center sm:px-12 sm:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-mint">Ready when you are</p>
          <h2 className="mx-auto mt-3 max-w-[18ch] font-display text-[28px] font-semibold leading-tight text-on-navy sm:text-[34px]">
            Your shelf, finally in focus.
          </h2>
          <p className="mx-auto mt-3 max-w-[46ch] text-[14px] text-on-navy-muted">
            Start free for three months. Keep the calm after.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/signup" className={buttonStyles({ size: 'lg' })}>
              Start 3-month free trial
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              to="/login"
              className={buttonStyles({
                size: 'lg',
                variant: 'secondary',
                className: 'border-white/20 bg-transparent text-on-navy hover:bg-white/10 hover:text-on-navy',
              })}
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-content flex-col gap-5 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <Logo size="sm" />
            <p className="mt-2 text-[12px] text-muted">Smart stock for small shops. Made in India.</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 text-[12px] text-muted">
            <Link to="/privacy" className="inline-flex min-h-11 items-center transition-colors hover:text-ink hover:underline">
              Privacy
            </Link>
            <Link to="/terms" className="inline-flex min-h-11 items-center transition-colors hover:text-ink hover:underline">
              Terms
            </Link>
            <button type="button" onClick={() => setOpenPreferences(true)} className="inline-flex min-h-11 items-center transition-colors hover:text-ink hover:underline">
              Cookie preferences
            </button>
            <span className="text-muted">© {new Date().getFullYear()} StockSense</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
