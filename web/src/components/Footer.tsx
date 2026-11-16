import { Heart } from 'lucide-react'

import { BRAND } from '../lib/theme'
import { GitHubIcon } from './icons'

export function Footer() {
  return (
    <footer className="mt-6 border-t border-line bg-ink/60 px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-lg border border-sion/30 bg-sion/10 font-display text-sm font-bold text-sion">
            S
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-foam">{BRAND.name}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-mist">
              {BRAND.project}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-mist">
          <span>AI4I 2020 · CC BY 4.0</span>
          <a
            className="inline-flex items-center gap-1.5 transition-colors hover:text-sion"
            href={BRAND.repository}
            target="_blank"
            rel="noreferrer"
          >
            <GitHubIcon className="size-3.5" aria-hidden="true" />
            Repositorio
          </a>
          <a
            className="transition-colors hover:text-sion"
            href={BRAND.site}
            target="_blank"
            rel="noreferrer"
          >
            sion.net.ar
          </a>
          <span className="inline-flex items-center gap-1">
            React + Vite
            <Heart className="size-3 text-sion" aria-hidden="true" />
          </span>
        </div>
      </div>
    </footer>
  )
}
