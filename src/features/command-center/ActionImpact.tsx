import { Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { StatusChip } from '@/components/ui/StatusChip'
import { impactCards } from '@/data/mockData'

export function ActionImpact() {
  return (
    <section>
      <h2 className="text-[22px] font-bold tracking-tight">
        Action impact
        <span className="ml-2.5 text-sm font-medium text-ink-tertiary">
          — did it work?
        </span>
      </h2>
      <p className="mt-1 text-sm text-ink-secondary">
        Closed-loop measurement from intervention to outcome.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {impactCards.map((card) => (
          <Card key={card.action} className="p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold tracking-[0.08em] text-ink-tertiary uppercase">
                {card.action}
              </p>
              <StatusChip tone={card.tone} dot>
                {card.status}
              </StatusChip>
            </div>
            <p className="mt-2.5 text-lg leading-snug font-bold">
              {card.result}
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-[13px] text-ink-secondary">
              <Clock className="size-3.5" />
              {card.time}
            </p>
          </Card>
        ))}
      </div>
    </section>
  )
}
