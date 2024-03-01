const THOUSAND = 1000
const HUNDRED_THOUSAND = 100_000
const MILLION = 1_000_000
const HUNDRED_MILLION = 100_000_000

/**
 * Concise number abbreviation format
 */
export function numberFormatter(num: number | string): string | number {
  num = typeof num === 'string' ? Number.parseInt(num) : num
  if (num >= THOUSAND && num < MILLION) {
    const thousands = num / THOUSAND
    return thousands === Math.floor(thousands) || num >= HUNDRED_THOUSAND
      ? `${Math.floor(thousands)}k`
      : `${Math.floor(thousands * 10) / 10}k`
  }
  else if (num >= MILLION && num < HUNDRED_MILLION) {
    const millions = num / MILLION
    return millions === Math.floor(millions)
      ? `${Math.floor(millions)}m`
      : `${Math.floor(millions * 10) / 10}m`
  }
  else {
    return num
  }
}
/**
 * Formats raw number of seconds into a nice duration
 */
export function durationFormatter(duration: number | undefined, unit: 'ms' | 's' = 's'): string {
  if (duration === undefined)
    return ''

  const msDuration = unit === 'ms' ? duration : duration * 1000

  const hours = Math.floor(msDuration / 60 / 60 / 1000)
  const minutes = Math.floor(msDuration / 60 / 1000) % 60

  const msMinutes = minutes * 60 * 1000
  const msHours = hours * 60 * 60 * 1000

  const out = []
  if (hours > 0) {
    const v = `${hours}h`
    out.push(v)
  }
  if (minutes > 0) {
    const v = `${minutes}m`
    out.push(v)
  }
  if (unit === 's') {
    const seconds = Math.floor((msDuration - msMinutes - msHours) / 1000)
    if (seconds >= 0) {
      const v = `${seconds}s`
      out.push(v)
    }
  }
  else {
    const ms = msDuration - msMinutes - msHours
    if (ms >= 0) {
      const v = `${ms.toLocaleString()}ms`
      out.push(v)
    }
  }

  return out.join(' ')
}
/**
 * Is a number numeric or number-like
 */
export function isNumeric(n: number | string | undefined): boolean {
  if (n === undefined || n === null)
    return false
  return !Number.isNaN(Number.parseFloat(n.toString())) && Number.isFinite(+n)
}

export type NumberFormats =
  | 'number'
  | 'abbreviated'
  | 'abbreviatedDollar'
  | 'percent'
  | 'dollar'
  | 'duration'
  | 'rawPercent'
  | 'microDuration'
/**
 * Fancy number formatter supporting various formats
 */
export function formatNumber(value: number | string | undefined, format?: NumberFormats): string | number | undefined {
  if (!isNumeric(value) || value === undefined)
    return value

  value = +value
  if (format === 'percent' || format === 'rawPercent') {
    value = format === 'rawPercent' ? value * 100 : value
    return `${Math.round(value * 10) / 10}%`
  }
  else if (format === 'dollar') {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true,
    })
  }
  else if (format === 'duration' || format === 'microDuration') {
    return durationFormatter(value, format === 'microDuration' ? 'ms' : 's')
  }
  else if (format === 'abbreviated') {
    return numberFormatter(value)
  }
  else if (format === 'abbreviatedDollar') {
    return `$${numberFormatter(value)}`
  }
  else {
    return value.toLocaleString()
  }
}
