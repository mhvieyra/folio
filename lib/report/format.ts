export function formatCurrencyValue(value: number, showSymbol = false): string {
  const abs = Math.abs(value)
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  const signed = value < 0 ? `(${formatted})` : formatted
  return showSymbol ? `$  ${signed}` : signed
}

export function formatPlainNumber(value: number): string {
  return value < 0
    ? `(${Math.abs(value).toLocaleString('en-US')})`
    : value.toLocaleString('en-US')
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return `${value.toFixed(fractionDigits)}%`
}
