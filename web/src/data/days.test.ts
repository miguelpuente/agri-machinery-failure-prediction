import { describe, expect, it } from 'vitest'

import { DAYS, TOTAL_DAYS, WEEK_LABELS } from './days'

describe('day content', () => {
  it('has exactly 24 unique, sequential days', () => {
    expect(TOTAL_DAYS).toBe(24)
    expect(DAYS.map((day) => day.day)).toEqual(Array.from({ length: 24 }, (_, index) => index + 1))
  })

  it('groups six days per week with the approved labels', () => {
    for (const week of [1, 2, 3, 4] as const) {
      const days = DAYS.filter((day) => day.week === week)
      expect(days).toHaveLength(6)
      expect(days.every((day) => day.weekLabel === WEEK_LABELS[week])).toBe(true)
    }
  })

  it('gives every day its own lab and the full content contract', () => {
    expect(new Set(DAYS.map((day) => day.labId)).size).toBe(24)
    for (const day of DAYS) {
      expect(day.topic.length).toBeGreaterThan(3)
      expect(day.title.length).toBeGreaterThan(8)
      expect(day.subtitle.length).toBeGreaterThan(20)
      expect(day.conceptSummary.length).toBeGreaterThan(40)
      expect(day.keyTakeaway.length).toBeGreaterThan(20)
      expect(day.codeSnippet.length).toBeGreaterThan(20)
      expect(day.labTitle.length).toBeGreaterThan(4)
      expect(day.labInstruction.length).toBeGreaterThan(15)
      expect(day.challenge.length).toBeGreaterThan(15)
    }
  })

  it('has a valid quiz for every day', () => {
    for (const day of DAYS) {
      expect(day.quiz.prompt.length).toBeGreaterThan(10)
      expect(day.quiz.options).toHaveLength(4)
      expect(day.quiz.correctIndex).toBeGreaterThanOrEqual(0)
      expect(day.quiz.correctIndex).toBeLessThan(day.quiz.options.length)
      expect(day.quiz.explanation.length).toBeGreaterThan(20)
      expect(new Set(day.quiz.options).size).toBe(4)
    }
  })

  it('links our notebooks, never the reference course', () => {
    for (const day of DAYS) {
      expect(day.notebook.githubUrl).toContain('miguelpuente/agri-machinery-failure-prediction')
      expect(day.notebook.colabUrl).toContain('miguelpuente/agri-machinery-failure-prediction')
      expect(day.notebook.githubUrl).not.toContain('VintaBytes')
      expect(day.notebook.colabUrl).not.toContain('VintaBytes')
    }
  })

  it('does not use the reference Advent brand', () => {
    const text = JSON.stringify(DAYS).toLowerCase()
    expect(text).not.toContain('adviento')
    expect(text).not.toContain('aviento')
  })
})
