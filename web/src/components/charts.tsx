import { useId, type ReactNode } from 'react'

import { cn } from './ui'

export interface PlotHelpers {
  sx: (x: number) => number
  sy: (y: number) => number
  left: number
  top: number
  innerWidth: number
  innerHeight: number
  xDomain: [number, number]
  yDomain: [number, number]
}

function ticks(min: number, max: number, count = 4): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) return [min]
  return Array.from({ length: count + 1 }, (_, index) => min + ((max - min) * index) / count)
}

export function PlotFrame({
  xDomain,
  yDomain,
  xLabel,
  yLabel,
  width = 640,
  height = 300,
  formatX = (value) => String(Math.round(value * 100) / 100),
  formatY = (value) => String(Math.round(value * 100) / 100),
  children,
  ariaLabel,
  className,
}: {
  xDomain: [number, number]
  yDomain: [number, number]
  xLabel: string
  yLabel: string
  width?: number
  height?: number
  formatX?: (value: number) => string
  formatY?: (value: number) => string
  children: (helpers: PlotHelpers) => ReactNode
  ariaLabel: string
  className?: string
}) {
  const pad = { left: 48, right: 16, top: 16, bottom: 38 }
  const innerWidth = width - pad.left - pad.right
  const innerHeight = height - pad.top - pad.bottom
  const gradientId = useId()

  const sx = (x: number) =>
    pad.left + ((x - xDomain[0]) / (xDomain[1] - xDomain[0] || 1)) * innerWidth
  const sy = (y: number) =>
    pad.top + (1 - (y - yDomain[0]) / (yDomain[1] - yDomain[0] || 1)) * innerHeight

  const xTicks = ticks(xDomain[0], xDomain[1])
  const yTicks = ticks(yDomain[0], yDomain[1])

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
      className={cn('w-full', className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#00d1b2" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#00d1b2" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect
        x={pad.left}
        y={pad.top}
        width={innerWidth}
        height={innerHeight}
        fill="#070d12"
        stroke="#1c2b33"
        rx="6"
      />
      {xTicks.map((tick) => (
        <g key={`x-${tick}`}>
          <line
            x1={sx(tick)}
            x2={sx(tick)}
            y1={pad.top}
            y2={pad.top + innerHeight}
            stroke="#1c2b33"
            strokeDasharray="3 5"
          />
          <text
            x={sx(tick)}
            y={height - 12}
            textAnchor="middle"
            fill="#8fa6a3"
            fontSize="10"
            fontFamily="var(--font-mono)"
          >
            {formatX(tick)}
          </text>
        </g>
      ))}
      {yTicks.map((tick) => (
        <g key={`y-${tick}`}>
          <line
            x1={pad.left}
            x2={pad.left + innerWidth}
            y1={sy(tick)}
            y2={sy(tick)}
            stroke="#1c2b33"
            strokeDasharray="3 5"
          />
          <text
            x={pad.left - 8}
            y={sy(tick) + 3}
            textAnchor="end"
            fill="#8fa6a3"
            fontSize="10"
            fontFamily="var(--font-mono)"
          >
            {formatY(tick)}
          </text>
        </g>
      ))}
      <text
        x={pad.left + innerWidth / 2}
        y={height - 1}
        textAnchor="middle"
        fill="#8fa6a3"
        fontSize="10"
        fontFamily="var(--font-mono)"
      >
        {xLabel}
      </text>
      <text
        x={12}
        y={pad.top + innerHeight / 2}
        textAnchor="middle"
        fill="#8fa6a3"
        fontSize="10"
        fontFamily="var(--font-mono)"
        transform={`rotate(-90 12 ${pad.top + innerHeight / 2})`}
      >
        {yLabel}
      </text>
      {children({ sx, sy, left: pad.left, top: pad.top, innerWidth, innerHeight, xDomain, yDomain })}
    </svg>
  )
}

export function BarList({
  items,
  color = 'bg-sion',
  format = (value) => value.toFixed(3),
  max,
}: {
  items: { label: string; value: number }[]
  color?: string
  format?: (value: number) => string
  max?: number
}) {
  const top = max ?? Math.max(...items.map((item) => item.value), 1)
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div key={item.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <span className="truncate text-xs text-foam/80">{item.label}</span>
              <span className="font-mono text-[11px] tabular-nums text-mist">{format(item.value)}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-line">
              <div
                className={cn('h-full rounded-full transition-[width] duration-500', color)}
                style={{ width: `${Math.min(100, (item.value / top) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function Sparkline({
  values,
  width = 160,
  height = 48,
  color = '#00d1b2',
}: {
  values: number[]
  width?: number
  height?: number
  color?: string
}) {
  if (values.length < 2) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width
      const y = height - ((value - min) / (max - min || 1)) * height
      return `${x},${y}`
    })
    .join(' ')
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
