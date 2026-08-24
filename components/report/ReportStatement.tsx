import type { CSSProperties } from 'react'
import type { ReportDocument } from '@/lib/report/types'
import { computeReportTotals } from '@/lib/report/calculations'
import { formatCurrencyValue, formatPercent, formatPlainNumber } from '@/lib/report/format'

interface ReportStatementProps {
  report: ReportDocument
}

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
}

const labelStyle: CSSProperties = {
  textAlign: 'left',
  padding: '2px 0',
}

const valueStyle: CSSProperties = {
  textAlign: 'right',
  padding: '2px 0',
  width: '110px',
}

const rowBg = (index: number) => (index % 2 === 1 ? '#f7f7f7' : '#fff')

/**
 * Pure, presentational renderer for a ReportDocument in the "condensed
 * statement of operations" visual style. No editing affordances live here —
 * this is what gets shown in the live preview, printed, and exported to
 * standalone HTML, so it must stay a deterministic function of `report`.
 */
export function ReportStatement({ report }: ReportStatementProps) {
  const totals = computeReportTotals(report)
  const showSummary =
    totals.hasRevenueSection && (totals.hasCostOfRevenueSection || totals.hasOperatingExpenseSection)

  return (
    <div
      data-folio-report-root
      style={{
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: '10pt',
        lineHeight: '1.3',
        color: '#000',
        backgroundColor: '#fff',
        padding: '24px 16px',
        maxWidth: '700px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '11pt' }}>{report.meta.companyName}</div>
        <div style={{ fontWeight: 'bold', fontSize: '10pt', marginTop: '4px' }}>{report.meta.reportTitle}</div>
        {report.meta.unitNote && <div style={{ fontSize: '9pt', marginTop: '2px' }}>{report.meta.unitNote}</div>}
      </div>

      {/* Period header */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <td style={{ width: '60%' }}></td>
            <td
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '9pt',
                borderBottom: '1px solid #999',
                paddingBottom: '3px',
              }}
            >
              {report.meta.period}
            </td>
          </tr>
        </thead>
      </table>

      {/* Sections */}
      {report.sections.map((section) => {
        const sectionTotal = section.items.reduce((sum, item) => sum + (item.value || 0), 0)
        return (
          <table key={section.id} style={{ ...tableStyle, marginTop: '8px' }}>
            <tbody>
              <tr style={{ background: rowBg(0) }}>
                <td style={labelStyle}>{section.title}</td>
                <td style={valueStyle}></td>
              </tr>
              {section.items.map((item, i) => {
                const isLast = i === section.items.length - 1
                return (
                  <tr key={item.id} style={{ background: rowBg(i + 1) }}>
                    <td style={{ ...labelStyle, paddingLeft: '16px' }}>{item.label}</td>
                    <td style={{ ...valueStyle, borderBottom: isLast ? '1px solid #000' : undefined }}>
                      {formatCurrencyValue(item.value, item.showCurrencySymbol)}
                    </td>
                  </tr>
                )
              })}
              <tr style={{ background: rowBg(section.items.length + 1) }}>
                <td style={{ ...labelStyle, paddingLeft: '32px' }}>{section.totalLabel}</td>
                <td style={valueStyle}>{formatCurrencyValue(sectionTotal)}</td>
              </tr>
            </tbody>
          </table>
        )
      })}

      {/* Derived summary: gross profit / operating income / net income */}
      {showSummary && (
        <table style={{ ...tableStyle, marginTop: '8px' }}>
          <tbody>
            <tr style={{ background: rowBg(0) }}>
              <td style={labelStyle}>Summary:</td>
              <td style={valueStyle}></td>
            </tr>
            {totals.hasCostOfRevenueSection && (
              <>
                <tr style={{ background: rowBg(1) }}>
                  <td style={{ ...labelStyle, paddingLeft: '16px' }}>Gross profit</td>
                  <td style={valueStyle}>{formatCurrencyValue(totals.grossProfit)}</td>
                </tr>
                <tr style={{ background: rowBg(2) }}>
                  <td style={{ ...labelStyle, paddingLeft: '16px' }}>Gross margin</td>
                  <td style={valueStyle}>{formatPercent(totals.grossMarginPct)}</td>
                </tr>
              </>
            )}
            <tr style={{ background: rowBg(3) }}>
              <td style={{ ...labelStyle, paddingLeft: '16px' }}>Operating income</td>
              <td style={valueStyle}>{formatCurrencyValue(totals.operatingIncome)}</td>
            </tr>
            <tr style={{ background: rowBg(4) }}>
              <td style={labelStyle}>Net income</td>
              <td style={{ ...valueStyle, borderBottom: '3px double #000' }}>
                {formatCurrencyValue(totals.netIncome, true)}
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {/* Key metrics */}
      {report.keyMetrics.length > 0 && (
        <table style={{ ...tableStyle, marginTop: '16px' }}>
          <tbody>
            <tr style={{ background: rowBg(0) }}>
              <td style={labelStyle}>Key metrics:</td>
              <td style={valueStyle}></td>
            </tr>
            {report.keyMetrics.map((metric, i) => (
              <tr key={metric.id} style={{ background: rowBg(i + 1) }}>
                <td style={{ ...labelStyle, paddingLeft: '16px' }}>{metric.label}</td>
                <td style={valueStyle}>
                  {metric.format === 'currency' && formatCurrencyValue(metric.value, true)}
                  {metric.format === 'number' && formatPlainNumber(metric.value)}
                  {metric.format === 'percent' && formatPercent(metric.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Expense allocation */}
      {report.showAllocationBreakdown && totals.allocation.length > 0 && (
        <table style={{ ...tableStyle, marginTop: '16px' }}>
          <tbody>
            <tr style={{ background: rowBg(0) }}>
              <td style={labelStyle}>Expense allocation:</td>
              <td style={valueStyle}></td>
            </tr>
            {totals.allocation.map((row, i) => {
              const isLast = i === totals.allocation.length - 1
              return (
                <tr key={row.itemId} style={{ background: rowBg(i + 1) }}>
                  <td style={{ ...labelStyle, paddingLeft: '16px' }}>{row.label}</td>
                  <td style={{ ...valueStyle, borderBottom: isLast ? '1px solid #000' : undefined }}>
                    {formatPercent(row.pct, 0)}
                  </td>
                </tr>
              )
            })}
            <tr style={{ background: rowBg(totals.allocation.length + 1) }}>
              <td style={{ ...labelStyle, paddingLeft: '32px' }}>Total</td>
              <td style={valueStyle}>100%</td>
            </tr>
          </tbody>
        </table>
      )}

      {/* Cumulative figure */}
      {report.cumulative.enabled && (
        <table style={{ ...tableStyle, marginTop: '16px' }}>
          <tbody>
            <tr style={{ background: rowBg(0) }}>
              <td style={labelStyle}>{report.cumulative.label}</td>
              <td style={{ ...valueStyle, borderBottom: '3px double #000' }}>
                {formatCurrencyValue(report.cumulative.value, true)}
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {/* Footer */}
      {report.meta.footerNote && (
        <div style={{ marginTop: '24px', fontSize: '8pt', color: '#666' }}>{report.meta.footerNote}</div>
      )}
    </div>
  )
}
