import type { EndpointMeta, EndpointResponse } from '@fiction/core'
import type { Knex } from 'knex'
import type {
  DataCompared,
  DataPointChart,
  MetricSelector,
  MetricSelectorResult,
  MetricSelectorResultResponse,
  QueryParams,
  QueryParamsRefined,
} from './types'
import { AnalyticsEndpoint } from './endpoints'
import { refineComparedData, refineParams } from './utils/refine'

type MetricDataPoint = DataPointChart<string>
type ReturnData = DataCompared<DataPointChart<string>>

export class QueryCompiledMetrics extends AnalyticsEndpoint {
  async run(
    params: QueryParams & { metrics: MetricSelector[], orgId: string },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<MetricSelectorResult[]>> {
    const refinedParams = refineParams(params)
    const {
      orgId,
      metrics = [],
    } = refinedParams

    if (!orgId)
      return { status: 'error', message: 'Missing orgId' }
    if (!metrics.length)
      return { status: 'error', message: 'No metrics specified' }

    // Handle snapshot metrics
    if (!metrics.length)
      return { status: 'success', data: [] }

    // Build and execute main query
    const snapshotResults = await this.getSnapshotData({ refinedParams })
    const eventData = await this.getEventData({ refinedParams })
    const sessionData = await this.getSessionData({ refinedParams })

    const allResults = [snapshotResults.data, eventData.data, sessionData.data].flat().filter(Boolean) as MetricSelectorResult[]

    return {
      status: 'success',
      data: allResults,
    }
  }

  getSnapshotQuery(args: {
    refinedParams: QueryParamsRefined
    metrics: MetricSelector[]
    isCompare?: boolean
  }): Knex.QueryBuilder {
    const { refinedParams, isCompare = false, metrics } = args

    const ch = this.ch()
    const client = ch.client()
    const dateSelect = ch.formatDateTimeSelect({
      interval: refinedParams.interval,
      timeZone: refinedParams.timeZone,
      timeField: 'timestamp',
    })

    // Get all unique event names across all snapshot metrics
    const eventNames = [...new Set(
      metrics.flatMap(m => m.events || []),
    )]

    // Return individual event values for each date
    return ch.clickhouseDateQuery({ params: refinedParams, table: 'event', isCompare })
      .whereIn('event', eventNames)
      .select([
        client.raw(`${dateSelect} as date`),
        ...eventNames.map(event =>
          ch.client().raw(`argMax(if(event = '${event}', value, null), timeAt) as ${event}`),
        ),
      ])
      .groupByRaw('date WITH ROLLUP')
      .orderBy('date')
  }

  private async getSnapshotData(args: {
    refinedParams: QueryParamsRefined & { metrics: MetricSelector[] }
  }): Promise<MetricSelectorResultResponse> {
    const { refinedParams } = args
    const ch = this.ch()

    const metrics = refinedParams.metrics.filter(m => m.type === 'snapshot')

    if (!metrics.length)
      return { status: 'success', data: [] }

    // Aggregate snapshots by metric keys
    const mainQuery = this.getSnapshotQuery({ refinedParams, metrics })

    const compareQuery = this.getSnapshotQuery({ refinedParams, metrics, isCompare: true })

    const [mainResult, compareResult] = await Promise.all([
      ch.clickHouseSelect<MetricDataPoint>(mainQuery, { caller: 'compiledMetricsMain' }),
      ch.clickHouseSelect<MetricDataPoint>(compareQuery, { caller: 'compiledMetricsCompare' }),
    ])

    const [mainTotals, ...main] = ch.cleanPrefixes(mainResult.data || [])
    const [compareTotals, ...compare] = ch.cleanPrefixes(compareResult.data || [])

    const data = {
      main,
      mainTotals: mainTotals || {},
      compare,
      compareTotals: compareTotals || {},
      params: refinedParams,
    }
    const finalData = this.getMetricResults({ metrics, data })

    return { status: 'success', data: finalData }
  }

  private getEventQuery(args: {
    refinedParams: QueryParamsRefined
    metrics: MetricSelector[]
    isCompare?: boolean
  }): Knex.QueryBuilder {
    const { refinedParams, isCompare = false, metrics } = args
    const ch = this.ch()
    const client = ch.client()

    const dateSelect = ch.formatDateTimeSelect({
      interval: refinedParams.interval,
      timeZone: refinedParams.timeZone,
      timeField: 'timestamp',
    })

    const mainQuery = ch.clickhouseDateQuery({ params: refinedParams, table: 'event', isCompare })
      .select([
        client.raw(`${dateSelect} as date`),
        ...metrics.map(m => client.raw(`${m.selector || 'count(*)'} as ??`, [m.key])),
      ])
      .groupByRaw('date WITH ROLLUP')
      .orderBy('date', 'asc')

    this.log.debug('Event Query', { data: { mainQuery: mainQuery.toString() } })

    return mainQuery
  }

  private async getEventData(args: {
    refinedParams: QueryParamsRefined & { metrics: MetricSelector[] }
  }): Promise<MetricSelectorResultResponse> {
    const { refinedParams } = args
    const ch = this.ch()

    const metrics = refinedParams.metrics.filter(m => m.type === 'event')

    if (!metrics.length) {
      return { status: 'success', data: [] }
    }

    const mainQuery = this.getEventQuery({ refinedParams, metrics })
    const compareQuery = this.getEventQuery({ refinedParams, metrics, isCompare: true })

    const [mainResult, compareResult] = await Promise.all([
      ch.clickHouseSelect<MetricDataPoint>(mainQuery, { caller: 'eventMetricsMain' }),
      ch.clickHouseSelect<MetricDataPoint>(compareQuery, { caller: 'eventMetricsCompare' }),
    ])

    const [mainTotals, ...main] = ch.cleanPrefixes(mainResult.data || [])
    const [compareTotals, ...compare] = ch.cleanPrefixes(compareResult.data || [])

    const data = {
      main,
      mainTotals: mainTotals || {},
      compare,
      compareTotals: compareTotals || {},
      params: refinedParams,
    }

    return { status: 'success', data: this.getMetricResults({ metrics, data }) }
  }

  private getSessionQuery(args: {
    refinedParams: QueryParamsRefined
    metrics: MetricSelector[]
    isCompare?: boolean
  }): Knex.QueryBuilder {
    const { refinedParams, isCompare = false, metrics } = args
    const ch = this.ch()
    const client = ch.client()

    const dateSelect = ch.formatDateTimeSelect({
      interval: refinedParams.interval,
      timeZone: refinedParams.timeZone,
      timeField: 'session__timestamp',
    })

    const mainQuery = ch.clickhouseDateQuerySession({ params: refinedParams, isCompare })
      .select([
        client.raw(`${dateSelect} as date`),
        ...metrics.map(m => client.raw(`${m.selector} as ??`, [m.key])),
      ])
      .groupByRaw('date WITH ROLLUP')
      .orderBy('date', 'asc')

    return mainQuery
  }

  private async getSessionData(args: {
    refinedParams: QueryParamsRefined & { metrics: MetricSelector[] }
  }): Promise<MetricSelectorResultResponse> {
    const { refinedParams } = args

    const orgId = refinedParams.orgId

    if (!orgId) {
      throw new Error('Missing orgId')
    }
    const ch = this.ch()
    const metrics = refinedParams.metrics.filter(m => m.type === 'session')

    if (!metrics.length) {
      return { status: 'success', data: [] }
    }

    const mainQuery = this.getSessionQuery({ refinedParams, metrics })
    const compareQuery = this.getSessionQuery({ refinedParams, metrics, isCompare: true })

    const [mainResult, compareResult] = await Promise.all([
      ch.clickHouseSelect<MetricDataPoint>(mainQuery, { caller: 'sessionMetricsMain' }),
      ch.clickHouseSelect<MetricDataPoint>(compareQuery, { caller: 'sessionMetricsCompare' }),
    ])

    const [mainTotals, ...main] = ch.cleanPrefixes(mainResult.data || [])
    const [compareTotals, ...compare] = ch.cleanPrefixes(compareResult.data || [])

    const data = {
      main,
      mainTotals: mainTotals || {},
      compare,
      compareTotals: compareTotals || {},
      params: refinedParams,
    }

    return { status: 'success', data: this.getMetricResults({ metrics, data }) }
  }

  getMetricResults(args: { metrics: MetricSelector[], data: ReturnData }): MetricSelectorResult[] {
    const { metrics, data } = args
    const snapshotKeys = metrics
      .filter(m => m.type === 'snapshot')
      .flatMap(m => m.events || [])

    const refinedData = refineComparedData({ data, snapshotKeys })

    function transformPoints(points: DataPointChart[] = [], metric: MetricSelector) {
      return points.map(point => transformPoint({ point, metric })) as DataPointChart[]
    }

    function transformPoint(args: { point?: DataPointChart, metric: MetricSelector }) {
      const { point, metric } = args
      if (!point)
        return undefined

      const value = metric?.type === 'snapshot' && metric.events?.length
        ? metric.events.reduce((sum, key) => sum + (Number(point[key]) || 0), 0)
        : +(point[metric?.key] || 0)

      return { ...point, value }
    }

    const out = metrics.map(metric => ({
      ...metric,
      data: {
        ...refinedData,
        main: transformPoints(refinedData.main, metric),
        compare: transformPoints(refinedData.compare, metric),
        mainTotals: transformPoint({ point: refinedData.mainTotals, metric }),
        compareTotals: transformPoint({ point: refinedData.compareTotals, metric }),
      },
    }))

    return out
  }
}
