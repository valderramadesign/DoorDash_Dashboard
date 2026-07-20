import { Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Shown in place of a "fix it" CTA when its issue is waiting behind another active fix. */
export function InQueueBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-ink-tertiary',
        className,
      )}
    >
      <Loader2 className="size-3 animate-spin" />
      <span className="animate-blink-slow">In queue</span>
    </span>
  )
}

/** Shown in place of a "fix it" CTA when its issue is the one currently open in the side panel. */
export function FixingBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-ink-tertiary',
        className,
      )}
    >
      <Sparkles className="size-3 animate-pulse" />
      Fixing now
    </span>
  )
}
