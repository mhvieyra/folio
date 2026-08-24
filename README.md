# Folio

**Folio** is a small, open-source tool for building condensed financial
statements in the visual style of an iXBRL filing — the dense, serif,
black-and-white "statement of operations" look you see in SEC filings —
without any of the iXBRL machinery underneath.

You fill in a form (revenue, cost of revenue, operating expenses, key
metrics, an optional expense-allocation breakdown), Folio lays it out in
that statement style live as you type, and you export the result as a PDF,
a self-contained HTML file, or JSON.

> **This is a visual template, not a compliant filing tool.** Folio does
> not implement the iXBRL/XBRL standard — no taxonomies, no tagging, no
> regulatory validity. It only reproduces the *look* of that kind of
> statement for internal reports, community updates, investor memos, demos,
> and anything else where the format is useful but the compliance isn't
> required. Don't file it with a regulator.

## Why this exists

The previous version of this idea was a single React component
(`components/FinancialReport.tsx`) rendering a single hard-coded data file
(`data/financial-report.ts`). It looked right, but every new report or
number change meant editing TypeScript by hand and redeploying. That's the
"poco práctico" (impractical) part this rewrite fixes:

- **Before:** one report, hard-coded fields, edit-and-redeploy workflow.
- **Now:** unlimited reports, a form-based editor, everything stored in
  your browser, one-click export, no redeploy required.

## Features

- **Free-form sections.** Add as many sections as you want (revenue, cost
  of revenue, operating expenses, or anything else), each with its own
  line items. Reorder sections and line items, rename labels, toggle the
  leading `$` per line — no code required.
- **Automatic subtotals and derived rows.** Section totals, gross
  profit/margin, operating income, and net income are computed from your
  numbers, not typed in by hand.
- **Expense allocation breakdown.** Optional, auto-computed percentage of
  total expenses per cost-of-revenue / operating-expense line item.
- **Key metrics & cumulative figure.** Freeform metric rows (MRR, churn,
  growth, anything) plus one highlighted cumulative figure at the bottom.
- **Live preview.** The editor and the exact statement render side by side;
  what you see is what gets exported.
- **Export.** Print/Save-as-PDF (browser print, styled for paper), a
  self-contained HTML file, or raw JSON you can re-import or version
  control.
- **Local-first storage.** Reports are saved to `localStorage` in your
  browser. Nothing is sent to a server. Export to JSON for backup, version
  control, or sharing the underlying data.
- **A ready-made example.** The app ships with a populated demo report so
  you can see the schema in action and duplicate it as a starting point.

## Quick start

Requirements: Node.js 18+ and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). You'll land on the
report dashboard with one demo report already seeded — open it, edit it,
duplicate it, or start a new one.

Other scripts:

```bash
pnpm build       # production build
pnpm start       # run the production build
pnpm typecheck   # tsc --noEmit
pnpm lint        # eslint
```

## Using it

1. **Dashboard** (`/`) — every saved report, newest first. "New report"
   starts from a minimal three-section skeleton; "Import JSON" restores a
   report exported earlier (from this browser or someone else's).
2. **Editor** (`/reports/[id]`) — left panel edits the document, right
   panel is the live statement preview. Changes autosave to your browser's
   storage a moment after you stop typing.
3. **Export** — from the editor toolbar:
   - *Print / Save as PDF* opens the browser print dialog scoped to just
     the statement (no editor chrome).
   - *Export as HTML* downloads a standalone `.html` file with the
     statement's markup and inline styles — no dependency on this app to
     view it later.
   - *Export as JSON* downloads the report document itself, so you can
     back it up, diff it, or re-import it elsewhere.

## How a report is structured

A report is a plain JSON document (see [`lib/report/types.ts`](lib/report/types.ts)):

- `meta` — company name, statement title, period, unit note, footer text.
- `sections[]` — each has a `role` (`revenue`, `costOfRevenue`,
  `operatingExpense`, or `other`) and a list of `items` (label + value).
  The `role` is what drives the derived summary rows.
- `keyMetrics[]` — freeform label/value/format rows.
- `showAllocationBreakdown` — toggles the auto-computed expense allocation
  table.
- `cumulative` — one optional highlighted figure at the bottom.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for how these are turned
into the rendered statement, and [`docs/report-schema.md`](docs/report-schema.md)
for the full field-by-field reference (handy if you're generating reports
programmatically instead of through the UI).

## Tech stack

Next.js (App Router) + React + TypeScript, Tailwind CSS v4, and
[shadcn/ui](https://ui.shadcn.com) components. No backend, no database —
everything runs in the browser.

## Roadmap

- [ ] Drag-and-drop reordering (currently up/down buttons)
- [ ] Custom formula rows beyond the built-in gross-profit/net-income chain
- [ ] Report templates (SaaS P&L, balance sheet, cash flow) beyond the
      single statement-of-operations layout
- [ ] Optional cloud sync (still local-first by default)
- [ ] CSV import for line items

Contributions toward any of these — or anything else — are welcome. See
[CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
