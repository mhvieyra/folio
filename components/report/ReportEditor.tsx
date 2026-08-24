'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SectionEditor } from './SectionEditor'
import { KeyMetricsEditor } from './KeyMetricsEditor'
import { createId } from '@/lib/report/id'
import { moveItem, removeAt, updateAt } from '@/lib/report/array-utils'
import type { ReportDocument, ReportSection } from '@/lib/report/types'

interface ReportEditorProps {
  report: ReportDocument
  onChange: (report: ReportDocument) => void
}

export function ReportEditor({ report, onChange }: ReportEditorProps) {
  const updateMeta = (patch: Partial<ReportDocument['meta']>) =>
    onChange({ ...report, meta: { ...report.meta, ...patch } })

  const updateSections = (sections: ReportSection[]) => onChange({ ...report, sections })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Report details</CardTitle>
          <CardDescription>The header block shown at the top of the statement.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Company / entity name</Label>
            <Input value={report.meta.companyName} onChange={(e) => updateMeta({ companyName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Statement title</Label>
            <Input value={report.meta.reportTitle} onChange={(e) => updateMeta({ reportTitle: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Period</Label>
            <Input value={report.meta.period} onChange={(e) => updateMeta({ period: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Unit note</Label>
            <Input value={report.meta.unitNote} onChange={(e) => updateMeta({ unitNote: e.target.value })} placeholder="(In USD)" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Footer disclosure</Label>
            <Textarea
              value={report.meta.footerNote}
              onChange={(e) => updateMeta({ footerNote: e.target.value })}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sections</CardTitle>
          <CardDescription>
            Each section becomes a table in the statement. Its role determines how it feeds gross profit,
            operating income and net income further down.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {report.sections.map((section, index) => (
            <SectionEditor
              key={section.id}
              section={section}
              onChange={(next) => updateSections(updateAt(report.sections, index, next))}
              onRemove={() => updateSections(removeAt(report.sections, index))}
              onMoveUp={() => updateSections(moveItem(report.sections, index, index - 1))}
              onMoveDown={() => updateSections(moveItem(report.sections, index, index + 1))}
            />
          ))}
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              updateSections([
                ...report.sections,
                {
                  id: createId('section'),
                  title: 'New section:',
                  role: 'other',
                  totalLabel: 'Total',
                  items: [{ id: createId('item'), label: 'Line item', value: 0 }],
                },
              ])
            }
          >
            <Plus /> Add section
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key metrics</CardTitle>
          <CardDescription>Optional operating metrics shown below the summary block.</CardDescription>
        </CardHeader>
        <CardContent>
          <KeyMetricsEditor metrics={report.keyMetrics} onChange={(keyMetrics) => onChange({ ...report, keyMetrics })} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expense allocation</CardTitle>
          <CardDescription>
            Auto-computed as each cost-of-revenue and operating-expense line item's share of total expenses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label className="flex items-center gap-2">
            <Checkbox
              checked={report.showAllocationBreakdown}
              onCheckedChange={(checked) => onChange({ ...report, showAllocationBreakdown: !!checked })}
            />
            Show expense allocation breakdown
          </Label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cumulative figure</CardTitle>
          <CardDescription>An optional single figure shown above the footer, e.g. revenue since inception.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label className="flex items-center gap-2">
            <Checkbox
              checked={report.cumulative.enabled}
              onCheckedChange={(checked) =>
                onChange({ ...report, cumulative: { ...report.cumulative, enabled: !!checked } })
              }
            />
            Show cumulative figure
          </Label>
          {report.cumulative.enabled && (
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <Input
                value={report.cumulative.label}
                onChange={(e) => onChange({ ...report, cumulative: { ...report.cumulative, label: e.target.value } })}
              />
              <Input
                type="number"
                step="any"
                className="sm:w-40"
                value={report.cumulative.value}
                onChange={(e) =>
                  onChange({ ...report, cumulative: { ...report.cumulative, value: Number(e.target.value) } })
                }
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
