import type { Knex } from 'knex'
import type { Dayjs } from 'dayjs'
import type {
  FactorPluginSettings,
  FactorServer,
  FactorUser,
  HookType,
} from '@factor/api'
import {
  FactorPlugin,
  knex,
  runHooks,
} from '@factor/api'
import { EnvVar, vars } from '@factor/api/plugin-env'
import type { QueryParamsRefined, TimeLineInterval } from '../plugin-dashboards'
import { eventFields } from '../plugin-beacon'
import type { KaptionEndpointMap } from '../utils'
import type { KaptionDbTable } from '../utils/db'
import { getSessionQuerySelectors } from '../plugin-beacon/tables'
import type { ClickHouseQueryResult } from './types'
import {
  QueryGetClientSessions,
  QueryGetDimensionList,
  QueryGetTotalSessions,
} from './endpoints'

export * from './types'

vars.register(() => [new EnvVar({ name: 'CLICKHOUSE_URL' })])

type KaptionClickHouseSettings = {
  connectionUrl?: string
  apiServer: FactorServer
  hooks?: HookType<HookDictionary>[]
  factorUser?: FactorUser
  tables?: KaptionDbTable[]
} & FactorPluginSettings

export interface HookDictionary {
  onStart: { args: [{ kaptionClickHouse: KaptionClickHouse }] }
}

export interface BaseChartData {
  date: string
  label?: string
  tense?: 'past' | 'present' | 'future'
}

export class KaptionClickHouse extends FactorPlugin<KaptionClickHouseSettings> {
  dbName = 'kaption'

  tableEvents = `kaption.kaption_event`
  tableSessions = `kaption.kaption_session`
  private db!: Knex
  connectionUrl!: URL
  user!: string
  password!: string
  hooks = this.settings.hooks || []
  apiServer = this.settings.apiServer
  queries = this.createQueries()
  tables = this.settings.tables || []
  requests = this.createRequests<KaptionEndpointMap<typeof this.queries>>({
    queries: this.queries,
    factorServer: this.apiServer,
    factorUser: this.settings.factorUser,
    basePath: '/clickhouse',
  })

  constructor(settings: KaptionClickHouseSettings) {
    super('clickhouse', settings)

    if (settings.connectionUrl)
      this.connectionUrl = new URL(settings.connectionUrl)
  }

  async init() {
    if (this.utils.isActualBrowser())
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

    this.log.info('connected', {
      data: {
        url: this.connectionUrl.hostname,
        port: `[ ${this.connectionUrl.port} ]`,
      },
    })

    if (!this.utils.isTest())
      await this.extend()
  }

  addTables(tables: KaptionDbTable[]) {
    this.tables.push(...tables)
  }

  setup() {}

  get endpoints() {
    return Object.values(this.requests)
  }

  protected createQueries() {
    const deps = {
      kaptionClickHouse: this,
    }
    return {
      GetDimensionList: new QueryGetDimensionList(deps),
      GetClientSessions: new QueryGetClientSessions(deps),
      GetTotalSessions: new QueryGetTotalSessions(deps),
    } as const
  }

  client(): Knex {
    if (this.utils.isActualBrowser())
      throw new Error('cannot use client() in browser')

    return this.db
  }

  async extend(): Promise<void> {
    await this.clickHouseQuery({
      query: `CREATE DATABASE IF NOT EXISTS ${this.dbName}`,
    })

    if (this.tables.length > 0) {
      for (const table of this.tables)
        await table.createClickHouseTable(this)
    }

    await runHooks<HookDictionary>({
      list: this.hooks,
      hook: 'onStart',
      args: [{ kaptionClickHouse: this }],
    })
  }

  clickHouseQuery = async <T = unknown[]>({
    query,
  }: {
    query: string
  }): Promise<ClickHouseQueryResult<T> | undefined> => {
    if (!this.connectionUrl)
      throw new Error('connectionUrl is missing')

    const rawUrls: (string | undefined)[] = [this.connectionUrl.toString()]

    const urls: string[] = rawUrls
      .filter(Boolean)
      .map(
        _ =>
          `${_}?user=${this.user}&password=${
            this.password
          }&query=${encodeURIComponent(query)}`,
      ) as string[]

    const _promises = urls.map(
      async (url: string): Promise<ClickHouseQueryResult<T> | undefined> => {
        try {
          const fetched = await fetch(url, {
            method: 'post',
            headers: { 'access-control-allow-origin': '*' },
          })

          const textData = await fetched.text()

          const data = this.utils.isJson<ClickHouseQueryResult<T>>(textData)

          if (data === false)
            throw new Error(`clickhouse text response: ${textData}`)

          return data
        }
        catch (error: unknown) {
          const { format } = await import('sql-formatter')

          const e = error as Error
          this.log.error(e?.message ?? 'no message', {
            data: { url, query: format(query) },
            error,
          })
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

  clickhouseBaseQuery(args: {
    projectId: string
    table?: string
  }): Knex.QueryBuilder {
    const { projectId, table = this.tableEvents } = args

    const client = this.client()

    const q = client.from(table).where({ projectId })

    return q
  }

  formatTime(dateTime: Dayjs) {
    return dateTime.utc().format('YYYYMMDDHHmmss')
  }

  clickhouseDateQuery(args: {
    params: QueryParamsRefined & {
      table?: string
    }
  }): Knex.QueryBuilder {
    const { timeStartAt, timeEndAt, projectId, table, filters } = args.params

    const clickhouseTimeEndAt = this.formatTime(timeEndAt)
    const clickhouseTimeStartAt = this.formatTime(timeStartAt)

    const base = this.clickhouseBaseQuery({ projectId, table }).whereRaw(
      `toYYYYMMDDhhmmss(timestamp) BETWEEN ${clickhouseTimeStartAt} AND ${clickhouseTimeEndAt}`,
    )

    if (filters) {
      filters
        .filter((f) => {
          const available = eventFields.map(f => f.key)
          return !!available.includes(f.name)
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
      base
        .select(this.client().raw(selectItems.join(', ')))
        .groupBy('sessionId'),
    )
  }

  clickhouseBaseQuerySession(args: {
    projectId: string
    selectors?: string[]
    base?: Knex.QueryBuilder
  }): Knex.QueryBuilder {
    const {
      projectId,
      selectors = [],
      base = this.clickhouseBaseQuery({ projectId }),
    } = args
    return this.sessionTable({
      base,
      selectors,
    })
  }

  clickhouseDateQuerySession(args: {
    params: QueryParamsRefined
    selectors?: string[]
    base?: Knex.QueryBuilder
  }): Knex.QueryBuilder {
    const {
      params,
      selectors = [],
      base = this.clickhouseDateQuery({ params }),
    } = args
    return this.sessionTable({
      base,
      selectors,
    })
  }

  // fillData<T extends BaseChartData>(args: {
  //   timeZone: string
  //   timeStartAt: dayjs.Dayjs
  //   timeEndAt: dayjs.Dayjs
  //   interval: TimeLineInterval
  //   withRollup?: boolean
  //   data: T[]
  // }): T[] {
  //   const {
  //     timeStartAt,
  //     timeEndAt,
  //     timeZone,
  //     interval,
  //     data = [],
  //     withRollup,
  //   } = args

  //   console.log(
  //     "interval",
  //     interval,
  //     timeStartAt.toISOString(),
  //     timeEndAt.toISOString(),
  //     data,
  //     timeZone,
  //     withRollup,
  //   )

  //   const newData: { date: string; [key: string]: any }[] =
  //     withRollup && data[0] ? [data[0]] : [{} as T]

  //   let loopTime = timeStartAt.clone()
  //   const finishTime = timeEndAt.clone()

  //   const duration = loopTime.diff(finishTime, "day")

  //   const sample = data[0] ?? {}
  //   const defs = Object.fromEntries(
  //     Object.entries(sample)
  //       .map(([k, v]) => {
  //         if (
  //           (typeof v === "string" && /^-?\d+$/.test(v)) ||
  //           typeof v === "number"
  //         ) {
  //           return [k, 0]
  //         } else return
  //       })
  //       .filter(Boolean) as [string, number][],
  //   )

  //   while (
  //     loopTime.isBefore(finishTime, interval) ||
  //     loopTime.isSame(finishTime, interval)
  //   ) {
  //     const date = loopTime.toISOString()
  //     const displayDate = loopTime.tz(timeZone)
  //     const now = this.utils.dayjs()
  //     const found = data.find((_) => _.date === date) || defs

  //     const dateFormat =
  //       duration < 3 ? "ha" : duration > 180 ? "MMM D, YYYY" : "MMM D"

  //     const d: BaseChartData = {
  //       ...found,
  //       date,
  //       label: displayDate.format(dateFormat),
  //       tense: displayDate.isSame(now, interval)
  //         ? "present"
  //         : displayDate.isAfter(now, interval)
  //         ? "future"
  //         : "past",
  //     }

  //     newData.push(d)

  //     loopTime = loopTime.add(1, interval)
  //   }

  //   return newData as T[]
  // }

  /**
   * Clickhouse Format for Data Chunk Query
   * https://clickhouse.tech/docs/en/sql-reference/functions/date-time-functions/#formatdatetime
   */
  formatDateTimeSelect({
    interval,
    timeField = 'timestamp',
    timeZone,
  }: {
    interval: TimeLineInterval
    timeZone: string
    timeField?: 'timestamp' | 'session_timestamp'
  }): string {
    let startOf = `toStartOf${this.utils.capitalize(
      interval,
    )}(${timeField}, '${timeZone}')`

    // clickhouse doesn't seem to support timezone in week/month/year intervals
    // week requires mode = 1 to set monday to be the start of the week
    if (interval === 'week')
      startOf = `toMonday(${timeField}, '${timeZone}')`

    return `formatDateTime(${startOf}, '%FT%T.000Z', 'UTC')`
  }

  naiveDateTime = (time: number): string => {
    return this.utils.dayjs.unix(time).format('YYYY-MM-DD HH:mm:ss')
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
