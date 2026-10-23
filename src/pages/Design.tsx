import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Inbox, Moon, Plus, Sun } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input, PasswordInput, Select, Textarea, Toggle } from '@/components/ui/Input';
import { KpiCard } from '@/components/ui/KpiCard';
import { Logo } from '@/components/ui/Logo';
import { Modal } from '@/components/ui/Modal';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/ui/Table';
import { TopPriorityCard } from '@/components/ui/TopPriorityCard';

const colorTokens = [
  ['bg', 'Background'],
  ['surface', 'Surface'],
  ['surface-soft', 'Surface soft'],
  ['border', 'Border'],
  ['text', 'Text'],
  ['text-muted', 'Text muted'],
  ['primary', 'Primary'],
  ['primary-ink', 'Primary ink'],
  ['primary-tint', 'Primary tint'],
  ['accent', 'Accent'],
  ['accent-ink', 'Accent ink'],
  ['accent-tint', 'Accent tint'],
  ['danger', 'Danger'],
  ['danger-ink', 'Danger ink'],
  ['info', 'Info'],
  ['navy-900', 'Navy'],
  ['mint', 'Mint'],
];

function Section({ title, children, description }: { title: string; children: React.ReactNode; description?: string }) {
  return (
    <section className="border-t border-line py-10">
      <h2 className="font-display text-h2 font-semibold text-ink">{title}</h2>
      {description && <p className="mt-1 text-[13px] text-muted">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function Design() {
  const { theme, toggleTheme, pushToast, items } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [toggleOn, setToggleOn] = useState(true);

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Back to home"
            >
              <ArrowLeft size={18} />
            </Link>
            <Logo size="sm" />
          </div>
          <Button variant="secondary" size="sm" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={15} aria-hidden="true" /> : <Sun size={15} aria-hidden="true" />}
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-content px-4 pb-20 sm:px-8">
        <div className="py-10">
          <p className="eyebrow">Design system</p>
          <h1 className="mt-2 font-display text-[32px] font-semibold text-ink">Quiet surfaces, loud data.</h1>
          <p className="mt-2 max-w-[60ch] text-[14px] text-muted">
            Every token, component and state used across StockSense. Toggle the theme to check both palettes.
          </p>
        </div>

        <Section title="Colour" description="60% neutrals, 30% navy and white contrast, 10% emerald and amber.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {colorTokens.map(([token, label]) => (
              <div key={token} className="rounded-card border border-line bg-surface p-3">
                <div className="h-14 rounded-md border border-line" style={{ background: `var(--${token})` }} />
                <p className="mt-2 text-[12px] font-medium text-ink">{label}</p>
                <p className="text-[11px] text-muted">--{token}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="hero-gradient rounded-card p-6 text-on-navy">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-mint">Signature gradient</p>
              <p className="mt-2 font-display text-[22px] font-semibold">Hero and report header only.</p>
            </div>
            <div className="rounded-card bg-navy p-6 text-on-navy">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-mint">Navy surface</p>
              <p className="mt-2 font-display text-[22px] font-semibold">Sidebar, hero panel, top priority.</p>
            </div>
          </div>
        </Section>

        <Section title="Typography" description="Poppins for headings and big numbers. Inter for everything else.">
          <div className="space-y-4 rounded-card border border-line bg-surface p-6">
            <p className="eyebrow">Eyebrow / 11–12 uppercase</p>
            <p className="font-display text-h1 font-semibold text-ink">H1 · Your shelf, counted</p>
            <p className="font-display text-h2 font-semibold text-ink">H2 · What to order next</p>
            <p className="text-body text-ink">Body · StockSense reads your purchase bills and tells you exactly what to order.</p>
            <p className="text-label font-semibold text-ink">Label · Stock available</p>
            <p className="text-caption text-muted">Caption · Last updated 21 Oct · 4:12 pm</p>
            <p className="tnum font-display text-stat font-bold text-ink">₹1,24,860</p>
          </div>
        </Section>

        <Section title="Buttons" description="One primary action per view. Emerald fill always uses navy text.">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button loading loadingLabel="Saving">Loading</Button>
            <Button disabled>Disabled</Button>
            <Button size="sm">
              <Plus size={15} aria-hidden="true" />
              Small
            </Button>
            <Button size="lg">Large</Button>
          </div>
        </Section>

        <Section title="Inputs" description="Labels above fields, helper text below, visible focus rings.">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Input label="Default" placeholder="Aarav Sharma" />
            <Input label="With helper" placeholder="you@shop.com" hint="We never share your email." />
            <Input label="Error" defaultValue="not-an-email" error="That email does not look right." />
            <Input label="Disabled" placeholder="Unavailable" disabled />
            <PasswordInput label="Password" placeholder="Your password" />
            <Select label="Category" defaultValue="Dairy">
              <option>Dairy</option>
              <option>Staples</option>
              <option>Beverages</option>
            </Select>
            <div className="sm:col-span-2 lg:col-span-1">
              <Textarea label="Note" placeholder="Anything worth remembering?" />
            </div>
            <div className="rounded-card border border-line bg-surface px-4 sm:col-span-2 lg:col-span-2">
              <Toggle checked={toggleOn} onChange={setToggleOn} label="Analytics cookies" description="Optional, off by default for non-essential." />
            </div>
          </div>
        </Section>

        <Section title="Badges and status" description="Colour is always paired with a text label.">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="critical" dot>Critical</Badge>
            <Badge tone="low" dot>Low</Badge>
            <Badge tone="ok" dot>OK</Badge>
            <Badge tone="overstock">Overstock</Badge>
            <Badge tone="danger">Expired</Badge>
            <Badge tone="info">Weather</Badge>
            <Badge tone="neutral">Neutral</Badge>
          </div>
        </Section>

        <Section title="Cards and data" description="No shadows. Hairline borders and generous padding.">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Stock value" value={124860} format={(value) => `₹${Math.round(value).toLocaleString('en-IN')}`} trend={{ value: '+8.2%', direction: 'up' }} hint="vs last week" />
            <KpiCard label="Needs attention" value={4} trend={{ value: '2 critical', direction: 'down', positive: false }} />
            <div className="md:col-span-2">
              <TopPriorityCard
                itemName="Milk 1L"
                quantity={48}
                unit="pkt"
                message="Order 48 units — you will run out in 2 days."
                meta="Amul Depot · Dairy"
                onAction={() => pushToast({ kind: 'info', title: 'Top priority action' })}
              />
            </div>
          </div>

          <div className="mt-4">
            <Card padded={false} className="overflow-hidden">
              <div className="border-b border-line px-5 py-4">
                <CardHeader title="Table rows" description="56px rows, hairline dividers, numbers right aligned." />
              </div>
              <Table label="Component table example">
                <TableHead>
                  <TableRow className="hover:bg-surface-soft">
                    <TableHeaderCell>Item</TableHeaderCell>
                    <TableHeaderCell className="text-right">Available</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.slice(0, 3).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="tnum text-right">{item.stockAvailable}</TableCell>
                      <TableCell>
                        <Badge tone="ok" dot>OK</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </Section>

        <Section title="Feedback and empty states">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card padded={false}>
              <EmptyState
                icon={Inbox}
                title="Nothing here yet"
                description="Empty states say one thing and offer one way forward."
                action={<Button size="sm">Add an item</Button>}
              />
            </Card>
            <div className="space-y-4">
              <SkeletonCard rows={3} />
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => pushToast({ kind: 'success', title: 'Saved', description: 'Your changes are live.' })}>
                  Success toast
                </Button>
                <Button variant="secondary" onClick={() => pushToast({ kind: 'warning', title: 'Stock is low', description: '2 days of cover left.' })}>
                  Warning toast
                </Button>
                <Button variant="secondary" onClick={() => pushToast({ kind: 'error', title: 'Upload failed', description: 'Try a JPG or PNG.' })}>
                  Error toast
                </Button>
                <Button variant="secondary" onClick={() => setModalOpen(true)}>
                  Open modal
                </Button>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Brand">
          <div className="flex flex-wrap items-center gap-6">
            <div className="rounded-card border border-line bg-surface p-6">
              <Logo />
            </div>
            <div className="rounded-card bg-navy p-6">
              <Logo onDark />
            </div>
          </div>
        </Section>
      </main>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Modal title"
        description="Centered on desktop, bottom sheet on mobile. Escape closes."
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Save changes</Button>
          </div>
        }
      >
        <p className="text-[14px] leading-relaxed text-muted">
          Modals hold one decision. The primary action sits on the right, cancel stays quiet.
        </p>
      </Modal>
    </div>
  );
}
