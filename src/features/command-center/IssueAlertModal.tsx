import { Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatusChip } from '@/components/ui/StatusChip'
import type { Tone } from '@/types'

interface IssueAlertModalProps {
  title: string
  tone: Tone
  severity: string
  explanation: string
  cause: string
  recommendation: string
  onFix: () => void
  onDismiss: () => void
}

export function IssueAlertModal({
  title,
  tone,
  severity,
  explanation,
  cause,
  recommendation,
  onFix,
  onDismiss,
}: IssueAlertModalProps) {
  return (
    <>
      <div
        onClick={onDismiss}
        aria-hidden
        className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="issue-alert-title"
          className="w-full max-w-[440px] rounded-3xl bg-white p-6 shadow-drawer"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="issue-alert-title"
                className="text-lg leading-snug font-bold tracking-tight"
              >
                {title}
              </h2>
              <StatusChip tone={tone} dot>
                {severity}
              </StatusChip>
            </div>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Close"
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-canvas hover:text-ink"
            >
              <X className="size-4.5" />
            </button>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
            {explanation}
          </p>

          <div className="mt-4 rounded-2xl bg-canvas p-4">
            <p className="text-xs font-semibold tracking-[0.08em] text-ink-tertiary uppercase">
              What's causing it
            </p>
            <p className="mt-1 text-sm text-ink">{cause}</p>
          </div>

          <p className="mt-3 inline-flex items-start gap-1.5 rounded-2xl bg-brand-soft px-3.5 py-2.5 text-sm font-semibold text-brand">
            <Sparkles className="mt-0.5 size-4 shrink-0" />
            {recommendation}
          </p>

          <Button
            variant="primary"
            className="mt-5 w-full justify-center"
            onClick={onFix}
          >
            Let's fix this
          </Button>
          <button
            type="button"
            onClick={onDismiss}
            className="mt-2.5 w-full cursor-pointer py-1 text-center text-sm font-semibold text-ink-secondary transition-colors hover:text-ink"
          >
            Not now
          </button>
        </div>
      </div>
    </>
  )
}
