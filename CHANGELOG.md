# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- General-purpose report builder replacing the single hard-coded statement:
  a dashboard for managing multiple reports, a form-based editor
  (`components/report/ReportEditor.tsx` and friends), and a generic
  `ReportDocument` schema (`lib/report/types.ts`) with arbitrary sections,
  line items, key metrics, and an expense allocation breakdown.
- Local-first persistence via `localStorage` (`lib/report/storage.ts`) —
  create, edit, duplicate, and delete any number of reports in the browser.
- Export to PDF (browser print), standalone self-contained HTML, and JSON
  (`lib/report/export.tsx`); JSON re-import on the dashboard.
- Derived-totals engine (`lib/report/calculations.ts`): section subtotals,
  gross profit/margin, operating income, net income, and per-line-item
  expense allocation percentages, computed automatically from raw section
  data instead of hand-maintained per report.
- Project documentation: `README.md`, `docs/ARCHITECTURE.md`,
  `docs/report-schema.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`,
  `LICENSE` (MIT), and GitHub issue/PR templates.

### Changed

- `next.config.mjs` no longer sets `typescript.ignoreBuildErrors` — the
  build now fails on real type errors.

### Fixed

- `pnpm lint` previously failed outright (`eslint` had no config file in the
  repo). Added `eslint.config.mjs` (flat config, `typescript-eslint` +
  ESLint's recommended rules) and the corresponding dependencies so linting
  actually runs.

### Removed

- `components/FinancialReport.tsx` and `data/financial-report.ts`, the
  single hard-coded report and its component, superseded by the generic
  report engine above. The same figures now ship as the seeded demo report
  (`lib/report/sample.ts`).

## [0.1.0] - 2026-08-23

- Initial version: a single hard-coded "Atlas HQ" statement of operations
  rendered by one React component reading one static data file. Editing a
  report meant editing TypeScript directly.
