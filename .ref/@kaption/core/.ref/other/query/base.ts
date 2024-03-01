import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import parseFormat from 'dayjs/plugin/customParseFormat'
import type { Knex } from 'knex'
import knex from 'knex'
import { clickhouseQuery } from '@kaption/db/clickhouse'
import { _stop } from '@kaption/utils'
import type { ClickhouseQueryResult } from '@kaption/types'
import { eventKeys, sessionKeys } from '@kaption/types'
import type {
  QueryTable,
  RequestFullAnalytics,
  RequestFullAnalyticsRefined,
} from './_widgets/types'

/**
 * Add timezone support
 * https://day.js.org/docs/en/plugin/timezone
 */
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(parseFormat)

/**
 * Setup query builder/helper
 */
let __queryBuilder: Knex
export function qu(): Knex {
  if (!__queryBuilder)
    __queryBuilder = knex({ client: 'pg' })

  return __queryBuilder
}
/**
 * Example query:
 */
export async function runQuery<T extends unknown[]>(_q: Knex.QueryBuilder): Promise<ClickhouseQueryResult<T> | ClickhouseQueryResult<[]>> {
  const query = `${_q.toQuery()} FORMAT JSON`

  const result = await clickhouseQuery<T>({ query })

  const emptyResult: ClickhouseQueryResult<[]> = {
    data: [],
    rows: 0,
    rows_before_limit_at_least: 0,
    meta: [],
  }

  return result || emptyResult
}

/**
 * Get basic query for events table
 */
export function baseQuery(args: {
  projectId: string
  tableName?: QueryTable
}): Knex.QueryBuilder {
  const { projectId, tableName = 'event' } = args

  return qu().from(`darwin.${tableName}`).where({ projectId })
}
/**
 * Base query for time-based charts and data (site, timeStart, timeEnd)
 */
export function dateQuery(args: RequestFullAnalyticsRefined & {
  timeStart: dayjs.Dayjs
  timeEnd: dayjs.Dayjs
  projectId: string
  tableName?: QueryTable
}): Knex.QueryBuilder {
  const { timeStart, timeEnd, projectId, tableName, filters } = args

  const clickhouseTimeEnd = timeEnd.utc().format('YYYYMMDDHHmmss')
  const clickhouseTimeStart = timeStart.utc().format('YYYYMMDDHHmmss')

  const base = baseQuery({ projectId, tableName }).whereRaw(
    `toYYYYMMDDhhmmss(timestamp) BETWEEN ${clickhouseTimeStart} AND ${clickhouseTimeEnd}`,
  )

  if (filters) {
    filters
      .filter((f) => {
        const available = (
          tableName === 'session' ? sessionKeys : eventKeys
        ) as string[]

        return !!available.includes(f.name)
      })
      .forEach(({ name, value, operator }) => {
        if (value && (typeof value === 'string' || typeof value === 'number')) {
          if (operator === '!=') {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            base.whereNot(name, value)
          }
          else {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            base.where(name, value)
          }
        }
      })
  }

  return base
}

/**
 * Session table query that accounts for time
 */
// export const sessionDateQuery = (
//   args: RequestFullAnalyticsRefined,
// ): Knex.QueryBuilder => {
//   const subTable = dateQuery({ tableName: "event", ...args })
//   return qu().from(
//     subTable.select(qu().raw(selectItems.join(", "))).groupBy("sessionId"),
//   )
// }

export function eventSessionDateQuery(q: RequestFullAnalyticsRefined): Knex.QueryBuilder {
  const subTable = dateQuery({ tableName: 'event', ...q })
  const selectItems = [
    'count(*) as totalEvents',
    'max(isNew) as isNew',
    'if(isNew > 0, 0, 1) as isReturning',
    'min(timestamp) as session_timestamp',
    'anyIf(duration, eventName=\'session\')as session_duration',
    'sum(engageDuration) as session_engageDuration',
    'countIf(eventName=\'view\') as pageCount',
    'if(countIf(eventName=\'bot\') > 0, 1, 0) as isRobot',
    'if(countIf(eventName=\'replay\') > 0, 1, 0) as hasReplay',
    'sum(replayDuration) as replayDuration',
    'if(pageCount > 1, 0, 1) as isBounce',
    'countIf(eventType=\'micro\') as totalMicroConversion',
    'countIf(eventType=\'macro\') as totalMacroConversion',
    'sum(value) as session_value',
    'if(totalMicroConversion > 0, 1, 0) as hasMicroConversion',
    'if(totalMacroConversion > 0, 1, 0) as hasMacroConversion',
    'uniq(eventId) as eventCount',
    'any(clientId) as session_clientId',
    'any(ip) as session_ip',
    'anyIf(os, eventName=\'init\') as session_os',
    'anyIf(browser, eventName=\'init\') as session_browser',
    'anyIf(referrer, eventName=\'init\') as session_referrer',
    'anyIf(referralSource, eventName=\'init\') as session_referralSource',
    'anyIf(referralCampaign, eventName=\'init\') as session_referralCampaign',
    'anyIf(referralMedium, eventName=\'init\') as session_referralMedium',
    'anyIf(deviceType, eventName=\'init\') as session_deviceType',
    'anyIf(timezone, eventName=\'init\') as session_timezone',
    'anyIf(city, eventName=\'init\') as session_city',
    'anyIf(latitude, eventName=\'init\') as session_latitude',
    'anyIf(longitude, eventName=\'init\') as session_longitude',
    'anyIf(language, eventName=\'init\') as session_language',
    'anyIf(countryCode, eventName=\'init\') as session_countryCode',
    'max(vitalCLS) as session_vitalCLS',
    'max(vitalTBT) as session_vitalTBT',
    'max(vitalFID) as session_vitalFID',
    'max(vitalLCP) as session_vitalLCP',
    'sum(scrollTotal) as session_scrollTotal',
    'sum(keypressTotal) as session_keypressTotal',
    'sum(moveTotal) as session_moveTotal',
    'sum(touchTotal) as session_touchTotal',
    'sum(clickTotal) as session_clickTotal',
    'avgIf(scrollDepth, eventName=\'exit\' AND isFinite(scrollDepth)) as session_scrollDepth',
  ]
  return qu().from(
    subTable.select(qu().raw(selectItems.join(', '))).groupBy('sessionId'),
  )
}

/**
 * Add defaults for standard charting analytics
 */
export function refineDataRequest(query: RequestFullAnalytics): RequestFullAnalyticsRefined {
  const {
    compare = 'period',
    projectId,
    timeZone = 'UTC',
    interval,
    timeEndIso,
    timeStartIso,
  } = query

  if (!projectId)
    throw _stop({ message: 'projectId is missing' })
  if (!timeEndIso)
    throw _stop({ message: 'timeEndIso is missing' })
  if (!timeStartIso)
    throw _stop({ message: 'timeStartIso is missing' })

  const timeEnd = dayjs(timeEndIso)
  const timeStart = dayjs(timeStartIso)

  const period = timeEnd.diff(timeStart, 'day') + 1

  let compareEnd = timeEnd.subtract(period, 'day')
  let compareStart = timeStart.subtract(period, 'day')

  if (compare === 'year') {
    compareEnd = timeEnd.subtract(1, 'year')
    compareStart = timeStart.subtract(1, 'year')
  }
  else if (compare === 'quarter') {
    compareEnd = timeEnd.subtract(3, 'month')
    compareStart = timeStart.subtract(3, 'month')
  }
  else if (compare === 'month') {
    compareEnd = timeEnd.subtract(1, 'month')
    compareStart = timeStart.subtract(1, 'month')
  }
  else if (compare === 'week') {
    compareEnd = timeEnd.subtract(1, 'week')
    compareStart = timeStart.subtract(1, 'week')
  }

  const sliceInterval = interval || (timeEnd.diff(timeStart, 'day') > 10
    ? 'day'
    : 'hour')

  return {
    ...query,
    timeZone,
    projectId,
    timeEndIso: timeEnd.toISOString(),
    timeStartIso: timeStart.toISOString(),
    compareEnd,
    compareStart,
    timeEnd,
    timeStart,
    interval: sliceInterval,
  }
}
