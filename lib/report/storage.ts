import type { ReportDocument } from './types'
import { buildSampleReport } from './sample'
import { createId } from './id'

const STORAGE_KEY = 'folio.reports.v1'

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

function readAll(): ReportDocument[] {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(reports: ReportDocument[]): void {
  if (!isBrowser()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
}

/** Returns saved reports, newest first. Seeds the demo report on first run. */
export function listReports(): ReportDocument[] {
  const reports = readAll()
  if (reports.length === 0) {
    const seeded = [buildSampleReport()]
    writeAll(seeded)
    return seeded
  }
  return [...reports].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export function getReport(id: string): ReportDocument | undefined {
  return readAll().find((report) => report.id === id)
}

export function saveReport(report: ReportDocument): ReportDocument {
  const reports = readAll()
  const next = { ...report, updatedAt: new Date().toISOString() }
  const index = reports.findIndex((r) => r.id === report.id)
  if (index >= 0) {
    reports[index] = next
  } else {
    reports.push(next)
  }
  writeAll(reports)
  return next
}

export function deleteReport(id: string): void {
  writeAll(readAll().filter((report) => report.id !== id))
}

export function duplicateReport(id: string): ReportDocument | undefined {
  const source = getReport(id)
  if (!source) return undefined
  const now = new Date().toISOString()
  const copy: ReportDocument = {
    ...(JSON.parse(JSON.stringify(source)) as ReportDocument),
    id: createId('report'),
    createdAt: now,
    updatedAt: now,
  }
  const reports = readAll()
  reports.push(copy)
  writeAll(reports)
  return copy
}
