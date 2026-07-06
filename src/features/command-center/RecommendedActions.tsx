import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusChip } from '@/components/ui/StatusChip'
import { recommendedActions } from '@/data/mockData'
import type { Tone } from '@/types'

const confidenceTone: Record<string, Tone> = {
  High: 'good',
  Medium: 'warn',
  Low: 'danger',
}

export function RecommendedActions() {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <Card className="p-6">
      <div>
        <h2 className="text-[22px] font-bold tracking-tight">
          Recommended actions
        </h2>
        <p className="mt-1 text-sm text-ink-secondary">
          Operational actions ranked by urgency, expected impact, and
          confidence.
        </p>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs font-semibold tracking-[0.08em] text-ink-tertiary uppercase">
              <th className="w-10 pb-3" />
              <th className="pb-3 pr-4 font-semibold">Action</th>
              <th className="pb-3 pr-4 font-semibold">Expected impact</th>
              <th className="pb-3 pr-4 font-semibold">Owner</th>
              <th className="pb-3 pr-4 font-semibold">Confidence</th>
              <th className="pb-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {recommendedActions.map((row) => (
              <tr
                key={row.id}
                className="border-b border-line last:border-0 hover:bg-canvas/60"
              >
                <td className="py-3.5 pr-2">
                  <input
                    type="checkbox"
                    checked={selected.has(row.id)}
                    onChange={() => toggle(row.id)}
                    aria-label={`Select ${row.action}`}
                    className="size-4 cursor-pointer rounded border-line accent-[#eb1700]"
                  />
                </td>
                <td className="py-3.5 pr-4 font-semibold">{row.action}</td>
                <td className="py-3.5 pr-4 text-ink-secondary">{row.impact}</td>
                <td className="py-3.5 pr-4 text-ink-secondary">{row.owner}</td>
                <td className="py-3.5 pr-4">
                  <StatusChip tone={confidenceTone[row.confidence]} dot>
                    {row.confidence}
                  </StatusChip>
                </td>
                <td className="py-3.5">
                  <StatusChip tone={row.statusTone}>{row.status}</StatusChip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <Button variant="primary" disabled={selected.size === 0}>
          Approve selected{selected.size > 0 ? ` (${selected.size})` : ''}
        </Button>
        <Button variant="secondary">Assign owner</Button>
        <Button variant="ghost">View action history</Button>
      </div>
    </Card>
  )
}
