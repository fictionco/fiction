import dayjs, { Dayjs } from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)
type DateTypes = string | number | Date | dayjs.Dayjs | undefined

const _isNumber = (value: any): boolean => {
  return !!(!isNaN(parseFloat(value)) && isFinite(value))
}

export const isUnixTimestamp = (value: DateTypes): boolean => {
  if (value && _isNumber(value)) {
    value = value.toString()
    return /^\d{8,11}$/.test(value)
  } else {
    return false
  }
}

export const timeUtil = (time?: DateTypes): Dayjs => {
  if (time && isUnixTimestamp(time)) {
    time = parseFloat(time.toString())
    return dayjs.unix(time)
  } else {
    return dayjs(time)
  }
}

export const timeAgo = (time?: dayjs.ConfigType): string => {
  if (!time) return ""
  return timeUtil(time).fromNow()
}

/**
 * Gets a standard formatted date
 * @param time - moment/dayjs compatible date
 */
export const standardDate = (time?: dayjs.ConfigType): string => {
  if (!time) return ""
  return timeUtil(time).format("MMM DD, YYYY")
}

/**
 * Gets a standard formatted time
 * @param time - moment/dayjs compatible date
 */
export const standardTime = (time: dayjs.ConfigType): string => {
  return timeUtil(time).format("h:mma (MM/D)")
}

/**
 * Get date in international format
 */
export const internationalDate = (time: dayjs.ConfigType): string => {
  return timeUtil(time).format("YYYY-M-DD")
}

export const internationalMonth = (time: dayjs.ConfigType): string => {
  return timeUtil(time).format("YYYY-MM")
}

export const toDate = (time: dayjs.ConfigType): Date => {
  return timeUtil(time).toDate()
}

export const timestamp = (time?: dayjs.ConfigType): number => {
  if (!time) {
    return timeUtil().unix()
  } else {
    return timeUtil(time).unix()
  }
}
