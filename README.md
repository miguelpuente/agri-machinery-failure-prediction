# Predicción de fallas en maquinaria agropecuaria

Proyecto integrador de Machine Learning: un pipeline reproducible de mantenimiento
predictivo que recorre el ciclo completo — selección del dataset, análisis exploratorio,
limpieza, transformaciones, selección de variables, separación train/test, y modelado
comparado con ajuste de hiperparámetros. Las dos entregas del curso se generan como
notebooks funcionales desde código de producción, verificado con pruebas automatizadas.

## Entregas

| Entrega | Contenido | Abrir |
|---|---|---|
| **Pre-Entrega** | Las seis secciones de la consigna: dataset, EDA, limpieza, transformaciones, selección de variables y split — con anexo de fuentes | [Colab](https://colab.research.google.com/github/miguelpuente/agri-machinery-failure-prediction/blob/main/notebooks/preentrega.ipynb) · [código](notebooks/preentrega.ipynb) |
| **Entrega Final** | El ciclo completo más modelado: métricas, matrices de confusión, curvas ROC, comparación, tuning con validación cruzada, hallazgos y recomendaciones | [Colab](https://colab.research.google.com/github/miguelpuente/agri-machinery-failure-prediction/blob/main/notebooks/entrega-final.ipynb) · [código](notebooks/entrega-final.ipynb) |

En Colab: **Entorno de ejecución → Ejecutar todas**. La primera celda instala el
proyecto desde GitHub y descarga el dataset oficial; no hace falta clonar nada.

## Resultados

Dataset AI4I 2020 (10.000 filas, objetivo `Machine failure`, ~3,4% positivo).
Test estratificado: 2.000 filas / **68 fallas**. Las fallas perdidas (fn) son el
error caro en mantenimiento: cada una es una parada no planificada.

| Modelo | F1 | ROC-AUC | Fallas perdidas |
|---|---:|---:|---:|
| Regresión Logística | 0,1772 | 0,8996 | 61 de 68 |
| Random Forest (default) | 0,6286 | 0,9653 | 35 de 68 |
| Árbol de Decisión (prof. 4) | 0,3095 | 0,8668 | 55 de 68 |
| **Árbol de Decisión tuneado** | **0,7581** | 0,8877 | **21 de 68** |

**Modelo elegido: Árbol de Decisión** (max_depth=8, min_samples_leaf=3), con F1 de
validación cruzada **0,7096 ± 0,0436**. Dos lecciones sostienen la elección: el
*accuracy* engaña con targets desbalanceados (la regresión logística acierta 96,7%
y detecta 7 de 68 fallas), y el ajuste de hiperparámetros cambió el ganador respecto
de los valores por defecto.

## Inicio rápido

Se requiere Python 3.11 o superior y uv; el entorno recomendado usa Python 3.12.

```bash
uv sync
uv run pytest
uv run python scripts/download_dataset.py
```

La descarga guarda el CSV en `data/raw/ai4i2020.csv` con publicación atómica: si ya
existe, se reutiliza; si una descarga se interrumpe, no queda cache corrupta. Tras
descargar, `uv run pytest` verifica los nombres de columnas contra el archivo real.

Regenerar ambas entregas con:

```bash
uv run python -m agrofail.report
```

Escribe `notebooks/preentrega.ipynb`, `notebooks/entrega-final.ipynb` y las figuras
en `notebooks/figures/`. Los selectores `--pre` y `--final` regeneran una sola entrega.
Las imágenes quedan embebidas en los notebooks, que pueden leerse sin ejecutar sus
celdas. **Cada notebook es un artefacto generado, no un archivo de trabajo:** los
cambios se hacen en los módulos Python y se regenera.

Para ejecutar las celdas fuera de Colab, instalar el runtime opcional con
`uv sync --extra notebook` y usar `.venv/bin/python` como kernel, con la raíz del
repositorio como directorio de trabajo.

## Dataset y alcance (anexo de fuentes y referencias)

- **Fuente:** AI4I 2020 Predictive Maintenance Dataset, UCI, identificador 601.
  [Página del dataset](https://archive.ics.uci.edu/dataset/601/ai4i+2020+predictive+maintenance+dataset).
- **Descarga:** [archivo ZIP oficial](https://archive.ics.uci.edu/static/public/601/ai4i+2020+predictive+maintenance+dataset.zip).
- **Licencia:** [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- **Cita:** Matzka, S. (2020). *AI4I 2020 Predictive Maintenance Dataset*.
  UCI Machine Learning Repository. DOI: [10.24432/C5HS5C](https://doi.org/10.24432/C5HS5C).

El dataset sintético representa mantenimiento industrial, no observaciones de
equipos agropecuarios. Sus variables de temperatura, velocidad, torque y desgaste
permiten estudiar un problema análogo al mantenimiento de maquinaria agrícola;
este encuadre es didáctico y no demuestra validez operativa en el sector.

La variable objetivo es `Machine failure`. Las columnas `TWF`, `HDF`, `PWF`,
`OSF` y `RNF` describen modos de falla y revelan información del objetivo:
deben excluirse de los predictores para evitar fuga de información. `UDI` y
`Product ID` son identificadores, no variables predictoras propuestas.

## Herramientas y estructura

| Herramienta | Uso previsto |
|---|---|
| uv | Entorno y dependencias |
| Polars y PyArrow | Tablas y archivos de datos |
| scikit-learn | Transformaciones, modelos, métricas y GridSearchCV |
| Matplotlib | EDA, matrices de confusión y curvas ROC |
| nbformat y Jupytext | Generación del artefacto de entrega |
| pytest y Ruff | Pruebas y revisión estática |

```text
scripts/download_dataset.py  Descarga reproducible del dataset
src/agrofail/config.py       Rutas, esquema y constantes
src/agrofail/load.py         1. Selección y carga
src/agrofail/eda.py          2. Análisis exploratorio
src/agrofail/clean.py        3. Limpieza
src/agrofail/features.py     4. Transformaciones
src/agrofail/select.py       5. Selección de variables
src/agrofail/split.py        6. Separación de entrenamiento y prueba
src/agrofail/models.py       Regresión logística, Random Forest y árbol de decisión
src/agrofail/metrics.py      Accuracy, precisión, recall, F1 y ROC-AUC
src/agrofail/compare.py      Comparación y elección según los cinco criterios de clase
src/agrofail/tuning.py       GridSearchCV y estabilidad del F1 entre pliegues
src/agrofail/report.py       Generación de ambas entregas
notebooks/preentrega.ipynb   Preparación de datos y anexo
notebooks/entrega-final.ipynb Modelado, ajuste, conclusiones y anexo
tests/                       Pruebas del paquete (136)
data/raw/                    Datos originales, excluidos de Git
data/processed/              Datos preparados, excluidos de Git
```

## Rigor y límites declarados

La división estratificada ocurre antes de ajustar codificación y escalado: sus
parámetros se aprenden únicamente en entrenamiento y se reutilizan en prueba para
evitar fuga de información. En la búsqueda de hiperparámetros, one-hot y escalado se
aprenden **dentro de cada pliegue**. La selección prioriza F1 (ante el desbalance),
luego ROC-AUC y accuracy; se reportan parámetros ganadores y la media y desviación
del F1 entre pliegues.

La variación de CV mide estabilidad interna, no robustez entre equipos o temporadas.
Los mismos pliegues seleccionan hiperparámetros, y test participa en la elección
entre modelos: ninguno constituye una auditoría final independiente. Antes de usar
las alertas en campo, validar con datos agrícolas nuevos y cuantificar costos de
fallas omitidas y falsas alarmas; no se optimizaron umbrales ni se validó uso operativo.
