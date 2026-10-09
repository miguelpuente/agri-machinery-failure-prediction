# Predicción de fallas en maquinaria agropecuaria

Proyecto integrador de Machine Learning: preparar un pipeline reproducible para
analizar datos de mantenimiento predictivo. La Pre-Entrega contempla selección
del dataset, análisis exploratorio, limpieza, transformaciones, selección de
variables y separación de entrenamiento y prueba. El entrenamiento de modelos
queda fuera de esta etapa.

## Inicio rápido

Se requiere Python 3.11 o superior y uv; el entorno recomendado usa Python 3.12.

```bash
uv sync
uv run pytest
uv run python scripts/download_dataset.py
```

La descarga guarda el CSV en `data/raw/ai4i2020.csv`. Si ya existe, se reutiliza
sin descargarlo nuevamente. Tras la descarga, ejecutar `uv run pytest` también
verifica los nombres de columnas contra el archivo real.

**Estado actual:** las seis secciones de la Pre-Entrega están implementadas en
módulos Python y verificadas con pruebas. El notebook de entrega contiene texto
explicativo, resultados reales y figuras incorporadas; no se entrena ningún modelo.

Tras descargar el CSV, regenerar el artefacto con:

```bash
uv run python -m agrofail.report
```

El comando escribe `notebooks/preentrega.ipynb` y las figuras en
`notebooks/figures/`. Las imágenes también quedan embebidas en el notebook, que
puede leerse sin ejecutar sus celdas. El notebook es un artefacto generado, no un
archivo de trabajo: los cambios se realizan en los módulos Python y se regenera.

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
| scikit-learn | Transformaciones y separación de datos |
| Matplotlib | Visualizaciones exploratorias |
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
src/agrofail/report.py       Generación del notebook de entrega
notebooks/preentrega.ipynb   Artefacto generado con resultados y anexo
tests/                      Pruebas del paquete
data/raw/                   Datos originales, excluidos de Git
data/processed/             Datos preparados, excluidos de Git
```

## Próximo paso

Revisar el notebook generado y su anexo para la entrega del curso. La división
estratificada ocurre antes de ajustar codificación y escalado: sus parámetros se
aprenden únicamente en entrenamiento y se reutilizan en prueba para evitar fuga
de información. El entrenamiento y la evaluación de modelos quedan para una
etapa posterior.
