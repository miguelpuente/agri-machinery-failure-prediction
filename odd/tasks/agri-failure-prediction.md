# Agri machinery failure prediction — Pre-Entrega pipeline

## Objective

Build the course Pre-Entrega as a modern Python project: an executable pipeline implementing the six required sections (dataset selection, EDA, cleaning, transformations, variable selection, train/test split) over the AI4I 2020 predictive-maintenance dataset, framed for agricultural machinery, plus a generated Jupyter notebook as the delivery artifact.

## Problem and scope

- Problem: predict machine failures (binary `Machine failure`) from operational variables — torque, tool wear, air/process temperature, rotational speed — which transfer directly to tractors and harvesters.
- Dataset: AI4I 2020 Predictive Maintenance (UCI id=601, CC BY 4.0, 10,000 rows, 14 columns). No public tabular agricultural-machinery failure dataset exists; the framing justification is documented for consigna section 1 and the notebook annex.
- Stack (user decision): uv, polars, scikit-learn, matplotlib, pyarrow, nbformat/jupytext, pytest, ruff. Python without notebooks as the work environment; the `.ipynb` required by the consigna is a generated artifact with Spanish explanatory text and English identifiers.
- Structure: `src/agrofail/` modules mapped one to one to the six consigna sections; `data/raw/` stays gitignored behind a reproducible download script.
- Out of scope for this feature: model training and selection (the consigna explicitly excludes them from the Pre-Entrega).

## Authority and conventions

- User authorized: GitHub repository creation (private, `agri-machinery-failure-prediction`, account `miguelpuente`), pushing the existing class documentation, and starting the project scaffold ("OK hazlo").
- Branch: the single local branch `feature/pdf-transcriptions` was renamed to `main` before remote setup so the new repository starts with a sane default branch; scaffold work happens on `feat/agri-failure-prediction`.
- Route: delegated direct (one bounded writer) for the multi-file scaffold; the parent maintains this document, its Engram mirror, and the work-unit commits.
- TDD: default ODD test-first policy — smoke tests observed RED before module creation, then GREEN. Runner: `uv run pytest`. No strict-TDD setting found in the runtime config.
- Delivery strategy: `ask-on-risk`; chain strategy chosen by the user: `feature-branch-chain`. Forecast: roughly 1,200 authored lines across T1-T10; work accumulates in slices of about 400 authored lines before review. Size heuristic is advisory only.

## Tasks

- [x] T1: Create the private GitHub repository and push the class documentation; verify remote and default branch.
- [x] T2: Scaffold the uv project (`pyproject.toml`, `src/agrofail` stubs, smoke tests, README, dataset download script) with pytest and ruff green.
- [x] T3: Real dataset acquisition and `load.py` with schema validation (consigna section 1).
- [x] T4: `eda.py` — distributions, missing values, correlations, basic visualisations (section 2).
- [ ] T5: `clean.py` — nulls, duplicates, outliers (section 3).
- [ ] T6: `features.py` — categorical encoding, numeric scaling, feature creation/removal (section 4).
- [ ] T7: `select.py` — variable selection, dropping the leakage failure-mode columns (section 5).
- [ ] T8: `split.py` — stratified train/test split (section 6).
- [ ] T9: `report.py` — generate the delivery `.ipynb` with Spanish explanatory text and real pipeline outputs.
- [ ] T10: README and dataset annex final pass with a full verification run.
- [ ] T11: Harden the downloader (atomic cache write) and add its behavioral tests (advisory findings `R3-interrupted-download-cache`, `R3-downloader-behavior-unproved`).

## Acceptance criteria

- `uv sync`, `uv run pytest -q` and `uv run ruff check .` succeed from a clean checkout.
- Each consigna section is implemented in its mapped module with at least one deterministic test.
- The generated notebook contains the six required sections with explanatory text and executed outputs.
- Dataset provenance (URL, license, citation) is recorded in the README and the notebook annex.

## Progress and evidence

- T1 done: `https://github.com/miguelpuente/agri-machinery-failure-prediction` created private on account `miguelpuente`; single local branch renamed `feature/pdf-transcriptions` -> `main` and pushed as default; class documentation present on `main`.
- T2 done as a reviewable commit chain (`feature-branch-chain`): `1657d43` build config, `a915f4e` package skeleton with typed stubs and smoke tests, `c489d90` dataset downloader and README, `a5ad56b` formatting guard. Observed verification: `uv sync` ok (46 packages resolved); `uv run python scripts/download_dataset.py` downloaded 10,000 rows to `data/raw/ai4i2020.csv`; `uv run pytest -q` -> `20 passed`; `uv run ruff check .` -> `All checks passed!`. Test-first evidence: RED `ModuleNotFoundError: No module named 'agrofail'`, GREEN `13 passed`, refined to `20 passed`.
- Schema verified against the real CSV header: the identifier column is `UDI` (not `UID`); failure-mode columns `TWF, HDF, PWF, OSF, RNF` confirmed as target leakage candidates.
- Defect found and fixed during normalization: `ruff format` rewrites Python code blocks embedded in Markdown and altered `docs/ML CLASE _ 04.md`, breaking transcription fidelity; the change was reverted and `a5ad56b` excludes `docs`, `odd` and `data` from formatting.
- Native review notes: a first accumulated candidate (1,942 changed lines, of which 1,516 are the generated `uv.lock`) exceeded the reviewer lens context budget (`lens_context_budget_exceeded`); no review authority was created and that candidate is terminal. The branch was re-cut into the chain above under the user-chosen `feature-branch-chain` strategy. Slice assessment now runs per boundary with `--untracked-scope=exclude`; `under_budget` keeps the slice pending until about 400 lines accumulate.
- Native review outcome for the scaffold slice (17 committed paths + 2 intended untracked `.gitkeep`, 426 changed lines): consent `granted`; one selected lens `review-reliability`; result `approved`; acknowledged and authority burned on lineage `review-afee37843e522c5f` (target `sha256:2541c4bb6377c09a606f864ff05862a1e038f51b5962e79f2f8d93a7c62e7f60`, consumed revision `sha256:50dbed532c3afb0c08c467ad8965a55f5bc0b635b194492b4aa7f1a75b3f7bf6`). Reviewed boundary advances past `c9b53b7`.
- Advisory (non-blocking) reliability findings carried as later work in T11: `R3-interrupted-download-cache` (scripts/download_dataset.py:25 — write to a temporary sibling and atomically replace the destination, plus a failure-injection test) and `R3-downloader-behavior-unproved` (scripts/download_dataset.py:15-33 — unit tests with a mocked ZIP response asserting saved bytes, row count and cache reuse).
- `uv.lock` stays untracked (`7ac399e`): generated file, and its 1,516 lines exceed the native lens context budget; `uv sync` regenerates it locally. Pin dependency bounds in `pyproject.toml` later if tighter reproducibility is needed.
- T3 done: `e6427be` implements `load_dataset` (polars, BOM-safe) and `validate_schema` with the exact 14-column check from `config`, naming missing and unexpected columns; `tests/test_load.py` covers synthetic round-trips, BOM CSVs, reordered columns, schema mismatches and the real dataset; `tests/test_imports.py` no longer asserts the loader stub. Observed: RED `10 failed` (stub/AttributeError) then GREEN `10 passed`; full suite `uv run pytest -q` -> `29 passed`; `uv run ruff check .` clean; `uv run ruff format --check src tests` clean. Route: delegated direct (one bounded writer).
- Delivery: PR #1 (scaffold slice) opened as child of the chain (`feat/agri-failure-prediction-01-scaffold` -> `feat/agri-failure-prediction`, label `type:feature`). The tracker PR to `main` stays unopened while the tracker branch has no diff from `main`; it opens when the first child integrates. Issue-first linkage skipped: issue publication stops at the repo's issue-form gate (no YAML Issue Forms; `status:approved` is protected).
- T4 done: `428a040` implements `summarise` (shape, dtypes, null counts, numeric stats with `ddof=1`, target class balance), `correlation_matrix` (labelled Pearson over `config.NUMERIC_COLUMNS`, polars-native), `plot_distributions` and `plot_correlation_heatmap` (headless `Agg` matplotlib); `tests/test_eda.py` has 9 deterministic cases (synthetic frames, NaN/null semantics, empty/all-missing/constant sensors, non-empty plot files) plus the real dataset. Observed: RED `7 failed` then GREEN `37 passed`; `uv run ruff check .` clean; `uv run ruff format --check src tests` clean. Route: delegated direct (one bounded writer). Slice at 388/400 lines: the next work-unit commit reaches the budget and triggers the review consent.

## Next step

T5 — `clean.py`: nulls, duplicates, outliers (consigna section 3).
