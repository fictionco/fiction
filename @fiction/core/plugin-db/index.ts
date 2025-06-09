/// <reference path="./env.d.ts" />

import type { Knex } from 'knex'
import type { FictionEnv } from '../plugin-env/index.js'
import type { FictionServer } from '../plugin-server/index.js'
import type { FictionPluginSettings } from '../plugin.js'
import type { Col, FictionDbTable } from './objects.js'
import process from 'node:process'

import knex from 'knex'
import { EnvVar, vars } from '../plugin-env/index.js'
import { FictionPlugin } from '../plugin.js'
import { toCamel } from '../utils/casing.js'
import { HooksUtil } from '../utils/hook.js'
import { sortPriority } from '../utils/list.js'
import { safeDirname } from '../utils/utils.js'
import { isActualBrowser, isTest } from '../utils/vars.js'
import { CheckHandle } from './endpoint.js'
import { dbPrep } from './utils.js'

export * from './objects.js'

vars.register(() => [
  new EnvVar({ name: 'POSTGRES_URL', val: process.env.POSTGRES_URL }),
])

export type FictionDBTables = 'fiction_user' | 'fiction_post' | 'fiction_version'

export type FictionDbSettings = {
  postgresUrl?: string
  tables?: FictionDbTable[]
  fictionEnv?: FictionEnv
  fictionServer?: FictionServer // for DB utilities like username checking
} & FictionPluginSettings

export type DbHookEvents = {
  extend: () => Promise<void>
}

export class FictionDb extends FictionPlugin<FictionDbSettings> {
  db?: Knex
  connectionUrl?: URL
  defaultConnectionUrl = 'http://test:test@localhost:5432/test'
  tables = this.settings.tables || []
  isInitialized = false
  hooks = new HooksUtil<DbHookEvents>()
  queries = {
    CheckHandle: new CheckHandle({ ...this.settings, fictionDb: this }),
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

    const knexOptions: Knex.Config & {
      recursiveStringcase: (obj: any, name: string) => boolean
      appStringcase: (key: string) => string
      [key: string]: any
    } = {
      client: 'pg',
      version: '16.2',
      connection: this.connectionUrl.toString(),
      // https://github.com/knex/knex/issues/3523#issuecomment-722574083
      pool: { min: 0, max: 4 },
      appStringcase: key => toCamel(key, { allowPeriods: true }), // change all nested snake_case results to camelCase
      // change all nested snake_case results to camelCase
      recursiveStringcase: (_obj: any, _name: string): boolean => true,
    }

    /**
     * Add stringcase lib that transforms snake_case and camelCase
     * if conflicts or issues occur, thexn best to change to a custom version at that time
     * https://www.npmjs.com/package/knex-stringcase
     */

    const knexStringcase = await import('knex-stringcase')

    const opts: Knex.Config = knexStringcase.default(knexOptions) as Knex.Config

    this.db = knex(opts)

    await this.extend()
  }

  prep<T>(args: Omit<Parameters<typeof dbPrep<T>>[0], 'fictionDb'>): Partial<T> {
    return dbPrep<T>({ ...args, fictionDb: this })
  }

  addTables(tables: FictionDbTable[]) {
    this.tables.push(...tables)
  }

  getTable(tableKey: string): FictionDbTable | undefined {
    return this.tables.find(t => t.tableKey === tableKey)
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
        const tables = sortPriority(this.tables, { centerNumber: 100 })

        for (const table of tables) await table.create(db)
        for (const table of tables) await table.addForeignKeys(db)
      }

      await this.hooks.run('extend')

      this.log.info('extending db [done]')

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
