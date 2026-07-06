import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusChip } from '@/components/ui/StatusChip'
import { imbalanceDrivers, zones } from '@/data/mockData'
import type { Tone, TileAlert, Zone } from '@/types'
import { cn } from '@/lib/utils'

const toneDot: Record<Tone, string> = {
  danger: 'bg-danger',
  warn: 'bg-warn',
  good: 'bg-good',
  neutral: 'bg-ink-tertiary',
}

const toneText: Record<Tone, string> = {
  danger: 'text-danger',
  warn: 'text-warn',
  good: 'text-good',
  neutral: 'text-ink-secondary',
}

const toneBorder: Record<Tone, string> = {
  danger: 'border-danger/25',
  warn: 'border-warn/25',
  good: 'border-good/25',
  neutral: 'border-line',
}

function ZoneTile({
  zone,
  onOpenAlert,
}: {
  zone: Zone
  onOpenAlert: (title: string, tone: Tone, alert: TileAlert) => void
}) {
  return (
    <div
      onClick={
        zone.alert ? () => onOpenAlert(zone.name, zone.tone, zone.alert!) : undefined
      }
      className={cn(
        'rounded-2xl border bg-white p-4 transition-colors hover:border-ink-tertiary/40',
        toneBorder[zone.tone],
        zone.alert && 'cursor-pointer',
      )}
    >
      <div className="flex items-center gap-1.5">
        <span className={cn('size-2 shrink-0 rounded-full', toneDot[zone.tone])} />
        <h4 className="truncate text-xs font-bold text-ink-secondary">{zone.name}</h4>
      </div>
      <p className={cn('mt-2 text-xl leading-none font-bold', toneText[zone.tone])}>
        {zone.demand}
      </p>
      <p className="mt-1.5 text-[10px] text-ink-tertiary">Demand</p>
      <p className={cn('mt-1.5 text-xs font-semibold', toneText[zone.tone])}>
        {zone.supplyGap} supply
      </p>
      <p className="mt-1.5 text-[10px] text-ink-tertiary">{zone.deliveryTime}</p>
      <StatusChip tone={zone.tone} className="mt-3">
        {zone.status}
      </StatusChip>
    </div>
  )
}

interface MarketplaceBalanceProps {
  onOpenAlert: (title: string, tone: Tone, alert: TileAlert) => void
}

export function MarketplaceBalance({ onOpenAlert }: MarketplaceBalanceProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[22px] font-bold tracking-tight">
            Marketplace balance
          </h2>
          <p className="mt-1 text-sm text-ink-secondary">
            Zone-level view of demand, supply, and delivery reliability.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_280px]">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {zones.map((zone) => (
            <ZoneTile key={zone.name} zone={zone} onOpenAlert={onOpenAlert} />
          ))}
        </div>

        <div className="flex flex-col rounded-2xl bg-canvas p-5">
          <h3 className="text-xs font-semibold tracking-[0.08em] text-ink-tertiary uppercase">
            Top imbalance drivers
          </h3>
          <ol className="mt-3 flex-1 space-y-2.5">
            {imbalanceDrivers.map((driver, i) => (
              <li key={driver} className="flex items-center gap-3 text-sm font-semibold">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-ink-secondary">
                  {i + 1}
                </span>
                {driver}
              </li>
            ))}
          </ol>
          <Button variant="dark" size="sm" className="mt-4 w-full">
            Open zone detail
            <ArrowRight className="ml-1.5 inline size-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
