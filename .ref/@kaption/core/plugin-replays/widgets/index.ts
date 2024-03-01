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
import type { KaptionPluginSettings } from '../../utils'
import { QueryWidgetChart } from '../../plugin-analytics/widgets/queryDateChart'
import { getSessionList } from '../query'
import type { ReplaySessionEvent } from '../types'

const el = () => import('../../plugin-analytics/widgets/WidgetDateChart.vue')

export class QuerySessionIndex extends QueryWidget {
  selectors: string[]

  constructor(options: QueryWidgetOptions) {
    super(options)

    this.selectors = []
  }

  async query(
    params: QueryParamsRefined,
  ): Promise<DataCompared<ReplaySessionEvent>> {
    if (!this.kaptionClickHouse)
      throw new Error('kaptionClickHouse missing')
    const data = await getSessionList({
      params,
      kaptionClickHouse: this.kaptionClickHouse,
    })

    return { main: data }
  }
}

type ReplayChart = DataCompared<
  DataPointChart & { totalReplays: number, totalSessions: number }
>

export interface ReplayOverviewData {
  recentReplays: DataCompared<ReplaySessionEvent>
  replayChart: ReplayChart
}

export class QueryReplayOverview extends QueryWidget {
  selectors: string[]

  constructor(options: QueryWidgetOptions) {
    super(options)

    this.selectors = []
  }

  async query(params: QueryParamsRefined): Promise<ReplayOverviewData> {
    const service = this.settings.service
    const widget = this.settings.widget
    const recentReplayHandler = new QuerySessionIndex({
      service,
      widget,
    })

    const replayChartHandler = new QueryWidgetChart({
      service,
      key: 'chartSession',
      table: 'eventSession',
      selectors: [
        `count(*) as totalSessions`,
        `sum(session_hasReplay) as totalReplays`,
      ],
    })

    const [recentReplays, replayChart] = await Promise.all([
      recentReplayHandler.query({ limit: 4, ...params }),
      replayChartHandler.query(params),
    ])

    return { recentReplays, replayChart: replayChart as ReplayChart }
  }
}

export function getWidgets(service: KaptionPluginSettings) {
  const QueryWidgetChartSession = new QueryWidgetChart({
    service,
    key: 'chartSession',
    table: 'eventSession',
  })

  return [
    new Widget({
      widgetKey: 'replaysOverview',
      el: () => import('./WidgetReplayOverview.vue'),
      title: 'Sessions Today',
      description: 'How are you visits going today?',
      queryHandler: () => new QueryReplayOverview({ service }),
      params: { period: 'today' },
    }),
    new Widget({
      widgetKey: 'replayIndex',
      title: 'Recorded Replays',
      description: 'Watch replays of recorded sessions',
      el: () => import('./ReplayIndex.vue'),
      layoutHandling: 'full',
      queryHandler: () => new QuerySessionIndex({ service }),
      category: ['behavior'],
    }),
    new Widget({
      widgetKey: 'totalReplays',
      queryHandler: (w) => {
        return QueryWidgetChartSession.selectorsAdd([
          `sum(session_hasReplay) as ${w.widgetKey}`,
        ])
      },
      title: 'Total Replays',
      description: 'Number of replay recordings tracked',
      el,
      layoutHandling: 'chart',
      category: ['technical'],
    }),
    new Widget({
      widgetKey: 'replayTotalRecorded',
      queryHandler: (w) => {
        return QueryWidgetChartSession.selectorsAdd([
          `sum(session_replayDuration) as ${w.widgetKey}`,
        ])
      },
      title: 'Replay Time Recorded',
      description: 'The duration of time recorded in replays',
      el,
      layoutHandling: 'chart',
      ui: {
        valueFormat: 'duration',
      },
      category: ['technical'],
    }),
  ]
}
