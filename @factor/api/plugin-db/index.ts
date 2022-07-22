/// <reference path="./shim.d.ts" />

import knex, { Knex } from "knex"
import knexStringcase from "knex-stringcase"
import { Type, TSchema } from "@sinclair/typebox"
import { runHooks, HookType } from "../utils"
import { FactorPlugin } from "../plugin"
import { vars, EnvVar, FactorEnv } from "../plugin-env"
import { FactorDbCol, FactorDbTable } from "./objects"
export * from "./objects"

vars.register(() => [
  new EnvVar({ name: "POSTGRES_URL", val: process.env.POSTGRES_URL }),
])

export type FactorDBTables = "factor_user" | "factor_post" | "factor_version"

export type FactorDbHookDictionary = {
  onStart: { args: [FactorDb] }
  tables: { args: [FactorDbTable[]] }
}

export type FactorDbSettings = {
  connectionUrl?: string
  hooks?: HookType<FactorDbHookDictionary>[]
  tables?: FactorDbTable[]
  factorEnv?: FactorEnv
}

export class FactorDb extends FactorPlugin<FactorDbSettings> {
  db?: Knex
  connectionUrl?: URL
  hooks: HookType<FactorDbHookDictionary>[]
  defaultConnectionUrl = "http://test:test@localhost:5432/test"
  tables = this.settings.tables || []
  factorEnv = this.settings.factorEnv
  constructor(settings: FactorDbSettings) {
    super(settings)

    this.hooks = settings.hooks || []

    if (this.utils.isActualBrowser()) return

    if (settings.connectionUrl) {
      this.connectionUrl = new URL(settings.connectionUrl)
    }
  }

  async init() {
    if (this.utils.isApp()) return

    if (!this.connectionUrl) {
      throw new Error("can't initialize db without url")
    }

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
      client: "pg",
      version: "11.8",
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const opts: Knex.Config = knexStringcase(knexOptions) as Knex.Config

    this.db = knex(opts)

    await this.extend()
  }

  setup() {
    this.addSchema()
  }

  addSchema() {
    this.factorEnv?.addHook({
      hook: "staticSchema",
      callback: async (existing) => {
        const list: Record<string, TSchema> = {}
        this.tables.forEach((tbl) => {
          const colKeys = tbl.columns.map((c) => Type.Literal(c.key))
          list[tbl.tableKey] = Type.Union(colKeys)
        })

        const tablesType = Type.Object(list)

        return {
          ...existing,
          tables: tablesType,
        }
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
      hook: "tables",
      callback: (tables: FactorDbTable[]) => {
        const tbl = tables.find((t) => t.tableKey === tableKey)

        if (tbl) {
          tbl.columns.push(...columns)
        } else {
          this.log.error(`could not find table ${tableKey}`, {
            data: tables.map((t) => t.tableKey),
          })
        }

        return tables
      },
    })
  }

  getColumns(tableKey: string): FactorDbCol[] | undefined {
    const tbl = this.tables.find((t) => t.tableKey === tableKey)

    if (!tbl) {
      this.log.error(`could not find table ${tableKey}`, {
        data: { tableKeys: this.tables.map((t) => t.tableKey) },
      })
    }
    return tbl?.columns
  }

  client(): Knex {
    if (this.utils.isActualBrowser()) {
      throw new Error("Cannot use client() in browser")
    }

    if (!this.db) {
      throw new Error("db not initialized")
    }

    return this.db
  }

  async extend(): Promise<void> {
    if (this.utils.isTest() || this.utils.isApp() || !this.connectionUrl) {
      return
    }

    try {
      this.log.info("extending db")

      const db = this.client()

      const { extendDb } = await import("./dbExtend")

      await extendDb(db)

      if (this.tables.length > 0) {
        const tables = await runHooks<FactorDbHookDictionary, "tables">({
          list: this.hooks,
          hook: "tables",
          args: [this.tables],
        })

        for (const table of tables) {
          await table.create(db)
        }
      }

      await runHooks<FactorDbHookDictionary>({
        list: this.hooks,
        hook: "onStart",
        args: [this],
      })

      this.log.info("db connected", {
        data: {
          url: this.connectionUrl.hostname,
          port: `[ ${this.connectionUrl.port} ]`,
        },
      })
    } catch (error) {
      this.log.error("db init error", { error })
    }
  }
}
