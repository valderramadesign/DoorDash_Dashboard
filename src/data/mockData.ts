import type {
  Category,
  ImpactTrackingItem,
  Issue,
  RiskWatchItem,
  SolutionFlow,
  SummaryCard,
  TopAction,
} from '@/types'

export const summaryCards: SummaryCard[] = [
  {
    label: 'Active Issues',
    metric: '3',
    chip: 'Attention needed',
    tone: 'danger',
    supporting: 'Prioritized in Needs attention now',
    trend: 'Same as last hour',
    trendDirection: 'flat',
    alert: {
      explanation:
        '3 issues are currently active across the marketplace, spanning supply, grocery availability, and merchant prep time.',
      cause: 'Dinner peak demand and merchant variance are compounding across multiple zones.',
      recommendation: 'Review the prioritized list in Needs attention now and act on the highest-impact issue first.',
    },
  },
  {
    label: 'Dasher Supply',
    metric: '-9%',
    chip: 'Undersupplied',
    tone: 'danger',
    supporting: 'Shortfall in 5 zones',
    trend: 'Gap widening',
    trendDirection: 'down',
    alert: {
      explanation:
        'Dasher supply is running 9% below demand and the gap is widening, with the sharpest shortfall in Mission District.',
      cause: 'Dinner peak demand rose faster than scheduled Dasher hours in 5 zones.',
      recommendation: 'Add peak pay in the most affected zone to pull in more Dashers.',
      issueId: 'mission-undersupply',
    },
  },
  {
    label: 'Demand vs Forecast',
    metric: '+14%',
    chip: 'Above forecast',
    tone: 'warn',
    supporting: 'Dinner peak stronger than expected',
    trend: 'Up 6 pts since 4 PM',
    trendDirection: 'up',
    alert: {
      explanation:
        'Order demand is running 14% above forecast, with the gap growing since 4 PM as dinner peak arrives stronger than expected.',
      cause: 'Forecast underestimated dinner peak demand across multiple zones.',
      recommendation: 'Monitor supply coverage closely and be ready to add incentives if the gap widens further.',
    },
  },
  {
    label: 'Delivery Reliability',
    metric: '91.6%',
    chip: 'Stable',
    tone: 'good',
    supporting: 'On-time rate within target',
    trend: 'Flat vs last hour',
    trendDirection: 'flat',
  },
]

export const issues: Issue[] = [
  {
    id: 'mission-undersupply',
    title: 'Mission District dinner peak undersupplied',
    severity: 'High',
    tone: 'danger',
    tags: ['Supply', 'Mission District'],
    impact: '1,240 orders at risk',
    cause: 'Dasher supply -18% vs demand',
    recommendation: 'Add $2 peak pay for 90 minutes',
    owner: 'Unassigned',
    primaryLabel: 'Review action',
  },
  {
    id: 'grocery-substitutions',
    title: 'Grocery substitutions driving cancellations',
    severity: 'Medium',
    tone: 'warn',
    tags: ['Grocery', 'City-wide'],
    impact: 'Cancellation rate +3.1 pts',
    cause: 'Low item availability at 12 stores',
    recommendation: 'Notify merchant ops',
    owner: 'Merchant Ops',
    primaryLabel: 'Review action',
  },
  {
    id: 'san-mateo-prep',
    title: 'Merchant prep time spike in San Mateo',
    severity: 'Medium',
    tone: 'warn',
    tags: ['Merchant', 'San Mateo'],
    impact: 'Average delivery time +7 min',
    cause: 'Prep time variance at top 8 merchants',
    recommendation: 'Pause promo exposure in affected zone',
    owner: 'Marketplace Ops',
    primaryLabel: 'Review action',
  },
]

export const riskWatch: RiskWatchItem[] = [
  {
    id: 'downtown-lunch-demand',
    title: 'Downtown lunch demand trending +9% above forecast',
    risk: 'Dasher supply gap likely within 45 min',
    status: 'Watching',
    statusTone: 'warn',
  },
  {
    id: 'south-bay-grocery',
    title: 'South Bay grocery availability declining',
    risk: 'Cancellation rate may rise by evening peak',
    status: 'Merchant Ops notified',
    statusTone: 'neutral',
  },
]

export const impactTracking: ImpactTrackingItem[] = [
  {
    id: 'mission-peak-pay',
    action: 'Mission District peak pay adjustment',
    before: 'Supply gap -18%',
    after: 'Supply gap -7%',
    status: 'Improving',
    statusTone: 'good',
  },
  {
    id: 'san-mateo-promo-pause',
    action: 'San Mateo promo exposure pause',
    before: 'Avg delivery time +7 min',
    after: 'Monitoring',
    status: 'Pending signal',
    statusTone: 'neutral',
  },
]

export const categories: Category[] = [
  {
    name: 'Grocery',
    metric: '+18% demand',
    detail: 'Cancels: 6.4%',
    status: 'Action needed',
    tone: 'danger',
    alert: {
      explanation:
        'Grocery cancellations have climbed to 6.4%, well above target, as demand rises 18% across the city.',
      cause: 'Low item availability at 12 stores is driving substitutions and cancellations.',
      recommendation: 'Notify merchant ops so affected stores can update availability.',
      issueId: 'grocery-substitutions',
    },
  },
  {
    name: 'Restaurants',
    metric: '+11% demand',
    detail: 'On-time: 92%',
    status: 'Watch',
    tone: 'warn',
    alert: {
      explanation:
        'Restaurant demand is up 11% and on-time rate has slipped to 92%, just below target.',
      cause: 'Order volume is outpacing kitchen throughput during peak hours.',
      recommendation: 'Monitor prep times at high-volume merchants and flag any that fall further behind.',
    },
  },
  {
    name: 'Alcohol',
    metric: '+9% demand',
    detail: 'ID issues: +1.2 pts',
    status: 'Watch',
    tone: 'warn',
    alert: {
      explanation:
        'Alcohol orders are up 9% and ID verification issues have risen 1.2 points, adding friction at delivery.',
      cause: 'Higher order volume is increasing ID mismatches and verification delays at drop-off.',
      recommendation: 'Remind Dashers on ID verification steps for alcohol orders in affected zones.',
    },
  },
  { name: 'Convenience', metric: '+4% demand', detail: 'On-time: 95%', status: 'Healthy', tone: 'good' },
  { name: 'Retail', metric: '-2% demand', detail: 'On-time: 94%', status: 'Healthy', tone: 'good' },
]

const topActionTitles: Record<string, string> = {
  'mission-undersupply': 'Add $2 peak pay in Mission District',
  'grocery-substitutions': 'Notify grocery partners with low availability',
  'san-mateo-prep': 'Review merchant prep time spike in San Mateo',
}

export const topActions: TopAction[] = issues.map((issue) => ({
  issueId: issue.id,
  title: topActionTitles[issue.id] ?? issue.title,
  meta: `${issue.impact} · ${issue.severity} severity`,
  tone: issue.tone,
}))

export const solutionFlows: Record<string, SolutionFlow> = {
  'mission-undersupply': {
    steps: [
      {
        title: 'Set incentive amount',
        description:
          'Choose how much peak pay to add to close the Dasher supply gap during dinner peak.',
        options: [
          { label: '+$1.50 per delivery', detail: 'Lower cost, slower recovery' },
          {
            label: '+$2.00 per delivery',
            detail: 'Balances cost and recovery speed',
            recommended: true,
          },
          { label: '+$2.50 per delivery', detail: 'Fastest recovery, higher spend' },
        ],
      },
      {
        title: 'Set active duration',
        description: 'Select how long the incentive stays live in Mission District.',
        options: [
          { label: '60 minutes', detail: 'Covers the sharpest part of peak' },
          {
            label: '90 minutes',
            detail: 'Spans the full dinner window',
            recommended: true,
          },
          { label: '120 minutes', detail: 'Extended coverage past peak' },
        ],
      },
      {
        title: 'Notify & assign',
        description:
          'Alert nearby Dashers and assign an owner to monitor the results.',
        options: [
          { label: 'Push to nearby Dashers', detail: 'Notify Dashers within the zone' },
          { label: 'Assign to Supply Ops', detail: 'Route monitoring to the on-call team' },
          { label: 'Do both', detail: 'Notify Dashers and assign an owner', recommended: true },
        ],
      },
    ],
    success: {
      title: 'Peak pay is live',
      description:
        '+$2.00 peak pay is now active in Mission District for 90 minutes. Supply Ops is monitoring recovery.',
      results: [
        { label: 'Orders recovered', value: '~430' },
        { label: 'On-time rate', value: '+4 pts' },
        { label: 'Cancellation risk', value: '-1.6 pts' },
      ],
    },
  },
  'grocery-substitutions': {
    steps: [
      {
        title: 'Select affected stores',
        description:
          'Choose which stores to include in the low-availability outreach.',
        options: [
          {
            label: 'Top 12 stores',
            detail: 'Highest cancellation impact',
            recommended: true,
          },
          { label: 'All city-wide grocery', detail: 'Broader reach, more noise' },
          { label: 'Custom selection', detail: 'Hand-pick specific stores' },
        ],
      },
      {
        title: 'Choose outreach method',
        description:
          'Select how to notify grocery partners about low item availability.',
        options: [
          { label: 'Automated availability alert', detail: 'Instant, sent to partner dashboards' },
          { label: 'Merchant Ops outreach', detail: 'Personal, slower turnaround' },
          {
            label: 'Do both',
            detail: 'Alert now, follow up by phone',
            recommended: true,
          },
        ],
      },
      {
        title: 'Assign an owner',
        description:
          'Pick a team to track substitution and cancellation rates after outreach.',
        options: [
          { label: 'Merchant Ops', detail: 'Owns partner relationships', recommended: true },
          { label: 'Grocery Partnerships', detail: 'Owns category strategy' },
          { label: 'Leave unassigned', detail: 'Monitor manually for now' },
        ],
      },
    ],
    success: {
      title: 'Partners notified',
      description:
        '12 grocery partners have been alerted to low item availability. Merchant Ops is tracking substitution rates.',
      results: [
        { label: 'Stores notified', value: '12' },
        { label: 'Cancellations', value: '-1.8 pts' },
        { label: 'Substitution rate', value: 'Monitoring' },
      ],
    },
  },
  'san-mateo-prep': {
    steps: [
      {
        title: 'Review affected merchants',
        description:
          'Confirm which merchants to include based on prep time variance.',
        options: [
          {
            label: 'Top 8 merchants',
            detail: 'Driving the prep time spike',
            recommended: true,
          },
          { label: 'All San Mateo merchants', detail: 'Full-zone review' },
          { label: 'Custom selection', detail: 'Hand-pick specific merchants' },
        ],
      },
      {
        title: 'Choose intervention',
        description: 'Select how to reduce the impact of elevated prep times.',
        options: [
          {
            label: 'Pause promo exposure',
            detail: 'Reduces incoming order surge',
            recommended: true,
          },
          { label: 'Adjust quoted times', detail: 'Reset customer expectations' },
          { label: 'Do both', detail: 'Pause promos and re-quote times' },
        ],
      },
      {
        title: 'Assign an owner',
        description:
          'Pick a team to monitor prep times until they return to target.',
        options: [
          { label: 'Merchant Ops', detail: 'Owns merchant performance', recommended: true },
          { label: 'Growth Ops', detail: 'Owns promo strategy' },
          { label: 'Leave unassigned', detail: 'Monitor manually for now' },
        ],
      },
    ],
    success: {
      title: 'Intervention applied',
      description:
        'Promo exposure is paused for 8 San Mateo merchants. Merchant Ops is monitoring prep times.',
      results: [
        { label: 'Merchants adjusted', value: '8' },
        { label: 'Avg delivery time', value: '-7 min' },
        { label: 'Prep variance', value: 'Monitoring' },
      ],
    },
  },
}
