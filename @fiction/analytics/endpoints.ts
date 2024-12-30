import type { EndpointMeta, EndpointResponse } from '@fiction/core'
import type { Knex } from 'knex'
import type { EventParams } from './plugin-beacon/index.js'
import type { FictionClickHouse, FictionClickHouseSettings } from './plugin-clickhouse/index.js'
import type { AggregationRow, DataCompared, DataPointChart, QueryParams } from './types.js'
import { abort, dayjs, Query, vue } from '@fiction/core'
import { refineParams } from './utils/refine.js'

export type AnalyticsEndpointSettings = FictionClickHouseSettings & {
  fictionClickHouse: FictionClickHouse
}

export abstract class AnalyticsEndpoint extends Query<AnalyticsEndpointSettings> {
  ch = () => {
    const ch = this.settings.fictionClickHouse
    if (!ch)
      throw new Error('fictionClickHouse missing')

    return ch
  }

  constructor(settings: AnalyticsEndpointSettings) {
    super(settings)
  }
}

// Analytics Query
const dataKeys = ['value'] as const
type MetricDataPoint = DataPointChart<typeof dataKeys[number]>
type ReturnData = DataCompared<MetricDataPoint>
export type MetricAnalyticsResponse = EndpointResponse<ReturnData>

export class QueryMetricAnalytics extends AnalyticsEndpoint {
  override dataKeys = dataKeys
  override getParams = () => refineParams({})
  override dataRef = vue.ref<ReturnData>({})

  async run(params: QueryParams, _meta: EndpointMeta): Promise<MetricAnalyticsResponse> {
    const refinedParams = refineParams(params)
    const {
      timeZone = 'UTC',
      orgId,
      event,
      timeStartAtIso,
      timeEndAtIso,
      interval = 'day',
      handling = 'increment',
    } = refinedParams

    if (!orgId)
      return { status: 'error', message: 'Missing orgId' }
    if (!event)
      return { status: 'error', message: 'Missing event' }

    const ch = this.ch()
    const client = ch.client()

    const buildTimeSeriesQuery = (startIso: string, endIso: string) => {
      const dateSelect = ch.formatDateTimeSelect({ interval, timeZone, timeField: 'timestamp' })
      const events = Array.isArray(event) ? event : [event]

      if (handling === 'snapshot') {
        // For snapshots, get last value per event then sum
        const subquery = ch
          .clickhouseDateQuery({ params: refinedParams, table: 'event' })
          .whereIn('event', events)
          .select([
            client.raw(`${dateSelect} as date`),
            'event',
            client.raw('argMax(value, timeAt) as event_last_snapshot'),
          ])
          .groupBy(['date', 'event'])

        return client
          .from(subquery.as('snapshots'))
          .select([
            'date',
            client.raw('sum(event_last_snapshot) as value'),
          ])
          .groupByRaw('date WITH ROLLUP')
          .orderBy('date', 'asc')
      }
      else {
        // For incremental values, sum directly
        const query = ch.clickhouseDateQuery({
          params: { ...refinedParams, timeStartAtIso: startIso, timeEndAtIso: endIso },
          table: 'event',
        })

        query.whereIn('event', events)

        const countFunction = handling === 'increment'
          ? 'sum(value)'
          : 'count(*)'

        return query
          .select([
            client.raw(`${dateSelect} as date`),
            client.raw(`${countFunction} as value`),
          ])
          .groupByRaw('date WITH ROLLUP')
          .orderBy('date', 'asc')
      }
    }

    const diff = dayjs(timeEndAtIso).diff(dayjs(timeStartAtIso), 'seconds')
    const compareEndAtIso = refinedParams.compareEndAtIso || timeStartAtIso
    const compareStartAtIso = refinedParams.compareStartAtIso
      || dayjs(compareEndAtIso).subtract(diff, 'seconds').toISOString()

    // Build and execute queries
    const [mainResult, compareResult] = await Promise.all([
      ch.clickHouseSelect<MetricDataPoint>(
        buildTimeSeriesQuery(timeStartAtIso, timeEndAtIso),
        { caller: 'mainResult' },
      ),
      ch.clickHouseSelect<MetricDataPoint>(
        buildTimeSeriesQuery(compareStartAtIso, compareEndAtIso),
        { caller: 'compareResult' },
      ),
    ])

    // Process results
    const mainData = ch.cleanPrefixes(mainResult.data || [])
    const compareData = ch.cleanPrefixes(compareResult.data || [])

    const [mainTotals, ...main] = mainData
    const [compareTotals, ...compare] = compareData

    return {
      status: 'success',
      data: {
        main,
        mainTotals: mainTotals || {},
        compare,
        compareTotals: compareTotals || {},
        params: refinedParams,
      },
    }
  }
}

export class QueryGetClientSessions extends AnalyticsEndpoint {
  async run(params: { anonymousId: string, orgId: string, limit?: number }, _meta: EndpointMeta): Promise<EndpointResponse<EventParams[]>> {
    const { anonymousId, orgId, limit = 10 } = params

    const query = this.ch().clickhouseBaseQuerySession({ orgId }).where({ anonymousId }).limit(limit)

    const { data } = await this.ch().clickHouseSelect<EventParams>(query, { caller: 'QueryGetClientSessions' })

    return { status: 'success', data }
  }
}

export class QueryGetTotalSessions extends AnalyticsEndpoint {
  async run(params: { anonymousId: string, orgId: string }, _meta: EndpointMeta): Promise<EndpointResponse<number>> {
    const { anonymousId, orgId } = params
    const query = this.ch()
      .clickhouseBaseQuery({ orgId, table: 'event' })
      .select(this.ch().client().raw('count(sessionId) as total'))
      .where({ anonymousId })
      .groupBy('anonymousId')

    const { data } = await this.ch().clickHouseSelect<{ total: number }>(query, { caller: 'QueryGetTotalSessions' })

    const total = data[0]?.total || 0

    return { status: 'success', data: total }
  }
}

export class QueryGetDimensionList extends AnalyticsEndpoint {
  async run(params: QueryParams): Promise<EndpointResponse<AggregationRow[]>> {
    const client = this.ch().client()
    const refined = refineParams(params)
    const { limit = 40, dimension, search } = refined

    if (!dimension)
      throw abort('no dimension field provided')

    const base: Knex.QueryBuilder = this.ch().clickhouseDateQuery({ params: refined, table: 'event' })

    const select = [
      client.raw(`uniq(*) as count`),
      client.raw(`?? as name`, [dimension]),
    ]

    const dbQuery = base
      .select(select)
      .groupBy(dimension)
      .orderBy('count', 'desc')
      .whereNot({ [dimension]: '' })
      .limit(limit)

    if (search) {
      void dbQuery.whereRaw(
        client.raw(`?? like '%?%'`, [dimension, search]),
      )
    }

    const { data: r } = await this.ch().clickHouseSelect<AggregationRow>(dbQuery, { caller: 'QueryGetDimensionList' })

    return { status: 'success', data: r }
  }
}
