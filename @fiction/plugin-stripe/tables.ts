import { FictionDbCol, FictionDbTable } from '@fiction/core/plugin-db'

import type { CreateObjectType } from '@fiction/core/tbl'
import { standardTable } from '@fiction/core/tbl'

interface st { updatedAt?: string, createdAt?: string }

export type TableUsageConfig = CreateObjectType<typeof usageTableColumns> & st

export const usageTableColumns = [
  new FictionDbCol({
    key: 'usageId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`object_id('usage')`))
    },
    default: () => '',
  }),
  new FictionDbCol({
    key: 'orgId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .notNullable()
        .references(`${standardTable.org}.org_id`)
        .onUpdate('CASCADE')
    },
    default: () => '',
  }),
  new FictionDbCol({
    key: 'credits',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    default: () => 0,
  }),
  new FictionDbCol({
    key: 'startedAt',
    create: ({ schema, column }) => schema.datetime(column.pgKey),
    default: () => 0,
  }),
  new FictionDbCol({
    key: 'endedAt',
    create: ({ schema, column }) => schema.datetime(column.pgKey),
    default: () => 0,
  }),
  new FictionDbCol({
    key: 'userId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`${standardTable.user}.user_id`)
        .onUpdate('CASCADE')
    },
    default: () => '',
  }),
  new FictionDbCol({
    key: 'meta',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    default: () => ({}),
  }),
] as const

export const tables = [
  new FictionDbTable({
    tableKey: standardTable.usage,
    timestamps: true,
    columns: usageTableColumns,
  }),
]
