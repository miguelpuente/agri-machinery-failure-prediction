export const PROGRESS_KEY = 'sion_ml_progress_v1'
export const TOTAL_DAYS = 24

type StorageLike = Pick<Storage, 'getItem' | 'setItem'> & Partial<Pick<Storage, 'removeItem'>>

function browserStorage(): StorageLike | undefined {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage
  } catch {
    return undefined
  }
}

function isValidDay(value: unknown, total: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= total
}

export function sanitizeCompletedDays(value: unknown, total = TOTAL_DAYS): number[] {
  if (!Array.isArray(value) || total <= 0) return []
  const unique = new Set<number>()
  for (const entry of value) {
    if (isValidDay(entry, total)) unique.add(entry)
  }
  return [...unique].sort((a, b) => a - b)
}

export function loadProgress(storage: StorageLike | undefined = browserStorage()): number[] {
  if (!storage) return []
  try {
    const raw = storage.getItem(PROGRESS_KEY)
    if (!raw) return []
    return sanitizeCompletedDays(JSON.parse(raw))
  } catch {
    return []
  }
}

export function saveProgress(
  completedDays: number[],
  storage: StorageLike | undefined = browserStorage(),
): void {
  if (!storage) return
  try {
    storage.setItem(PROGRESS_KEY, JSON.stringify(sanitizeCompletedDays(completedDays)))
  } catch {
    // A blocked or full storage must not break the session.
  }
}

export function clearProgress(storage: StorageLike | undefined = browserStorage()): void {
  if (!storage) return
  try {
    storage.removeItem?.(PROGRESS_KEY)
  } catch {
    // Ignore storage errors.
  }
}

export function toggleDay(completedDays: number[], day: number, total = TOTAL_DAYS): number[] {
  const current = sanitizeCompletedDays(completedDays, total)
  if (!isValidDay(day, total)) return current
  return current.includes(day) ? current.filter((entry) => entry !== day) : [...current, day].sort((a, b) => a - b)
}

export function progressPercent(completedDays: number[], total = TOTAL_DAYS): number {
  if (total <= 0) return 0
  const completed = sanitizeCompletedDays(completedDays, total).length
  return Math.round((completed / total) * 100)
}

export function exportProgress(completedDays: number[], total = TOTAL_DAYS): string {
  return JSON.stringify(
    {
      version: 1,
      app: 'Sion Machine Learning',
      exportedAt: new Date().toISOString(),
      total,
      completedDays: sanitizeCompletedDays(completedDays, total),
    },
    null,
    2,
  )
}

export function parseDeepLink(search: string, total = TOTAL_DAYS): number | null {
  const raw = new URLSearchParams(search).get('dia')
  if (!raw || !/^\d+$/.test(raw)) return null
  const day = Number(raw)
  return isValidDay(day, total) ? day : null
}
