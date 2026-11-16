import { useState } from 'react'

import { AI4I } from '../../data/ai4i'
import { formatDecimal, formatNumber, formatPercent } from '../../lib/format'
import { knnQuery } from '../../lib/labMath'
import { BarList, PlotFrame } from '../charts'
import { Callout, Slider, cn } from '../ui'
import { LabPanel, LabShell, Legend, Readout } from './shared'

const KNN_X_DOMAIN: [number, number] = [7.3, 12.3]
const KNN_Y_DOMAIN: [number, number] = [0, 82]

function pointColor(label: number): string {
  return label === 1 ? '#fb7185' : '#8fa6a3'
}

export function KnnCanvasLab() {
  const points = AI4I.knn.points
  const [k, setK] = useState(7)
  const [query, setQuery] = useState({ x: 9.5, y: 42 })
  const result = knnQuery(points, query, k, 'raw')

  return (
    <LabShell>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="w-full max-w-xs">
          <Slider
            label="Vecinos k"
            value={k}
            min={1}
            max={15}
            step={1}
            onChange={setK}
            format={(value) => `${value} vecinos`}
          />
        </div>
        <Legend
          items={[
            { label: 'sana', color: 'bg-mist' },
            { label: 'falla', color: 'bg-rose-400' },
            { label: 'vecino', color: 'bg-sion' },
            { label: 'consulta', color: 'bg-amber' },
          ]}
        />
      </div>

      <PlotFrame
        xDomain={KNN_X_DOMAIN}
        yDomain={KNN_Y_DOMAIN}
        xLabel={AI4I.knn.xLabel}
        yLabel={AI4I.knn.yLabel}
        height={320}
        ariaLabel="Lienzo KNN con consulta y vecinos; hacé clic para mover la consulta"
        formatX={(value) => formatDecimal(value, 1)}
        formatY={(value) => formatDecimal(value, 0)}
      >
        {({ sx, sy, left, top, innerWidth, innerHeight }) => (
          <>
            {result.neighbors.map((neighbor, index) => (
              <line
                key={`line-${index}`}
                x1={sx(query.x)}
                y1={sy(query.y)}
                x2={sx(neighbor.x)}
                y2={sy(neighbor.y)}
                stroke="#00d1b2"
                strokeOpacity={0.45}
                strokeDasharray="3 3"
              />
            ))}
            {points.map((point, index) => {
              const isNeighbor = result.neighbors.some(
                (neighbor) => neighbor.x === point.x && neighbor.y === point.y,
              )
              return (
                <circle
                  key={index}
                  cx={sx(point.x)}
                  cy={sy(point.y)}
                  r={isNeighbor ? 4.5 : point.label === 1 ? 3 : 2.2}
                  fill={isNeighbor ? '#00d1b2' : pointColor(point.label)}
                  fillOpacity={isNeighbor ? 0.95 : point.label === 1 ? 0.85 : 0.5}
                  stroke={isNeighbor ? '#05080d' : 'none'}
                  strokeWidth={isNeighbor ? 1.5 : 0}
                />
              )
            })}
            <circle
              cx={sx(query.x)}
              cy={sy(query.y)}
              r={6}
              fill="#f2b84b"
              stroke="#05080d"
              strokeWidth="2"
            />
            <rect
              x={left}
              y={top}
              width={innerWidth}
              height={innerHeight}
              fill="transparent"
              style={{ cursor: 'crosshair' }}
              onPointerDown={(event) => {
                const svg = event.currentTarget.ownerSVGElement
                if (!svg) return
                const rect = svg.getBoundingClientRect()
                const svgX = ((event.clientX - rect.left) / rect.width) * 640
                const svgY = ((event.clientY - rect.top) / rect.height) * 320
                const dataX = KNN_X_DOMAIN[0] + ((svgX - left) / innerWidth) * (KNN_X_DOMAIN[1] - KNN_X_DOMAIN[0])
                const dataY = KNN_Y_DOMAIN[1] - ((svgY - top) / innerHeight) * (KNN_Y_DOMAIN[1] - KNN_Y_DOMAIN[0])
                setQuery({
                  x: Math.min(KNN_X_DOMAIN[1], Math.max(KNN_X_DOMAIN[0], dataX)),
                  y: Math.min(KNN_Y_DOMAIN[1], Math.max(KNN_Y_DOMAIN[0], dataY)),
                })
              }}
            />
          </>
        )}
      </PlotFrame>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Readout label="Consulta ΔT" value={`${formatDecimal(query.x, 2)} K`} />
        <Readout label="Consulta torque" value={`${formatDecimal(query.y, 1)} Nm`} />
        <Readout label="Votos sanas" value={result.votes[0] ?? 0} />
        <Readout label="Votos fallas" value={result.votes[1] ?? 0} tone={(result.votes[1] ?? 0) > 0 ? 'warn' : 'default'} />
      </div>

      <div
        className={cn(
          'rounded-xl border p-3 text-sm leading-6',
          result.label === 1 ? 'border-rose-400/35 bg-rose-400/10 text-foam/85' : 'border-sion/30 bg-sion/8 text-foam/85',
        )}
      >
        <span className={cn('font-semibold', result.label === 1 ? 'text-rose-300' : 'text-sion')}>
          Predicción: {result.label === 1 ? 'FALLA' : 'SANA'}.
        </span>{' '}
        Con k={k}, la mayoría de los {result.neighbors.length} vecinos votó por{' '}
        {result.label === 1 ? 'falla' : 'sana'}. Hacé clic en el lienzo para mover la consulta.
      </div>

      <p className="text-xs leading-5 text-mist">
        Las muestras están balanceadas para enseñar (80 fallas y 120 sanas), no representan la
        proporción real de AI4I. El punto real de consulta se clasificaría con el modelo entrenado,
        no con este lienzo.
      </p>
    </LabShell>
  )
}

export function KnnScalingLab() {
  const points = AI4I.knn.points
  const [mode, setMode] = useState<'raw' | 'zscore'>('raw')
  const [k, setK] = useState(5)
  const query = { x: 9.5, y: 42 }
  const result = knnQuery(points, query, k, mode)

  return (
    <LabShell>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="w-full max-w-xs">
          <Slider
            label="Vecinos k"
            value={k}
            min={1}
            max={15}
            step={1}
            onChange={setK}
            format={(value) => `${value} vecinos`}
          />
        </div>
        <div className="flex gap-1 rounded-xl border border-line bg-panel-2/70 p-1" role="group" aria-label="Escala">
          {[
            { value: 'raw' as const, label: 'Sin escalar' },
            { value: 'zscore' as const, label: 'Z-score' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMode(option.value)}
              aria-pressed={mode === option.value}
              className={cn(
                'min-h-9 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                mode === option.value ? 'bg-sion text-ink' : 'text-mist hover:text-foam',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <PlotFrame
        xDomain={KNN_X_DOMAIN}
        yDomain={KNN_Y_DOMAIN}
        xLabel={AI4I.knn.xLabel}
        yLabel={AI4I.knn.yLabel}
        height={300}
        ariaLabel="Vecinos KNN con y sin escalado"
        formatX={(value) => formatDecimal(value, 1)}
        formatY={(value) => formatDecimal(value, 0)}
      >
        {({ sx, sy }) => (
          <>
            {result.neighbors.map((neighbor, index) => (
              <line
                key={`line-${index}`}
                x1={sx(query.x)}
                y1={sy(query.y)}
                x2={sx(neighbor.x)}
                y2={sy(neighbor.y)}
                stroke="#00d1b2"
                strokeOpacity={0.5}
                strokeDasharray="3 3"
              />
            ))}
            {points.map((point, index) => {
              const isNeighbor = result.neighbors.some(
                (neighbor) => neighbor.x === point.x && neighbor.y === point.y,
              )
              return (
                <circle
                  key={index}
                  cx={sx(point.x)}
                  cy={sy(point.y)}
                  r={isNeighbor ? 4.5 : point.label === 1 ? 3 : 2.2}
                  fill={isNeighbor ? '#00d1b2' : pointColor(point.label)}
                  fillOpacity={isNeighbor ? 0.95 : 0.5}
                />
              )
            })}
            <circle cx={sx(query.x)} cy={sy(query.y)} r={6} fill="#f2b84b" stroke="#05080d" strokeWidth="2" />
          </>
        )}
      </PlotFrame>

      <div className="grid gap-3 md:grid-cols-[1fr_0.9fr]">
        <LabPanel title={`Vecinos más cercanos (${mode === 'raw' ? 'sin escalar' : 'z-score'})`}>
          <div className="space-y-1.5">
            {result.neighbors.slice(0, 5).map((neighbor, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-line bg-ink/40 px-2.5 py-1.5 text-xs"
              >
                <span className="font-mono text-mist">
                  {index + 1}. ΔT {formatDecimal(neighbor.x, 2)} · T {formatDecimal(neighbor.y, 1)}
                </span>
                <span className={cn('font-mono', neighbor.label === 1 ? 'text-rose-300' : 'text-mist')}>
                  {neighbor.label === 1 ? 'falla' : 'sana'} · d {formatDecimal(neighbor.distance, 2)}
                </span>
              </div>
            ))}
          </div>
        </LabPanel>
        <LabPanel title="Predicción">
          <p className="font-display text-xl font-semibold text-foam">
            {result.label === 1 ? 'FALLA' : 'SANA'}
          </p>
          <p className="mt-1 text-xs leading-5 text-mist">
            {mode === 'raw'
              ? 'El torque tiene un rango de ~73 Nm y ΔT de 7,6 a 12,0 K. Sin escalar, el torque domina la distancia.'
              : 'Con z-score, cada variable aporta en unidades de desvío. Los vecinos pueden cambiar.'}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Readout label="Votos sanas" value={result.votes[0] ?? 0} />
            <Readout label="Votos fallas" value={result.votes[1] ?? 0} tone={(result.votes[1] ?? 0) > 0 ? 'warn' : 'default'} />
          </div>
        </LabPanel>
      </div>
    </LabShell>
  )
}

export function DecisionTreeDepthLab() {
  const curve = AI4I.depthCurve
  const [depth, setDepth] = useState(8)
  const row = curve.find((entry) => entry.depth === depth) ?? curve[0]
  const best = curve.reduce((top, entry) => (entry.testF1 > top.testF1 ? entry : top), curve[0])
  const gap = row.trainF1 - row.testF1

  return (
    <LabShell>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="w-full max-w-md">
          <Slider
            label="Profundidad máxima"
            value={depth}
            min={1}
            max={12}
            step={1}
            onChange={setDepth}
            format={(value) => `depth=${value}`}
            hint="La curva se calculó sobre la matriz codificada con min_samples_leaf=1; el modelo tuneado usa leaf=3."
          />
        </div>
        <Legend
          items={[
            { label: 'train', color: 'bg-sion' },
            { label: 'test', color: 'bg-amber' },
            { label: 'elegido', color: 'bg-cyan-400' },
          ]}
        />
      </div>

      <PlotFrame
        xDomain={[1, 12]}
        yDomain={[0, 1]}
        xLabel="max_depth"
        yLabel="F1"
        height={300}
        ariaLabel="Curvas de F1 de train y test según la profundidad del árbol"
        formatX={(value) => formatDecimal(value, 0)}
        formatY={(value) => formatDecimal(value, 1)}
      >
        {({ sx, sy }) => (
          <>
            <polyline
              points={curve.map((entry) => `${sx(entry.depth)},${sy(entry.trainF1)}`).join(' ')}
              fill="none"
              stroke="#00d1b2"
              strokeWidth="2.5"
            />
            <polyline
              points={curve.map((entry) => `${sx(entry.depth)},${sy(entry.testF1)}`).join(' ')}
              fill="none"
              stroke="#f2b84b"
              strokeWidth="2.5"
            />
            <line x1={sx(depth)} y1={sy(0)} x2={sx(depth)} y2={sy(1)} stroke="#38bdf8" strokeDasharray="3 4" />
            <circle cx={sx(depth)} cy={sy(row.trainF1)} r={4} fill="#00d1b2" stroke="#05080d" strokeWidth="2" />
            <circle cx={sx(depth)} cy={sy(row.testF1)} r={4} fill="#f2b84b" stroke="#05080d" strokeWidth="2" />
            <circle cx={sx(best.depth)} cy={sy(best.testF1)} r={5} fill="none" stroke="#e6f1f0" strokeWidth="1.5" />
          </>
        )}
      </PlotFrame>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Readout label="F1 train" value={formatDecimal(row.trainF1, 4)} />
        <Readout label="F1 test" value={formatDecimal(row.testF1, 4)} tone={row.testF1 > 0.7 ? 'good' : 'warn'} />
        <Readout label="Brecha" value={formatDecimal(gap, 4)} tone={gap > 0.2 ? 'bad' : gap > 0.1 ? 'warn' : 'good'} />
        <Readout label="Mejor test" value={`depth ${best.depth}`} tone="good" />
      </div>

      <Callout tone={gap > 0.2 ? 'warn' : 'tip'} title="Leé la brecha">
        A depth={depth}, el árbol logra F1 {formatDecimal(row.trainF1, 3)} en train y{' '}
        {formatDecimal(row.testF1, 3)} en test. La diferencia de {formatDecimal(gap, 3)} es la señal
        de sobreajuste. El proyecto eligió depth 8 con min_samples_leaf=3 y obtuvo F1 0,7581 en
        test, no el máximo de esta curva.
      </Callout>
    </LabShell>
  )
}

export function RandomForestEnsembleLab() {
  const importances = AI4I.featureImportance
  const [onlySensors, setOnlySensors] = useState(false)
  const [selected, setSelected] = useState(importances[0]?.name ?? '')
  const visible = onlySensors ? importances.filter((row) => !row.name.startsWith('Type_')) : importances
  const variable = importances.find((row) => row.name === selected) ?? importances[0]
  const sensorMeans = AI4I.target.sensorMeans[variable?.name ?? '']
  const typeKey = variable?.name.startsWith('Type_') ? variable.name.slice(5) : null
  const typeStats = typeKey ? AI4I.typeStats[typeKey] : null

  return (
    <LabShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-foam">
          <input
            type="checkbox"
            checked={onlySensors}
            onChange={(event) => setOnlySensors(event.target.checked)}
            className="size-4 accent-sion"
          />
          Mostrar solo sensores
        </label>
        <span className="font-mono text-[11px] text-mist">Random Forest baseline · F1 0,6286</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <LabPanel title="Importancia de variables">
          <BarList
            items={visible.map((row) => ({
              label: row.name,
              value: row.importance,
            }))}
            format={(value) => formatPercent(value, 1)}
          />
          <div className="mt-3 flex flex-wrap gap-1.5">
            {visible.map((row) => (
              <button
                key={row.name}
                type="button"
                onClick={() => setSelected(row.name)}
                aria-pressed={selected === row.name}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-[11px] transition-colors',
                  selected === row.name
                    ? 'border-sion bg-sion/10 text-sion'
                    : 'border-line text-mist hover:text-foam',
                )}
              >
                {row.name}
              </button>
            ))}
          </div>
        </LabPanel>

        <LabPanel title="Qué aporta cada variable">
          <p className="font-display text-lg font-semibold text-foam">{variable?.name}</p>
          <p className="mt-1 font-mono text-sm text-sion">
            importancia {formatPercent(variable?.importance ?? 0, 1)}
          </p>

          {sensorMeans ? (
            <div className="mt-3 space-y-2">
              <Readout label="Media en sanas" value={formatDecimal(sensorMeans.healthy, 2)} />
              <Readout label="Media en fallas" value={formatDecimal(sensorMeans.failure, 2)} tone="warn" />
              <p className="text-xs leading-5 text-mist">
                La diferencia de medias sugiere una asociación, no causalidad. El bosque usa la
                variable junto con las demás, en particiones no lineales.
              </p>
            </div>
          ) : typeStats ? (
            <div className="mt-3 space-y-2">
              <Readout label="Filas" value={formatNumber(typeStats.count)} />
              <Readout label="Fallas" value={formatNumber(typeStats.failures)} />
              <Readout label="Tasa" value={formatPercent(typeStats.failureRate, 2)} tone="warn" />
              <p className="text-xs leading-5 text-mist">
                Las tres categorías de Type están codificadas como indicadores. Una importancia baja
                no prueba que Type sea irrelevante: puede estar correlacionada con sensores.
              </p>
            </div>
          ) : null}

          <div className="mt-3 rounded-lg border border-line bg-ink/40 p-2.5 text-[11px] leading-5 text-mist">
            Orden completo: {importances.map((row) => row.name).join(' · ')}.
          </div>
        </LabPanel>
      </div>

      <Callout tone="info">
        El Random Forest reduce la varianza promediando árboles, pero pierde la lectura directa de
        reglas. Su F1 (0,6286) quedó debajo del árbol tuneado (0,7581); su ROC-AUC (0,9653) fue
        mejor. La comparación completa está en el día 23.
      </Callout>
    </LabShell>
  )
}
