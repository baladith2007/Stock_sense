import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  Info,
  Plus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from 'recharts';
import { PageHeader } from '@/components/layout/AppShell';
import { buttonStyles } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { KpiCard } from '@/components/ui/KpiCard';
import { TopPriorityCard } from '@/components/ui/TopPriorityCard';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { useApp } from '@/context/AppContext';
import {
  chartData,
  getRecommendation,
  sortedByPriority,
  statusLabel,
  stockValue,
  totalWastage,
  type StockStatus,
} from '@/lib/data';
import { compactCurrency, formatDate } from '@/lib/utils';

const toneByStatus: Record<StockStatus, BadgeTone> = {
  critical: 'critical',
  low: 'low',
  ok: 'ok',
  overstock: 'overstock',
};

const dotByStatus: Record<StockStatus, string> = {
  critical: 'bg-accent',
  low: 'bg-accent',
  ok: 'bg-primary',
  overstock: 'bg-muted',
};

function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-input border border-line bg-surface px-3 py-2 text-[12px] shadow-float">
      <p className="mb-1 font-semibold text-ink">{label}</p>
      {payload.map((entry) => (
        <p key={String(entry.name)} className="flex items-center gap-2 text-muted">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: entry.name === 'Wastage' ? 'var(--accent)' : 'var(--primary)' }}
            aria-hidden="true"
          />
          {entry.name}: <span className="tnum font-medium text-ink">{compactCurrency(Number(entry.value))}</span>
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user, items, wastage } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageSkeleton />;

  const ranked = sortedByPriority(items);
  const top = ranked[0];
  const topRec = top ? getRecommendation(top) : null;
  const otherRecs = ranked.slice(1, 4);
  const critical = items.filter((item) => getRecommendation(item).status === 'critical').length;
  const attention = items.filter((item) => ['critical', 'low'].includes(getRecommendation(item).status)).length;
  const wasted = totalWastage(wastage);
  const totalSales = chartData.reduce((sum, day) => sum + day.sales, 0);
  const firstName = user?.name.split(' ')[0] || 'there';
  const today = formatDate(new Date(), { weekday: 'long', day: 'numeric', month: 'short' });

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow={`${user?.shop || 'Your shop'} · ${today}`}
        title={`Good morning, ${firstName}`}
        description={
          attention
            ? `${attention} items need attention today. ${top?.name || 'Your top seller'} will run out in ${Math.max(
                0,
                Math.round(topRec?.daysLeft || 0),
              )} days.`
            : 'Everything looks healthy today. Upload a bill to keep it that way.'
        }
        action={
          <Link to="/upload" className={buttonStyles()}>
            <Plus size={17} aria-hidden="true" />
            Upload bill
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <KpiCard
          label="Stock value"
          value={stockValue(items)}
          format={compactCurrency}
          trend={{ value: '+8.2%', direction: 'up' }}
          hint="vs last week"
        />
        <KpiCard
          label="Items tracked"
          value={items.length}
          trend={{ value: '+2', direction: 'up' }}
          hint="added this week"
        />
        <KpiCard
          label="Needs attention"
          value={attention}
          trend={{ value: `${critical} critical`, direction: 'down', positive: false }}
          hint="order soon"
        />
        <KpiCard
          label="Wastage this month"
          value={wasted}
          format={compactCurrency}
          trend={{ value: '−18%', direction: 'down', positive: true }}
          hint="vs last month"
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-h2 font-semibold text-ink">Sales &amp; wastage</h2>
              <p className="mt-1 text-[13px] text-muted">Last 7 days · 17–23 Oct</p>
            </div>
            <div className="text-right">
              <p className="tnum font-display text-[22px] font-bold text-ink">{compactCurrency(totalSales)}</p>
              <p className="text-caption text-muted">total sales</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-caption text-muted">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
              Sales
            </span>
            <span className="flex items-center gap-1.5 text-caption text-muted">
              <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              Wastage
            </span>
          </div>

          <div
            className="mt-4 h-[248px] w-full"
            role="img"
            aria-label="Bar chart of daily sales and wastage for the last seven days. Sales rise from 24,800 rupees on Saturday to 35,100 rupees on Friday, while wastage falls."
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 4" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  dy={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  tickFormatter={(value: number) => compactCurrency(value)}
                  width={58}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--surface-soft)' }} />
                <Bar dataKey="sales" name="Sales" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={38} />
                <Line
                  type="monotone"
                  dataKey="wastage"
                  name="Wastage"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <p className="flex items-center gap-2 text-[13px] text-muted">
              <TrendingUp size={16} className="text-primary-ink" aria-hidden="true" />
              Sales are up <span className="font-semibold text-ink">9%</span> and wastage is down{' '}
              <span className="font-semibold text-ink">18%</span> week on week.
            </p>
            <Badge tone="ok" dot>
              On track
            </Badge>
          </div>
        </Card>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-h2 font-semibold text-ink">AI recommendations</h2>
            <Link
              to="/items"
              className="inline-flex min-h-11 items-center gap-1 rounded text-[13px] font-medium text-primary-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              View all
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          {top && topRec ? (
            <TopPriorityCard
              itemName={top.name}
              quantity={topRec.reorderQty}
              unit={top.unit}
              message={topRec.suggestion}
              meta={`${top.supplier} · ${top.category}`}
              actionLabel="Review order"
              onAction={() => navigate('/items')}
            />
          ) : (
            <Card>
              <p className="text-[14px] text-muted">Add a bill to get your first recommendation.</p>
            </Card>
          )}

          <div className="mt-3 space-y-2.5">
            {otherRecs.map((item) => {
              const rec = getRecommendation(item);
              return (
                <Link
                  key={item.id}
                  to="/items"
                  className="group flex items-start gap-3 rounded-card border border-line bg-surface p-4 transition-colors duration-150 hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-ring"
                >
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotByStatus[rec.status]}`} aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-[14px] font-medium text-ink">{item.name}</p>
                      <Badge tone={toneByStatus[rec.status]}>{statusLabel[rec.status]}</Badge>
                    </div>
                    <p className="mt-0.5 text-[13px] leading-snug text-muted">{rec.suggestion}</p>
                  </div>
                  <ChevronRight
                    size={16}
                    className="mt-1 shrink-0 text-muted/60 transition-transform duration-150 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>

          <div className="mt-3 flex items-start gap-2.5 rounded-card border border-line bg-info-tint p-4">
            <Info size={16} className="mt-0.5 shrink-0 text-info" aria-hidden="true" />
            <p className="text-[12px] leading-relaxed text-ink">
              <span className="font-semibold">Weather nudge:</span> warm and humid this week. Move dairy to the front shelf.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-card border border-line bg-surface p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary-ink">
            <TrendingDown size={17} aria-hidden="true" />
          </span>
          <div>
            <p className="text-[14px] font-medium text-ink">You have stopped ₹{Math.round(wasted * 1.8)} of wastage this month.</p>
            <p className="mt-0.5 text-[13px] text-muted">Keep logging spoilage so recommendations stay accurate.</p>
          </div>
        </div>
        <Link
          to="/wastage"
          className="inline-flex min-h-11 items-center gap-1 rounded text-[13px] font-semibold text-primary-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Log wastage
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
