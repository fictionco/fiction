import type { EndpointResponse, NumberFormats } from '@fiction/core'
import type { TrackEventTypes } from '.'

export type MetricSelector = {
  key: string
  events?: (keyof TrackEventTypes | `test_${string}`)[]
  selector?: string
  type: 'event' | 'session' | 'snapshot'
}

export type MetricDisplayItem = MetricSelector & {
  title: string
  icon: string
  format?: NumberFormats
  displayFormat: 'primary' | 'secondary' | 'detailed'
  changeLabel?: string
  suffix?: string
}

export type MetricDisplayItemWithData = MetricDisplayItem & {
  value: number
  change: number
  data: DataCompared<DataPointChart<'value'>>
}

export type MetricSelectorResult = MetricSelector & { data: DataCompared<DataPointChart<'value'>> }
export type MetricSelectorResultResponse = EndpointResponse<MetricSelectorResult[]>

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

export type TimeLineInterval = 'minute' | '15min' | '30min' | 'hour' | 'day' | 'week' | 'month' | 'year'

export type AggregationFormat =
  | 'enriched'
  | 'country'
  | 'city'
  | 'url'
  | 'standard'
  | 'size'
  | 'percent'
  | 'ip'

export type AggregationRow = {
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

export type DataPoint<T extends string = string> = {
  [K in (T | 'users' | 'count')]?: string | number | undefined
}

export type DataPointChart<T extends string = string> = {
  date?: string
  label?: string
  tense?: 'past' | 'present' | 'future'
} & DataPoint<T>

export interface DataColumn {
  name?: string
  sub?: string
  value: string | string[]
  subValue?: string | string[]
  format?: NumberFormats
  select?: string
}

export type DataCompared<T = unknown> = {
  main?: T[]
  compare?: T[]
  mainTotals?: T
  compareTotals?: T
  columns?: DataColumn[]
  params?: QueryParamsRefined
  sql?: string
}

export interface AnalyticsDataRequestBase {
  orgId?: string
  mode?: 'initial' | 'realtime'
  queryHandlerKey?: string
}

export interface RequestDataFilter<T = string> {
  name: T
  value: string | number
  operator: '=' | '!='
}

export interface AnalyticsDataRequestFilters {
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
  event?: string | string[]
  handling?: 'increment' | 'snapshot' | 'count'
}

export type QueryParams = AnalyticsDataRequestBase & Partial<AnalyticsDataRequestFilters>

/**
 * These are params that are set after using refineParams(QueryParams)
 */
export type QueryParamsRefined = Omit<QueryParams, 'timeEndAtIso' | 'timeStartAtIso'> & {
  timeZone: string
  orgId?: string
  nowIso: string
  timeStartAtIso: string
  timeEndAtIso: string
  compareEndAtIso: string
  compareStartAtIso: string
  interval: TimeLineInterval
}
