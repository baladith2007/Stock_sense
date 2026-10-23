import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  Calculator,
  Check,
  ChevronDown,
  CloudRain,
  CloudSun,
  Download,
  Droplets,
  Eye,
  Thermometer,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { PageHeader } from '@/components/layout/AppShell';
import { ReportDocument } from '@/components/report/ReportDocument';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/ui/Table';
import { useApp } from '@/context/AppContext';
import { useElementWidth } from '@/lib/hooks';
import {
  getRecommendation,
  sortedByPriority,
  statusLabel,
  totalWastage,
  weather,
  type Item,
  type StockStatus,
  type WastageEntry,
} from '@/lib/data';
import { compactCurrency, formatCurrency, formatDate } from '@/lib/utils';

interface PreviewProps {
  items: Item[];
  wastage: WastageEntry[];
  shop: string;
  location: string;
  className?: string;
}

const ReportPreview = forwardRef<HTMLDivElement, PreviewProps>(function ReportPreview(
  { items, wastage, shop, location, className },
  forwardedRef,
) {
  const { ref: containerRef, width } = useElementWidth<HTMLDivElement>();
  const scaleRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const node = scaleRef.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setHeight(entry.contentRect.height);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const scale = width ? Math.min(1, Math.max(0, width - 2) / 1080) : 0;
  const frameHeight = height && scale ? Math.ceil(height * scale) + 2 : 320;

  return (
    <div ref={containerRef} className={className} style={{ height: frameHeight }}>
      <div
        className="relative w-full overflow-hidden rounded-input border border-line bg-surface-soft"
        style={{ height: frameHeight }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ transform: `scale(${scale})`, visibility: scale ? 'visible' : 'hidden' }}
        >
          <div ref={scaleRef}>
            <ReportDocument ref={forwardedRef} items={items} wastage={wastage} shop={shop} location={location} />
          </div>
        </div>
      </div>
    </div>
  );
});

const statusTone: Record<StockStatus, 'critical' | 'low' | 'ok' | 'overstock'> = {
  critical: 'critical',
  low: 'low',
  ok: 'ok',
  overstock: 'overstock',
};

function InlineStat({ label, value, action }: { label: string; value: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 last:border-b-0">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="tnum text-right text-[14px] font-semibold text-ink">{value}</span>
      {action}
    </div>
  );
}

export default function AIReport() {
  const { items, wastage, user, pushToast } = useApp();
  const reportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const shop = user?.shop || 'Sharma General Store';

  const ranked = useMemo(
    () => sortedByPriority(items).filter((item) => getRecommendation(item).status !== 'overstock'),
    [items],
  );
  const rows = ranked.slice(0, 6);
  const attention = items.filter((item) => ['critical', 'low'].includes(getRecommendation(item).status)).length;
  const orderValue = rows.reduce((sum, item) => sum + getRecommendation(item).reorderQty * item.costPerUnit, 0);
  const wasted = totalWastage(wastage);

  const download = async () => {
    const node = reportRef.current;
    if (!node) {
      pushToast({
        kind: 'error',
        title: 'Report is still preparing',
        description: 'Give the preview a moment, then try again.',
      });
      return;
    }
    setDownloading(true);
    try {
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 1,
        width: 1080,
        backgroundColor: '#ffffff',
      });
      const blob = await fetch(dataUrl).then((response) => response.blob());
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `stocksense-report-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = objectUrl;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      pushToast({ kind: 'success', title: 'Report downloaded', description: 'A 1080 px PNG, ready to share or print.' });
    } catch {
      pushToast({ kind: 'error', title: 'Could not create the image', description: 'Please try again in a moment.' });
    } finally {
      setDownloading(false);
    }
  };

  const previewProps: PreviewProps = {
    items,
    wastage,
    shop,
    location: weather.location,
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="AI report"
        title="Your stock report"
        description={`A clean picture of your shelf, prepared ${formatDate(new Date(), { day: 'numeric', month: 'long' })}. Share it, print it, or keep it for the week.`}
        action={
          <Button onClick={download} loading={downloading} loadingLabel="Preparing">
            <Download size={17} aria-hidden="true" />
            Download image
          </Button>
        }
      />

      <Card className="border-line bg-info-tint p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-info">
              <CloudSun size={18} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <div>
              <p className="text-[13px] font-semibold text-ink">{weather.condition}</p>
              <p className="text-caption text-muted-strong">{weather.location} · today</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] font-medium text-ink">
              <Thermometer size={13} className="text-info" aria-hidden="true" />
              <span className="tnum">{weather.temperature}°C</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] font-medium text-ink">
              <CloudRain size={13} className="text-info" aria-hidden="true" />
              <span className="tnum">{weather.rainChance}% rain</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] font-medium text-ink">
              <Droplets size={13} className="text-info" aria-hidden="true" />
              <span className="tnum">{weather.humidity}% humidity</span>
            </span>
          </div>

          <p className="w-full text-[12px] leading-relaxed text-ink sm:ml-auto sm:w-auto sm:max-w-[300px]">{weather.advice}</p>
        </div>
      </Card>

      <details className="group mt-4 rounded-card border border-line bg-surface">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-ring [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2 text-[14px] font-medium text-ink">
            <Calculator size={16} className="text-primary-ink" aria-hidden="true" />
            How we calculated this
          </span>
          <ChevronDown size={16} className="text-muted transition-transform duration-150 group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="space-y-3 border-t border-line px-5 py-4">
          <p className="text-[13px] leading-relaxed text-muted">
            <span className="font-medium text-ink">Days left</span> = stock available ÷ average daily sales.
          </p>
          <p className="text-[13px] leading-relaxed text-muted">
            <span className="font-medium text-ink">Order quantity</span> = (average daily sales × 6 days of cover) − stock available.
            We round up and never suggest a negative order.
          </p>
          <p className="text-[13px] leading-relaxed text-muted">
            <span className="font-medium text-ink">Weather adjustment</span> = dairy cover is shortened by 20% when humidity is above 65%.
          </p>
          <div className="tnum rounded-input bg-surface-soft px-3.5 py-3 font-mono text-[12px] leading-relaxed text-ink">
            Milk 1L: 24 ÷ 12 = 2 days left → (12 × 6) − 24 = 48 pkt
          </div>
        </div>
      </details>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2" padded={false}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
            <div>
              <h2 className="font-display text-h2 font-semibold text-ink">Recommended orders</h2>
              <p className="mt-0.5 text-[13px] text-muted">Next 6 days of cover · {rows.length} items</p>
            </div>
            {attention > 0 ? <Badge tone="critical" dot>{attention} need attention</Badge> : <Badge tone="ok" dot>All healthy</Badge>}
          </div>

          {rows.length === 0 ? (
            <EmptyState
              icon={Check}
              title="Nothing needs ordering"
              description="Every item has more than 30 days of cover. Upload a new bill when stock changes."
            />
          ) : (
            <>
              <div className="hidden sm:block">
                <Table label="Recommended orders">
                  <TableHead>
                    <TableRow className="hover:bg-surface-soft">
                      <TableHeaderCell>Item</TableHeaderCell>
                      <TableHeaderCell className="text-right">Days left</TableHeaderCell>
                      <TableHeaderCell className="text-right">Order qty</TableHeaderCell>
                      <TableHeaderCell>Why</TableHeaderCell>
                      <TableHeaderCell className="text-right">Est. cost</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((item) => {
                      const rec = getRecommendation(item);
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <p className="font-medium text-ink">{item.name}</p>
                            <p className="text-caption text-muted">{item.category}</p>
                          </TableCell>
                          <TableCell className="tnum text-right">{Math.max(0, Math.round(rec.daysLeft))}</TableCell>
                          <TableCell className="tnum text-right font-semibold">
                            {rec.reorderQty} <span className="text-[12px] font-normal text-muted">{item.unit}</span>
                          </TableCell>
                          <TableCell>
                            <Badge tone={statusTone[rec.status]} dot>
                              {statusLabel[rec.status]}
                            </Badge>
                          </TableCell>
                          <TableCell className="tnum text-right">{formatCurrency(rec.reorderQty * item.costPerUnit)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="divide-y divide-line sm:hidden">
                {rows.map((item) => {
                  const rec = getRecommendation(item);
                  return (
                    <div key={item.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[14px] font-medium text-ink">{item.name}</p>
                          <p className="text-caption text-muted">{item.category}</p>
                        </div>
                        <Badge tone={statusTone[rec.status]} dot>
                          {statusLabel[rec.status]}
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[13px]">
                        <span className="text-muted">
                          Order <span className="tnum font-semibold text-ink">{rec.reorderQty} {item.unit}</span> · {Math.max(0, Math.round(rec.daysLeft))} days left
                        </span>
                        <span className="tnum font-medium text-ink">{formatCurrency(rec.reorderQty * item.costPerUnit)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between rounded-b-card border-t border-line bg-primary-tint px-5 py-3.5">
                <span className="text-[13px] font-semibold text-primary-ink">Estimated order value</span>
                <span className="tnum font-display text-[17px] font-bold text-primary-ink">{formatCurrency(orderValue)}</span>
              </div>
            </>
          )}
        </Card>

        <div className="space-y-4">
          <Card padded={false}>
            <div className="border-b border-line px-5 py-4">
              <h2 className="font-display text-h2 font-semibold text-ink">This week</h2>
              <p className="mt-0.5 text-[13px] text-muted">The numbers behind the report</p>
            </div>
            <InlineStat label="Stock value" value={compactCurrency(items.reduce((sum, item) => sum + item.stockAvailable * item.costPerUnit, 0))} />
            <InlineStat label="Order value" value={compactCurrency(orderValue)} />
            <InlineStat label="Wastage this month" value={<span className="text-accent-ink">{formatCurrency(wasted)}</span>} />
            <InlineStat label="Critical items" value={`${items.filter((item) => getRecommendation(item).status === 'critical').length}`} />
          </Card>

          <div className="rounded-card border border-line bg-surface p-5">
            <p className="text-[13px] font-semibold text-ink">A note on the weather</p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">
              Warm, humid days shorten dairy shelf life. The report already adjusts cover — but sell curd and milk first today.
            </p>
          </div>
        </div>
      </div>

      <Card className="mt-4">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="eyebrow">Shareable report</p>
            <h2 className="mt-2 font-display text-[22px] font-semibold text-ink">Ready for WhatsApp or print</h2>
            <p className="mt-2 max-w-[42ch] text-[14px] leading-relaxed text-muted">
              One clean image with your date, location, top order recommendations and the estimated order value.
            </p>
            <ul className="mt-4 space-y-2">
              {['Today’s date and shop location', 'Top 6 order recommendations', 'Estimated order value', 'Weather note for perishables'].map((line) => (
                <li key={line} className="flex items-start gap-2 text-[13px] text-muted">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary-ink">
                    <Check size={10} strokeWidth={3} aria-hidden="true" />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Button variant="secondary" onClick={() => setPreviewOpen(true)}>
                <Eye size={16} aria-hidden="true" />
                View report
              </Button>
              <Button variant="ghost" onClick={download} loading={downloading} loadingLabel="Preparing">
                <Download size={15} aria-hidden="true" />
                Download image
              </Button>
            </div>
            <p className="mt-3 text-caption text-muted">PNG · 1080 px wide · generated today</p>
          </div>

          <div className="rounded-card border border-line bg-surface-soft p-3 sm:p-4">
            <ReportPreview {...previewProps} ref={reportRef} />
            <p className="mt-2 text-center text-caption text-muted-strong">Preview · actual image is 1080 px wide</p>
          </div>
        </div>
      </Card>

      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Report preview"
        description="This is exactly what the downloaded PNG looks like."
        size="xl"
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={download} loading={downloading} loadingLabel="Preparing">
              <Download size={16} aria-hidden="true" />
              Download image
            </Button>
          </div>
        }
      >
        <ReportPreview {...previewProps} />
      </Modal>
    </div>
  );
}
