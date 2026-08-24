'use client'

import { Download, FileJson, FileText, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { exportReportAsJson, exportReportAsStandaloneHtml } from '@/lib/report/export'
import type { ReportDocument } from '@/lib/report/types'

interface ExportMenuProps {
  report: ReportDocument
}

export function ExportMenu({ report }: ExportMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download /> Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => window.print()}>
          <Printer /> Print / Save as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => exportReportAsStandaloneHtml(report)}>
          <FileText /> Export as HTML
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => exportReportAsJson(report)}>
          <FileJson /> Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
