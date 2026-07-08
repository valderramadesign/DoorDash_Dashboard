import { useLayoutEffect, useRef, useState } from 'react'
import { Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatusChip } from '@/components/ui/StatusChip'
import type { Issue, MorphOrigin, Tone } from '@/types'
import { SolutionFlowContent } from './SolutionFlowContent'

interface IssueAlertModalProps {
  title: string
  tone: Tone
  severity: string
  explanation: string
  cause: string
  recommendation: string
  origin: MorphOrigin
  /** The issue whose solution flow runs in-place when "Let's fix this" is clicked. */
  issue: Issue | null
  /** Flow reached success and was dismissed — the issue is now being tracked. */
  onComplete: () => void
  onDismiss: () => void
}

const VIEWPORT_GAP = 16
const OPEN_RADIUS = 24
const DURATION = 440

type Box = { top: number; left: number; width: number; height: number; radius: number }

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export function IssueAlertModal({
  title,
  tone,
  severity,
  explanation,
  cause,
  recommendation,
  origin,
  issue,
  onComplete,
  onDismiss,
}: IssueAlertModalProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<'start' | 'open' | 'closing'>('start')
  const [view, setView] = useState<'alert' | 'flow'>('alert')
  const [contentHeight, setContentHeight] = useState(origin.height)
  const exitActionRef = useRef<() => void>(onDismiss)

  // Modal keeps the tile's own width — it only ever grows downward.
  const contentWidth = origin.width

  const startBox: Box = {
    top: origin.top,
    left: origin.left,
    width: origin.width,
    height: origin.height,
    radius: origin.radius,
  }

  // Grow straight down from the tile: same left/width, taller height, only
  // nudging up if the current content would run off the bottom of the viewport.
  const vh = typeof window !== 'undefined' ? window.innerHeight : 0
  let openTop = origin.top
  if (origin.top + contentHeight > vh - VIEWPORT_GAP) {
    openTop = clamp(vh - VIEWPORT_GAP - contentHeight, VIEWPORT_GAP, origin.top)
  }
  const openBox: Box = {
    top: openTop,
    left: origin.left,
    width: contentWidth,
    height: contentHeight,
    radius: OPEN_RADIUS,
  }

  // Track the live content height so the panel animates as the view (alert →
  // flow steps → success) changes, keeping the flow inside this same panel.
  useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return
    const measure = () => setContentHeight(el.offsetHeight)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setPhase('open')),
    )
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const requestExit = (action: () => void) => {
    if (phase === 'closing') return
    exitActionRef.current = action
    setPhase('closing')
    window.setTimeout(() => exitActionRef.current(), DURATION)
  }

  const box = phase === 'open' ? openBox : startBox
  const contentVisible = phase === 'open'

  return (
    <>
      <div
        onClick={() => requestExit(onDismiss)}
        aria-hidden
        className="fixed inset-0 z-40 m-0 bg-ink/50 backdrop-blur-sm transition-opacity"
        style={{
          opacity: contentVisible ? 1 : 0,
          transitionDuration: `${DURATION}ms`,
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="issue-alert-title"
        className="fixed z-50 overflow-hidden bg-white shadow-drawer"
        style={{
          top: box.top,
          left: box.left,
          width: box.width,
          height: box.height,
          borderRadius: box.radius,
          transitionProperty: 'top, left, width, height, border-radius',
          transitionDuration: `${DURATION}ms`,
          transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        <div
          ref={contentRef}
          className="absolute top-0 left-0 transition-opacity"
          style={{
            width: contentWidth,
            opacity: contentVisible ? 1 : 0,
            transitionDuration: `${Math.round(DURATION * 0.55)}ms`,
            transitionDelay: contentVisible ? `${Math.round(DURATION * 0.35)}ms` : '0ms',
          }}
        >
          {view === 'flow' && issue ? (
            <SolutionFlowContent
              issue={issue}
              onBack={() => setView('alert')}
              onExit={() => requestExit(onDismiss)}
              onComplete={() => requestExit(onComplete)}
            />
          ) : (
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    id="issue-alert-title"
                    className="text-lg leading-snug font-bold tracking-tight"
                  >
                    {title}
                  </h2>
                  <StatusChip tone={tone} dot>
                    {severity}
                  </StatusChip>
                </div>
                <button
                  type="button"
                  onClick={() => requestExit(onDismiss)}
                  aria-label="Close"
                  className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-canvas hover:text-ink"
                >
                  <X className="size-4.5" />
                </button>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                {explanation}
              </p>

              <div className="mt-4 rounded-2xl bg-canvas p-4">
                <p className="text-xs font-semibold tracking-[0.08em] text-ink-tertiary uppercase">
                  What's causing it
                </p>
                <p className="mt-1 text-sm text-ink">{cause}</p>
              </div>

              <p className="mt-3 inline-flex items-start gap-1.5 rounded-2xl bg-brand-soft px-3.5 py-2.5 text-sm font-semibold text-brand">
                <Sparkles className="mt-0.5 size-4 shrink-0" />
                {recommendation}
              </p>

              <Button
                variant="primary"
                className="mt-5 w-full justify-center"
                onClick={() =>
                  issue ? setView('flow') : requestExit(onDismiss)
                }
              >
                Let's fix this
              </Button>
              <button
                type="button"
                onClick={() => requestExit(onDismiss)}
                className="mt-2.5 w-full cursor-pointer py-1 text-center text-sm font-semibold text-ink-secondary transition-colors hover:text-ink"
              >
                Not now
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
