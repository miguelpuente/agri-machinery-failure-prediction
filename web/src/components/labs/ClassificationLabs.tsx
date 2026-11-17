import { useMemo, useState } from 'react'

import { AI4I } from '../../data/ai4i'
import { formatDecimal, formatNumber, formatPercent } from '../../lib/format'
import { classificationMetrics } from '../../lib/labMath'
import { PlotFrame } from '../charts'
import { Callout, Metric, Slider, cn } from '../ui'
import { LabPanel, LabShell, Readout } from './shared'

export function ConfusionMatrixLab() {
  const roc = AI4I.tuned.metrics.roc
  const failures = AI4I.split.testFailures
  const healthy = AI4I.split.testRows - failures
  const projectPoint = useMemo(() => {
    const targetFpr = AI4I.tuned.metrics.fp / healthy
    const targetTpr = AI4I.tuned.metrics.tp / failures
    let best = 0
    let bestDistance = Number.POSITIVE_INFINITY
    roc.forEach((point, index) => {
      const distance = (point.fpr - targetFpr) ** 2 + (point.tpr - targetTpr) ** 2
      if (distance < bestDistance) {
        bestDistance = distance
        best = index
      }
    })
    return best
  }, [roc, healthy, failures])
  const [index, setIndex] = useState(projectPoint)
  const point = roc[index] ?? roc[0]
  const tp = Math.round(point.tpr * failures)
  const fp = Math.round(point.fpr * healthy)
  const fn = failures - tp
  const tn = healthy - fp
  const counts = { tn, fp, fn, tp }
  const metrics = classificationMetrics(counts)

  const cells = [
    { key: 'tn', label: 'TN', value: tn, hint: 'sanas bien', tone: 'border-line bg-panel-2/60' },
    { key: 'fp', label: 'FP', value: fp, hint: 'falsas alarmas', tone: 'border-amber/25 bg-amber/8' },
    { key: 'fn', label: 'FN', value: fn, hint: 'fallas perdidas', tone: 'border-rose-400/30 bg-rose-400/8' },
    { key: 'tp', label: 'TP', value: tp, hint: 'fallas detectadas', tone: 'border-sion/30 bg-sion/8' },
  ]

  return (
    <LabShell>
      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-3">
          <Slider
            label="Punto de la curva ROC (umbral)"
            value={index}
            min={0}
            max={Math.max(0, roc.length - 1)}
            step={1}
            onChange={setIndex}
            format={(value) => `punto ${value + 1}/${roc.length}`}
            hint="Cada punto de la curva corresponde a un umbral distinto sobre las probabilidades del modelo."
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setIndex(projectPoint)}
              className="rounded-full border border-sion/40 bg-sion/10 px-3 py-1.5 text-xs text-sion"
            >
              Punto del proyecto
            </button>
            <span className="inline-flex items-center rounded-full border border-line px-3 py-1.5 font-mono text-[11px] text-mist">
              FPR {formatDecimal(point.fpr, 3)} · TPR {formatDecimal(point.tpr, 3)}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2" aria-label="Matriz de confusión">
          {cells.map((cell) => (
            <div key={cell.key} className={cn('rounded-xl border p-3 text-center', cell.tone)}>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-mist">{cell.label}</p>
              <p className="mt-1 font-mono text-2xl font-semibold text-foam">{formatNumber(cell.value)}</p>
              <p className="text-[10px] text-mist">{cell.hint}</p>
            </div>
          ))}
        </div>
      </div>

      <PlotFrame
        xDomain={[0, 1]}
        yDomain={[0, 1]}
        xLabel="FPR (falsas alarmas)"
        yLabel="TPR (recall)"
        height={250}
        ariaLabel="Curva ROC del árbol tuneado con el punto seleccionado"
        formatX={(value) => formatDecimal(value, 1)}
        formatY={(value) => formatDecimal(value, 1)}
      >
        {({ sx, sy }) => (
          <>
            <line x1={sx(0)} y1={sy(0)} x2={sx(1)} y2={sy(1)} stroke="#1c2b33" strokeDasharray="4 5" />
            <polyline
              points={roc.map((entry) => `${sx(entry.fpr)},${sy(entry.tpr)}`).join(' ')}
              fill="none"
              stroke="#00d1b2"
              strokeWidth="2.5"
            />
            <circle cx={sx(point.fpr)} cy={sy(point.tpr)} r={5} fill="#f2b84b" stroke="#05080d" strokeWidth="2" />
          </>
        )}
      </PlotFrame>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Metric label="Accuracy" value={formatDecimal(metrics.accuracy, 4)} />
        <Metric label="Precision" value={formatDecimal(metrics.precision, 4)} />
        <Metric label="Recall" value={formatDecimal(metrics.recall, 4)} tone={metrics.recall > 0.5 ? 'good' : 'warn'} />
        <Metric label="F1" value={formatDecimal(metrics.f1, 4)} tone={metrics.f1 > 0.7 ? 'good' : 'warn'} />
      </div>

      <Callout tone="warn" title="El error caro">
        En mantenimiento, un FN es una parada no planificada; un FP es una revisión innecesaria. La
        matriz no dice qué umbral es “correcto”: dice qué estás comprando con cada decisión.
      </Callout>
    </LabShell>
  )
}

export function ImbalancedMetricsLab() {
  const [costFn, setCostFn] = useState(10)
  const rows = useMemo(() => {
    const tuned = { ...AI4I.tuned.metrics, tuned: true }
    return [...AI4I.models.map((model) => ({ ...model, tuned: false })), tuned]
      .map((model) => ({
        ...model,
        cost: model.fn * costFn + model.fp,
        costPerFailure: model.fn + model.fp / costFn,
      }))
      .sort((a, b) => a.cost - b.cost)
  }, [costFn])
  const winner = rows[0]

  return (
    <LabShell>
      <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
        <LabPanel title="Costo relativo de los errores">
          <Slider
            label="Costo de una falla perdida"
            value={costFn}
            min={1}
            max={50}
            step={1}
            onChange={setCostFn}
            format={(value) => `${value}× una falsa alarma`}
            hint="Costo(FN) = k · costo(FP). Movelo y mirá si cambia el modelo elegido."
          />
        </LabPanel>
        <LabPanel title="Modelo de menor costo">
          <p className="font-display text-xl font-semibold text-foam">{winner.name}</p>
          <p className="mt-1 text-xs text-mist">
            Costo relativo {formatNumber(winner.cost)} · {winner.fn} fallas perdidas ·{' '}
            {winner.fp} falsas alarmas
          </p>
          <p className="mt-2 font-mono text-[11px] text-sion">
            F1 {formatDecimal(winner.f1, 4)} · recall {formatPercent(winner.recall, 2)}
          </p>
        </LabPanel>
      </div>

      <div className="space-y-2">
        {rows.map((row) => {
          const max = Math.max(...rows.map((entry) => entry.cost), 1)
          return (
            <div key={`${row.name}-${row.tuned}`} className="rounded-xl border border-line bg-panel-2/40 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foam">{row.name}</span>
                  {row.tuned ? (
                    <span className="rounded bg-sion px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase text-ink">
                      elegido
                    </span>
                  ) : null}
                </div>
                <span className="font-mono text-[11px] tabular-nums text-mist">
                  costo {formatNumber(row.cost)}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
                <div
                  className={cn('h-full rounded-full', row.tuned ? 'bg-sion' : 'bg-mist/60')}
                  style={{ width: `${(row.cost / max) * 100}%` }}
                />
              </div>
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-mist">
                <span>F1 {formatDecimal(row.f1, 4)}</span>
                <span>precision {formatDecimal(row.precision, 4)}</span>
                <span>recall {formatDecimal(row.recall, 4)}</span>
                <span>FN {row.fn}</span>
                <span>FP {row.fp}</span>
              </div>
            </div>
          )
        })}
      </div>

      <Readout
        label="Costo total del ganador"
        value={`${formatNumber(winner.cost)} unidades relativas`}
        tone="good"
      />
      <p className="text-xs leading-5 text-mist">
        Con costo de falla perdida bajo, el modelo más conservador puede ganar. Cuando el costo de
        una falla perdida sube, el ranking cambia. F1 es un buen resumen, pero el costo operativo es
        la decisión final.
      </p>
    </LabShell>
  )
}
