/// <reference path="./env.d.ts" />

import process from 'node:process'
import type { Knex } from 'knex'
import knex from 'knex'
import knexStringcase from 'knex-stringcase'
import * as typebox from '@sinclair/typebox'
import type { HookType } from '../utils'
import { runHooks, safeDirname } from '../utils'
import type { FactorPluginSettings } from '../plugin'
import { FactorPlugin } from '../plugin'
import type { FactorEnv } from '../plugin-env'
import { EnvVar, vars } from '../plugin-env'
import type { FactorServer } from '../plugin-server'
import { CheckUsername } from './endpoint'
import type { FactorDbCol, FactorDbTable } from './objects'

export * from './objects'

vars.register(() => [
  new EnvVar({ name: 'POSTGRES_URL', val: process.env.POSTGRES_URL }),
])

export type FactorDBTables = 'factor_user' | 'factor_post' | 'factor_version'

export type FactorDbHookDictionary = {
  onStart: { args: [FactorDb] }
  tables: { args: [FactorDbTable[]] }
}

export type FactorDbSettings = {
  connectionUrl?: string
  hooks?: HookType<FactorDbHookDictionary>[]
  tables?: FactorDbTable[]
  factorEnv?: FactorEnv
  factorServer?: FactorServer // for DB utilities like username checking
} & FactorPluginSettings

export class FactorDb extends FactorPlugin<FactorDbSettings> {
  db?: Knex
  connectionUrl?: URL
  hooks: HookType<FactorDbHookDictionary>[]
  defaultConnectionUrl = 'http://test:test@localhost:5432/test'
  tables = this.settings.tables || []
  isInitialized = false
  queries = {
    CheckUsername: new CheckUsername({ ...this.settings, factorDb: this }),
  }

  requests = this.createRequests({
    queries: this.queries,
    basePath: '/utils/db',
    factorServer: this.settings.factorServer,
  })

  constructor(settings: FactorDbSettings) {
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
    if (this.settings.factorEnv.isApp.value)
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
    } = {
      client: 'pg',
      version: '11.8',
      connection,
      // https://github.com/knex/knex/issues/3523#issuecomment-722574083
      pool: { min: 0, max: 4 },
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
     * if conflicts or issues occur, then best to change to a custom version at that time
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
    this.factorEnv?.addHook({
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

  addTables(tables: FactorDbTable[]) {
    this.tables.push(...tables)
  }

  addColumns(
    tableKey: string,
    columns: FactorDbCol[] | readonly FactorDbCol[],
  ) {
    this.hooks.push({
      hook: 'tables',
      callback: (tables: FactorDbTable[]) => {
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

  getColumns(tableKey: string): FactorDbCol[] | undefined {
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
    const env = this.settings.factorEnv
    if (env.isApp.value || !this.connectionUrl || env.isRestart() || this.utils.isTest())
      return

    try {
      this.log.info('extending db [start]', { connection: this.connectionUrl })

      const db = this.client()

      const { extendDb } = await import('./dbExtend')

      await extendDb(db)

      if (this.tables.length > 0) {
        const tables = await runHooks<FactorDbHookDictionary, 'tables'>({
          list: this.hooks,
          hook: 'tables',
          args: [this.tables],
        })

        for (const table of tables)
          await table.create(db)
      }

      this.log.info('extending db [done]')
      await runHooks<FactorDbHookDictionary>({
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
