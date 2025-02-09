import type { Dayjs } from 'dayjs'
import type { Knex } from 'knex'
import type { FictionAnalytics, FictionAnalyticsSettings } from '../index.js'
import type { QueryParamsRefined, TimeLineInterval } from '../types.js'
import type { ClickHouseQueryResult } from './types.js'
import { capitalize, dayjs, fetchWithTimeout, FictionPlugin, isJson, isNode, knex, objectId } from '@fiction/core'
import { EnvVar, vars } from '@fiction/core/plugin-env'
import { eventFields } from '../plugin-beacon/index.js'
import { allTables } from '../tables'
import { getSessionQuerySelectors, t } from '../tables.js'
import { QueryPerformanceTracker } from './performance'

export * from './types.js'

vars.register(() => [new EnvVar({ name: 'CLICKHOUSE_URL' })])

export type FictionClickHouseSettings = {
  fictionAnalytics?: FictionAnalytics
} & FictionAnalyticsSettings

export interface BaseChartData {
  date: string
  label?: string
  tense?: 'past' | 'present' | 'future'
}

const emptyResult: ClickHouseQueryResult = {
  data: [],
  rows: 0,
  rows_before_limit_at_least: 0,
  meta: [],
}

export class FictionClickHouse extends FictionPlugin<FictionClickHouseSettings> {
  dbName = 'analytics'
  tableEvents = `${this.dbName}.${t.event}`
  tableSessions = `${this.dbName}.${t.session}`
  private db!: Knex
  connectionUrl!: URL
  user?: string
  password?: string
  initialized = false
  private performanceTracker: QueryPerformanceTracker
  constructor(settings: FictionClickHouseSettings) {
    super('FictionClickHouse', settings)

    if (!settings.clickhouseUrl && !this.fictionEnv.isApp.value) {
      throw new Error('no clickhouse connection url')
    }
    else if (settings.clickhouseUrl) {
      this.connectionUrl = new URL(settings.clickhouseUrl)

      this.user = this.connectionUrl.username
      this.password = this.connectionUrl.password
      // prevent the url from having auth in it (error in fetch)
      this.connectionUrl.username = ''
      this.connectionUrl.password = ''
      this.log.info(
        `clickhouse at ${this.connectionUrl.href} - ${this.user}:password(${this.password.length})`,
      )

      /**
       * Create utility, knex doesn't support running
       * clickhouse queries directly, but this is helpful
       * in chaining and applying best practices
       */
      this.db = knex({ client: 'pg' })
    }

    this.performanceTracker = new QueryPerformanceTracker(this.log, {
      warnThresholdMs: 1000, // Warn on queries over 1 second
      errorThresholdMs: 5000, // Error on queries over 5 seconds
      sampleRate: 1.0, // Monitor all queries in production
    })
  }

  async close() {
    // close the connection
    await this.db?.destroy()
  }

  async init() {
    if (this.fictionEnv.isApp.value)
      return

    try {
      if (!this.connectionUrl)
        throw new Error('no clickhouse connection url')

      const check = await fetch(this.connectionUrl.href, { method: 'GET' })
      const checkText = await check.text()

      if (checkText.trim() !== 'Ok.')
        throw new Error('clickhouse not alive')

      this.log.info('CLICKHOUSE INITIALIZED', { data: { url: this.connectionUrl.hostname, port: `[ ${this.connectionUrl.port} ]` } })
      this.initialized = true

      if (!this.fictionEnv.isTest.value)
        await this.extend()
    }
    catch (error) {
      this.log.error('clickhouse init error', {
        error,
        data: { connectionUrl: this.connectionUrl.toString() },
      })
    }
  }

  client(): Knex {
    if (!isNode())
      throw new Error('cannot use client() in browser')

    return this.db
  }

  getFullTableName(table: keyof typeof t): string {
    return `${this.dbName}.${t[table]}`
  }

  async extend(): Promise<void> {
    await this.clickHouseQuery({ query: `CREATE DATABASE IF NOT EXISTS ${this.dbName}`, caller: 'extend' })

    if (allTables.length > 0) {
      for (const table of allTables)
        await table.createClickHouseTable(this)
    }
  }

  clickHouseQuery = async <T = unknown>(args: { query: string, caller: string }): Promise<ClickHouseQueryResult<T>> => {
    const { query, caller = 'unknown' } = args

    const queryId = objectId({ prefix: 'qry' })

    // Start tracking query performance
    this.performanceTracker.startQuery(queryId, query, caller)

    try {
      if (!this.connectionUrl)
        throw new Error('connectionUrl is missing')

      if (!this.initialized) {
        this.log.error(`clickhouse not initialized (caller: ${caller})`, { data: { query } })
        throw new Error('clickhouse not initialized')
      }

      const rawUrls: (string | undefined)[] = [this.connectionUrl.toString()]

      const urls: string[] = rawUrls
        .filter(Boolean)
        .map(_ => `${_}?user=${this.user}&password=${this.password}&query=${encodeURIComponent(query)}`)

      const _promises = urls.map(
        async (url: string): Promise<ClickHouseQueryResult<T> | undefined> => {
          try {
            const fetched = await fetchWithTimeout(url, {
              method: 'post',
              headers: { 'access-control-allow-origin': '*' },
              timeout: 10000,
            })

            const textData = await fetched.text()

            const data = isJson<ClickHouseQueryResult<T>>(textData)

            if (data === false)
              throw new Error(`clickhouse text response: ${textData}`)

            return data
          }
          catch (error: unknown) {
            const e = error as Error

            this.log.error(`${caller}: clickhouse query error (${e?.message ?? 'no message'})`, { data: { url, query }, error })

            // const { format } = await import('sql-formatter')

            // this.log.error(`clickhouse error query formatted (${e?.message ?? 'no message'})`, {
            //   data: { url, query: format(query) },
            //   error,
            // })
          }
        },
      )

      const result = await Promise.all(_promises)

      const primary = result[0]

      // End performance tracking
      this.performanceTracker.endQuery(queryId)

      if (!primary) {
        return emptyResult as ClickHouseQueryResult<T>
      }

      return primary
    }
    catch (error) {
      // Ensure we still track performance even if query fails
      this.performanceTracker.endQuery(queryId)
      throw error
    }
  }

  cleanPrefixes<E extends Record<string, unknown>>(data: E[]): E[] {
    const r = data.map((d) => {
      const entries = Object.entries(d).map(([key, value]) => {
        return [key.split('__').pop(), value]
      })

      return Object.fromEntries(entries) as E
    })

    return r
  }

  async clickHouseSelect<T extends Record<string, unknown>>(
    q: Knex.QueryBuilder,
    args: { caller: string },
  ): Promise<ClickHouseQueryResult<T>> {
    const { caller = 'clickHouseSelect' } = args
    const query = `${q.toQuery()} FORMAT JSON`

    const result = await this.clickHouseQuery<T>({ query, caller })

    return result || emptyResult
  }

  clickhouseBaseQuery(args: { orgId: string, table: keyof typeof t }): Knex.QueryBuilder {
    const { orgId, table } = args

    if (!orgId)
      throw new Error('orgId is missing')

    const client = this.client()

    const tbl = this.getFullTableName(table)

    const q = client.from(tbl).where({ orgId })

    return q
  }

  formatTime(dateTime: Dayjs) {
    return dateTime.utc().format('YYYYMMDDHHmmss')
  }

  clickhouseDateQuery(args: {
    params: QueryParamsRefined
    table: keyof typeof t
    timeField?: 'timestamp' | 'session__timestamp'
    isCompare?: boolean
  }): Knex.QueryBuilder {
    const { table, isCompare = false } = args
    const { timeStartAtIso, timeEndAtIso, orgId, filters, compareStartAtIso, compareEndAtIso } = args.params

    if (!orgId)
      throw new Error('orgId is missing')

    const startIso = isCompare ? compareStartAtIso : timeStartAtIso
    const endIso = isCompare ? compareEndAtIso : timeEndAtIso

    const clickhouseTimeEndAt = this.formatTime(dayjs(endIso))
    const clickhouseTimeStartAt = this.formatTime(dayjs(startIso))

    const base = this.clickhouseBaseQuery({ orgId, table }).whereRaw(
      `toYYYYMMDDhhmmss(timestamp) BETWEEN ${clickhouseTimeStartAt} AND ${clickhouseTimeEndAt}`,
    )

    if (filters) {
      filters
        .filter((f) => {
          const available = eventFields.map(f => f.key)
          return !!available.includes(f.name as typeof available[number])
        })
        .forEach(({ name, value, operator }) => {
          if (value && (typeof value === 'string' || typeof value === 'number')) {
            if (operator === '!=')
              void base.whereNot(name, value)
            else
              void base.where(name, value)
          }
        })
    }

    return base
  }

  sessionTable(args: {
    base: Knex.QueryBuilder
    selectors?: string[]
  }): Knex.QueryBuilder {
    const { base, selectors = [] } = args
    const selectItems = [...getSessionQuerySelectors(), ...selectors]
    return this.client().from(
      base.select(this.client().raw(selectItems.join(', '))).groupBy('sessionId'),
    )
  }

  clickhouseBaseQuerySession(args: { orgId: string, selectors?: string[], base?: Knex.QueryBuilder }): Knex.QueryBuilder {
    const { orgId, selectors = [], base = this.clickhouseBaseQuery({ orgId, table: 'event' }) } = args
    return this.sessionTable({ base, selectors })
  }

  clickhouseDateQuerySession(args: {
    params: QueryParamsRefined
    selectors?: string[]
    base?: Knex.QueryBuilder
    isCompare?: boolean
  }): Knex.QueryBuilder {
    const { params, isCompare, selectors = [] } = args
    const { base = this.clickhouseDateQuery({ params, table: 'event', isCompare }) } = args

    return this.sessionTable({ base, selectors })
  }

  /**
   * Clickhouse Format for Data Chunk Query
   * https://clickhouse.tech/docs/en/sql-reference/functions/date-time-functions/#formatdatetime
   */
  formatDateTimeSelect({ interval, timeField = 'timestamp', timeZone }: {
    interval: TimeLineInterval
    timeZone: string
    timeField?: 'timestamp' | 'session__timestamp'
  }): string {
    // Handle minute-based intervals
    const minutes = interval.match(/(\d+)min/)?.[1]
    if (minutes) {
      return `formatDateTime(toStartOfInterval(${timeField}, INTERVAL ${minutes} MINUTE, '${timeZone}'), '%FT%T.000Z', 'UTC')`
    }

    // Special case for week
    if (interval === 'week') {
      return `formatDateTime(toMonday(${timeField}, '${timeZone}'), '%FT%T.000Z', 'UTC')`
    }

    // Default case for other intervals
    return `formatDateTime(toStartOf${capitalize(interval)}(${timeField}, '${timeZone}'), '%FT%T.000Z', 'UTC')`
  }

  naiveDateTime = (time: number): string => {
    return dayjs.unix(time).format('YYYY-MM-DD HH:mm:ss')
  }

  async saveData<T extends Record<string, unknown>>(opts: {
    rows: T[]
    table: keyof typeof t
  }): Promise<ClickHouseQueryResult<T>> {
    const { rows, table } = opts
    const rowJson = rows.map(item => JSON.stringify(item)).join(' ')

    const tbl = this.getFullTableName(table)

    const r = await this.clickHouseQuery<T>({
      query: `INSERT INTO ${tbl} FORMAT JSONEachRow ${rowJson}`,
      caller: 'saveData',
    })

    return r
  }
}
