import { useEffect, useRef, useState } from 'react'
import { Check, Copy, Share2, X } from 'lucide-react'

import { BRAND } from '../lib/theme'
import { setBackgroundInert, useFocusTrap } from '../lib/useFocusTrap'

export function ShareDialog({
  open,
  completed,
  total,
  onClose,
}: {
  open: boolean
  completed: number
  total: number
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useFocusTrap(panelRef, open)

  useEffect(() => {
    if (!open) return
    setBackgroundInert(true)
    return () => setBackgroundInert(false)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const url = typeof window === 'undefined' ? '' : `${window.location.origin}${window.location.pathname}`
  const text =
    completed > 0
      ? `Voy ${completed}/${total} en ${BRAND.name}: 24 laboratorios de mantenimiento predictivo sobre AI4I. ${url}`
      : `Estoy recorriendo ${BRAND.name}: 24 laboratorios de mantenimiento predictivo sobre AI4I. ${url}`

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="modal-backdrop absolute inset-0 cursor-default bg-ink/80 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-title"
        className="modal-panel relative w-full max-w-lg rounded-2xl border border-line bg-panel p-5 shadow-2xl shadow-black/50"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sion">
              Compartir avance
            </p>
            <h2 id="share-title" className="mt-1 font-display text-2xl font-semibold text-foam">
              Pasá el link
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full border border-line text-mist transition-colors hover:text-foam"
            aria-label="Cerrar"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-2 text-sm leading-6 text-mist">
          El mensaje incluye tu progreso actual. El avance viaja en tu navegador, no en la URL.
        </p>

        <label htmlFor="share-message" className="mt-4 block text-xs font-medium text-foam">
          Mensaje
        </label>
        <textarea
          id="share-message"
          readOnly
          value={text}
          rows={4}
          className="mt-1.5 w-full resize-none rounded-xl border border-line bg-ink/60 p-3 font-mono text-[12px] leading-5 text-foam/85"
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={copy}
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-sion px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-sion/90"
          >
            {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
            {copied ? 'Copiado' : 'Copiar mensaje'}
          </button>
          {typeof navigator !== 'undefined' && 'share' in navigator ? (
            <button
              type="button"
              onClick={() => {
                void navigator.share({ title: BRAND.name, text, url }).catch(() => undefined)
              }}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-medium text-mist transition-colors hover:border-sion/40 hover:text-foam"
            >
              <Share2 className="size-4" aria-hidden="true" />
              Compartir
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
