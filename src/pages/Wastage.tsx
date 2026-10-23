import { useMemo, useRef, useState, type FormEvent } from 'react';
import { Check, ChevronDown, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/AppShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/ui/Table';
import { useApp } from '@/context/AppContext';
import { useOnClickOutside } from '@/lib/hooks';
import { totalWastage, wastageReasons, type Item, type WastageReason } from '@/lib/data';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

export default function Wastage() {
  const { items, wastage, addWastage, pushToast } = useApp();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Item | null>(null);
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState<WastageReason>('Expired');
  const [errors, setErrors] = useState<{ item?: string; quantity?: string }>({});
  const [saving, setSaving] = useState(false);
  const dropdownRef = useOnClickOutside<HTMLDivElement>(() => setOpen(false));
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    const term = query.trim().toLowerCase();
    const pool = term ? items.filter((item) => item.name.toLowerCase().includes(term)) : items;
    return pool.slice(0, 6);
  }, [items, query]);

  const wastedValue = selected && Number(quantity) > 0 ? Math.round(Number(quantity) * selected.costPerUnit) : 0;

  const choose = (item: Item) => {
    setSelected(item);
    setQuery(item.name);
    setOpen(false);
    setErrors((current) => ({ ...current, item: undefined }));
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const reset = () => {
    setSelected(null);
    setQuery('');
    setQuantity('');
    setReason('Expired');
    setErrors({});
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!selected) nextErrors.item = 'Choose the item that was wasted.';
    const amount = Number(quantity);
    if (!quantity || !Number.isFinite(amount) || amount <= 0) nextErrors.quantity = 'Enter a quantity greater than 0.';
    else if (selected && amount > selected.stockAvailable) nextErrors.quantity = `You only have ${selected.stockAvailable} ${selected.unit} available.`;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length || !selected) return;

    setSaving(true);
    addWastage({ itemId: selected.id, quantity: amount, reason });
    setSaving(false);
    pushToast({
      kind: 'success',
      title: 'Wastage logged',
      description: `${amount} ${selected.unit}${amount === 1 ? '' : 's'} of ${selected.name} · ${formatCurrency(Math.round(amount * selected.costPerUnit))}.`,
    });
    reset();
  };

  const total = totalWastage(wastage);

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Losses"
        title="What's leaving the shelf"
        description="Log spoilage and damage in seconds. Every entry makes your order recommendations sharper."
      />

      <Card>
        <CardHeader
          title="Log wastage"
          description="Record what was lost so it never quietly eats your margin."
        />
        <form onSubmit={submit} noValidate className="mt-5">
          <div className="grid gap-4 lg:grid-cols-4">
            <div className="relative lg:col-span-2" ref={dropdownRef}>
              <label htmlFor="wastage-item" className="mb-1.5 block text-label font-semibold text-ink">
                Item
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  id="wastage-item"
                  type="text"
                  role="combobox"
                  aria-expanded={open}
                  aria-controls="wastage-item-list"
                  aria-autocomplete="list"
                  autoComplete="off"
                  placeholder="Start typing an item name"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setSelected(null);
                    setOpen(true);
                    setErrors((current) => ({ ...current, item: undefined }));
                  }}
                  onFocus={() => setOpen(true)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && open && suggestions[0]) {
                      event.preventDefault();
                      choose(suggestions[0]);
                    }
                    if (event.key === 'Escape') setOpen(false);
                  }}
                  className={cn(
                    'h-11 w-full rounded-input border border-line bg-surface-soft px-3.5 pr-10 text-[15px] text-ink placeholder:text-muted-strong focus:border-primary focus:bg-surface focus:outline-none focus:ring-[3px] focus:ring-primary-ring',
                    errors.item && 'border-danger focus:border-danger',
                  )}
                  aria-invalid={errors.item ? true : undefined}
                  aria-describedby={errors.item ? 'wastage-item-error' : undefined}
                />
                <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
              </div>
              {errors.item && (
                <p id="wastage-item-error" role="alert" className="mt-1.5 text-caption text-danger-ink">
                  {errors.item}
                </p>
              )}

              {open && (
                <div
                  id="wastage-item-list"
                  role="listbox"
                  className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-input border border-line bg-surface py-1 shadow-float"
                >
                  {suggestions.length === 0 ? (
                    <p className="px-3 py-2.5 text-[13px] text-muted">No items match “{query}”.</p>
                  ) : (
                    suggestions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        role="option"
                        aria-selected={selected?.id === item.id}
                        onClick={() => choose(item)}
                        className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-surface-soft focus-visible:bg-surface-soft focus-visible:outline-none"
                      >
                        <span>
                          <span className="block text-[14px] font-medium text-ink">{item.name}</span>
                          <span className="block text-[11px] text-muted">
                            {item.stockAvailable} {item.unit} available · {formatCurrency(item.costPerUnit)}/{item.unit}
                          </span>
                        </span>
                        {selected?.id === item.id && <Check size={15} className="text-primary-ink" aria-hidden="true" />}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <Input
              label="Stock wasted"
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              placeholder="0"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              error={errors.quantity}
              hint={selected ? `In ${selected.unit}s · ${selected.stockAvailable} available` : 'Choose an item first.'}
              disabled={!selected}
              required
            />

            <fieldset>
              <legend className="mb-1.5 block text-label font-semibold text-ink">Reason</legend>
              <div className="flex flex-wrap gap-2">
                {wastageReasons.map((option) => {
                  const active = reason === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setReason(option)}
                      className={cn(
                        'min-h-[44px] rounded-full border px-3.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-ring',
                        active
                          ? 'border-accent bg-accent-tint text-accent-ink'
                          : 'border-line bg-surface-soft text-muted-strong hover:border-muted/40 hover:text-ink',
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <div className="mt-5 flex flex-col gap-4 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-[13px] text-muted">Value lost</span>
              <span className={cn('tnum font-display text-[20px] font-semibold', wastedValue ? 'text-accent-ink' : 'text-muted')}>
                {formatCurrency(wastedValue)}
              </span>
              <span className="text-caption text-muted">at cost price</span>
            </div>
            <div className="flex items-center gap-2">
              {(query || quantity) && (
                <Button type="button" variant="ghost" onClick={reset}>
                  Clear
                </Button>
              )}
              <Button type="submit" loading={saving} loadingLabel="Logging">
                Log wastage
              </Button>
            </div>
          </div>
        </form>
      </Card>

      <div className="mt-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-h2 font-semibold text-ink">Recent wastage</h2>
          <p className="text-[13px] text-muted">
            {formatDate(new Date(), { month: 'long', year: 'numeric' })} ·{' '}
            <span className="tnum font-medium text-accent-ink">{formatCurrency(total)}</span> lost
          </p>
        </div>

        {wastage.length === 0 ? (
          <Card padded={false}>
            <EmptyState
              icon={Trash2}
              title="No wastage logged yet"
              description="When something spoils or breaks, log it above. You will start seeing patterns within a week."
            />
          </Card>
        ) : (
          <>
            <Card padded={false} className="hidden overflow-hidden sm:block">
              <Table label="Recent wastage entries">
                <TableHead>
                  <TableRow className="hover:bg-surface-soft">
                    <TableHeaderCell>Date</TableHeaderCell>
                    <TableHeaderCell>Item</TableHeaderCell>
                    <TableHeaderCell className="text-right">Quantity</TableHeaderCell>
                    <TableHeaderCell>Reason</TableHeaderCell>
                    <TableHeaderCell className="text-right">Value lost</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {wastage.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="tnum whitespace-nowrap text-muted">{formatDate(entry.date, { day: '2-digit', month: 'short' })}</TableCell>
                      <TableCell className="font-medium">{entry.itemName}</TableCell>
                      <TableCell className="tnum text-right">{entry.quantity}</TableCell>
                      <TableCell>
                        <Badge tone="neutral">{entry.reason}</Badge>
                      </TableCell>
                      <TableCell className="tnum text-right font-semibold text-accent-ink">{formatCurrency(entry.value)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <div className="space-y-3 sm:hidden">
              {wastage.map((entry) => (
                <article key={entry.id} className="rounded-card border border-line bg-surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[15px] font-medium text-ink">{entry.itemName}</h3>
                      <p className="mt-0.5 text-caption text-muted">
                        {formatDate(entry.date, { day: '2-digit', month: 'short' })} · {entry.quantity} wasted
                      </p>
                    </div>
                    <p className="tnum text-[15px] font-semibold text-accent-ink">{formatCurrency(entry.value)}</p>
                  </div>
                  <div className="mt-2">
                    <Badge tone="neutral">{entry.reason}</Badge>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
