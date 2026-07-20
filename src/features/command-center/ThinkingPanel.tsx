import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThinkingPanelProps {
  messages: string[]
  className?: string
}

const MESSAGE_INTERVAL = 1600
const TICK_INTERVAL = 100

function formatElapsed(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
}

function formatTokens(count: number) {
  return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : `${count}`
}

/**
 * Placeholder shown while the assistant "figures out" a step: the step
 * counter and progress bar shimmer as one undivided line (the step count
 * isn't known yet), a cycling message narrates what's being considered with
 * a live elapsed-time/token readout, and the option tiles shimmer in place
 * of their eventual content.
 */
export function ThinkingPanel({ messages, className }: ThinkingPanelProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [tokens, setTokens] = useState(0)

  useEffect(() => {
    setMessageIndex(0)
    if (messages.length < 2) return
    const id = window.setInterval(
      () => setMessageIndex((i) => (i + 1) % messages.length),
      MESSAGE_INTERVAL,
    )
    return () => window.clearInterval(id)
  }, [messages])

  // Ticks the elapsed-time and token counters for as long as this step is
  // thinking, mirroring a live reasoning-trace readout.
  useEffect(() => {
    setElapsedMs(0)
    setTokens(0)
    const id = window.setInterval(() => {
      setElapsedMs((ms) => ms + TICK_INTERVAL)
      setTokens((t) => t + 15 + Math.floor(Math.random() * 30))
    }, TICK_INTERVAL)
    return () => window.clearInterval(id)
  }, [messages])

  return (
    <div className={cn('px-6 pt-5 pb-1', className)}>
      <div className="h-3 w-20 shimmer rounded-full" />
      <div className="mt-3 h-1 w-full shimmer rounded-full" />

      <div className="mt-4 flex items-start gap-2">
        <Sparkles className="mt-0.5 size-4 shrink-0 animate-pulse text-brand" />
        <div className="min-w-0">
          <p className="text-sm leading-relaxed text-ink-secondary">
            <span key={messageIndex} className="animate-fade-in">
              {messages[messageIndex]}
            </span>
          </p>
          <p className="mt-1 text-xs tabular-nums text-ink-tertiary">
            {formatElapsed(elapsedMs)} · {formatTokens(tokens)} tokens
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex w-full items-start gap-3 rounded-2xl border border-line p-3.5"
          >
            <span className="mt-0.5 size-4 shrink-0 rounded-full border-2 border-ink-tertiary/25" />
            <span className="min-w-0 flex-1 space-y-2 py-0.5">
              <span className="block h-3 w-2/5 shimmer rounded-full" />
              <span className="block h-2.5 w-4/5 shimmer rounded-full" />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
