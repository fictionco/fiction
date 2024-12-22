import type { DataPointChart, QueryParams, QueryParamsRefined, TimeLineInterval } from '../types.js'
import { dayjs } from '@fiction/core'

type RefineTimelineArgs<T> = {
  timeZone?: string
  timeStartAtIso: string
  timeEndAtIso: string
  interval: TimeLineInterval
  withRollup?: boolean
  data: T[]
  nowIso?: string
  snapshotKeys?: string[]
}

export function refineTimelineData<T extends DataPointChart>(args: RefineTimelineArgs<T>): T[] {
  const {
    timeStartAtIso,
    timeEndAtIso,
    timeZone = 'utc',
    interval = 'day',
    data = [],
    withRollup,
    nowIso,
    snapshotKeys = [],
  } = args

  const MAX_POINTS = 2000

  // Initialize with precise start/end points
  const timeStartAt = dayjs(timeStartAtIso).tz(timeZone).startOf(interval)
  const timeEndAt = dayjs(timeEndAtIso).tz(timeZone).startOf(interval)
  const now = nowIso ? dayjs(nowIso).tz(timeZone) : dayjs().tz(timeZone)

  if (!timeStartAt.isValid() || !timeEndAt.isValid()) {
    throw new Error('Invalid start or end date')
  }

  // Setup initial data
  const newData: { date?: string, [key: string]: any }[] = withRollup ? [{ label: 'Totals', tense: 'past', ...data[0] }] : []

  // Extract numerical fields
  const sample = data[0] ?? {}
  const defaultObjectIfMissing = Object.fromEntries(
    Object.entries(sample)
      .map(([k, v]) => ((typeof v === 'string' && /^-?\d+$/.test(v)) || typeof v === 'number') ? [k, 0] : undefined)
      .filter(Boolean) as [string, number | string][],
  )

  const lastKnownValues = { ...defaultObjectIfMissing }

  // Calculate total points needed
  const totalPoints = timeEndAt.diff(timeStartAt, interval)
  if (totalPoints > MAX_POINTS) {
    throw new Error(`Time range too large: ${totalPoints} ${interval} intervals requested`)
  }

  // Generate points
  for (let i = 0; i <= totalPoints; i++) {
    const currentTime = timeStartAt.add(i, interval)

    const foundData = data.find(d => dayjs(d.date).tz(timeZone).isSame(currentTime, interval))
    const values = { ...defaultObjectIfMissing }

    // Process values
    Object.keys(defaultObjectIfMissing).forEach((key) => {
      if (foundData?.[key] !== undefined) {
        values[key] = foundData[key]
        if (snapshotKeys.includes(key)) {
          lastKnownValues[key] = foundData[key]
        }
      }
      else if (snapshotKeys.includes(key)) {
        values[key] = lastKnownValues[key]
      }
    })

    const tense = currentTime.utc().isSame(now.utc(), interval)
      ? 'present'
      : currentTime.utc().isAfter(now.utc(), interval) ? 'future' : 'past'

    newData.push({ ...values, date: currentTime.toISOString(), tense })
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
