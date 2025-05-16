import type { ColorThemeBright } from '../utils/index.js'
import type { OnboardSettings, Plan, PushSubscriptionDetail, SocialAccounts, StreetAddress, UserCompany } from './types.js'
import { z } from 'zod'
import { Col, FictionDbTable } from '../plugin-db/index.js'
import { MediaDisplaySchema } from '../schemas/schemas.js'
import { createTableSchema, standardTable as t } from '../tbl.js'
import { GeoDataSchema } from '../utils/geo.js'
import { convertKeyCase } from '../utils/index.js'
import { EntityStatusEnum, GenderEnum, UserRoleEnum } from './types.js'

export type VerificationCode = {
  code: string
  expiresAt: string
  context: string
}

export const userColumns = [
  new Col({ key: 'userId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('usr')`)) }),
  new Col({ key: 'email', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).notNullable().unique(), prepare: ({ value }) => (value).toLowerCase().trim() }),
  new Col({ key: 'handle', sec: 'setting', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).unique().notNullable().defaultTo(db.raw(`short_id(9)`)).index(), prepare: ({ value }) => (value).replaceAll(/[^\dA-Z]+/gi, '').toLowerCase() }),
  new Col({ key: 'fullName', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'about', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k) }),
  new Col({ key: 'headline', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k) }),
  new Col({ key: 'avatar', sec: 'setting', sch: () => MediaDisplaySchema, make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'hashedPassword', sec: 'authority', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'emailVerified', sec: 'settingAdmin', sch: () => z.boolean(), make: ({ s, col }) => s.boolean(col.k).notNullable().defaultTo(false) }),
  new Col({ key: 'verify', sec: 'authority', sch: () => z.object({ code: z.string(), expiresAt: z.string(), context: z.string().optional() }) as z.Schema<VerificationCode>, make: ({ s, col }) => s.jsonb(col.k) }),

  new Col({ key: 'googleId', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).unique() }),
  new Col({ key: 'status', sch: () => EntityStatusEnum, make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('active') }),
  new Col({ key: 'invitedById', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.user}.user_id`) }),
  new Col({ key: 'loadOrgId', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'lastSeenAt', sec: 'setting', sch: () => z.string(), make: ({ s, col, db }) => s.dateTime(col.k).defaultTo(db.fn.now()) }),
  new Col({ key: 'isSuperAdmin', sch: () => z.boolean(), make: ({ s, col }) => s.boolean(col.k).defaultTo(false) }),
  new Col({ key: 'pushSubscription', sec: 'setting', sch: () => z.any() as z.Schema<PushSubscriptionDetail>, make: ({ s, col }) => s.jsonb(col.k), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'ip', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'geo', sec: 'setting', sch: () => GeoDataSchema, make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'phone', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'address', sec: 'settingPrivate', sch: () => z.any() as z.Schema<StreetAddress>, make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'title', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k) }),

  new Col({ key: 'websiteUrl', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'accounts', sec: 'setting', sch: () => z.any() as z.Schema<SocialAccounts>, make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'company', sec: 'setting', sch: () => z.any() as z.Schema<UserCompany>, make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'birthday', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'gender', sec: 'setting', sch: () => GenderEnum, make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'tags', sec: 'setting', sch: () => z.array(z.string()), make: ({ s, col }) => s.specificType(col.k, 'text[]') }),
  new Col({ key: 'systemRole', sch: () => UserRoleEnum, make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('subscriber') }),
  new Col({ key: 'needsOnboarding', sec: 'setting', sch: () => z.boolean(), make: ({ s, col }) => s.boolean(col.k).defaultTo(false) }),
  new Col({ key: 'onboard', sec: 'setting', sch: () => z.record(z.string(), z.any()) as z.Schema<OnboardSettings>, make: ({ s, col }) => s.jsonb(col.k) }),
] as const

export const UserSchema = createTableSchema(userColumns)

export const orgColumns = [
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('org')`)) }),
  new Col({ key: 'ownerId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.user}.user_id`).onUpdate('CASCADE').onDelete('CASCADE').index() }),
  new Col({ key: 'handle', sec: 'setting', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).unique().notNullable().defaultTo(db.raw(`short_id(9)`)).index(), prepare: ({ value }) => (value).replaceAll(/[^\dA-Z]+/gi, '').toLowerCase() }),
  new Col({ key: 'orgName', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'orgEmail', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'description', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k) }),
  new Col({ key: 'headline', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k) }),
  new Col({ key: 'about', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k) }),
  new Col({ key: 'goal', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k) }),

  new Col({ key: 'interests', sec: 'setting', sch: () => z.array(z.string()), make: ({ s, col }) => s.specificType(col.k, 'text[]') }),
  new Col({ key: 'influences', sec: 'setting', sch: () => z.array(z.string()), make: ({ s, col }) => s.specificType(col.k, 'text[]') }),
  new Col({ key: 'pillars', sec: 'setting', sch: () => z.array(z.string()), make: ({ s, col }) => s.specificType(col.k, 'text[]') }),
  new Col({ key: 'clout', sec: 'setting', sch: () => z.number().min(0).max(100), make: ({ s, col }) => s.integer(col.k) }),

  new Col({ key: 'promptImage', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k) }),
  new Col({ key: 'promptContent', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k) }),

  new Col({ key: 'industry', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'experiences', sec: 'setting', sch: () => z.array(z.string()), make: ({ s, col }) => s.specificType(col.k, 'text[]') }),
  new Col({ key: 'streetAddress', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'city', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'state', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'country', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),

  new Col({ key: 'logo', sec: 'setting', sch: () => MediaDisplaySchema, make: ({ s, col }) => s.jsonb(col.k) }), // wide logo (full name)
  new Col({ key: 'avatar', sec: 'setting', sch: () => MediaDisplaySchema, make: ({ s, col }) => s.jsonb(col.k) }), // avatar (image of person or icon)
  new Col({ key: 'icon', sec: 'setting', sch: () => MediaDisplaySchema, make: ({ s, col }) => s.jsonb(col.k) }), // icon (logo or icon)
  new Col({ key: 'companyName', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),

  new Col({ key: 'primaryColor', sec: 'setting', sch: () => z.string() as z.Schema<ColorThemeBright>, make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'googleAnalyticsId', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'accounts', sec: 'setting', sch: () => z.any() as z.Schema<SocialAccounts>, make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'orgStatus', sec: 'setting', sch: () => EntityStatusEnum, make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('active') }),
  new Col({ key: 'createdByUserId', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),

  new Col({ key: 'lastSeenAt', sec: 'setting', sch: () => z.string(), make: ({ s, col, db }) => s.dateTime(col.k).defaultTo(db.fn.now()) }),
  new Col({ key: 'apiSecret', sec: 'settingPrivate', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'timezone', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'extend', sec: 'setting', sch: () => z.record(z.string(), z.object({ extensionId: z.string(), isActive: z.boolean() })), make: ({ s, col }) => s.jsonb(col.k), prepare: ({ value }) => JSON.stringify(convertKeyCase(value, { mode: 'snake' })) }),
  new Col({ key: 'customerId', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'customerIdTest', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'orgPlan', sec: 'setting', sch: () => z.any() as z.Schema<Plan>, make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'specialPlan', sec: 'settingAdmin', sch: () => z.enum(['vip', 'npo']), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'accessTokens', sec: 'authority', sch: () => z.record(z.string(), z.string()), make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'needsOnboarding', sec: 'setting', sch: () => z.boolean(), make: ({ s, col }) => s.boolean(col.k).defaultTo(false) }),
  new Col({ key: 'onboard', sec: 'setting', sch: () => z.record(z.string(), z.any()) as z.Schema<OnboardSettings>, make: ({ s, col }) => s.jsonb(col.k) }),
] as const

export const OrgSchema = createTableSchema(orgColumns)

export const membersColumns = [
  new Col({ key: 'memberId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id()`)) }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.org}.org_id`).onUpdate('CASCADE').onDelete('CASCADE').index() }),
  new Col({ key: 'userId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.user}.user_id`).onUpdate('CASCADE').onDelete('CASCADE').index() }),
  new Col({ key: 'memberStatus', sch: () => EntityStatusEnum, make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('pending') }),
  new Col({ key: 'memberAccess', sch: () => UserRoleEnum, make: ({ s, col }) => s.enum(col.k, UserRoleEnum.options).notNullable().defaultTo('observer') }),
  new Col({ key: 'invitedById', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.user}.user_id`) }),
  new Col({ key: 'priority', sch: () => z.number().int(), make: ({ s, col }) => s.integer(col.k) }),
  new Col({ key: 'tags', sec: 'setting', sch: () => z.array(z.string()), make: ({ s, col }) => s.specificType(col.k, 'text[]') }),
  new Col({ key: 'needsOnboarding', sec: 'setting', sch: () => z.boolean(), make: ({ s, col }) => s.boolean(col.k).defaultTo(false) }),
] as const

export const userTable = new FictionDbTable({
  tableKey: t.user,
  timestamps: true,
  cols: userColumns,
  priority: 20,
})

export const orgTable = new FictionDbTable({
  tableKey: t.org,
  timestamps: true,
  cols: orgColumns,
  priority: 40,
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
