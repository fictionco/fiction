import type { AggregationResponse } from '@kaption/core/plugin-analytics/types'

import type {
  DataCompared,
  DataPointChart,
  QueryParamsRefined,
  QueryWidgetOptions,
} from '@factor/api/plugin-dashboards'
import {
  QueryWidget,
  Widget,
} from '@factor/api/plugin-dashboards'
import { QueryWidgetAggregation } from '../../plugin-analytics/widgets/queryAggregate'
import type { KaptionPluginSettings } from '../../utils'
import type { ClickEvent } from '../types'
import { fillData } from '../../plugin-clickhouse/utils'

const elList = () => import('../../plugin-analytics/widgets/WidgetList.vue')

type ClickChartDataPoint = DataPointChart & {
  label?: string
  clicks: number
  interactions: number
}

export class QueryClicks extends QueryWidget {
  selectors: string[]

  constructor(options: QueryWidgetOptions) {
    super(options)

    this.selectors = []
  }

  async query(params: QueryParamsRefined): Promise<DataCompared<ClickEvent>> {
    if (!this.kaptionClickHouse)
      throw new Error('kaptionClickHouse missing')
    const ch = this.kaptionClickHouse
    const base = ch
      .clickhouseDateQuery({ params })
      .select('*')
      .where({ event: 'click' })
      .orderBy('timestamp', 'desc')
      .limit(1000)

    const r = await ch.clickHouseSelect<ClickEvent[]>(base)

    const main = r.data

    const mainTotals = main.shift()

    return { main, mainTotals }
  }
}

export class QueryClickChart extends QueryWidget {
  constructor(options: QueryWidgetOptions) {
    super(options)
  }

  async chartQuery(params: QueryParamsRefined): Promise<DataPointChart[]> {
    const ch = this.kaptionClickHouse
    if (!ch)
      throw new Error('no clickhouse service')
    const sql = ch.client()

    const { interval, timeZone } = params

    const selectors = [
      `sum(session_clickTotal) as count`,
      `sum(session_touchTotal) as touchTotal`,
      'sum(session_scrollTotal + session_keypressTotal + session_moveTotal + session_touchTotal + session_clickTotal) as interactionTotal',
    ]

    const selectDate = ch.formatDateTimeSelect({
      interval,
      timeField: 'session_timestamp',
      timeZone,
    })
    const dbQuery = ch
      .clickhouseDateQuerySession({ params })
      .select<any[]>(sql.raw(`${selectDate} as date, ${selectors.join(', ')}`))
      .groupByRaw('date WITH ROLLUP')
      .orderBy('date')

    const { data: r } = await ch.clickHouseSelect<any[]>(dbQuery)

    const result = fillData<DataPointChart>({
      ...params,
      data: r,
      withRollup: true,
    })

    return result
  }

  async query(
    params: QueryParamsRefined,
  ): Promise<DataCompared<ClickChartDataPoint>> {
    const qs: DataPointChart[][] = await Promise.all([this.chartQuery(params)])

    const [d] = qs

    const main: ClickChartDataPoint[] = d.map((d) => {
      return {
        date: d.date,
        label: d.label,
        tense: d.tense,
        clicks: +(d.count || 0),
        interactions: +(d.interactionTotal || 0),
        touches: +(d.touchTotal || 0),
      }
    })

    const mainTotals = main.shift()
    return { main, mainTotals }
  }
}

export interface HeatmapOverviewData {
  topSelectors: DataCompared<AggregationResponse>
  topPages: DataCompared<AggregationResponse>
  clickChart: DataCompared<ClickChartDataPoint>
}

export class QueryHeatmapOverview extends QueryWidget {
  selectors: string[]

  constructor(options: QueryWidgetOptions) {
    super(options)

    this.selectors = []
  }

  async query(params: QueryParamsRefined): Promise<HeatmapOverviewData> {
    const service = this.settings.service
    const widget = this.settings.widget
    const topSelectorHandler = new QueryWidgetAggregation({
      service,
      widget,
      countOn: 'count(*)',
      table: 'event',
      groupBy: 'selector',
      where: { event: 'click' },
    })

    const topPageHandler = new QueryWidgetAggregation({
      widget,
      service,
      countOn: 'count(*)',
      table: 'event',
      groupBy: 'pathname',
      where: { event: 'click' },
    })

    const clickChartHandler = new QueryClickChart({ service, widget })

    const [topSelectors, topPages, clickChart] = await Promise.all([
      topSelectorHandler.query(params),
      topPageHandler.query(params),
      clickChartHandler.query(params),
    ])

    return { topSelectors, topPages, clickChart }
  }
}

export function getWidgets(service: KaptionPluginSettings) {
  return [
    new Widget({
      widgetKey: 'heatmapsOverview',
      el: () => import('./WidgetOverview.vue'),
      title: 'Interactions Today',
      description: 'Overview of recorded clicks from today',
      queryHandler: widget => new QueryHeatmapOverview({ service, widget }),
      params: { period: 'today', isRealtime: true },
    }),
    new Widget({
      widgetKey: 'heatmap',
      queryHandler: widget => new QueryClicks({ service, widget }),
      title: 'Heatmap',
      description: 'Heatmap of recorded clicks',
      el: () => import('./WidgetHeatmap.vue'),
      layoutHandling: 'full',
      category: ['behavior'],
    }),
    new Widget({
      widgetKey: 'topClickSelectors',
      queryHandler: (widget) => {
        return new QueryWidgetAggregation({
          widget,
          service,
          countOn: 'count(*)',
          table: 'event',
          groupBy: 'selector',
          where: { event: 'click' },
        })
      },
      title: 'Top Click Selectors',
      description: 'Aggregation of clicks by selector',
      el: elList,
      layoutHandling: 'list',
      category: ['behavior'],
    }),
    new Widget({
      widgetKey: 'clicksPerPage',
      queryHandler: (widget) => {
        return new QueryWidgetAggregation({
          widget,
          service,
          countOn: 'count(*)',
          table: 'event',
          groupBy: 'pathname',
          where: { event: 'click' },
        })
      },
      title: 'Clicks per Page',
      description: 'Total number of click events tracked by page',
      el: elList,
      layoutHandling: 'list',
      category: ['behavior'],
    }),
  ]
}
