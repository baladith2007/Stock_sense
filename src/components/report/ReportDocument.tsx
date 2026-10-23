import { forwardRef, type CSSProperties } from 'react';
import { CloudRain, Sparkles } from 'lucide-react';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Logo } from '@/components/ui/Logo';
import {
  getRecommendation,
  sortedByPriority,
  statusLabel,
  stockValue,
  totalWastage,
  weather,
  type Item,
  type StockStatus,
  type WastageEntry,
} from '@/lib/data';
import { compactCurrency, formatCurrency, formatDate } from '@/lib/utils';

const toneByStatus: Record<StockStatus, BadgeTone> = {
  critical: 'critical',
  low: 'low',
  ok: 'ok',
  overstock: 'overstock',
};

const reportTokens = {
  '--bg': '#F8FAFC',
  '--surface': '#FFFFFF',
  '--surface-soft': '#F1F5F9',
  '--border': '#E2E8F0',
  '--text': '#0F172A',
  '--text-muted': '#64748B',
  '--text-muted-strong': '#5F6F85',
  '--primary': '#10B981',
  '--primary-hover': '#059669',
  '--primary-ink': '#047857',
  '--primary-tint': '#ECFDF5',
  '--primary-ring': '#A7F3D0',
  '--accent': '#F59E0B',
  '--accent-tint': '#FFFBEB',
  '--accent-ink': '#B45309',
  '--danger': '#EF4444',
  '--danger-tint': '#FEF2F2',
  '--danger-ink': '#B91C1C',
  '--info': '#0EA5E9',
  '--info-tint': '#F0F9FF',
  '--info-ink': '#0369A1',
  '--navy-900': '#0F172A',
  '--navy-800': '#1E293B',
  '--navy-700': '#334155',
  '--on-navy': '#F1F5F9',
  '--on-navy-muted': '#94A3B8',
  '--mint': '#6EE7B7',
} as CSSProperties;

export const ReportDocument = forwardRef<
  HTMLDivElement,
  { items: Item[]; wastage: WastageEntry[]; shop: string; location: string }
>(function ReportDocument({ items, wastage, shop, location }, ref) {
  const ranked = sortedByPriority(items).filter((item) => getRecommendation(item).status !== 'overstock');
  const rows = ranked.slice(0, 6);
  const orderValue = rows.reduce((sum, item) => {
    const rec = getRecommendation(item);
    return sum + rec.reorderQty * item.costPerUnit;
  }, 0);
  const attention = items.filter((item) => ['critical', 'low'].includes(getRecommendation(item).status)).length;
  const wasted = totalWastage(wastage);

  return (
    <div
      ref={ref}
      style={{ ...reportTokens, width: 1080 }}
      className="overflow-hidden bg-surface font-sans text-ink"
      role="img"
      aria-label="Stock health report preview"
    >
      <header className="report-gradient px-14 pb-10 pt-12 text-on-navy">
        <div className="flex items-start justify-between">
          <Logo onDark size="lg" />
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-mint">Stock health report</p>
            <p className="mt-1.5 text-[13px] text-on-navy-muted">{formatDate(new Date(), { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        <h1 className="mt-12 max-w-[16ch] font-display text-[46px] font-bold leading-[1.08] text-on-navy">
          Your shelf, <span className="text-mint">clearly in focus.</span>
        </h1>
        <p className="mt-4 text-[15px] text-on-navy-muted">
          Prepared for <span className="font-medium text-on-navy">{shop}</span> · {location}
        </p>

        <div className="mt-10 flex gap-20 border-t border-navy-700 pt-6">
          {[
            { label: 'Stock value', value: compactCurrency(stockValue(items)) },
            { label: 'Items tracked', value: String(items.length) },
            { label: 'Needs attention', value: `${attention} items` },
            { label: 'Wastage this month', value: compactCurrency(wasted) },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="tnum font-display text-[26px] font-bold leading-none text-on-navy">{stat.value}</p>
              <p className="mt-1.5 text-[11px] text-on-navy-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </header>

      <div className="bg-surface px-14 py-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-primary-ink">Order recommendations</p>
            <h2 className="mt-1 font-display text-[26px] font-semibold leading-tight text-ink">What to order next</h2>
            <p className="mt-1.5 text-[13px] text-muted">Based on average daily sales and six days of cover.</p>
          </div>
          {attention > 0 && <Badge tone="critical">{attention} need attention</Badge>}
        </div>

        <table className="mt-6 w-full border-collapse text-left" aria-label="Order recommendations">
          <thead>
            <tr className="bg-surface-soft">
              <th className="rounded-l-md px-4 py-3 text-[11px] font-semibold text-muted-strong">Item</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold text-muted-strong">Days left</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold text-muted-strong">Order</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-muted-strong">Why</th>
              <th className="rounded-r-md px-4 py-3 text-right text-[11px] font-semibold text-muted-strong">Est. cost</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => {
              const rec = getRecommendation(item);
              return (
                <tr key={item.id} className="border-b border-line">
                  <td className="px-4 py-3.5">
                    <p className="text-[14px] font-medium text-ink">{item.name}</p>
                    <p className="text-[11px] text-muted">{item.category}</p>
                  </td>
                  <td className="tnum px-4 py-3.5 text-right text-[14px] text-ink">{Math.max(0, Math.round(rec.daysLeft))}</td>
                  <td className="tnum px-4 py-3.5 text-right text-[14px] font-semibold text-ink">
                    {rec.reorderQty} <span className="text-[11px] font-normal text-muted">{item.unit}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge tone={toneByStatus[rec.status]}>{statusLabel[rec.status]}</Badge>
                  </td>
                  <td className="tnum px-4 py-3.5 text-right text-[14px] text-ink">
                    {formatCurrency(rec.reorderQty * item.costPerUnit)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-primary-tint">
              <td colSpan={4} className="rounded-l-md px-4 py-3.5 text-[13px] font-semibold text-primary-ink">
                Estimated order value
              </td>
              <td className="tnum rounded-r-md px-4 py-3.5 text-right font-display text-[17px] font-bold text-primary-ink">
                {formatCurrency(orderValue)}
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="rounded-card border border-line bg-surface p-5">
            <p className="text-[11px] text-muted">Days of cover</p>
            <p className="tnum mt-1.5 font-display text-[22px] font-bold text-ink">6 days</p>
            <p className="mt-0.5 text-[11px] text-muted">per order cycle</p>
          </div>
          <div className="rounded-card border border-line bg-surface p-5">
            <p className="text-[11px] text-muted">Wastage this month</p>
            <p className="tnum mt-1.5 font-display text-[22px] font-bold text-ink">{formatCurrency(wasted)}</p>
            <p className="mt-0.5 text-[11px] text-primary-ink">Down 18% vs last month</p>
          </div>
          <div className="rounded-card border border-line bg-surface p-5">
            <p className="text-[11px] text-muted">Top risk</p>
            <p className="mt-1.5 truncate font-display text-[18px] font-semibold text-ink">{rows[0]?.name || 'All clear'}</p>
            <p className="mt-0.5 text-[11px] text-accent-ink">
              {rows[0] ? `Runs out in ${Math.max(0, Math.round(getRecommendation(rows[0]).daysLeft))} days` : 'Nothing urgent'}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-card bg-info-tint p-4">
          <CloudRain size={16} className="mt-0.5 shrink-0 text-info" aria-hidden="true" />
          <p className="text-[12px] leading-relaxed text-ink">
            <span className="font-semibold">Weather note:</span> {weather.advice}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
          <div className="flex items-center gap-1.5 text-[11px] text-muted">
            <Sparkles size={12} className="text-primary-ink" aria-hidden="true" />
            Generated by StockSense · stocksense.app
          </div>
          <p className="text-[11px] text-muted">Page 1 of 1</p>
        </div>
      </div>
    </div>
  );
});

ReportDocument.displayName = 'ReportDocument';
