import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Boxes, Pencil, Plus, Search, SearchX } from 'lucide-react';
import { PageHeader } from '@/components/layout/AppShell';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button, buttonStyles } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/ui/Table';
import { useApp } from '@/context/AppContext';
import { getRecommendation, sortedByPriority, statusLabel, type Item, type StockStatus } from '@/lib/data';
import { cn, formatDate } from '@/lib/utils';

const toneByStatus: Record<StockStatus, BadgeTone> = {
  critical: 'critical',
  low: 'low',
  ok: 'ok',
  overstock: 'overstock',
};

export default function Items() {
  const { items, updateItem, pushToast } = useApp();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Item | null>(null);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');

  const ranked = useMemo(() => sortedByPriority(items), [items]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return ranked;
    return ranked.filter((item) => `${item.name} ${item.category} ${item.supplier}`.toLowerCase().includes(term));
  }, [query, ranked]);

  const attention = items.filter((item) => ['critical', 'low'].includes(getRecommendation(item).status)).length;

  useEffect(() => {
    if (!editing) return;
    setDraft(String(editing.stockAvailable));
    setError('');
  }, [editing]);

  const openEditor = (item: Item) => setEditing(item);

  const saveStock = (event: FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    const next = Number(draft);
    if (!Number.isFinite(next) || next < 0) {
      setError('Enter a quantity of 0 or more.');
      return;
    }
    const previous = editing.stockAvailable;
    const rounded = Math.round(next * 100) / 100;
    updateItem(editing.id, { stockAvailable: rounded });
    setEditing(null);
    pushToast({
      kind: 'success',
      title: 'Stock updated',
      description: `${editing.name} now shows ${rounded} ${editing.unit}${rounded === 1 ? '' : 's'} available.`,
      action: {
        label: 'Undo',
        onClick: () => {
          updateItem(editing.id, { stockAvailable: previous });
          pushToast({ kind: 'info', title: 'Change undone', description: `${editing.name} is back to ${previous}.` });
        },
      },
    });
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Stock"
        title="Your shelf, counted"
        description={`${items.length} items tracked${attention ? ` · ${attention} need attention today` : ' · all healthy'}. Last updated from a bill on ${formatDate('2026-10-21')}.`}
        action={
          <Link to="/upload" className={buttonStyles()}>
            <Plus size={17} aria-hidden="true" />
            Upload bill
          </Link>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-[360px]">
          <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
          <label htmlFor="item-search" className="sr-only">
            Search items
          </label>
          <input
            id="item-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search items, category or supplier"
            className="h-11 w-full rounded-input border border-line bg-surface-soft pl-10 pr-3.5 text-[14px] text-ink placeholder:text-muted-strong focus:border-primary focus:bg-surface focus:outline-none focus:ring-[3px] focus:ring-primary-ring"
          />
        </div>
        <p className="text-[13px] text-muted">
          Showing <span className="tnum font-medium text-ink">{filtered.length}</span> of {items.length} items
        </p>
      </div>

      {items.length === 0 ? (
        <Card padded={false}>
          <EmptyState
            icon={Boxes}
            title="Your shelf is empty"
            description="Upload your first supplier bill and StockSense will build your item list for you."
            action={
              <Link to="/upload" className={buttonStyles()}>
                <Plus size={16} aria-hidden="true" />
                Upload your first bill
              </Link>
            }
          />
        </Card>
      ) : filtered.length === 0 ? (
        <Card padded={false}>
          <EmptyState
            icon={SearchX}
            title="Nothing matches that search"
            description={`We could not find an item matching “${query}”. Try a shorter word or clear the search.`}
            action={
              <Button variant="secondary" onClick={() => setQuery('')}>
                Clear search
              </Button>
            }
          />
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <Card padded={false} className="hidden overflow-hidden md:block">
            <Table label="Items and buying recommendations">
              <TableHead>
                <TableRow className="hover:bg-surface-soft">
                  <TableHeaderCell className="w-16">S.No</TableHeaderCell>
                  <TableHeaderCell>Items</TableHeaderCell>
                  <TableHeaderCell className="text-right">Stock bought</TableHeaderCell>
                  <TableHeaderCell className="text-right">Stock available</TableHeaderCell>
                  <TableHeaderCell className="w-[42%]">Buying recommendation</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((item, index) => {
                  const rec = getRecommendation(item);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="tnum text-muted">{String(index + 1).padStart(2, '0')}</TableCell>
                      <TableCell>
                        <p className="font-medium text-ink">{item.name}</p>
                        <p className="text-caption text-muted">
                          {item.category} · {item.supplier}
                        </p>
                      </TableCell>
                      <TableCell className="tnum text-right text-muted">
                        {item.stockBought} {item.unit}
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          type="button"
                          onClick={() => openEditor(item)}
                          aria-label={`Update stock for ${item.name}, currently ${item.stockAvailable} ${item.unit}`}
                          className="group inline-flex items-center gap-1.5 rounded px-1.5 py-1 text-[14px] font-semibold text-ink transition-colors hover:bg-surface-soft hover:text-primary-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <span className="tnum">
                            {item.stockAvailable} {item.unit}
                          </span>
                          <Pencil size={13} className="text-muted group-hover:text-primary-ink" aria-hidden="true" />
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone={toneByStatus[rec.status]} dot>
                            {statusLabel[rec.status]}
                          </Badge>
                          <span className="text-[13px] text-muted">{rec.suggestion}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {filtered.map((item) => {
              const rec = getRecommendation(item);
              return (
                <article key={item.id} className="rounded-card border border-line bg-surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-[15px] font-semibold text-ink">{item.name}</h2>
                      <p className="text-caption text-muted">
                        {item.category} · {item.supplier}
                      </p>
                    </div>
                    <Badge tone={toneByStatus[rec.status]} dot>
                      {statusLabel[rec.status]}
                    </Badge>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 rounded-input bg-surface-soft p-3">
                    <div>
                      <p className="text-[11px] text-muted-strong">Bought</p>
                      <p className="tnum mt-0.5 text-[14px] font-semibold text-ink">{item.stockBought}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-strong">Available</p>
                      <p className="tnum mt-0.5 text-[14px] font-semibold text-ink">
                        {item.stockAvailable} <span className="text-[11px] font-normal text-muted">{item.unit}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-strong">Days left</p>
                      <p className={cn('tnum mt-0.5 text-[14px] font-semibold', rec.status === 'critical' ? 'text-accent-ink' : 'text-ink')}>
                        {Math.max(0, Math.round(rec.daysLeft))}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-[13px] leading-snug text-muted">{rec.suggestion}</p>

                  <Button variant="secondary" size="sm" fullWidth className="mt-3" onClick={() => openEditor(item)}>
                    <Pencil size={14} aria-hidden="true" />
                    Update stock
                  </Button>
                </article>
              );
            })}
          </div>
        </>
      )}

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Update stock"
        description={editing ? `${editing.name} · ${editing.category}` : undefined}
        size="sm"
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="submit" form="stock-form">
              Save stock
            </Button>
          </div>
        }
      >
        {editing && (
          <form id="stock-form" onSubmit={saveStock} className="space-y-4">
            <div className="flex items-center justify-between rounded-input bg-surface-soft px-4 py-3">
              <span className="text-[13px] text-muted-strong">Currently available</span>
              <span className="tnum text-[15px] font-semibold text-ink">
                {editing.stockAvailable} {editing.unit}
              </span>
            </div>
            <Input
              label="New stock available"
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              error={error}
              hint={`Counted in ${editing.unit}s. This does not change stock bought.`}
              autoFocus
            />
            <p className="text-caption text-muted">
              Changes save instantly and can be undone from the confirmation message.
            </p>
          </form>
        )}
      </Modal>
    </div>
  );
}
