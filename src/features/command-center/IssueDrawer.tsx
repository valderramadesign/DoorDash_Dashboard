import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatusChip } from '@/components/ui/StatusChip'
import { solutionFlows } from '@/data/mockData'
import type { Issue } from '@/types'
import { cn } from '@/lib/utils'
import { FlowSuccess, customActionSuccess } from './FlowSuccess'
import { ThinkingPanel } from './ThinkingPanel'

const THINKING_DURATION = 5000

interface IssueDrawerProps {
  issue: Issue | null
  onClose: () => void
  onResolve: (issueId: string) => void
}

export function IssueDrawer({ issue, onClose, onResolve }: IssueDrawerProps) {
  const open = issue !== null
  const flow = issue ? solutionFlows[issue.id] : undefined

  const [stepIndex, setStepIndex] = useState(0)
  const [selections, setSelections] = useState<number[]>([])
  const [customText, setCustomText] = useState('')
  // True once the flow was completed via the "Something else…" path, which
  // skips the remaining steps and shows a generic confirmation instead.
  const [customSuccess, setCustomSuccess] = useState(false)
  // Steps whose "thinking" simulation has already finished — revisiting one
  // via Back shows it instantly instead of re-running the simulation.
  const [revealedSteps, setRevealedSteps] = useState<Set<number>>(() => new Set())

  useEffect(() => {
    if (!issue) return
    const steps = solutionFlows[issue.id]?.steps ?? []
    setStepIndex(0)
    setCustomText('')
    setCustomSuccess(false)
    setRevealedSteps(new Set())
    setSelections(
      steps.map((step) => {
        const rec = step.options.findIndex((o) => o.recommended)
        return rec >= 0 ? rec : 0
      }),
    )
  }, [issue])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const totalSteps = flow?.steps.length ?? 0
  const isSuccess = flow ? stepIndex >= totalSteps : false
  const step = flow?.steps[stepIndex]
  const isThinking = !isSuccess && !!step && !revealedSteps.has(stepIndex)
  // The synthetic "Something else…" option lives just past the real ones.
  const customIndex = step ? step.options.length : -1
  const isCustom = step ? selections[stepIndex] === customIndex : false
  const continueDisabled = isThinking || (isCustom && customText.trim() === '')

  // Simulate the assistant working through the current step before its
  // options are revealed. Skipped once a step has already been shown.
  useEffect(() => {
    if (!isThinking) return
    const id = window.setTimeout(() => {
      setRevealedSteps((prev) => new Set(prev).add(stepIndex))
    }, THINKING_DURATION)
    return () => window.clearTimeout(id)
  }, [isThinking, stepIndex])

  // Success content: the custom path shows the typed action; the standard path
  // shows the decision made at each step.
  const success = customSuccess ? customActionSuccess : flow?.success
  const successChoices = customSuccess
    ? [{ label: 'Your action', value: customText.trim() }]
    : (flow?.steps ?? []).map((s, i) => ({
        label: s.title,
        value: s.options[selections[i]]?.label ?? '—',
      }))

  const handleContinue = () => {
    if (isCustom) {
      setCustomSuccess(true)
      setStepIndex(totalSteps)
    } else {
      setCustomSuccess(false)
      setStepIndex((i) => i + 1)
    }
  }
  const handleBack = () => {
    setCustomSuccess(false)
    setStepIndex((i) => Math.max(0, i - 1))
  }
  // onResolve already advances to the next queued issue (or closes the
  // drawer if the queue is empty) — don't also call onClose here.
  const handleDone = () => {
    if (issue) onResolve(issue.id)
  }
  const selectOption = (optionIndex: number) =>
    setSelections((prev) => {
      const next = [...prev]
      next[stepIndex] = optionIndex
      return next
    })

  return (
    <div
      className={cn(
        'sticky top-16 z-10 h-[calc(100vh-4rem)] shrink-0 overflow-hidden transition-[width] duration-300 ease-out',
        open ? 'w-[440px]' : 'w-0',
      )}
    >
      <aside
        role="region"
        aria-label={issue?.title ?? 'Issue detail'}
        className="flex h-full w-[440px] flex-col border-l border-line bg-white"
      >
        {issue && flow && (
          <>
            <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
              <div>
                <span className="text-xs font-semibold tracking-[0.08em] text-ink-tertiary uppercase">
                  {issue.tags.join(' · ')}
                </span>
                <h2 className="mt-2 text-xl leading-snug font-bold">
                  {issue.title}
                  <StatusChip
                    tone={issue.tone}
                    dot
                    className="ml-4 align-middle"
                  >
                    {issue.severity}
                  </StatusChip>
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close drawer"
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-canvas hover:text-ink"
              >
                <X className="size-4.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {isSuccess && success ? (
                <FlowSuccess
                  title={success.title}
                  choices={successChoices}
                  probability={success.probability}
                  probabilityReason={success.probabilityReason}
                  watch={success.watch}
                />
              ) : (
                <>
                  <div className="rounded-2xl bg-canvas p-4">
                    <p className="text-xs text-ink-tertiary">Current impact</p>
                    <p className="mt-1 text-sm font-bold text-ink">{issue.impact}</p>
                    <p className="mt-1 text-sm text-ink-secondary">{issue.cause}</p>
                  </div>

                  {isThinking ? (
                    <ThinkingPanel messages={step!.thinkingMessages} className="mt-6 p-0" />
                  ) : (
                  <div className="mt-6">
                    <p className="text-[11px] font-semibold tracking-[0.14em] text-ink-tertiary uppercase">
                      Step {stepIndex + 1} of {totalSteps}
                    </p>
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

                    <h3 className="mt-4 text-lg font-bold">{step!.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-secondary">
                      {step!.description}
                    </p>

                    <div className="mt-4 space-y-2.5">
                      {step!.options.map((option, i) => {
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

                      <button
                        type="button"
                        onClick={() => selectOption(customIndex)}
                        className={cn(
                          'flex w-full cursor-pointer items-start gap-3 rounded-2xl border p-3.5 text-left transition-colors',
                          isCustom
                            ? 'border-line bg-canvas'
                            : 'border-line hover:border-ink-tertiary/40',
                        )}
                      >
                        <span
                          className={cn(
                            'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2',
                            isCustom ? 'border-brand' : 'border-ink-tertiary/40',
                          )}
                        >
                          {isCustom && (
                            <span className="size-2 rounded-full bg-brand" />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="text-sm font-bold text-ink">
                            Something else…
                          </span>
                          <span className="mt-0.5 block text-[13px] text-ink-secondary">
                            Describe a different action for the assistant to take.
                          </span>
                        </span>
                      </button>

                      {isCustom && (
                        <textarea
                          autoFocus
                          value={customText}
                          onChange={(e) => setCustomText(e.target.value)}
                          rows={3}
                          placeholder="Describe the action you’d like to take instead…"
                          className="w-full resize-none rounded-2xl border border-line bg-white px-3.5 py-3 text-sm text-ink placeholder:text-ink-tertiary focus:border-brand focus:outline-none"
                        />
                      )}
                    </div>
                  </div>
                  )}
                </>
              )}
            </div>

            <div className="space-y-2.5 border-t border-line px-6 py-5">
              <Button
                variant="primary"
                className="w-full"
                disabled={!isSuccess && continueDisabled}
                onClick={isSuccess ? handleDone : handleContinue}
              >
                {isSuccess ? 'Got it' : 'Continue'}
              </Button>
              {!isSuccess && stepIndex > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full cursor-pointer py-1 text-center text-sm font-semibold text-ink-secondary transition-colors hover:text-ink"
                >
                  Back
                </button>
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
