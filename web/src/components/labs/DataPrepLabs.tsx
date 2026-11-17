import { useMemo, useState } from 'react'

import { AI4I } from '../../data/ai4i'
import { formatDecimal, formatNumber, formatPercent } from '../../lib/format'
import { mean, median, standardize } from '../../lib/labMath'
import { PlotFrame } from '../charts'
import {
  Callout,
  DataTable,
  Metric,
  Segmented,
  Toggle,
  cn,
} from '../ui'
import { LabPanel, LabShell, Legend, Readout } from './shared'

const SENSORS = [
  'Air temperature [K]',
  'Process temperature [K]',
  'Rotational speed [rpm]',
  'Torque [Nm]',
  'Tool wear [min]',
] as const

const PANDAS_COLUMNS = ['UDI', 'Product ID', 'Type', ...SENSORS, 'Machine failure']
const PANDAS_ROWS = AI4I.sampleRows.slice(0, 6)

function num(value: string | number | null | undefined): number {
  return typeof value === 'number' ? value : Number(value ?? 0)
}

function isNumericCell(value: string): boolean {
  return value.trim() !== '' && Number.isFinite(Number(value.replace(',', '.')))
}

export function PandasInspectorLab() {
  const [separator, setSeparator] = useState<',' | ';'>(',')
  const [decimal, setDecimal] = useState<'.' | ','>('.')
  const columns = PANDAS_COLUMNS
  const rows = PANDAS_ROWS

  const csv = useMemo(() => {
    const encode = (value: string | number | null) => {
      if (typeof value === 'number') return decimal === ',' ? String(value).replace('.', ',') : String(value)
      return String(value ?? '')
    }
    return [columns.join(separator), ...rows.map((row) => columns.map((column) => encode(row[column])).join(separator))].join('\n')
  }, [columns, rows, separator, decimal])

  const parsed = useMemo(() => {
    if (separator !== ';') {
      return {
        columns: ['linea_completa'],
        rows: rows.map((row) => [columns.map((column) => String(row[column] ?? '')).join(';')]),
        numeric: new Set<number>(),
      }
    }
    const numeric = new Set<number>()
    columns.forEach((column, index) => {
      const values = rows.map((row) => String(row[column] ?? ''))
      if (values.every(isNumericCell) && decimal === ',') numeric.add(index)
    })
    return {
      columns,
      rows: rows.map((row) => columns.map((column) => String(row[column] ?? ''))),
      numeric,
    }
  }, [columns, rows, separator, decimal])

  const sensorsNumeric = SENSORS.filter((sensor) =>
    parsed.numeric.has(columns.indexOf(sensor)),
  ).length
  const correct = separator === ';' && decimal === ','

  return (
    <LabShell>
      <Callout tone="info" title="Archivo de práctica">
        El CSV oficial de AI4I usa coma y punto decimal. Este ejercicio simula un export
        alternativo con punto y coma y coma decimal para practicar la detección del formato.
      </Callout>
      <div className="grid gap-3 sm:grid-cols-2">
        <LabPanel title="Separador de columnas">
          <Segmented
            label="Separador"
            value={separator}
            onChange={setSeparator}
            options={[
              { value: ',', label: 'coma  ,' },
              { value: ';', label: 'punto y coma  ;' },
            ]}
          />
        </LabPanel>
        <LabPanel title="Separador decimal">
          <Segmented
            label="Decimal"
            value={decimal}
            onChange={setDecimal}
            options={[
              { value: '.', label: 'punto  .' },
              { value: ',', label: 'coma  ,' },
            ]}
          />
        </LabPanel>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <LabPanel title="CSV crudo (extracto)">
          <pre tabIndex={0} role="region" aria-label="CSV crudo" className="code-scroll max-h-52 rounded-lg border border-line bg-ink/60 p-3 text-[11px] leading-5 text-mist">
            {csv}
          </pre>
        </LabPanel>
        <LabPanel title="Tabla importada">
          <div className="flex flex-wrap items-center gap-2">
            <Metric label="Filas" value={rows.length} />
            <Metric label="Columnas" value={parsed.columns.length} tone={correct ? 'good' : 'bad'} />
            <Metric
              label="Sensores numéricos"
              value={`${sensorsNumeric}/5`}
              tone={sensorsNumeric === 5 ? 'good' : 'bad'}
            />
          </div>
          <div className="mt-2">
            <DataTable
              columns={parsed.columns}
              rows={parsed.rows}
              maxHeight="11rem"
            />
          </div>
        </LabPanel>
      </div>

      <div
        className={cn(
          'rounded-xl border p-3 text-sm leading-6',
          correct
            ? 'border-sion/30 bg-sion/8 text-foam/85'
            : 'border-amber/30 bg-amber/8 text-foam/85',
        )}
      >
        {correct ? (
          <>
            <span className="font-semibold text-sion">Lectura correcta.</span> El archivo usa{' '}
            <span className="font-mono">;</span> y coma decimal: ahora las 9 columnas visibles se separan
            y los cinco sensores se leen como números.
          </>
        ) : (
          <>
            <span className="font-semibold text-amber">Lectura rota.</span> Con estas opciones el
            archivo no se separa como esperás o los números quedan como texto. Corregí el separador y
            el decimal.
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setSeparator(';')
            setDecimal(',')
          }}
          className="inline-flex min-h-9 items-center rounded-full bg-sion px-3.5 py-1.5 text-xs font-semibold text-ink"
        >
          Corregir lectura
        </button>
        <span className="text-xs text-mist">
          En Polars: <span className="font-mono">separator=";"</span> y{' '}
          <span className="font-mono">decimal_comma=True</span>.
        </span>
      </div>
    </LabShell>
  )
}

export function NullsImputationLab() {
  const [strategy, setStrategy] = useState<'mean' | 'median' | 'drop'>('mean')
  const [outlier, setOutlier] = useState(false)
  const columns = ['UDI', 'Air temperature [K]', 'Process temperature [K]', 'Rotational speed [rpm]', 'Torque [Nm]', 'Tool wear [min]', 'Machine failure']
  const rows = AI4I.nullsSample.rows

  const airValues = rows.map((row) => row['Air temperature [K]']).filter((value): value is number => typeof value === 'number')
  const torqueValues = rows.map((row) => row['Torque [Nm]']).filter((value): value is number => typeof value === 'number')
  const airMean = mean(airValues)
  const torqueMean = mean(outlier ? [...torqueValues, 200] : torqueValues)
  const torqueMedian = median(outlier ? [...torqueValues, 200] : torqueValues)

  const sensorStats = Object.fromEntries(
    SENSORS.map((sensor) => {
      const values = rows
        .map((row) => row[sensor])
        .filter((value): value is number => typeof value === 'number')
      return [sensor, { mean: mean(values), median: median(values) }]
    }),
  ) as Record<(typeof SENSORS)[number], { mean: number; median: number }>
  const displayed = rows
    .filter(
      (row) => strategy !== 'drop' || SENSORS.every((sensor) => row[sensor] != null),
    )
    .map((row) =>
      columns.map((column) => {
        const value = row[column]
        if (value == null && column in sensorStats) {
          const stats = sensorStats[column as (typeof SENSORS)[number]]
          return strategy === 'mean' ? stats.mean : stats.median
        }
        return value ?? null
      }),
    )

  return (
    <LabShell>
      <Callout tone="info" title="Nulos didácticos">
        AI4I no trae valores faltantes. Para practicar, este extracto inyecta tres nulos en dos
        sensores. El resto de los números es real.
      </Callout>

      <div className="grid gap-3 lg:grid-cols-[1fr_0.9fr]">
        <LabPanel title="Estrategia de imputación">
          <Segmented
            label="Estrategia"
            value={strategy}
            onChange={setStrategy}
            options={[
              { value: 'mean', label: 'Media' },
              { value: 'median', label: 'Mediana' },
              { value: 'drop', label: 'Descartar fila' },
            ]}
          />
          <div className="mt-3">
            <Toggle
              checked={outlier}
              onChange={setOutlier}
              label="Agregar un torque atípico (200 Nm)"
              hint="Miralo como simulación: un valor extremo mueve la media mucho más que la mediana."
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Readout label="Filas útiles" value={`${displayed.length}/${rows.length}`} />
            <Readout label="Media aire" value={`${formatDecimal(airMean, 2)} K`} />
            <Readout label="Media torque" value={`${formatDecimal(torqueMean, 2)} Nm`} tone={outlier ? 'warn' : 'default'} />
            <Readout label="Mediana torque" value={`${formatDecimal(torqueMedian, 2)} Nm`} />
          </div>
        </LabPanel>

        <LabPanel title="Tabla resultante">
          <DataTable columns={columns} rows={displayed} maxHeight="16rem" />
          <Legend
            items={[
              { label: 'nulo', color: 'bg-rose-400' },
              { label: 'imputado', color: 'bg-sion' },
            ]}
          />
        </LabPanel>
      </div>

      <p className="text-xs leading-5 text-mist">
        {strategy === 'drop'
          ? 'Descartar filas evita inventar valores, pero pierde información. En AI4I real no hay nulos: la decisión es hipotética.'
          : 'La media usa todos los valores y es sensible a extremos; la mediana es más robusta cuando hay outliers.'}
      </p>
    </LabShell>
  )
}

export function FeatureEngineeringLab() {
  const [feature, setFeature] = useState<'temp_diff' | 'power' | 'torque_ratio'>('temp_diff')
  const rows = AI4I.sampleRows.slice(0, 8)

  const derived = (row: Record<string, string | number | null>) => {
    const air = num(row['Air temperature [K]'])
    const process = num(row['Process temperature [K]'])
    const rpm = num(row['Rotational speed [rpm]'])
    const torque = num(row['Torque [Nm]'])
    if (feature === 'temp_diff') return process - air
    if (feature === 'power') return (torque * rpm) / 9549
    return (torque / rpm) * 1000
  }

  const values = rows.map(derived)
  const label =
    feature === 'temp_diff'
      ? 'ΔT = proceso − ambiente [K]'
      : feature === 'power'
        ? 'Potencia ≈ torque × rpm / 9549 [kW]'
        : 'Torque específico = torque / rpm × 1000 [Nm por 1000 rpm]'

  return (
    <LabShell>
      <LabPanel title="Elegí la variable derivada">
        <Segmented
          label="Variable derivada"
          value={feature}
          onChange={setFeature}
          options={[
            { value: 'temp_diff', label: 'ΔT' },
            { value: 'power', label: 'Potencia' },
            { value: 'torque_ratio', label: 'Torque específico' },
          ]}
        />
        <p className="mt-2 font-mono text-[11px] text-sion">{label}</p>
      </LabPanel>

      <div className="grid gap-3 lg:grid-cols-[1fr_0.8fr]">
        <LabPanel title="Extracto con la variable nueva">
          <DataTable
            columns={['UDI', 'Air temperature [K]', 'Process temperature [K]', 'Rotational speed [rpm]', 'Torque [Nm]', 'Derivada']}
            rows={rows.map((row) => [
              row.UDI,
              row['Air temperature [K]'],
              row['Process temperature [K]'],
              row['Rotational speed [rpm]'],
              row['Torque [Nm]'],
              formatDecimal(derived(row), 2),
            ])}
          />
        </LabPanel>
        <LabPanel title="Resumen de la muestra">
          <div className="grid grid-cols-2 gap-2">
            <Readout label="Mínimo" value={formatDecimal(Math.min(...values), 2)} />
            <Readout label="Máximo" value={formatDecimal(Math.max(...values), 2)} />
            <Readout label="Media" value={formatDecimal(mean(values), 2)} />
            <Readout label="Desvío" value={formatDecimal(standardize(values).std, 2)} />
          </div>
          <p className="mt-3 text-xs leading-5 text-mist">
            Una variable derivada resume física del equipo, pero también puede duplicar información.
            En la entrega final se conservaron los cinco sensores originales: esta es una exploración.
          </p>
        </LabPanel>
      </div>
    </LabShell>
  )
}

export function CategoricalEncodingLab() {
  const [encoding, setEncoding] = useState<'label' | 'onehot'>('onehot')
  const types = Object.entries(AI4I.typeStats)
  const codes: Record<string, number> = { L: 0, M: 1, H: 2 }

  return (
    <LabShell>
      <LabPanel title="Codificación de Type">
        <Segmented
          label="Codificación"
          value={encoding}
          onChange={setEncoding}
          options={[
            { value: 'label', label: 'Label Encoding' },
            { value: 'onehot', label: 'One-Hot' },
          ]}
        />
        <p className="mt-2 text-xs leading-5 text-mist">
          {encoding === 'label'
            ? 'Label asigna 0, 1 y 2. El modelo puede interpretar que H está “más lejos” de L que de M, un orden que no existe.'
            : 'One-Hot crea un indicador por categoría. Ninguna categoría queda “arriba” de otra.'}
        </p>
      </LabPanel>

      <div className="grid gap-3 lg:grid-cols-[1fr_0.8fr]">
        <LabPanel title="Vista del modelo">
          <div className="space-y-2">
            {types.map(([type, stats]) => (
              <div key={type} className="rounded-lg border border-line bg-ink/40 p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-semibold text-foam">{type}</span>
                  <span className="font-mono text-[11px] text-mist">
                    {formatNumber(stats.count)} filas · {formatPercent(stats.failureRate, 2)} fallas
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {encoding === 'label' ? (
                    <span className="rounded border border-sion/30 bg-sion/10 px-2 py-0.5 font-mono text-[11px] text-sion">
                      code={codes[type]}
                    </span>
                  ) : (
                    ['H', 'L', 'M'].map((candidate) => (
                      <span
                        key={candidate}
                        className={cn(
                          'rounded border px-2 py-0.5 font-mono text-[11px]',
                          candidate === type
                            ? 'border-sion/40 bg-sion/10 text-sion'
                            : 'border-line text-mist',
                        )}
                      >
                        Type_{candidate}={candidate === type ? 1 : 0}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </LabPanel>

        <LabPanel title="Qué ve el modelo">
          <div className="rounded-lg border border-line bg-ink/50 p-3 font-mono text-xs text-foam/85">
            <p className="text-mist"># Type = M</p>
            {encoding === 'label' ? (
              <p className="mt-1 text-sion">[0, 1, 0, ...sensores]</p>
            ) : (
              <p className="mt-1 text-sion">[0, 0, 1, 0, 0, ...sensores]</p>
            )}
          </div>
          <div className="mt-3 space-y-2 text-xs leading-5 text-mist">
            <p>
              Con Label, la distancia entre L y H es 2 y entre L y M es 1. El modelo puede usar esa
              magnitud sin que sea real.
            </p>
            <p>Con One-Hot, cada categoría tiene su propio peso.</p>
            <p className="text-foam/80">El encoder se ajusta solo con train.</p>
          </div>
        </LabPanel>
      </div>
    </LabShell>
  )
}

export function FeatureScalingLab() {
  const [mode, setMode] = useState<'raw' | 'minmax' | 'zscore'>('raw')
  const points = AI4I.knn.points
  const xs = points.map((point) => point.x)
  const ys = points.map((point) => point.y)
  const xStats = standardize(xs)
  const yStats = standardize(ys)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  const transformed = points.map((point) => {
    if (mode === 'raw') return point
    if (mode === 'minmax') {
      return {
        x: (point.x - minX) / (maxX - minX || 1),
        y: (point.y - minY) / (maxY - minY || 1),
      }
    }
    return {
      x: xStats.std === 0 ? 0 : (point.x - xStats.mean) / xStats.std,
      y: yStats.std === 0 ? 0 : (point.y - yStats.mean) / yStats.std,
    }
  })

  const domain = (values: number[]): [number, number] => {
    const min = Math.min(...values)
    const max = Math.max(...values)
    const padding = (max - min || 1) * 0.08
    return [min - padding, max + padding]
  }

  return (
    <LabShell>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <Segmented
          label="Escala"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'raw', label: 'Original' },
            { value: 'minmax', label: 'Min-Max [0,1]' },
            { value: 'zscore', label: 'Z-score' },
          ]}
        />
        <Legend
          items={[
            { label: 'sana', color: 'bg-mist' },
            { label: 'falla', color: 'bg-rose-400' },
          ]}
        />
      </div>

      <PlotFrame
        xDomain={domain(transformed.map((point) => point.x))}
        yDomain={domain(transformed.map((point) => point.y))}
        xLabel={mode === 'raw' ? 'ΔT proceso − ambiente [K]' : 'ΔT transformado'}
        yLabel={mode === 'raw' ? 'Torque [Nm]' : 'Torque transformado'}
        ariaLabel="Nube de puntos de sensores con la escala elegida"
        formatX={(value) => formatDecimal(value, 2)}
        formatY={(value) => formatDecimal(value, 1)}
      >
        {({ sx, sy }) =>
          transformed.map((point, index) => (
            <circle
              key={index}
              cx={sx(point.x)}
              cy={sy(point.y)}
              r={points[index].label === 1 ? 3.2 : 2.2}
              fill={points[index].label === 1 ? '#fb7185' : '#8fa6a3'}
              fillOpacity={points[index].label === 1 ? 0.9 : 0.55}
            />
          ))
        }
      </PlotFrame>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Readout label="Media ΔT" value={formatDecimal(mode === 'raw' ? xStats.mean : mode === 'zscore' ? 0 : (xStats.mean - minX) / (maxX - minX || 1), 2)} />
        <Readout label="Desvío ΔT" value={formatDecimal(mode === 'zscore' ? 1 : xStats.std, 2)} />
        <Readout label="Media torque" value={formatDecimal(mode === 'raw' ? yStats.mean : mode === 'zscore' ? 0 : (yStats.mean - minY) / (maxY - minY || 1), 2)} />
        <Readout label="Desvío torque" value={formatDecimal(mode === 'zscore' ? 1 : yStats.std, 2)} />
      </div>

      <p className="text-xs leading-5 text-mist">
        Cambiar la escala no cambia la forma de la nube, pero sí las distancias numéricas. En KNN,
        eso cambia qué vecinos ganan. La estandarización usa media y desvío: ajustalos solo con train.
      </p>
    </LabShell>
  )
}

const LEAKAGE_COLUMNS = ['TWF', 'HDF', 'PWF', 'OSF', 'RNF'] as const

export function TrainTestLeakageLab() {
  const [selected, setSelected] = useState<string[]>([
    'Type',
    'Air temperature [K]',
    'Process temperature [K]',
    'Rotational speed [rpm]',
    'Torque [Nm]',
    'Tool wear [min]',
  ])

  const toggle = (column: string) => {
    setSelected((current) =>
      current.includes(column) ? current.filter((entry) => entry !== column) : [...current, column],
    )
  }

  const leakage = selected.filter((column) => LEAKAGE_COLUMNS.includes(column as (typeof LEAKAGE_COLUMNS)[number]))
  const identifiers = selected.filter((column) => column === 'UDI' || column === 'Product ID')
  const predictors = selected.filter(
    (column) => !LEAKAGE_COLUMNS.includes(column as (typeof LEAKAGE_COLUMNS)[number]) && column !== 'UDI' && column !== 'Product ID',
  )
  const status =
    leakage.length > 0 ? 'leakage' : identifiers.length > 0 ? 'ids' : predictors.length >= 2 ? 'ok' : 'empty'

  return (
    <LabShell>
      <LabPanel title="Elegí las columnas del modelo">
        <div className="grid gap-2 sm:grid-cols-2">
          {['Type', ...SENSORS, 'UDI', 'Product ID', ...LEAKAGE_COLUMNS].map((column) => (
            <Toggle
              key={column}
              checked={selected.includes(column)}
              onChange={() => toggle(column)}
              label={column}
              hint={
                LEAKAGE_COLUMNS.includes(column as (typeof LEAKAGE_COLUMNS)[number])
                  ? 'Modo de falla: revela el target'
                  : column === 'UDI' || column === 'Product ID'
                    ? 'Identificador: no es predictor'
                    : undefined
              }
            />
          ))}
        </div>
      </LabPanel>

      <div className="grid gap-2 sm:grid-cols-4">
        <Readout label="Predictores" value={predictors.length} tone={predictors.length > 0 ? 'good' : 'bad'} />
        <Readout label="Identificadores" value={identifiers.length} tone={identifiers.length > 0 ? 'warn' : 'default'} />
        <Readout label="Modos de falla" value={leakage.length} tone={leakage.length > 0 ? 'bad' : 'default'} />
        <Readout label="Filas test" value={formatNumber(AI4I.split.testRows)} />
      </div>

      <div
        className={cn(
          'rounded-xl border p-3.5 text-sm leading-6',
          status === 'ok' && 'border-sion/30 bg-sion/8 text-foam/85',
          status === 'leakage' && 'border-rose-400/40 bg-rose-400/10 text-foam/85',
          status === 'ids' && 'border-amber/30 bg-amber/8 text-foam/85',
          status === 'empty' && 'border-line bg-panel-2/50 text-foam/85',
        )}
      >
        {status === 'leakage' ? (
          <>
            <p className="font-semibold text-rose-300">Fuga de información.</p>
            <p className="mt-1">
              {leakage.join(', ')} describe el resultado. Si entra al modelo, el F1 se infla y la
              evaluación deja de ser honesta. Excluilas.
            </p>
          </>
        ) : status === 'ids' ? (
          <>
            <p className="font-semibold text-amber">Identificadores seleccionados.</p>
            <p className="mt-1">UDI y Product ID no describen la máquina; agregan ruido y riesgo de memorizar.</p>
          </>
        ) : status === 'ok' ? (
          <>
            <p className="font-semibold text-sion">Selección válida.</p>
            <p className="mt-1">
              {predictors.length} predictores: {predictors.slice(0, 3).join(', ')}
              {predictors.length > 3 ? ` y ${predictors.length - 3} más` : ''}. El split real es 8000/2000
              con 68 fallas en test.
            </p>
          </>
        ) : (
          <>
            <p className="font-semibold text-foam">Sin predictores suficientes.</p>
            <p className="mt-1">Elegí al menos dos sensores o Type para entrenar un modelo con sentido.</p>
          </>
        )}
      </div>

      <Callout tone="tip">
        El orden correcto: split → ajustar encoding/escalado con train → transformar test → entrenar.
        Si el scaler ve test, hay fuga.
      </Callout>
    </LabShell>
  )
}
