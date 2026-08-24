/**
 * Core domain types for Folio report documents.
 *
 * A ReportDocument is a self-contained, JSON-serializable description of a
 * statement-style financial report rendered in the "condensed statement of
 * operations" visual style (see components/report/ReportStatement.tsx).
 *
 * IMPORTANT: this is a *visual* format only. It intentionally has nothing to
 * do with the real iXBRL/XBRL standard (no taxonomies, no tagging, no
 * regulatory validity). See README.md for details.
 */

export type SectionRole = 'revenue' | 'costOfRevenue' | 'operatingExpense' | 'other'

export type MetricFormat = 'currency' | 'number' | 'percent'

export interface LineItem {
  id: string
  label: string
  value: number
  /** Show a leading currency symbol next to the value (iXBRL statements only mark the first line of a group). */
  showCurrencySymbol?: boolean
}

export interface ReportSection {
  id: string
  /** Section heading, e.g. "Revenue:" */
  title: string
  /**
   * Determines how this section feeds the derived summary rows
   * (gross profit, operating income, net income). 'other' sections are
   * rendered with their own subtotal but excluded from those formulas.
   */
  role: SectionRole
  items: LineItem[]
  /** Label for the auto-computed subtotal row, e.g. "Total net revenue" */
  totalLabel: string
}

export interface KeyMetric {
  id: string
  label: string
  value: number
  format: MetricFormat
}

export interface ReportMeta {
  companyName: string
  reportTitle: string
  period: string
  unitNote: string
  footerNote: string
}

export interface CumulativeFigure {
  enabled: boolean
  label: string
  value: number
}

export interface ReportDocument {
  id: string
  meta: ReportMeta
  sections: ReportSection[]
  keyMetrics: KeyMetric[]
  showAllocationBreakdown: boolean
  cumulative: CumulativeFigure
  createdAt: string
  updatedAt: string
}

export const SECTION_ROLE_LABELS: Record<SectionRole, string> = {
  revenue: 'Revenue',
  costOfRevenue: 'Cost of revenue',
  operatingExpense: 'Operating expense',
  other: 'Other (informational only)',
}

export const METRIC_FORMAT_LABELS: Record<MetricFormat, string> = {
  currency: 'Currency ($)',
  number: 'Plain number',
  percent: 'Percent (%)',
}
