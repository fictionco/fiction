import { objectId } from '../../utils'
import { FactorDbCol, FactorDbTable } from '../../plugin-db'
import type { Dashboard } from '../../plugin-dashboards'
import type {
  ItemStatus,
  MemberAccess,
  OrganizationCustomerData,
  Plan,
} from './types'

export const organizationColumns = [
  new FactorDbCol({
    key: 'organizationId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`generate_object_id('or')`))
    },
    default: () => objectId(),
  }),
  new FactorDbCol({
    key: 'organizationName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
  }),
  new FactorDbCol({
    key: 'organizationEmail',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
  }),
  new FactorDbCol({
    key: 'organizationStatus',
    create: ({ schema, column }) =>
      schema.string(column.pgKey).notNullable().defaultTo('active'),
    default: () => 'active' as 'active' | 'inactive',
  }),
  new FactorDbCol({
    key: 'organizationPlan',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => ({} as Plan),
  }),
  new FactorDbCol({
    key: 'ownerId',
    create: ({ schema, column }) =>
      schema
        .string(column.pgKey)
        .references(`factor_user.user_id`)
        .onUpdate('CASCADE'),
    default: () => '',
  }),

  new FactorDbCol({
    key: 'customerId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string | undefined,
  }),
  new FactorDbCol({
    key: 'customer',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    default: () => ({} as OrganizationCustomerData | undefined),
  }),
  new FactorDbCol({
    key: 'customerIdTest',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string | undefined,
  }),
  new FactorDbCol({
    key: 'customerTest',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    default: () => ({} as OrganizationCustomerData | undefined),
  }),
  new FactorDbCol({
    key: 'apiSecret',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isPrivate: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'timezone',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'dashboards',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isPrivate: true,
    default: () => ({} as Record<string, Dashboard | null>),
  }),
] as const

export const membersColumns = [
  new FactorDbCol({
    key: 'memberId',
    isComposite: true,
    create: ({ schema }) => {
      schema.primary(['user_id', 'organization_id'])
    },
    default: () => objectId(),
  }),
  new FactorDbCol({
    key: 'organizationId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey)
        .references(`factor_organization.organization_id`)
        .onUpdate('CASCADE')
        .index()
    },
    default: () => objectId(),
  }),
  new FactorDbCol({
    key: 'userId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey)
        .references(`factor_user.user_id`)
        .onUpdate('CASCADE')
        .index()
    },
    default: () => objectId(),
  }),
  new FactorDbCol({
    key: 'memberStatus',
    create: ({ schema, column }) =>
      schema.string(column.pgKey).notNullable().defaultTo('pending'),
    default: () => '' as ItemStatus,
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
    default: () => '',
  }),
  new FactorDbCol({
    key: 'invitedById',
    create: ({ schema, column }) =>
      schema.string(column.pgKey).references(`factor_user.user_id`),
    default: () => '',
  }),
  new FactorDbCol({
    key: 'priority',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    default: () => 0,
  }),
] as const

/**
 * Relation table for organization and user
 */
export const membersTable = new FactorDbTable({
  tableKey: 'factor_organization_user',
  timestamps: true,
  columns: membersColumns,
})

export const organizationTable = new FactorDbTable({
  tableKey: 'factor_organization',
  timestamps: true,
  columns: organizationColumns,
})

export const getAdminTables = () => [organizationTable, membersTable]
