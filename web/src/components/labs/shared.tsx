import type { ReactNode } from 'react'

import { cn } from '../ui'

export function LabShell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('space-y-4', className)}>{children}</div>
}

export function LabPanel({
  children,
  className,
  title,
}: {
  children: ReactNode
  className?: string
  title?: string
}) {
  return (
    <div className={cn('rounded-xl border border-line bg-panel-2/50 p-3.5', className)}>
      {title ? (
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-mist">{title}</p>
      ) : null}
      {children}
    </div>
  )
}

export function Legend({
  items,
}: {
  items: { label: string; color: string }[]
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5 text-[11px] text-mist">
          <span className={cn('size-2 rounded-full', item.color)} aria-hidden="true" />
          {item.label}
        </span>
      ))}
    </div>
  )
}

export function Readout({
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
    <div className="rounded-lg border border-line bg-ink/40 px-3 py-2 text-center">
      <p className="text-[10px] uppercase tracking-[0.12em] text-mist">{label}</p>
      <p className={cn('mt-0.5 font-mono text-base font-semibold tabular-nums', tones[tone])}>
        {value}
      </p>
    </div>
  )
}

export const LAB_COLORS = ['#00d1b2', '#38bdf8', '#a3e635', '#f2b84b', '#fb7185'] as const
