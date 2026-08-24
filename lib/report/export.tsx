import { renderToStaticMarkup } from 'react-dom/server'
import type { ReportDocument } from './types'
import { ReportStatement } from '@/components/report/ReportStatement'

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'report'
  )
}

export function reportFileBaseName(report: ReportDocument): string {
  return `${slugify(report.meta.companyName)}-${slugify(report.meta.period)}`
}

function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export function exportReportAsJson(report: ReportDocument): void {
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
  downloadBlob(`${reportFileBaseName(report)}.json`, blob)
}

/**
 * Renders the report to a fully self-contained HTML file (inline styles,
 * no external assets) so it can be opened, archived, or emailed without
 * this app.
 */
export function exportReportAsStandaloneHtml(report: ReportDocument): void {
  const markup = renderToStaticMarkup(<ReportStatement report={report} />)
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${report.meta.companyName} — ${report.meta.period}</title>
<meta name="generator" content="Folio (github.com/mhvieyra/folio)" />
</head>
<body style="margin:0;background:#fff;">
${markup}
</body>
</html>
`
  const blob = new Blob([html], { type: 'text/html' })
  downloadBlob(`${reportFileBaseName(report)}.html`, blob)
}

export function importReportFromJson(text: string): ReportDocument {
  const parsed = JSON.parse(text)
  if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.sections)) {
    throw new Error('This file is not a valid Folio report.')
  }
  return parsed as ReportDocument
}
