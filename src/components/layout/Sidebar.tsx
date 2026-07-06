import {
  Activity,
  Bike,
  ClipboardList,
  FlaskConical,
  Home,
  Megaphone,
  Settings,
  Siren,
  Store,
  Timer,
  TrendingUp,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { DoorDashLogo } from '@/components/ui/DoorDashLogo'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  icon: LucideIcon
  active?: boolean
}

const navItems: NavItem[] = [
  { label: 'Home', icon: Home, active: true },
  { label: 'Marketplace Health', icon: Activity },
  { label: 'Supply', icon: Bike },
  { label: 'Demand', icon: TrendingUp },
  { label: 'Merchant Readiness', icon: Store },
  { label: 'Delivery Reliability', icon: Timer },
  { label: 'Promotions', icon: Megaphone },
  { label: 'Incidents', icon: Siren },
  { label: 'Experiments', icon: FlaskConical },
  { label: 'Reports', icon: ClipboardList },
  { label: 'Settings', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-line bg-white lg:flex">
      <div className="px-6 pt-6 pb-4">
        <DoorDashLogo className="h-[26px]" />
        <p className="mt-1.5 text-[11px] font-semibold tracking-[0.14em] text-ink-tertiary uppercase">
          Ops Command Center
        </p>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {navItems.map(({ label, icon: Icon, active }) => (
          <a
            key={label}
            href="#"
            onClick={(e) => e.preventDefault()}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
              active
                ? 'bg-canvas text-brand'
                : 'text-ink-secondary hover:bg-canvas hover:text-ink',
            )}
          >
            <Icon className="size-[18px]" strokeWidth={active ? 2.25 : 2} />
            {label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-3 border-t border-line px-6 py-4">
        <img
          src="/JL-Persona.png"
          alt="Jordan Lee"
          className="size-9 shrink-0 rounded-full object-cover"
        />
        <div className="leading-tight">
          <p className="text-sm font-semibold">Jordan Lee</p>
          <p className="text-xs text-ink-tertiary">Marketplace Ops</p>
        </div>
      </div>
    </aside>
  )
}
