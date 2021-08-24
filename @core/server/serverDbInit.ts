import { FactorTable } from "@factor/types"
import knex, { Knex } from "knex"
import knexStringcase from "knex-stringcase"
import { snakeCase, _stop } from "@factor/api"
import { nLog } from "@factor/server-utils"
export const getDbConnection = (): string | undefined => {
  const postgresUrl =
    process.env.POSTGRES_URL ?? process.env.FACTOR_DB_CONNECTION

  return postgresUrl
}
/**
 * the db client singleton
 */
let __db: Knex
/**
 * Return the DB client singleton
 */
export const getDb = async (): Promise<Knex> => {
  if (!__db) {
    const postgresUrl = getDbConnection()

    if (!postgresUrl) {
      throw _stop({ message: "DB not available" })
    }

    const conf = new URL(postgresUrl)

    // pre-selected db - // remove slashes from pathname
    const database =
      process.env.POSTGRES_DB ??
      conf.pathname.replace(/^\/|\/$/g, "") ??
      "factor"

    const password = process.env.POSTGRES_PASSWORD ?? conf.password ?? undefined

    const config = {
      user: conf.username,
      host: conf.hostname,

      database,
      password,
      port: Number.parseInt(conf.port),
    }

    const knexOptions: Knex.Config & {
      recursiveStringcase: (obj: any, name: string) => boolean
    } = {
      client: "pg",
      version: "11.8",
      connection: config,
      // https://github.com/knex/knex/issues/3523#issuecomment-722574083
      pool: {
        min: 0,
        max: 4,
      },
      // change all nested snake_case results to camelCase
      recursiveStringcase: (obj: any, name: string): boolean => {
        if (name.includes("site_events")) {
          return false
        } else return true
      },
    }

    /**
     * Add stringcase lib that transforms snake_case and camelCase
     * if conflicts or issues occur, then best to change to a custom version at that time
     * https://www.npmjs.com/package/knex-stringcase
     */
    const opts = knexStringcase(knexOptions)

    __db = knex(opts)
  }
  return __db
}
type ColumnGroup = {
  columns: string[]
  cb: (t: Knex.AlterTableBuilder, col: string, hasColumn: boolean) => void
}
/**
 * Run a changeset to existing table
 * Checks to see if column exists first
 */
export const runChangeset = async (
  changes: {
    table: string
    columnGroups: ColumnGroup[]
  }[],
): Promise<void> => {
  const db = await getDb()
  // change table loop
  const _tableChangePromises = changes.map(async ({ table, columnGroups }) => {
    // group of columns change loop
    const _groupChangePromises = columnGroups.map(
      async (group: ColumnGroup): Promise<void> => {
        // individual column change
        const _colChangePromises = group.columns.map(async (col) => {
          const hasColumn = await db.schema.hasColumn(table, snakeCase(col))

          await db.schema.table(table, (t) => group.cb(t, col, hasColumn))
        })
        await Promise.all(_colChangePromises)
      },
    )

    await Promise.all(_groupChangePromises)
  })

  await Promise.all(_tableChangePromises)

  return
}

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
/**
 * Create the standard Factor tables
 */
const createTables = async (): Promise<void> => {
  const db = await getDb()

  const existsUser = await db.schema.hasTable(FactorTable.User)

  if (!existsUser) {
    await db.schema.createTable(FactorTable.User, (t) => {
      t.string("user_id", 32)
        .primary()
        .defaultTo(db.raw(`generate_object_id(user_)`))

      t.string("email").notNullable().unique()
      t.string("username").unique()
      t.string("full_name")
      t.string("role").notNullable().defaultTo("subscriber")
      t.string("status").notNullable().defaultTo("active")

      t.string("site")
      t.string("github")
      t.string("twitter")
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
      t.string("invited_by").references(`${FactorTable.User}.user_id`)
      t.dateTime("last_seen").defaultTo(db.fn.now())
      t.timestamps(true, true)
    })
  }

  const existsPost = await db.schema.hasTable(FactorTable.Post)

  if (!existsPost) {
    await db.schema.createTable(FactorTable.Post, (t) => {
      t.string(`post_id`, 32)
        .primary()
        .defaultTo(db.raw(`generate_object_id('pt')`))
      t.string("user_id")
        .references(`${FactorTable.User}.user_id`)
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

  const changes = [
    {
      table: FactorTable.User,
      columnGroups: [
        {
          columns: ["twitter_followers", "github_followers"],
          cb: (
            t: Knex.AlterTableBuilder,
            col: string,
            hasColumn: boolean,
          ): void => {
            if (!hasColumn) {
              t.integer(col)
            }
          },
        },
      ],
    },
  ]

  await runChangeset(changes)
}

/**
 * Sets up a connected DB as soon as possible
 */
export const initializeDb = async (): Promise<void> => {
  const connection = getDbConnection()

  if (!connection) {
    nLog("warn", "No DB: connection URL is missing (POSTGRES_URL)")
    return
  }

  await getDb()
  await createTables()
}
