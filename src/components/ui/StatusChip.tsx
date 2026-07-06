import type { Tone } from '@/types'
import { cn } from '@/lib/utils'

const toneStyles: Record<Tone, string> = {
  danger: 'bg-danger-soft text-danger',
  warn: 'bg-warn-soft text-warn',
  good: 'bg-good-soft text-good',
  neutral: 'bg-canvas text-ink-secondary',
}

const dotStyles: Record<Tone, string> = {
  danger: 'bg-danger',
  warn: 'bg-warn',
  good: 'bg-good',
  neutral: 'bg-ink-tertiary',
}

interface StatusChipProps {
  tone: Tone
  children: string
  dot?: boolean
  className?: string
}

export function StatusChip({ tone, children, dot, className }: StatusChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
        toneStyles[tone],
        className,
      )}
    >
      {dot && <span className={cn('size-1.5 rounded-full', dotStyles[tone])} />}
      {children}
    </span>
  )
}
