import { Download, RotateCcw, Share2, Sparkles, Upload } from 'lucide-react'

import { ProgressRing } from './ui'

export function ProgressPanel({
  completed,
  total,
  nextDay,
  onExport,
  onReset,
  onShare,
  onOpenNext,
  onImport,
  importStatus,
}: {
  completed: number
  total: number
  nextDay: number | null
  onExport: () => void
  onReset: () => void
  onShare: () => void
  onOpenNext: () => void
  onImport: (file: File) => void
  importStatus: string | null
}) {
  const percent = Math.round((completed / total) * 100)
  const allDone = completed === total

  return (
    <section className="px-4 py-8 sm:px-6" aria-label="Tu progreso">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-panel via-panel to-panel-2/70 p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <ProgressRing value={percent} size={84} />
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sion">
                Tu avance
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foam">
                {completed} de {total} laboratorios
              </h2>
              <p className="mt-1 text-sm text-mist">
                {allDone
                  ? 'Completaste el recorrido. Ahora llevá el pipeline a tus propios datos.'
                  : nextDay
                    ? `El siguiente paso es el día ${String(nextDay).padStart(2, '0')}.`
                    : 'Abrí cualquier día para empezar.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!allDone && nextDay ? (
              <button
                type="button"
                onClick={onOpenNext}
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-sion px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-sion/90"
              >
                <Sparkles className="size-4" aria-hidden="true" />
                Ir al día {String(nextDay).padStart(2, '0')}
              </button>
            ) : null}
            <button
              type="button"
              onClick={onShare}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-ink/40 px-3.5 py-2 text-xs font-medium text-mist transition-colors hover:border-sion/40 hover:text-foam"
            >
              <Share2 className="size-4" aria-hidden="true" />
              Compartir
            </button>
            <button
              type="button"
              onClick={onExport}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-ink/40 px-3.5 py-2 text-xs font-medium text-mist transition-colors hover:border-sion/40 hover:text-foam"
            >
              <Download className="size-4" aria-hidden="true" />
              Exportar
            </button>
            <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-line bg-ink/40 px-3.5 py-2 text-xs font-medium text-mist transition-colors hover:border-sion/40 hover:text-foam">
              <Upload className="size-4" aria-hidden="true" />
              Importar
              <input
                type="file"
                accept="application/json,.json"
                aria-label="Importar progreso desde un archivo JSON"
                className="sr-only"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0]
                  if (file) onImport(file)
                  event.currentTarget.value = ''
                }}
              />
            </label>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-ink/40 px-3.5 py-2 text-xs font-medium text-mist transition-colors hover:border-rose-400/40 hover:text-rose-300"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Reiniciar
            </button>
          </div>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sion-deep via-sion to-cyan-300 transition-[width] duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-mist">
          Progreso guardado solo en este navegador · {percent}%
        </p>
        <p aria-live="polite" className="mt-1 text-[11px] text-sion">
          {importStatus ?? 'Importar fusiona los días del archivo con tu avance actual.'}
        </p>
      </div>
    </section>
  )
}
