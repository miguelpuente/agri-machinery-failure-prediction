import { describe, expect, it } from 'vitest'

import {
  classificationMetrics,
  clamp,
  confusionCounts,
  euclidean,
  kmeansAssign,
  kmeansUpdate,
  knnQuery,
  linearMetrics,
  mean,
  median,
  standardize,
  stdev,
  thresholdMetrics,
  sigmoid,
} from './labMath'

describe('basic statistics', () => {
  it('computes mean, median and sample standard deviation', () => {
    const values = [2, 4, 4, 4, 5, 5, 7, 9]
    expect(mean(values)).toBe(5)
    expect(median(values)).toBe(4.5)
    expect(stdev(values)).toBeCloseTo(2.1381, 4)
    expect(mean([])).toBe(0)
    expect(median([])).toBe(0)
    expect(stdev([])).toBe(0)
  })

  it('standardizes to zero mean and unit deviation', () => {
    const result = standardize([1, 2, 3, 4, 5])
    expect(mean(result.values)).toBeCloseTo(0, 10)
    expect(stdev(result.values)).toBeCloseTo(1, 10)
    expect(result.mean).toBe(3)
  })

  it('clamps inside a closed range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-1, 0, 10)).toBe(0)
    expect(clamp(11, 0, 10)).toBe(10)
  })
})

describe('sigmoid', () => {
  it('maps zero to one half and saturates at the extremes', () => {
    expect(sigmoid(0)).toBe(0.5)
    expect(sigmoid(30)).toBeCloseTo(1, 6)
    expect(sigmoid(-30)).toBeCloseTo(0, 6)
  })
})

describe('distance and KNN', () => {
  const points = [
    { x: 0, y: 0, label: 0 },
    { x: 1, y: 0, label: 0 },
    { x: 10, y: 0, label: 1 },
    { x: 11, y: 0, label: 1 },
  ]

  it('measures euclidean distance', () => {
    expect(euclidean({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5)
  })

  it('picks the nearest neighbor with k=1', () => {
    const result = knnQuery(points, { x: 0.2, y: 0 }, 1, 'raw')
    expect(result.neighbors).toHaveLength(1)
    expect(result.label).toBe(0)
  })

  it('votes among k neighbors and exposes vote counts', () => {
    const result = knnQuery(points, { x: 5, y: 0 }, 4, 'raw')
    expect(result.label).toBe(0)
    expect(result.votes).toEqual({ 0: 2, 1: 2 })
    const tie = knnQuery(points, { x: 5.1, y: 0 }, 4, 'raw')
    expect(tie.label).toBe(0)
  })

  it('keeps the raw neighbors reachable for the scaling lab', () => {
    const result = knnQuery(points, { x: 0.2, y: 0 }, 2, 'zscore')
    expect(result.neighbors).toHaveLength(2)
    expect(result.scaled).toBe(true)
  })
})

describe('classification metrics', () => {
  it('counts the four confusion cells', () => {
    expect(confusionCounts([0, 0, 1, 1], [0, 1, 0, 1])).toEqual({
      tn: 1,
      fp: 1,
      fn: 1,
      tp: 1,
    })
  })

  it('computes accuracy, precision, recall and F1', () => {
    const result = classificationMetrics({ tn: 90, fp: 10, fn: 20, tp: 30 })
    expect(result.accuracy).toBeCloseTo(0.8, 6)
    expect(result.precision).toBeCloseTo(0.75, 6)
    expect(result.recall).toBeCloseTo(0.6, 6)
    expect(result.f1).toBeCloseTo(2 * 0.75 * 0.6 / (0.75 + 0.6), 6)
  })

  it('returns zero for undefined ratios', () => {
    expect(classificationMetrics({ tn: 10, fp: 0, fn: 0, tp: 0 })).toMatchObject({
      precision: 0,
      recall: 0,
      f1: 0,
      accuracy: 1,
    })
  })

  it('thresholds scores and reports the same cells', () => {
    const result = thresholdMetrics([0.9, 0.8, 0.4, 0.1], [1, 0, 1, 0], 0.5)
    expect(result).toMatchObject({ tn: 1, fp: 1, fn: 1, tp: 1 })
    expect(result.f1).toBeCloseTo(0.5, 6)
  })
})

describe('linear regression helpers', () => {
  const perfect = [
    { x: 0, y: 1 },
    { x: 1, y: 3 },
    { x: 2, y: 5 },
  ]

  it('reports zero error and R2 one for a perfect line', () => {
    const result = linearMetrics(perfect, 2, 1)
    expect(result.mae).toBeCloseTo(0, 10)
    expect(result.mse).toBeCloseTo(0, 10)
    expect(result.rmse).toBeCloseTo(0, 10)
    expect(result.r2).toBeCloseTo(1, 10)
  })

  it('penalizes a wrong slope', () => {
    const result = linearMetrics(perfect, 0, 1)
    expect(result.mae).toBeGreaterThan(0)
    expect(result.rmse).toBeGreaterThan(result.mae)
    expect(result.r2).toBeLessThan(1)
  })
})

describe('K-Means helpers', () => {
  const points = [
    { x: 0, y: 0 },
    { x: 0.2, y: 0 },
    { x: 5, y: 5 },
    { x: 5.2, y: 5 },
  ]

  it('assigns each point to its closest center', () => {
    const labels = kmeansAssign(points, [
      { x: 0, y: 0 },
      { x: 5, y: 5 },
    ])
    expect(labels).toEqual([0, 0, 1, 1])
  })

  it('recomputes centers as the mean of their group', () => {
    const centers = kmeansUpdate(points, [0, 0, 1, 1], 2)
    expect(centers[0].x).toBeCloseTo(0.1, 6)
    expect(centers[1].y).toBeCloseTo(5, 6)
  })
})
