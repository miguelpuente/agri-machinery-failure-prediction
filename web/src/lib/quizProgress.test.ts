import { describe, expect, it } from 'vitest'

import {
  QUIZ_KEY,
  loadQuizResults,
  quizScore,
  recordQuizResult,
  sanitizeQuizResults,
  saveQuizResults,
} from './quizProgress'

function memoryStorage(initial: string | null = null) {
  let value = initial
  return {
    getItem: (_key: string) => value,
    setItem: (_key: string, next: string) => {
      value = next
    },
    read: () => value,
  }
}

describe('quiz progress', () => {
  it('sanitizes valid days and drops malformed entries', () => {
    expect(
      sanitizeQuizResults({
        1: { correct: true, attempts: 2, answeredAt: 'x' },
        25: { correct: true, attempts: 1, answeredAt: 'x' },
        bad: { correct: true, attempts: 1, answeredAt: 'x' },
      }),
    ).toEqual({ 1: { correct: true, attempts: 2, answeredAt: 'x' } })
    expect(sanitizeQuizResults([])).toEqual({})
    expect(sanitizeQuizResults({ 2: { correct: 'yes', attempts: 1 } })).toEqual({})
  })

  it('records attempts and keeps a correct answer once earned', () => {
    const first = recordQuizResult({}, 3, false)
    expect(first[3]).toMatchObject({ correct: false, attempts: 1 })
    const second = recordQuizResult(first, 3, true)
    expect(second[3]).toMatchObject({ correct: true, attempts: 2 })
    const third = recordQuizResult(second, 3, true)
    expect(third[3]).toMatchObject({ correct: true, attempts: 3 })
  })

  it('loads, saves and scores results', () => {
    const storage = memoryStorage()
    saveQuizResults({ 1: { correct: true, attempts: 1, answeredAt: 'x' } }, storage)
    expect(JSON.parse(storage.read() ?? '{}')).toMatchObject({
      1: { correct: true, attempts: 1 },
    })
    expect(loadQuizResults(storage)).toMatchObject({ 1: { correct: true } })
    expect(loadQuizResults(memoryStorage('{nope'))).toEqual({})
    expect(quizScore(loadQuizResults(storage))).toEqual({ correct: 1, answered: 1 })
    expect(QUIZ_KEY).toBe('sion_ml_quiz_v1')
  })
})
