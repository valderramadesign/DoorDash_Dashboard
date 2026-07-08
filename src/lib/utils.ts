import type { MorphOrigin } from '@/types'

export function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

/** Capture a tile's on-screen rect + corner radius so a modal can morph out of it. */
export function morphOriginFrom(el: HTMLElement): MorphOrigin {
  const rect = el.getBoundingClientRect()
  const radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    radius,
  }
}
