'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Copy, FileUp, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { deleteReport, duplicateReport, listReports, saveReport } from '@/lib/report/storage'
import { buildBlankReport } from '@/lib/report/sample'
import { importReportFromJson } from '@/lib/report/export'
import { createId } from '@/lib/report/id'
import type { ReportDocument } from '@/lib/report/types'

export function Dashboard() {
  const router = useRouter()
  const [reports, setReports] = useState<ReportDocument[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setReports(listReports())
  }, [])

  const refresh = () => setReports(listReports())

  const handleNew = () => {
    const report = saveReport(buildBlankReport())
    router.push(`/reports/${report.id}`)
  }

  const handleDuplicate = (id: string) => {
    const copy = duplicateReport(id)
    if (copy) {
      toast.success('Report duplicated')
      refresh()
    }
  }

  const handleDelete = (report: ReportDocument) => {
    if (!window.confirm(`Delete "${report.meta.companyName}"? This cannot be undone.`)) return
    deleteReport(report.id)
    refresh()
  }

  const handleImportClick = () => fileInputRef.current?.click()

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const text = await file.text()
      const imported = importReportFromJson(text)
      const saved = saveReport({ ...imported, id: createId('report') })
      toast.success('Report imported')
      router.push(`/reports/${saved.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not import that file')
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Folio</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Build and export condensed financial statements in an iXBRL-inspired visual style. Purely a design
            template — not a compliant iXBRL/XBRL filing tool.
          </p>
        </div>
        <div className="flex gap-2">
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
          <Button variant="outline" onClick={handleImportClick}>
            <FileUp /> Import JSON
          </Button>
          <Button onClick={handleNew}>
            <Plus /> New report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <CardTitle className="truncate">{report.meta.companyName || 'Untitled report'}</CardTitle>
              <CardDescription className="truncate">{report.meta.period}</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Updated {new Date(report.updatedAt).toLocaleString()}
            </CardContent>
            <CardFooter className="flex items-center justify-between gap-2">
              <Button asChild size="sm">
                <Link href={`/reports/${report.id}`}>Open</Link>
              </Button>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon-sm" onClick={() => handleDuplicate(report.id)} aria-label="Duplicate">
                  <Copy />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(report)} aria-label="Delete">
                  <Trash2 className="text-destructive" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
