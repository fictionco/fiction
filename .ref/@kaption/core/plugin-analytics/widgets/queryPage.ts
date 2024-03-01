import type {
  DataCompared,
  QueryParamsRefined,
  QueryWidgetOptions,
} from '@factor/api/plugin-dashboards'
import {
  QueryWidget,
} from '@factor/api/plugin-dashboards'
import type { AggregationResponse } from '../types'

type QueryPageEventsSettings = {
  event: string
  selectors?: string[]
} & QueryWidgetOptions

/**
 * Aggregates events grouped by page (pathname)
 */
export class QueryPageEvents extends QueryWidget<QueryPageEventsSettings> {
  widget = this.settings.widget
  event = this.settings.event
  selectors = this.settings.selectors || []
  constructor(options: QueryPageEventsSettings) {
    super(options)
  }

  async query(
    params: QueryParamsRefined,
  ): Promise<DataCompared<AggregationResponse>> {
    const { limit = 20 } = params
    const ch = this.kaptionClickHouse

    if (!ch)
      throw new Error('no clickhouse service')

    const sql = ch.client()

    const select = [
      `count(*) as count`,
      `pathname as name`,
      `groupUniqArray(3)([label, trace]) as list`,
    ]

    if (this.selectors)
      select.push(...this.selectors)

    const chartQuery = ch
      .clickhouseDateQuery({ params })
      .select(sql.raw(select.join(',')))
      .groupByRaw('pathname WITH ROLLUP')
      .where({ event: 'error' })
      .whereNot({ label: '' })
      .orderBy('count', 'desc')
      .limit(limit)

    const [response] = await Promise.all([
      ch.clickHouseSelect<AggregationResponse[]>(chartQuery),
    ])

    const main = response.data
    const mainTotals = main.shift()

    return {
      main,
      mainTotals,
    }
  }
}
