import type { Schema } from 'zod'
import { objectId, toSnakeCaseKeys } from '../utils/index.js'
import { FictionDbCol, FictionDbTable } from '../plugin-db/index.js'
import { standardTable as t } from '../tbl.js'
import type { MediaDisplayObject } from '../types/index.js'
import type { GeoData } from '../utils-analytics/geo.js'
import type { MemberAccess, OnboardStoredSettings, OrganizationConfig, OrganizationCustomerData, OrganizationLegal, Plan, Publication, PushSubscriptionDetail, SocialAccounts, StreetAddress, UserCompany } from './types.js'

export type VerificationCode = {
  code: string
  expiresAt: string
  context: string
}

export const userColumns = [
  new FictionDbCol({
    key: 'userId',
    create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`object_id('usr')`)),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'email',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable().unique(),
    prepare: ({ value }) => (value).toLowerCase().trim(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'username',
    create: ({ schema, column }) => schema.string(column.pgKey).unique().index(),
    default: () => '' as string,
    isSetting: true,
    prepare: ({ value }) => (value).replaceAll(/[^\dA-Z]+/gi, '').toLowerCase(),
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'googleId',
    create: ({ schema, column }) => schema.string(column.pgKey).unique(),
    isPrivate: true,
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'fullName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'role',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable().defaultTo('subscriber'),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'status',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable().defaultTo('active'),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'hashedPassword',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isAuthority: true,
    isPrivate: true,
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'emailVerified',
    create: ({ schema, column }) => schema.boolean(column.pgKey).notNullable().defaultTo(false),
    default: () => false as boolean,
    zodSchema: ({ z }) => z.boolean(),
  }),
  new FictionDbCol({
    key: 'verify',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isAuthority: true,
    isPrivate: true,
    default: () => ({}) as VerificationCode,
    zodSchema: ({ z }) => z.object({ code: z.string(), expiresAt: z.string(), context: z.string() }),
  }),
  new FictionDbCol({
    key: 'avatar',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    default: () => ({} as MediaDisplayObject),
    zodSchema: ({ z }) => z.object({ url: z.string() }),
  }),
  new FictionDbCol({
    key: 'invitedById',
    create: ({ schema, column }) => schema.string(column.pgKey).references(`fiction_user.user_id`),
    isSetting: true,
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'lastOrgId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'lastSeenAt',
    isSetting: true,
    create: ({ schema, column, db }) => schema.dateTime(column.pgKey).defaultTo(db.fn.now()),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'isSuperAdmin',
    create: ({ schema, column }) => schema.boolean(column.pgKey).defaultTo(false),
    default: () => false as boolean,
    zodSchema: ({ z }) => z.boolean(),
  }),
  new FictionDbCol({
    key: 'onboard',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    default: () => ({} as OnboardStoredSettings),
    prepare: ({ value }) => JSON.stringify(value),
    isPrivate: true,
    isSetting: true,
    zodSchema: ({ z }) => z.record(z.string(), z.any()) as Schema<OnboardStoredSettings>,
  }),
  new FictionDbCol({
    key: 'pushSubscription',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    default: () => ({} as PushSubscriptionDetail),
    prepare: ({ value }) => JSON.stringify(value),
    isPrivate: true,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'ip',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'geo',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    prepare: ({ value }) => JSON.stringify(value),
    default: () => ({} as GeoData),
  }),
  new FictionDbCol({
    key: 'phone',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isPrivate: true,
    isSetting: true,
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'address',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isPrivate: true,
    default: () => ({} as StreetAddress),
  }),
  new FictionDbCol({
    key: 'title',
    create: ({ schema, column }) => schema.text(column.pgKey),
    isSetting: true,
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'headline',
    create: ({ schema, column }) => schema.text(column.pgKey),
    isSetting: true,
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  // website
  new FictionDbCol({
    key: 'websiteUrl',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  // social accounts
  new FictionDbCol({
    key: 'accounts',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    default: () => ({} as SocialAccounts),
  }),
  // company
  new FictionDbCol({
    key: 'company',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    default: () => ({} as UserCompany),
  }),
  // birthday
  new FictionDbCol({
    key: 'birthday',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  // gender
  new FictionDbCol({
    key: 'gender',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
] as const

export const orgColumns = [
  new FictionDbCol({
    key: 'orgId',
    create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`object_id('org')`)),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'slug',
    create: ({ schema, column }) => schema.string(column.pgKey).unique(),
    default: () => '' as string,
    isSetting: true,
    prepare: ({ value }) => (value).replaceAll(/[^\dA-Z]+/gi, '').toLowerCase(),
  }),
  new FictionDbCol({
    key: 'orgName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'orgEmail',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'url',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'address',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'orgStatus',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable().defaultTo('active'),
    default: () => 'active' as 'active' | 'inactive',
  }),
  new FictionDbCol({
    key: 'ownerId',
    create: ({ schema, column }) => schema.string(column.pgKey).references(`fiction_user.user_id`).onUpdate('CASCADE'),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'avatar',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    default: () => ({} as MediaDisplayObject),
  }),

  new FictionDbCol({
    key: 'lastSeenAt',
    isSetting: true,
    create: ({ schema, column, db }) => schema.dateTime(column.pgKey).defaultTo(db.fn.now()),
    default: () => '' as string,
  }),

  new FictionDbCol({
    key: 'apiSecret',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isPrivate: true,
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'timezone',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'config',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    prepare: ({ value }) => JSON.stringify(toSnakeCaseKeys(value)),
    default: () => ({} as Partial<OrganizationConfig>),
  }),
  new FictionDbCol({
    key: 'onboard',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    default: () => ({} as OnboardStoredSettings),
    prepare: ({ value }) => JSON.stringify(value),
    isPrivate: true,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'extend',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    prepare: ({ value }) => JSON.stringify(toSnakeCaseKeys(value)),
    default: () => ({} as Partial<Record<string, { extensionId: string, isActive: boolean }>>),
  }),

  /**
   * Billing Stuff / Move to Plugin?
   */
  new FictionDbCol({
    key: 'customerId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'customer',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    default: () => ({} as OrganizationCustomerData),
  }),
  new FictionDbCol({
    key: 'customerAuthorized',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as 'authorized' | 'invalid' | 'unknown',
  }),
  new FictionDbCol({
    key: 'customerIdTest',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'customerTest',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    default: () => ({} as OrganizationCustomerData),
  }),
  new FictionDbCol({
    key: 'orgPlan',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => ({} as Plan),
  }),
  new FictionDbCol({
    key: 'specialPlan',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isAdmin: true,
    default: () => '' as 'vip' | 'npo',
  }),
  new FictionDbCol({
    key: 'publication',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    default: () => ({} as Publication),
  }),
  new FictionDbCol({
    key: 'legal',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    default: () => ({} as OrganizationLegal),
  }),
] as const

export const membersColumns = [
  new FictionDbCol({
    key: 'memberId',
    create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`object_id()`)),
    default: () => objectId(),
  }),
  new FictionDbCol({
    key: 'orgId',
    create: ({ schema, column }) => schema.string(column.pgKey).references(`fiction_org.org_id`).onUpdate('CASCADE').onDelete('CASCADE').index(),
    default: () => objectId(),
  }),
  new FictionDbCol({
    key: 'userId',
    create: ({ schema, column }) => schema.string(column.pgKey).references(`fiction_user.user_id`).onUpdate('CASCADE').onDelete('CASCADE').index(),
    default: () => objectId(),
  }),
  new FictionDbCol({
    key: 'memberStatus',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable().defaultTo('pending'),
    default: () => '' as 'active' | 'pending' | 'inactive',
  }),
  new FictionDbCol({
    key: 'memberAccess',
    create: ({ schema, column }) => schema.enum(column.pgKey, ['profile', 'observer', 'editor', 'admin', 'owner']).notNullable().defaultTo('observer'),
    default: () => '' as MemberAccess,
  }),
  new FictionDbCol({
    key: 'memberRole',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'invitedById',
    create: ({ schema, column }) => schema.string(column.pgKey).references(`fiction_user.user_id`),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'priority',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    default: () => 0 as number,
  }),
] as const

export const taxonomyCols = [
  new FictionDbCol({
    key: 'taxonomyId',
    create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`object_id('tax')`)),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string().min(1),
  }),
  new FictionDbCol({
    key: 'userId',
    create: ({ schema, column }) => schema.string(column.pgKey, 50).references(`fiction_user.user_id`).onDelete('SET NULL').onUpdate('CASCADE').index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string().length(50),
  }),
  new FictionDbCol({
    key: 'orgId',
    create: ({ schema, column }) => schema.string(column.pgKey, 50).references(`fiction_org.org_id`).onUpdate('CASCADE').notNullable().index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string().length(50),
  }),
  new FictionDbCol({
    key: 'title',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string().min(1),
  }),
  new FictionDbCol({
    key: 'slug',
    create: ({ schema, column }) => schema.string(column.pgKey).index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string().min(1),
  }),
  new FictionDbCol({
    key: 'type',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable().index(),
    default: () => '' as 'tag' | 'category',
    zodSchema: ({ z }) => z.enum(['tag', 'category']),
  }),
  new FictionDbCol({
    key: 'context',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable().index().defaultTo('post'),
    default: () => '' as 'post' | 'user',
    zodSchema: ({ z }) => z.enum(['post', 'user']),
  }),
  new FictionDbCol({
    key: 'description',
    create: ({ schema, column }) => schema.text(column.pgKey),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string().optional(),
  }),
  new FictionDbCol({
    key: 'parentId',
    create: ({ schema, column }) => schema.string(column.pgKey).references(`${t.taxonomy}.taxonomy_id`).onDelete('SET NULL'),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string().optional(),
  }),
  new FictionDbCol({
    key: 'priority',
    create: ({ schema, column }) => schema.integer(column.pgKey).defaultTo(0),
    default: () => 0 as number,
    zodSchema: ({ z }) => z.number().int().optional(),
  }),
] as const

export const userTable = new FictionDbTable({ tableKey: 'fiction_user', timestamps: true, columns: userColumns })
export const membersTable = new FictionDbTable({ tableKey: 'fiction_org_user', timestamps: true, columns: membersColumns, uniqueOn: ['org_id', 'user_id'] })
export const orgTable = new FictionDbTable({ tableKey: 'fiction_org', timestamps: true, columns: orgColumns })
export const taxonomyTable = new FictionDbTable({ tableKey: t.taxonomy, timestamps: true, columns: taxonomyCols, uniqueOn: ['org_id', 'slug', 'context'] })

export function getAdminTables() {
  return [userTable, orgTable, membersTable, taxonomyTable]
}
