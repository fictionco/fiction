import { dayjs } from '@factor/api'
import type { QueryParams, QueryParamsRefined } from '../plugin-dashboards'

/**
 * Standardize analytics query params
 * Here because this can be used by endpoints as well as widget API
 */
export function refineParams(params: QueryParams): QueryParamsRefined {
  const { projectId, period, timeZone = 'UTC' } = params

  if (!projectId)
    throw new Error('projectId is missing')

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
    projectId,
    timeEndAtIso: timeEndAt.toISOString(),
    timeStartAtIso: timeStartAt.toISOString(),
    compareEndAt,
    compareStartAt,
    timeEndAt,
    timeStartAt,
    interval: params.interval || defaultInterval,
  }
}
