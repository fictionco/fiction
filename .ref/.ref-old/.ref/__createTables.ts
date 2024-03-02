import { log } from "../@factor/api/plugin-log"
import type { FactorDb } from "../@factor/api/plugin-db"
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
export const createTables = async (factorDb: FactorDb): Promise<void> => {
  const db = factorDb.db

  if (factorDb.tables.length > 0) {
    for (const table of factorDb.tables) {
      await table.create(db)
    }
  }

  // Old tables, update to new format at some point
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
      t.dateTime("last_seen_at").defaultTo(db.fn.now())
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
