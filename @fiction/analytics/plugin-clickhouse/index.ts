import type { Knex } from 'knex'
import type { Dayjs } from 'dayjs'
import type { FictionPluginSettings, FictionServer, FictionUser } from '@fiction/core'
import { FictionPlugin, capitalize, dayjs, isJson, isNode, knex } from '@fiction/core'
import { EnvVar, vars } from '@fiction/core/plugin-env'
import type { QueryParamsRefined, TimeLineInterval } from '../types.js'
import { eventFields } from '../plugin-beacon/index.js'
import { getSessionQuerySelectors, t } from '../tables.js'
import type { FictionAnalytics } from '../index.js'
import type { ClickHouseQueryResult } from './types.js'
import { QueryGetClientSessions, QueryGetDimensionList, QueryGetTotalSessions } from './endpoints.js'
import type { FictionAnalyticsTable } from './utils.js'

export * from './types.js'

vars.register(() => [new EnvVar({ name: 'CLICKHOUSE_URL' })])

type FictionClickHouseSettings = {
  clickhouseUrl: string
  fictionServer: FictionServer
  fictionUser?: FictionUser
  fictionAnalytics?: FictionAnalytics
  tables?: FictionAnalyticsTable[]
} & FictionPluginSettings

export interface BaseChartData {
  date: string
  label?: string
  tense?: 'past' | 'present' | 'future'
}

export class FictionClickHouse extends FictionPlugin<FictionClickHouseSettings> {
  dbName = 'analytics'
  tableEvents = `${this.dbName}.${t.event}`
  tableSessions = `${this.dbName}.${t.session}`
  private db!: Knex
  connectionUrl!: URL
  user!: string
  password!: string
  queries = {
    GetDimensionList: new QueryGetDimensionList({ fictionClickHouse: this, ...this.settings }),
    GetClientSessions: new QueryGetClientSessions({ fictionClickHouse: this, ...this.settings }),
    GetTotalSessions: new QueryGetTotalSessions({ fictionClickHouse: this, ...this.settings }),
  }

  tables = this.settings.tables || []
  requests = this.createRequests({
    queries: this.queries,
    fictionServer: this.settings.fictionServer,
    fictionUser: this.settings.fictionUser,
    basePath: '/clickhouse',
  })

  constructor(settings: FictionClickHouseSettings) {
    super('FictionClickHouse', settings)

    if (!settings.clickhouseUrl && !this.fictionEnv.isApp.value) {
      throw new Error('no clickhouse connection url')
    }
    else if (settings.clickhouseUrl) {
      this.connectionUrl = new URL(settings.clickhouseUrl)
    }
  }

  async close() {
    // close the connection
    await this.db?.destroy()
  }

  async init() {
    if (this.fictionEnv.isApp.value)
      return

    if (!this.connectionUrl)
      throw new Error('no clickhouse connection url')

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

    this.log.info('connected', { data: { url: this.connectionUrl.hostname, port: `[ ${this.connectionUrl.port} ]` } })

    if (!this.fictionEnv.isTest.value)
      await this.extend()
  }

  get endpoints() {
    return Object.values(this.requests)
  }

  client(): Knex {
    if (!isNode())
      throw new Error('cannot use client() in browser')

    return this.db
  }

  async extend(): Promise<void> {
    await this.clickHouseQuery({ query: `CREATE DATABASE IF NOT EXISTS ${this.dbName}` })

    if (this.tables.length > 0) {
      for (const table of this.tables)
        await table.createClickHouseTable(this)
    }
  }

  clickHouseQuery = async <T = unknown[]>({ query }: { query: string }): Promise<ClickHouseQueryResult<T> | undefined> => {
    if (!this.connectionUrl)
      throw new Error('connectionUrl is missing')

    const rawUrls: (string | undefined)[] = [this.connectionUrl.toString()]

    const urls: string[] = rawUrls
      .filter(Boolean)
      .map(_ => `${_}?user=${this.user}&password=${this.password}&query=${encodeURIComponent(query)}`)

    const _promises = urls.map(
      async (url: string): Promise<ClickHouseQueryResult<T> | undefined> => {
        try {
          const fetched = await fetch(url, {
            method: 'post',
            headers: { 'access-control-allow-origin': '*' },
          })

          const textData = await fetched.text()

          const data = isJson<ClickHouseQueryResult<T>>(textData)

          if (data === false)
            throw new Error(`clickhouse text response: ${textData}`)

          return data
        }
        catch (error: unknown) {
          const e = error as Error

          this.log.error(`clickhouse query error (${e?.message ?? 'no message'})`, { data: { url, query }, error })

          const { format } = await import('sql-formatter')

          this.log.error(`clickhouse error query formatted (${e?.message ?? 'no message'})`, { data: { url, query: format(query) }, error })
        }
      },
    )

    const result = await Promise.all(_promises)

    const primary = result[0]

    if (!primary)
      return

    return primary
  }

  cleanPrefixes<E extends Record<string, unknown>>(data: E[]): E[] {
    const r = data.map((d) => {
      const entries = Object.entries(d).map(([key, value]) => {
        return [key.split('_').pop(), value]
      })

      return Object.fromEntries(entries) as E
    })

    return r
  }

  async clickHouseSelect<T extends any[]>(
    q: Knex.QueryBuilder,
  ): Promise<ClickHouseQueryResult<T | []>> {
    const query = `${q.toQuery()} FORMAT JSON`

    const result = await this.clickHouseQuery<T>({ query })

    const emptyResult: ClickHouseQueryResult<[]> = {
      data: [],
      rows: 0,
      rows_before_limit_at_least: 0,
      meta: [],
    }

    if (result?.data)
      result.data = this.cleanPrefixes(result.data) as T

    return result || emptyResult
  }

  clickhouseBaseQuery(args: { orgId: string, table?: string }): Knex.QueryBuilder {
    const { orgId, table = this.tableEvents } = args

    const client = this.client()

    const q = client.from(table).where({ orgId })

    return q
  }

  formatTime(dateTime: Dayjs) {
    return dateTime.utc().format('YYYYMMDDHHmmss')
  }

  clickhouseDateQuery(args: {
    params: QueryParamsRefined & { table?: string }
  }): Knex.QueryBuilder {
    const { timeStartAtIso, timeEndAtIso, orgId, table, filters } = args.params

    if (!orgId)
      throw new Error('orgId is missing')

    const clickhouseTimeEndAt = this.formatTime(dayjs(timeEndAtIso))
    const clickhouseTimeStartAt = this.formatTime(dayjs(timeStartAtIso))

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
    const { orgId, selectors = [], base = this.clickhouseBaseQuery({ orgId }) } = args
    return this.sessionTable({
      base,
      selectors,
    })
  }

  clickhouseDateQuerySession(args: { params: QueryParamsRefined, selectors?: string[], base?: Knex.QueryBuilder }): Knex.QueryBuilder {
    const { params, selectors = [], base = this.clickhouseDateQuery({ params }) } = args
    return this.sessionTable({ base, selectors })
  }

  /**
   * Clickhouse Format for Data Chunk Query
   * https://clickhouse.tech/docs/en/sql-reference/functions/date-time-functions/#formatdatetime
   */
  formatDateTimeSelect({ interval, timeField = 'timestamp', timeZone }: {
    interval: TimeLineInterval
    timeZone: string
    timeField?: 'timestamp' | 'session_timestamp'
  }): string {
    let startOf = `toStartOf${capitalize(interval)}(${timeField}, '${timeZone}')`

    // clickhouse doesn't seem to support timezone in week/month/year intervals
    // week requires mode = 1 to set monday to be the start of the week
    if (interval === 'week')
      startOf = `toMonday(${timeField}, '${timeZone}')`

    return `formatDateTime(${startOf}, '%FT%T.000Z', 'UTC')`
  }

  naiveDateTime = (time: number): string => {
    return dayjs.unix(time).format('YYYY-MM-DD HH:mm:ss')
  }

  async saveData(opts: { data: unknown[], table?: string }): Promise<unknown> {
    const { data, table = this.tableEvents } = opts
    const rowJson = data.map(item => JSON.stringify(item)).join(' ')

    const r = await this.clickHouseQuery({
      query: `INSERT INTO ${table} FORMAT JSONEachRow ${rowJson}`,
    })

    this.log.debug(`saved ${data.length} rows`)

    return r
  }
}
