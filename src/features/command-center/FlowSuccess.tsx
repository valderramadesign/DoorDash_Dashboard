import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'

const PROBABILITY_THINKING_DURATION = 5000

export interface FlowSuccessProps {
  title: string
  /** The decisions the operator made, rendered as a summary table. */
  choices: { label: string; value: string }[]
  /** Modeled probability of success (0–100). Capped at 97 on display. */
  probability: number
  probabilityReason: string
  watch: string
}

/**
 * The shared success state for both solution-flow surfaces (the modal flow and
 * the side panel), so the two stay visually identical: confirmation, the
 * choices that were made, a capped probability with rationale, what to monitor,
 * and a note that the issue now lives in Impact tracking.
 */
export function FlowSuccess({
  title,
  choices,
  probability,
  probabilityReason,
  watch,
}: FlowSuccessProps) {
  const pct = Math.min(97, Math.round(probability))

  // The probability is modeled, not instant — reveal it (and its rationale)
  // a beat after the rest of the success content.
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    setRevealed(false)
    const id = window.setTimeout(() => setRevealed(true), PROBABILITY_THINKING_DURATION)
    return () => window.clearTimeout(id)
  }, [probability])

  return (
    <div>
      <div className="text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-good-soft">
          <Check className="size-7 text-good" strokeWidth={2.75} />
        </div>
        <h3 className="mt-4 text-xl font-bold tracking-tight">{title}</h3>
      </div>

      <ul className="mt-5 divide-y divide-line rounded-2xl border border-line text-left">
        {choices.map((choice) => (
          <li key={choice.label} className="px-4 py-3 text-sm">
            <span className="block text-ink-secondary">{choice.label}</span>
            <span className="mt-0.5 block font-bold text-ink">{choice.value}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 text-left">
        <div className="flex items-center gap-2">
          {revealed ? (
            <span className="shrink-0 text-[44px] leading-[1.05] font-bold tracking-tight text-good">
              {pct}%
            </span>
          ) : (
            <span className="h-[38px] w-[84px] shrink-0 shimmer rounded-xl" />
          )}
          <span className="text-sm leading-tight text-ink-secondary">
            Probability
            <br />
            of success
          </span>
        </div>
        {revealed ? (
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink">
            {probabilityReason}
          </p>
        ) : (
          <div className="mt-2 space-y-1.5">
            <span className="block h-3 w-full shimmer rounded-full" />
            <span className="block h-3 w-3/5 shimmer rounded-full" />
          </div>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-warn/25 bg-warn-soft p-4 text-left">
        <p className="text-[13px] leading-relaxed text-ink">
          <span className="font-bold text-warn">MONITOR:</span>{' '}
          {watch.charAt(0).toUpperCase() + watch.slice(1)}
        </p>
      </div>

      <p className="mt-4 text-[13px] leading-relaxed text-ink-tertiary">
        This issue has been moved to the{' '}
        <span className="font-semibold text-ink-secondary">Impact tracking</span>{' '}
        table below.
      </p>
    </div>
  )
}

/** Success content for the free-form "Something else…" path. */
export const customActionSuccess = {
  title: 'Action taken',
  probability: 85,
  probabilityReason: 'Estimated from similar operator-defined actions.',
  watch:
    'the affected metric over the next hour and adjust if the trend doesn’t improve.',
}
