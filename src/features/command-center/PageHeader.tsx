import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Pill } from '@/components/ui/Pill'
import { categoryFilters } from '@/data/mockData'

export function PageHeader() {
  const [selected, setSelected] = useState('All categories')

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-tight font-bold tracking-tight">
            Marketplace Command Center
          </h1>
          <p className="mt-1.5 max-w-2xl text-[15px] text-ink-secondary">
            Monitor demand, supply, merchant readiness, and delivery
            reliability in one operating view.
          </p>
        </div>
        <span className="flex items-center gap-1.5 pt-2 text-[13px] text-ink-tertiary">
          <RefreshCw className="size-3.5" />
          Updated 2 min ago
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {categoryFilters.map((filter) => (
          <Pill
            key={filter}
            selected={filter === selected}
            onClick={() => setSelected(filter)}
          >
            {filter}
          </Pill>
        ))}
      </div>
    </div>
  )
}
