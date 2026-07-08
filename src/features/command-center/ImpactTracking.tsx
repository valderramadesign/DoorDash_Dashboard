import { useEffect, useState } from 'react'
import { ArrowRight, Target } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { StatusChip } from '@/components/ui/StatusChip'
import type { ImpactTrackingItem } from '@/types'

interface ImpactTrackingProps {
  items: ImpactTrackingItem[]
  /** Row id to animate in — rows below slide down, then the text types in. */
  highlightId?: string | null
}

export function ImpactTracking({ items, highlightId }: ImpactTrackingProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-full bg-canvas text-ink-secondary">
          <Target className="size-4" />
        </span>
        <div>
          <h2 className="text-[18px] font-bold tracking-tight">
            Impact tracking
          </h2>
          <p className="text-sm text-ink-secondary">
            Recent actions and whether they improved marketplace health.
          </p>
        </div>
      </div>

      <ul className="mt-4 divide-y divide-line">
        {items.map((item) => (
          <ImpactRow
            key={item.id}
            item={item}
            animate={item.id === highlightId}
          />
        ))}
      </ul>
    </Card>
  )
}

function StaticRow({ item }: { item: ImpactTrackingItem }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3.5 first:pt-0 last:pb-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{item.action}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[13px] text-ink-secondary">
          <span>{item.before}</span>
          <ArrowRight className="size-3.5 text-ink-tertiary" />
          <span className="font-semibold text-ink">{item.after}</span>
        </p>
      </div>
      <StatusChip tone={item.statusTone} dot>
        {item.status}
      </StatusChip>
    </li>
  )
}

function ImpactRow({
  item,
  animate,
}: {
  item: ImpactTrackingItem
  animate: boolean
}) {
  if (!animate) return <StaticRow item={item} />
  return <InsertingRow item={item} />
}

const CARET =
  'ml-px inline-block h-[0.95em] w-px translate-y-[0.1em] bg-ink motion-safe:animate-pulse'

/**
 * A freshly added row: the slot opens (pushing rows below down), then the
 * action and metric type in character by character, and finally the status
 * badge fades in on the right.
 */
function InsertingRow({ item }: { item: ImpactTrackingItem }) {
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState('')
  const [before, setBefore] = useState('')
  const [after, setAfter] = useState('')
  const [showArrow, setShowArrow] = useState(false)
  const [showBadge, setShowBadge] = useState(false)

  useEffect(() => {
    let cancelled = false
    const timers: number[] = []
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms))
      })
    const type = async (
      full: string,
      set: (v: string) => void,
      speed: number,
    ) => {
      for (let i = 1; i <= full.length; i++) {
        if (cancelled) return
        set(full.slice(0, i))
        await wait(speed)
      }
    }

    const run = async () => {
      // Open the slot on the next frame so the 0fr → 1fr transition runs.
      requestAnimationFrame(() => !cancelled && setOpen(true))
      await wait(150)
      await type(item.action, setAction, 20)
      await wait(70)
      if (!cancelled) setShowArrow(true)
      await type(item.before, setBefore, 16)
      await wait(30)
      await type(item.after, setAfter, 16)
      await wait(90)
      if (!cancelled) setShowBadge(true)
    }
    run()

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [item.action, item.before, item.after])

  const actionDone = action === item.action
  const metaDone = after === item.after

  return (
    <li
      className="grid"
      style={{
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: 'grid-template-rows 220ms cubic-bezier(0.32, 0.72, 0, 1)',
      }}
    >
      <div className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pb-3.5">
          <div className="min-w-0 flex-1">
            <p className="min-h-[20px] text-sm font-semibold text-ink">
              {action}
              {!actionDone && <span className={CARET} />}
            </p>
            <p className="mt-0.5 flex min-h-[18px] flex-wrap items-center gap-1.5 text-[13px] text-ink-secondary">
              <span>{before}</span>
              {showArrow && (
                <ArrowRight className="size-3.5 text-ink-tertiary" />
              )}
              <span className="font-semibold text-ink">{after}</span>
              {actionDone && !metaDone && <span className={CARET} />}
            </p>
          </div>
          <span
            style={{
              opacity: showBadge ? 1 : 0,
              transition: 'opacity 200ms ease',
            }}
          >
            <StatusChip tone={item.statusTone} dot>
              {item.status}
            </StatusChip>
          </span>
        </div>
      </div>
    </li>
  )
}
