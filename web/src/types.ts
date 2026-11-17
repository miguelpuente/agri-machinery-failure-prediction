export type WeekNumber = 1 | 2 | 3 | 4

export type LabId =
  | 'pandas-inspector'
  | 'nulls-imputation'
  | 'feature-engineering'
  | 'categorical-encoding'
  | 'feature-scaling'
  | 'train-test-leakage'
  | 'linear-regression-fit'
  | 'regression-metrics'
  | 'target-diagnostics'
  | 'logistic-sigmoid'
  | 'confusion-matrix'
  | 'imbalanced-metrics'
  | 'knn-canvas'
  | 'knn-scaling'
  | 'decision-tree-depth'
  | 'random-forest-ensemble'
  | 'kmeans-stepper'
  | 'kmeans-real'
  | 'pre-entrega-checklist'
  | 'sklearn-pipeline'
  | 'gridsearch-heatmap'
  | 'joblib-serialization'
  | 'model-comparison'
  | 'final-project'

export interface Quiz {
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface NotebookLink {
  title: string
  githubUrl: string
  colabUrl: string
}

export interface Day {
  day: number
  week: WeekNumber
  weekLabel: string
  topic: string
  title: string
  subtitle: string
  conceptSummary: string
  keyTakeaway: string
  codeSnippet: string
  labId: LabId
  labTitle: string
  labInstruction: string
  challenge: string
  notebook: NotebookLink
  quiz: Quiz
}

export interface SensorStat {
  min: number
  q1: number
  median: number
  q3: number
  max: number
  mean: number
  std: number
}

export interface ModelRow {
  name: string
  accuracy: number
  precision: number
  recall: number
  f1: number
  rocAuc: number
  tn: number
  fp: number
  fn: number
  tp: number
  roc: { fpr: number; tpr: number }[]
}

export interface Ai4iData {
  meta: {
    dataset: string
    source: string
    license: string
    citation: string
    rows: number
    columns: number
    failureCount: number
    failureRate: number
    testSize: number
    randomState: number
  }
  summary: {
    rowCount: number
    columnCount: number
    classBalance: Record<string, number>
  }
  sensorStats: Record<string, SensorStat>
  typeStats: Record<string, { count: number; failures: number; failureRate: number }>
  correlation: { columns: string[]; matrix: (number | null)[][] }
  sampleRows: Record<string, string | number | null>[]
  nullsSample: {
    rows: Record<string, string | number | null>[]
    nullCells: (string | number)[][]
  }
  cleaning: {
    duplicatesRemoved: number
    rowsDroppedMissing: number
    remainingRows: number
    outlierRows: number
    outliersBySensor: Record<string, number>
  }
  split: {
    trainRows: number
    testRows: number
    trainFailures: number
    testFailures: number
  }
  models: ModelRow[]
  tuned: {
    name: string
    params: { max_depth: number; min_samples_leaf: number }
    cvMean: number
    cvStd: number
    metrics: ModelRow
  }
  featureImportance: { name: string; importance: number }[]
  depthCurve: { depth: number; trainF1: number; testF1: number }[]
  tuningHeatmap: {
    depths: number[]
    leaves: number[]
    scores: (number | null)[][]
    best: { maxDepth: number; minSamplesLeaf: number; cvF1: number }
    chosen: { maxDepth: number; minSamplesLeaf: number }
  }
  linearRegression: {
    xLabel: string
    yLabel: string
    points: { x: number; y: number }[]
    slope: number
    intercept: number
    r2: number
    mae: number
    mse: number
    rmse: number
  }
  knn: {
    xLabel: string
    yLabel: string
    points: { x: number; y: number; label: number }[]
  }
  kmeans: {
    k: number
    xLabel: string
    yLabel: string
    points: { x: number; y: number; cluster: number }[]
    centers: { x: number; y: number; cluster: number }[]
    clusterStats: {
      cluster: number
      count: number
      failures: number
      failureRate: number
      meanRpm: number
      meanTorque: number
      meanWear: number
    }[]
  }
  target: {
    classBalance: { healthy: number; failure: number }
    sensorMeans: Record<string, { healthy: number; failure: number }>
    toolWearBins: { label: string; count: number; failures: number; failureRate: number }[]
  }
}
