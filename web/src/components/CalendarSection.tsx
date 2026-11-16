import { ArrowUpRight, Check, FlaskConical } from 'lucide-react'

import type { Day, WeekNumber } from '../types'
import { WEEK_THEME } from '../lib/theme'
import { cn } from './ui'

export type CalendarFilter = 'all' | 'w1' | 'w2' | 'w3' | 'w4' | 'completed'

const FILTERS: { id: CalendarFilter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'w1', label: 'Semana 1' },
  { id: 'w2', label: 'Semana 2' },
  { id: 'w3', label: 'Semana 3' },
  { id: 'w4', label: 'Semana 4' },
  { id: 'completed', label: 'Completados' },
]

function DayCard({
  day,
  completed,
  onOpen,
}: {
  day: Day
  completed: boolean
  onOpen: (day: number) => void
}) {
  const theme = WEEK_THEME[day.week]
  return (
    <button
      type="button"
      onClick={() => onOpen(day.day)}
      aria-label={`Abrir día ${String(day.day).padStart(2, '0')}: ${day.title}`}
      className={cn(
        'group relative flex min-h-[178px] flex-col rounded-2xl border p-4 text-left transition-all duration-200',
        completed
          ? cn('border-sion/40 bg-sion/[0.06]', 'hover:border-sion/70 hover:bg-sion/[0.09]')
          : 'border-line bg-panel/60 hover:-translate-y-0.5 hover:border-sion/40 hover:bg-panel',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className={cn('font-mono text-[11px] font-semibold uppercase tracking-[0.16em]', theme.text)}>
            Día {String(day.day).padStart(2, '0')}
          </span>
          <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.1em] text-mist">
            {day.topic}
          </span>
        </div>
        <span
          className={cn(
            'grid size-6 shrink-0 place-items-center rounded-full border transition-colors',
            completed
              ? 'border-sion/50 bg-sion text-ink'
              : 'border-line bg-ink/40 text-mist group-hover:border-sion/40 group-hover:text-sion',
          )}
        >
          {completed ? (
            <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
          ) : (
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          )}
        </span>
      </div>

      <h3 className="mt-3 font-display text-[17px] font-semibold leading-snug tracking-tight text-foam">
        {day.title}
      </h3>

      <div className="mt-auto pt-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-mist">
          <FlaskConical className={cn('size-3.5', theme.text)} aria-hidden="true" />
          <span className="line-clamp-1">{day.labTitle}</span>
        </span>
      </div>
    </button>
  )
}

function WeekSection({
  week,
  days,
  completed,
  onOpen,
}: {
  week: WeekNumber
  days: Day[]
  completed: number[]
  onOpen: (day: number) => void
}) {
  const theme = WEEK_THEME[week]
  const done = days.filter((day) => completed.includes(day.day)).length
  const label = days[0]?.weekLabel ?? ''

  return (
    <section className="scroll-mt-24" aria-labelledby={`week-${week}`}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={cn('size-2 rounded-full', theme.dot)} aria-hidden="true" />
            <h2
              id={`week-${week}`}
              className="font-display text-xl font-semibold tracking-tight text-foam"
            >
              Semana {week}
            </h2>
            <span className="font-mono text-[11px] text-mist">
              {done}/{days.length}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-mist">{label.split('·')[1]?.trim() ?? label}</p>
        </div>
        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-line" aria-hidden="true">
          <div
            className={cn('h-full rounded-full transition-[width] duration-500', theme.bar)}
            style={{ width: `${(done / days.length) * 100}%` }}
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {days.map((day) => (
          <DayCard
            key={day.day}
            day={day}
            completed={completed.includes(day.day)}
            onOpen={onOpen}
          />
        ))}
      </div>
    </section>
  )
}

export function CalendarSection({
  days,
  completed,
  activeFilter,
  onFilter,
  onOpen,
}: {
  days: Day[]
  completed: number[]
  activeFilter: CalendarFilter
  onFilter: (filter: CalendarFilter) => void
  onOpen: (day: number) => void
}) {
  const filtered = days.filter((day) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'completed') return completed.includes(day.day)
    return day.week === Number(activeFilter.slice(1))
  })

  const weeks = ([1, 2, 3, 4] as const).filter((week) =>
    filtered.some((day) => day.week === week),
  )

  return (
    <section id="calendario" className="scroll-mt-24 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sion">
              Calendario abierto
            </p>
            <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foam">
              24 laboratorios, 4 semanas
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-mist">
              Todos los días están disponibles. Abrí un casillero, resolvé el laboratorio y
              marcá el día para guardar tu avance.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar días">
            {FILTERS.map((filter) => {
              const count =
                filter.id === 'all'
                  ? days.length
                  : filter.id === 'completed'
                    ? completed.length
                    : days.filter((day) => day.week === Number(filter.id.slice(1))).length
              const active = activeFilter === filter.id
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => onFilter(filter.id)}
                  aria-pressed={active}
                  className={cn(
                    'min-h-9 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                    active
                      ? 'border-sion bg-sion text-ink'
                      : 'border-line bg-panel/60 text-mist hover:border-sion/40 hover:text-foam',
                  )}
                >
                  {filter.label}
                  <span className={cn('ml-1.5 font-mono text-[10px]', active ? 'text-ink/70' : 'text-mist/70')}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-8 space-y-10">
          {weeks.length > 0 ? (
            weeks.map((week) => (
              <WeekSection
                key={week}
                week={week}
                days={filtered.filter((day) => day.week === week)}
                completed={completed}
                onOpen={onOpen}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-line bg-panel/40 px-6 py-14 text-center">
              <p className="font-display text-lg font-semibold text-foam">
                Todavía no completaste ningún día
              </p>
              <p className="mt-1 text-sm text-mist">
                Abrí el día 01 y marcá tu primer laboratorio para verlo acá.
              </p>
              <button
                type="button"
                onClick={() => onOpen(1)}
                className="mt-4 inline-flex min-h-10 items-center rounded-full bg-sion px-4 py-2 text-xs font-semibold text-ink"
              >
                Abrir el día 01
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
