import dayjs, { Dayjs } from "dayjs"

type DateTypes = string | number | Date | dayjs.Dayjs | undefined

function _isNumber(value: any): boolean {
  return !!(!isNaN(parseFloat(value)) && isFinite(value))
}

export function timeUtil(time?: DateTypes): Dayjs {
  if (time && isUnixTimestamp(time)) {
    time = parseFloat(time.toString())
    return dayjs.unix(time)
  } else {
    return dayjs(time)
  }
}

export function isUnixTimestamp(value: DateTypes): boolean {
  if (value && _isNumber(value)) {
    value = value.toString()
    return /^\d{8,11}$/.test(value)
  } else {
    return false
  }
}

export function standardDate(time: dayjs.ConfigType): string {
  return timeUtil(time).format("MMM DD, YYYY")
}

export function standardTime(time: dayjs.ConfigType): string {
  return timeUtil(time).format("h:mma (MM/D)")
}

export function internationalDate(time: dayjs.ConfigType): string {
  return timeUtil(time).format("YYYY-M-DD")
}

export function internationalMonth(time: dayjs.ConfigType): string {
  return timeUtil(time).format("YYYY-MM")
}

export function toDate(time: dayjs.ConfigType): Date {
  return timeUtil(time).toDate()
}

export function timestamp(time?: dayjs.ConfigType): number {
  if (!time) {
    return timeUtil().unix()
  } else {
    return timeUtil(time).unix()
  }
}
