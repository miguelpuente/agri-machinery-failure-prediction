import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

import type { LabId } from '../../types'

type LabComponent = ComponentType | LazyExoticComponent<ComponentType>

function lazyLab<T extends Record<string, ComponentType>>(
  loader: () => Promise<T>,
  name: keyof T,
): LazyExoticComponent<ComponentType> {
  return lazy(async () => {
    const module = await loader()
    return { default: module[name] }
  })
}

const dataPrepLabs = () => import('./DataPrepLabs')
const regressionLabs = () => import('./RegressionLabs')
const classificationLabs = () => import('./ClassificationLabs')
const neighborTreeLabs = () => import('./NeighborTreeLabs')
const clusteringLabs = () => import('./ClusteringLabs')
const pipelineLabs = () => import('./PipelineLabs')

export const LAB_COMPONENTS: Record<LabId, LabComponent> = {
  'pandas-inspector': lazyLab(dataPrepLabs, 'PandasInspectorLab'),
  'nulls-imputation': lazyLab(dataPrepLabs, 'NullsImputationLab'),
  'feature-engineering': lazyLab(dataPrepLabs, 'FeatureEngineeringLab'),
  'categorical-encoding': lazyLab(dataPrepLabs, 'CategoricalEncodingLab'),
  'feature-scaling': lazyLab(dataPrepLabs, 'FeatureScalingLab'),
  'train-test-leakage': lazyLab(dataPrepLabs, 'TrainTestLeakageLab'),
  'linear-regression-fit': lazyLab(regressionLabs, 'LinearRegressionFitLab'),
  'regression-metrics': lazyLab(regressionLabs, 'RegressionMetricsLab'),
  'target-diagnostics': lazyLab(regressionLabs, 'TargetDiagnosticsLab'),
  'logistic-sigmoid': lazyLab(regressionLabs, 'LogisticSigmoidLab'),
  'confusion-matrix': lazyLab(classificationLabs, 'ConfusionMatrixLab'),
  'imbalanced-metrics': lazyLab(classificationLabs, 'ImbalancedMetricsLab'),
  'knn-canvas': lazyLab(neighborTreeLabs, 'KnnCanvasLab'),
  'knn-scaling': lazyLab(neighborTreeLabs, 'KnnScalingLab'),
  'decision-tree-depth': lazyLab(neighborTreeLabs, 'DecisionTreeDepthLab'),
  'random-forest-ensemble': lazyLab(neighborTreeLabs, 'RandomForestEnsembleLab'),
  'kmeans-stepper': lazyLab(clusteringLabs, 'KmeansStepperLab'),
  'kmeans-real': lazyLab(clusteringLabs, 'KmeansRealLab'),
  'pre-entrega-checklist': lazyLab(pipelineLabs, 'PreEntregaChecklistLab'),
  'sklearn-pipeline': lazyLab(pipelineLabs, 'SklearnPipelineLab'),
  'gridsearch-heatmap': lazyLab(pipelineLabs, 'GridsearchHeatmapLab'),
  'joblib-serialization': lazyLab(pipelineLabs, 'JoblibSerializationLab'),
  'model-comparison': lazyLab(pipelineLabs, 'ModelComparisonLab'),
  'final-project': lazyLab(pipelineLabs, 'FinalProjectLab'),
}
