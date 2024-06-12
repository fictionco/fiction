import { dayjs } from '@fiction/core'
import type { DataPointChart, QueryParams, QueryParamsRefined, TimeLineInterval } from '../types'

export function refineTimelineData<T extends DataPointChart>(args: {
  timeZone: string
  timeStartAt: dayjs.Dayjs
  timeEndAt: dayjs.Dayjs
  interval: TimeLineInterval
  withRollup?: boolean
  data: T[]
  now?: dayjs.Dayjs
}): T[] {
  const { timeStartAt, timeEndAt, timeZone, interval, data = [], withRollup, now = dayjs() } = args

  const newData: { date: string, [key: string]: any }[] = withRollup ? [{ label: 'Totals', tense: 'past', ...data[0] }] : []

  // clickhouse returns different timezone handling for weeks/months/years vs days/hours
  // appropriate timezone is returned for < weeks but always utc otherwise
  // Handle different timezone adjustments for weeks/months/years vs days/hours
  let loopTime = (interval === 'week' || interval === 'month')
    ? timeStartAt.utc().startOf(interval)
    : timeStartAt.clone().tz(timeZone)

  const finishTime = (interval === 'week' || interval === 'month')
    ? timeEndAt.utc().endOf(interval)
    : timeEndAt.clone().tz(timeZone)

  const duration = Math.abs(finishTime.diff(loopTime, 'day'))
  const dateFormat = duration < 3 ? 'ha' : duration > 180 ? 'MMM D, YYYY' : 'MMM D'



  const sample = data[0] ?? {}
  // create default object from sample set to zeros
  const defaultObjectIfMissing = Object.fromEntries(
    Object.entries(sample)
      .map(([k, v]) => {
        return ((typeof v === 'string' && /^-?\d+$/.test(v)) || typeof v === 'number') ? [k, 0] : undefined
      })
      .filter(Boolean) as [string, number][],
  )

  while (loopTime.isBefore(finishTime, interval) || loopTime.isSame(finishTime, interval)) {
    const date = loopTime.toISOString()
    const displayDate = loopTime.tz(timeZone)

    const found = data.find(_ => _.date === date) || defaultObjectIfMissing

    const tense = displayDate.isSame(now, interval)
      ? 'present'
      : displayDate.isAfter(now, interval)
        ? 'future'
        : 'past'

    const d: DataPointChart = {
      ...found,
      date,
      label: displayDate.format(dateFormat),
      tense,
    }

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
  const { orgId, period, timeZone = 'UTC' } = params

  if (!orgId)
    throw new Error('orgId is missing')

  if (period === 'hour' || period === 'hour4') {
    const hours = period === 'hour4' ? 4 : 1
    params = {
      ...params,
      interval: 'minute',
      timeEndAtIso: dayjs().toISOString(),
      timeStartAtIso: dayjs().subtract(hours, 'hour').toISOString(),
    }
  }
  else if (period === 'today' || period === 'yesterday') {
    let nowLocal = dayjs().tz(timeZone)

    if (period === 'yesterday')
      nowLocal = nowLocal.subtract(1, 'day')

    const timeStartAtIso = nowLocal.startOf('day').toISOString()
    const timeEndAtIso = dayjs(timeStartAtIso).add(1, 'day').toISOString()
    params = {
      ...params,
      interval: 'hour',
      timeStartAtIso,
      timeEndAtIso,
    }
  }

  if (!params.timeEndAtIso)
    throw new Error('timeEndAtIso is missing')

  if (!params.timeStartAtIso)
    throw new Error('timeStartAtIso is missing')

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

  const defaultInterval
    = timeEndAt.diff(timeStartAt, 'day') > 10 ? 'day' : 'hour'

  return {
    ...params,
    timeZone,
    orgId,
    timeEndAtIso: timeEndAt.toISOString(),
    timeStartAtIso: timeStartAt.toISOString(),
    compareEndAt,
    compareStartAt,
    timeEndAt,
    timeStartAt,
    interval: params.interval || defaultInterval,
  }
}
