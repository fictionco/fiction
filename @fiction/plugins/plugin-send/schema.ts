import { type CreateObjectType, FictionDbCol, FictionDbTable, type PostStatus } from '@fiction/core'

import { standardTable } from '@fiction/core'
import type { TablePostConfig } from '@fiction/plugin-posts'

export const t = {
  ...standardTable,
  send: 'fiction_send',
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

export type TableSendConfig = CreateObjectType<typeof sendColumns>

export type SendConfig = Partial<TableSendConfig> & { post?: TablePostConfig }

const sendColumns = [
  new FictionDbCol({
    key: 'sendId',
    create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`object_id('sub')`)).index(),
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
    create: ({ schema, column }) => schema.string(column.pgKey, 50).references(`${t.org}.postId`).onUpdate('DELETE').notNullable().index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'sentAt',
    create: ({ schema, column }) => schema.timestamp(column.pgKey).defaultTo(null),
    default: () => '',
    zodSchema: ({ z }) => z.date().nullable(),
  }),
  new FictionDbCol({
    key: 'counts',
    create: ({ schema, column }) => schema.jsonb(column.pgKey).defaultTo({}),
    default: () => ({} as EmailAnalyticsCounts),
    zodSchema: ({ z }) => z.record(z.number()),
  }),
] as const

export const tables = [
  new FictionDbTable({
    tableKey: t.send,
    timestamps: true,
    columns: sendColumns,
  }),
]
