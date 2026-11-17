const nf = new Intl.NumberFormat('es-AR')

export function formatNumber(value: number, digits = 0): string {
  return nf.format(Number(value.toFixed(digits)))
}

export function formatDecimal(value: number, digits = 4): string {
  return value.toLocaleString('es-AR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

export function formatPercent(value: number, digits = 1): string {
  return `${formatDecimal(value * 100, digits)}%`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
