import type { DataCompared, DataPointChart, QueryParams, QueryParamsRefined, StandardPeriod, TimeLineInterval } from '../types.js'
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

function addInterval(date: dayjs.Dayjs, amount: number, interval: TimeLineInterval): dayjs.Dayjs {
  const minutes = interval.match(/(\d+)min/)?.[1]
  return minutes
    ? date.add(amount * Number.parseInt(minutes), 'minute')
    : date.add(amount, interval as dayjs.ManipulateType)
}

function startOfInterval(date: dayjs.Dayjs, interval: TimeLineInterval): dayjs.Dayjs {
  const minutes = interval.match(/(\d+)min/)?.[1]
  if (!minutes)
    return date.startOf(interval as dayjs.OpUnitType)

  const minute = date.minute()
  const roundedMinutes = Math.floor(minute / Number.parseInt(minutes)) * Number.parseInt(minutes)
  return date.minute(roundedMinutes).second(0).millisecond(0)
}

function getIntervalPoints(args: {
  startAt: dayjs.Dayjs
  endAt: dayjs.Dayjs
  interval: TimeLineInterval
}): number {
  const { startAt, endAt, interval } = args

  // Handle minute-based intervals (15min, 30min)
  const minutes = interval.match(/(\d+)min/)?.[1]
  if (minutes) {
    return Math.ceil(endAt.diff(startAt, 'minute') / Number.parseInt(minutes))
  }

  // Handle standard intervals
  return endAt.diff(startAt, interval as dayjs.OpUnitType)
}

/**
 * Creates default object with zeros for all numeric fields in dataset
 * Keep only numeric fields (numbers or numeric strings) and skip specified keys
 */
export function getDefaultObject(data: Record<string, any>[] = [], skip = ['date', 'tense']): Record<string, number> {
  const keys = new Set(
    data.flatMap(point =>
      Object.entries(point)
        .filter(([key, val]) => !skip.includes(key) && (typeof val === 'number' || /^-?\d+$/.test(val)))
        .map(([key]) => key),
    ),
  )
  return Object.fromEntries([...keys].map(key => [key, 0]))
}

export function refineTimelineData<T extends DataPointChart>(args: RefineTimelineArgs<T>): T[] {
  const {
    timeStartAtIso,
    timeEndAtIso,
    timeZone = 'utc',
    interval = 'day',
    data = [],
    withRollup = false,
    nowIso,
    snapshotKeys = [],
  } = args

  const MAX_POINTS = 2000

  // Initialize with precise start/end points using custom interval handling
  const timeStartAt = startOfInterval(dayjs(timeStartAtIso).tz(timeZone), interval)
  const timeEndAt = startOfInterval(dayjs(timeEndAtIso).tz(timeZone), interval)
  const now = startOfInterval(nowIso ? dayjs(nowIso).tz(timeZone) : dayjs().tz(timeZone), interval)

  if (!timeStartAt.isValid() || !timeEndAt.isValid()) {
    throw new Error('Invalid start or end date')
  }

  // Rest of setup remains the same
  const newData: { date?: string, [key: string]: any }[] = withRollup ? [{ label: 'Totals', tense: 'past', ...data[0] }] : []

  const defaultObjectIfMissing = getDefaultObject(data)
  const lastKnownValues = { ...defaultObjectIfMissing }

  // Calculate total points using custom interval diff
  const totalPoints = getIntervalPoints({
    startAt: timeStartAt,
    endAt: timeEndAt,
    interval,
  })

  if (totalPoints > MAX_POINTS) {
    throw new Error(`Time range too large: ${totalPoints} ${interval} intervals requested`)
  }

  // Generate points using custom interval addition
  for (let i = 0; i <= totalPoints; i++) {
    const currentTime = addInterval(timeStartAt, i, interval)
    const foundData = data.find(d => startOfInterval(dayjs(d.date).tz(timeZone), interval).isSame(currentTime))

    const values = { ...defaultObjectIfMissing, ...foundData }
    Object.keys(values).forEach((key) => {
      if (foundData?.[key] != null) {
        values[key] = foundData[key]
        if (snapshotKeys.includes(key))
          lastKnownValues[key] = foundData[key] as number
      }
      else if (snapshotKeys.includes(key)) {
        values[key] = lastKnownValues[key]
      }
    })

    const tense = currentTime.utc().isSame(now.utc())
      ? 'present'
      : currentTime.utc().isAfter(now.utc()) ? 'future' : 'past'

    newData.push({ ...values, date: currentTime.toISOString(), tense })
  }

  return newData as T[]
}

type RefineComparedDataArgs = {
  data: DataCompared<DataPointChart>

  snapshotKeys?: string[]
}

export function refineComparedData(args: RefineComparedDataArgs): DataCompared<DataPointChart> {
  const { data, snapshotKeys = [] } = args

  const refineParams = data.params

  if (!refineParams) {
    throw new Error('Missing params')
  }

  const {
    timeZone,
    timeStartAtIso,
    timeEndAtIso,
    interval,
    nowIso,
    compareStartAtIso,
    compareEndAtIso,
  } = refineParams

  // Process main timeline data
  const mainData = refineTimelineData({
    data: data.main || [],
    timeZone,
    timeStartAtIso,
    timeEndAtIso,
    interval,
    nowIso,
    snapshotKeys,
  })

  // Process compare timeline data
  const compareData = refineTimelineData({
    data: data.compare || [],
    timeZone,
    timeStartAtIso: compareStartAtIso,
    timeEndAtIso: compareEndAtIso,
    interval,
    nowIso,
    snapshotKeys,
  })

  // Return refined data while preserving other DataCompared properties
  return {
    ...data,
    main: mainData,
    compare: compareData,
  }
}

/**
 * Standardize analytics query params
 * Here because this can be used by endpoints as well as widget API
 */
// Helper to calculate interval based on date range
function getDefaultInterval(startAt: dayjs.Dayjs, endAt: dayjs.Dayjs): TimeLineInterval {
  return endAt.diff(startAt, 'day') > 10 ? 'day' : 'hour'
}

// Helper to get time range based on period
function getTimeRange(period: StandardPeriod, endAtIso: string, timeZone: string) {
  let startAtIso: string
  const endAt = dayjs(endAtIso)
  let interval: TimeLineInterval = 'day'
  let finalEndAtIso = endAtIso

  switch (period) {
    case 'hour':
    case 'hour4': {
      const hours = period === 'hour4' ? 4 : 1
      interval = 'minute'
      startAtIso = endAt.subtract(hours, 'hour').toISOString()
      break
    }
    case 'today':
    case 'yesterday': {
      let nowLocal = dayjs().tz(timeZone)
      if (period === 'yesterday') {
        nowLocal = nowLocal.subtract(1, 'day')
      }
      interval = 'hour'
      startAtIso = nowLocal.startOf('day').toISOString()
      finalEndAtIso = dayjs(startAtIso).add(1, 'day').toISOString()
      break
    }
    case 'week': {
      interval = 'day'
      startAtIso = endAt.subtract(1, 'week').toISOString()
      break
    }
    default: {
      interval = 'day'
      startAtIso = endAt.subtract(1, 'month').toISOString()
    }
  }

  return { startAtIso, endAtIso: finalEndAtIso, interval }
}

export function refineParams<T extends QueryParams>(params: T): QueryParamsRefined & T {
  const timeZone = params.timeZone || new Intl.DateTimeFormat().resolvedOptions().timeZone
  const timeEndAtIso = params.timeEndAtIso || dayjs().toISOString()

  // Get time range based on period
  const { startAtIso: timeStartAtIso, endAtIso: finalEndAtIso, interval: periodInterval }
    = getTimeRange(params.period || 'month', timeEndAtIso, timeZone)

  const timeEndAt = dayjs(finalEndAtIso)
  const timeStartAt = dayjs(timeStartAtIso)
  const comparePeriod = timeEndAt.diff(timeStartAt, 'day') + 1

  // Calculate comparison dates
  let compareEndAt = timeEndAt
  let compareStartAt = timeStartAt

  switch (params.compare) {
    case 'year':
      compareEndAt = timeEndAt.subtract(1, 'year')
      compareStartAt = timeStartAt.subtract(1, 'year')
      break
    case 'quarter':
      compareEndAt = timeEndAt.subtract(3, 'month')
      compareStartAt = timeStartAt.subtract(3, 'month')
      break
    case 'month':
      compareEndAt = timeEndAt.subtract(1, 'month')
      compareStartAt = timeStartAt.subtract(1, 'month')
      break
    case 'week':
      compareEndAt = timeEndAt.subtract(1, 'week')
      compareStartAt = timeStartAt.subtract(1, 'week')
      break
    default:
      compareEndAt = timeEndAt.subtract(comparePeriod, 'day')
      compareStartAt = timeStartAt.subtract(comparePeriod, 'day')
  }

  // Important: Use provided interval, then period interval, then default
  const interval = params.interval || periodInterval || getDefaultInterval(timeStartAt, timeEndAt)

  return {
    ...params,
    timeZone,
    nowIso: dayjs().toISOString(),
    timeEndAtIso: finalEndAtIso,
    timeStartAtIso,
    compareEndAtIso: compareEndAt.toISOString(),
    compareStartAtIso: compareStartAt.toISOString(),
    interval,
  }
}
