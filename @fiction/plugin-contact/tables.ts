import type { CreateObjectType } from '@fiction/core'
import { FactorDbCol, FactorDbTable } from '@fiction/core/plugin-db'

export const tableName = 'factor_submission'

export type TableSubmissionConfig = CreateObjectType<typeof submissionColumns>

const submissionColumns = [
  new FactorDbCol({
    key: 'submissionId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`object_id('sbmt')`))
    },
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'userId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`factor_user.user_id`)
        .onUpdate('CASCADE')
    },
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'notificationEmail',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'appName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'appUrl',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'name',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'email',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'orgName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'orgUrl',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'orgTitle',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'message',
    create: ({ schema, column }) => schema.string(column.pgKey, 2000),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'phone',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'twitter',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'github',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'linkedIn',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
] as const

export const table = new FactorDbTable({
  tableKey: tableName,
  timestamps: true,
  columns: submissionColumns,
})
