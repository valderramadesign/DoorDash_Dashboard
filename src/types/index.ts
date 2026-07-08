export type Tone = 'danger' | 'warn' | 'good' | 'neutral'

export interface TileAlert {
  explanation: string
  cause: string
  recommendation: string
  issueId?: string
}

/** Position + radius of the tile a morph transition should originate from. */
export interface MorphOrigin {
  top: number
  left: number
  width: number
  height: number
  radius: number
}

export interface SummaryCard {
  label: string
  metric: string
  metricSuffix?: string
  chip: string
  tone: Tone
  supporting: string
  trend: string
  trendDirection: 'up' | 'down' | 'flat'
  alert?: TileAlert
}

export interface Issue {
  id: string
  title: string
  severity: 'High' | 'Medium' | 'Low'
  tone: Tone
  tags: string[]
  impact: string
  cause: string
  recommendation: string
  owner: string
  primaryLabel: string
}

export interface RiskWatchItem {
  id: string
  title: string
  risk: string
  status: string
  statusTone: Tone
}

export interface ImpactTrackingItem {
  id: string
  action: string
  before: string
  after: string
  status: string
  statusTone: Tone
}

export interface Category {
  name: string
  metric: string
  detail: string
  status: 'Healthy' | 'Watch' | 'Action needed'
  tone: Tone
  alert?: TileAlert
}

export interface TopAction {
  issueId: string
  title: string
  meta: string
  tone: Tone
}

export interface SolutionOption {
  label: string
  detail: string
  recommended?: boolean
}

export interface SolutionStep {
  title: string
  description: string
  options: SolutionOption[]
}

export interface SolutionSuccess {
  title: string
  description: string
  results: { label: string; value: string }[]
}

export interface SolutionFlow {
  steps: SolutionStep[]
  success: SolutionSuccess
}
