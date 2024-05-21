import { objectId, toSnakeCaseKeys } from '../utils'
import { FictionDbCol, FictionDbTable } from '../plugin-db'
import { standardTable } from '../tbl'
import type { MediaDisplayObject } from '../types'
import type { GeoData } from '../utils-analytics/geo'
import type { MemberAccess, OnboardStoredSettings, OrganizationConfig, OrganizationCustomerData, Plan, PushSubscriptionDetail, UserMeta } from './types'

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
  }),
  new FictionDbCol({
    key: 'email',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable().unique(),
    prepare: ({ value }) => (value).toLowerCase().trim(),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'username',
    create: ({ schema, column }) => schema.string(column.pgKey).unique().index(),
    default: () => '' as string,
    isSetting: true,
    prepare: ({ value }) => (value).replaceAll(/[^\dA-Z]+/gi, '').toLowerCase(),
  }),
  new FictionDbCol({
    key: 'googleId',
    create: ({ schema, column }) => schema.string(column.pgKey).unique(),
    isPrivate: true,
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'fullName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'firstName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'lastName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'role',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable().defaultTo('subscriber'),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'status',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable().defaultTo('active'),
    default: () => '' as string,
  }),

  new FictionDbCol({
    key: 'hashedPassword',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isAuthority: true,
    isPrivate: true,
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'emailVerified',
    create: ({ schema, column }) => schema.boolean(column.pgKey).notNullable().defaultTo(false),
    default: () => false as boolean,
  }),
  new FictionDbCol({
    key: 'verify',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isAuthority: true,
    isPrivate: true,
    default: () => ({}) as VerificationCode,
  }),

  new FictionDbCol({
    key: 'avatar',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    default: () => ({} as MediaDisplayObject),
  }),
  new FictionDbCol({
    key: 'phoneNumber',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isPrivate: true,
    isSetting: true,
    default: () => '',
  }),
  new FictionDbCol({
    key: 'address',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isPrivate: true,
    default: () => '',
  }),
  new FictionDbCol({
    key: 'meta',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    default: () => ({} as UserMeta),
    isSetting: true,
    prepare: ({ value }) => JSON.stringify(toSnakeCaseKeys(value)),
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
  }),
  new FictionDbCol({
    key: 'lastSeenAt',
    isSetting: true,
    create: ({ schema, column, db }) => schema.dateTime(column.pgKey).defaultTo(db.fn.now()),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'isSuperAdmin',
    create: ({ schema, column }) => schema.boolean(column.pgKey).defaultTo(false),
    default: () => false,
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
  }),
  new FictionDbCol({
    key: 'geo',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    prepare: ({ value }) => JSON.stringify(value),
    default: () => ({} as GeoData),
  }),
] as const

export const orgColumns = [
  new FictionDbCol({
    key: 'orgId',
    create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`object_id('org')`)),
    default: () => objectId(),
  }),
  new FictionDbCol({
    key: 'username',
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
    key: 'meta',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    default: () => ({} as UserMeta),
    isSetting: true,
    prepare: ({ value }) => JSON.stringify(toSnakeCaseKeys(value)),
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
] as const

export const membersColumns = [
  new FictionDbCol({
    key: 'memberId',
    isComposite: true,
    create: ({ schema }) => schema.primary(['user_id', 'org_id']),
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

export const deletedTableColumns = [
  new FictionDbCol({
    key: 'deletedId',
    create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`object_id('del')`)),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'orgId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'userId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'deletedType',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as 'org' | 'render' | 'image' | 'model' | 'user' | 'other',
  }),
  new FictionDbCol({
    key: 'modelId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'renderId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'imageId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'collectionId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'meta',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    default: () => ({} as Record<string, unknown>),
    prepare: ({ value }) => JSON.stringify(toSnakeCaseKeys(value)),
  }),
] as const

export const userTable = new FictionDbTable({ tableKey: 'fiction_user', timestamps: true, columns: userColumns })
export const membersTable = new FictionDbTable({ tableKey: 'fiction_org_user', timestamps: true, columns: membersColumns })
export const orgTable = new FictionDbTable({ tableKey: 'fiction_org', timestamps: true, columns: orgColumns })
export const deletedTable = new FictionDbTable({ tableKey: standardTable.deleted, timestamps: true, columns: deletedTableColumns })

export function getAdminTables() {
  return [userTable, orgTable, membersTable, deletedTable]
}
