import { useEffect, useRef } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ExternalLink,
  FlaskConical,
  X,
} from 'lucide-react'

import type { Day } from '../types'
import { setBackgroundInert, useFocusTrap } from '../lib/useFocusTrap'
import { WEEK_THEME } from '../lib/theme'
import { LAB_COMPONENTS } from './labs'
import { Quiz } from './Quiz'
import { Callout, CodeBlock, Pill, cn } from './ui'

export function DayModal({
  day,
  total,
  completed,
  onClose,
  onToggleComplete,
  onPrev,
  onNext,
  onOpenDay,
}: {
  day: Day
  total: number
  completed: boolean
  onClose: () => void
  onToggleComplete: (day: number, completed: boolean) => void
  onPrev: () => void
  onNext: () => void
  onOpenDay: (day: number) => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = `day-${day.day}-title`
  const theme = WEEK_THEME[day.week]
  const Lab = LAB_COMPONENTS[day.labId]

  useFocusTrap(panelRef)

  useEffect(() => {
    setBackgroundInert(true)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      setBackgroundInert(false)
    }
  }, [onClose])

  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }, [day.day])

  const previousDay = day.day > 1 ? day.day - 1 : null
  const nextDay = day.day < total ? day.day + 1 : null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-0 sm:p-4">
      <button
        type="button"
        aria-label="Cerrar el día"
        onClick={onClose}
        className="modal-backdrop absolute inset-0 cursor-default bg-ink/85 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="modal-panel relative flex h-full w-full max-w-5xl flex-col overflow-y-auto border border-line bg-panel shadow-2xl shadow-black/60 sm:h-auto sm:max-h-[92vh] sm:rounded-2xl"
      >
        <div className="sticky top-0 z-20 border-b border-line bg-panel/95 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn('font-mono text-[11px] font-semibold uppercase tracking-[0.18em]', theme.text)}>
                  Día {String(day.day).padStart(2, '0')}
                </span>
                <span className="text-mist">/</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-mist">
                  {day.weekLabel}
                </span>
                <Pill tone="mist">{day.topic}</Pill>
                {completed ? <Pill tone="teal">completado</Pill> : null}
              </div>
              <h2 id={titleId} className="mt-1 font-display text-2xl font-semibold tracking-tight text-foam sm:text-3xl">
                {day.title}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-mist">{day.subtitle}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleComplete(day.day, !completed)}
                aria-pressed={completed}
                className={cn(
                  'inline-flex min-h-10 items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors',
                  completed
                    ? 'bg-sion text-ink'
                    : 'border border-sion/40 bg-sion/10 text-sion hover:bg-sion/15',
                )}
              >
                {completed ? <CheckCircle2 className="size-4" aria-hidden="true" /> : <Check className="size-4" aria-hidden="true" />}
                <span className="sm:hidden">{completed ? 'Completado' : 'Completar'}</span>
                <span className="hidden sm:inline">{completed ? 'Completado' : 'Marcar completado'}</span>
              </button>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="grid size-10 place-items-center rounded-full border border-line text-mist transition-colors hover:border-sion/40 hover:text-foam"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0 space-y-6">
            <section aria-labelledby="concept-title">
              <h3 id="concept-title" className="font-display text-lg font-semibold text-foam">
                Concepto
              </h3>
              <p className="mt-2 text-sm leading-7 text-foam/80">{day.conceptSummary}</p>
              <div className="mt-3">
                <Callout tone="tip" title="Para llevarte">
                  {day.keyTakeaway}
                </Callout>
              </div>
            </section>

            <section aria-labelledby="lab-title">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 id="lab-title" className="flex items-center gap-2 font-display text-lg font-semibold text-foam">
                  <FlaskConical className={cn('size-4', theme.text)} aria-hidden="true" />
                  {day.labTitle}
                </h3>
                <Pill tone="mist">laboratorio</Pill>
              </div>
              <p className="mt-1 text-sm leading-6 text-mist">{day.labInstruction}</p>
              <div className="mt-3">
                <Lab key={day.day} />
              </div>
            </section>

            <section aria-labelledby="code-title">
              <h3 id="code-title" className="font-display text-lg font-semibold text-foam">
                Código del proyecto
              </h3>
              <div className="mt-2">
                <CodeBlock code={day.codeSnippet} />
              </div>
            </section>

            <section aria-labelledby="quiz-title">
              <h3 id="quiz-title" className="sr-only">
                Quiz
              </h3>
              <Quiz key={day.day} quiz={day.quiz} />
            </section>

            <section aria-labelledby="challenge-title">
              <h3 id="challenge-title" className="font-display text-lg font-semibold text-foam">
                Reto del día
              </h3>
              <div className="mt-2">
                <Callout tone="warn" title="Manos a la obra">
                  {day.challenge}
                </Callout>
              </div>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-xl border border-line bg-panel-2/50 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-mist">
                Estado
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-foam">
                {completed ? 'Completado' : 'Pendiente'}
              </p>
              <button
                type="button"
                onClick={() => onToggleComplete(day.day, !completed)}
                aria-pressed={completed}
                className={cn(
                  'mt-2 inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors',
                  completed
                    ? 'border border-sion/40 bg-sion/10 text-sion'
                    : 'bg-sion text-ink hover:bg-sion/90',
                )}
              >
                {completed ? <CheckCircle2 className="size-4" aria-hidden="true" /> : <Check className="size-4" aria-hidden="true" />}
                {completed ? 'Quitar marca' : 'Marcar completado'}
              </button>
              <p className="mt-2 text-[10px] leading-4 text-mist">
                El avance se guarda en este navegador.
              </p>
            </div>

            <div className="rounded-xl border border-line bg-panel-2/50 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-mist">Cuaderno</p>
              <p className="mt-1 text-sm font-medium text-foam">{day.notebook.title}</p>
              <div className="mt-2 space-y-1.5">
                <a
                  href={day.notebook.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-2 rounded-lg border border-line px-2.5 py-2 text-xs text-mist transition-colors hover:border-sion/40 hover:text-foam"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen className="size-3.5" aria-hidden="true" />
                    GitHub
                  </span>
                  <ExternalLink className="size-3" aria-hidden="true" />
                </a>
                <a
                  href={day.notebook.colabUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-2 rounded-lg border border-line px-2.5 py-2 text-xs text-mist transition-colors hover:border-sion/40 hover:text-foam"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                    Google Colab
                  </span>
                  <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-line bg-panel-2/50 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-mist">
                Navegación
              </p>
              <div className="mt-2 grid gap-2">
                <button
                  type="button"
                  onClick={onPrev}
                  disabled={previousDay == null}
                  className="flex items-center gap-2 rounded-lg border border-line px-2.5 py-2 text-left text-xs text-mist transition-colors hover:text-foam disabled:opacity-35"
                >
                  <ArrowLeft className="size-3.5 shrink-0" aria-hidden="true" />
                  {previousDay ? `Día ${String(previousDay).padStart(2, '0')}` : 'Inicio'}
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  disabled={nextDay == null}
                  className="flex items-center justify-between gap-2 rounded-lg border border-line px-2.5 py-2 text-left text-xs text-mist transition-colors hover:text-foam disabled:opacity-35"
                >
                  {nextDay ? `Día ${String(nextDay).padStart(2, '0')}` : 'Fin'}
                  <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {Array.from({ length: total }, (_, index) => index + 1).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onOpenDay(value)}
                    aria-label={`Ir al día ${value}`}
                    aria-current={value === day.day ? 'page' : undefined}
                    className={cn(
                      'grid size-8 place-items-center rounded font-mono text-[9px] transition-colors sm:size-7',
                      value === day.day
                        ? 'bg-sion text-ink'
                        : 'text-mist hover:bg-line/60 hover:text-foam',
                    )}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
