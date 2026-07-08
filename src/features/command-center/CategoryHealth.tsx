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
}

export function CategoryHealth({ onOpenAlert }: CategoryHealthProps) {
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
            return (
              <div
                key={category.name}
                onClick={
                  category.alert
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
                  'rounded-2xl border border-line p-5 transition-colors hover:border-ink-tertiary/40',
                  category.alert && 'cursor-pointer',
                )}
              >
                <div className="flex items-center justify-between">
                  <Icon className="size-5 text-ink-secondary" />
                  <StatusChip tone={category.tone} dot>
                    {category.status}
                  </StatusChip>
                </div>
                <h3 className="mt-3 text-[15px] font-bold">{category.name}</h3>
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
