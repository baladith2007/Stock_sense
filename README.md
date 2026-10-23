# StockSense

Smart stock, wastage and AI ordering for small shops. Built for **QUANTIX 2K26 · PS11**.

StockSense turns a supplier bill into a clear picture of the shelf: what is running out, what is being wasted, and exactly what to order next. The interface follows a calm, minimalist directive — navy structure, emerald action, generous white space, and data that stays legible.

## Stack

- **React 18 + TypeScript** (Vite)
- **Tailwind CSS 3.4** with CSS-variable design tokens and a dark theme
- **React Router 6** with route-level code splitting
- **Recharts** for the sales and wastage chart
- **Lucide** icons (20 px, 1.5 stroke)
- **Fontsource** self-hosted Poppins and Inter (no third-party font requests)
- **html-to-image** for exporting the 1080 px report PNG
- **localStorage** persistence for auth, items, wastage, theme and cookie consent

## Run locally

```bash
npm install
npm run dev
```

Then open <http://localhost:5173>.

```bash
npm run build      # typecheck + production build
npm run typecheck  # TypeScript only
npm run preview    # preview the production build
```

Requires Node 18+ (tested on Node 24).

## Demo access

- **Email:** `demo@stocksense.app`
- **Password:** `demo1234`
- Or open **`/demo`** to sign in instantly with the demo shop.
- The login screen also has a **Use demo** button that fills the credentials.
- Any valid email plus a password of 6+ characters works for this prototype.

All data lives in the browser. Clearing site data resets the seeded shop.

## Screens

| Route | Screen |
| --- | --- |
| `/` | Landing page |
| `/login` | Log in |
| `/signup` | Create account |
| `/dashboard` | KPIs, sales/wastage chart, AI recommendations, top priority |
| `/upload` | Bill upload, simulated extraction, editable review table, low-confidence highlights |
| `/items` | Searchable stock table, status badges, inline stock updates with Undo |
| `/wastage` | Wastage form with item autocomplete and reason chips, recent losses |
| `/report` | Weather strip, formula explainer, order table, scaled report preview and PNG download |
| `/design` | Design-system preview: tokens, type, components and states |
| `/privacy`, `/terms` | Legal copy with cookie preferences |
| `/demo` | One-click demo entry |

## Design system

Tokens are defined once in `src/index.css` and mapped to Tailwind in `tailwind.config.js`. Components never hard-code palette values; the report scopes its own light tokens so the downloaded image is identical in dark mode.

- Background `#F8FAFC`, surface `#FFFFFF`, border `#E2E8F0`
- Primary `#10B981`, primary ink `#047857`, primary tint `#ECFDF5`
- Accent `#F59E0B` (darker `#B45309` for accessible text on tint)
- Navy `#0F172A`, muted text `#64748B` (`#5F6F85` on tinted surfaces for AA text), mint `#6EE7B7`
- Poppins for headings and figures, Inter for UI text, tabular numerals for all metrics
- 8 px inputs/buttons, 14 px cards, 20 px modals; no card shadows, 1 px borders
- Gradient reserved for the landing hero and report header
- One primary action per view; emerald fills always use navy text

## Accessibility

- Keyboard reachable controls with `:focus-visible` rings and a skip link
- Focus trap, Escape close and scroll lock in modals; bottom-sheet layout on mobile
- Labelled inputs, combobox/listbox semantics, `aria-live` toasts, and screen-reader text for icon-only controls
- Status always pairs colour with a text label
- `prefers-reduced-motion` disables animation
- Responsive at 360 / 768 / 1024 / 1280+, with a mobile tab bar and collapsible navy sidebar

## Prototype boundaries

- Bill OCR is simulated with a realistic sample extraction (choose **Use a sample bill**).
- Daily sales, weather and the week's chart are seeded demo data; stock and wastage edits are real within the session and persist locally.
- Recommendations are calculated in `src/lib/data.ts`:
  `days left = available ÷ daily sales`, `order = ceil(daily sales × 6 − available)`, floored at 0.
- Authentication is a local prototype, not a production identity provider.

## Structure

```
src/
  components/
    layout/    AppShell, AuthLayout
    report/    ReportDocument (fixed 1080 px export)
    ui/        Button, Input, Card, Badge, Modal, Toast, Table, EmptyState,
               Skeleton, KpiCard, TopPriorityCard, CookieBanner, Logo
  context/     AppContext (items, wastage, toasts, theme, auth, consent)
  lib/         data model + recommendation logic, hooks, formatters
  pages/       Landing, Login, Signup, Dashboard, Upload, Items, Wastage,
               AIReport, Design, Legal, NotFound
```
