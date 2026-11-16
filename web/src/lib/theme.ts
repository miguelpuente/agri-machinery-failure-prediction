import type { WeekNumber } from '../types'

export const WEEK_THEME: Record<
  WeekNumber,
  { text: string; soft: string; border: string; bar: string; dot: string }
> = {
  1: {
    text: 'text-sion',
    soft: 'bg-sion/10',
    border: 'border-sion/30',
    bar: 'bg-sion',
    dot: 'bg-sion',
  },
  2: {
    text: 'text-cyan-300',
    soft: 'bg-cyan-400/10',
    border: 'border-cyan-400/30',
    bar: 'bg-cyan-400',
    dot: 'bg-cyan-400',
  },
  3: {
    text: 'text-lime-300',
    soft: 'bg-lime-400/10',
    border: 'border-lime-400/30',
    bar: 'bg-lime-400',
    dot: 'bg-lime-400',
  },
  4: {
    text: 'text-amber-300',
    soft: 'bg-amber-400/10',
    border: 'border-amber-400/30',
    bar: 'bg-amber-400',
    dot: 'bg-amber-400',
  },
}

export const BRAND = {
  name: 'Sion Machine Learning',
  short: 'Sion ML',
  project: 'Mantenimiento predictivo sobre AI4I',
  repository: 'https://github.com/miguelpuente/agri-machinery-failure-prediction',
  site: 'https://sion.net.ar',
  dataset: 'https://archive.ics.uci.edu/dataset/601/ai4i+2020+predictive+maintenance+dataset',
} as const
