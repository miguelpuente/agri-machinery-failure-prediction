import { BookOpen, FileText } from 'lucide-react'

import { MATERIAL, MATERIAL_TOTAL_MB, docsMarkdownUrl, type MaterialItem } from '../data/material'
import { Callout, Pill } from './ui'

function MaterialCard({ item }: { item: MaterialItem }) {
  const label = item.kind === 'Clase' ? `Clase ${String(item.order).padStart(2, '0')}` : item.kind

  return (
    <article className="flex min-h-[186px] flex-col rounded-2xl border border-line bg-panel/60 p-4 transition-colors hover:border-sion/35">
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-sion">{label}</span>
        <FileText className="size-4 shrink-0 text-mist" aria-hidden="true" />
      </div>
      <h3 className="mt-2 font-display text-base font-semibold leading-snug text-foam">{item.title}</h3>
      <p className="mt-1 font-mono text-[10px] text-mist">
        {item.pages} páginas · {item.sizeMb.toLocaleString('es-AR', { minimumFractionDigits: 1 })} MB
      </p>
      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        <a
          href={item.pdf}
          target="_blank"
          rel="noreferrer"
          aria-label={`Abrir PDF de ${item.title}`}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-sion px-3 py-1.5 text-[11px] font-semibold text-ink transition-colors hover:bg-sion/90"
        >
          <FileText className="size-3.5" aria-hidden="true" />
          Abrir PDF
        </a>
        <a
          href={docsMarkdownUrl(item.markdown)}
          target="_blank"
          rel="noreferrer"
          aria-label={`Leer transcripción de ${item.title}`}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[11px] font-medium text-mist transition-colors hover:border-sion/40 hover:text-foam"
        >
          <BookOpen className="size-3.5" aria-hidden="true" />
          Transcripción
        </a>
      </div>
    </article>
  )
}

export function MaterialSection() {
  const classes = MATERIAL.filter((item) => item.kind === 'Clase')
  const extras = MATERIAL.filter((item) => item.kind !== 'Clase')

  return (
    <section id="material" className="scroll-mt-36 px-4 py-10 sm:px-6 md:scroll-mt-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sion">
              Material teórico
            </p>
            <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foam">
              Las clases, en PDF
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-mist">
              Las 16 clases del curso, el plan de estudios y la consigna de la Preentrega. Cada PDF
              abre en una pestaña nueva; la transcripción Markdown está en el repositorio.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill tone="teal">{MATERIAL.length} documentos</Pill>
            <Pill tone="mist">
              {MATERIAL_TOTAL_MB.toLocaleString('es-AR', { minimumFractionDigits: 1 })} MB en total
            </Pill>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((item) => (
            <MaterialCard key={item.id} item={item} />
          ))}
        </div>

        <h3 className="mt-8 font-display text-xl font-semibold text-foam">Programa y consigna</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {extras.map((item) => (
            <MaterialCard key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-6">
          <Callout tone="info" title="Cómo está servido">
            Los PDFs originales viven en el volumen de SION y se sirven bajo demanda; no se cargan
            con la página. Pesan entre 0,3 y 8,7 MB, así que conviene abrirlos con Wi-Fi o datos
            suficientes. La transcripción Markdown es la versión liviana para leer en el celular.
          </Callout>
        </div>
      </div>
    </section>
  )
}
