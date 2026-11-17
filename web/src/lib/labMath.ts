export type Point = { x: number; y: number }
export type LabeledPoint = Point & { label: number }

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function mean(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((total, value) => total + value, 0) / values.length
}

export function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle]
}

export function stdev(values: number[]): number {
  if (values.length < 2) return 0
  const average = mean(values)
  const variance =
    values.reduce((total, value) => total + (value - average) ** 2, 0) / (values.length - 1)
  return Math.sqrt(variance)
}

export function standardize(values: number[]): { values: number[]; mean: number; std: number } {
  const average = mean(values)
  const deviation = stdev(values)
  return {
    values: values.map((value) => (deviation === 0 ? 0 : (value - average) / deviation)),
    mean: average,
    std: deviation,
  }
}

export function sigmoid(z: number): number {
  if (z >= 0) {
    const exponent = Math.exp(-z)
    return 1 / (1 + exponent)
  }
  const exponent = Math.exp(z)
  return exponent / (1 + exponent)
}

export function euclidean(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export interface KnnResult {
  neighbors: (LabeledPoint & { distance: number })[]
  votes: Record<number, number>
  label: number
  scaled: boolean
}

export function knnQuery(
  points: LabeledPoint[],
  query: Point,
  k: number,
  mode: 'raw' | 'zscore' = 'raw',
): KnnResult {
  const xStats = standardize(points.map((point) => point.x))
  const yStats = standardize(points.map((point) => point.y))
  const transform = (point: Point): Point =>
    mode === 'raw'
      ? point
      : {
          x: xStats.std === 0 ? 0 : (point.x - xStats.mean) / xStats.std,
          y: yStats.std === 0 ? 0 : (point.y - yStats.mean) / yStats.std,
        }

  const transformedQuery = transform(query)
  const ranked = points
    .map((point, index) => ({
      point,
      index,
      distance: euclidean(transform(point), transformedQuery),
    }))
    .sort((a, b) => a.distance - b.distance || a.index - b.index)

  const count = clamp(Math.round(k), 1, Math.max(points.length, 1))
  const neighbors = ranked.slice(0, count).map(({ point, distance }) => ({
    ...point,
    distance,
  }))
  const votes: Record<number, number> = {}
  for (const neighbor of neighbors) {
    votes[neighbor.label] = (votes[neighbor.label] ?? 0) + 1
  }
  const bestVote = Math.max(...Object.values(votes), 0)
  const tied = Object.entries(votes)
    .filter(([, count]) => count === bestVote)
    .map(([label]) => Number(label))
  const label = tied.includes(neighbors[0]?.label) ? neighbors[0].label : tied[0] ?? 0

  return { neighbors, votes, label, scaled: mode === 'zscore' }
}

export interface ConfusionCounts {
  tn: number
  fp: number
  fn: number
  tp: number
}

export function confusionCounts(actual: number[], predicted: number[]): ConfusionCounts {
  const counts: ConfusionCounts = { tn: 0, fp: 0, fn: 0, tp: 0 }
  const length = Math.min(actual.length, predicted.length)
  for (let index = 0; index < length; index += 1) {
    const truth = actual[index] === 1
    const guess = predicted[index] === 1
    if (truth && guess) counts.tp += 1
    else if (truth) counts.fn += 1
    else if (guess) counts.fp += 1
    else counts.tn += 1
  }
  return counts
}

export interface ClassificationMetrics {
  accuracy: number
  precision: number
  recall: number
  f1: number
}

export function classificationMetrics(counts: ConfusionCounts): ClassificationMetrics {
  const total = counts.tn + counts.fp + counts.fn + counts.tp
  const precision = counts.tp + counts.fp === 0 ? 0 : counts.tp / (counts.tp + counts.fp)
  const recall = counts.tp + counts.fn === 0 ? 0 : counts.tp / (counts.tp + counts.fn)
  return {
    accuracy: total === 0 ? 0 : (counts.tp + counts.tn) / total,
    precision,
    recall,
    f1: precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall),
  }
}

export function thresholdMetrics(
  scores: number[],
  labels: number[],
  threshold: number,
): ConfusionCounts & ClassificationMetrics {
  const predicted = scores.map((score) => (score >= threshold ? 1 : 0))
  const counts = confusionCounts(labels, predicted)
  return { ...counts, ...classificationMetrics(counts) }
}

export function linearMetrics(
  points: Point[],
  slope: number,
  intercept: number,
): { mae: number; mse: number; rmse: number; r2: number } {
  if (points.length === 0) return { mae: 0, mse: 0, rmse: 0, r2: 0 }
  const residuals = points.map((point) => point.y - (slope * point.x + intercept))
  const average = mean(points.map((point) => point.y))
  const ssRes = residuals.reduce((total, residual) => total + residual ** 2, 0)
  const ssTot = points.reduce((total, point) => total + (point.y - average) ** 2, 0)
  const mse = ssRes / points.length
  return {
    mae: mean(residuals.map((residual) => Math.abs(residual))),
    mse,
    rmse: Math.sqrt(mse),
    r2: ssTot === 0 ? (ssRes === 0 ? 1 : 0) : 1 - ssRes / ssTot,
  }
}

export function kmeansAssign(points: Point[], centers: Point[]): number[] {
  return points.map((point) => {
    let best = 0
    let bestDistance = Number.POSITIVE_INFINITY
    centers.forEach((center, index) => {
      const distance = euclidean(point, center)
      if (distance < bestDistance) {
        bestDistance = distance
        best = index
      }
    })
    return best
  })
}

export function kmeansUpdate(points: Point[], labels: number[], k: number): Point[] {
  const sums = Array.from({ length: k }, () => ({ x: 0, y: 0, count: 0 }))
  points.forEach((point, index) => {
    const label = labels[index]
    if (label == null || label < 0 || label >= k) return
    sums[label].x += point.x
    sums[label].y += point.y
    sums[label].count += 1
  })
  return sums.map((sum) => ({
    x: sum.count === 0 ? 0 : sum.x / sum.count,
    y: sum.count === 0 ? 0 : sum.y / sum.count,
  }))
}

export function inertia(points: Point[], centers: Point[], labels: number[]): number {
  return points.reduce((total, point, index) => {
    const center = centers[labels[index]]
    return center ? total + euclidean(point, center) ** 2 : total
  }, 0)
}
