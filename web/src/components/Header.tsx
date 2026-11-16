import { GitBranch, Share2 } from 'lucide-react'

import { BRAND } from '../lib/theme'
import { ProgressRing, cn } from './ui'

export function Header({
  completed,
  total,
  onShare,
}: {
  completed: number
  total: number
  onShare: () => void
}) {
  const percent = Math.round((completed / total) * 100)

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-ink/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-3" aria-label={`${BRAND.name} · inicio`}>
          <span className="grid size-9 place-items-center rounded-xl border border-sion/30 bg-sion/10 font-display text-lg font-bold text-sion">
            S
          </span>
          <span className="hidden sm:block">
            <span className="block font-display text-sm font-semibold tracking-tight text-foam">
              {BRAND.name}
            </span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-mist">
              AI4I · mantenimiento predictivo
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 text-sm text-mist md:flex" aria-label="Principal">
          <a className="transition-colors hover:text-foam" href="#calendario">
            Calendario
          </a>
          <a className="transition-colors hover:text-foam" href="#ruta">
            Ruta
          </a>
          <a className="transition-colors hover:text-foam" href="#proyecto">
            Proyecto
          </a>
          <a
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foam"
            href={BRAND.repository}
            target="_blank"
            rel="noreferrer"
          >
            <GitBranch className="size-4" aria-hidden="true" />
            GitHub
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-line bg-panel/70 py-1 pl-1 pr-3 sm:flex">
            <ProgressRing value={percent} size={30} label="" />
            <span className="font-mono text-[11px] tabular-nums text-mist">
              <span className={cn(completed > 0 ? 'text-sion' : 'text-foam')}>{completed}</span>/
              {total}
            </span>
          </div>
          <button
            type="button"
            onClick={onShare}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-panel/70 px-3 py-2 text-xs font-medium text-mist transition-colors hover:border-sion/40 hover:text-foam"
          >
            <Share2 className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Compartir</span>
          </button>
        </div>
      </div>
    </header>
  )
}
