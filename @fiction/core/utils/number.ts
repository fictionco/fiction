const SCALES = [
  [1e12, 't'],
  [1e9, 'b'],
  [1e6, 'm'],
  [1e3, 'k'],
] as const

type NumberFormatterOptions = {
  /** Keep one decimal place for scaled values (e.g. 4.0k vs 4k) */
  fractionDigits?: number | false
  integerOnly?: boolean
}

export function numberFormatter(num: number | string, { fractionDigits = 1, integerOnly = false }: NumberFormatterOptions = {}): string | number {
  const value = typeof num === 'string' ? Number.parseFloat(num) : num
  if (!Number.isFinite(value))
    return num

  if (value === 0)
    return '0'

  // For 0-99, return whole number
  if (value < 100 && integerOnly)
    return Math.round(value)

  // For 100-999, return whole number
  if (value >= 100 && value < 1000)
    return Math.round(value)

  const scale = SCALES.find(([threshold]) => Math.abs(value) >= threshold)
  if (!scale)
    return value.toFixed(1)

  const [threshold, suffix] = scale
  const scaled = value / threshold

  // Don't show decimal for multiples of 100
  if (scaled >= 100 || (scaled % 100 === 0))
    return `${Math.floor(scaled)}${suffix}`

  // When not forcing decimal, only show it if there is one
  const formatted = fractionDigits !== false
    ? scaled.toFixed(fractionDigits)
    : (scaled % 1 === 0 ? Math.floor(scaled).toString() : scaled.toFixed(1))

  return `${formatted}${suffix}`
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

export const numberFormats = [
  'number',
  'abbreviated',
  'abbreviatedInteger',
  'abbreviatedDollar',
  'percent',
  'dollar',
  'duration',
  'rawPercent',
  'microDuration',
] as const

export type NumberFormats = typeof numberFormats[number]
/**
 * Fancy number formatter supporting various formats
 */
export function formatNumber(value: number | string | undefined, format?: NumberFormats, opts: { prefix?: string, suffix?: string } = {}): string | number | undefined {
  const { prefix = '', suffix = '' } = opts
  let out: string | number | undefined = undefined
  if (!isNumeric(value) || value === undefined)
    return value

  value = +value
  if (format === 'percent' || format === 'rawPercent') {
    value = format === 'rawPercent' ? value * 100 : value
    out = `${Math.round(value * 10) / 10}%`
  }
  else if (format === 'dollar') {
    out = value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true,
    })
  }
  else if (format === 'duration' || format === 'microDuration') {
    out = durationFormatter(value, format === 'microDuration' ? 'ms' : 's')
  }
  else if (format === 'abbreviated') {
    out = numberFormatter(value)
  }
  else if (format === 'abbreviatedInteger') {
    out = numberFormatter(value, { integerOnly: true })
  }
  else if (format === 'abbreviatedDollar') {
    out = `$${numberFormatter(value)}`
  }
  else {
    out = value.toLocaleString()
  }

  return prefix || suffix ? `${prefix}${out}${suffix}` : out
}

export function formatBytes(bytes: number, decimals: number = 2) {
  if (bytes === 0)
    return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}
