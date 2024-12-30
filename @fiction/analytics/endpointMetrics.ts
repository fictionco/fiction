import type { EndpointMeta, EndpointResponse } from '@fiction/core'
import type { Knex } from 'knex'
import type { DataCompared, DataPointChart, QueryParams, QueryParamsRefined } from './types'
import { AnalyticsEndpoint } from './endpoints'
import { refineParams } from './utils/refine'

type MetricSelector = {
  key: string
  events?: string[]
  selector?: string
  type: 'event' | 'session' | 'snapshot'
}

type MetricSelectorResult = MetricSelector & { data: DataCompared<DataPointChart<'value'>> }
type MetricSelectorResultResponse = EndpointResponse<MetricSelectorResult[]>
type MetricDataPoint = DataPointChart<string>
type ReturnData = DataCompared<DataPointChart<string>>
export type CompiledMetricsResponse = EndpointResponse<ReturnData>

const _exampleConfigCall: MetricSelector[] = [
  // Total Audience (combines multiple sources)
  {
    key: 'totalAudience',
    type: 'snapshot',
    events: [
      'subscriptionTotalActive',
      'followerLinkedIn',
      'followerTwitter',
      'followerInstagram',
    ],
  },

  // Site Traffic (session-based stats)
  {
    key: 'siteTraffic',
    type: 'event',
    selector: 'uniq(anonymousId)',
  },

  // Total Published Words (snapshot from multiple sources)
  {
    key: 'wordsPublished',
    type: 'snapshot',
    events: [
      'contentTotalWordsPosts',
      'contentTotalWordsSites',
    ],
  },

  // Email Subscribers (active only)
  {
    key: 'emailList',
    type: 'snapshot',
    events: ['subscriptionTotalActive'],
  },

  // Additional engagement metrics
  {
    key: 'engagedTime',
    type: 'session',
    selector: 'sum(session__engageDuration)',
  },
  {
    key: 'bounceRate',
    type: 'session',
    selector: 'avg(session__isBounce) * 100',
  },
]

export class QueryCompiledMetrics extends AnalyticsEndpoint {
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

    const subQueryBase = ch.clickhouseDateQuery({ params: refinedParams, table: 'event', isCompare })
      .whereIn('event', eventNames)
      .select([
        client.raw(`${dateSelect} as date`),
        'event',
        client.raw('argMax(value, timeAt) as event_value'),
      ])
      .groupBy(['date', 'event'])

    // Aggregate snapshots by metric keys
    const mainQuery = client
      .from(subQueryBase.as('snapshots'))
      .select(['date'])
      .select(metrics.map((metric) => {
        const events = metric.events || []
        return client.raw(
          `sum(CASE WHEN event IN (${
            events.map(() => '?').join(',')
          }) THEN event_value ELSE 0 END) as ??`,
          [...events, metric.key],
        )
      }))
      .groupByRaw('date WITH ROLLUP')
      .orderBy('date', 'asc')

    return mainQuery
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

    return { status: 'success', data: this.getMetricResults({ metrics, data }) }
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

    return metrics.map((metric) => {
      const key = metric.key
      const main = data.main?.map(d => ({ ...d, value: d[key] }))
      const compare = data.compare?.map(d => ({ ...d, value: d[key] }))
      const mainTotals = { ...data.mainTotals, value: data.mainTotals?.[key] || 0 }
      const compareTotals = { ...data.compareTotals, value: data.compareTotals?.[key] || 0 }

      return {
        ...metric,
        data: { main, compare, mainTotals, compareTotals, params: data.params },
      }
    })
  }

  async run(
    params: QueryParams & { metrics: MetricSelector[] },
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
}
