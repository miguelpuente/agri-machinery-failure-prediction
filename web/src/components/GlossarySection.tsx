import { useState } from 'react'
import { ArrowUpRight, BookMarked, Search } from 'lucide-react'

import { GLOSSARY } from '../data/glossary'
import { cn } from './ui'

export function GlossarySection({ onOpen }: { onOpen: (day: number) => void }) {
  const [query, setQuery] = useState('')
  const normalized = query.trim().toLowerCase()
  const terms = normalized
    ? GLOSSARY.filter(
        (term) =>
          term.term.toLowerCase().includes(normalized) ||
          term.definition.toLowerCase().includes(normalized),
      )
    : GLOSSARY

  return (
    <section id="glosario" className="scroll-mt-36 px-4 py-10 sm:px-6 md:scroll-mt-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sion">
              Referencia rápida
            </p>
            <h2 className="mt-1 flex items-center gap-2 font-display text-3xl font-semibold tracking-tight text-foam">
              <BookMarked className="size-6 text-sion" aria-hidden="true" />
              Glosario
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-mist">
              Los términos que aparecen en los 24 días, con una definición corta y el día donde se
              trabajan.
            </p>
          </div>
          <div className="w-full sm:max-w-xs">
            <label htmlFor="glossary-search" className="sr-only">
              Buscar en el glosario
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mist"
                aria-hidden="true"
              />
              <input
                id="glossary-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar término o definición"
                className="min-h-11 w-full rounded-full border border-line bg-panel/70 py-2 pl-9 pr-3 text-sm text-foam placeholder:text-mist/70 focus:border-sion/50"
              />
            </div>
            <p aria-live="polite" className="mt-1.5 font-mono text-[10px] text-mist">
              {terms.length} de {GLOSSARY.length} términos
            </p>
          </div>
        </div>

        {terms.length > 0 ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {terms.map((term) => (
              <article
                key={term.term}
                className={cn(
                  'flex min-h-[132px] flex-col rounded-2xl border border-line bg-panel/60 p-4',
                  'transition-colors hover:border-sion/35',
                )}
              >
                <h3 className="font-display text-base font-semibold text-foam">{term.term}</h3>
                <p className="mt-1 text-xs leading-5 text-mist">{term.definition}</p>
                {term.day ? (
                  <button
                    type="button"
                    onClick={() => onOpen(term.day!)}
                    className="mt-auto inline-flex min-h-8 items-center gap-1 self-start pt-2 text-[11px] font-medium text-sion transition-colors hover:text-foam"
                  >
                    Ver día {String(term.day).padStart(2, '0')}
                    <ArrowUpRight className="size-3" aria-hidden="true" />
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-line bg-panel/40 px-6 py-12 text-center">
            <p className="font-display text-lg font-semibold text-foam">Sin resultados</p>
            <p className="mt-1 text-sm text-mist">
              Probá con “leakage”, “recall” o “pipeline”.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
