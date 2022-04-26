/// <reference path="./shim.d.ts" />
import knex, { Knex } from "knex"
import knexStringcase from "knex-stringcase"
import { _stop, logger, onEvent } from ".."
import { runChangeset } from "./changeset"

import { createTables } from "./createTables"
import { extendDb } from "./dbExtend"

export const postgresConnectionUrl = (): URL | undefined => {
  const postgresUrl = process.env.POSTGRES_URL || process.env.FACTOR_DB_URL

  return postgresUrl ? new URL(postgresUrl) : undefined
}
/**
 * the db client singleton
 */
let __db: Knex | undefined
/**
 * Return the DB client singleton
 */
export const getDb = async (): Promise<Knex> => {
  if (!__db) {
    const conf = postgresConnectionUrl()

    if (!conf) {
      throw _stop(`DB URL is required (POSTGRES_URL)`)
    }

    // pre-selected db - // remove slashes from pathname
    process.env.POSTGRES_DB =
      process.env.POSTGRES_DB ?? conf.pathname.replace(/^\/|\/$/g, "") ?? "test"

    const password = process.env.POSTGRES_PASSWORD ?? conf.password ?? undefined

    const connection = {
      user: conf.username,
      host: conf.hostname,
      password,
      port: Number.parseInt(conf.port),
      database: process.env.POSTGRES_DB,
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
      recursiveStringcase: (obj: any, name: string): boolean => {
        if (name.includes("project_events")) {
          return false
        } else return true
      },
    }

    /**
     * Add stringcase lib that transforms snake_case and camelCase
     * if conflicts or issues occur, then best to change to a custom version at that time
     * https://www.npmjs.com/package/knex-stringcase
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const opts: Knex.Config = knexStringcase(knexOptions) as Knex.Config

    __db = knex(opts)

    /**
     * Run on initial server start, not multiple tests, etc.
     */
    if (!process.env.TEST_ENV || process.env.FACTOR_INIT_ENV) {
      await extendDb(__db)

      await createTables(__db)

      await runChangeset(__db)
    }

    // Destroy connection if manually shutdown
    onEvent("shutdown", async () => {
      if (__db) {
        await __db.destroy()
        __db = undefined
      }
    })
  }
  return __db
}

/**
 * Sets up a connected DB as soon as possible
 */
export const initializeDb = async (): Promise<void> => {
  const connection = postgresConnectionUrl()

  if (!connection) return

  await getDb()

  logger.info("initializeDb", "db connected", {
    data: { url: connection.hostname, port: `[ ${connection.port} ]` },
  })
}
