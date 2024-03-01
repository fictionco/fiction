export interface PlotPoint { date: string, value: number }
export type PlotLine = PlotPoint[]

export type PlotInterval = 'month' | 'day' | 'hour' | 'minute'

export type PlotMetric = 'visitors' | 'events'

export type TimePeriod = 'today' | 'yesterday' | 'custom' | string

export interface GraphStat {
  id: string
  count: number
  previous: number
  name: string
  format?: 'duration' | 'percent' | 'count'
}

export interface StandardPlotData {
  plot: PlotLine
  metric: PlotMetric
  presentIndex: number
  interval: PlotInterval
  topStats: GraphStat[]
}

export interface AggregationItem {
  name: string
  count: number
  percent?: number
  filter?: string
}

export interface ClickhouseQueryResult<T = unknown> {
  rows: number
  rows_before_limit_at_least?: number
  data: T
  meta?: { name: string, type: string }[]
  statistics?: { elapsed: number, rows_read: number, bytes_read: number }
}

export interface ClientQuery {
  from: string
  to: string
  interval: PlotInterval
  period: TimePeriod
  projectId: string
  page: number
  limit: number
}
