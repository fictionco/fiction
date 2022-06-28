import { dayjs } from "./libraries"

type DateTypes = string | number | Date | dayjs.Dayjs | undefined

const _isNumber = (value: DateTypes): boolean => {
  if (typeof value == "undefined") return false
  return !!(
    !Number.isNaN(Number.parseFloat(value as string)) && Number.isFinite(value)
  )
}

export const isUnixTimestamp = (value: DateTypes): boolean => {
  if (value && _isNumber(value)) {
    value = value.toString()
    return /^\d{8,11}$/.test(value)
  } else {
    return false
  }
}
/**
 * Get the time manipulation library w locale
 */
export const timeUtil = (time?: dayjs.ConfigType): dayjs.Dayjs => {
  if (time && isUnixTimestamp(time)) {
    time = Number.parseFloat(time.toString())
    return dayjs.unix(time)
  } else {
    return dayjs(time)
  }
}
/**
 * Get the time since a date in human language
 * @param time - time/date
 */
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
  return timeUtil(time).format("h:mma")
}
/**
 * [date] at [time]
 */
export const displayDateTime = (isoDate?: string | number): string => {
  if (!isoDate) return ""
  const m = standardDate(isoDate)
  const h = standardTime(isoDate)

  return `${m} at ${h}`
}

export const getMonths = (): string[] => {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
}
/**
 * Get date in international format "YYYY-M-DD"
 */
export const internationalDate = (time: dayjs.ConfigType): string => {
  return timeUtil(time).format("YYYY-M-DD")
}
/**
 * Get date with year/month "YYYY-MM"
 */
export const internationalMonth = (time: dayjs.ConfigType): string => {
  return timeUtil(time).format("YYYY-MM")
}
/**
 * Convert a date-like object to a JS Date
 */
export const toDate = (time: dayjs.ConfigType): Date => {
  return timeUtil(time).toDate()
}
/**
 * Gets the timestamp associated with a date-like object
 */
export const timestamp = (time?: dayjs.ConfigType): number => {
  return !time ? timeUtil().unix() : timeUtil(time).unix()
}
