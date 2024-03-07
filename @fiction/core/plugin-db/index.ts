/// <reference path="./env.d.ts" />

import process from 'node:process'
import type { Knex } from 'knex'
import knex from 'knex'
import knexStringcase from 'knex-stringcase'
import * as typebox from '@sinclair/typebox'
import type { HookType } from '../utils'
import { runHooks, safeDirname } from '../utils'
import type { FictionPluginSettings } from '../plugin'
import { FictionPlugin } from '../plugin'
import type { FictionEnv } from '../plugin-env'
import { EnvVar, vars } from '../plugin-env'
import type { FictionServer } from '../plugin-server'
import { toCamel } from '../utils/casing'
import { CheckUsername } from './endpoint'
import type { FictionDbCol, FictionDbTable } from './objects'

export * from './objects'

vars.register(() => [
  new EnvVar({ name: 'POSTGRES_URL', val: process.env.POSTGRES_URL }),
])

export type FictionDBTables = 'fiction_user' | 'fiction_post' | 'fiction_version'

export type FictionDbHookDictionary = {
  onStart: { args: [FictionDb] }
  tables: { args: [FictionDbTable[]] }
}

export type FictionDbSettings = {
  connectionUrl?: string
  hooks?: HookType<FictionDbHookDictionary>[]
  tables?: FictionDbTable[]
  fictionEnv?: FictionEnv
  fictionServer?: FictionServer // for DB utilities like username checking
} & FictionPluginSettings

export class FictionDb extends FictionPlugin<FictionDbSettings> {
  db?: Knex
  connectionUrl?: URL
  hooks: HookType<FictionDbHookDictionary>[]
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
    super('db', { root: safeDirname(import.meta.url), ...settings })

    this.hooks = settings.hooks || []

    if (this.utils.isActualBrowser())
      return

    if (settings.connectionUrl)
      this.connectionUrl = new URL(settings.connectionUrl)
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
      database: Number.parseInt(this.connectionUrl.pathname),
    }

    const knexOptions: Knex.Config & {
      recursiveStringcase: (obj: any, name: string) => boolean
      appStringcase: (key: string) => string
    } = {
      client: 'pg',
      version: '11.8',
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

  setup() {
    this.addSchema()
  }

  addSchema() {
    this.fictionEnv?.addHook({
      hook: 'staticSchema',
      callback: async (existing) => {
        const list: Record<string, typebox.TSchema> = {}
        this.tables.forEach((tbl) => {
          const colKeys = tbl.columns.map(c => typebox.Type.Literal(c.key))
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

  addColumns(
    tableKey: string,
    columns: FictionDbCol[] | readonly FictionDbCol[],
  ) {
    this.hooks.push({
      hook: 'tables',
      callback: (tables: FictionDbTable[]) => {
        const tbl = tables.find(t => t.tableKey === tableKey)

        if (tbl) {
          tbl.columns.push(...columns)
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

  getColumns(tableKey: string): FictionDbCol[] | undefined {
    const tbl = this.tables.find(t => t.tableKey === tableKey)

    if (!tbl) {
      this.log.error(`could not find table ${tableKey}`, {
        data: { tableKeys: this.tables.map(t => t.tableKey) },
      })
    }
    return tbl?.columns
  }

  client(): Knex {
    if (this.utils.isActualBrowser())
      throw new Error('Cannot use client() in browser')

    if (!this.db)
      throw new Error('db not initialized')

    return this.db
  }

  async extend(): Promise<void> {
    const env = this.settings.fictionEnv
    if (env.isApp.value || !this.connectionUrl || env.isRestart() || this.utils.isTest())
      return

    try {
      this.log.info('extending db [start]', { connection: this.connectionUrl })

      const db = this.client()

      const { extendDb } = await import('./dbExtend')

      await extendDb(db)

      if (this.tables.length > 0) {
        const tables = await runHooks<FictionDbHookDictionary, 'tables'>({
          list: this.hooks,
          hook: 'tables',
          args: [this.tables],
        })

        for (const table of tables)
          await table.create(db)
      }

      this.log.info('extending db [done]')
      await runHooks<FictionDbHookDictionary>({
        list: this.hooks,
        hook: 'onStart',
        args: [this],
      })

      const printUrl = this.connectionUrl.toString().replace(this.connectionUrl.password, '--password--')
      this.log.info('connected db [ready]', {
        data: {
          connectionUrl: `[ ${printUrl} ]`,
        },
      })
    }
    catch (error) {
      this.log.error('DB INIT ERROR', { error })
    }
  }
}
