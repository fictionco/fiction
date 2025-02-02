import type { ColDefaultValue, ColSettings, FictionDbTableSettings } from '@fiction/core'
import type { FictionEvent } from '../typesTracking.js'
import type { ClickHouseDatatype, FictionClickHouse } from './index.js'
import { Col, FictionDbTable } from '@fiction/core'
import { z } from 'zod'

type ValueCallback = (params: {
  event: FictionEvent
  session: Record<string, string | number | boolean | Record<string, string>>
  key: string
}) => string | number | boolean | undefined | Record<string, string>

type SessionSelector = (args: { id: string, key: string }) => string

type FictionAnalyticsColSettings<U extends string = string, T extends ColDefaultValue = ColDefaultValue> = {
  clickHouseType?: ClickHouseDatatype
  sessionSelector?: SessionSelector
  indexOn?: boolean
  getValue?: ValueCallback
  description?: string
} & Omit<ColSettings<U, T>, 'make'>

export class FictionAnalyticsCol<U extends string = string, T extends ColDefaultValue = ColDefaultValue> extends Col<U, T> {
  clickHouseType: ClickHouseDatatype
  indexOn: boolean
  getValue?: ValueCallback
  sessionSelector?: SessionSelector
  constructor(settings: FictionAnalyticsColSettings<U, T>) {
    super({ ...settings, make: ({ s, col }) => s.string(col.k) })
    this.key = settings.key
    this.clickHouseType = settings.clickHouseType || 'String'
    this.indexOn = settings.indexOn || false
    this.getValue = settings.getValue
    this.sessionSelector = settings.sessionSelector
  }
}

type FictionAnalyticsTableSettings = FictionDbTableSettings & {
  cols: readonly FictionAnalyticsCol<string, any>[]
}

// readonly is just for types
type Writeable<T> = { -readonly [P in keyof T]: T[P] }

export class FictionAnalyticsTable extends FictionDbTable {
  override cols: FictionAnalyticsCol[]
  constructor(settings: FictionAnalyticsTableSettings) {
    super(settings)
    this.cols = this.addDefaultColumns(settings.cols || []) as Writeable< FictionAnalyticsCol[] >
  }

  addDefaultColumns(
    cols: Col[] | readonly Col[],
  ): Col[] {
    const tsCols = this.timestamps
      ? [
          new Col({ key: 'createdAt', sec: 'setting', make: ({ s, col, db }) => s.timestamp(col.k).notNullable().defaultTo(db.fn.now()), sch: () => z.string() }),
          new Col({ key: 'updatedAt', sec: 'setting', make: ({ s, col, db }) => s.timestamp(col.k).notNullable().defaultTo(db.fn.now()), sch: () => z.string() }),
        ]
      : []

    return [...cols, ...tsCols] as Col[]
  }

  async createClickHouseTable(fictionClickHouse: FictionClickHouse) {
    const dbName = fictionClickHouse.dbName
    const fieldsInQuery = this.cols
      .map(col => `${col.key} ${col.clickHouseType}`)
      .join(`,\n`)

    const tableName = `${dbName}.${this.tableKey}`

    // Optimize ORDER BY clause for common query patterns
    const primaryKey = ['orgId', 'timestamp', 'event'].join(', ')

    const query = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
      ${fieldsInQuery}
      ) ENGINE = MergeTree()
      PARTITION BY toYYYYMM(timestamp)
      ORDER BY (${primaryKey})
      SETTINGS index_granularity = 8192
    `

    await fictionClickHouse.clickHouseQuery({ query, caller: 'createClickHouseTable-Create' })

    const addColumnQuery = `ALTER TABLE ${tableName} ${this.cols
      .map((col) => {
        return `ADD COLUMN IF NOT EXISTS ${col.key} ${col.clickHouseType}`
      })
      .join(', ')}`

    await fictionClickHouse.clickHouseQuery({ query: addColumnQuery, caller: 'createClickHouseTable-Alter' })
  }
}
