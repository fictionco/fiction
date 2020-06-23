import dayjs, { Dayjs } from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { getLocale } from "@factor/api/i18n"
import timeLocales from "./resource/time-locale"

dayjs.extend(relativeTime)

type DateTypes = string | number | Date | dayjs.Dayjs | undefined

const _isNumber = (value: any): boolean => {
  return !!(!Number.isNaN(Number.parseFloat(value)) && Number.isFinite(value))
}

const importLocale = async (): Promise<void> => {
  const locale = getLocale() ?? "en"

  try {
    const dynamicImport = timeLocales[locale] ?? "en"
    await dynamicImport()
    dayjs.locale(locale)
  } catch (error) {
    if (!error.message.includes("Cannot find module")) {
      throw error
    }
  }
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
export const timeUtil = (time?: DateTypes): Dayjs => {
  importLocale()

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
