import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, CheckCircle2, Circle, Star } from 'lucide-react'

import { AI4I } from '../../data/ai4i'
import { formatDecimal } from '../../lib/format'
import { Callout, Metric, Segmented, cn } from '../ui'
import { LabPanel, LabShell, Readout } from './shared'

const CHECKLIST = [
  {
    id: 'dataset',
    title: '1 · Dataset elegido y documentado',
    detail: 'Fuente, licencia, cita y justificación del encuadre. AI4I 2020, UCI id 601, CC BY 4.0.',
  },
  {
    id: 'eda',
    title: '2 · Análisis exploratorio',
    detail: 'Dimensiones, tipos, nulos, estadísticas, correlaciones y balance del target (339 fallas).',
  },
  {
    id: 'clean',
    title: '3 · Limpieza',
    detail: 'Duplicados, faltantes y outliers reportados. En AI4I: 0 duplicados, 0 faltantes, 459 outliers retenidos.',
  },
  {
    id: 'features',
    title: '4 · Transformaciones',
    detail: 'One-Hot para Type, escalado de sensores y variables derivadas evaluadas con criterio.',
  },
  {
    id: 'select',
    title: '5 · Selección de variables',
    detail: 'Excluir UDI, Product ID y los modos de falla TWF/HDF/PWF/OSF/RNF por leakage.',
  },
  {
    id: 'split',
    title: '6 · Split train/test',
    detail: '8000/2000 estratificado, semilla 42, con 271 y 68 fallas respectivamente.',
  },
] as const

export function PreEntregaChecklistLab() {
  const [checked, setChecked] = useState<string[]>([])

  const toggle = (id: string) => {
    setChecked((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    )
  }

  return (
    <LabShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-sion">
            {checked.length}/{CHECKLIST.length} secciones
          </p>
          <p className="text-sm text-mist">Marcá lo que ya está resuelto y documentado.</p>
        </div>
        <button
          type="button"
          onClick={() =>
            setChecked(checked.length === CHECKLIST.length ? [] : CHECKLIST.map((item) => item.id))
          }
          className="inline-flex min-h-9 items-center rounded-full border border-line px-3.5 py-1.5 text-xs text-mist transition-colors hover:border-sion/40 hover:text-foam"
        >
          {checked.length === CHECKLIST.length ? 'Desmarcar todo' : 'Marcar todo'}
        </button>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sion-deep to-sion transition-[width] duration-500"
          style={{ width: `${(checked.length / CHECKLIST.length) * 100}%` }}
        />
      </div>

      <div className="space-y-2">
        {CHECKLIST.map((item) => {
          const active = checked.includes(item.id)
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              className={cn(
                'flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors',
                active
                  ? 'border-sion/40 bg-sion/[0.07]'
                  : 'border-line bg-panel-2/40 hover:border-sion/30',
              )}
              aria-pressed={active}
            >
              <span className="mt-0.5 shrink-0 text-sion">
                {active ? (
                  <CheckCircle2 className="size-5" aria-hidden="true" />
                ) : (
                  <Circle className="size-5 text-mist" aria-hidden="true" />
                )}
              </span>
              <span>
                <span className="block text-sm font-medium text-foam">{item.title}</span>
                <span className="mt-0.5 block text-xs leading-5 text-mist">{item.detail}</span>
              </span>
            </button>
          )
        })}
      </div>

      {checked.length === CHECKLIST.length ? (
        <Callout tone="tip" title="Pre-Entrega lista">
          Las seis secciones están cubiertas. El repositorio las respalda con módulos y tests; el
          notebook se regenera con <span className="font-mono">uv run python -m agrofail.report</span>.
        </Callout>
      ) : (
        <p className="text-xs leading-5 text-mist">
          Faltan {CHECKLIST.length - checked.length} secciones. El notebook de Pre-Entrega está
          enlazado abajo del laboratorio.
        </p>
      )}
    </LabShell>
  )
}

const PIPELINE_STEPS = [
  { id: 'load', label: 'Cargar AI4I' },
  { id: 'split', label: 'Separar train/test' },
  { id: 'encode', label: 'One-Hot(Type)' },
  { id: 'scale', label: 'Estandarizar sensores' },
  { id: 'model', label: 'Entrenar modelo' },
  { id: 'evaluate', label: 'Evaluar en test' },
] as const

type StepId = (typeof PIPELINE_STEPS)[number]['id']

function validatePipeline(order: StepId[]): Record<StepId, boolean> {
  const index = (id: StepId) => order.indexOf(id)
  const loadFirst = index('load') === 0
  const evaluateLast = index('evaluate') === order.length - 1
  const splitBeforeFit =
    index('split') < index('encode') &&
    index('split') < index('scale') &&
    index('split') < index('model')
  const fitBeforeModel = index('encode') < index('model') && index('scale') < index('model')
  return {
    load: loadFirst,
    split: splitBeforeFit,
    encode: fitBeforeModel,
    scale: fitBeforeModel,
    model: fitBeforeModel && splitBeforeFit,
    evaluate: evaluateLast,
  }
}

export function SklearnPipelineLab() {
  const [order, setOrder] = useState<StepId[]>(PIPELINE_STEPS.map((step) => step.id))
  const status = validatePipeline(order)
  const valid = Object.values(status).every(Boolean)

  const move = (index: number, direction: -1 | 1) => {
    const next = [...order]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setOrder(next)
  }

  return (
    <LabShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-mist">
          Ordená los pasos. El pipeline tiene que cargar, separar, ajustar preprocessing y recién
          después modelar y evaluar.
        </p>
        <button
          type="button"
          onClick={() => setOrder(PIPELINE_STEPS.map((step) => step.id))}
          className="inline-flex min-h-9 items-center rounded-full border border-line px-3.5 py-1.5 text-xs text-mist transition-colors hover:border-sion/40 hover:text-foam"
        >
          Reiniciar orden
        </button>
      </div>

      <div className="space-y-2">
        {order.map((id, index) => {
          const step = PIPELINE_STEPS.find((entry) => entry.id === id)!
          const ok = status[id]
          return (
            <div
              key={id}
              className={cn(
                'flex items-center gap-3 rounded-xl border p-2.5',
                ok ? 'border-line bg-panel-2/40' : 'border-rose-400/35 bg-rose-400/[0.06]',
              )}
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-ink/50 font-mono text-[11px] text-mist">
                {index + 1}
              </span>
              <span className="flex-1 text-sm text-foam">{step.label}</span>
              <span className={cn('font-mono text-[10px]', ok ? 'text-sion' : 'text-rose-300')}>
                {ok ? 'ok' : 'revisar'}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="grid size-8 place-items-center rounded-md border border-line text-mist disabled:opacity-30"
                  aria-label={`Subir ${step.label}`}
                >
                  <ArrowUp className="size-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === order.length - 1}
                  className="grid size-8 place-items-center rounded-md border border-line text-mist disabled:opacity-30"
                  aria-label={`Bajar ${step.label}`}
                >
                  <ArrowDown className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div
        className={cn(
          'rounded-xl border p-3 text-sm leading-6',
          valid ? 'border-sion/30 bg-sion/8 text-foam/85' : 'border-amber/30 bg-amber/8 text-foam/85',
        )}
      >
        {valid ? (
          <>
            <span className="font-semibold text-sion">Pipeline válido.</span> GridSearchCV puede
            reajustar todo dentro de cada fold sin ver las filas de validación.
          </>
        ) : (
          <>
            <span className="font-semibold text-amber">Todavía hay fuga potencial.</span> Cargar
            primero, separar antes de ajustar encoding/escalado, modelar después y evaluar al final.
          </>
        )}
      </div>

      <Callout tone="info">
        En scikit-learn, <span className="font-mono">ColumnTransformer</span> aplica una receta por
        columna y <span className="font-mono">Pipeline</span> encadena preprocessing y modelo. El
        pipeline completo es lo que se serializa y lo que se reajusta en cada fold.
      </Callout>
    </LabShell>
  )
}

function heatColor(value: number, min: number, max: number): string {
  const ratio = max === min ? 0 : (value - min) / (max - min)
  const low = { r: 16, g: 26, b: 34 }
  const high = { r: 0, g: 209, b: 178 }
  const r = Math.round(low.r + (high.r - low.r) * ratio)
  const g = Math.round(low.g + (high.g - low.g) * ratio)
  const b = Math.round(low.b + (high.b - low.b) * ratio)
  return `rgb(${r}, ${g}, ${b})`
}

export function GridsearchHeatmapLab() {
  const data = AI4I.tuningHeatmap
  const values = data.scores.flat().filter((value): value is number => value != null)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const [selected, setSelected] = useState({ depth: 8, leaf: 3 })
  const score = data.scores[data.depths.indexOf(selected.depth)]?.[data.leaves.indexOf(selected.leaf)]

  return (
    <LabShell>
      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-mist">
              CV F1 · profundidad × hojas
            </p>
            <div className="flex items-center gap-2 font-mono text-[10px] text-mist">
              <span>{formatDecimal(min, 3)}</span>
              <span className="h-2 w-24 rounded-full bg-gradient-to-r from-[#101a22] to-sion" />
              <span>{formatDecimal(max, 3)}</span>
            </div>
          </div>

          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `3.2rem repeat(${data.leaves.length}, minmax(0, 1fr))` }}
            role="grid"
            aria-label="Mapa de calor de GridSearchCV"
          >
            <div />
            {data.leaves.map((leaf) => (
              <div key={`head-${leaf}`} className="pb-1 text-center font-mono text-[10px] text-mist">
                leaf {leaf}
              </div>
            ))}
            {data.depths.map((depth, rowIndex) => (
              <div key={`row-${depth}`} className="contents">
                <div className="flex items-center justify-end pr-1 font-mono text-[10px] text-mist">
                  d {depth}
                </div>
                {data.leaves.map((leaf, columnIndex) => {
                  const value = data.scores[rowIndex][columnIndex] ?? min
                  const isSelected = selected.depth === depth && selected.leaf === leaf
                  const isChosen =
                    data.chosen.maxDepth === depth && data.chosen.minSamplesLeaf === leaf
                  const isBest =
                    data.best.maxDepth === depth && data.best.minSamplesLeaf === leaf
                  return (
                    <button
                      key={`${depth}-${leaf}`}
                      type="button"
                      onMouseEnter={() => setSelected({ depth, leaf })}
                      onFocus={() => setSelected({ depth, leaf })}
                      onClick={() => setSelected({ depth, leaf })}
                      title={`depth=${depth}, leaf=${leaf}, CV F1=${formatDecimal(value, 4)}`}
                      aria-label={`depth ${depth}, leaf ${leaf}, F1 ${formatDecimal(value, 4)}`}
                      className={cn(
                        'relative min-h-11 rounded-md border text-center font-mono text-[11px] font-semibold tabular-nums transition-transform hover:scale-[1.03]',
                        isSelected ? 'border-foam' : 'border-line',
                      )}
                      style={{
                        backgroundColor: heatColor(value, min, max),
                        color: (value - min) / (max - min || 1) > 0.55 ? '#05080d' : '#e6f1f0',
                      }}
                    >
                      {formatDecimal(value, 3)}
                      {isChosen ? (
                        <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-sion text-ink">
                          <CheckCircle2 className="size-3" aria-hidden="true" />
                        </span>
                      ) : null}
                      {isBest && !isChosen ? (
                        <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-amber text-ink">
                          <Star className="size-3" aria-hidden="true" />
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
          <p className="mt-2 font-mono text-[10px] text-mist">
            verde = elegido por el proyecto · estrella = mejor CV de la grilla amplia
          </p>
        </div>

        <LabPanel title="Celda seleccionada">
          <p className="font-display text-2xl font-semibold text-foam">
            depth {selected.depth} · leaf {selected.leaf}
          </p>
          <p className="mt-1 font-mono text-lg text-sion">CV F1 {formatDecimal(score ?? 0, 4)}</p>
          <div className="mt-3 space-y-2">
            <Readout label="Grilla oficial" value={`F1 ${formatDecimal(AI4I.tuned.cvMean, 4)} ± ${formatDecimal(AI4I.tuned.cvStd, 4)}`} />
            <Readout label="Mejor de la grilla amplia" value={`d ${data.best.maxDepth}, leaf ${data.best.minSamplesLeaf}`} />
            <Readout label="Elección del proyecto" value={`d ${data.chosen.maxDepth}, leaf ${data.chosen.minSamplesLeaf}`} tone="good" />
          </div>
          <p className="mt-3 text-xs leading-5 text-mist">
            La grilla oficial exploró d 4/8 y leaf 1/3; eligió d 8, leaf 3. La grilla amplia es una
            herramienta didáctica: el óptimo de CV puede moverse y no es una auditoría independiente.
          </p>
        </LabPanel>
      </div>
    </LabShell>
  )
}

const TEST_PREDICTIONS = [0, 1, 0, 0, 1]

export function JoblibSerializationLab() {
  const [artifact, setArtifact] = useState<'pipeline' | 'classifier'>('pipeline')
  const [saved, setSaved] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [predicted, setPredicted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    if (!saved) {
      setError('Primero guardá un artefacto.')
      return
    }
    if (artifact === 'classifier') {
      setError('El clasificador solo no sabe escalar ni codificar: falta el preprocessing del pipeline.')
      setLoaded(false)
      return
    }
    setError(null)
    setLoaded(true)
    setPredicted(false)
  }

  return (
    <LabShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          label="Qué guardás"
          value={artifact}
          onChange={(value) => {
            setArtifact(value)
            setSaved(false)
            setLoaded(false)
            setPredicted(false)
            setError(null)
          }}
          options={[
            { value: 'pipeline', label: 'Pipeline completo' },
            { value: 'classifier', label: 'Solo clasificador' },
          ]}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setSaved(true)
              setLoaded(false)
              setPredicted(false)
              setError(null)
            }}
            className="inline-flex min-h-9 items-center rounded-full bg-sion px-3.5 py-1.5 text-xs font-semibold text-ink"
          >
            1 · Guardar
          </button>
          <button
            type="button"
            onClick={load}
            className="inline-flex min-h-9 items-center rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-foam"
          >
            2 · Cargar
          </button>
          <button
            type="button"
            disabled={!loaded}
            onClick={() => setPredicted(true)}
            className="inline-flex min-h-9 items-center rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-foam disabled:opacity-40"
          >
            3 · Predecir
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <LabPanel title="Artefacto">
          <div className="rounded-xl border border-line bg-ink/50 p-3 font-mono text-[11px] leading-6 text-foam/80">
            {artifact === 'pipeline' ? (
              <>
                <p className="text-sion">Pipeline([</p>
                <p className="pl-3">(&quot;scaler&quot;, StandardScaler()),</p>
                <p className="pl-3">(&quot;encoder&quot;, OneHotEncoder()),</p>
                <p className="pl-3">(&quot;classifier&quot;, DecisionTree(...)),</p>
                <p className="text-sion">])</p>
              </>
            ) : (
              <p>DecisionTreeClassifier(max_depth=8, min_samples_leaf=3)</p>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Readout label="Guardado" value={saved ? 'sí' : 'no'} tone={saved ? 'good' : 'default'} />
            <Readout label="Cargado" value={loaded ? 'sí' : 'no'} tone={loaded ? 'good' : 'default'} />
          </div>
        </LabPanel>

        <LabPanel title="Predicciones de 5 filas de test">
          {error ? (
            <p className="rounded-lg border border-rose-400/30 bg-rose-400/10 p-2.5 text-xs leading-5 text-rose-200">
              {error}
            </p>
          ) : predicted ? (
            <div className="flex flex-wrap gap-1.5">
              {TEST_PREDICTIONS.map((prediction, index) => (
                <span
                  key={index}
                  className={cn(
                    'rounded-md border px-2.5 py-1 font-mono text-xs',
                    prediction === 1
                      ? 'border-rose-400/40 bg-rose-400/10 text-rose-300'
                      : 'border-line bg-ink/40 text-mist',
                  )}
                >
                  {prediction === 1 ? 'falla' : 'sana'}
                </span>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-line bg-ink/40 p-2.5 text-xs leading-5 text-mist">
              Guardá, cargá y presioná “Predecir” para ver las predicciones del artefacto.
            </p>
          )}
          <p className="mt-3 text-xs leading-5 text-mist">
            {loaded
              ? 'El pipeline cargado reproduce las mismas predicciones: preprocessing y modelo viajan juntos.'
              : 'Guardá y cargá el artefacto. Si guardaste solo el clasificador, la carga no puede reconstruir el preprocessing.'}
          </p>
        </LabPanel>
      </div>

      <Callout tone="warn" title="Versión de sklearn">
        Un artefacto joblib depende de la versión de las librerías. Documentá el entorno y verificá
        las predicciones después de cargar; no alcanza con que el archivo abra.
      </Callout>
    </LabShell>
  )
}

export function ModelComparisonLab() {
  const [metric, setMetric] = useState<'f1' | 'rocAuc' | 'fn' | 'accuracy'>('f1')
  const rows = useMemo(() => {
    const tuned = { ...AI4I.tuned.metrics, tuned: true }
    const all = [...AI4I.models.map((model) => ({ ...model, tuned: false })), tuned]
    return [...all].sort((a, b) =>
      metric === 'fn' ? a.fn - b.fn : (b[metric] as number) - (a[metric] as number),
    )
  }, [metric])
  const [selected, setSelected] = useState(rows[0]?.name ?? '')
  const row = rows.find((entry) => entry.name === selected) ?? rows[0]
  const winner = rows[0]

  return (
    <LabShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          label="Ordenar por"
          value={metric}
          onChange={setMetric}
          options={[
            { value: 'f1', label: 'F1' },
            { value: 'rocAuc', label: 'ROC-AUC' },
            { value: 'accuracy', label: 'Accuracy' },
            { value: 'fn', label: 'Fallas perdidas' },
          ]}
        />
        <span className="font-mono text-[11px] text-mist">mismo test · 2.000 filas · 68 fallas</span>
      </div>

      <div className="space-y-2">
        {rows.map((entry) => {
          const isSelected = entry.name === selected
          const value =
            metric === 'fn' ? entry.fn : (entry[metric] as number)
          return (
            <button
              key={`${entry.name}-${entry.tuned}`}
              type="button"
              onClick={() => setSelected(entry.name)}
              className={cn(
                'w-full rounded-xl border p-3 text-left transition-colors',
                isSelected ? 'border-sion/50 bg-sion/[0.06]' : 'border-line bg-panel-2/40 hover:border-sion/30',
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm font-medium text-foam">
                  {entry.name}
                  {entry.tuned ? (
                    <span className="rounded bg-sion px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase text-ink">
                      tuneado
                    </span>
                  ) : null}
                </span>
                <span className="font-mono text-[11px] tabular-nums text-mist">
                  {metric === 'fn' ? `${value} fallas perdidas` : formatDecimal(value as number, 4)}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                <div
                  className={cn('h-full rounded-full', entry.tuned ? 'bg-sion' : 'bg-mist/50')}
                  style={{
                    width: `${
                      metric === 'fn'
                        ? (entry.fn / 68) * 100
                        : ((entry[metric] as number) / 1) * 100
                    }%`,
                  }}
                />
              </div>
            </button>
          )
        })}
      </div>

      {row ? (
        <div className="grid gap-2 sm:grid-cols-4">
          <Metric label="F1" value={formatDecimal(row.f1, 4)} tone={row.tuned ? 'good' : 'default'} />
          <Metric label="ROC-AUC" value={formatDecimal(row.rocAuc, 4)} />
          <Metric label="Precision" value={formatDecimal(row.precision, 4)} />
          <Metric label="Recall" value={formatDecimal(row.recall, 4)} />
        </div>
      ) : null}

      <div className="rounded-xl border border-line bg-panel-2/40 p-3 text-sm leading-6 text-foam/85">
        <span className="font-semibold text-sion">Ganador por {metric === 'fn' ? 'menos fallas perdidas' : metric}:</span>{' '}
        {winner?.name}. Cambiar la métrica cambia el podio: no hay un ganador absoluto. El árbol
        tuneado maximiza F1; el Random Forest conserva mejor ROC-AUC.
      </div>

      <Callout tone="tip">
        La comparación es válida porque todos los modelos usan el mismo split, las mismas features y
        la misma métrica. Si cambiás el test o el umbral, la tabla deja de ser comparable.
      </Callout>
    </LabShell>
  )
}

const FINAL_STAGES = [
  {
    title: 'Carga',
    detail: '10.000 filas y 14 columnas del CSV oficial. Se verifican tipos y esquema antes de tocar nada.',
    metric: '10.000 filas',
  },
  {
    title: 'Limpieza',
    detail: 'Sin duplicados ni faltantes. 459 outliers se reportan y se retienen: pueden ser señales de falla.',
    metric: '459 outliers',
  },
  {
    title: 'Features',
    detail: 'Cinco sensores, Type codificado con One-Hot y escalado ajustado solo con train.',
    metric: '8 features',
  },
  {
    title: 'Split',
    detail: '80/20 estratificado con semilla 42: 8000 filas de train y 2000 de test, con 68 fallas en test.',
    metric: '68 fallas test',
  },
  {
    title: 'Modelos',
    detail: 'Regresión logística, Random Forest, árbol de decisión y árbol tuneado con GridSearchCV.',
    metric: '4 modelos',
  },
  {
    title: 'Evaluación',
    detail: 'El árbol tuneado logra F1 0,7581 y deja 21 fallas sin detectar; el Random Forest pierde 35 pero tiene mejor ROC-AUC.',
    metric: 'F1 0,7581',
  },
  {
    title: 'Decisión',
    detail: 'Elegir umbral según el costo de la falla y la falsa alarma. Monitorear, validar con datos nuevos y no confundir correlación con causalidad.',
    metric: '21 FN',
  },
] as const

export function FinalProjectLab() {
  const [step, setStep] = useState(0)
  const stage = FINAL_STAGES[step]
  const done = step === FINAL_STAGES.length - 1

  return (
    <LabShell>
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-2">
          {FINAL_STAGES.map((entry, index) => {
            const active = index === step
            const complete = index < step
            return (
              <button
                key={entry.title}
                type="button"
                onClick={() => setStep(index)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-colors',
                  active
                    ? 'border-sion/50 bg-sion/[0.07]'
                    : complete
                      ? 'border-sion/20 bg-sion/[0.03]'
                      : 'border-line bg-panel-2/40',
                )}
              >
                <span
                  className={cn(
                    'grid size-7 shrink-0 place-items-center rounded-full font-mono text-[11px]',
                    active
                      ? 'bg-sion text-ink'
                      : complete
                        ? 'bg-sion/15 text-sion'
                        : 'bg-ink/50 text-mist',
                  )}
                >
                  {index + 1}
                </span>
                <span className={cn('text-sm', active ? 'text-foam' : 'text-mist')}>{entry.title}</span>
              </button>
            )
          })}
        </div>

        <div className="rounded-2xl border border-line bg-panel-2/40 p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-sion">
            Etapa {step + 1} de {FINAL_STAGES.length}
          </p>
          <h3 className="mt-1 font-display text-2xl font-semibold text-foam">{stage.title}</h3>
          <p className="mt-2 text-sm leading-6 text-mist">{stage.detail}</p>
          <div className="mt-4 rounded-xl border border-line bg-ink/40 p-3 text-center">
            <p className="text-[10px] uppercase tracking-[0.14em] text-mist">Indicador</p>
            <p className="mt-1 font-mono text-2xl font-semibold text-sion">{stage.metric}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              disabled={step === 0}
              className="inline-flex min-h-9 items-center rounded-full border border-line px-3.5 py-1.5 text-xs text-mist disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => setStep((current) => Math.min(FINAL_STAGES.length - 1, current + 1))}
              disabled={done}
              className="inline-flex min-h-9 items-center rounded-full bg-sion px-3.5 py-1.5 text-xs font-semibold text-ink disabled:opacity-40"
            >
              Siguiente
            </button>
            <button
              type="button"
              onClick={() => setStep(0)}
              className="inline-flex min-h-9 items-center rounded-full border border-line px-3.5 py-1.5 text-xs text-mist"
            >
              Reiniciar
            </button>
          </div>

          {done ? (
            <div className="mt-4 rounded-xl border border-sion/30 bg-sion/8 p-3 text-sm leading-6 text-foam/85">
              <p className="font-semibold text-sion">Resultado final</p>
              <p className="mt-1">
                F1 {formatDecimal(AI4I.tuned.metrics.f1, 4)} · recall{' '}
                {formatDecimal(AI4I.tuned.metrics.recall, 4)} · {AI4I.tuned.metrics.fn} fallas
                perdidas de 68 · CV {formatDecimal(AI4I.tuned.cvMean, 4)} ±{' '}
                {formatDecimal(AI4I.tuned.cvStd, 4)}.
              </p>
              <p className="mt-1 text-mist">
                Límites: datos sintéticos, validación interna y sin validación agrícola de campo.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </LabShell>
  )
}
