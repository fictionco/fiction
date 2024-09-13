/// <reference path="./env.d.ts" />

import type { Knex } from 'knex'
import type { FictionPluginSettings } from '../plugin.js'
import type { FictionEnv } from '../plugin-env/index.js'
import type { FictionServer } from '../plugin-server/index.js'
import type { Col, FictionDbTable } from './objects.js'
import process from 'node:process'
import * as typebox from '@sinclair/typebox'
import knex from 'knex'
import knexStringcase from 'knex-stringcase'
import { FictionPlugin } from '../plugin.js'
import { EnvVar, vars } from '../plugin-env/index.js'
import { toCamel } from '../utils/casing.js'
import { isActualBrowser, isTest, safeDirname } from '../utils/index.js'
import { CheckUsername } from './endpoint.js'
import { dbPrep } from './utils.js'

export * from './objects.js'

vars.register(() => [
  new EnvVar({ name: 'POSTGRES_URL', val: process.env.POSTGRES_URL }),
])

export type FictionDBTables = 'fiction_user' | 'fiction_post' | 'fiction_version'

// export type FictionDbHookDictionary = {
//   onStart: { args: [FictionDb] }
//   tables: { args: [FictionDbTable[]] }
// }

export type FictionDbSettings = {
  postgresUrl?: string
  tables?: FictionDbTable[]
  fictionEnv?: FictionEnv
  fictionServer?: FictionServer // for DB utilities like username checking
} & FictionPluginSettings

export class FictionDb extends FictionPlugin<FictionDbSettings> {
  db?: Knex
  connectionUrl?: URL
  defaultConnectionUrl = 'http://test:test@localhost:5432/test'
  tables = this.settings.tables || []
  isInitialized = false
  queries = {
    CheckUsername: new CheckUsername({ ...this.settings, fictionDb: this }),
  }

  requests = this.createRequests({
    queries: this.queries,
    basePath: '/utils/db',
    fictionServer: this.settings.fictionServer,
  })

  constructor(settings: FictionDbSettings) {
    super('FictionDb', { root: safeDirname(import.meta.url), ...settings })

    if (isActualBrowser())
      return

    if (settings.postgresUrl)
      this.connectionUrl = new URL(settings.postgresUrl)

    this.fictionEnv?.events.on('shutdown', async () => this.close())
  }

  async close() {
    if (this.db)
      await this.db.destroy()
  }

  async init() {
    if (this.settings.fictionEnv.isApp.value)
      return

    if (!this.connectionUrl)
      throw new Error('can\'t initialize db without url')

    if (this.isInitialized) {
      this.log.info('db initialized already')
      return
    }

    this.isInitialized = true

    const connection = {
      user: this.connectionUrl.username,
      host: this.connectionUrl.hostname,
      password: this.connectionUrl.password,
      port: Number.parseInt(this.connectionUrl.port),
      database: this.connectionUrl.pathname.replace(/\//g, ''),
    }

    const knexOptions: Knex.Config & {
      recursiveStringcase: (obj: any, name: string) => boolean
      appStringcase: (key: string) => string
    } = {
      client: 'pg',
      version: '16.2',
      connection,
      // https://github.com/knex/knex/issues/3523#issuecomment-722574083
      pool: { min: 0, max: 4 },
      appStringcase: key => toCamel(key, { allowPeriods: true }), // change all nested snake_case results to camelCase
      // change all nested snake_case results to camelCase
      recursiveStringcase: (_obj: any, _name: string): boolean => {
        return true
        // if (name.includes("project_events")) {
        //   return false
        // } else return true
      },
    }

    /**
     * Add stringcase lib that transforms snake_case and camelCase
     * if conflicts or issues occur, thexn best to change to a custom version at that time
     * https://www.npmjs.com/package/knex-stringcase
     */
    const opts: Knex.Config = knexStringcase(knexOptions) as Knex.Config

    this.db = knex(opts)

    await this.extend()
  }

  override setup() {
    this.addSchema()
  }

  prep<T>(args: Omit<Parameters<typeof dbPrep<T>>[0], 'fictionDb'>): Partial<T> {
    return dbPrep<T>({ ...args, fictionDb: this })
  }

  addSchema() {
    this.fictionEnv?.addHook({
      hook: 'staticSchema',
      caller: 'db',
      context: 'cli',
      callback: async (existing) => {
        const list: Record<string, typebox.TSchema> = {}
        this.tables.forEach((tbl) => {
          const colKeys = tbl.cols.map(c => typebox.Type.Literal(c.key))
          list[tbl.tableKey] = typebox.Type.Union(colKeys)
        })

        const tablesType = typebox.Type.Object(list)

        return { ...existing, tables: tablesType }
      },
    })
  }

  addTables(tables: FictionDbTable[]) {
    this.tables.push(...tables)
  }

  getTable(tableKey: string): FictionDbTable | undefined {
    return this.tables.find(t => t.tableKey === tableKey)
  }

  addColumns(
    tableKey: string,
    columns: Col[] | readonly Col[],
  ) {
    this.settings.fictionEnv.hooks.push({
      hook: 'dbOnTables',
      callback: (tables: FictionDbTable[]) => {
        const tbl = tables.find(t => t.tableKey === tableKey)

        if (tbl) {
          tbl.cols.push(...columns)
        }
        else {
          this.log.error(`could not find table ${tableKey}`, {
            data: tables.map(t => t.tableKey),
          })
        }

        return tables
      },
    })
  }

  getCols(tableKey: string): Col[] {
    const tbl = this.tables.find(t => t.tableKey === tableKey)

    if (!tbl) {
      this.log.error(`could not find table ${tableKey}`, {
        data: { tableKeys: this.tables.map(t => t.tableKey) },
      })
    }
    return tbl?.cols || []
  }

  getColumns(tableKey: string): Col[] | undefined {
    const tbl = this.tables.find(t => t.tableKey === tableKey)

    if (!tbl) {
      this.log.error(`could not find table ${tableKey}`, {
        data: { tableKeys: this.tables.map(t => t.tableKey) },
      })
    }
    return tbl?.cols
  }

  client(): Knex {
    if (isActualBrowser())
      throw new Error('Cannot use client() in browser')

    if (!this.db)
      throw new Error('db not initialized')

    return this.db
  }

  async extend(): Promise<void> {
    const env = this.settings.fictionEnv
    if (env.isApp.value || !this.connectionUrl || env.isRestart() || isTest())
      return

    try {
      this.log.info('extending db [start]', { connection: this.connectionUrl })

      const db = this.client()

      const { extendDb } = await import('./dbExtend.js')

      await extendDb(db)

      if (this.tables.length > 0) {
        const tables = await this.settings.fictionEnv.runHooks('dbOnTables', this.tables)

        for (const table of tables)
          await table.create(db)
      }

      this.log.info('extending db [done]')
      await this.settings.fictionEnv.runHooks('dbOnConnected', this)

      const printUrl = this.connectionUrl.toString().replace(this.connectionUrl.password, '--password--')
      this.log.info('connected db [ready]', {
        data: {
          postgresUrl: `[ ${printUrl} ]`,
        },
      })
    }
    catch (error) {
      this.log.error('DB INIT ERROR', { error })
    }
  }
}
