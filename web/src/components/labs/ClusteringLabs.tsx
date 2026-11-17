import { useMemo, useState } from 'react'

import { AI4I } from '../../data/ai4i'
import { formatDecimal, formatNumber, formatPercent } from '../../lib/format'
import { inertia, kmeansAssign, kmeansUpdate, type Point } from '../../lib/labMath'
import { BarList, PlotFrame } from '../charts'
import { Callout, Metric, Toggle, cn } from '../ui'
import { LAB_COLORS, LabPanel, LabShell, Legend, Readout } from './shared'

const STEP_POINTS: Point[] = (() => {
  const centers = [
    { x: 2, y: 2 },
    { x: 6.2, y: 2.4 },
    { x: 4.2, y: 6.4 },
  ]
  const offsets = [
    [-0.7, -0.4],
    [-0.4, 0.5],
    [-0.1, -0.6],
    [0.2, 0.3],
    [0.5, -0.2],
    [0.7, 0.6],
    [-0.6, 0.2],
    [0.1, 0.8],
    [0.6, -0.5],
    [-0.2, -0.1],
  ]
  return centers.flatMap((center) =>
    offsets.map(([dx, dy]) => ({ x: center.x + dx, y: center.y + dy })),
  )
})()

const INITIAL_CENTERS: Point[] = [
  { x: 1, y: 1 },
  { x: 7, y: 1.5 },
  { x: 4, y: 7.5 },
]

export function KmeansStepperLab() {
  const [centers, setCenters] = useState<Point[]>(INITIAL_CENTERS)
  const [labels, setLabels] = useState<number[] | null>(null)
  const [phase, setPhase] = useState<'init' | 'assign' | 'update'>('init')
  const cost = labels ? inertia(STEP_POINTS, centers, labels) : null

  const assign = () => {
    setLabels(kmeansAssign(STEP_POINTS, centers))
    setPhase('assign')
  }
  const update = () => {
    if (!labels) return
    setCenters(kmeansUpdate(STEP_POINTS, labels, 3))
    setPhase('update')
  }
  const reset = () => {
    setCenters(INITIAL_CENTERS)
    setLabels(null)
    setPhase('init')
  }

  return (
    <LabShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={assign}
            className="inline-flex min-h-9 items-center rounded-full bg-sion px-3.5 py-1.5 text-xs font-semibold text-ink"
          >
            1 · Asignar puntos
          </button>
          <button
            type="button"
            onClick={update}
            disabled={!labels}
            className="inline-flex min-h-9 items-center rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-foam disabled:cursor-not-allowed disabled:opacity-40"
          >
            2 · Actualizar centroides
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-9 items-center rounded-full border border-line px-3.5 py-1.5 text-xs text-mist transition-colors hover:text-foam"
          >
            Reiniciar
          </button>
        </div>
        <Legend
          items={[
            { label: 'clúster 0', color: 'bg-sion' },
            { label: 'clúster 1', color: 'bg-cyan-400' },
            { label: 'clúster 2', color: 'bg-lime-400' },
            { label: 'centroide', color: 'bg-amber' },
          ]}
        />
      </div>

      <PlotFrame
        xDomain={[0, 8.5]}
        yDomain={[0, 9]}
        xLabel="x"
        yLabel="y"
        height={320}
        ariaLabel="Puntos sintéticos y centroides de K-Means paso a paso"
        formatX={(value) => formatDecimal(value, 1)}
        formatY={(value) => formatDecimal(value, 1)}
      >
        {({ sx, sy }) => (
          <>
            {STEP_POINTS.map((point, index) => {
              const label = labels?.[index]
              const color = label == null ? '#8fa6a3' : LAB_COLORS[label] ?? '#8fa6a3'
              return (
                <circle
                  key={index}
                  cx={sx(point.x)}
                  cy={sy(point.y)}
                  r={4}
                  fill={color}
                  fillOpacity={label == null ? 0.45 : 0.85}
                  stroke="#05080d"
                  strokeWidth="1"
                />
              )
            })}
            {centers.map((center, index) => (
              <g key={`center-${index}`}>
                <path
                  d={`M ${sx(center.x)} ${sy(center.y) - 8} L ${sx(center.x) + 8} ${sy(center.y)} L ${sx(center.x)} ${sy(center.y) + 8} L ${sx(center.x) - 8} ${sy(center.y)} Z`}
                  fill="#f2b84b"
                  stroke="#05080d"
                  strokeWidth="2"
                />
                <text
                  x={sx(center.x)}
                  y={sy(center.y) + 3}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                  fill="#05080d"
                >
                  {index}
                </text>
              </g>
            ))}
          </>
        )}
      </PlotFrame>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Readout label="Etapa" value={phase === 'init' ? 'inicial' : phase === 'assign' ? 'asignación' : 'actualización'} />
        <Readout label="Puntos" value={STEP_POINTS.length} />
        <Readout label="Con etiqueta" value={labels ? labels.length : 0} />
        <Readout label="Inercia" value={cost == null ? '—' : formatDecimal(cost, 2)} tone="warn" />
      </div>

      <Callout tone="info">
        K-Means alterna dos pasos: asigna cada punto al centroide más cercano y recalcula cada
        centroide como el promedio de su grupo. Repetir hasta que los centroides dejen de moverse (o
        se agote el presupuesto). Los puntos son sintéticos para ver el mecanismo.
      </Callout>
    </LabShell>
  )
}

export function KmeansRealLab() {
  const data = AI4I.kmeans
  const [highlight, setHighlight] = useState<number | 'all'>('all')
  const [showCenters, setShowCenters] = useState(true)
  const xs = data.points.map((point) => point.x)
  const ys = data.points.map((point) => point.y)
  const xDomain: [number, number] = [Math.min(...xs) - 40, Math.max(...xs) + 40]
  const yDomain: [number, number] = [0, Math.max(...ys) + 5]
  const rows = useMemo(
    () =>
      data.clusterStats.map((row) => ({
        ...row,
        label: `Clúster ${row.cluster}`,
        value: row.failureRate,
      })),
    [data.clusterStats],
  )

  return (
    <LabShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setHighlight('all')}
            aria-pressed={highlight === 'all'}
            className={cn(
              'min-h-9 rounded-full border px-3 py-1.5 text-xs',
              highlight === 'all' ? 'border-sion bg-sion/10 text-sion' : 'border-line text-mist',
            )}
          >
            Todos
          </button>
          {data.clusterStats.map((row) => (
            <button
              key={row.cluster}
              type="button"
              onClick={() => setHighlight(row.cluster)}
              aria-pressed={highlight === row.cluster}
              className={cn(
                'min-h-9 rounded-full border px-3 py-1.5 text-xs',
                highlight === row.cluster
                  ? 'border-sion bg-sion/10 text-sion'
                  : 'border-line text-mist hover:text-foam',
              )}
            >
              Clúster {row.cluster}
            </button>
          ))}
        </div>
        <Toggle
          checked={showCenters}
          onChange={setShowCenters}
          label="Mostrar centroides"
        />
      </div>

      <PlotFrame
        xDomain={xDomain}
        yDomain={yDomain}
        xLabel={data.xLabel}
        yLabel={data.yLabel}
        height={320}
        ariaLabel="Clústeres operativos de AI4I sobre velocidad y torque"
        formatX={(value) => formatNumber(value)}
        formatY={(value) => formatDecimal(value, 0)}
      >
        {({ sx, sy }) => (
          <>
            {data.points.map((point, index) => {
              const dim = highlight !== 'all' && point.cluster !== highlight
              return (
                <circle
                  key={index}
                  cx={sx(point.x)}
                  cy={sy(point.y)}
                  r={2.6}
                  fill={LAB_COLORS[point.cluster] ?? '#8fa6a3'}
                  fillOpacity={dim ? 0.12 : 0.72}
                />
              )
            })}
            {showCenters
              ? data.centers.map((center) => (
                  <g key={center.cluster}>
                    <circle
                      cx={sx(center.x)}
                      cy={sy(center.y)}
                      r={8}
                      fill="none"
                      stroke={LAB_COLORS[center.cluster]}
                      strokeWidth="2.5"
                    />
                    <circle cx={sx(center.x)} cy={sy(center.y)} r={3} fill={LAB_COLORS[center.cluster]} />
                  </g>
                ))
              : null}
          </>
        )}
      </PlotFrame>

      <div className="grid gap-3 lg:grid-cols-[1fr_0.9fr]">
        <LabPanel title="Tasa de falla por clúster">
          <BarList
            items={rows.map((row) => ({ label: row.label, value: row.value }))}
            format={(value) => formatPercent(value, 2)}
            color="bg-rose-400"
          />
          <p className="mt-2 text-[11px] leading-5 text-mist">
            La tasa más alta es {formatPercent(Math.max(...rows.map((row) => row.value)), 2)}; la
            más baja, {formatPercent(Math.min(...rows.map((row) => row.value)), 2)}. El clúster más
            numeroso no es necesariamente el más riesgoso.
          </p>
        </LabPanel>

        <LabPanel title="Detalle de clústeres">
          <p className="mb-2 text-[11px] leading-5 text-mist">
            El gráfico muestra hasta 100 puntos por clúster (400 de 10.000). Los conteos de la tabla
            son del dataset completo.
          </p>
          <div className="overflow-x-auto" role="region" aria-label="Detalle de clústeres" tabIndex={0}>
            <table className="w-full border-collapse text-left text-[11px]">
              <thead>
                <tr>
                  {['Clúster', 'Filas', 'Fallas', 'Tasa', 'Torque', 'RPM'].map((column) => (
                    <th
                      key={column}
                      className="border-b border-line px-1.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.08em] text-mist"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.clusterStats.map((row) => (
                  <tr key={row.cluster} className="border-b border-line/50">
                    <td className="px-1.5 py-1.5 font-mono text-foam">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: LAB_COLORS[row.cluster] }}
                        />
                        {row.cluster}
                      </span>
                    </td>
                    <td className="px-1.5 py-1.5 font-mono text-mist">{formatNumber(row.count)}</td>
                    <td className="px-1.5 py-1.5 font-mono text-mist">{row.failures}</td>
                    <td className="px-1.5 py-1.5 font-mono text-rose-300">{formatPercent(row.failureRate, 2)}</td>
                    <td className="px-1.5 py-1.5 font-mono text-mist">{formatDecimal(row.meanTorque, 1)}</td>
                    <td className="px-1.5 py-1.5 font-mono text-mist">{formatNumber(row.meanRpm)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </LabPanel>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Metric label="Clústeres" value={data.k} />
        <Metric label="Puntos" value={formatNumber(data.points.length)} />
        <Metric
          label="Mayor tasa"
          value={formatPercent(Math.max(...data.clusterStats.map((row) => row.failureRate)), 2)}
          tone="warn"
        />
        <Metric
          label="Menor tasa"
          value={formatPercent(Math.min(...data.clusterStats.map((row) => row.failureRate)), 2)}
          tone="good"
        />
      </div>
    </LabShell>
  )
}
