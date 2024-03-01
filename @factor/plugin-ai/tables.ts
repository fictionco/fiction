import type {
  User,
} from '@factor/api'
import {
  FactorDbCol,
  FactorDbTable,

} from '@factor/api'
import type { CreateObjectType } from '@factor/api/tbl'
import { standardTable } from '@factor/api/tbl'

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
  new FactorDbCol({
    key: 'sourceId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`object_id('so')`))
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'orgId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`${standardTable.org}.org_id`)
        .onUpdate('CASCADE')
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'userId',
    create: ({ schema, column }) => {
      schema.string(column.pgKey, 32).references(`factor_user.user_id`)
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'agentId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`${standardTable.agent}.agent_id`)
        .onUpdate('CASCADE')
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'sourceName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'sourceContent',
    create: ({ schema, column }) => schema.text(column.pgKey),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'sourceUrls',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    prepare: ({ value }) => JSON.stringify(value),
    default: () => ({} as { url: string, length: number }[]),
  }),
  new FactorDbCol({
    key: 'description',
    create: ({ schema, column }) => schema.string(column.pgKey, 10_000),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'sourceType',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as 'url' | 'file' | 'text' | 'sitemap',
  }),
] as const

export const tables = [

  new FactorDbTable({
    tableKey: standardTable.source,
    timestamps: true,
    columns: sourceTableColumns,
  }),

]
