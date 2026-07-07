import { ArrowRight, Target } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { StatusChip } from '@/components/ui/StatusChip'
import { impactTracking } from '@/data/mockData'

export function ImpactTracking() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-full bg-canvas text-ink-secondary">
          <Target className="size-4" />
        </span>
        <div>
          <h2 className="text-[18px] font-bold tracking-tight">
            Impact tracking
          </h2>
          <p className="text-sm text-ink-secondary">
            Recent actions and whether they improved marketplace health.
          </p>
        </div>
      </div>

      <ul className="mt-4 divide-y divide-line">
        {impactTracking.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3.5 first:pt-0 last:pb-0"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">{item.action}</p>
              <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[13px] text-ink-secondary">
                <span>{item.before}</span>
                <ArrowRight className="size-3.5 text-ink-tertiary" />
                <span className="font-semibold text-ink">{item.after}</span>
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
