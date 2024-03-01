import type { Knex } from 'knex'
import type {
  DataColumn,
  DataCompared,
  QueryParamsRefined,
  QueryWidgetOptions,
} from '@factor/api/plugin-dashboards'
import {
  QueryWidget,
} from '@factor/api/plugin-dashboards'
import { isSessionField } from '../../plugin-beacon'
import type { AggregationResponse } from '../types'

export interface DateResponse {
  date: string
  [key: string]: string | number
}

export class QueryReport extends QueryWidget {
  widget = this.settings.widget
  constructor(options: QueryWidgetOptions) {
    super(options)
  }

  async query(
    params: QueryParamsRefined,
  ): Promise<DataCompared<AggregationResponse>> {
    const ch = this.kaptionClickHouse

    if (!ch)
      throw new Error('no clickhouse service')

    const p1 = performance.now()

    const {
      dimension = 'cityName',
      limit = 100,
      page = 1,
      orderBy,
      order,
    } = params

    let groupBy = dimension as string

    let base: Knex.QueryBuilder
    let columnFormat: 'event' | 'session' | 'page' = 'event'

    if (dimension === 'pathname')
      columnFormat = 'page'

    if (isSessionField(dimension)) {
      columnFormat = 'session'
      groupBy = `session_${dimension}`
      base = ch
        .clickhouseDateQuerySession({ params })
        .groupByRaw(`${groupBy} WITH ROLLUP`)
    }
    else {
      base = ch
        .clickhouseDateQuery({ params })
        .groupByRaw(`${groupBy} WITH ROLLUP`)
    }

    let columns: DataColumn[] = []

    const orderDirection = order === 'asc' ? 'asc' : 'desc'

    if (columnFormat === 'page') {
      base = base
        .where({ event: 'view' })
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
          select: 'uniq(anonymousId)',
        },
        {
          name: 'Returning Users',
          value: 'returningVisitors',
          format: 'number',
          select: 'uniqIf(anonymousId, isNew=0)',
        },
        {
          name: 'Engage Time',
          value: 'engageDuration',
          format: 'duration',
          select: 'avg(engageDuration)',
        },
      ]
    }
    else if (columnFormat === 'session') {
      base = base.orderBy(orderBy || 'sessions', orderDirection)

      columns = [
        { name: dimension, value: dimension, select: groupBy },
        {
          name: 'Sessions',
          value: 'sessions',
          format: 'number',
          select: 'uniq(session_sessionId)',
        },
        {
          name: 'Users',
          value: 'users',
          format: 'number',
          select: 'uniq(session_anonymousId)',
        },
        {
          name: '% Returning',
          value: 'percentReturning',
          format: 'percent',
          select:
            'round(sum(session_isReturning) / uniq(session_sessionId) * 100, 2)',
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
          select: 'round(avg(session_isBounce) * 100, 2)',
        },
        {
          name: 'Goal Conversions',
          value: 'totalGoalConversion',
          format: 'number',
          select: 'sum(session_totalGoalConversion)',
        },
        {
          name: 'Goal Rate',
          value: 'goalConversionRate',
          format: 'percent',
          select: 'round(avg(session_hasGoalConversion) * 100, 2)',
        },
        {
          name: 'Total Conversion',
          value: 'totalConversion',
          format: 'number',
          select: 'sum(session_totalConversion)',
        },
        {
          name: 'Conversion Rate',
          value: 'conversionRate',
          format: 'percent',
          select: 'round(avg(session_hasConversion) * 100, 2)',
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
      base = base.orderBy('hits', 'desc')
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
          select: 'uniq(anonymousId)',
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
      .select(ch.client().raw(select.join(',')))
      .limit(limit)
      .offset(offset)
      .whereNot({ [groupBy]: '' })

    const r = await ch.clickHouseSelect<AggregationResponse[]>(dbQuery)

    const { data: main } = r

    this.log.info(`report query ${performance.now() - p1}`)

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

      title: `Report (${this.utils.toLabel(dimension)})`,
    }
  }
}

export class QueryReportChart extends QueryWidget {
  widget = this.settings.widget
  constructor(options: QueryWidgetOptions) {
    super(options)
  }

  async dimensionChartQuery(
    params: QueryParamsRefined,
  ): Promise<DataCompared<DateResponse>> {
    const ch = this.kaptionClickHouse

    if (!ch)
      throw new Error('no clickhouse service')

    const { interval, dimension = 'cityName', timeZone } = params
    let dimensionField: string = dimension
    let title: string
    let select: string
    let base: Knex.QueryBuilder
    let timeField: 'timestamp' | 'session_timestamp' = 'timestamp'
    if (isSessionField(dimension)) {
      title = 'Unique Visitors'
      select = 'uniq(session_anonymousId)'
      timeField = 'session_timestamp'
      dimensionField = `session_${dimension}`
      base = ch.clickhouseDateQuerySession({ params })
    }
    else {
      title = 'Unique Hits'
      select = 'count(*)'
      base = ch.clickhouseDateQuery({ params })
    }

    base = base
      .select(
        ch.client().raw(
          `${[
            `${ch.formatDateTimeSelect({
              interval,
              timeZone,
              timeField,
            })} as date`,
            `${select} as ${this.widget?.widgetKey}`,
          ].join(', ')}`,
        ),
      )
      .groupByRaw('date WITH ROLLUP')
      .orderBy('date')

    if (dimension)
      void base.whereNot({ [dimensionField]: '' })

    const { data: main } = await ch.clickHouseSelect<DateResponse[]>(base)

    return { main, title }
  }

  async query(params: QueryParamsRefined): Promise<DataCompared<DateResponse>> {
    const ch = this.kaptionClickHouse

    if (!ch)
      throw new Error('no clickhouse service')

    const p1 = performance.now()

    const paramsCompare = {
      ...params,
      timeEndAt: params.compareEndAt,
      timeStartAt: params.compareStartAt,
    }

    const qs: DataCompared<DateResponse>[] = await Promise.all([
      this.dimensionChartQuery(params),
      this.dimensionChartQuery(paramsCompare),
    ])

    const [{ main, title }, { main: compare }] = qs

    const mainTotals = main.shift()
    const compareTotals = compare.shift()

    this.log.info(`chart query ${performance.now() - p1}`)

    return { main, mainTotals, compare, compareTotals, title }
  }
}
