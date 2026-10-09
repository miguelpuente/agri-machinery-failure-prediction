# Agri failure prediction — Entrega Final modeling

## Objective

Extend the completed Pre-Entrega pipeline into the Proyecto Final Integrador: train and compare supervised binary classifiers for `Machine failure`, evaluate them with the course metrics, select and justify a final model, and present findings and recommendations in a complete delivery notebook.

## Problem and scope

- The data pipeline (consigna sections 1-6) is complete and verified (96 tests): `load`, `eda`, `clean`, `features`, `select`, `split`, `report`, plus the hardened dataset downloader.
- This feature adds the modeling lifecycle defined by the syllabus ("la elección e implementación de uno o más modelos adecuados, la evaluación de los resultados mediante métricas pertinentes y la presentación final de los hallazgos y recomendaciones") and by the clase 15 template (guided project part 2).
- Models to compare (clase 15): at least **Logistic Regression** and **Random Forest**; optionally a third basic approach (**KNN** or a simple **Decision Tree**).
- Evaluation (clase 15 steps): accuracy, precision, recall, F1-score, confusion matrix, ROC curves, a comparative metrics table, and a justified model choice considering performance, error types, stability, interpretability and fit to the maintenance domain.
- In scope if requested: sklearn `Pipeline` composition and `GridSearchCV` hyperparameter tuning with cross-validation (syllabus competency).
- Out of scope: unsupervised clustering (K-Means) and any deployment work unless explicitly requested.

## Authority and conventions

- User authorized starting the Entrega Final ("Empezar la Entrega Final").
- Chain: continue the chosen `feature-branch-chain` strategy (never mix strategies); the existing chain (PRs #1-#8) delivers the Pre-Entrega, and this feature extends it with new child slices.
- Route: delegated direct (one bounded writer per task slice); the parent maintains this document, its Engram mirror, and the work-unit commits.
- TDD: default ODD test-first policy. Runner: `uv run pytest`.
- Native review: the runtime blockage (`immutable_review_transport_unsupported`) is unresolved and the user chose `continue_without_reporting`, so slices are delivered without native review until it resolves; assessed tier stays `unavailable`.
- Stack (unchanged): uv, polars, scikit-learn, matplotlib, pytest, ruff; Python without notebooks as work files; generated notebooks carry the Spanish delivery text.

## Tasks

- [x] M1: `models.py` — train and compare the supervised classifiers (Logistic Regression, Random Forest, optional KNN/Decision Tree) on the selected features, using sklearn pipelines fitted on training data only.
- [x] M2: `metrics.py` — accuracy, precision, recall, F1, confusion matrix and ROC curve/AUC as typed results computed from real runs.
- [ ] M3: comparative metrics table and a written model choice covering the clase-15 criteria (performance, errors, stability, interpretability, domain fit).
- [ ] M4: `report.py` extended to generate `notebooks/entrega-final.ipynb` — the complete lifecycle plus the modeling sections, findings and recommendations in Spanish.
- [ ] M5: hyperparameter tuning with `GridSearchCV` and cross-validation (syllabus competency).
- [ ] M6: full verification run and README update.

## Acceptance criteria

- The full suite stays green and grows with each module.
- At least two supervised classifiers are trained and compared on the same held-out test set.
- Metrics tables, confusion matrices and ROC curves come from real runs, never placeholders.
- The delivery notebook presents the complete lifecycle with findings and recommendations.
- The final model choice is justified in writing against the clase-15 criteria.

## Progress and evidence

- M1+M2 done: `3d8d43f` adds `models.py` (typed `train_models` training Logistic Regression, Random Forest and a depth-4 Decision Tree as sklearn pipelines with `RANDOM_STATE`, training-only fitting, polars/numpy boundary) and `metrics.py` (`evaluate_model` -> typed `ModelMetrics` with accuracy/precision/recall/F1, explicit tn/fp/fn/tp, ROC points and ROC-AUC, documented `zero_division` policy and rejection of single-class targets). Tests: `tests/test_models.py` (fitted pipelines, reproducibility, input preservation, training-only scaling) and `tests/test_metrics.py` (hand-computed scores, exact confusion counts, perfect ranking 1.0, edge cases, held-out evaluation without refitting). Observed: RED `ModuleNotFoundError` x2 then GREEN `110 passed`, refined to `111 passed`; `uv run ruff check .` clean; `uv run ruff format --check src tests` clean. Route: delegated direct (one bounded writer).

## Next step

M3 — comparative metrics table and the written model choice (clase-15 criteria).
