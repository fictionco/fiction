import dayjs, { Dayjs } from "dayjs"

function _isNumber(value): boolean {
  return !!(!isNaN(parseFloat(value)) && isFinite(value))
}

export function timeUtil(time?): Dayjs {
  if (isUnixTimestamp(time)) {
    return dayjs.unix(time)
  } else {
    return dayjs(time)
  }
}

export function isUnixTimestamp(v): boolean {
  if (_isNumber(v)) {
    v = parseFloat(v)

    return !!/^\d{8,11}$/.test(v)
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

export function timestamp(time: dayjs.ConfigType = null): number {
  if (!time) {
    return timeUtil().unix()
  } else {
    return timeUtil(time).unix()
  }
}
