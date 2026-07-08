import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { StatusChip } from '@/components/ui/StatusChip'
import type { MorphOrigin, SummaryCard, Tone, TileAlert } from '@/types'
import { cn, morphOriginFrom } from '@/lib/utils'

const trendIcons = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
}

const toneTextColor: Record<SummaryCard['tone'], string> = {
  danger: 'text-danger',
  warn: 'text-warn',
  good: 'text-good',
  neutral: 'text-ink-secondary',
}

function MetricCard({
  card,
  onOpenAlert,
}: {
  card: SummaryCard
  onOpenAlert: (
    title: string,
    tone: Tone,
    alert: TileAlert,
    origin: MorphOrigin,
  ) => void
}) {
  const TrendIcon = trendIcons[card.trendDirection]
  const trendColor =
    card.tone === 'good'
      ? 'text-good'
      : card.tone === 'warn'
        ? 'text-warn'
        : 'text-danger'

  return (
    <Card
      onClick={
        card.alert
          ? (e) =>
              onOpenAlert(
                card.label,
                card.tone,
                card.alert!,
                morphOriginFrom(e.currentTarget),
              )
          : undefined
      }
      className={cn(
        'p-6 transition-shadow hover:shadow-md',
        card.alert && 'cursor-pointer',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold tracking-[0.08em] text-ink-tertiary uppercase">
          {card.label}
        </p>
        <StatusChip tone={card.tone}>{card.chip}</StatusChip>
      </div>
      <p
        className={`mt-3 text-[34px] leading-none font-bold tracking-tight ${toneTextColor[card.tone]}`}
      >
        {card.metric}
        {card.metricSuffix && (
          <span className="text-lg font-semibold text-ink-tertiary">
            {card.metricSuffix}
          </span>
        )}
      </p>
      <p className="mt-2.5 text-sm text-ink-secondary">{card.supporting}</p>
      <p className={`mt-1.5 flex items-center gap-1 text-[13px] font-semibold ${trendColor}`}>
        <TrendIcon className="size-3.5" />
        {card.trend}
      </p>
    </Card>
  )
}

interface StatusSummaryCardsProps {
  cards: SummaryCard[]
  onOpenAlert: (
    title: string,
    tone: Tone,
    alert: TileAlert,
    origin: MorphOrigin,
  ) => void
}

export function StatusSummaryCards({ cards, onOpenAlert }: StatusSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <MetricCard key={card.label} card={card} onOpenAlert={onOpenAlert} />
      ))}
    </div>
  )
}
