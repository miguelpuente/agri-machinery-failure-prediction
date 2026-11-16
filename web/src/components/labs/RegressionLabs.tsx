import { useState } from 'react'

import { AI4I } from '../../data/ai4i'
import { formatDecimal, formatNumber, formatPercent } from '../../lib/format'
import { classificationMetrics, linearMetrics, sigmoid } from '../../lib/labMath'
import { PlotFrame } from '../charts'
import { Callout, Metric, Slider, cn } from '../ui'
import { LabShell, Legend, Readout } from './shared'

export function LinearRegressionFitLab() {
  const data = AI4I.linearRegression
  const [slope, setSlope] = useState(0.6)
  const [intercept, setIntercept] = useState(130)
  const metrics = linearMetrics(data.points, slope, intercept)
  const optimal = linearMetrics(data.points, data.slope, data.intercept)
  const xs = data.points.map((point) => point.x)
  const ys = data.points.map((point) => point.y)
  const xDomain: [number, number] = [Math.min(...xs) - 0.2, Math.max(...xs) + 0.2]
  const yDomain: [number, number] = [Math.min(...ys) - 1, Math.max(...ys) + 1]

  return (
    <LabShell>
      <div className="grid gap-3 md:grid-cols-2">
        <Slider
          label="Pendiente"
          value={slope}
          min={0.1}
          max={1.2}
          step={0.01}
          onChange={setSlope}
          format={(value) => formatDecimal(value, 2)}
        />
        <Slider
          label="Intercepto"
          value={intercept}
          min={100}
          max={130}
          step={0.1}
          onChange={setIntercept}
          format={(value) => formatDecimal(value, 1)}
        />
      </div>

      <PlotFrame
        xDomain={xDomain}
        yDomain={yDomain}
        xLabel={data.xLabel}
        yLabel={data.yLabel}
        ariaLabel="Recta de regresión ajustable sobre temperatura ambiente y de proceso"
        formatX={(value) => formatDecimal(value, 0)}
        formatY={(value) => formatDecimal(value, 0)}
      >
        {({ sx, sy }) => (
          <>
            {data.points.map((point, index) => (
              <circle
                key={index}
                cx={sx(point.x)}
                cy={sy(point.y)}
                r={2.2}
                fill="#8fa6a3"
                fillOpacity={0.55}
              />
            ))}
            <line
              x1={sx(xDomain[0])}
              y1={sy(slope * xDomain[0] + intercept)}
              x2={sx(xDomain[1])}
              y2={sy(slope * xDomain[1] + intercept)}
              stroke="#00d1b2"
              strokeWidth="2.5"
            />
            <line
              x1={sx(xDomain[0])}
              y1={sy(data.slope * xDomain[0] + data.intercept)}
              x2={sx(xDomain[1])}
              y2={sy(data.slope * xDomain[1] + data.intercept)}
              stroke="#f2b84b"
              strokeWidth="1.5"
              strokeDasharray="6 5"
            />
          </>
        )}
      </PlotFrame>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Legend
          items={[
            { label: 'tu recta', color: 'bg-sion' },
            { label: 'óptima', color: 'bg-amber' },
            { label: 'datos', color: 'bg-mist' },
          ]}
        />
        <button
          type="button"
          onClick={() => {
            setSlope(data.slope)
            setIntercept(data.intercept)
          }}
          className="inline-flex min-h-9 items-center rounded-full bg-sion px-3.5 py-1.5 text-xs font-semibold text-ink"
        >
          Ajustar al óptimo
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Metric label="MAE" value={`${formatDecimal(metrics.mae, 3)} K`} />
        <Metric label="RMSE" value={`${formatDecimal(metrics.rmse, 3)} K`} tone={metrics.rmse < 1 ? 'good' : 'warn'} />
        <Metric label="R²" value={formatDecimal(metrics.r2, 4)} tone={metrics.r2 > 0.7 ? 'good' : 'warn'} />
        <Metric label="R² óptimo" value={formatDecimal(optimal.r2, 4)} tone="good" />
      </div>

      <Callout tone="tip">
        La recta óptima del proyecto es{' '}
        <span className="font-mono">
          {formatDecimal(data.slope, 4)} · x + {formatDecimal(data.intercept, 2)}
        </span>
        , con R² {formatDecimal(data.r2, 4)}. La pendiente significa que por cada kelvin de aire, el
        proceso sube en promedio {formatDecimal(data.slope, 2)} K.
      </Callout>
    </LabShell>
  )
}

export function RegressionMetricsLab() {
  const data = AI4I.linearRegression
  const [outlier, setOutlier] = useState(false)
  const [outlierY, setOutlierY] = useState(318)
  const basePoints = data.points
  const points = outlier ? [...basePoints, { x: 300, y: outlierY }] : basePoints
  const metrics = linearMetrics(points, data.slope, data.intercept)
  const baseline = linearMetrics(basePoints, data.slope, data.intercept)
  const xs = points.map((point) => point.x)
  const ys = points.map((point) => point.y)
  const xDomain: [number, number] = [Math.min(...xs) - 0.3, Math.max(...xs) + 0.3]
  const yDomain: [number, number] = [Math.min(...ys) - 1, Math.max(...ys) + 2]

  return (
    <LabShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-foam">
          <input
            type="checkbox"
            checked={outlier}
            onChange={(event) => setOutlier(event.target.checked)}
            className="size-4 accent-sion"
          />
          Agregar punto atípico
        </label>
        <div className="w-full max-w-xs">
          <Slider
            label="Valor del punto"
            value={outlierY}
            min={314}
            max={330}
            step={0.5}
            onChange={setOutlierY}
            format={(value) => `${formatDecimal(value, 1)} K`}
          />
        </div>
      </div>

      <PlotFrame
        xDomain={xDomain}
        yDomain={yDomain}
        xLabel={data.xLabel}
        yLabel={data.yLabel}
        ariaLabel="Efecto del punto atípico en las métricas de regresión"
        formatX={(value) => formatDecimal(value, 0)}
        formatY={(value) => formatDecimal(value, 0)}
      >
        {({ sx, sy }) => (
          <>
            {basePoints.map((point, index) => (
              <circle key={index} cx={sx(point.x)} cy={sy(point.y)} r={2} fill="#8fa6a3" fillOpacity={0.5} />
            ))}
            {outlier ? (
              <circle cx={sx(300)} cy={sy(outlierY)} r={5} fill="#fb7185" stroke="#05080d" strokeWidth="2" />
            ) : null}
            <line
              x1={sx(xDomain[0])}
              y1={sy(data.slope * xDomain[0] + data.intercept)}
              x2={sx(xDomain[1])}
              y2={sy(data.slope * xDomain[1] + data.intercept)}
              stroke="#00d1b2"
              strokeWidth="2"
            />
          </>
        )}
      </PlotFrame>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Metric label="MAE" value={`${formatDecimal(metrics.mae, 3)} K`} />
        <Metric label="MSE" value={formatDecimal(metrics.mse, 3)} />
        <Metric label="RMSE" value={`${formatDecimal(metrics.rmse, 3)} K`} />
        <Metric label="R²" value={formatDecimal(metrics.r2, 4)} />
      </div>

      <div className="grid gap-2 sm:grid-cols-4">
        <Readout label="MAE base" value={`${formatDecimal(baseline.mae, 3)} K`} />
        <Readout label="RMSE base" value={`${formatDecimal(baseline.rmse, 3)} K`} />
        <Readout label="Δ MAE" value={formatDecimal(metrics.mae - baseline.mae, 3)} tone={outlier ? 'warn' : 'default'} />
        <Readout label="Δ RMSE" value={formatDecimal(metrics.rmse - baseline.rmse, 3)} tone={outlier ? 'warn' : 'default'} />
      </div>

      <p className="text-xs leading-5 text-mist">
        MSE y RMSE elevan los errores al cuadrado: un punto extremo pesa mucho más que un error
        pequeño. MAE es más fácil de leer porque queda en kelvin. R² baja cuando el modelo explica
        menos variación.
      </p>
    </LabShell>
  )
}

export function TargetDiagnosticsLab() {
  const failures = AI4I.split.testFailures
  const healthy = AI4I.split.testRows - failures
  const [tp, setTp] = useState(7)
  const [fp, setFp] = useState(4)
  const counts = { tn: healthy - fp, fp, fn: failures - tp, tp }
  const metrics = classificationMetrics(counts)

  return (
    <LabShell>
      <Callout tone="info" title="Balance real de test">
        2.000 filas: <span className="font-mono">{healthy}</span> sanas y{' '}
        <span className="font-mono">{failures}</span> fallas. Movés los aciertos y las falsas alarmas
        y ves qué le pasa a cada métrica.
      </Callout>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <Slider
            label="Fallas detectadas (TP)"
            value={tp}
            min={0}
            max={failures}
            step={1}
            onChange={setTp}
            format={(value) => `${value} de ${failures}`}
          />
          <Slider
            label="Falsas alarmas (FP)"
            value={fp}
            min={0}
            max={120}
            step={1}
            onChange={setFp}
            format={(value) => `${value} de ${healthy}`}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setTp(0)
                setFp(0)
              }}
              className="rounded-full border border-line px-3 py-1.5 text-xs text-mist transition-colors hover:text-foam"
            >
              Modelo vago
            </button>
            <button
              type="button"
              onClick={() => {
                setTp(47)
                setFp(9)
              }}
              className="rounded-full border border-sion/40 bg-sion/10 px-3 py-1.5 text-xs text-sion"
            >
              Árbol tuneado
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-line bg-panel-2/60 p-3 text-center">
            <p className="text-[10px] uppercase tracking-[0.12em] text-mist">TN</p>
            <p className="mt-1 font-mono text-xl font-semibold text-foam">{formatNumber(counts.tn)}</p>
            <p className="text-[10px] text-mist">sanas bien clasificadas</p>
          </div>
          <div className="rounded-xl border border-amber/25 bg-amber/8 p-3 text-center">
            <p className="text-[10px] uppercase tracking-[0.12em] text-amber">FP</p>
            <p className="mt-1 font-mono text-xl font-semibold text-foam">{formatNumber(counts.fp)}</p>
            <p className="text-[10px] text-mist">falsas alarmas</p>
          </div>
          <div className="rounded-xl border border-rose-400/30 bg-rose-400/8 p-3 text-center">
            <p className="text-[10px] uppercase tracking-[0.12em] text-rose-300">FN</p>
            <p className="mt-1 font-mono text-xl font-semibold text-foam">{formatNumber(counts.fn)}</p>
            <p className="text-[10px] text-mist">fallas perdidas</p>
          </div>
          <div className="rounded-xl border border-sion/30 bg-sion/8 p-3 text-center">
            <p className="text-[10px] uppercase tracking-[0.12em] text-sion">TP</p>
            <p className="mt-1 font-mono text-xl font-semibold text-foam">{formatNumber(counts.tp)}</p>
            <p className="text-[10px] text-mist">fallas detectadas</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Metric label="Accuracy" value={formatDecimal(metrics.accuracy, 4)} />
        <Metric label="Precision" value={formatDecimal(metrics.precision, 4)} />
        <Metric label="Recall" value={formatDecimal(metrics.recall, 4)} tone={metrics.recall > 0.5 ? 'good' : 'bad'} />
        <Metric label="F1" value={formatDecimal(metrics.f1, 4)} tone={metrics.f1 > 0.5 ? 'good' : 'warn'} />
      </div>

      <div
        className={cn(
          'rounded-xl border p-3 text-sm leading-6',
          tp === 0 && fp === 0
            ? 'border-amber/30 bg-amber/8 text-foam/85'
            : 'border-line bg-panel-2/50 text-foam/85',
        )}
      >
        {tp === 0 && fp === 0 ? (
          <>
            <span className="font-semibold text-amber">La trampa:</span> con 0 detecciones, la
            accuracy es {formatPercent(metrics.accuracy, 2)} y el recall es 0. El modelo parece
            “bueno” solo porque la mayoría está sana.
          </>
        ) : (
          <>
            Con estas decisiones el modelo detecta {tp}/{failures} fallas y genera {fp} falsas
            alarmas. F1 combina precision y recall; accuracy sola no cuenta la historia.
          </>
        )}
      </div>
    </LabShell>
  )
}

export function LogisticSigmoidLab() {
  const [weight, setWeight] = useState(0.8)
  const [bias, setBias] = useState(-2)
  const [x, setX] = useState(1.5)
  const [threshold, setThreshold] = useState(0.5)
  const z = weight * x + bias
  const probability = sigmoid(z)
  const predicted = probability >= threshold

  const curve = Array.from({ length: 61 }, (_, index) => {
    const pointX = -6 + (index * 12) / 60
    return { x: pointX, y: sigmoid(weight * pointX + bias) }
  })

  return (
    <LabShell>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Slider
          label="Peso w"
          value={weight}
          min={-3}
          max={3}
          step={0.1}
          onChange={setWeight}
          format={(value) => formatDecimal(value, 1)}
        />
        <Slider
          label="Sesgo b"
          value={bias}
          min={-6}
          max={6}
          step={0.1}
          onChange={setBias}
          format={(value) => formatDecimal(value, 1)}
        />
        <Slider
          label="Entrada x"
          value={x}
          min={-3}
          max={3}
          step={0.1}
          onChange={setX}
          format={(value) => formatDecimal(value, 1)}
        />
        <Slider
          label="Umbral"
          value={threshold}
          min={0.05}
          max={0.95}
          step={0.01}
          onChange={setThreshold}
          format={(value) => formatDecimal(value, 2)}
        />
      </div>

      <PlotFrame
        xDomain={[-6, 6]}
        yDomain={[0, 1]}
        xLabel="z = w·x + b"
        yLabel="probabilidad"
        ariaLabel="Curva sigmoide con umbral de decisión"
        formatX={(value) => formatDecimal(value, 0)}
        formatY={(value) => formatDecimal(value, 1)}
      >
        {({ sx, sy }) => (
          <>
            <line
              x1={sx(-6)}
              y1={sy(threshold)}
              x2={sx(6)}
              y2={sy(threshold)}
              stroke="#f2b84b"
              strokeDasharray="6 5"
              strokeWidth="1.5"
            />
            <polyline
              points={curve.map((point) => `${sx(point.x)},${sy(point.y)}`).join(' ')}
              fill="none"
              stroke="#00d1b2"
              strokeWidth="2.5"
            />
            <line x1={sx(x)} y1={sy(0)} x2={sx(x)} y2={sy(probability)} stroke="#8fa6a3" strokeDasharray="3 4" />
            <circle cx={sx(x)} cy={sy(probability)} r={5} fill={predicted ? '#00d1b2' : '#fb7185'} stroke="#05080d" strokeWidth="2" />
          </>
        )}
      </PlotFrame>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Readout label="z" value={formatDecimal(z, 3)} />
        <Readout label="Probabilidad" value={formatDecimal(probability, 4)} tone={predicted ? 'good' : 'warn'} />
        <Readout label="Umbral" value={formatDecimal(threshold, 2)} />
        <Readout label="Clase" value={predicted ? 'FALLA' : 'SANA'} tone={predicted ? 'bad' : 'good'} />
      </div>

      <p className="text-xs leading-5 text-mist">
        La sigmoide nunca sale de [0, 1]. El umbral convierte probabilidad en decisión: bajarlo
        detecta más fallas y también genera más falsas alarmas. No hay un umbral universal: depende
        del costo de cada error.
      </p>
    </LabShell>
  )
}
