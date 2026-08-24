# Report schema reference

A Folio report is a single JSON object matching the `ReportDocument` type in
[`lib/report/types.ts`](../lib/report/types.ts). This is the same file you get
from **Export as JSON** and can hand back in via **Import JSON**. Useful if
you want to generate reports programmatically (a script, a spreadsheet
export, a CI job) instead of through the editor UI.

## Top level

| Field                     | Type                | Notes                                                              |
| ------------------------- | ------------------- | ------------------------------------------------------------------- |
| `id`                      | `string`             | Unique id. Re-import auto-assigns a fresh one, so this can be anything. |
| `meta`                    | `ReportMeta`         | See below.                                                          |
| `sections`                | `ReportSection[]`    | Ordered top to bottom in the rendered statement.                    |
| `keyMetrics`              | `KeyMetric[]`        | Optional freeform metrics block. `[]` hides the block entirely.     |
| `showAllocationBreakdown` | `boolean`            | Shows/hides the auto-computed expense allocation table.             |
| `cumulative`               | `CumulativeFigure`   | One optional highlighted figure at the bottom.                      |
| `createdAt` / `updatedAt` | `string` (ISO 8601)  | Managed by the app; safe to omit when hand-authoring, defaults on save. |

## `meta`

| Field         | Type     | Example                                        |
| ------------- | -------- | ----------------------------------------------- |
| `companyName` | `string` | `"Atlas HQ"`                                    |
| `reportTitle` | `string` | `"CONDENSED STATEMENT OF OPERATIONS (Unaudited)"` |
| `period`      | `string` | `"Three Months Ended March 31, 2026"`           |
| `unitNote`    | `string` | `"(In USD)"`                                    |
| `footerNote`  | `string` | Disclosure line shown at the bottom.             |

## `sections[]`

| Field        | Type          | Notes                                                                 |
| ------------ | ------------- | ----------------------------------------------------------------------|
| `id`         | `string`      | Unique within the report.                                             |
| `title`      | `string`      | Section heading row, e.g. `"Revenue:"`.                                |
| `role`       | `SectionRole` | `"revenue"` \| `"costOfRevenue"` \| `"operatingExpense"` \| `"other"`. Drives the derived formulas — see [ARCHITECTURE.md](ARCHITECTURE.md#the-calculation-model). |
| `items`      | `LineItem[]`  | The section's rows.                                                    |
| `totalLabel` | `string`      | Label for the auto-computed subtotal row, e.g. `"Total net revenue"`.  |

### `LineItem`

| Field                | Type      | Notes                                                       |
| -------------------- | --------- | ------------------------------------------------------------ |
| `id`                 | `string`  | Unique within the section.                                    |
| `label`              | `string`  | Row label.                                                     |
| `value`              | `number`  | Negative values render in parentheses, iXBRL-style.            |
| `showCurrencySymbol` | `boolean?`| Optional. Prefixes the value with `$`. Conventionally only the first row of a group sets this. |

## `keyMetrics[]`

| Field    | Type           | Notes                                        |
| -------- | -------------- | ---------------------------------------------- |
| `id`     | `string`       |                                                 |
| `label`  | `string`       | e.g. `"Monthly recurring revenue (MRR)"`       |
| `value`  | `number`       |                                                 |
| `format` | `MetricFormat` | `"currency"` \| `"number"` \| `"percent"`      |

## `cumulative`

| Field     | Type      | Notes                                             |
| --------- | --------- | ---------------------------------------------------|
| `enabled` | `boolean` | Hides the whole block when `false`.                 |
| `label`   | `string`  | e.g. `"Cumulative revenue (since inception)"`       |
| `value`   | `number`  |                                                      |

## Minimal example

```json
{
  "id": "report_example",
  "meta": {
    "companyName": "Example Co",
    "reportTitle": "CONDENSED STATEMENT OF OPERATIONS (Unaudited)",
    "period": "Year Ended December 31, 2026",
    "unitNote": "(In USD)",
    "footerNote": "Unaudited, for internal use only."
  },
  "sections": [
    {
      "id": "section_revenue",
      "title": "Revenue:",
      "role": "revenue",
      "totalLabel": "Total net revenue",
      "items": [
        { "id": "item_1", "label": "Subscriptions", "value": 12000, "showCurrencySymbol": true }
      ]
    },
    {
      "id": "section_opex",
      "title": "Operating expenses:",
      "role": "operatingExpense",
      "totalLabel": "Total operating expenses",
      "items": [
        { "id": "item_2", "label": "Salaries", "value": 8000 }
      ]
    }
  ],
  "keyMetrics": [],
  "showAllocationBreakdown": false,
  "cumulative": { "enabled": false, "label": "Cumulative revenue (since inception)", "value": 0 },
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

Import this via the dashboard's **Import JSON** button and it will render
with an auto-computed "Total net revenue", "Total operating expenses", and
an "Operating income" / "Net income" summary block.

## Versioning

There is currently one schema version and no `schemaVersion` field. If a
breaking change to `ReportDocument` becomes necessary, it will be
introduced with a migration in `lib/report/storage.ts` and noted in
[CHANGELOG.md](../CHANGELOG.md) — old exported JSON files should keep
importing correctly.
