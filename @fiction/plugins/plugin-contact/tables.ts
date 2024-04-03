import type { CreateObjectType } from '@fiction/core'
import { FictionDbCol, FictionDbTable } from '@fiction/core/plugin-db'

export const tableName = 'fiction_submission'

export type TableSubmissionConfig = CreateObjectType<typeof submissionColumns>

const submissionColumns = [
  new FictionDbCol({
    key: 'submissionId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`object_id('sbmt')`))
    },
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'userId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`fiction_user.user_id`)
        .onUpdate('CASCADE')
    },
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'notificationEmail',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'appName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'appUrl',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'name',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'email',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'orgName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'orgUrl',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'orgTitle',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'message',
    create: ({ schema, column }) => schema.string(column.pgKey, 2000),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'phone',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'twitter',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'github',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'linkedIn',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
] as const

export const table = new FictionDbTable({
  tableKey: tableName,
  timestamps: true,
  columns: submissionColumns,
})
