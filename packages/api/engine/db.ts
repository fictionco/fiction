/// <reference path="./shim.d.ts" />
import knex, { Knex } from "knex"
import knexStringcase from "knex-stringcase"
import { snakeCase, _stop, logger, onEvent } from ".."

import { extendDb } from "./dbExtend"

export type FactorDBTables = "factor_user" | "factor_post"

const changes: ChangesetConfig = [
  {
    table: "factor_user",
    columnGroups: [
      {
        columns: [{ col: "last_project", type: "string" } as const],
        cb: (
          t: Knex.AlterTableBuilder,
          col: string,
          hasColumn: boolean,
          type?: ChangesetColumnTypes,
          specific?: string,
        ): void => {
          if (!hasColumn) {
            if (specific) {
              t.specificType(col, specific)
            } else if (type) {
              t[type](col)
            } else {
              // custom
            }
          }
        },
      },
    ],
  },
]

const statusTypes = [
  "pending",
  "active",
  "inactive",
  "suspended",
  "expired",
  "removed",
  "disabled",
  "draft",
]

export type ChangesetColumnTypes = "integer" | "string" | "jsonb"

export type ChangesetColumnGroup = {
  columns: { col: string; type?: ChangesetColumnTypes; specific?: string }[]
  cb: (
    t: Knex.AlterTableBuilder,
    col: string,
    hasColumn: boolean,
    type?: ChangesetColumnTypes,
    specific?: string,
  ) => void
}

export type ChangesetConfig = {
  table: string | FactorDBTables
  columnGroups: ChangesetColumnGroup[]
}[]
/**
 * Run a changeset to existing table
 * Checks to see if column exists first
 */
export const runChangeset = async (
  db: Knex,
  changes: ChangesetConfig,
): Promise<void> => {
  // change table loop
  const _tableChangePromises = changes.map(async ({ table, columnGroups }) => {
    // group of columns change loop
    const _groupChangePromises = columnGroups.map(
      async (group: ChangesetColumnGroup): Promise<void> => {
        // individual column change
        const _colChangePromises = group.columns.map(
          async ({ col, type, specific }) => {
            const hasColumn = await db.schema.hasColumn(table, snakeCase(col))

            await db.schema.table(table, (t) =>
              group.cb(t, col, hasColumn, type, specific),
            )
          },
        )
        await Promise.all(_colChangePromises)
      },
    )

    await Promise.all(_groupChangePromises)
  })

  await Promise.all(_tableChangePromises)

  return
}

/**
 * Create the standard Factor tables
 */
const createTables = async (db: Knex): Promise<void> => {
  const existsUser = await db.schema.hasTable("factor_user")

  if (!existsUser) {
    await db.schema.createTable("factor_user", (t) => {
      t.string("user_id", 32)
        .primary()
        .defaultTo(db.raw(`generate_object_id('us')`))

      t.string("email").notNullable().unique()
      t.string("username").unique()
      t.string("google_id").unique()

      t.string("full_name")
      t.string("first_name")
      t.string("last_name")
      t.string("role").notNullable().defaultTo("subscriber")
      t.string("status").notNullable().defaultTo("active")

      t.string("site")
      t.string("github")
      t.integer("github_followers")
      t.string("twitter")
      t.integer("twitter_followers")
      t.string("facebook")
      t.string("linkedin")
      t.string("work_seniority")
      t.string("work_role")
      t.string("bio")
      t.string("location")

      t.string("hashed_password")

      t.boolean("email_verified").notNullable().defaultTo(false)
      t.string("verification_code")
      t.dateTime("code_expires_at")

      t.string("avatar")
      t.string("about")
      t.enum("gender", ["male", "female", "other"])
      t.date("birthday")
      t.string("phone_number")
      t.string("address")
      t.jsonb("meta")
      t.jsonb("settings")
      t.jsonb("profile")
      t.string("invited_by").references(`${"factor_user"}.user_id`)
      t.dateTime("last_seen").defaultTo(db.fn.now())
      t.timestamps(true, true)
    })
  }

  const existsPost = await db.schema.hasTable("factor_post")

  if (!existsPost) {
    await db.schema.createTable("factor_post", (t) => {
      t.string(`post_id`, 32)
        .primary()
        .defaultTo(db.raw(`generate_object_id('pt')`))
      t.string("user_id")
        .references(`${"factor_user"}.user_id`)
        .onUpdate("CASCADE")
      t.dateTime("timestamp").defaultTo(db.fn.now())
      t.enum("post_status", statusTypes).notNullable().defaultTo("active")
      t.string("post_type").index()
      t.string("title")
      t.string("excerpt")
      t.string("content")
      t.jsonb("meta")
      t.jsonb("settings")
      t.specificType("tags", "text ARRAY")
      t.specificType("category", "text ARRAY")

      t.timestamps(true, true)
    })
  }
}

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
    if (!process.env.TEST_ENV) {
      await extendDb(__db)

      await createTables(__db)

      await runChangeset(__db, changes)
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

  logger.log({
    level: "info",
    context: "initializeDb",
    description: "db connected",
    data: { url: connection.hostname, port: connection.port },
  })
}
