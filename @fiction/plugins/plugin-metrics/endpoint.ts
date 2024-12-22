import type { DataCompared, DataPointChart, QueryParamsRefined } from '@fiction/analytics/types'
import type { EndpointMeta, EndpointResponse, FictionEnv } from '@fiction/core'
import type { FictionMetrics } from '.'
import { refineParams, refineTimelineData } from '@fiction/analytics/utils/refine'
import { dayjs, Query, vue } from '@fiction/core'
import { t } from './schema'

// Base settings for both queries
type MetricEndpointSettings = {
  fictionMetrics: FictionMetrics
  fictionEnv: FictionEnv
}

// Abstract base class for ClickHouse endpoints
abstract class MetricEndpoint extends Query<MetricEndpointSettings> {
  ch = () => {
    const ch = this.settings.fictionMetrics.settings.fictionAnalytics.fictionClickhouse
    if (!ch)
      throw new Error('fictionClickhouse missing')
    return ch
  }
}

// Tracking Query
export type MetricTrackRequest = {
  orgId: string
  metric: string
  count: number
  handling?: 'snapshot' | 'increment'
}

export type MetricTrackResponse = EndpointResponse<{ count: number }>

export class QueryMetricTrack extends MetricEndpoint {
  async run(params: MetricTrackRequest, meta: EndpointMeta): Promise<MetricTrackResponse> {
    const { orgId, metric, count, handling = 'increment' } = params

    try {
      await this.settings.fictionMetrics.trackMetric({
        orgId,
        metric,
        count,
        handling,
        timestamp: Date.now(),
      })

      return {
        status: 'success',
        data: { count },
        message: 'Metric tracked successfully',
      }
    }
    catch (error) {
      this.log.error('Failed to track metric', { data: params, error })
      return {
        status: 'error',
        message: 'Failed to track metric',
      }
    }
  }
}

// Analytics Query
const dataKeys = ['count', 'total'] as const
type MetricDataPoint = DataPointChart<typeof dataKeys[number]>
type ReturnData = DataCompared<MetricDataPoint>
export type MetricAnalyticsResponse = EndpointResponse<ReturnData>

export class QueryMetricAnalytics extends MetricEndpoint {
  override dataKeys = dataKeys
  override getParams = () => refineParams({})
  override dataRef = vue.ref<ReturnData>({})

  async run(params: QueryParamsRefined, _meta: EndpointMeta): Promise<MetricAnalyticsResponse> {
    const { timeZone = 'UTC', orgId, metric } = params

    if (!orgId)
      return { status: 'error', message: 'Missing orgId' }

    if (!metric)
      return { status: 'error', message: 'Missing metric' }

    const ch = this.ch()
    const client = ch.client()

    // Get the handling type for this metric
    const baseQuery = ch.clickhouseDateQuery({
      params,
      table: 'metrics',
    }).where('metric', metric)

    // First get the handling type
    const { data: [metricConfig] } = await ch.clickHouseSelect<{
      handling: 'snapshot' | 'increment'
    }>(
      baseQuery
        .select('handling')
        .orderBy('timestamp', 'desc')
        .limit(1),
    )

    const handling = metricConfig?.handling || 'increment'

    let query
    if (handling === 'snapshot') {
      // For snapshots, we want to get the last value for each date period
      // We use a window function to carry forward the last known value
      query = client.from(
        baseQuery.select(
          client.raw(`
            ${ch.formatDateTimeSelect({ interval: params.interval, timeZone })} as date,
            last_value(count) OVER (
              ORDER BY toUnixTimestamp(timestamp)
              RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
            ) as count,
            1 as total
          `),
        ),
      ).groupBy('date').orderBy('date', 'asc')
    }
    else {
      // For incremental metrics, sum up the values in each period
      query = client.from(
        baseQuery.select(
          client.raw(`
            ${ch.formatDateTimeSelect({ interval: params.interval, timeZone })} as date,
            SUM(count) as count,
            COUNT(*) as total
          `),
        ),
      ).groupBy('date').orderBy('date', 'asc')
    }

    // Get timeseries data
    const { data: results } = await ch.clickHouseSelect<{
      date: string
      count: string
      total: string
    }>(query)

    // Calculate totals differently based on handling
    const totalsQuery = handling === 'snapshot'
      ? baseQuery
          .select(
            client.raw(`
              last_value(count) OVER (ORDER BY toUnixTimestamp(timestamp)) as count,
              1 as total
            `),
          )
          .limit(1)
      : baseQuery
          .select(
            client.raw(`
              SUM(count) as count,
              COUNT(*) as total
            `),
          )
          .limit(1)

    const { data: [totals] } = await ch.clickHouseSelect<{
      count: string
      total: string
    }>(totalsQuery)

    // Format data for chart
    const mainData: MetricDataPoint[] = results.map(row => ({
      date: row.date,
      count: Number(row.count),
      total: Number(row.total),
    }))

    const mainTotals = totals
      ? {
          date: '',
          count: Number(totals.count),
          total: Number(totals.total),
        }
      : undefined

    const main = refineTimelineData({
      data: mainData,
      timeStartAtIso: params.timeStartAtIso,
      timeEndAtIso: params.timeEndAtIso,
      interval: params.interval,
      timeZone,
    })

    return {
      status: 'success',
      data: {
        main,
        mainTotals,
        params,
      },
    }
  }
}
