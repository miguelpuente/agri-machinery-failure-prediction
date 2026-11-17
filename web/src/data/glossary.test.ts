import { describe, expect, it } from 'vitest'

import { GLOSSARY } from './glossary'

describe('glossary', () => {
  it('has unique, non-empty terms', () => {
    expect(GLOSSARY.length).toBeGreaterThanOrEqual(25)
    expect(new Set(GLOSSARY.map((term) => term.term)).size).toBe(GLOSSARY.length)
    for (const term of GLOSSARY) {
      expect(term.term.length).toBeGreaterThanOrEqual(2)
      expect(term.definition.length).toBeGreaterThan(20)
    }
  })

  it('links only to valid days', () => {
    for (const term of GLOSSARY) {
      if (term.day == null) continue
      expect(term.day).toBeGreaterThanOrEqual(1)
      expect(term.day).toBeLessThanOrEqual(24)
    }
  })
})
