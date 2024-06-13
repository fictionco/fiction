import type { NumberFormats, dayjs } from '@fiction/core'

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

export type AggregationFormat =
  | 'enriched'
  | 'country'
  | 'city'
  | 'url'
  | 'standard'
  | 'size'
  | 'percent'
  | 'ip'

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

export type DataPoint<T extends string = string> = {
  [K in (T | 'users' | 'count')]?: string | number | undefined
}

export type DataPointChart<T extends string = string> = {
  date: string
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
}

export type QueryParams = AnalyticsDataRequestBase & Partial<AnalyticsDataRequestFilters>

export type QueryParamsRefined = QueryParams & {
  timeZone: string
  orgId?: string
  compareEndAtIso: string
  compareStartAtIso: string
  interval: TimeLineInterval
}
