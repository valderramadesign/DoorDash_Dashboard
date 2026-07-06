import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
}

export function Pill({ selected, className, ...props }: PillProps) {
  return (
    <button
      type="button"
      className={cn(
        'cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors',
        selected
          ? 'bg-ink text-white'
          : 'border border-line bg-white text-ink hover:bg-canvas',
        className,
      )}
      {...props}
    />
  )
}
