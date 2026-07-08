import type { Issue } from '@/types'
import { SolutionFlowContent } from './SolutionFlowContent'

interface SolutionFlowProps {
  issue: Issue
  onExit: () => void
  onBack: () => void
  /** Called instead of onExit when the flow is left from the success screen. */
  onComplete: () => void
}

/**
 * Centered variant of the solution flow, used when it isn't launched from a
 * tile (e.g. the welcome modal). The tile path renders the same content inside
 * the morphing alert panel instead.
 */
export function SolutionFlow({ issue, onExit, onBack, onComplete }: SolutionFlowProps) {
  return (
    <>
      <div aria-hidden className="fixed inset-0 z-40 m-0 bg-ink/50 backdrop-blur-sm" />
      <div className="fixed inset-0 z-50 m-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${issue.title} — solution`}
          className="w-full max-w-[440px] overflow-hidden rounded-3xl bg-white shadow-drawer"
        >
          <SolutionFlowContent
            issue={issue}
            onExit={onExit}
            onBack={onBack}
            onComplete={onComplete}
          />
        </div>
      </div>
    </>
  )
}
