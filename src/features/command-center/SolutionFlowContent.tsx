import { useEffect, useState } from 'react'
import { ArrowLeft, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { solutionFlows } from '@/data/mockData'
import type { Issue } from '@/types'
import { cn } from '@/lib/utils'

interface SolutionFlowContentProps {
  issue: Issue
  /** Leave the flow before it is applied (first-step back / close / escape). */
  onExit: () => void
  /** Step back from the first step (e.g. return to the alert or welcome view). */
  onBack: () => void
  /** Leave the flow from the success screen — the action has been applied. */
  onComplete: () => void
}

/**
 * The solution flow rendered as plain content, with no overlay or positioning
 * of its own. The host (a centered modal or the morphing alert panel) provides
 * the surface, size and animation.
 */
export function SolutionFlowContent({
  issue,
  onExit,
  onBack,
  onComplete,
}: SolutionFlowContentProps) {
  const flow = solutionFlows[issue.id]

  const [stepIndex, setStepIndex] = useState(0)
  const [selections, setSelections] = useState<number[]>(() =>
    (flow?.steps ?? []).map((step) => {
      const rec = step.options.findIndex((o) => o.recommended)
      return rec >= 0 ? rec : 0
    }),
  )

  const totalSteps = flow?.steps.length ?? 0
  const isSuccess = stepIndex >= totalSteps
  // Once the action has been applied, any exit counts as completion.
  const handleLeave = isSuccess ? onComplete : onExit

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && handleLeave()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleLeave])

  if (!flow) return null

  const step = flow.steps[stepIndex]

  const handleContinue = () => setStepIndex((i) => i + 1)
  const handleBack = () => {
    if (stepIndex === 0) onBack()
    else setStepIndex((i) => i - 1)
  }
  const selectOption = (optionIndex: number) =>
    setSelections((prev) => {
      const next = [...prev]
      next[stepIndex] = optionIndex
      return next
    })

  const headerTitle = isSuccess ? 'Complete' : step.title

  return (
    <div>
      <header className="relative flex items-center justify-between border-b border-line px-3 py-3">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Go back"
          className="flex size-8 cursor-pointer items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-canvas hover:text-ink"
        >
          <ArrowLeft className="size-4.5" />
        </button>
        <h2 className="absolute left-1/2 max-w-[64%] -translate-x-1/2 truncate text-center text-sm font-bold">
          {headerTitle}
        </h2>
        <button
          type="button"
          onClick={handleLeave}
          aria-label="Exit to dashboard"
          className="flex size-8 cursor-pointer items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-canvas hover:text-ink"
        >
          <X className="size-4.5" />
        </button>
      </header>

      {isSuccess ? (
        <div className="px-6 py-7 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-good-soft">
            <Check className="size-7 text-good" strokeWidth={2.75} />
          </div>
          <h3 className="mt-4 text-xl font-bold tracking-tight">
            {flow.success.title}
          </h3>
          <p className="mx-auto mt-2 max-w-[320px] text-sm leading-relaxed text-ink-secondary">
            {flow.success.description}
          </p>
          <ul className="mt-5 divide-y divide-line rounded-2xl border border-line text-left">
            {flow.success.results.map((result) => (
              <li
                key={result.label}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <span className="text-ink-secondary">{result.label}</span>
                <span className="font-bold text-good">{result.value}</span>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-4 max-w-[320px] text-[13px] leading-relaxed text-ink-tertiary">
            This issue has been addressed and moved to{' '}
            <span className="font-semibold text-ink-secondary">
              Impact tracking
            </span>{' '}
            lower on the page, where you can monitor its results.
          </p>
        </div>
      ) : (
        <div className="px-6 pt-5 pb-1">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-ink-tertiary uppercase">
              Step {stepIndex + 1} of {totalSteps}
            </p>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            {flow.steps.map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors',
                  i <= stepIndex ? 'bg-brand' : 'bg-line',
                )}
              />
            ))}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink-secondary">
            {step.description}
          </p>

          <div className="mt-4 space-y-2.5">
            {step.options.map((option, i) => {
              const isSelected = selections[stepIndex] === i
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => selectOption(i)}
                  className={cn(
                    'flex w-full cursor-pointer items-start gap-3 rounded-2xl border p-3.5 text-left transition-colors',
                    isSelected
                      ? 'border-line bg-canvas'
                      : 'border-line hover:border-ink-tertiary/40',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2',
                      isSelected ? 'border-brand' : 'border-ink-tertiary/40',
                    )}
                  >
                    {isSelected && (
                      <span className="size-2 rounded-full bg-brand" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-ink">
                        {option.label}
                      </span>
                      {option.recommended && (
                        <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-bold tracking-wide text-brand uppercase">
                          Recommended
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-ink-secondary">
                      {option.detail}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="px-6 pt-4 pb-6">
        <Button
          variant="primary"
          className="w-full justify-center"
          onClick={isSuccess ? onComplete : handleContinue}
        >
          {isSuccess ? 'Done' : 'Continue'}
        </Button>
      </div>
    </div>
  )
}
