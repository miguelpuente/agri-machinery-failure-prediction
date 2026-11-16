import { Activity, CheckCircle2, Gauge } from 'lucide-react'

import { AI4I } from '../data/ai4i'
import { formatDecimal, formatNumber, formatPercent } from '../lib/format'
import { Sparkline } from './charts'

export function HeroVisual() {
  const tuned = AI4I.tuned.metrics
  const depth = AI4I.depthCurve
  const failureRate = AI4I.meta.failureRate

  return (
    <div className="relative">
      <div className="absolute -inset-3 rounded-[28px] bg-sion/10 blur-2xl" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-2xl border border-line bg-panel/90 p-4 shadow-2xl shadow-black/40 backdrop-blur">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <span className="pulse-dot size-2 rounded-full bg-sion" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist">
              AI4I · evaluación
            </span>
          </div>
          <span className="rounded-full border border-sion/25 bg-sion/10 px-2 py-0.5 font-mono text-[10px] text-sion">
            datos reales
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-line bg-ink/50 p-2.5">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-mist">
              <Gauge className="size-3" aria-hidden="true" />
              F1 test
            </div>
            <div className="mt-1 font-mono text-xl font-semibold text-foam">
              {formatDecimal(tuned.f1, 4)}
            </div>
          </div>
          <div className="rounded-xl border border-line bg-ink/50 p-2.5">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-mist">
              <Activity className="size-3" aria-hidden="true" />
              Recall
            </div>
            <div className="mt-1 font-mono text-xl font-semibold text-foam">
              {formatDecimal(tuned.recall, 4)}
            </div>
          </div>
          <div className="rounded-xl border border-line bg-ink/50 p-2.5">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-mist">
              <CheckCircle2 className="size-3" aria-hidden="true" />
              Fallas
            </div>
            <div className="mt-1 font-mono text-xl font-semibold text-foam">
              {tuned.tp}
              <span className="text-sm text-mist">/{tuned.tp + tuned.fn}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-line bg-ink/50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-mist">F1 de test por profundidad del árbol</span>
            <span className="font-mono text-[10px] text-sion">1 → 12</span>
          </div>
          <div className="mt-1.5">
            <Sparkline values={depth.map((row) => row.testF1)} height={40} />
          </div>
          <div className="mt-1 flex justify-between font-mono text-[10px] text-mist">
            <span>prof. 1</span>
            <span>prof. 12</span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3 text-center">
          <div>
            <div className="font-mono text-sm font-semibold text-foam">
              {formatNumber(AI4I.meta.rows)}
            </div>
            <div className="text-[10px] uppercase tracking-[0.1em] text-mist">filas</div>
          </div>
          <div>
            <div className="font-mono text-sm font-semibold text-amber">
              {formatPercent(failureRate, 2)}
            </div>
            <div className="text-[10px] uppercase tracking-[0.1em] text-mist">fallas</div>
          </div>
          <div>
            <div className="font-mono text-sm font-semibold text-foam">
              {AI4I.split.testFailures}
            </div>
            <div className="text-[10px] uppercase tracking-[0.1em] text-mist">en test</div>
          </div>
        </div>
      </div>
    </div>
  )
}
