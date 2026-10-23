import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Camera,
  Check,
  CheckCircle2,
  FileImage,
  Plus,
  ScanLine,
  UploadCloud,
  X,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/ui/Table';
import { useApp } from '@/context/AppContext';
import type { Item } from '@/lib/data';
import { cn, uid } from '@/lib/utils';

interface ExtractedRow {
  id: string;
  name: string;
  rate: number;
  qty: number;
  confidence: number;
}

const initialRows: ExtractedRow[] = [
  { id: 'row_1', name: 'Milk 1L', rate: 52, qty: 120, confidence: 0.99 },
  { id: 'row_2', name: 'Basmati Rice', rate: 78, qty: 50, confidence: 0.96 },
  { id: 'row_3', name: 'Whole Wheat Atta 5kg', rate: 210, qty: 20, confidence: 0.93 },
  { id: 'row_4', name: 'Tea Powder 500g', rate: 190, qty: 30, confidence: 0.78 },
  { id: 'row_5', name: 'Detergent 1kg', rate: 96, qty: 15, confidence: 0.72 },
  { id: 'row_6', name: 'Potato Chips 50g', rate: 15, qty: 100, confidence: 0.94 },
  { id: 'row_7', name: 'Curd 400g', rate: 34, qty: 60, confidence: 0.91 },
];

const steps = [
  { at: 25, label: 'Reading items' },
  { at: 60, label: 'Matching prices' },
  { at: 90, label: 'Checking confidence' },
];

function SampleBill() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-input bg-surface-soft p-4">
      <div className="w-full max-w-[220px] rotate-[-1.5deg] rounded-lg border border-line bg-white p-4 text-navy">
        <div className="flex items-center justify-between">
          <p className="font-display text-[11px] font-bold">SHARMA TRADERS</p>
          <p className="text-[7px] text-slate-500">INV-2041</p>
        </div>
        <p className="mt-0.5 text-[7px] text-slate-500">21 Oct 2026 · Pune</p>
        <div className="mt-3 space-y-2">
          {[68, 82, 54, 72, 60, 76, 48].map((width, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="h-1.5 rounded-full bg-slate-200" style={{ width: `${width}%` }} />
              <span className="ml-auto h-1.5 w-6 rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
        <div className="mt-3 border-t border-dashed border-slate-200 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-semibold">TOTAL</span>
            <span className="text-[8px] font-semibold">₹24,860</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-center gap-1 rounded bg-emerald-50 py-1 text-[7px] font-semibold text-emerald-700">
          <ScanLine size={8} aria-hidden="true" />
          StockSense sample bill
        </div>
      </div>
    </div>
  );
}

function categoryFor(name: string) {
  const value = name.toLowerCase();
  if (/(milk|curd|egg|paneer|butter)/.test(value)) return 'Dairy';
  if (/(rice|atta|sugar|flour|dal)/.test(value)) return 'Staples';
  if (/(oil|ghee)/.test(value)) return 'Cooking';
  if (/(tea|coffee|cola|juice|water)/.test(value)) return 'Beverages';
  if (/(soap|shampoo|paste)/.test(value)) return 'Personal care';
  if (/(detergent|cleaner|dish)/.test(value)) return 'Household';
  if (/(chips|biscuit|snack|chocolate)/.test(value)) return 'Snacks';
  return 'Uncategorised';
}

function unitFor(name: string) {
  const value = name.toLowerCase();
  if (value.includes('kg')) return 'kg';
  if (/(ml|1l|750ml|bottle)/.test(value)) return 'bottle';
  if (value.includes('pack')) return 'pack';
  if (value.includes('cup')) return 'cup';
  if (value.includes('pkt')) return 'pkt';
  return 'pc';
}

export default function Upload() {
  const { items, updateItem, addItems, pushToast } = useApp();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<'idle' | 'reading' | 'review'>('idle');
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sample, setSample] = useState(false);
  const [rows, setRows] = useState<ExtractedRow[]>(initialRows);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (stage !== 'reading') return;
    const interval = setInterval(() => {
      setProgress((current) => Math.min(100, current + 4));
    }, 80);
    return () => clearInterval(interval);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'reading' || progress < 100) return;
    const timer = setTimeout(() => {
      setStage('review');
      setReviewOpen(true);
    }, 350);
    return () => clearTimeout(timer);
  }, [stage, progress]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const lowConfidence = rows.filter((row) => row.confidence < 0.85).length;

  const startReading = (url: string | null, isSample: boolean) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(url);
    setSample(isSample);
    setStage('reading');
    setProgress(6);
    setError('');
  };

  const handleFile = (file: File) => {
    const validType = file.type.startsWith('image/') || /\.(jpe?g|png|heic|heif|webp)$/i.test(file.name);
    if (!validType) {
      setError('Please upload a photo of your bill (JPG, PNG or HEIC). PDFs are not supported yet.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('That photo is over 10 MB. Try a smaller image.');
      return;
    }
    startReading(URL.createObjectURL(file), false);
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSample(false);
    setStage('idle');
    setProgress(0);
    setReviewOpen(false);
    setRows(initialRows);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const updateRow = (id: string, patch: Partial<ExtractedRow>) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const uploadToItems = () => {
    const invalid = rows.some((row) => !row.name.trim() || !(row.rate > 0) || !(row.qty > 0));
    if (invalid) {
      pushToast({ kind: 'error', title: 'Check the highlighted rows', description: 'Every item needs a name, a rate above 0 and a quantity above 0.' });
      return;
    }

    setSaving(true);
    const newItems: Item[] = [];
    rows.forEach((row) => {
      const match = items.find((item) => item.name.toLowerCase() === row.name.trim().toLowerCase());
      if (match) {
        updateItem(match.id, {
          stockBought: row.qty,
          stockAvailable: match.stockAvailable + row.qty,
          costPerUnit: row.rate,
        });
      } else {
        newItems.push({
          id: uid('itm'),
          name: row.name.trim(),
          category: categoryFor(row.name),
          unit: unitFor(row.name),
          stockBought: row.qty,
          stockAvailable: row.qty,
          costPerUnit: row.rate,
          sellPerUnit: Math.ceil(row.rate * 1.18),
          dailySales: Math.max(0.5, Math.round((row.qty / 12) * 10) / 10),
          supplier: 'From uploaded bill',
        });
      }
    });
    if (newItems.length) addItems(newItems);

    setSaving(false);
    setReviewOpen(false);
    pushToast({
      kind: 'success',
      title: 'Bill uploaded',
      description: `${rows.length} items added to your shelf. ${newItems.length} were new.`,
    });
    navigate('/items');
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Upload"
        title="Add a bill"
        description="One photo is all it takes. We pull out the items, rates and quantities — you just check them."
      />

      {stage === 'idle' && (
        <Card>
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              const file = event.dataTransfer.files?.[0];
              if (file) handleFile(file);
            }}
            className={cn(
              'flex flex-col items-center justify-center rounded-card border border-dashed px-5 py-14 text-center transition-colors duration-150 sm:py-20',
              dragging ? 'border-primary bg-primary-tint' : 'border-line bg-bg',
            )}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-tint text-primary-ink">
              <Camera size={24} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h2 className="mt-5 font-display text-[20px] font-semibold text-ink">Drop a photo of your bill</h2>
            <p className="mt-1.5 max-w-[42ch] text-[14px] text-muted">or tap to take one. Keep it flat, in good light, with the whole bill in frame.</p>

            <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row">
              <Button type="button" onClick={() => inputRef.current?.click()}>
                <UploadCloud size={17} aria-hidden="true" />
                Choose a photo
              </Button>
              <Button type="button" variant="ghost" onClick={() => startReading(null, true)}>
                Use a sample bill
              </Button>
            </div>

            <p className="mt-5 text-caption text-muted">JPG, PNG or HEIC · up to 10 MB</p>

            <input
              ref={inputRef}
              id="bill-photo"
              type="file"
              accept="image/*"
              capture="environment"
              aria-label="Bill photo"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>

          {error && (
            <p role="alert" className="mt-3 flex items-start gap-2 text-[13px] text-danger-ink">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              {error}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-caption text-muted">
            <span className="flex items-center gap-1.5">
              <Check size={13} className="text-primary-ink" aria-hidden="true" />
              We read printed bills
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={13} className="text-primary-ink" aria-hidden="true" />
              Nothing is uploaded without your review
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={13} className="text-primary-ink" aria-hidden="true" />
              Works with blurry phone photos
            </span>
          </div>
        </Card>
      )}

      {stage === 'reading' && (
        <Card>
          <div className="grid gap-6 sm:grid-cols-[minmax(0,240px)_1fr] sm:items-center">
            <div className="mx-auto w-full max-w-[240px]">
              <div className="aspect-[3/4] overflow-hidden rounded-card border border-line bg-surface-soft">
                {sample ? (
                  <SampleBill />
                ) : previewUrl ? (
                  <img src={previewUrl} alt="Preview of the bill you uploaded" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted">
                    <FileImage size={32} aria-hidden="true" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="eyebrow">Reading your bill</p>
              <h2 className="mt-2 font-display text-[22px] font-semibold text-ink">Almost there — finding your items.</h2>
              <p className="mt-1 text-[14px] text-muted">This usually takes a few seconds. You will check everything before it is saved.</p>

              <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-surface-soft" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Bill reading progress">
                <div className="h-full rounded-full bg-primary transition-[width] duration-200 ease-out" style={{ width: `${progress}%` }} />
              </div>
              <p className="tnum mt-2 text-caption text-muted">{progress}% complete</p>

              <ul className="mt-4 space-y-2">
                {steps.map((step) => {
                  const done = progress >= step.at;
                  return (
                    <li key={step.label} className={cn('flex items-center gap-2 text-[13px]', done ? 'text-ink' : 'text-muted')}>
                      <span
                        className={cn(
                          'flex h-5 w-5 items-center justify-center rounded-full',
                          done ? 'bg-primary-tint text-primary-ink' : 'bg-surface-soft text-muted',
                        )}
                      >
                        {done ? <Check size={12} strokeWidth={2.5} aria-hidden="true" /> : <span className="h-1 w-1 rounded-full bg-muted" />}
                      </span>
                      {step.label}
                    </li>
                  );
                })}
              </ul>

              <Button variant="ghost" size="sm" className="mt-5" onClick={reset}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {stage === 'review' && (
        <Card>
          <div className="grid gap-6 sm:grid-cols-[minmax(0,220px)_1fr] sm:items-center">
            <div className="mx-auto w-full max-w-[220px]">
              <div className="aspect-[3/4] overflow-hidden rounded-card border border-line bg-surface-soft">
                {sample ? (
                  <SampleBill />
                ) : previewUrl ? (
                  <img src={previewUrl} alt="Preview of the bill you uploaded" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted">
                    <FileImage size={32} aria-hidden="true" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-tint px-2.5 py-1 text-[12px] font-semibold text-primary-ink">
                <CheckCircle2 size={13} aria-hidden="true" />
                Bill read
              </span>
              <h2 className="mt-3 font-display text-[22px] font-semibold text-ink">{rows.length} items found</h2>
              <p className="mt-1 text-[14px] text-muted">
                {lowConfidence
                  ? `${lowConfidence} values need a quick check — they are highlighted in amber.`
                  : 'Every value was read with high confidence.'}
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Button onClick={() => setReviewOpen(true)}>
                  <Plus size={16} aria-hidden="true" />
                  Review items
                </Button>
                <Button variant="secondary" onClick={reset}>
                  Upload another
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          { title: 'Snap once', body: 'No typing every line. One clear photo is enough.' },
          { title: 'Check the amber', body: 'Low-confidence values are flagged — edit any cell inline.' },
          { title: 'Save to shelf', body: 'Existing items update, new items are added automatically.' },
        ].map((tip) => (
          <div key={tip.title} className="rounded-card border border-line bg-surface p-4">
            <p className="text-[13px] font-semibold text-ink">{tip.title}</p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-muted">{tip.body}</p>
          </div>
        ))}
      </div>

      <Modal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        title="Check your bill"
        description="Amber cells were read with lower confidence. Tap any cell to edit."
        size="lg"
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="ghost" onClick={() => setReviewOpen(false)}>
              <X size={15} aria-hidden="true" />
              Cancel
            </Button>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="text-caption text-muted">{lowConfidence} need a check</span>
              <Button type="button" onClick={uploadToItems} loading={saving} loadingLabel="Saving">
                Upload to items
              </Button>
            </div>
          </div>
        }
      >
        <Table label="Extracted bill items">
          <TableHead>
            <TableRow className="hover:bg-surface-soft">
              <TableHeaderCell className="w-12">S.No</TableHeaderCell>
              <TableHeaderCell>Items</TableHeaderCell>
              <TableHeaderCell className="w-28">Rate</TableHeaderCell>
              <TableHeaderCell className="w-32">Stock bought</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              const low = row.confidence < 0.85;
              return (
                <TableRow key={row.id}>
                  <TableCell className="tnum text-muted">{index + 1}</TableCell>
                  <TableCell>
                    <input
                      aria-label={`Item name, row ${index + 1}`}
                      value={row.name}
                      onChange={(event) => updateRow(row.id, { name: event.target.value })}
                      className={cn(
                        'h-9 w-full rounded-md border bg-transparent px-2 text-[14px] text-ink focus:outline-none focus:ring-2 focus:ring-primary-ring',
                        low ? 'border-accent bg-accent-tint' : 'border-transparent hover:border-line',
                      )}
                    />
                    {low && (
                      <p className="mt-0.5 flex items-center gap-1 px-2 text-[11px] text-accent-ink">
                        <AlertTriangle size={11} aria-hidden="true" />
                        Please check
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[13px] text-muted">₹</span>
                      <input
                        aria-label={`Rate for ${row.name}`}
                        type="number"
                        min={0}
                        value={row.rate}
                        onChange={(event) => updateRow(row.id, { rate: Number(event.target.value) })}
                        className={cn(
                          'tnum h-9 w-full rounded-md border bg-transparent pl-6 pr-2 text-right text-[14px] text-ink focus:outline-none focus:ring-2 focus:ring-primary-ring',
                          low ? 'border-accent bg-accent-tint' : 'border-transparent hover:border-line',
                        )}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <input
                      aria-label={`Quantity for ${row.name}`}
                      type="number"
                      min={0}
                      value={row.qty}
                      onChange={(event) => updateRow(row.id, { qty: Number(event.target.value) })}
                      className={cn(
                        'tnum h-9 w-full rounded-md border bg-transparent px-2 text-right text-[14px] text-ink focus:outline-none focus:ring-2 focus:ring-primary-ring',
                        low ? 'border-accent bg-accent-tint' : 'border-transparent hover:border-line',
                      )}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="mt-4 flex items-center justify-between rounded-input bg-surface-soft px-4 py-3">
          <span className="text-[13px] text-muted-strong">Bill total</span>
          <span className="tnum font-display text-[16px] font-semibold text-ink">
            ₹{rows.reduce((sum, row) => sum + row.rate * row.qty, 0).toLocaleString('en-IN')}
          </span>
        </div>
      </Modal>
    </div>
  );
}
