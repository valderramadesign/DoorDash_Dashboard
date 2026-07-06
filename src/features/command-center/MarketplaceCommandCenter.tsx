import { useState } from 'react'
import { issues } from '@/data/mockData'
import type { Issue, Tone, TileAlert } from '@/types'
import { ActionImpact } from './ActionImpact'
import { CategoryHealth } from './CategoryHealth'
import { IssueAlertModal } from './IssueAlertModal'
import { IssueDrawer } from './IssueDrawer'
import { MarketplaceBalance } from './MarketplaceBalance'
import { NeedsAttentionNow } from './NeedsAttentionNow'
import { PageHeader } from './PageHeader'
import { RecommendedActions } from './RecommendedActions'
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

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 px-5 py-6 sm:px-8 sm:py-8">
      <PageHeader />
      <StatusSummaryCards onOpenAlert={openAlert} />
      <NeedsAttentionNow issues={activeIssues} onOpenIssue={setOpenIssue} />
      <CategoryHealth onOpenAlert={openAlert} />
      <RecommendedActions />
      <ActionImpact />
      <MarketplaceBalance onOpenAlert={openAlert} />
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
