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

**Estado actual:** estructura inicial con pruebas de importación y configuración.
Las funciones del pipeline son firmas pendientes de implementación y lanzan
`NotImplementedError`; todavía no existe un pipeline ejecutable completo.

## Dataset y alcance

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
src/agrofail/report.py       Generación futura del notebook de entrega
tests/                      Pruebas del paquete
data/raw/                   Datos originales, excluidos de Git
data/processed/             Datos preparados, excluidos de Git
```

## Próximo paso

Implementar las seis etapas en módulos Python y generar el notebook `.ipynb`
de entrega desde el pipeline mediante `report.py`. Los notebooks no se utilizan
como archivos de trabajo. Las transformaciones que aprendan parámetros deberán
ajustarse únicamente con datos de entrenamiento para evitar fuga de información.
