import { ArrowDown, ArrowUpRight, CalendarDays } from 'lucide-react'

import { AI4I } from '../data/ai4i'
import { BRAND } from '../lib/theme'
import { formatNumber, formatPercent } from '../lib/format'
import { HeroVisual } from './HeroVisual'
import { cn } from './ui'

export function Hero({ onStart, total }: { onStart: () => void; total: number }) {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-10 pt-14 sm:px-6 sm:pt-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rise-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-sion/25 bg-sion/8 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-sion">
            <span className="size-1.5 rounded-full bg-sion" aria-hidden="true" />
            SION · laboratorios de Machine Learning
          </div>

          <h1 className="display-balance mt-5 font-display text-5xl font-bold leading-[0.95] tracking-tight text-foam sm:text-6xl lg:text-7xl">
            Sion <span className="text-sion">Machine</span> Learning
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-mist sm:text-lg">
            {total} laboratorios interactivos para recorrer el pipeline de mantenimiento
            predictivo sobre AI4I: datos, limpieza, features, modelos, métricas y límites.
            Cada número sale del proyecto real.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-sion px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5 hover:bg-sion/90"
            >
              <CalendarDays className="size-4" aria-hidden="true" />
              Empezar por el día 01
            </button>
            <a
              href="#proyecto"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-panel/60 px-5 py-2.5 text-sm font-medium text-foam transition-colors hover:border-sion/40 hover:bg-panel"
            >
              Ver el proyecto
              <ArrowDown className="size-4 text-mist" aria-hidden="true" />
            </a>
            <a
              href={BRAND.repository}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 px-2 py-2.5 text-sm text-mist transition-colors hover:text-sion"
            >
              Notebooks
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>

          <dl className="mt-9 grid max-w-xl grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            {[
              { label: 'Laboratorios', value: String(total), hint: '24 días' },
              { label: 'Semanas', value: '4', hint: '6 labs cada una' },
              { label: 'Filas AI4I', value: formatNumber(AI4I.meta.rows), hint: '14 columnas' },
              {
                label: 'Fallas',
                value: formatPercent(AI4I.meta.failureRate, 2),
                hint: `${AI4I.meta.failureCount} casos`,
              },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="text-[11px] uppercase tracking-[0.16em] text-mist">{stat.label}</dt>
                <dd className={cn('mt-1 font-display text-2xl font-semibold text-foam')}>
                  {stat.value}
                </dd>
                <dd className="font-mono text-[10px] text-sion/80">{stat.hint}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rise-in lg:pl-4" style={{ animationDelay: '90ms' }}>
          <HeroVisual />
        </div>
      </div>
    </section>
  )
}
