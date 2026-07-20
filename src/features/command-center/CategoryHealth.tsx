import { useState } from 'react'
import {
  Beer,
  ChevronDown,
  Package,
  ShoppingBasket,
  Store,
  UtensilsCrossed,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { FixingBadge, InQueueBadge } from '@/components/ui/InQueueBadge'
import { StatusChip } from '@/components/ui/StatusChip'
import { categories } from '@/data/mockData'
import type { MorphOrigin, Tone, TileAlert } from '@/types'
import { cn, morphOriginFrom } from '@/lib/utils'

const categoryIcons: Record<string, LucideIcon> = {
  Restaurants: UtensilsCrossed,
  Grocery: ShoppingBasket,
  Convenience: Store,
  Retail: Package,
  Alcohol: Beer,
}

const toneTextColor: Record<Tone, string> = {
  danger: 'text-danger',
  warn: 'text-warn',
  good: 'text-good',
  neutral: 'text-ink-secondary',
}

interface CategoryHealthProps {
  onOpenAlert: (
    title: string,
    tone: Tone,
    alert: TileAlert,
    origin: MorphOrigin,
  ) => void
  queuedIssueIds: Set<string>
  activeIssueId: string | null
}

export function CategoryHealth({ onOpenAlert, queuedIssueIds, activeIssueId }: CategoryHealthProps) {
  const [open, setOpen] = useState(false)

  return (
    <Card className="p-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
      >
        <div>
          <h2 className="text-[18px] font-bold tracking-tight">
            Category health
          </h2>
          <p className="mt-0.5 text-sm text-ink-secondary">
            Reference view of demand and reliability by category.
          </p>
        </div>
        <ChevronDown
          className={cn(
            'size-5 shrink-0 text-ink-tertiary transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((category) => {
            const Icon = categoryIcons[category.name] ?? Store
            const queued =
              !!category.alert?.issueId && queuedIssueIds.has(category.alert.issueId)
            const active =
              !!category.alert?.issueId && category.alert.issueId === activeIssueId
            const locked = queued || active
            return (
              <div
                key={category.name}
                onClick={
                  category.alert && !locked
                    ? (e) =>
                        onOpenAlert(
                          category.name,
                          category.tone,
                          category.alert!,
                          morphOriginFrom(e.currentTarget),
                        )
                    : undefined
                }
                className={cn(
                  'rounded-2xl border border-line p-5 transition-[opacity,border-color]',
                  category.alert && !locked && 'cursor-pointer hover:border-ink-tertiary/40',
                  locked && 'cursor-not-allowed opacity-60',
                )}
              >
                <div className="flex flex-wrap-reverse items-center justify-between gap-x-2 gap-y-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className="size-5 text-ink-secondary" />
                    <h3 className="text-[15px] font-bold">{category.name}</h3>
                  </div>
                  {queued ? (
                    <InQueueBadge />
                  ) : active ? (
                    <FixingBadge />
                  ) : (
                    <StatusChip tone={category.tone} dot>
                      {category.status}
                    </StatusChip>
                  )}
                </div>
                <p
                  className={`mt-1 text-xl font-bold tracking-tight ${toneTextColor[category.tone]}`}
                >
                  {category.metric.replace(' demand', '')}
                  <span className="ml-1 text-[13px] font-medium text-ink-tertiary">
                    demand
                  </span>
                </p>
                <p className="mt-0.5 text-[13px] text-ink-secondary">
                  {category.detail}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
