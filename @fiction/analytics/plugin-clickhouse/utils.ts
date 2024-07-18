import type { ColDefaultValue, FictionDbColSettings, FictionDbTableSettings } from '@fiction/core'
import { FictionDbCol, FictionDbTable, dayjs } from '@fiction/core'
import type { TimeLineInterval } from '../types.js'
import type { FictionEvent } from '../typesTracking.js'
import type { BaseChartData, ClickHouseDatatype, FictionClickHouse } from './index.js'

type ValueCallback = (params: {
  event: FictionEvent
  session: Record<string, string | number | boolean>
  key: string
}) => string | number | boolean | undefined

type SessionSelector = (args: { id: string, key: string }) => string

type FictionAnalyticsColSettings<U extends string = string, T extends ColDefaultValue = ColDefaultValue> = {
  key: U
  default: () => T
  clickHouseType?: ClickHouseDatatype
  sessionSelector?: SessionSelector
  indexOn?: boolean
  getValue?: ValueCallback
} & FictionDbColSettings<U, T>

export class FictionAnalyticsCol< U extends string = string, T extends ColDefaultValue = ColDefaultValue> extends FictionDbCol<U, T> {
  clickHouseType: ClickHouseDatatype
  indexOn: boolean
  getValue?: ValueCallback
  sessionSelector?: SessionSelector
  constructor(settings: FictionAnalyticsColSettings<U, T>) {
    super(settings)
    this.key = settings.key
    this.clickHouseType = settings.clickHouseType || 'String'
    this.indexOn = settings.indexOn || false
    this.getValue = settings.getValue
    this.sessionSelector = settings.sessionSelector
  }
}

type FictionAnalyticsTableSettings = FictionDbTableSettings & {
  columns: readonly FictionAnalyticsCol[]
}

// readonly is just for types
type Writeable<T> = { -readonly [P in keyof T]: T[P] }

export class FictionAnalyticsTable extends FictionDbTable {
  override columns: FictionAnalyticsCol[]
  constructor(settings: FictionAnalyticsTableSettings) {
    super(settings)
    this.columns = this.addDefaultColumns(settings.columns) as Writeable< FictionAnalyticsCol[] >
  }

  addDefaultColumns(
    columns: FictionDbCol[] | readonly FictionDbCol[],
  ): FictionDbCol[] {
    const tsCols = this.timestamps
      ? [
          new FictionDbCol({ key: 'createdAt', create: ({ schema, column, db }) => schema.timestamp(column.pgKey).notNullable().defaultTo(db.fn.now()), default: () => '' }),
          new FictionDbCol({ key: 'updatedAt', create: ({ schema, column, db }) => schema.timestamp(column.pgKey).notNullable().defaultTo(db.fn.now()), default: () => '' }),
        ]
      : []

    return [...columns, ...tsCols]
  }

  async createClickHouseTable(fictionClickHouse: FictionClickHouse) {
    const dbName = fictionClickHouse.dbName
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

    await fictionClickHouse.clickHouseQuery({ query })

    const addColumnQuery = `ALTER TABLE ${tableName} ${this.columns
      .map((col) => {
        return `ADD COLUMN IF NOT EXISTS ${col.key} ${col.clickHouseType}`
      })
      .join(', ')}`

    await fictionClickHouse.clickHouseQuery({ query: addColumnQuery })
  }
}

export function fillData<T extends BaseChartData>(args: {
  timeZone: string
  timeStartAt: dayjs.Dayjs
  timeEndAt: dayjs.Dayjs
  interval: TimeLineInterval
  withRollup?: boolean
  data: T[]
}): T[] {
  const { timeStartAt, timeEndAt, timeZone, interval, data = [], withRollup } = args

  const newData: { date: string, [key: string]: any }[]
    = withRollup && data[0] ? [data[0]] : [{} as T]

  // clickhouse returns different timezone handling for weeks/months/years vs days/hours
  // appropriate timezone is returned for < weeks but always utc otherwise
  let loopTime: dayjs.Dayjs
  let finishTime: dayjs.Dayjs
  if (interval === 'week' || interval === 'month') {
    loopTime = timeStartAt.utc().startOf(interval)
    finishTime = timeEndAt.utc().endOf(interval)
  }
  else {
    loopTime = timeStartAt.clone().tz(timeZone)
    finishTime = timeEndAt.clone().tz(timeZone)
  }

  const duration = Math.abs(finishTime.diff(loopTime, 'day'))

  const sample = data[0] ?? {}
  // create default object from sample set to zeros
  const defaultObjectIfMissing = Object.fromEntries(
    Object.entries(sample)
      .map(([k, v]) => {
        return ((typeof v === 'string' && /^-?\d+$/.test(v)) || typeof v === 'number') ? [k, 0] : undefined
      })
      .filter(Boolean) as [string, number][],
  )

  while (
    loopTime.isBefore(finishTime, interval)
    || loopTime.isSame(finishTime, interval)
  ) {
    const date = loopTime.toISOString()
    const displayDate = loopTime.tz(timeZone)

    const now = dayjs()
    const found = data.find(_ => _.date === date) || defaultObjectIfMissing

    const dateFormat
      = duration < 3 ? 'ha' : duration > 180 ? 'MMM D, YYYY' : 'MMM D'

    const d: BaseChartData = {
      ...found,
      date,
      label: displayDate.format(dateFormat),
      tense: displayDate.isSame(now, interval)
        ? 'present'
        : displayDate.isAfter(now, interval)
          ? 'future'
          : 'past',
    }

    newData.push(d)

    loopTime = loopTime.add(1, interval)
  }

  return newData as T[]
}
