import type { ReportDocument, ReportSection, SectionRole } from './types'

export function sectionTotal(section: ReportSection): number {
  return section.items.reduce((sum, item) => sum + (Number.isFinite(item.value) ? item.value : 0), 0)
}

export function totalByRole(report: ReportDocument, role: SectionRole): number {
  return report.sections
    .filter((section) => section.role === role)
    .reduce((sum, section) => sum + sectionTotal(section), 0)
}

export interface AllocationRow {
  sectionId: string
  itemId: string
  label: string
  value: number
  pct: number
}

export interface ReportTotals {
  totalRevenue: number
  totalCostOfRevenue: number
  grossProfit: number
  grossMarginPct: number
  totalOperatingExpenses: number
  operatingIncome: number
  netIncome: number
  totalExpenses: number
  hasRevenueSection: boolean
  hasCostOfRevenueSection: boolean
  hasOperatingExpenseSection: boolean
  allocation: AllocationRow[]
}

/**
 * Derives every computed row shown in the statement (subtotals, gross
 * profit, operating/net income, expense allocation %) from raw section
 * data. Pure function — safe to call on every render.
 */
export function computeReportTotals(report: ReportDocument): ReportTotals {
  const totalRevenue = totalByRole(report, 'revenue')
  const totalCostOfRevenue = totalByRole(report, 'costOfRevenue')
  const totalOperatingExpenses = totalByRole(report, 'operatingExpense')

  const grossProfit = totalRevenue - totalCostOfRevenue
  const grossMarginPct = totalRevenue !== 0 ? (grossProfit / totalRevenue) * 100 : 0
  const operatingIncome = grossProfit - totalOperatingExpenses
  const netIncome = operatingIncome
  const totalExpenses = totalCostOfRevenue + totalOperatingExpenses

  const allocation: AllocationRow[] = []
  for (const section of report.sections) {
    if (section.role !== 'costOfRevenue' && section.role !== 'operatingExpense') continue
    for (const item of section.items) {
      allocation.push({
        sectionId: section.id,
        itemId: item.id,
        label: item.label,
        value: item.value,
        pct: totalExpenses !== 0 ? (item.value / totalExpenses) * 100 : 0,
      })
    }
  }

  return {
    totalRevenue,
    totalCostOfRevenue,
    grossProfit,
    grossMarginPct,
    totalOperatingExpenses,
    operatingIncome,
    netIncome,
    totalExpenses,
    hasRevenueSection: report.sections.some((s) => s.role === 'revenue'),
    hasCostOfRevenueSection: report.sections.some((s) => s.role === 'costOfRevenue'),
    hasOperatingExpenseSection: report.sections.some((s) => s.role === 'operatingExpense'),
    allocation,
  }
}
