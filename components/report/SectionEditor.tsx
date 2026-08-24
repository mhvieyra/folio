'use client'

import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createId } from '@/lib/report/id'
import { removeAt, updateAt } from '@/lib/report/array-utils'
import { SECTION_ROLE_LABELS, type ReportSection, type SectionRole } from '@/lib/report/types'

interface SectionEditorProps {
  section: ReportSection
  onChange: (section: ReportSection) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export function SectionEditor({ section, onChange, onRemove, onMoveUp, onMoveDown }: SectionEditorProps) {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Section heading</Label>
            <Input
              value={section.title}
              onChange={(e) => onChange({ ...section, title: e.target.value })}
              placeholder="Revenue:"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select
              value={section.role}
              onValueChange={(value) => onChange({ ...section, role: value as SectionRole })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SECTION_ROLE_LABELS).map(([role, label]) => (
                  <SelectItem key={role} value={role}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Subtotal row label</Label>
            <Input
              value={section.totalLabel}
              onChange={(e) => onChange({ ...section, totalLabel: e.target.value })}
              placeholder="Total net revenue"
            />
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-1">
          <Button type="button" variant="ghost" size="icon-sm" onClick={onMoveUp} aria-label="Move section up">
            <ArrowUp />
          </Button>
          <Button type="button" variant="ghost" size="icon-sm" onClick={onMoveDown} aria-label="Move section down">
            <ArrowDown />
          </Button>
          <Button type="button" variant="ghost" size="icon-sm" onClick={onRemove} aria-label="Remove section">
            <Trash2 className="text-destructive" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {section.items.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2">
            <Input
              value={item.label}
              onChange={(e) => onChange({ ...section, items: updateAt(section.items, index, { label: e.target.value }) })}
              placeholder="Line item label"
              className="flex-1"
            />
            <Input
              type="number"
              step="any"
              value={item.value}
              onChange={(e) =>
                onChange({ ...section, items: updateAt(section.items, index, { value: Number(e.target.value) }) })
              }
              className="w-32"
            />
            <Label className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
              <Checkbox
                checked={!!item.showCurrencySymbol}
                onCheckedChange={(checked) =>
                  onChange({ ...section, items: updateAt(section.items, index, { showCurrencySymbol: !!checked }) })
                }
              />
              $
            </Label>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onChange({ ...section, items: removeAt(section.items, index) })}
              aria-label="Remove line item"
            >
              <Trash2 className="text-destructive" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onChange({
              ...section,
              items: [...section.items, { id: createId('item'), label: 'New line item', value: 0 }],
            })
          }
        >
          <Plus /> Add line item
        </Button>
      </div>
    </div>
  )
}
