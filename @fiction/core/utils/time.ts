import { dayjs } from './libraries.js'

type DateTypes = string | number | Date | dayjs.Dayjs | undefined

export function isUnixTimestamp(value: DateTypes): boolean {
  if (typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value))) {
    const num = Number(value)
    return !Number.isNaN(num) && num.toString() === value.toString() && /^\d{10,}$/.test(value.toString())
  }
  return false
}

export function timeUtil(time?: dayjs.ConfigType): dayjs.Dayjs {
  if (time && isUnixTimestamp(time))
    return dayjs.unix(Number(time))

  return dayjs(time).utc()
}

export function timeAgo(time?: dayjs.ConfigType): string {
  return time ? timeUtil(time).fromNow() : ''
}

export function standardDate(time?: dayjs.ConfigType, opts: { withTime?: boolean } = {}): string {
  return time ? timeUtil(time).format(`MMM DD, YYYY${opts.withTime ? ' h:mm A' : ''}`) : ''
}
