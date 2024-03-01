import { performance } from 'node:perf_hooks'
import { nLog, toLabel } from '@kaption/utils'
import type { Knex } from 'knex'
import { dateQuery, qu, runQuery } from '../../base'
import type {
  AggregationResponse,
  ChartResponse,
  ComparedDataItem,
  DisplayColumn,
  QueryMapItem,
} from '../types'
import { formatDateTimeSelect, isSessionDimension } from '../helpers'

type QueryBuilder = Knex.QueryBuilder<any, any>

async function dimensionChartQuery(select: string, q: QueryMapItem): Promise<ChartResponse[]> {
  const { interval, dimension = 'city', timeZone } = q
  const base: QueryBuilder = dateQuery(q)
    .select(
      qu().raw(
        `${[
          `${formatDateTimeSelect({ interval, timeZone })} as date`,
          `${select} as count`,
        ].join(', ')}`,
      ),
    )
    .groupByRaw('date WITH ROLLUP')
    .orderBy('date')

  if (dimension)
    base.whereNot({ [dimension as string]: '' })

  const { data: main } = await runQuery<ChartResponse[]>(base)

  return main
}

export async function dimensionChart(q: QueryMapItem): Promise<ComparedDataItem<ChartResponse>> {
  const p1 = performance.now()
  const { dimension = 'city' } = q

  let title: string
  let select: string
  if (isSessionDimension(dimension)) {
    title = 'Unique Visitors'
    select = 'uniq(clientId)'
  }
  else {
    title = 'Unique Hits'
    select = 'count(*)'
  }

  const qCompare = {
    ...q,
    timeEnd: q.compareEnd,
    timeStart: q.compareStart,
  }

  const qs: ChartResponse[][] = await Promise.all([
    dimensionChartQuery(select, q),
    dimensionChartQuery(select, qCompare),
  ])

  const [main, compare] = qs

  const mainTotals = main.shift()
  const compareTotals = compare.shift()

  nLog('info', `chart query ${performance.now() - p1}`)

  return { main, mainTotals, compare, compareTotals, title }
}

export async function dimensionTable(q: QueryMapItem): Promise<ComparedDataItem> {
  const p1 = performance.now()

  const { dimension = 'city', limit = 100, page = 1, orderBy, order } = q

  let table = 'event'
  let groupBy = dimension as string

  if (isSessionDimension(dimension)) {
    table = 'eventSession'
    groupBy = `session_${dimension}`
  }

  let columns: DisplayColumn[] = []

  let base: Knex.QueryBuilder = dateQuery(q)

  const orderDirection = order === 'asc' ? 'asc' : 'desc'

  if (dimension === 'pathname') {
    base = base
      .where({ eventName: 'exit' })
      .groupByRaw(`pathname WITH ROLLUP`)
      .orderBy(orderBy || 'views', orderDirection)

    columns = [
      { name: 'Page', value: dimension, select: groupBy },
      {
        name: 'Views',
        value: 'views',
        format: 'number',
        select: 'count(*)',
      },
      {
        name: 'Users',
        value: 'users',
        format: 'number',
        select: 'uniq(clientId)',
      },
      {
        name: 'Returning Users',
        value: 'returningVisitors',
        format: 'number',
        select: 'uniqIf(clientId, isNew=0)',
      },
      {
        name: 'Engage Time',
        value: 'engageDuration',
        format: 'duration',
        select: 'avg(engageDuration)',
      },
    ]
  }
  else if (table === 'eventSession') {
    const selectItems = [
      'sessionId',
      'any(projectId) as session_projectId',
      'any(clientId) as session_clientId',
      'uniq(clientId) as uniqueVisitors',
      'uniqIf(clientId, isNew=0) as returningVisitors',
      'min(timestamp) as session_timestamp',
      'sum(engageDuration) as session_engageDuration',
      'countIf(eventName=\'view\') as pageCount',
      'if(countIf(eventName=\'bot\') > 0, 1, 0) as isRobot',
      'if(pageCount > 1, 0, 1) as isBounce',
      'countIf(eventType=\'micro\') as totalMicroConversion',
      'countIf(eventType=\'macro\') as totalMacroConversion',
      'sum(value) as session_value',
      'if(totalMicroConversion > 0, 1, 0) as hasMicroConversion',
      'if(totalMacroConversion > 0, 1, 0) as hasMacroConversion',
      'uniq(eventId) as eventCount',
      'any(clientId) as session_clientId',
      'anyIf(os, eventName=\'init\') as session_os',
      'anyIf(browser, eventName=\'init\') as session_browser',
      'anyIf(referrer, eventName=\'init\') as session_referrer',
      'anyIf(referralSource, eventName=\'init\') as session_referralSource',
      'anyIf(referralCampaign, eventName=\'init\') as session_referralCampaign',
      'anyIf(referralMedium, eventName=\'init\') as session_referralMedium',
      'anyIf(deviceType, eventName=\'init\') as session_deviceType',
      'anyIf(timezone, eventName=\'init\') as session_timezone',
      'anyIf(city, eventName=\'init\') as session_city',
      'anyIf(language, eventName=\'init\') as session_language',
      'anyIf(countryCode, eventName=\'init\') as session_countryCode',
    ]
    base = qu()
      .from(
        base
          .clone()
          .select(qu().raw(selectItems.join(', ')))
          .groupBy('sessionId'),
      )
      .orderBy(orderBy || 'sessions', orderDirection)
      .groupByRaw(`${groupBy} WITH ROLLUP`)

    columns = [
      { name: dimension, value: dimension, select: groupBy },
      {
        name: 'Sessions',
        value: 'sessions',
        format: 'number',
        select: 'uniq(sessionId)',
      },
      {
        name: 'Users',
        value: 'users',
        format: 'number',
        select: 'uniq(session_clientId)',
      },
      {
        name: '% Returning',
        value: 'percentReturning',
        format: 'percent',
        select: 'round(sum(returningVisitors) / sum(uniqueVisitors) * 100, 2)',
      },
      {
        name: 'Time Engaged',
        value: 'engageDuration',
        format: 'duration',
        select: 'round(avg(session_engageDuration), 2)',
      },
      {
        name: 'Bounce',
        value: 'bounceRate',
        format: 'percent',
        select: 'round(avg(isBounce) * 100, 2)',
      },
      {
        name: 'Micro CV',
        value: 'totalMicroConversion',
        format: 'number',
        select: 'sum(totalMicroConversion)',
      },
      {
        name: 'Micro CVR',
        value: 'microConversionRate',
        format: 'percent',
        select: 'round(avg(hasMicroConversion) * 100, 2)',
      },
      {
        name: 'Macro CV',
        value: 'totalMacroConversion',
        format: 'number',
        select: 'sum(totalMacroConversion)',
      },
      {
        name: 'Macro CVR',
        value: 'macroConversionRate',
        format: 'percent',
        select: 'round(avg(hasMacroConversion) * 100, 2)',
      },
      {
        name: 'Value',
        value: 'totalValue',
        format: 'dollar',
        select: 'sum(session_value)',
      },
      {
        name: 'Avg. Value',
        value: 'avgValue',
        format: 'dollar',
        select: 'avg(session_value)',
      },
    ]
  }
  else {
    base = base.groupByRaw(`${dimension} WITH ROLLUP`).orderBy('hits', 'desc')
    columns = [
      { name: dimension, value: dimension, select: groupBy },
      {
        name: 'Hits',
        value: 'hits',
        format: 'number',
        select: 'count(*)',
      },
      {
        name: 'Users',
        value: 'unique',
        format: 'number',
        select: 'uniq(clientId)',
      },
      {
        name: 'Value',
        value: 'totalValue',
        format: 'dollar',
        select: 'sum(value)',
      },
      {
        name: 'Avg. Value',
        value: 'avgValue',
        format: 'dollar',
        select: 'sum(value) / hits',
      },
    ]
  }

  const select = columns.map((c) => {
    return `${c.select} as ${c.value}`
  })

  const offset = page * limit - limit
  const dbQuery = base
    .select(qu().raw(select.join(',')))
    .limit(limit)
    .offset(offset)
    .whereNot({ [groupBy]: '' })

  const r = await runQuery<AggregationResponse[]>(dbQuery)

  const { data: main } = r

  nLog('info', `report query ${performance.now() - p1}`)

  const mainTotals = main.shift()
  const total = r.rows_before_limit_at_least ?? 0
  return {
    main,
    mainTotals,
    columns,
    meta: {
      total,
      start: total > 0 ? offset + 1 : 0,
      end: Math.min(total, offset + limit),
      pages: total ? total / limit : 1,
    },

    title: `Report (${toLabel(dimension)})`,
  }
}
