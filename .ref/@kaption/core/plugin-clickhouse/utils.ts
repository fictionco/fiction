import { dayjs } from '@factor/api'
import type { TimeLineInterval } from '../plugin-dashboards'
import type { BaseChartData } from '.'

export function fillData<T extends BaseChartData>(args: {
  timeZone: string
  timeStartAt: dayjs.Dayjs
  timeEndAt: dayjs.Dayjs
  interval: TimeLineInterval
  withRollup?: boolean
  data: T[]
}): T[] {
  const {
    timeStartAt,
    timeEndAt,
    timeZone,
    interval,
    data = [],
    withRollup,
  } = args

  const newData: { date: string, [key: string]: any }[]
    = withRollup && data[0] ? [data[0]] : [{} as T]

  // clickhouse returns different timezone handling for weeks/months/years vs days/hours
  // appropriate timezone is returned for < weeks but always utc otherwise
  let loopTime: dayjs.Dayjs
  let finishTime: dayjs.Dayjs
  if (interval === 'week' || interval === 'month') {
    loopTime = timeStartAt.utc().startOf(interval)
    finishTime = timeEndAt.utc().endOf(interval)
  }
  else {
    loopTime = timeStartAt.clone().tz(timeZone)
    finishTime = timeEndAt.clone().tz(timeZone)
  }

  const duration = Math.abs(finishTime.diff(loopTime, 'day'))

  const sample = data[0] ?? {}
  // create default object from sample set to zeros
  const defaultObjectIfMissing = Object.fromEntries(
    Object.entries(sample)
      .map(([k, v]) => {
        if (
          (typeof v === 'string' && /^-?\d+$/.test(v))
          || typeof v === 'number'
        )
          return [k, 0]
        else return
      })
      .filter(Boolean) as [string, number][],
  )

  while (
    loopTime.isBefore(finishTime, interval)
    || loopTime.isSame(finishTime, interval)
  ) {
    const date = loopTime.toISOString()
    const displayDate = loopTime.tz(timeZone)

    const now = dayjs()
    const found = data.find(_ => _.date === date) || defaultObjectIfMissing

    const dateFormat
      = duration < 3 ? 'ha' : duration > 180 ? 'MMM D, YYYY' : 'MMM D'

    const d: BaseChartData = {
      ...found,
      date,
      label: displayDate.format(dateFormat),
      tense: displayDate.isSame(now, interval)
        ? 'present'
        : displayDate.isAfter(now, interval)
          ? 'future'
          : 'past',
    }

    newData.push(d)

    loopTime = loopTime.add(1, interval)
  }

  return newData as T[]
}
