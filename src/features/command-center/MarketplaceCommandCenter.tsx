import { useEffect, useMemo, useRef, useState } from 'react'
import {
  impactTracking,
  issues,
  summaryCards,
  tileIssues,
  topActions,
} from '@/data/mockData'
import type {
  ImpactTrackingItem,
  Issue,
  MorphOrigin,
  Tone,
  TileAlert,
} from '@/types'
import { CategoryHealth } from './CategoryHealth'
import { ImpactTracking } from './ImpactTracking'
import { IssueAlertModal } from './IssueAlertModal'
import { IssueDrawer } from './IssueDrawer'
import { NeedsAttentionNow } from './NeedsAttentionNow'
import { PageHeader } from './PageHeader'
import { RiskWatch } from './RiskWatch'
import { StatusSummaryCards } from './StatusSummaryCards'
import { WelcomeModal } from './WelcomeModal'

interface AlertTile {
  title: string
  tone: Tone
  alert: TileAlert
  origin: MorphOrigin
}

export function MarketplaceCommandCenter() {
  const [showWelcome, setShowWelcome] = useState(true)
  // The issue currently being worked on in the side panel, plus any issues
  // waiting behind it — only one fix runs at a time.
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null)
  const [queue, setQueue] = useState<Issue[]>([])
  const [activeIssues, setActiveIssues] = useState<Issue[]>(issues)
  const [alertTile, setAlertTile] = useState<AlertTile | null>(null)
  const [impactItems, setImpactItems] = useState<ImpactTrackingItem[]>(impactTracking)
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const impactRef = useRef<HTMLDivElement>(null)

  const queuedIssueIds = useMemo(() => new Set(queue.map((issue) => issue.id)), [queue])

  const resolveIssue = (issueId: string) =>
    setActiveIssues((prev) => prev.filter((issue) => issue.id !== issueId))

  const openAlert = (
    title: string,
    tone: Tone,
    alert: TileAlert,
    origin: MorphOrigin,
  ) => setAlertTile({ title, tone, alert, origin })

  // Resolve the issue that powers a tile's solution flow. Some tiles map to a
  // Needs-attention issue; others use a synthetic tile issue.
  const flowIssueFor = (alert: TileAlert): Issue | null => {
    const id = alert.issueId
    if (!id) return null
    return issues.find((issue) => issue.id === id) ?? tileIssues[id] ?? null
  }

  // Send an issue to the side panel: starts it immediately if the panel is
  // free, otherwise queues it behind whatever's already running.
  const requestFix = (issue: Issue) => {
    if (!activeIssue) {
      setActiveIssue(issue)
      return
    }
    if (activeIssue.id === issue.id) return
    setQueue((prev) => (prev.some((i) => i.id === issue.id) ? prev : [...prev, issue]))
  }

  // Pull the next queued issue (if any) into the side panel.
  const advanceQueue = () => {
    setQueue((prev) => {
      if (prev.length === 0) {
        setActiveIssue(null)
        return prev
      }
      const [next, ...rest] = prev
      setActiveIssue(next)
      return rest
    })
  }

  // Fired when the solution flow reaches its success screen and is dismissed:
  // the issue leaves the active list and starts being monitored below.
  const completeFlow = (issue: Issue) => {
    const rowId = `${issue.id}-action`
    resolveIssue(issue.id)
    setImpactItems((prev) => [
      {
        id: rowId,
        action: topActions.find((a) => a.issueId === issue.id)?.title ?? issue.title,
        before: issue.impact,
        after: 'Monitoring',
        status: 'Pending signal',
        statusTone: 'neutral',
      },
      ...prev.filter((item) => item.id !== rowId),
    ])
    advanceQueue()
    setHighlightId(rowId)
  }

  // After a fix is applied, bring the Impact tracking table above the fold. The
  // new row animates itself in (rows slide down, text types, badge fades in);
  // once that's done we clear the flag so the row becomes a plain static row.
  useEffect(() => {
    if (!highlightId) return
    const raf = requestAnimationFrame(() =>
      impactRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
    )
    const timer = window.setTimeout(() => setHighlightId(null), 2200)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
    }
  }, [highlightId])

  const statusCards = useMemo(() => {
    const [activeIssuesCard, ...rest] = summaryCards
    return [
      {
        ...activeIssuesCard,
        metric: String(activeIssues.length),
        tone: activeIssues.length > 0 ? 'danger' : 'good',
        chip: activeIssues.length > 0 ? 'Attention needed' : 'All clear',
      } satisfies (typeof summaryCards)[number],
      ...rest,
    ]
  }, [activeIssues.length])

  return (
    <div className="flex items-start">
      <div className="min-w-0 flex-1 space-y-6 px-5 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-[1440px] space-y-6">
          <PageHeader />
          <StatusSummaryCards
            cards={statusCards}
            onOpenAlert={openAlert}
            queuedIssueIds={queuedIssueIds}
            activeIssueId={activeIssue?.id ?? null}
          />
          <NeedsAttentionNow
            issues={activeIssues}
            onOpenIssue={requestFix}
            queuedIssueIds={queuedIssueIds}
            activeIssueId={activeIssue?.id ?? null}
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RiskWatch />
            <div ref={impactRef} className="scroll-mt-6">
              <ImpactTracking items={impactItems} highlightId={highlightId} />
            </div>
          </div>
          <CategoryHealth
            onOpenAlert={openAlert}
            queuedIssueIds={queuedIssueIds}
            activeIssueId={activeIssue?.id ?? null}
          />
        </div>
      </div>
      <IssueDrawer
        issue={activeIssue}
        onClose={advanceQueue}
        onResolve={() => {
          if (activeIssue) completeFlow(activeIssue)
        }}
      />
      {showWelcome && (
        <WelcomeModal
          onDismiss={() => setShowWelcome(false)}
          onGo={(issueId) => {
            setShowWelcome(false)
            const match = issues.find((issue) => issue.id === issueId)
            if (match) requestFix(match)
          }}
        />
      )}
      {alertTile && (
        <IssueAlertModal
          title={alertTile.title}
          tone={alertTile.tone}
          severity={alertTile.tone === 'danger' ? 'High' : 'Medium'}
          origin={alertTile.origin}
          explanation={alertTile.alert.explanation}
          cause={alertTile.alert.cause}
          recommendation={alertTile.alert.recommendation}
          issue={flowIssueFor(alertTile.alert)}
          onDismiss={() => setAlertTile(null)}
          onStartFix={() => {
            const issue = flowIssueFor(alertTile.alert)
            setAlertTile(null)
            if (issue) requestFix(issue)
          }}
        />
      )}
    </div>
  )
}
