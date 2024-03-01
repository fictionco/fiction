export interface ClickHouseQueryResult<T = unknown> {
  rows: number
  rows_before_limit_at_least?: number
  data: T
  meta?: { name: string, type: string }[]
  statistics?: { elapsed: number, rows_read: number, bytes_read: number }
}

export const clickHouseDatatype = [
  'UInt32',
  'Float32',
  'UInt16',
  'Int8',
  'UInt8',
  'Decimal(9,6)',
  'Decimal(8,6)',
  'String',
  'Date',
  'DateTime',
  'LowCardinality(String)',
  'LowCardinality(FixedString(2))',
  'FixedString(24)',
  'IPv4',
  'IPv6',
  'Array(String)',
] as const

export type ClickHouseDatatype = (typeof clickHouseDatatype)[number]

export type ClickHouseFieldNames<T> = {
  [P in keyof T]: ClickHouseDatatype
}
