import type { AllFields, EventFields } from '@kaption/types'
import type dayjs from 'dayjs'
import type { WidgetDataMap } from './map'
import type * as replay from './replay/types'
import type * as security from './security/types'
import type * as technical from './technical/types'

export type ComparePeriods =
  | 'period'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'none'
export type TimeLineInterval = 'month' | 'week' | 'day' | 'hour' | 'minute'

export interface RequestDataFilter<T = keyof AllFields> {
  name: T
  value: string | number
  operator: '=' | '!='
}

export interface RequestBase {
  projectId?: string
  layout?: RequestWidget[]
  mode?: 'initial' | 'realtime'
}

export interface WidgetServiceConfig {
  title: string
  description?: string
  ui?: string
  colSpan?: number
  rowSpan?: number
}

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
  | 'url'
  | 'standard'
  | 'size'
  | 'percent'
  | 'ip'

export type QueryFormat =
  | 'aggregation'
  | 'chart'
  | 'activeUsers'
  | 'list'
  | 'dimensionTable'
  | 'dimensionChart'
  | 'clickList'
  | replay.QueryFormat
  | security.QueryFormat
  | technical.QueryFormat

export type QueryTable = 'session' | 'event' | 'eventSession'

export type RequestFilters = {
  timeEndIso?: string
  timeStartIso?: string
  compare?: ComparePeriods
  filters?: RequestDataFilter[]
  interval?: TimeLineInterval
  limit?: number
  order?: 'asc' | 'desc'
  orderBy?: string
  page?: number
  pathname?: string
  realtime?: boolean
  dimension?: keyof EventFields
  id?: string
  noCache?: boolean
  timeZone?: string
  search?: string
} & Partial<WidgetServiceConfig>

export type RequestFullAnalytics = RequestBase & RequestFilters

export type RequestFullAnalyticsRefined = RequestFullAnalytics & {
  timeZone: string
  projectId: string
  timeEnd: dayjs.Dayjs
  timeStart: dayjs.Dayjs
  compareEnd: dayjs.Dayjs
  compareStart: dayjs.Dayjs
  interval: TimeLineInterval
}

export type UserWidget = {
  widget: keyof WidgetDataMap
  widgetId?: string
} & RequestFilters

export type RequestWidget = UserWidget & { widgetId: string }

export type FullWidget<T = unknown> = RequestWidget &
  DataMapWidgets & {
    widgetId?: string
    data?: ResponseData<T>
    loading?: boolean
    errorMessage?: string
  }

export type FinalQueryWidgetConfig = Partial<RequestWidget> &
  DataMapWidgets & { hash?: string }

export type QueryWidgetResponse<T = unknown> = RequestFullAnalyticsRefined & {
  widget: string
  widgetIds: string[]
  data?: T
  hash: string
}

export type QueryMapItem<T = unknown> = DataMapType<unknown> &
  QueryWidgetResponse<T>

export type QueryMap = Record<string, QueryMapItem>

export type AnalyticsDataPoint = {
  [K in keyof WidgetDataMap | AdditionalColumnKeys]: string | number
}

export interface DateResponse {
  date: string
}

export type ChartResponse = DateResponse & AnalyticsDataPoint
export interface AggregationResponse {
  count: string | number
  name: string
  total: string | number
  percent: number
  niceName?: string
  icon?: string
  list?: string[]
}

export interface ActiveUserResponse extends DateResponse {
  views: string
  uniqueVisitors: string
  micro: string[]
  macro: string[]
  value: number
}

export interface DisplayColumn {
  name?: string
  sub?: string
  value: string | string[]
  subValue?: string | string[]
  format?: ValueFormat
  select?: string
}
export interface ComparedDataItem<T = unknown> {
  main: T[]
  compare?: T[]
  mainTotals?: T
  compareTotals?: T
  columns?: DisplayColumn[]
  meta?: {
    total?: number
    start: number
    end: number
    pages: number
  }
  title?: string
  description?: string
}

export type ResponseData<T = unknown> = ComparedDataItem<T> | undefined

export type DataMapWidgets = DataMapType<keyof WidgetDataMap>
// Let's give a name to this type
export type DataMapType<T = string> = {
  key?: T
  table?: QueryTable
  groupBy?: string
  queryFormat?: QueryFormat
  query?: (q: RequestFullAnalyticsRefined) => Promise<ComparedDataItem<unknown>>
  countOn?: string
  selector?: readonly string[]
  where?: Record<string, string>
  realtime?: boolean
  requires?: readonly string[]
  load?: 'auto' | 'custom'
  aggregationFormat?: AggregationFormat
  valueFormat?: ValueFormat
  changeFormat?: 'inverse'
  options?: Record<string, any>
  validateParams?: (params: Record<string, any>) => boolean
  custom?: boolean
  pro?: boolean
  icon?: string
} & RequestFilters

type AdditionalColumnKeys = 'users' | 'count'
