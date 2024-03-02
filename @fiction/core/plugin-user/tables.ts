import { objectId, toSnakeCaseKeys } from '../utils'
import { FactorDbCol, FactorDbTable } from '../plugin-db'
import { standardTable } from '../tbl'
import type { GeoData } from '../utils-analytics/geo'
import type { MemberAccess, OnboardStoredSettings, OrganizationConfig, OrganizationCustomerData, Plan, PushSubscriptionDetail, UserMeta } from './types'

export const userColumns = [
  new FactorDbCol({
    key: 'userId',
    create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`object_id('usr')`)),
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'email',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable().unique(),
    prepare: ({ value }) => (value as string).toLowerCase().trim(),
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'username',
    create: ({ schema, column }) => schema.string(column.pgKey).unique().index(),
    default: () => '' as string,
    isSetting: true,
    prepare: ({ value }) => (value as string).replaceAll(/[^\dA-Za-z]+/g, '').toLowerCase(),
  }),
  new FactorDbCol({
    key: 'googleId',
    create: ({ schema, column }) => schema.string(column.pgKey).unique(),
    isPrivate: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'fullName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'firstName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'lastName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'role',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable().defaultTo('subscriber'),
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'status',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable().defaultTo('active'),
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'site',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'github',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'githubFollowers',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    isPrivate: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'twitter',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'twitterFollowers',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    isPrivate: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'facebook',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'linkedin',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'workSeniority',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'workRole',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'bio',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'location',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'hashedPassword',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isAuthority: true,
    isPrivate: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'emailVerified',
    create: ({ schema, column }) =>
      schema.boolean(column.pgKey).notNullable().defaultTo(false),
    default: () => false as boolean,
  }),
  new FactorDbCol({
    key: 'verificationCode',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isAuthority: true,
    isPrivate: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'codeExpiresAt',
    create: ({ schema, column }) => schema.dateTime(column.pgKey),
    isAuthority: true,
    isPrivate: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'avatarUrl',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'picture',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),

  new FactorDbCol({
    key: 'about',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'gender',
    create: ({ schema, column }) =>
      schema.enum(column.pgKey, ['male', 'female', 'other']),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'birthday',
    create: ({ schema, column }) => schema.date(column.pgKey),
    isPrivate: true,
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'phoneNumber',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isPrivate: true,
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'address',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isPrivate: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'meta',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    default: () => ({} as UserMeta),
    isSetting: true,
    prepare: ({ value }) => JSON.stringify(toSnakeCaseKeys(value)),
  }),

  new FactorDbCol({
    key: 'invitedById',
    create: ({ schema, column }) =>
      schema.string(column.pgKey).references(`factor_user.user_id`),
    isSetting: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'lastOrgId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'lastSeenAt',
    isSetting: true,
    create: ({ schema, column, db }) =>
      schema.dateTime(column.pgKey).defaultTo(db.fn.now()),
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'isSuperAdmin',
    create: ({ schema, column }) =>
      schema.boolean(column.pgKey).defaultTo(false),
    default: () => false,
  }),
  new FactorDbCol({
    key: 'onboard',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    default: () => ({} as OnboardStoredSettings),
    prepare: ({ value }) => JSON.stringify(value),
    isPrivate: true,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'pushSubscription',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    default: () => ({} as PushSubscriptionDetail),
    prepare: ({ value }) => JSON.stringify(value),
    isPrivate: true,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'ip',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'geo',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    prepare: ({ value }) => JSON.stringify(value),
    default: () => ({} as GeoData),
  }),
] as const

export const orgColumns = [
  new FactorDbCol({
    key: 'orgId',
    create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`object_id('org')`)),
    default: () => objectId(),
  }),
  new FactorDbCol({
    key: 'username',
    create: ({ schema, column }) => schema.string(column.pgKey).unique(),
    default: () => '' as string,
    isSetting: true,
    prepare: ({ value }) =>
      (value as string).replaceAll(/[^\dA-Za-z]+/g, '').toLowerCase(),
  }),
  new FactorDbCol({
    key: 'orgName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'orgEmail',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'orgStatus',
    create: ({ schema, column }) =>
      schema.string(column.pgKey).notNullable().defaultTo('active'),
    default: () => 'active' as 'active' | 'inactive',
  }),
  new FactorDbCol({
    key: 'orgPlan',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => ({} as Plan),
  }),
  new FactorDbCol({
    key: 'ownerId',
    create: ({ schema, column }) => schema.string(column.pgKey).references(`factor_user.user_id`).onUpdate('CASCADE'),
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'avatarUrl',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'customerId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'customer',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    default: () => ({} as OrganizationCustomerData),
  }),
  new FactorDbCol({
    key: 'customerAuthorized',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as 'authorized' | 'invalid' | 'unknown',
  }),
  new FactorDbCol({
    key: 'customerIdTest',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'customerTest',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    default: () => ({} as OrganizationCustomerData),
  }),
  new FactorDbCol({
    key: 'lastSeenAt',
    isSetting: true,
    create: ({ schema, column, db }) =>
      schema.dateTime(column.pgKey).defaultTo(db.fn.now()),
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'specialPlan',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isAdmin: true,
    default: () => '' as 'vip' | 'npo',
  }),
  new FactorDbCol({
    key: 'apiSecret',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isPrivate: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'timezone',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'dashboards',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isPrivate: true,
    default: () => ({} as Record<string, unknown>),
  }),
  new FactorDbCol({
    key: 'config',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    prepare: ({ value }) => JSON.stringify(toSnakeCaseKeys(value)),
    default: () => ({} as Partial<OrganizationConfig>),
  }),

  new FactorDbCol({
    key: 'meta',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    default: () => ({} as UserMeta),
    isSetting: true,
    prepare: ({ value }) => JSON.stringify(toSnakeCaseKeys(value)),
  }),
  new FactorDbCol({
    key: 'onboard',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    default: () => ({} as OnboardStoredSettings),
    prepare: ({ value }) => JSON.stringify(value),
    isPrivate: true,
    isSetting: true,
  }),
] as const

export const membersColumns = [
  new FactorDbCol({
    key: 'memberId',
    isComposite: true,
    create: ({ schema }) => schema.primary(['user_id', 'org_id']),
    default: () => objectId(),
  }),
  new FactorDbCol({
    key: 'orgId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey)
        .references(`factor_org.org_id`)
        .onUpdate('CASCADE')
        .index()
    },
    default: () => objectId(),
  }),
  new FactorDbCol({
    key: 'userId',
    create: ({ schema, column }) => schema.string(column.pgKey).references(`factor_user.user_id`).onUpdate('CASCADE').index(),
    default: () => objectId(),
  }),
  new FactorDbCol({
    key: 'memberStatus',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable().defaultTo('pending'),
    default: () => '' as 'active' | 'pending' | 'inactive',
  }),
  new FactorDbCol({
    key: 'memberAccess',
    create: ({ schema, column }) =>
      schema
        .enum(column.pgKey, ['profile', 'observer', 'editor', 'admin', 'owner'])
        .notNullable()
        .defaultTo('observer'),
    default: () => '' as MemberAccess,
  }),
  new FactorDbCol({
    key: 'memberRole',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'invitedById',
    create: ({ schema, column }) => schema.string(column.pgKey).references(`factor_user.user_id`),
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'priority',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    default: () => 0 as number,
  }),
] as const

export const deletedTableColumns = [
  new FactorDbCol({
    key: 'deletedId',
    create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`object_id('del')`)),
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'orgId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'userId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'deletedType',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as 'org' | 'render' | 'image' | 'model' | 'user' | 'other',
  }),
  new FactorDbCol({
    key: 'modelId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'renderId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'imageId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'collectionId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'meta',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    default: () => ({} as Record<string, unknown>),
    prepare: ({ value }) => JSON.stringify(toSnakeCaseKeys(value)),
  }),
] as const

export const userTable = new FactorDbTable({ tableKey: 'factor_user', timestamps: true, columns: userColumns })
export const membersTable = new FactorDbTable({ tableKey: 'factor_org_user', timestamps: true, columns: membersColumns })
export const orgTable = new FactorDbTable({ tableKey: 'factor_org', timestamps: true, columns: orgColumns })
export const deletedTable = new FactorDbTable({ tableKey: standardTable.deleted, timestamps: true, columns: deletedTableColumns })

export function getAdminTables() {
  return [userTable, orgTable, membersTable, deletedTable]
}
