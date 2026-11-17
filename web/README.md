# Sion Machine Learning · sitio interactivo

SPA estática con 24 laboratorios interactivos de mantenimiento predictivo sobre el dataset
AI4I 2020. Replica la experiencia de un calendario de aprendizaje, pero con la identidad
institucional de SION y con los datos, métricas y notebooks reales de este repositorio.

- 24 días / 4 semanas, todos abiertos.
- Cada día: concepto, código Python, laboratorio interactivo, quiz, reto y notebook.
- Progreso en `localStorage`, exportación JSON, enlaces compartibles `?dia=N`.
- Sin backend, sin secretos y sin telemetría.

## Stack

React 19 + Vite + TypeScript + Tailwind CSS 4. Vitest para pruebas unitarias y Playwright
para el smoke test. La identidad visual usa los tokens de SION: fondo `#05080D`, teal
`#00D1B2`, profundo `#00766B`, Inter + Outfit self-hosted (sin Google Fonts en runtime).
Los labs se cargan por chunks: el home no descarga los componentes de los 24 días.

## Inicio rápido

```bash
cd web
npm install
npm run dev
```

Abrir `http://localhost:5173` (o el puerto que indique Vite).

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Typecheck (`tsc -b`) + build de producción en `dist/` |
| `npm run preview` | Sirve el build de producción |
| `npm run test` | Vitest: progreso, contenido y matemática de los labs |
| `npm run test:watch` | Vitest en modo watch |
| `npm run lint` | Oxlint |
| `npm run verify` | `test` + `build` + `lint` |
| `npm run smoke` | Playwright: rendering de los 24 labs, progreso, import/export, share, foco y overflow móvil |
| `npm run audit` | axe-core: accesibilidad y overflow en 5 vistas × desktop/mobile |

El smoke test y la auditoría necesitan el servidor de desarrollo corriendo en
`http://localhost:4173` (o definir `BASE_URL`):

```bash
npm run dev -- --port 4173
npm run smoke
npm run audit
```

La CI de GitHub está bloqueada por el guard de la factory: no hay runner self-hosted
online para este repo (`can-reenable-ci.py` devuelve exit 1). Por eso `verify`, `smoke` y
`audit` son gates locales hasta que se habilite un runner.

## Datos reales

`src/data/ai4i.json` **no se edita a mano**. Se genera desde el CSV oficial con el mismo
pipeline Python que produce las entregas:

```bash
# desde la raíz del repositorio
uv run python scripts/export_web_data.py
uv run pytest tests/test_web_data.py -q
```

El script escribe muestras, estadísticas, correlaciones, métricas de los modelos,
matrices de confusión, puntos ROC, grilla de GridSearchCV, importancia de variables,
clústeres y la regresión de temperatura. Las cifras del sitio quedan atadas al proyecto:
test de 2.000 filas con 68 fallas, F1 del árbol tuneado 0,7581 y CV 0,7096 ± 0,0436.

Para verificar que el JSON committed sigue al día sin reescribirlo:

```bash
uv run python scripts/export_web_data.py --check
```

## Estructura

```text
web/
├── src/
│   ├── App.tsx                 Shell: progreso, filtros, modal y URL
│   ├── data/
│   │   ├── days.ts             24 días: copy, código, quiz, retos y links
│   │   └── ai4i.json           Datos generados por el pipeline
│   ├── components/
│   │   ├── labs/               24 laboratorios interactivos
│   │   └── ...                 Header, hero, calendario, modal, quiz, share
│   └── lib/                    Progreso, formato y matemática de los labs
├── scripts/smoke.mjs           Verificación end-to-end
└── vite.config.ts              Vite + Tailwind + Vitest
```

## Deploy

El build es completamente estático y usa `base: './'`, así que puede servirse en un
subdirectorio o detrás de SION sin cambiar código.

El camino elegido es **SION**: un contenedor nginx `chiqui_web` en `sion-oracle`, dentro
de la red existente `sion_frontend`, publicado como `chiqui.sion.net.ar` por el tunnel
`apps-sion`. El runbook completo está en [`deploy/README.md`](deploy/README.md); incluye
build arm64, compose, tunnel/DNS, headers, Uptime Kuma, verificación y rollback.

El `netlify.toml` de la raíz queda como fallback opcional y **no** aplica a SION. El deploy
no está autorizado por este documento: publicar requiere una decisión explícita del
usuario y la credencial correspondiente.

## Límites

AI4I es un dataset industrial sintético. El encuadre agropecuario es didáctico y no
demuestra validez operativa en campo. Las métricas provienen del split de test del
proyecto; no son una auditoría independiente ni una validación agrícola. Antes de usar
alertas en producción hay que validar con datos nuevos y cuantificar el costo de las
fallas omitidas y de las falsas alarmas.

## Referencias

- Documento de tarea: [`../odd/tasks/sion-machine-learning.md`](../odd/tasks/sion-machine-learning.md)
- Proyecto y notebooks: <https://github.com/miguelpuente/agri-machinery-failure-prediction>
- Dataset: <https://archive.ics.uci.edu/dataset/601/ai4i+2020+predictive+maintenance+dataset>
