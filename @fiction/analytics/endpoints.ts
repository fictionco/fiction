import type { EndpointMeta, EndpointResponse } from '@fiction/core'
import type { Knex } from 'knex'
import type { EventParams } from './plugin-beacon/index.js'
import type { FictionClickHouse, FictionClickHouseSettings } from './plugin-clickhouse/index.js'
import type { AggregationRow, DataCompared, DataPointChart, QueryParams, QueryParamsRefined } from './types.js'
import { abort, dayjs, Query, vue, waitFor } from '@fiction/core'
import { refineParams } from './utils/refine.js'

type AnalyticsEndpointSettings = FictionClickHouseSettings & {
  fictionClickHouse: FictionClickHouse
}

abstract class AnalyticsEndpoint extends Query<AnalyticsEndpointSettings> {
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

export class QueryEventTrack extends AnalyticsEndpoint {
  async run(params: { orgId: string, event: string } & Partial<EventParams>, _meta: EndpointMeta): Promise<EndpointResponse> {
    const { orgId, event, value, timestamp = dayjs().unix() } = params

    try {
      const metricRow = { orgId, event, value, timestamp }

      const fictionClickHouse = this.settings.fictionClickHouse

      if (fictionClickHouse) {
        await fictionClickHouse.saveData({ table: 'event', rows: [metricRow] })
      }

      return { status: 'success' }
    }
    catch (error) {
      this.log.error('Failed to track metric', { data: params, error })
      return { status: 'error', message: 'Failed to track metric' }
    }
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

      const query = ch.clickhouseDateQuery({
        params: { ...refinedParams, timeStartAtIso: startIso, timeEndAtIso: endIso },
        table: 'event',
      })

      query.whereIn('event', Array.isArray(event) && event.length > 0 ? event : [event])

      // add up if increment (traffic) or if snapshot, use last value (followers)
      const countFunction = handling === 'snapshot'
        ? 'argMax(value, timeAt)'
        : handling === 'increment'
          ? 'sum(value)'
          : 'count(*)'

      return query
        .select([
          client.raw(`${dateSelect} as date`),
          client.raw(`${countFunction} as value`), // in ch can't use count -> if same as column name
        ])
        .groupByRaw('date WITH ROLLUP')
        .orderBy('date', 'asc')
    }

    const diff = dayjs(timeEndAtIso).diff(dayjs(timeStartAtIso), 'seconds')

    const compareEndAtIso = refinedParams.compareEndAtIso || timeStartAtIso
    const compareStartAtIso = refinedParams.compareStartAtIso || dayjs(compareEndAtIso).subtract(diff, 'seconds').toISOString()

    // Build main and comparison period queries
    const mainQuery = buildTimeSeriesQuery(timeStartAtIso, timeEndAtIso)
    const compareQuery = buildTimeSeriesQuery(compareStartAtIso, compareEndAtIso)

    const mainResult = await ch.clickHouseSelect<MetricDataPoint>(mainQuery, { caller: 'mainResult' })

    const compareResult = await ch.clickHouseSelect<MetricDataPoint>(compareQuery, { caller: 'compareResult' })

    // Destructure with clearer variable names and safe fallbacks
    const mainData = ch.cleanPrefixes(mainResult.data || [])
    const compareData = ch.cleanPrefixes(compareResult.data || [])

    // Extract totals and detail records
    const mainTotals = mainData[0] || {}
    const main = mainData.slice(1)

    const compareTotals = compareData[0] || {}
    const compare = compareData.slice(1)
    return {
      status: 'success',
      data: { main, mainTotals, compare, compareTotals, params: refinedParams },
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
