import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'dark' | 'ghost'

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  secondary: 'border border-line bg-white text-ink hover:bg-canvas',
  dark: 'bg-ink text-white hover:bg-black',
  ghost: 'text-ink-secondary hover:bg-canvas hover:text-ink',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'sm' | 'md'
}

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'cursor-pointer rounded-full font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40',
        size === 'md' ? 'px-5 py-2.5 text-sm' : 'px-4 py-2 text-[13px]',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
