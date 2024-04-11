import { dayjs } from '@fiction/core'

export function getCycleRange(args: {
  timestamp: number
  now?: dayjs.Dayjs
}) {
  const { timestamp, now = dayjs() } = args
  const hour = dayjs.unix(timestamp).hour()
  const anchorDateUtc = dayjs.unix(timestamp).utc().date()
  const daysInCurrentMonth = now.clone().daysInMonth()
  const daysInLastMonth = now.clone().subtract(1, 'month').daysInMonth()

  const endDay = daysInCurrentMonth < anchorDateUtc ? daysInCurrentMonth : anchorDateUtc

  const startDay = daysInLastMonth < anchorDateUtc ? daysInLastMonth : anchorDateUtc

  const timeEnd = now.clone().date(endDay).hour(hour)
  const timeStart = now.clone().subtract(1, 'month').date(startDay).hour(hour)

  return { anchorDateUtc, timeEnd, timeStart }
}
