'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Copy, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ReportEditor } from './ReportEditor'
import { ReportStatement } from './ReportStatement'
import { ExportMenu } from './ExportMenu'
import { deleteReport, duplicateReport, getReport, saveReport } from '@/lib/report/storage'
import type { ReportDocument } from '@/lib/report/types'

interface ReportWorkspaceProps {
  reportId: string
}

export function ReportWorkspace({ reportId }: ReportWorkspaceProps) {
  const router = useRouter()
  const [report, setReport] = useState<ReportDocument | null | undefined>(undefined)
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setReport(getReport(reportId) ?? null)
  }, [reportId])

  const handleChange = useCallback(
    (next: ReportDocument) => {
      setReport(next)
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
      saveTimeout.current = setTimeout(() => saveReport(next), 400)
    },
    [],
  )

  const handleDelete = () => {
    if (!report) return
    if (!window.confirm(`Delete "${report.meta.companyName}"? This cannot be undone.`)) return
    deleteReport(report.id)
    router.push('/')
  }

  const handleDuplicate = () => {
    if (!report) return
    const copy = duplicateReport(report.id)
    if (copy) {
      toast.success('Report duplicated')
      router.push(`/reports/${copy.id}`)
    }
  }

  if (report === undefined) {
    return <div className="p-8 text-sm text-muted-foreground">Loading report…</div>
  }

  if (report === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-sm text-muted-foreground">This report doesn&apos;t exist in this browser&apos;s storage.</p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft /> Back to reports
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b bg-background px-4 py-3 print:hidden">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/" aria-label="Back to reports">
              <ArrowLeft />
            </Link>
          </Button>
          <div>
            <div className="text-sm font-semibold">{report.meta.companyName || 'Untitled report'}</div>
            <div className="text-xs text-muted-foreground">{report.meta.period}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleDuplicate}>
            <Copy /> Duplicate
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            <Trash2 className="text-destructive" /> Delete
          </Button>
          <ExportMenu report={report} />
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,760px)] print:block print:p-0">
        <div className="print:hidden">
          <ReportEditor report={report} onChange={handleChange} />
        </div>
        <div className="lg:sticky lg:top-[72px] lg:self-start">
          <div className="rounded-lg border bg-white shadow-sm print:border-0 print:shadow-none">
            <div id="folio-print-area">
              <ReportStatement report={report} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
