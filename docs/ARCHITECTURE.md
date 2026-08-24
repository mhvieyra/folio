# Architecture

Folio is a client-only Next.js app: there is no API route and no database.
Everything — the report editor, storage, and export — runs in the browser.

## Layers

```
lib/report/            domain layer: types, math, storage, export — no React
  types.ts             ReportDocument and friends (the schema)
  calculations.ts       pure functions deriving totals/margins/allocation %
  format.ts             number/currency/percent formatting
  storage.ts             localStorage-backed CRUD for reports
  export.tsx             JSON / standalone-HTML export, JSON import
  sample.ts               demo report + blank "new report" template
  array-utils.ts          small immutable array helpers used by the editor
  id.ts                    id generation

components/report/     presentation + editing layer
  ReportStatement.tsx    pure renderer: ReportDocument -> statement markup
  ReportEditor.tsx        form for meta/sections/metrics/allocation/cumulative
  SectionEditor.tsx       one section's fields + its line items
  KeyMetricsEditor.tsx    the key-metrics list editor
  ExportMenu.tsx           print/HTML/JSON export dropdown
  ReportWorkspace.tsx      editor page shell: loads a report, wires autosave,
                            lays out editor + live preview
  Dashboard.tsx             report list, new/import/duplicate/delete

app/
  page.tsx                renders <Dashboard />
  reports/[id]/page.tsx    resolves the route param, renders <ReportWorkspace />
```

The split matters for one reason: **`ReportStatement` is the single source
of truth for what a report looks like.** It's a pure function of
`ReportDocument` with no editing state. The live preview in the editor, the
print output, and the exported standalone HTML all render through this same
component (the HTML export uses `react-dom/server`'s
`renderToStaticMarkup` on it), so there is no separate "export renderer" to
keep in sync — what you see while editing is exactly what you get out.

## The calculation model

A report doesn't store its subtotals, gross profit, or net income — those
are derived every render by `lib/report/calculations.ts` from the raw
section/line-item data:

- **Section total** = sum of that section's line item values.
- **Total revenue / cost of revenue / operating expenses** = sum of section
  totals grouped by `section.role`.
- **Gross profit** = total revenue − total cost of revenue.
- **Gross margin %** = gross profit / total revenue.
- **Operating income** = gross profit − total operating expenses.
- **Net income** = operating income (Folio doesn't currently model
  non-operating income/expense or taxes — see the roadmap in the README).
- **Expense allocation %** = each `costOfRevenue`/`operatingExpense` line
  item's value divided by (total cost of revenue + total operating
  expenses).

Because `role` is what drives the formulas rather than a fixed field name,
you can add multiple sections with the same role (e.g. two separate
"Cost of revenue" sections) and they'll still roll up correctly. Sections
with `role: 'other'` render with their own subtotal but are excluded from
every formula above — useful for purely informational blocks.

## Storage

`lib/report/storage.ts` keeps all reports as a single JSON array under one
`localStorage` key (`folio.reports.v1`). There's no server, so:

- Reports are private to one browser profile on one device.
- Use **Export as JSON** to back up, move a report to another browser, or
  put it under version control; **Import JSON** (on the dashboard) reads it
  back in as a new report.
- On first load with nothing saved, a demo report is seeded automatically
  so the app isn't empty (`lib/report/sample.ts`).

## Editor state flow

`ReportWorkspace` loads one `ReportDocument` by id on mount, holds it in
React state, and passes it down with an `onChange` callback. Every field in
`ReportEditor` (and its children `SectionEditor` /`KeyMetricsEditor`)
performs an immutable update and calls `onChange` with the whole next
document — there's no separate form library or normalized store, since the
document is small and the update pattern is uniform. `ReportWorkspace`
debounces writes to `localStorage` (400ms after the last change) so typing
doesn't thrash storage on every keystroke, while the in-memory state (and
therefore the live preview) updates immediately.

## Print / PDF export

Rather than a headless-browser PDF pipeline, Folio uses the browser's own
print dialog: the preview is wrapped in `#folio-print-area`, and
`app/globals.css` has a `@media print` rule that hides everything else on
the page. "Print / Save as PDF" just calls `window.print()`. This keeps the
export dependency-free and gives users the OS print dialog's own
paper-size/margin controls.

## Extending the schema

If you want to add a new field (e.g. a per-section note, or a new metric
format), the places to touch are usually:

1. `lib/report/types.ts` — add the field to the type.
2. `lib/report/sample.ts` — populate it in the demo/blank templates so new
   reports have a sane default.
3. `components/report/ReportStatement.tsx` — render it.
4. The relevant editor component — expose it as a form control.
5. `lib/report/calculations.ts` — if the field feeds a derived total.

Because `ReportDocument` is plain JSON, older exported files will still
import fine as long as new fields have sensible fallbacks in the renderer
(e.g. `report.cumulative?.enabled` style guards) — see
[`docs/report-schema.md`](report-schema.md) for the versioning note.
