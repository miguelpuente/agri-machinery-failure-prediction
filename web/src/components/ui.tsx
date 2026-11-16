import { useState, type ReactNode } from 'react'
import { Check, Clipboard, Copy, Info, Lightbulb, TriangleAlert } from 'lucide-react'

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-sion">
      {children}
    </p>
  )
}

export function Pill({
  children,
  tone = 'teal',
}: {
  children: ReactNode
  tone?: 'teal' | 'mist' | 'amber' | 'rose'
}) {
  const tones = {
    teal: 'border-sion/30 bg-sion/10 text-sion',
    mist: 'border-line bg-panel-2 text-mist',
    amber: 'border-amber/30 bg-amber/10 text-amber',
    rose: 'border-rose-400/30 bg-rose-400/10 text-rose-300',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium',
        tones[tone],
      )}
    >
      {children}
    </span>
  )
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format = (next: number) => String(next),
  hint,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  format?: (value: number) => string
  hint?: string
}) {
  const id = `slider-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-foam">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-sm tabular-nums text-sion">
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-line accent-sion"
      />
      {hint ? <p className="text-xs leading-5 text-mist">{hint}</p> : null}
    </div>
  )
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  hint?: string
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-panel-2/60 p-3 transition-colors hover:border-sion/35">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-sion"
      />
      <span>
        <span className="block text-sm font-medium text-foam">{label}</span>
        {hint ? <span className="mt-0.5 block text-xs leading-5 text-mist">{hint}</span> : null}
      </span>
    </label>
  )
}

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  label: string
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1 rounded-xl border border-line bg-panel-2/70 p-1">
      {options.map((option) => (
        <button
          key={String(option.value)}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={option.value === value}
          className={cn(
            'min-h-9 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
            option.value === value
              ? 'bg-sion text-ink'
              : 'text-mist hover:bg-line/60 hover:text-foam',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export function StatCard({
  value,
  label,
  hint,
}: {
  value: ReactNode
  label: string
  hint?: string
}) {
  return (
    <div className="rounded-xl border border-line bg-panel/60 px-4 py-3">
      <div className="font-display text-2xl font-semibold tracking-tight text-foam">{value}</div>
      <div className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-mist">{label}</div>
      {hint ? <div className="mt-1 font-mono text-[11px] text-sion/80">{hint}</div> : null}
    </div>
  )
}

export function Metric({
  label,
  value,
  tone = 'default',
}: {
  label: string
  value: ReactNode
  tone?: 'default' | 'good' | 'warn' | 'bad'
}) {
  const tones = {
    default: 'text-foam',
    good: 'text-sion',
    warn: 'text-amber',
    bad: 'text-rose-300',
  }
  return (
    <div className="rounded-lg border border-line bg-ink/40 px-3 py-2">
      <div className="text-[10px] uppercase tracking-[0.14em] text-mist">{label}</div>
      <div className={cn('mt-0.5 font-mono text-lg font-semibold tabular-nums', tones[tone])}>
        {value}
      </div>
    </div>
  )
}

export function ProgressRing({
  value,
  size = 72,
  label,
}: {
  value: number
  size?: number
  label?: string
}) {
  const radius = (size - 10) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.min(100, Math.max(0, value)) / 100)
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1c2b33" strokeWidth="6" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#00d1b2"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <span className="absolute font-mono text-sm font-semibold text-foam">
        {label ?? `${Math.round(value)}%`}
      </span>
    </div>
  )
}

export function Callout({
  children,
  tone = 'tip',
  title,
}: {
  children: ReactNode
  tone?: 'tip' | 'info' | 'warn' | 'danger'
  title?: string
}) {
  const styles = {
    tip: { box: 'border-sion/25 bg-sion/8', text: 'text-sion', icon: Lightbulb },
    info: { box: 'border-cyan-400/25 bg-cyan-400/8', text: 'text-cyan-300', icon: Info },
    warn: { box: 'border-amber/25 bg-amber/8', text: 'text-amber', icon: TriangleAlert },
    danger: { box: 'border-rose-400/25 bg-rose-400/8', text: 'text-rose-300', icon: TriangleAlert },
  }[tone]
  const Icon = styles.icon
  return (
    <div className={cn('rounded-xl border p-3.5', styles.box)}>
      <div className={cn('flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em]', styles.text)}>
        <Icon className="size-4" aria-hidden="true" />
        {title ?? 'Para llevarte'}
      </div>
      <div className="mt-1.5 text-sm leading-6 text-foam/85">{children}</div>
    </div>
  )
}

export function CodeBlock({ code, label = 'Python' }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-[#070d12]">
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-mist">
          <Clipboard className="size-3.5" aria-hidden="true" />
          {label}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-8 items-center gap-1.5 rounded-md px-2 py-1 text-xs text-mist transition-colors hover:bg-line/60 hover:text-foam"
        >
          {copied ? <Check className="size-3.5 text-sion" /> : <Copy className="size-3.5" />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <pre className="code-scroll p-4 text-[12.5px] leading-6 text-foam/90">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export function DataTable({
  columns,
  rows,
  maxHeight,
}: {
  columns: string[]
  rows: (string | number | null)[][]
  maxHeight?: string
}) {
  return (
    <div
      className="overflow-auto rounded-xl border border-line"
      style={maxHeight ? { maxHeight } : undefined}
    >
      <table className="w-full border-collapse text-left text-xs">
        <thead className="sticky top-0 bg-panel-2">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="whitespace-nowrap border-b border-line px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-mist"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="odd:bg-ink/30">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="whitespace-nowrap border-b border-line/60 px-3 py-1.5 font-mono tabular-nums text-foam/80"
                >
                  {cell === null ? <span className="text-rose-300">null</span> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
