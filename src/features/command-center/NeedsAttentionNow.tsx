import { ArrowRight, Check, Sparkles, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusChip } from '@/components/ui/StatusChip'
import type { Issue } from '@/types'
import { cn } from '@/lib/utils'

function IssueCard({
  issue,
  onOpen,
}: {
  issue: Issue
  onOpen: (issue: Issue) => void
}) {
  const unassigned = issue.owner.toLowerCase() === 'unassigned'

  return (
    <div className="rounded-2xl border border-line p-5 transition-colors hover:border-ink-tertiary/40">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip tone={issue.tone} dot>
              {issue.severity}
            </StatusChip>
            <span className="text-xs font-semibold tracking-[0.08em] text-ink-tertiary uppercase">
              {issue.tags.join(' · ')}
            </span>
          </div>

          <h3 className="mt-2.5 text-[17px] font-bold">{issue.title}</h3>

          <dl className="mt-2 space-y-1 text-sm">
            <div className="flex gap-2">
              <dt className="shrink-0 text-ink-tertiary">Impact</dt>
              <dd className="font-semibold text-danger">{issue.impact}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="shrink-0 text-ink-tertiary">Root cause</dt>
              <dd className="text-ink-secondary">{issue.cause}</dd>
            </div>
          </dl>

          <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-brand-soft px-3 py-1.5 text-[13px] font-semibold text-brand">
            <Sparkles className="size-3.5" />
            Recommended: {issue.recommendation}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-3">
          <Button variant="dark" size="sm" onClick={() => onOpen(issue)}>
            {issue.primaryLabel}
          </Button>
          <span
            className={cn(
              'flex items-center gap-1.5 text-[13px] font-semibold',
              unassigned ? 'text-warn' : 'text-ink-secondary',
            )}
          >
            <UserRound className="size-3.5" />
            {unassigned ? 'Unassigned' : issue.owner}
          </span>
        </div>
      </div>
    </div>
  )
}

export function NeedsAttentionNow({
  issues,
  onOpenIssue,
}: {
  issues: Issue[]
  onOpenIssue: (issue: Issue) => void
}) {
  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2.5 text-[22px] font-bold tracking-tight">
            Needs attention now
            {issues.length > 0 && (
              <span className="flex size-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                {issues.length}
              </span>
            )}
          </h2>
          <p className="mt-1 text-sm text-ink-secondary">
            Prioritized by order risk, customer impact, and operational
            urgency.
          </p>
        </div>
        {issues.length > 0 && (
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1 text-sm font-semibold text-ink transition-colors hover:text-brand"
          >
            View all issues
            <ArrowRight className="size-4" />
          </button>
        )}
      </div>

      {issues.length === 0 ? (
        <div className="mt-5 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line py-12 text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-good-soft">
            <Check className="size-5 text-good" strokeWidth={2.75} />
          </div>
          <p className="text-base font-bold text-ink">
            Nice work — you're all caught up.
          </p>
          <p className="text-sm text-ink-secondary">
            No issues need immediate attention right now.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} onOpen={onOpenIssue} />
          ))}
        </div>
      )}
    </Card>
  )
}
