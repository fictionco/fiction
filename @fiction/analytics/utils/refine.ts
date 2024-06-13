import { dayjs } from '@fiction/core'
import type { DataPointChart, QueryParams, QueryParamsRefined, TimeLineInterval } from '../types.js'

export function refineTimelineData<T extends DataPointChart>(args: {
  timeZone?: string
  timeStartAtIso: string
  timeEndAtIso: string
  interval: TimeLineInterval
  withRollup?: boolean
  data: T[]
  nowIso?: string
}): T[] {
  const { timeStartAtIso, timeEndAtIso, timeZone = 'utc', interval, data = [], withRollup, nowIso } = args

  const timeStartAt = dayjs(timeStartAtIso).tz(timeZone).startOf(interval)
  const timeEndAt = dayjs(timeEndAtIso).tz(timeZone).endOf(interval)
  const now = nowIso ? dayjs(nowIso) : dayjs()

  const newData: { date: string, [key: string]: any }[] = withRollup ? [{ label: 'Totals', tense: 'past', ...data[0] }] : []

  let loopTime = timeStartAt.clone()

  const duration = Math.abs(timeEndAt.diff(loopTime, 'day'))
  const dateFormat = duration < 3 ? 'ha' : duration > 180 ? 'MMM D, YYYY' : 'MMM D'

  const sample = data[0] ?? {}
  // create default object from sample set to zeros
  const defaultObjectIfMissing = Object.fromEntries(
    Object.entries(sample).map(([k, v]) => ((typeof v === 'string' && /^-?\d+$/.test(v)) || typeof v === 'number') ? [k, 0] : undefined).filter(Boolean) as [string, number][],
  )

  while (loopTime.isBefore(timeEndAt, interval) || loopTime.isSame(timeEndAt, interval)) {
    const displayDate = loopTime.tz(timeZone)

    const found = data.find(_ => dayjs(_.date).isSame(loopTime, interval)) || defaultObjectIfMissing

    const tense = displayDate.isSame(now, interval) ? 'present' : (displayDate.isAfter(now, interval) ? 'future' : 'past')

    const d: DataPointChart = { ...found, date: loopTime.toISOString(), label: displayDate.format(dateFormat), tense }

    newData.push(d)
    loopTime = loopTime.add(1, interval).tz(timeZone)
  }

  return newData as T[]
}

/**
 * Standardize analytics query params
 * Here because this can be used by endpoints as well as widget API
 */
export function refineParams(params: QueryParams): QueryParamsRefined {
  const { period = 'month' } = params

  let timeStartAtIso: string
  let timeEndAtIso: string = params.timeEndAtIso || dayjs().toISOString()
  let interval: TimeLineInterval

  // get native timezone
  const envTimeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone

  // get browser timezone
  const timeZone = params.timeZone || envTimeZone

  if (period === 'hour' || period === 'hour4') {
    const hours = period === 'hour4' ? 4 : 1
    interval = 'minute'
    timeStartAtIso = dayjs(timeEndAtIso).subtract(hours, 'hour').toISOString()
  }
  else if (period === 'today' || period === 'yesterday') {
    let nowLocal = dayjs().tz(timeZone)

    if (period === 'yesterday')
      nowLocal = nowLocal.subtract(1, 'day')

    interval = 'hour'
    timeStartAtIso = nowLocal.startOf('day').toISOString()
    timeEndAtIso = dayjs(timeStartAtIso).add(1, 'day').toISOString()
  }
  else if (period === 'week') {
    timeStartAtIso = dayjs(timeEndAtIso).subtract(1, 'week').toISOString()
    interval = 'day'
  }
  else {
    timeStartAtIso = dayjs(timeEndAtIso).subtract(1, 'month').toISOString()
    interval = 'day'
  }

  params = { ...params, interval, timeStartAtIso, timeEndAtIso }

  const timeEndAt = dayjs(params.timeEndAtIso)
  const timeStartAt = dayjs(params.timeStartAtIso)

  const comparePeriod = timeEndAt.diff(timeStartAt, 'day') + 1

  let compareEndAt = timeEndAt.subtract(comparePeriod, 'day')
  let compareStartAt = timeStartAt.subtract(comparePeriod, 'day')

  if (params.compare === 'year') {
    compareEndAt = timeEndAt.subtract(1, 'year')
    compareStartAt = timeStartAt.subtract(1, 'year')
  }
  else if (params.compare === 'quarter') {
    compareEndAt = timeEndAt.subtract(3, 'month')
    compareStartAt = timeStartAt.subtract(3, 'month')
  }
  else if (params.compare === 'month') {
    compareEndAt = timeEndAt.subtract(1, 'month')
    compareStartAt = timeStartAt.subtract(1, 'month')
  }
  else if (params.compare === 'week') {
    compareEndAt = timeEndAt.subtract(1, 'week')
    compareStartAt = timeStartAt.subtract(1, 'week')
  }

  const defaultInterval = timeEndAt.diff(timeStartAt, 'day') > 10 ? 'day' : 'hour'

  return {
    ...params,
    timeZone,
    timeEndAtIso,
    timeStartAtIso,
    compareEndAtIso: compareEndAt.toISOString(),
    compareStartAtIso: compareStartAt.toISOString(),
    interval: params.interval || defaultInterval,
  }
}
