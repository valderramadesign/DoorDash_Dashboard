export type Tone = 'danger' | 'warn' | 'good' | 'neutral'

export interface TileAlert {
  explanation: string
  cause: string
  recommendation: string
  issueId?: string
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
  primaryLabel: string
  secondaryLabel: string
}

export interface Zone {
  name: string
  status: 'Healthy' | 'Watch' | 'Action needed'
  tone: Tone
  demand: string
  supplyGap: string
  deliveryTime: string
  alert?: TileAlert
}

export interface Category {
  name: string
  metric: string
  detail: string
  status: 'Healthy' | 'Watch' | 'Action needed'
  tone: Tone
  alert?: TileAlert
}

export interface RecommendedAction {
  id: string
  action: string
  impact: string
  owner: string
  confidence: 'High' | 'Medium' | 'Low'
  status: string
  statusTone: Tone
}

export interface ImpactCard {
  action: string
  result: string
  status: 'Working' | 'Monitor'
  tone: Tone
  time: string
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
