import { Knex } from "knex"
import { log } from "../logger"
import { snakeCase } from ".."
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

type CreateCol = (params: {
  col: Knex.CreateTableBuilder
  pgKey: string
  db: Knex
}) => void

type ColumnParams<T extends string, U> = {
  key: T
  type: U
  description?: string
  create: CreateCol
}
class Column<T extends string, U> {
  readonly key?: T
  readonly type?: U
  readonly description?: string
  create: CreateCol
  constructor(params: ColumnParams<T, U>) {
    const { description } = params || {}
    this.description = description
    this.create = params.create
  }
}
type FactorTableParams<T extends string> = {
  key: T
  columns: Column<string, any>[]
  db: Knex
}

class FactorTable<T extends string> {
  readonly key: T
  readonly pgKey: string
  columns: Column<string, any>[]
  db: Knex
  constructor(params: FactorTableParams<T>) {
    this.key = params.key
    this.pgKey = snakeCase(params.key)
    this.db = params.db
    this.columns = params.columns
    this.create().catch(console.error)
  }

  async create(): Promise<void> {
    const existsVersion = await this.db.schema.hasTable(this.pgKey)

    if (!existsVersion) {
      log.info("createTable", `creating [${this.pgKey}] table`)
      await this.db.schema.createTable(this.pgKey, (table) => {
        this.columns.forEach((column) => {
          column.create({ col: table, pgKey: this.pgKey, db: this.db })
        })
      })
    }
  }
}

const versionTableCols = [
  new Column({
    key: "versionId",
    type: "",
    create: ({ col, pgKey }) => col.increments(pgKey).primary(),
  }),
  new Column({
    key: "versionName",
    type: "",
    create: ({ col, pgKey }) => col.string(pgKey),
  }),
  new Column({
    key: "versionNumber",
    type: "",
    create: ({ col, pgKey }) => col.string(pgKey).unique(),
  }),
  new Column({
    key: "requires",
    type: [""],
    create: ({ col, pgKey }) => col.specificType(pgKey, "text ARRAY"),
  }),
  new Column({
    key: "createdAt",
    type: "",
    create: ({ col, pgKey }) => {
      col.timestamp(pgKey).notNullable().defaultTo("CURRENT_TIMESTAMP")
    },
  }),
  new Column({
    key: "updatedAt",
    type: "",
    create: ({ col, pgKey }) => {
      col.timestamp(pgKey).notNullable().defaultTo("CURRENT_TIMESTAMP")
    },
  }),
]

/**
 * Create the standard Factor tables
 */
export const createTables = async (db: Knex): Promise<void> => {
  new FactorTable({
    key: "factorVersion",
    columns: versionTableCols,
    db,
  })

  const existsUser = await db.schema.hasTable("factor_user")

  if (!existsUser) {
    log.info("createTable", "creating [factor_user] table")
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
      t.string("picture")
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
    log.info("createTable", "creating [factor_post] table")
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
