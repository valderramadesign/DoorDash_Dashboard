import { Bell, Calendar, ChevronDown, MapPin, Search, Tag } from 'lucide-react'

function SelectorPill({
  icon: Icon,
  label,
}: {
  icon: typeof Calendar
  label: string
}) {
  return (
    <button
      type="button"
      className="flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-canvas"
    >
      <Icon className="size-3.5 text-ink-secondary" />
      {label}
      <ChevronDown className="size-3.5 text-ink-tertiary" />
    </button>
  )
}

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
      <div className="flex items-center gap-3 px-5 py-3 sm:px-8">
        <div className="relative max-w-md flex-1">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-tertiary" />
          <input
            type="search"
            placeholder="Search market, zone, merchant, issue"
            className="w-full rounded-full border border-line bg-canvas py-2.5 pr-4 pl-10 text-sm outline-none placeholder:text-ink-tertiary focus:border-ink-tertiary focus:bg-white"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <SelectorPill icon={Calendar} label="Today" />
            <SelectorPill icon={MapPin} label="SF Bay Area" />
            <SelectorPill icon={Tag} label="All categories" />
          </div>
          <button
            type="button"
            aria-label="Notifications"
            className="relative ml-1 flex size-9 cursor-pointer items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-canvas hover:text-ink"
          >
            <Bell className="size-[18px]" />
            <span className="absolute top-2 right-2 size-2 rounded-full bg-brand ring-2 ring-white" />
          </button>
        </div>
      </div>
    </header>
  )
}
