import { Radar } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { StatusChip } from '@/components/ui/StatusChip'
import { riskWatch } from '@/data/mockData'

export function RiskWatch() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-full bg-canvas text-ink-secondary">
          <Radar className="size-4" />
        </span>
        <div>
          <h2 className="text-[18px] font-bold tracking-tight">Risk Watch</h2>
          <p className="text-sm text-ink-secondary">
            Emerging issues that may need action soon.
          </p>
        </div>
      </div>

      <ul className="mt-4 divide-y divide-line">
        {riskWatch.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 py-3.5 first:pt-0 last:pb-0"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">{item.title}</p>
              <p className="mt-0.5 text-[13px] text-ink-secondary">
                <span className="text-ink-tertiary">Risk:</span> {item.risk}
              </p>
            </div>
            <StatusChip tone={item.statusTone} dot>
              {item.status}
            </StatusChip>
          </li>
        ))}
      </ul>
    </Card>
  )
}
