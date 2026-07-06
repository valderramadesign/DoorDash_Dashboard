import {
  Beer,
  Package,
  ShoppingBasket,
  Store,
  UtensilsCrossed,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { StatusChip } from '@/components/ui/StatusChip'
import { categories } from '@/data/mockData'
import type { Tone, TileAlert } from '@/types'
import { cn } from '@/lib/utils'

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
  onOpenAlert: (title: string, tone: Tone, alert: TileAlert) => void
}

export function CategoryHealth({ onOpenAlert }: CategoryHealthProps) {
  return (
    <section>
      <h2 className="text-[22px] font-bold tracking-tight">Category health</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {categories.map((category) => {
          const Icon = categoryIcons[category.name] ?? Store
          return (
            <Card
              key={category.name}
              onClick={
                category.alert
                  ? () => onOpenAlert(category.name, category.tone, category.alert!)
                  : undefined
              }
              className={cn(
                'p-5 transition-shadow hover:shadow-md',
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
            </Card>
          )
        })}
      </div>
    </section>
  )
}
