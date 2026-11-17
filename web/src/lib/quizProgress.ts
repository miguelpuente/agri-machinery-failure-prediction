import { TOTAL_DAYS } from './progress'

export const QUIZ_KEY = 'sion_ml_quiz_v1'

export interface QuizResult {
  correct: boolean
  attempts: number
  answeredAt: string
}

export type QuizResults = Record<number, QuizResult>

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

function browserStorage(): StorageLike | undefined {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage
  } catch {
    return undefined
  }
}

function isValidDay(day: number, total: number): boolean {
  return Number.isInteger(day) && day >= 1 && day <= total
}

export function sanitizeQuizResults(value: unknown, total = TOTAL_DAYS): QuizResults {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const result: QuizResults = {}
  for (const [rawDay, rawResult] of Object.entries(value)) {
    const day = Number(rawDay)
    if (!isValidDay(day, total)) continue
    if (!rawResult || typeof rawResult !== 'object') continue
    const candidate = rawResult as Partial<QuizResult>
    if (typeof candidate.correct !== 'boolean') continue
    if (typeof candidate.attempts !== 'number' || !Number.isFinite(candidate.attempts)) continue
    result[day] = {
      correct: candidate.correct,
      attempts: Math.max(1, Math.floor(candidate.attempts)),
      answeredAt: typeof candidate.answeredAt === 'string' ? candidate.answeredAt : '',
    }
  }
  return result
}

export function loadQuizResults(storage: StorageLike | undefined = browserStorage()): QuizResults {
  if (!storage) return {}
  try {
    const raw = storage.getItem(QUIZ_KEY)
    return raw ? sanitizeQuizResults(JSON.parse(raw)) : {}
  } catch {
    return {}
  }
}

export function saveQuizResults(
  results: QuizResults,
  storage: StorageLike | undefined = browserStorage(),
): void {
  if (!storage) return
  try {
    storage.setItem(QUIZ_KEY, JSON.stringify(sanitizeQuizResults(results)))
  } catch {
    // A blocked storage must not break the quiz.
  }
}

export function recordQuizResult(
  results: QuizResults,
  day: number,
  correct: boolean,
  total = TOTAL_DAYS,
): QuizResults {
  if (!isValidDay(day, total)) return sanitizeQuizResults(results, total)
  const current = sanitizeQuizResults(results, total)
  const previous = current[day]
  return {
    ...current,
    [day]: {
      correct: correct || previous?.correct === true,
      attempts: (previous?.attempts ?? 0) + 1,
      answeredAt: new Date().toISOString(),
    },
  }
}

export function quizScore(results: QuizResults): { correct: number; answered: number } {
  const values = Object.values(results)
  return {
    correct: values.filter((result) => result.correct).length,
    answered: values.length,
  }
}
