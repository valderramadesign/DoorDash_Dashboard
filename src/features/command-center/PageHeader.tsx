import { RefreshCw } from 'lucide-react'

export function PageHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-[32px] leading-tight font-bold tracking-tight">
          Marketplace Command Center
        </h1>
        <p className="mt-1.5 max-w-2xl text-[15px] text-ink-secondary">
          Detect, diagnose, and act on the marketplace issues that need
          attention right now.
        </p>
      </div>
      <span className="flex items-center gap-1.5 pt-2 text-[13px] text-ink-tertiary">
        <RefreshCw className="size-3.5" />
        Updated 2 min ago
      </span>
    </div>
  )
}
