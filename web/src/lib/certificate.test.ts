import { describe, expect, it } from 'vitest'

import { certificateLines } from './certificate'

describe('certificate', () => {
  it('summarizes the completed journey with a stable date', () => {
    expect(
      certificateLines({
        completed: 24,
        total: 24,
        quizCorrect: 18,
        date: new Date('2026-12-24T12:00:00Z'),
      }),
    ).toEqual(['24 de 24 laboratorios completados', 'Quizzes: 18/24 correctos', 'Fecha: 2026-12-24'])
  })
})
