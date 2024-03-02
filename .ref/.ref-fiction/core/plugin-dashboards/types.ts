import type { EndpointResponse, dayjs } from '@factor/api'

import type { PortableWidget } from './widget'

export type WidgetKeys = string

export type StandardPeriod =
  | 'hour'
  | 'hour4'
  | 'today'
  | 'yesterday'
  | 'recent'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'yearToDate'

export type ComparePeriods =
  | 'period'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'none'

export type TimeLineInterval = 'month' | 'week' | 'day' | 'hour' | 'minute'

export type ValueFormat =
  | 'number'
  | 'percent'
  | 'rawPercent'
  | 'dollar'
  | 'duration'
  | 'microDuration'

export type AggregationFormat =
  | 'enriched'
  | 'country'
  | 'city'
  | 'url'
  | 'standard'
  | 'size'
  | 'percent'
  | 'ip'

export type DataPoint = {
  [K in string | 'users' | 'count']: string | number | undefined
}

export type DataPointChart = {
  date: string
  label?: string
  tense?: 'past' | 'present' | 'future'
} & DataPoint

export interface WidgetResults<T = unknown> {
  widgetIds: string[]
  result: DataCompared<T>
}

export interface SocketMessageMap<T = unknown> {
  ping: undefined
  query: {
    _method: string
    params: QueryParams
  }
  'result:widgets': EndpointResponse<WidgetResults<T>>
}

export type SocketMessage<
  T extends keyof SocketMessageMap = keyof SocketMessageMap,
> = [T, SocketMessageMap[T]]

export interface DataColumn {
  name?: string
  sub?: string
  value: string | string[]
  subValue?: string | string[]
  format?: ValueFormat
  select?: string
}

export interface DataCompared<T = unknown> {
  title?: string
  description?: string
  main: T[]
  compare?: T[]
  mainTotals?: T
  compareTotals?: T
  columns?: DataColumn[]
  meta?: {
    total?: number
    start: number
    end: number
    pages: number
  }
  params?: QueryParamsRefined
  sql?: string
}

export interface AggregationRow {
  count: string | number
  name: string
  total: string | number
  percent: number
  niceName?: string
  icon?: string
  url?: string | string[]
  amount?: number
  list?: string[]
  countryCode?: string
}

export interface RequestDataFilter<T = string> {
  name: T
  value: string | number
  operator: '=' | '!='
}

export interface WidgetRequestResponse<T = unknown> {
  hashIds: string[]
  result: DataCompared<T>
}

export interface WidgetRequestBase {
  projectId?: string
  layout?: PortableWidget[]
  mode?: 'initial' | 'realtime'
  queryHandlerKey?: string
}

export interface WidgetRequestFilters {
  timeEndAtIso?: string
  timeStartAtIso?: string
  compare?: ComparePeriods
  filters?: RequestDataFilter[]
  interval?: TimeLineInterval
  period?: StandardPeriod
  limit?: number
  order?: 'asc' | 'desc'
  orderBy?: string
  page?: number
  url?: string
  origin?: string
  pathname?: string
  isRealtime?: boolean
  dimension?: string
  id?: string
  noCache?: boolean
  timeZone?: string
  search?: string
}

export type QueryParams = WidgetRequestBase & Partial<WidgetRequestFilters>

export type QueryParamsRefined = QueryParams & {
  timeZone: string
  projectId: string
  timeEndAt: dayjs.Dayjs
  timeStartAt: dayjs.Dayjs
  compareEndAt: dayjs.Dayjs
  compareStartAt: dayjs.Dayjs
  interval: TimeLineInterval
}

export type WidgetServerEventMap = {
  layout: {
    req: QueryParams
    res: EndpointResponse<WidgetRequestResponse>
  }
}

export interface RangeValue<T = unknown> {
  name: string
  timeStartAt: dayjs.Dayjs
  timeEndAt: dayjs.Dayjs
  value: T
}
