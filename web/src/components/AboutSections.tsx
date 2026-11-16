import { ArrowUpRight, BookOpen, Database, ExternalLink, GitBranch, ShieldCheck } from 'lucide-react'

import { AI4I } from '../data/ai4i'
import { DAYS, WEEK_LABELS } from '../data/days'
import { BRAND, WEEK_THEME } from '../lib/theme'
import { formatDecimal, formatNumber, formatPercent } from '../lib/format'
import type { WeekNumber } from '../types'
import { Callout, Pill, cn } from './ui'

export function RouteSection({ onOpen }: { onOpen: (day: number) => void }) {
  return (
    <section id="ruta" className="scroll-mt-24 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sion">La ruta</p>
        <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foam">
          De los datos a la alerta
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-mist">
          Cuatro semanas que repiten el ciclo completo del proyecto: preparar, modelar,
          comparar y decidir con evidencia.
        </p>

        <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {([1, 2, 3, 4] as WeekNumber[]).map((week) => {
            const theme = WEEK_THEME[week]
            const days = DAYS.filter((day) => day.week === week)
            return (
              <div key={week} className={cn('rounded-2xl border bg-panel/50 p-4', theme.border)}>
                <div className="flex items-center justify-between">
                  <span className={cn('font-mono text-[11px] uppercase tracking-[0.16em]', theme.text)}>
                    Semana {week}
                  </span>
                  <span className="font-mono text-[10px] text-mist">6 labs</span>
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold text-foam">
                  {WEEK_LABELS[week].split('·')[1]?.trim()}
                </h3>
                <ul className="mt-3 space-y-1.5">
                  {days.map((day) => (
                    <li key={day.day}>
                      <button
                        type="button"
                        onClick={() => onOpen(day.day)}
                        className="group flex w-full items-baseline gap-2 rounded-md px-1 py-0.5 text-left text-xs text-mist transition-colors hover:bg-line/40 hover:text-foam"
                      >
                        <span className={cn('font-mono text-[10px]', theme.text)}>
                          {String(day.day).padStart(2, '0')}
                        </span>
                        <span className="line-clamp-1">{day.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function AboutSection() {
  const rows = [
    ...AI4I.models.map((model) => ({ ...model, tuned: false })),
    { ...AI4I.tuned.metrics, tuned: true },
  ]

  return (
    <section id="proyecto" className="scroll-mt-24 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sion">
              El proyecto
            </p>
            <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foam">
              Mantenimiento predictivo, con números reales
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-mist">
              El sitio acompaña el proyecto integrador de Machine Learning sobre AI4I 2020:
              10.000 filas, target binario <span className="font-mono text-foam/80">Machine failure</span>{' '}
              y un pipeline reproducible de punta a punta. Las métricas que ves acá se
              generaron con el código del repositorio, no con datos de ejemplo.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Pill tone="teal">
                <Database className="size-3" aria-hidden="true" />
                {formatNumber(AI4I.meta.rows)} filas
              </Pill>
              <Pill tone="mist">{AI4I.meta.columns} columnas</Pill>
              <Pill tone="amber">{formatPercent(AI4I.meta.failureRate, 2)} fallas</Pill>
              <Pill tone="mist">test {formatNumber(AI4I.split.testRows)} filas</Pill>
              <Pill tone="mist">{AI4I.split.testFailures} fallas en test</Pill>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={BRAND.repository}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-sion px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-sion/90"
              >
                <GitBranch className="size-4" aria-hidden="true" />
                Repositorio
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
              <a
                href={`${BRAND.repository}/blob/main/notebooks/entrega-final.ipynb`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-panel/60 px-4 py-2 text-xs font-medium text-foam transition-colors hover:border-sion/40"
              >
                <BookOpen className="size-4 text-sion" aria-hidden="true" />
                Entrega Final
              </a>
              <a
                href={BRAND.dataset}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-panel/60 px-4 py-2 text-xs font-medium text-foam transition-colors hover:border-sion/40"
              >
                <ExternalLink className="size-4 text-sion" aria-hidden="true" />
                Dataset UCI
              </a>
            </div>

            <div className="mt-6">
              <Callout tone="warn" title="Límites declarados">
                AI4I es un dataset industrial sintético. El encuadre agropecuario es
                didáctico y no demuestra validez operativa en campo. El test participa en la
                comparación de familias de modelos; no es una auditoría final independiente.
                Antes de usar alertas en producción, validá con datos nuevos y cuantificá el
                costo de las fallas omitidas y de las falsas alarmas.
              </Callout>
            </div>
          </div>

          <div className="min-w-0 space-y-3">
            <div className="min-w-0 rounded-2xl border border-line bg-panel/60 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-foam">
                  Resultados sobre test
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-mist">
                  2.000 filas · 68 fallas
                </span>
              </div>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr>
                      {['Modelo', 'F1', 'ROC-AUC', 'Fallas perdidas'].map((column) => (
                        <th
                          key={column}
                          scope="col"
                          className="whitespace-nowrap border-b border-line px-2 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-mist"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr
                        key={`${row.name}-${row.tuned ? 'tuned' : 'baseline'}`}
                        className={row.tuned ? 'bg-sion/[0.07]' : undefined}
                      >
                        <td className="whitespace-nowrap border-b border-line/60 px-2 py-2 text-foam/85">
                          <span className="flex items-center gap-1.5">
                            {row.name}
                            {row.tuned ? (
                              <span className="rounded bg-sion px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase text-ink">
                                elegido
                              </span>
                            ) : null}
                          </span>
                        </td>
                        <td
                          className={cn(
                            'whitespace-nowrap border-b border-line/60 px-2 py-2 font-mono tabular-nums',
                            row.tuned ? 'font-semibold text-sion' : 'text-foam/80',
                          )}
                        >
                          {formatDecimal(row.f1, 4)}
                        </td>
                        <td className="whitespace-nowrap border-b border-line/60 px-2 py-2 font-mono tabular-nums text-foam/80">
                          {formatDecimal(row.rocAuc, 4)}
                        </td>
                        <td className="whitespace-nowrap border-b border-line/60 px-2 py-2 font-mono tabular-nums text-foam/80">
                          {row.fn} de 68
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[11px] leading-5 text-mist">
                El árbol tuneado (<span className="font-mono">max_depth=8</span>,{' '}
                <span className="font-mono">min_samples_leaf=3</span>) gana en F1 y en fallas
                recuperadas; el Random Forest conserva mejor ROC-AUC.
              </p>
            </div>

            <div className="min-w-0 rounded-2xl border border-line bg-panel/60 p-4">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-foam">
                <ShieldCheck className="size-4 text-sion" aria-hidden="true" />
                Ficha del dataset
              </h3>
              <dl className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between gap-3">
                  <dt className="text-mist">Fuente</dt>
                  <dd className="text-right text-foam/85">AI4I 2020 · UCI</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-mist">Licencia</dt>
                  <dd className="text-right text-foam/85">{AI4I.meta.license}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-mist">Semilla</dt>
                  <dd className="font-mono text-right text-foam/85">{AI4I.meta.randomState}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-mist">Split</dt>
                  <dd className="text-right text-foam/85">80 / 20 estratificado</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-mist">Métrica principal</dt>
                  <dd className="text-right text-foam/85">F1</dd>
                </div>
              </dl>
              <p className="mt-3 border-t border-line pt-3 text-[11px] leading-5 text-mist">
                {AI4I.meta.citation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
