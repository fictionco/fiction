import type {
  User,
} from '@fiction/core'
import {
  FictionDbCol,
  FictionDbTable,

} from '@fiction/core'
import type { CreateObjectType } from '@fiction/core/tbl'
import { standardTable } from '@fiction/core/tbl'

export type TableSourceConfig = CreateObjectType<typeof sourceTableColumns> &
  {
    author?: User
  }

export type SourceItemMetaData = {
  type?: 'url' | 'file' | 'text' | 'sitemap'
  key?: string
  name?: string
  url?: string
  length?: number
  orgId?: string
  userId?: string
  title?: string
  description?: string
  image?: string
  icon?: string
}

export interface SourceItem {
  pageContent?: string
  metadata: SourceItemMetaData
}

export const sourceTableColumns = [
  new FictionDbCol({
    key: 'sourceId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`object_id('so')`))
    },
    default: () => '',
  }),
  new FictionDbCol({
    key: 'orgId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`${standardTable.org}.org_id`)
        .onUpdate('CASCADE')
    },
    default: () => '',
  }),
  new FictionDbCol({
    key: 'userId',
    create: ({ schema, column }) => {
      schema.string(column.pgKey, 32).references(`fiction_user.user_id`)
    },
    default: () => '',
  }),
  new FictionDbCol({
    key: 'agentId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`${standardTable.agent}.agent_id`)
        .onUpdate('CASCADE')
    },
    default: () => '',
  }),
  new FictionDbCol({
    key: 'sourceName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '',
  }),
  new FictionDbCol({
    key: 'sourceContent',
    create: ({ schema, column }) => schema.text(column.pgKey),
    isSetting: true,
    default: () => '',
  }),
  new FictionDbCol({
    key: 'sourceUrls',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    prepare: ({ value }) => JSON.stringify(value),
    default: () => ({} as { url: string, length: number }[]),
  }),
  new FictionDbCol({
    key: 'description',
    create: ({ schema, column }) => schema.string(column.pgKey, 10_000),
    isSetting: true,
    default: () => '',
  }),
  new FictionDbCol({
    key: 'sourceType',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as 'url' | 'file' | 'text' | 'sitemap',
  }),
] as const

export const tables = [

  new FictionDbTable({
    tableKey: standardTable.source,
    timestamps: true,
    columns: sourceTableColumns,
  }),

]
