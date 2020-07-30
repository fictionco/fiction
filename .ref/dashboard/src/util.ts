import dayjs from "dayjs"
import localeData from "dayjs/plugin/localeData"
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(localeData)
dayjs.extend(relativeTime)

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

export const dateFormatter = (
  isoDate: string | number,
  interval: "date" | "hour" | "minute" | "month"
): string => {
  let out = ""
  const date = dayjs(isoDate)

  if (interval === "month") {
    out = date.format("MMM")
  } else if (interval === "date") {
    out = date.format("D MMM")
  } else if (interval === "hour") {
    out = date.format("ha")
  } else if (interval === "minute") {
    out = date.fromNow()
  }

  return out
}

const THOUSAND = 1000
const HUNDRED_THOUSAND = 100000
const MILLION = 1000000
const HUNDRED_MILLION = 100000000

export const numberFormatter = (num: number): string | number => {
  if (num >= THOUSAND && num < MILLION) {
    const thousands = num / THOUSAND
    if (thousands === Math.floor(thousands) || num >= HUNDRED_THOUSAND) {
      return Math.floor(thousands) + "k"
    } else {
      return Math.floor(thousands * 10) / 10 + "k"
    }
  } else if (num >= MILLION && num < HUNDRED_MILLION) {
    const millions = num / MILLION
    if (millions === Math.floor(millions)) {
      return Math.floor(millions) + "m"
    } else {
      return Math.floor(millions * 10) / 10 + "m"
    }
  } else {
    return num
  }
}

const pad = (num: number, size: number): string => {
  return ("000" + num).slice(size * -1)
}

export const durationFormatter = (duration: number): string => {
  const hours = Math.floor(duration / 60 / 60)
  const minutes = Math.floor(duration / 60) % 60
  const seconds = Math.floor(duration - minutes * 60 - hours * 60 * 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${pad(seconds, 2)}s`
  } else {
    return `${seconds}s`
  }
}
