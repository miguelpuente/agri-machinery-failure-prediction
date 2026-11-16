import type { ComponentType } from 'react'

import type { LabId } from '../../types'
import {
  CategoricalEncodingLab,
  FeatureEngineeringLab,
  FeatureScalingLab,
  NullsImputationLab,
  PandasInspectorLab,
  TrainTestLeakageLab,
} from './DataPrepLabs'
import {
  LinearRegressionFitLab,
  LogisticSigmoidLab,
  RegressionMetricsLab,
  TargetDiagnosticsLab,
} from './RegressionLabs'
import { ConfusionMatrixLab, ImbalancedMetricsLab } from './ClassificationLabs'
import {
  DecisionTreeDepthLab,
  KnnCanvasLab,
  KnnScalingLab,
  RandomForestEnsembleLab,
} from './NeighborTreeLabs'
import { KmeansRealLab, KmeansStepperLab } from './ClusteringLabs'
import {
  FinalProjectLab,
  GridsearchHeatmapLab,
  JoblibSerializationLab,
  ModelComparisonLab,
  PreEntregaChecklistLab,
  SklearnPipelineLab,
} from './PipelineLabs'

export const LAB_COMPONENTS: Record<LabId, ComponentType> = {
  'pandas-inspector': PandasInspectorLab,
  'nulls-imputation': NullsImputationLab,
  'feature-engineering': FeatureEngineeringLab,
  'categorical-encoding': CategoricalEncodingLab,
  'feature-scaling': FeatureScalingLab,
  'train-test-leakage': TrainTestLeakageLab,
  'linear-regression-fit': LinearRegressionFitLab,
  'regression-metrics': RegressionMetricsLab,
  'target-diagnostics': TargetDiagnosticsLab,
  'logistic-sigmoid': LogisticSigmoidLab,
  'confusion-matrix': ConfusionMatrixLab,
  'imbalanced-metrics': ImbalancedMetricsLab,
  'knn-canvas': KnnCanvasLab,
  'knn-scaling': KnnScalingLab,
  'decision-tree-depth': DecisionTreeDepthLab,
  'random-forest-ensemble': RandomForestEnsembleLab,
  'kmeans-stepper': KmeansStepperLab,
  'kmeans-real': KmeansRealLab,
  'pre-entrega-checklist': PreEntregaChecklistLab,
  'sklearn-pipeline': SklearnPipelineLab,
  'gridsearch-heatmap': GridsearchHeatmapLab,
  'joblib-serialization': JoblibSerializationLab,
  'model-comparison': ModelComparisonLab,
  'final-project': FinalProjectLab,
}
