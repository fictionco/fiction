import type { PushSubscriptionDetail } from './types.js'
import { z } from 'zod/v4'
import { Col, FictionDbTable } from '../plugin-db/index.js'
import { MediaSchema } from '../schemas/index.js'
import { AiSettingsSchema, BillingSchema, BrandingSchema, GeoLocationSchema, OrgTokenSchema, ProfileSchema, SocialAccountsSchema, TrackingSchema } from '../schemas/org.js'
import { createTableSchema, standardTable as t } from '../tbl.js'
import { GeoDataSchema } from '../utils/geo.js'
import { EntityStatusEnum, OnboardSchema, UserRoleEnum } from './types.js'

export type VerificationCode = {
  code: string
  expiresAt: string
  context: string
}

export const userColumns = [
  new Col({ key: 'userId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('usr')`)) }),
  new Col({ key: 'email', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).notNullable().unique(), prepare: ({ value }) => (value).toLowerCase().trim() }),
  new Col({ key: 'handle', sec: 'setting', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).unique().notNullable().defaultTo(db.raw(`short_id(9)`)).index(), prepare: ({ value }) => (value).replaceAll(/[^\w-]+/g, '').toLowerCase() }),
  new Col({ key: 'fullName', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'avatar', sec: 'setting', sch: () => MediaSchema, make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'hashedPassword', sec: 'authority', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'emailVerified', sec: 'settingAdmin', sch: () => z.boolean(), make: ({ s, col }) => s.boolean(col.k).notNullable().defaultTo(false) }),
  new Col({ key: 'verify', sec: 'authority', sch: () => z.object({ code: z.string(), expiresAt: z.string(), context: z.string().optional() }) as z.Schema<VerificationCode>, make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'status', sch: () => EntityStatusEnum, make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('active') }),
  new Col({ key: 'primaryOrgId', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'loadOrgId', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'lastSeenAt', sec: 'setting', sch: () => z.string(), make: ({ s, col, db }) => s.dateTime(col.k).defaultTo(db.fn.now()) }),
  new Col({ key: 'isSuperAdmin', sch: () => z.boolean(), make: ({ s, col }) => s.boolean(col.k).defaultTo(false) }),
  new Col({ key: 'ip', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'geo', sec: 'setting', sch: () => GeoDataSchema, make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'tags', sec: 'setting', sch: () => z.array(z.string()), make: ({ s, col }) => s.specificType(col.k, 'text[]') }),
  new Col({ key: 'googleId', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).unique() }),
  new Col({ key: 'pushSubscription', sec: 'setting', sch: () => z.any() as z.Schema<PushSubscriptionDetail>, make: ({ s, col }) => s.jsonb(col.k), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'inviterId', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.user}.user_id`) }),
  new Col({ key: 'systemRole', sch: () => UserRoleEnum, make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('subscriber') }),
] as const

export const UserSchema = createTableSchema(userColumns)

export const orgColumns = [
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('org')`)) }),
  new Col({ key: 'ownerId', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.user}.user_id`).onUpdate('CASCADE').onDelete('CASCADE').index() }),
  new Col({ key: 'handle', sec: 'setting', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).unique().notNullable().defaultTo(db.raw(`short_id(9)`)).index(), prepare: ({ value }) => (value).replaceAll(/[^\w-]+/g, '').toLowerCase() }),
  new Col({ key: 'name', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'email', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'avatar', sec: 'setting', sch: () => MediaSchema, make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'profile', sec: 'setting', sch: () => ProfileSchema, make: ({ s, col }) => s.jsonb(col.k), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'billing', sec: 'setting', sch: () => BillingSchema, make: ({ s, col }) => s.jsonb(col.k), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'location', sec: 'setting', sch: () => GeoLocationSchema, make: ({ s, col }) => s.jsonb(col.k), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'accounts', sec: 'setting', sch: () => SocialAccountsSchema, make: ({ s, col }) => s.jsonb(col.k), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'branding', sec: 'setting', sch: () => BrandingSchema, make: ({ s, col }) => s.jsonb(col.k), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'prompt', sec: 'setting', sch: () => AiSettingsSchema, make: ({ s, col }) => s.jsonb(col.k), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'tracking', sec: 'setting', sch: () => TrackingSchema, make: ({ s, col }) => s.jsonb(col.k), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'tokens', sec: 'settingPrivate', sch: () => OrgTokenSchema, make: ({ s, col }) => s.jsonb(col.k), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'onboard', sec: 'setting', sch: () => OnboardSchema, make: ({ s, col }) => s.jsonb(col.k), prepare: ({ value }) => JSON.stringify(value) }),
] as const

export const OrgSchema = createTableSchema(orgColumns)

export const membersColumns = [
  new Col({ key: 'memberId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id()`)) }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.org}.org_id`).onUpdate('CASCADE').onDelete('CASCADE').index() }),
  new Col({ key: 'userId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.user}.user_id`).onUpdate('CASCADE').onDelete('CASCADE').index() }),
  new Col({ key: 'status', sch: () => EntityStatusEnum, make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('pending') }),
  new Col({ key: 'access', sch: () => UserRoleEnum, make: ({ s, col }) => s.enum(col.k, UserRoleEnum.options).notNullable().defaultTo('observer') }),
  new Col({ key: 'inviterId', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.user}.user_id`) }),
  new Col({ key: 'priority', sch: () => z.number().int(), make: ({ s, col }) => s.integer(col.k) }),
  new Col({ key: 'tags', sec: 'setting', sch: () => z.array(z.string()), make: ({ s, col }) => s.specificType(col.k, 'text[]') }),
] as const

export const userTable = new FictionDbTable({
  tableKey: t.user,
  timestamps: true,
  cols: userColumns,
  priority: 20,
  constraints: [
    { type: 'foreign', columns: ['inviterId'], references: { table: t.user, column: 'userId' } },
    { type: 'foreign', columns: ['primaryOrgId'], references: { table: t.org, column: 'orgId' } },
    { type: 'foreign', columns: ['loadOrgId'], references: { table: t.org, column: 'orgId' } },
  ],
})

export const orgTable = new FictionDbTable({
  tableKey: t.org,
  timestamps: true,
  cols: orgColumns,
  priority: 40,
  constraints: [
    { type: 'foreign', columns: ['ownerId'], references: { table: t.user, column: 'userId' } },
  ],
})

export const membersTable = new FictionDbTable({
  tableKey: t.member,
  timestamps: true,
  cols: membersColumns,
  priority: 80,
  constraints: [
    { type: 'unique', columns: ['org_id', 'user_id'] },
  ],
})

export function getAdminTables() {
  return [userTable, orgTable, membersTable]
}
