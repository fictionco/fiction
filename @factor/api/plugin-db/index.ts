/// <reference path="./shim.d.ts" />

import knex, { Knex } from "knex"
import knexStringcase from "knex-stringcase"
import { runHooks, HookType } from "@factor/api"
import { FactorPlugin } from "../plugin"
import { FactorDbTable } from "./objects"
import { versionTable } from "./tables"
export * from "./objects"

export type FactorDBTables = "factor_user" | "factor_post" | "factor_version"

export type FactorDbHookDictionary = {
  onStart: { args: [FactorDb] }
}

export type FactorDbSettings = {
  connectionUrl?: string
  hooks?: HookType<FactorDbHookDictionary>[]
  tables?: FactorDbTable<string>[]
}

export class FactorDb extends FactorPlugin<FactorDbSettings> {
  db!: Knex
  connectionUrl!: URL
  hooks: HookType<FactorDbHookDictionary>[]
  defaultConnectionUrl = "http://test:test@localhost:5432/test"
  tables = this.settings.tables || []
  constructor(settings: FactorDbSettings) {
    super(settings)

    this.hooks = settings.hooks || []

    if (this.utils.isActualBrowser()) return

    if (!settings.connectionUrl) {
      this.log.warn(
        `No connectionUrl provided for db.
        Using default: ${this.defaultConnectionUrl}`,
      )
    }

    this.connectionUrl = new URL(
      settings.connectionUrl || this.defaultConnectionUrl,
    )

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

    // add table schemas
    this.addTable(versionTable)
  }

  addTable(table: FactorDbTable<string>) {
    this.tables.push(table)
  }

  client(): Knex {
    if (this.utils.isActualBrowser()) {
      throw new Error("Cannot use client() in browser")
    }
    return this.db
  }

  async init(): Promise<void> {
    this.log.info("initializing db")

    const imports = [
      import("./dbExtend"),
      import("./createTables"),
      import("./changeset"),
    ] as const

    const [{ extendDb }, { createTables }, { runChangeset }] =
      await Promise.all(imports)

    await extendDb(this.db)

    await createTables(this)

    await runChangeset(this.db)

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
  }

  public async setup() {
    if (!this.utils.isTest() && !this.utils.isApp()) {
      await this.init()
    }
  }
}
