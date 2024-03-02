import type { CreateObjectType } from '@fiction/core'
import { FactorDbCol, FactorDbTable } from '@fiction/core/plugin-db'

export const tableName = 'factor_subscribe'

export type TableSubmissionConfig = CreateObjectType<typeof submissionColumns>

const submissionColumns = [
  new FactorDbCol({
    key: 'subscribeId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`object_id('subscribe')`))
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'userId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`factor_user.user_id`)
        .onUpdate('CASCADE')
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'orgId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`factor_org.org_id`)
        .onUpdate('CASCADE')
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'email',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'isVerified',
    create: ({ schema, column }) =>
      schema.boolean(column.pgKey).defaultTo(false),
    default: () => false,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'subscriptionLevel',
    create: ({ schema, column }) =>
      schema.string(column.pgKey).defaultTo('none'),
    default: () => '' as 'full' | 'partial' | 'none',
  }),
] as const

export const table = new FactorDbTable({
  tableKey: tableName,
  timestamps: true,
  columns: submissionColumns,
})
