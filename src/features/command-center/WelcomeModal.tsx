import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { DoorDashLogo } from '@/components/ui/DoorDashLogo'
import { topActions } from '@/data/mockData'
import type { Tone } from '@/types'
import { cn } from '@/lib/utils'

const toneRadio: Record<Tone, string> = {
  danger: 'border-danger',
  warn: 'border-warn',
  good: 'border-good',
  neutral: 'border-ink-tertiary',
}

const toneDot: Record<Tone, string> = {
  danger: 'bg-danger',
  warn: 'bg-warn',
  good: 'bg-good',
  neutral: 'bg-ink-tertiary',
}

interface WelcomeModalProps {
  onGo: (issueId: string) => void
  onDismiss: () => void
}

export function WelcomeModal({ onGo, onDismiss }: WelcomeModalProps) {
  const [selected, setSelected] = useState(topActions[0].issueId)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  return (
    <>
      <div
        aria-hidden
        className="fixed inset-0 z-40 m-0 bg-ink/50 backdrop-blur-sm"
      />
      <div className="fixed inset-0 z-50 m-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-modal-title"
          className="w-full max-w-[420px] rounded-3xl bg-white p-6 shadow-drawer"
        >
          <div className="relative flex items-center justify-center">
            <DoorDashLogo className="h-[20px]" />
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Close"
              className="absolute top-1/2 right-0 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-canvas hover:text-ink"
            >
              <X className="size-4.5" />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <img
              src="/JL-Persona.png"
              alt="Jordan Lee"
              className="size-11 shrink-0 rounded-full object-cover"
            />
            <h2 id="welcome-modal-title" className="text-lg font-bold tracking-tight">
              Welcome back, Jordan!
            </h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
            Here are the top 3 actions that need your attention right now.
          </p>

          <div className="mt-4 space-y-2.5">
            {topActions.map((action) => {
              const isSelected = selected === action.issueId
              return (
                <button
                  key={action.issueId}
                  type="button"
                  onClick={() => setSelected(action.issueId)}
                  className={cn(
                    'flex w-full cursor-pointer items-start gap-3 rounded-2xl border p-3.5 text-left transition-colors',
                    isSelected ? 'border-line bg-canvas' : 'border-line hover:border-ink-tertiary/40',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2',
                      isSelected ? toneRadio[action.tone] : 'border-ink-tertiary/40',
                    )}
                  >
                    {isSelected && (
                      <span className={cn('size-2 rounded-full', toneDot[action.tone])} />
                    )}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink">
                      {action.title}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-ink-secondary">
                      {action.meta}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          <Button
            variant="primary"
            className="mt-5 w-full justify-center"
            onClick={() => onGo(selected)}
          >
            Let's fix this
          </Button>
          <button
            type="button"
            onClick={onDismiss}
            className="mt-2.5 w-full cursor-pointer py-1 text-center text-sm font-semibold text-ink-secondary transition-colors hover:text-ink"
          >
            Go to dashboard
          </button>

          <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 text-sm text-ink-secondary">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="size-4 cursor-pointer rounded border-line text-brand accent-brand"
            />
            Don't show this again
          </label>
        </div>
      </div>
    </>
  )
}
