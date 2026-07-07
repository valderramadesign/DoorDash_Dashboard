import {
  ClipboardList,
  LayoutDashboard,
  Map,
  Radar,
  Settings,
  Siren,
  Target,
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

const primaryNav: NavItem[] = [
  { label: 'Command Center', icon: LayoutDashboard, active: true },
  { label: 'Active Issues', icon: Siren },
  { label: 'Risk Watch', icon: Radar },
  { label: 'Markets', icon: Map },
  { label: 'Forecasts', icon: TrendingUp },
  { label: 'Impact Tracking', icon: Target },
]

const utilityNav: NavItem[] = [
  { label: 'Reports', icon: ClipboardList },
  { label: 'Settings', icon: Settings },
]

function NavLink({ label, icon: Icon, active }: NavItem) {
  return (
    <a
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
  )
}

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
        {primaryNav.map((item) => (
          <NavLink key={item.label} {...item} />
        ))}
      </nav>

      <nav className="space-y-0.5 border-t border-line px-3 py-2">
        {utilityNav.map((item) => (
          <NavLink key={item.label} {...item} />
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
