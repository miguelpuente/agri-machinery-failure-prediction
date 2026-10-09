"""Assignment section 4: train-fitted, non-mutating feature transformations.

One-hot encoding avoids imposing an order on machine Type. Keep all learned
categories; unseen categories map to all zeros, with no output schema changes.
StandardScaler centres sensors and scales by training population standard
deviation, making their different physical units comparable. Constant sensors
use a scale of one. Neither transformation clips new sensor readings.

Output contains only configured numeric predictors, encoded categorical
predictors and the unchanged target, in that order. Identifiers and failure-mode
labels are explicitly excluded: identifiers are not sensor measurements and
failure modes expose the target. Unconfigured columns are also excluded rather
than silently introducing predictors. No speculative engineered features are
created; one-hot indicator columns are the only new variables.

Split before fitting in an evaluation pipeline. Fit on the training partition
only and reuse its transformer for validation/test partitions. This module does
not split, select variables, learn imputation statistics or train models.
"""

from dataclasses import dataclass

import numpy as np
import polars as pl
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from agrofail import config


@dataclass(frozen=True)
class FeatureTransformer:
    """Hold training-fitted objects and the stable output schema for reuse.

    Obtain this container through ``fit_encode_and_scale``. Treat its sklearn
    objects as read-only after fitting; freezing the container does not freeze
    the estimators themselves. Output column names include the unchanged target.
    """

    encoder: OneHotEncoder
    scaler: StandardScaler
    output_columns: tuple[str, ...]


def _validate_frame(df: pl.DataFrame) -> None:
    required = [config.TARGET_COLUMN, *config.NUMERIC_COLUMNS, *config.CATEGORICAL_COLUMNS]
    missing = [column for column in required if column not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns: {missing}")
    predictors = df.select(*config.NUMERIC_COLUMNS, *config.CATEGORICAL_COLUMNS)
    if any(predictors.null_count().row(0)):
        raise ValueError("Predictors contain missing values; clean the data before transforming")
    if not all(df.schema[column].is_numeric() for column in config.NUMERIC_COLUMNS):
        raise ValueError("Sensor columns must be numeric")
    if not np.isfinite(df.select(config.NUMERIC_COLUMNS).to_numpy()).all():
        raise ValueError("Sensor values must be finite")


def fit_encode_and_scale(train_df: pl.DataFrame) -> FeatureTransformer:
    """Learn one-hot categories and sensor scaling from training rows only.

    Require a nonempty frame with the target and all configured predictors.
    Predictors must be non-null and sensors finite and numeric; no imputation
    occurs. Ignore identifiers, failure-mode labels and unconfigured columns.
    Never fit on the full dataset before an evaluation split. Do not mutate
    the frame or use the target to learn any transformation parameters.
    """
    _validate_frame(train_df)
    if train_df.is_empty():
        raise ValueError("Cannot fit feature transformations on an empty training frame")

    encoder = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
    encoder.fit(train_df.select(config.CATEGORICAL_COLUMNS).to_numpy())
    scaler = StandardScaler()
    scaler.fit(train_df.select(config.NUMERIC_COLUMNS).to_numpy())
    output_columns = (
        *config.NUMERIC_COLUMNS,
        *encoder.get_feature_names_out(config.CATEGORICAL_COLUMNS).tolist(),
        config.TARGET_COLUMN,
    )
    return FeatureTransformer(encoder=encoder, scaler=scaler, output_columns=output_columns)


def apply_encode_and_scale(df: pl.DataFrame, transformer: FeatureTransformer) -> pl.DataFrame:
    """Apply training parameters without refitting and preserve the target exactly.

    Return a new Polars frame in input row order, dropping identifiers and
    leakage-bearing failure modes by retaining only the configured predictors
    and target. Unknown categories yield all-zero indicators. Sensor values
    use training means/scales, not this frame's statistics. Require non-null
    predictors and finite numeric sensors; accept empty frames with a valid
    input schema. Do not mutate either the input or the fitted estimators.
    """
    _validate_frame(df)
    feature_columns = transformer.output_columns[:-1]
    if df.is_empty():
        features = pl.DataFrame(schema={column: pl.Float64 for column in feature_columns})
    else:
        numeric = transformer.scaler.transform(df.select(config.NUMERIC_COLUMNS).to_numpy())
        categorical = transformer.encoder.transform(
            df.select(config.CATEGORICAL_COLUMNS).to_numpy()
        )
        features = pl.DataFrame(
            np.concatenate((numeric, categorical), axis=1),
            schema=list(feature_columns),
            orient="row",
        )
    return features.with_columns(df[config.TARGET_COLUMN])
