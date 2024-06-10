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

// export type ValueFormat =
//   | 'number'
//   | 'percent'
//   | 'rawPercent'
//   | 'dollar'
//   | 'duration'
//   | 'microDuration'

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

export interface DataColumn {
  name?: string
  sub?: string
  value: string | string[]
  subValue?: string | string[]
  format?: NumberFormats
  select?: string
}

export type DataCompared<T = unknown> = {
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

export type QueryParamsRefined = QueryParams & {
  timeZone: string
  orgId: string
  timeEndAt: dayjs.Dayjs
  timeStartAt: dayjs.Dayjs
  compareEndAt: dayjs.Dayjs
  compareStartAt: dayjs.Dayjs
  interval: TimeLineInterval
}

export interface WidgetRequestBase {
  orgId?: string
  mode?: 'initial' | 'realtime'
  queryHandlerKey?: string
}

export interface RequestDataFilter<T = string> {
  name: T
  value: string | number
  operator: '=' | '!='
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
