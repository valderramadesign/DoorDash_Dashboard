import { useMemo, useState } from 'react'
import { issues, summaryCards } from '@/data/mockData'
import type { Issue, Tone, TileAlert } from '@/types'
import { CategoryHealth } from './CategoryHealth'
import { ImpactTracking } from './ImpactTracking'
import { IssueAlertModal } from './IssueAlertModal'
import { IssueDrawer } from './IssueDrawer'
import { NeedsAttentionNow } from './NeedsAttentionNow'
import { PageHeader } from './PageHeader'
import { RiskWatch } from './RiskWatch'
import { SolutionFlow } from './SolutionFlow'
import { StatusSummaryCards } from './StatusSummaryCards'
import { WelcomeModal } from './WelcomeModal'

interface AlertTile {
  title: string
  tone: Tone
  alert: TileAlert
}

export function MarketplaceCommandCenter() {
  const [openIssue, setOpenIssue] = useState<Issue | null>(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const [flowIssue, setFlowIssue] = useState<Issue | null>(null)
  const [activeIssues, setActiveIssues] = useState<Issue[]>(issues)
  const [alertTile, setAlertTile] = useState<AlertTile | null>(null)

  const resolveIssue = (issueId: string) =>
    setActiveIssues((prev) => prev.filter((issue) => issue.id !== issueId))

  const openAlert = (title: string, tone: Tone, alert: TileAlert) =>
    setAlertTile({ title, tone, alert })

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
    <div className="mx-auto max-w-[1440px] space-y-6 px-5 py-6 sm:px-8 sm:py-8">
      <PageHeader />
      <StatusSummaryCards cards={statusCards} onOpenAlert={openAlert} />
      <NeedsAttentionNow issues={activeIssues} onOpenIssue={setOpenIssue} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RiskWatch />
        <ImpactTracking />
      </div>
      <CategoryHealth onOpenAlert={openAlert} />
      <IssueDrawer
        issue={openIssue}
        onClose={() => setOpenIssue(null)}
        onResolve={resolveIssue}
      />
      {showWelcome && (
        <WelcomeModal
          onDismiss={() => setShowWelcome(false)}
          onGo={(issueId) => {
            setShowWelcome(false)
            const match = issues.find((issue) => issue.id === issueId)
            if (match) setFlowIssue(match)
          }}
        />
      )}
      {flowIssue && (
        <SolutionFlow
          issue={flowIssue}
          onExit={() => setFlowIssue(null)}
          onBack={() => {
            setFlowIssue(null)
            setShowWelcome(true)
          }}
        />
      )}
      {alertTile && (
        <IssueAlertModal
          title={alertTile.title}
          tone={alertTile.tone}
          severity={alertTile.tone === 'danger' ? 'High' : 'Medium'}
          explanation={alertTile.alert.explanation}
          cause={alertTile.alert.cause}
          recommendation={alertTile.alert.recommendation}
          onDismiss={() => setAlertTile(null)}
          onFix={() => {
            const issueId = alertTile.alert.issueId
            setAlertTile(null)
            const match = issueId && activeIssues.find((issue) => issue.id === issueId)
            if (match) setOpenIssue(match)
          }}
        />
      )}
    </div>
  )
}
