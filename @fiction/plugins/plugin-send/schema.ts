import { type CreateObjectType, type DataFilter, FictionDbCol, FictionDbTable, type PostStatus } from '@fiction/core'

import { standardTable } from '@fiction/core'
import type { TablePostConfig } from '@fiction/plugin-posts'
import { t as postTableNames } from '@fiction/plugin-posts'

export const t = {
  ...standardTable,
  ...postTableNames,
  send: 'fiction_email',
} as const

type EmailAnalyticsCounts = Partial<{
  sent: number
  delivered: number
  opened: number
  clicked: number
  bounced: number
  unsubscribed: number
  complaints: number
}>

export type TableEmailSend = CreateObjectType<typeof sendColumns>

export type EmailSendConfig = Partial<TableEmailSend> & { post?: TablePostConfig }

const sendColumns = [
  new FictionDbCol({
    key: 'emailId',
    create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`object_id('eml')`)).index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'userId',
    create: ({ schema, column }) => schema.string(column.pgKey).references(`${t.user}.user_id`).onUpdate('CASCADE').index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'orgId',
    create: ({ schema, column }) => schema.string(column.pgKey, 50).references(`${t.org}.orgId`).onUpdate('CASCADE').notNullable().index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'status',
    create: ({ schema, column }) => schema.string(column.pgKey, 50).defaultTo('active'),
    default: () => '' as PostStatus,
    zodSchema: ({ z }) => z.string(),
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'postId',
    create: ({ schema, column }) => schema.string(column.pgKey, 50).references(`${t.posts}.postId`).onUpdate('CASCADE').onDelete('CASCADE').notNullable().index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'sentAt',
    create: ({ schema, column }) => schema.timestamp(column.pgKey).defaultTo(null),
    default: () => '' as string,
    zodSchema: ({ z }) => z.date().nullable(),
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'scheduledAt',
    create: ({ schema, column }) => schema.timestamp(column.pgKey).defaultTo(null),
    default: () => '' as string,
    zodSchema: ({ z }) => z.date().nullable(),
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'filters',
    create: ({ schema, column }) => schema.jsonb(column.pgKey).defaultTo([]),
    default: () => ([] as DataFilter[]),
    zodSchema: ({ z }) => z.record(z.number()),
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'counts',
    create: ({ schema, column }) => schema.jsonb(column.pgKey).defaultTo({}),
    default: () => ({} as EmailAnalyticsCounts),
    zodSchema: ({ z }) => z.record(z.number()),
    isSetting: true,
  }),
] as const

export const tables = [
  new FictionDbTable({ tableKey: t.send, timestamps: true, columns: sendColumns }),
]
