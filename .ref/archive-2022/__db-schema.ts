import type { FactorDb } from '@factor/api/plugin-db'
import { AppTable } from '../@kaption/core/plugin-admin/types'

const statusTypes = [
  'pending',
  'active',
  'inactive',
  'suspended',
  'expired',
  'removed',
  'disabled',
  'draft',
]
/**
 * Create tables and setup with DB
 */
export async function setupPostgresDb(factorDb: FactorDb): Promise<void> {
  const db = factorDb.client()

  // const existsProjectTable = await db.schema.hasTable(AppTable.Projects)
  // const existsOrganizationTable = await db.schema.hasTable(
  //   AppTable.Organizations,
  // )
  const existsRelation = await db.schema.hasTable(AppTable.OrganizationMembers)
  const existsSession = await db.schema.hasTable(AppTable.Sessions)
  const existsUsageTable = await db.schema.hasTable(AppTable.Usage)

  /**
   * Organization Table
   */
  // if (!existsOrganizationTable) {
  //   await db.schema.createTable(AppTable.Organizations, (t) => {
  //     t.string(`organization_id`, 32)
  //       .primary()
  //       .defaultTo(db.raw(`generate_object_id('or')`))
  //     t.string("organization_name")
  //     t.string("organization_email")
  //     t.string("organization_status").notNullable().defaultTo("active")
  //     t.string("organization_plan")
  //     t.string("owner_id", 32)
  //       .references("factor_user.user_id")
  //       .onUpdate("CASCADE")

  //     t.boolean("manage_clients")
  //     t.integer("organization_size")
  //     t.jsonb("organization_settings")
  //     t.string("customer_id")
  //     t.string("customer_id_test")
  //     t.jsonb("customer")
  //     t.jsonb("customer_test")
  //     t.jsonb("dashboards")
  //     t.jsonb("referral_data")

  //     t.timestamps(true, true)
  //   })
  // }
  // if (!existsProjectTable) {
  //   await db.schema.createTable(AppTable.Projects, (t) => {
  //     t.string(`project_id`, 32)
  //       .primary()
  //       .defaultTo(db.raw(`generate_object_id('pr')`))
  //     t.string("project_name")
  //     t.string("project_domain")

  //     t.enum("project_status", statusTypes).notNullable().defaultTo("pending")

  //     t.string("organization_id", 32)
  //       .references(`${AppTable.Organizations}.organization_id`)
  //       .onUpdate("CASCADE")

  //     t.string("project_timezone")
  //     t.string("project_type")
  //     t.string("api_secret")

  //     t.jsonb("project_settings")
  //     t.jsonb("project_events")
  //     t.string("tracking_status").defaultTo("noData")
  //     t.jsonb("tracking_settings")
  //     t.jsonb("experiments")
  //     t.jsonb("variants")

  //     t.timestamps(true, true)
  //   })
  // }

  // if (!existsRelation) {
  //   await db.schema.createTable(AppTable.OrganizationMembers, (t) => {
  //     t.primary(["user_id", "organization_id"])
  //     t.string("user_id", 32)
  //       .references("factor_user.user_id")
  //       .onUpdate("CASCADE")
  //     t.string("organization_id", 32)
  //       .references(`${AppTable.Organizations}.organization_id`)
  //       .onUpdate("CASCADE")
  //     t.enum("member_status", statusTypes).notNullable().defaultTo("pending")
  //     t.enum("member_access", ["observer", "editor", "admin", "owner"])
  //       .notNullable()
  //       .defaultTo("observer")
  //     t.string("member_role")
  //     t.string("invited_by").references(`factor_user.user_id`)
  //     t.timestamps(true, true)
  //   })
  // }
}
