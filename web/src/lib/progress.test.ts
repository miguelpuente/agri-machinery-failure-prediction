import { describe, expect, it } from 'vitest'

import {
  PROGRESS_KEY,
  exportProgress,
  loadProgress,
  parseDeepLink,
  progressPercent,
  sanitizeCompletedDays,
  saveProgress,
  toggleDay,
} from './progress'

function memoryStorage(initial: string | null = null) {
  let value = initial
  return {
    getItem: (key: string) => (key === PROGRESS_KEY ? value : null),
    setItem: (_key: string, next: string) => {
      value = next
    },
    removeItem: (_key: string) => {
      value = null
    },
    read: () => value,
  }
}

describe('sanitizeCompletedDays', () => {
  it('keeps unique integers inside 1..24 and sorts them', () => {
    expect(sanitizeCompletedDays([5, 2, 2, 24, 1, 25, 0, -3, 3.5, '4', null])).toEqual([
      1, 2, 5, 24,
    ])
  })

  it('returns an empty list for non-arrays', () => {
    expect(sanitizeCompletedDays(null)).toEqual([])
    expect(sanitizeCompletedDays({ days: [1] })).toEqual([])
  })
})

describe('progress persistence', () => {
  it('returns an empty list for missing or malformed storage', () => {
    expect(loadProgress(memoryStorage())).toEqual([])
    expect(loadProgress(memoryStorage('{nope'))).toEqual([])
    expect(loadProgress(memoryStorage(JSON.stringify({ days: [1] })))).toEqual([])
  })

  it('loads, saves and merges a sanitized list', () => {
    const storage = memoryStorage(JSON.stringify([3, 1, 99]))
    expect(loadProgress(storage)).toEqual([1, 3])

    saveProgress([2, 1], storage)
    expect(JSON.parse(storage.read() ?? '[]')).toEqual([1, 2])
  })

  it('toggles a day on and off', () => {
    expect(toggleDay([], 4)).toEqual([4])
    expect(toggleDay([4, 9], 4)).toEqual([9])
    expect(toggleDay([4], 99)).toEqual([4])
  })
})

describe('progress helpers', () => {
  it('computes a bounded percentage', () => {
    expect(progressPercent([], 24)).toBe(0)
    expect(progressPercent([1, 2, 3], 24)).toBe(13)
    expect(progressPercent([1, 2, 3], 0)).toBe(0)
  })

  it('exports a versioned JSON payload', () => {
    const payload = JSON.parse(exportProgress([2, 1, 2]))
    expect(payload.version).toBe(1)
    expect(payload.completedDays).toEqual([1, 2])
    expect(payload.total).toBe(24)
    expect(typeof payload.exportedAt).toBe('string')
  })

  it('reads a valid ?dia deep link and rejects invalid ones', () => {
    expect(parseDeepLink('?dia=7')).toBe(7)
    expect(parseDeepLink('?foo=bar&dia=24')).toBe(24)
    expect(parseDeepLink('?dia=0')).toBeNull()
    expect(parseDeepLink('?dia=25')).toBeNull()
    expect(parseDeepLink('?dia=abc')).toBeNull()
    expect(parseDeepLink('')).toBeNull()
  })
})
