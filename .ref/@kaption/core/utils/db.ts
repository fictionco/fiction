import type {
  FactorDbColSettings,
  FactorDbTableSettings,
} from '@factor/api'
import {
  FactorDbCol,
  FactorDbTable,
} from '@factor/api'
import type { KaptionEvent } from '@kaption/client'

import type {
  ClickHouseDatatype,
  KaptionClickHouse,
} from '@kaption/core/plugin-clickhouse'

type ValueCallback = (params: {
  event: KaptionEvent
  session: Record<string, string | number | boolean>
  key: string
}) => string | number | boolean | undefined

type SessionSelector = (args: { id: string, key: string }) => string

type KaptionDbColSettings<U extends string = string, T = unknown> = {
  key: U
  default: () => T
  clickHouseType?: ClickHouseDatatype
  sessionSelector?: SessionSelector
  indexOn?: boolean
  getValue?: ValueCallback
} & FactorDbColSettings

export class KaptionDbCol<
  U extends string = string,
  T = unknown,
> extends FactorDbCol {
  clickHouseType: ClickHouseDatatype
  indexOn: boolean
  key: U
  default: () => T
  getValue?: ValueCallback
  sessionSelector?: SessionSelector
  constructor(settings: KaptionDbColSettings<U, T>) {
    super(settings)
    this.key = settings.key
    this.default = settings.default
    this.clickHouseType = settings.clickHouseType || 'String'
    this.indexOn = settings.indexOn || false
    this.getValue = settings.getValue
    this.sessionSelector = settings.sessionSelector
  }
}

type KaptionDbTableSettings = FactorDbTableSettings & {
  columns: readonly KaptionDbCol[]
}

// readonly is just for types
type Writeable<T> = { -readonly [P in keyof T]: T[P] }

export class KaptionDbTable extends FactorDbTable {
  columns: KaptionDbCol[]
  constructor(settings: KaptionDbTableSettings) {
    super(settings)
    this.columns = this.addDefaultColumns(settings.columns) as Writeable<
      KaptionDbCol[]
    >
  }

  async createClickHouseTable(kaptionClickHouse: KaptionClickHouse) {
    const dbName = kaptionClickHouse.dbName
    const fieldsInQuery = this.columns
      .map(col => `${col.key} ${col.clickHouseType}`)
      .join(`,\n`)

    const orderBy = this.columns
      .filter(c => c.indexOn)
      .map(c => c.key)
      .join(', ')

    const tableName = `${dbName}.${this.tableKey}`

    const query = `
      CREATE TABLE IF NOT EXISTS ${tableName}
      ( ${fieldsInQuery} ) ENGINE = MergeTree()
      PARTITION BY toYYYYMM(timestamp)
      ORDER BY (${orderBy})
    `

    await kaptionClickHouse.clickHouseQuery({ query })

    const addColumnQuery = `ALTER TABLE ${tableName} ${this.columns
      .map((col) => {
        return `ADD COLUMN IF NOT EXISTS ${col.key} ${col.clickHouseType}`
      })
      .join(', ')}`

    await kaptionClickHouse.clickHouseQuery({ query: addColumnQuery })
  }
}

type CreateTuple<T extends readonly KaptionDbCol[]> = {
  [P in keyof T]: T[P] extends KaptionDbCol<infer X, infer Q> ? [X, Q] : never
}[number]

type TupleToObject<T extends [string, unknown]> = {
  [P in T[0]]: T extends [P, infer B] ? B : never
}

export type CreateObjectType<T extends readonly KaptionDbCol[]> = TupleToObject<
  CreateTuple<T>
>
