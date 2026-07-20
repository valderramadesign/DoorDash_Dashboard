import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { FixingBadge, InQueueBadge } from '@/components/ui/InQueueBadge'
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
  queued,
  active,
}: {
  card: SummaryCard
  onOpenAlert: (
    title: string,
    tone: Tone,
    alert: TileAlert,
    origin: MorphOrigin,
  ) => void
  queued: boolean
  active: boolean
}) {
  const locked = queued || active
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
        card.alert && !locked
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
        'p-6 transition-[box-shadow,opacity]',
        card.alert && !locked && 'cursor-pointer hover:shadow-md',
        locked && 'cursor-not-allowed opacity-60',
      )}
    >
      <div className="flex flex-wrap-reverse items-center justify-between gap-x-2 gap-y-1.5">
        <p className="text-xs font-semibold tracking-[0.08em] text-ink-tertiary uppercase">
          {card.label}
        </p>
        {queued ? (
          <InQueueBadge />
        ) : active ? (
          <FixingBadge />
        ) : (
          <StatusChip tone={card.tone}>{card.chip}</StatusChip>
        )}
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
  queuedIssueIds: Set<string>
  activeIssueId: string | null
}

export function StatusSummaryCards({
  cards,
  onOpenAlert,
  queuedIssueIds,
  activeIssueId,
}: StatusSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <MetricCard
          key={card.label}
          card={card}
          onOpenAlert={onOpenAlert}
          queued={!!card.alert?.issueId && queuedIssueIds.has(card.alert.issueId)}
          active={!!card.alert?.issueId && card.alert.issueId === activeIssueId}
        />
      ))}
    </div>
  )
}
