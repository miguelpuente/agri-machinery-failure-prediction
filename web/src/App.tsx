import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { ArrowUp } from 'lucide-react'

import { AboutSection, RouteSection } from './components/AboutSections'
import { CalendarSection, type CalendarFilter } from './components/CalendarSection'
import { DayModal } from './components/DayModal'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ProgressPanel } from './components/ProgressPanel'
import { ShareDialog } from './components/ShareDialog'
import { DAYS, TOTAL_DAYS } from './data/days'
import {
  clearProgress,
  exportProgress,
  loadProgress,
  parseDeepLink,
  sanitizeCompletedDays,
  saveProgress,
} from './lib/progress'

function celebrate() {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  void confetti({
    particleCount: 90,
    spread: 70,
    origin: { y: 0.72 },
    colors: ['#00d1b2', '#38bdf8', '#a3e635', '#f2b84b', '#e6f1f0'],
    disableForReducedMotion: true,
  })
}

function replaceDayParam(day: number | null) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (day == null) url.searchParams.delete('dia')
  else url.searchParams.set('dia', String(day))
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
}

export default function App() {
  const [completedDays, setCompletedDays] = useState<number[]>(() => loadProgress())
  const [filter, setFilter] = useState<CalendarFilter>('all')
  const [activeDay, setActiveDay] = useState<number | null>(() => {
    if (typeof window === 'undefined') return null
    return parseDeepLink(window.location.search, TOTAL_DAYS)
  })
  const [shareOpen, setShareOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const lastTrigger = useRef<HTMLElement | null>(null)
  const lastShareTrigger = useRef<HTMLElement | null>(null)

  useEffect(() => {
    saveProgress(completedDays)
  }, [completedDays])

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onPop = () => {
      setActiveDay(parseDeepLink(window.location.search, TOTAL_DAYS))
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const openDay = useCallback((day: number) => {
    const active = document.activeElement as HTMLElement | null
    if (active && !active.closest('[role="dialog"]')) lastTrigger.current = active
    setActiveDay(day)
    replaceDayParam(day)
  }, [])

  const closeDay = useCallback(() => {
    setActiveDay(null)
    replaceDayParam(null)
    window.requestAnimationFrame(() => lastTrigger.current?.focus())
  }, [])

  const openShare = useCallback(() => {
    lastShareTrigger.current = document.activeElement as HTMLElement | null
    setShareOpen(true)
  }, [])

  const closeShare = useCallback(() => {
    setShareOpen(false)
    window.requestAnimationFrame(() => lastShareTrigger.current?.focus())
  }, [])

  const toggleComplete = useCallback((day: number, completed: boolean) => {
    setCompletedDays((current) => {
      const next = completed
        ? sanitizeCompletedDays([...current, day])
        : current.filter((entry) => entry !== day)
      return next
    })
    if (completed) celebrate()
  }, [])

  const nextPending = useMemo(
    () => DAYS.find((day) => !completedDays.includes(day.day))?.day ?? null,
    [completedDays],
  )

  const activeDayData = activeDay == null ? null : DAYS.find((day) => day.day === activeDay) ?? null

  const handleExport = useCallback(() => {
    const blob = new Blob([exportProgress(completedDays)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'sion-machine-learning-progress.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }, [completedDays])

  const handleReset = useCallback(() => {
    if (!window.confirm('¿Reiniciar el progreso de los 24 días en este navegador?')) return
    setCompletedDays([])
    clearProgress()
  }, [])

  const openNext = useCallback(() => {
    if (nextPending != null) openDay(nextPending)
  }, [nextPending, openDay])

  const previous = activeDay != null && activeDay > 1 ? activeDay - 1 : null
  const next = activeDay != null && activeDay < TOTAL_DAYS ? activeDay + 1 : null

  return (
    <div id="app-shell" className="relative min-h-screen">
      <div className="site-background" aria-hidden="true" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-sion focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
      >
        Saltar al contenido
      </a>
      <Header completed={completedDays.length} total={TOTAL_DAYS} onShare={openShare} />

      <main id="main-content" tabIndex={-1}>
        <Hero onStart={() => openDay(1)} total={TOTAL_DAYS} />
        <ProgressPanel
          completed={completedDays.length}
          total={TOTAL_DAYS}
          nextDay={nextPending}
          onExport={handleExport}
          onReset={handleReset}
          onShare={openShare}
          onOpenNext={openNext}
        />
        <CalendarSection
          days={DAYS}
          completed={completedDays}
          activeFilter={filter}
          onFilter={setFilter}
          onOpen={openDay}
        />
        <RouteSection onOpen={openDay} />
        <AboutSection />
      </main>

      <Footer />

      <p className="sr-only" aria-live="polite">
        {completedDays.length === 0
          ? 'Sin días completados.'
          : `${completedDays.length} de ${TOTAL_DAYS} días completados.`}
      </p>

      {showTop ? (
        <a
          href="#top"
          aria-label="Volver arriba"
          className="fixed bottom-5 right-5 z-40 grid size-11 place-items-center rounded-full border border-sion/30 bg-panel/90 text-sion shadow-lg shadow-black/40 backdrop-blur transition-colors hover:bg-panel"
        >
          <ArrowUp className="size-4" aria-hidden="true" />
        </a>
      ) : null}

      {activeDayData ? (
        <DayModal
          day={activeDayData}
          total={TOTAL_DAYS}
          completed={completedDays.includes(activeDayData.day)}
          onClose={closeDay}
          onToggleComplete={toggleComplete}
          onPrev={() => {
            if (previous != null) openDay(previous)
          }}
          onNext={() => {
            if (next != null) openDay(next)
          }}
          onOpenDay={openDay}
        />
      ) : null}

      <ShareDialog
        open={shareOpen}
        completed={completedDays.length}
        total={TOTAL_DAYS}
        onClose={closeShare}
      />
    </div>
  )
}
