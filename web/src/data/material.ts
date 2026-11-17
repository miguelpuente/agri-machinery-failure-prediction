export interface MaterialItem {
  id: string
  kind: 'Clase' | 'Programa' | 'Consigna'
  order: number
  title: string
  pdf: string
  markdown: string
  pages: number
  sizeMb: number
}

const CLASSES: Omit<MaterialItem, 'kind' | 'pdf' | 'markdown' | 'pages' | 'sizeMb'>[] = [
  { id: 'clase-01', order: 1, title: 'Conceptos básicos' },
  { id: 'clase-02', order: 2, title: 'Módulos y datos' },
  { id: 'clase-03', order: 3, title: '¿Qué es Machine Learning?' },
  { id: 'clase-04', order: 4, title: 'Transformación de datos: el primer paso hacia el modelo' },
  { id: 'clase-05', order: 5, title: 'División y validación del dataset' },
  { id: 'clase-06', order: 6, title: 'Predecir con regresión lineal' },
  { id: 'clase-07', order: 7, title: 'Regresión logística' },
  { id: 'clase-08', order: 8, title: 'K-Nearest Neighbors' },
  { id: 'clase-09', order: 9, title: 'Árboles de decisión' },
  { id: 'clase-10', order: 10, title: 'Random Forest' },
  { id: 'clase-11', order: 11, title: 'Introducción al clustering' },
  { id: 'clase-12', order: 12, title: 'Creación de pipelines' },
  { id: 'clase-13', order: 13, title: 'Comparativa y evaluación de modelos' },
  {
    id: 'clase-14',
    order: 14,
    title: 'Proyecto guiado (Parte 1): exploración, limpieza y preprocesamiento',
  },
  {
    id: 'clase-15',
    order: 15,
    title: 'Proyecto guiado (Parte 2): modelado, evaluación y cierre',
  },
  { id: 'clase-16', order: 16, title: 'Cierre y proyección: lo aprendido y lo que viene' },
]

const CLASS_META: Record<
  string,
  { pages: number; sizeMb: number }
> = {
  'clase-01': { pages: 14, sizeMb: 6.6 },
  'clase-02': { pages: 12, sizeMb: 6.2 },
  'clase-03': { pages: 13, sizeMb: 6.1 },
  'clase-04': { pages: 15, sizeMb: 6.2 },
  'clase-05': { pages: 11, sizeMb: 6.1 },
  'clase-06': { pages: 13, sizeMb: 6.6 },
  'clase-07': { pages: 13, sizeMb: 6.4 },
  'clase-08': { pages: 11, sizeMb: 6.3 },
  'clase-09': { pages: 11, sizeMb: 8.7 },
  'clase-10': { pages: 10, sizeMb: 6.0 },
  'clase-11': { pages: 13, sizeMb: 6.8 },
  'clase-12': { pages: 11, sizeMb: 6.2 },
  'clase-13': { pages: 11, sizeMb: 7.6 },
  'clase-14': { pages: 11, sizeMb: 7.3 },
  'clase-15': { pages: 9, sizeMb: 7.0 },
  'clase-16': { pages: 6, sizeMb: 6.9 },
}

export const MATERIAL: MaterialItem[] = [
  ...CLASSES.map((item) => ({
    ...item,
    kind: 'Clase' as const,
    pdf: `/docs/ml-${item.id}.pdf`,
    markdown: `ML CLASE _ ${item.id.slice(-2)}.md`,
    ...CLASS_META[item.id],
  })),
  {
    id: 'plan-de-estudios',
    kind: 'Programa',
    order: 90,
    title: 'Plan de estudios 2026',
    pdf: '/docs/plan-de-estudios.pdf',
    markdown: 'Talento Tech -Machine learning.md',
    pages: 15,
    sizeMb: 1.4,
  },
  {
    id: 'preentrega',
    kind: 'Consigna',
    order: 91,
    title: 'Proyecto Integrador · Preentrega (borrador)',
    pdf: '/docs/preentrega.pdf',
    markdown: 'Preentrega(BORRADOR).md',
    pages: 2,
    sizeMb: 0.3,
  },
]

export const MATERIAL_TOTAL_MB = Number(
  MATERIAL.reduce((total, item) => total + item.sizeMb, 0).toFixed(1),
)

const DOCS_BASE =
  'https://github.com/miguelpuente/agri-machinery-failure-prediction/blob/main/docs/'

export function docsMarkdownUrl(file: string): string {
  return `${DOCS_BASE}${file.split('/').map(encodeURIComponent).join('/')}`
}
