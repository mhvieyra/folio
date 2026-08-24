'use client'

import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createId } from '@/lib/report/id'
import { removeAt, updateAt } from '@/lib/report/array-utils'
import { METRIC_FORMAT_LABELS, type KeyMetric, type MetricFormat } from '@/lib/report/types'

interface KeyMetricsEditorProps {
  metrics: KeyMetric[]
  onChange: (metrics: KeyMetric[]) => void
}

export function KeyMetricsEditor({ metrics, onChange }: KeyMetricsEditorProps) {
  return (
    <div className="space-y-2">
      {metrics.map((metric, index) => (
        <div key={metric.id} className="flex items-center gap-2">
          <Input
            value={metric.label}
            onChange={(e) => onChange(updateAt(metrics, index, { label: e.target.value }))}
            placeholder="Metric name"
            className="flex-1"
          />
          <Input
            type="number"
            step="any"
            value={metric.value}
            onChange={(e) => onChange(updateAt(metrics, index, { value: Number(e.target.value) }))}
            className="w-28"
          />
          <Select
            value={metric.format}
            onValueChange={(value) => onChange(updateAt(metrics, index, { format: value as MetricFormat }))}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(METRIC_FORMAT_LABELS).map(([format, label]) => (
                <SelectItem key={format} value={format}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onChange(removeAt(metrics, index))}
            aria-label="Remove metric"
          >
            <Trash2 className="text-destructive" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...metrics, { id: createId('metric'), label: 'New metric', value: 0, format: 'number' }])}
      >
        <Plus /> Add metric
      </Button>
    </div>
  )
}
