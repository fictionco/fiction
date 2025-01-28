import type { OnboardSettings, OrganizationConfig, OrganizationCustomerData, OrganizationLegal, Plan, Publication, PushSubscriptionDetail, SocialAccounts, StreetAddress, UserCompany } from './types.js'
import { z } from 'zod'
import { Col, FictionDbTable } from '../plugin-db/index.js'
import { MediaDisplaySchema } from '../schemas/schemas.js'
import { standardTable as t } from '../tbl.js'
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
  new Col({ key: 'username', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).unique().index(), prepare: ({ value }) => (value).replaceAll(/[^\dA-Z]+/gi, '').toLowerCase() }),
  new Col({ key: 'googleId', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).unique() }),
  new Col({ key: 'fullName', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'status', sch: () => EntityStatusEnum, make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('active') }),
  new Col({ key: 'hashedPassword', sec: 'authority', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'emailVerified', sch: () => z.boolean(), make: ({ s, col }) => s.boolean(col.k).notNullable().defaultTo(false) }),
  new Col({ key: 'verify', sec: 'authority', sch: () => z.object({ code: z.string(), expiresAt: z.string(), context: z.string().optional() }) as z.Schema<VerificationCode>, make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'avatar', sec: 'setting', sch: () => MediaDisplaySchema, make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'invitedById', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.user}.user_id`) }),
  new Col({ key: 'loadOrgId', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.org}.org_id`).onDelete('SET NULL') }),
  new Col({ key: 'lastSeenAt', sec: 'setting', sch: () => z.string(), make: ({ s, col, db }) => s.dateTime(col.k).defaultTo(db.fn.now()) }),
  new Col({ key: 'isSuperAdmin', sch: () => z.boolean(), make: ({ s, col }) => s.boolean(col.k).defaultTo(false) }),
  new Col({ key: 'onboard', sec: 'setting', sch: () => z.record(z.string(), z.any()) as z.Schema<OnboardSettings>, make: ({ s, col }) => s.jsonb(col.k), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'pushSubscription', sec: 'setting', sch: () => z.any() as z.Schema<PushSubscriptionDetail>, make: ({ s, col }) => s.jsonb(col.k), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'ip', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'geo', sec: 'setting', sch: () => GeoDataSchema, make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'phone', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'address', sec: 'settingPrivate', sch: () => z.any() as z.Schema<StreetAddress>, make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'title', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k) }),
  new Col({ key: 'headline', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k) }),
  new Col({ key: 'websiteUrl', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'accounts', sec: 'setting', sch: () => z.any() as z.Schema<SocialAccounts>, make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'company', sec: 'setting', sch: () => z.any() as z.Schema<UserCompany>, make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'birthday', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'gender', sec: 'setting', sch: () => GenderEnum, make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'tags', sec: 'setting', sch: () => z.array(z.string()), make: ({ s, col }) => s.specificType(col.k, 'text[]') }),
  new Col({ key: 'systemRole', sch: () => UserRoleEnum, make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('subscriber') }),
] as const

export const orgColumns = [
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('org')`)) }),
  new Col({ key: 'slug', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).unique(), prepare: ({ value }) => (value).replaceAll(/[^\dA-Z]+/gi, '').toLowerCase() }),
  new Col({ key: 'orgName', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'orgEmail', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'url', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'address', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'orgStatus', sec: 'setting', sch: () => EntityStatusEnum, make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('active') }),
  new Col({ key: 'createdByUserId', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'avatar', sec: 'setting', sch: () => MediaDisplaySchema, make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'lastSeenAt', sec: 'setting', sch: () => z.string(), make: ({ s, col, db }) => s.dateTime(col.k).defaultTo(db.fn.now()) }),
  new Col({ key: 'apiSecret', sec: 'settingPrivate', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'timezone', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'config', sec: 'setting', sch: () => z.any() as z.Schema<Partial<OrganizationConfig>>, make: ({ s, col }) => s.jsonb(col.k), prepare: ({ value }) => JSON.stringify(convertKeyCase(value, { mode: 'snake' })) }),
  new Col({ key: 'onboard', sec: 'setting', sch: () => z.any() as z.Schema<OnboardSettings>, make: ({ s, col }) => s.jsonb(col.k), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'extend', sec: 'setting', sch: () => z.record(z.string(), z.object({ extensionId: z.string(), isActive: z.boolean() })), make: ({ s, col }) => s.jsonb(col.k), prepare: ({ value }) => JSON.stringify(convertKeyCase(value, { mode: 'snake' })) }),
  new Col({ key: 'customerId', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'customer', sec: 'setting', sch: () => z.any() as z.Schema<OrganizationCustomerData>, make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'customerAuthorized', sec: 'setting', sch: () => z.enum(['authorized', 'invalid', 'unknown']), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'customerIdTest', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'customerTest', sec: 'setting', sch: () => z.any() as z.Schema<OrganizationCustomerData>, make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'orgPlan', sec: 'setting', sch: () => z.any() as z.Schema<Plan>, make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'specialPlan', sec: 'settingAdmin', sch: () => z.enum(['vip', 'npo']), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'publication', sec: 'setting', sch: () => z.any() as z.Schema<Publication>, make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'legal', sec: 'setting', sch: () => z.any() as z.Schema<OrganizationLegal>, make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'accessTokens', sec: 'authority', sch: () => z.record(z.string(), z.string()), make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'needsOnboarding', sec: 'setting', sch: () => z.boolean(), make: ({ s, col }) => s.boolean(col.k).defaultTo(false) }),
] as const

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

export const orgTable = new FictionDbTable({
  tableKey: t.org,
  timestamps: true,
  cols: orgColumns,
  priority: 20,
})

export const userTable = new FictionDbTable({
  tableKey: t.user,
  timestamps: true,
  cols: userColumns,
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
