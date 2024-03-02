import type { CreateObjectType } from '@fiction/core'
import { FictionDbCol, FictionDbTable } from '@fiction/core/plugin-db'

export const tableName = 'fiction_subscribe'

export type TableSubmissionConfig = CreateObjectType<typeof submissionColumns>

const submissionColumns = [
  new FictionDbCol({
    key: 'subscribeId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`object_id('subscribe')`))
    },
    default: () => '',
  }),
  new FictionDbCol({
    key: 'userId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`fiction_user.user_id`)
        .onUpdate('CASCADE')
    },
    default: () => '',
  }),
  new FictionDbCol({
    key: 'orgId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`fiction_org.org_id`)
        .onUpdate('CASCADE')
    },
    default: () => '',
  }),
  new FictionDbCol({
    key: 'email',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'isVerified',
    create: ({ schema, column }) =>
      schema.boolean(column.pgKey).defaultTo(false),
    default: () => false,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'subscriptionLevel',
    create: ({ schema, column }) =>
      schema.string(column.pgKey).defaultTo('none'),
    default: () => '' as 'full' | 'partial' | 'none',
  }),
] as const

export const table = new FictionDbTable({
  tableKey: tableName,
  timestamps: true,
  columns: submissionColumns,
})
