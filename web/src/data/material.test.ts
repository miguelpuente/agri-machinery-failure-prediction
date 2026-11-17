import { describe, expect, it } from 'vitest'

import { MATERIAL, MATERIAL_TOTAL_MB, docsMarkdownUrl } from './material'

describe('material', () => {
  it('lists the 16 classes, the plan and the pre-entrega', () => {
    expect(MATERIAL).toHaveLength(18)
    expect(MATERIAL.filter((item) => item.kind === 'Clase')).toHaveLength(16)
    expect(new Set(MATERIAL.map((item) => item.id)).size).toBe(18)
    expect(new Set(MATERIAL.map((item) => item.pdf)).size).toBe(18)
    expect(new Set(MATERIAL.map((item) => item.markdown)).size).toBe(18)
  })

  it('uses local PDF paths and GitHub Markdown paths', () => {
    for (const item of MATERIAL) {
      expect(item.pdf).toMatch(/^\/docs\/.+\.pdf$/)
      expect(item.markdown.endsWith('.md')).toBe(true)
      expect(item.pages).toBeGreaterThan(0)
      expect(item.sizeMb).toBeGreaterThan(0)
      expect(item.title.length).toBeGreaterThan(3)
    }
    expect(MATERIAL_TOTAL_MB).toBeGreaterThan(100)
  })

  it('encodes the Markdown URL for spaces and parentheses', () => {
    expect(docsMarkdownUrl('ML CLASE _ 01.md')).toContain('ML%20CLASE%20_%2001.md')
    expect(docsMarkdownUrl('Preentrega(BORRADOR).md')).toContain(
      'Preentrega(BORRADOR).md',
    )
  })
})
