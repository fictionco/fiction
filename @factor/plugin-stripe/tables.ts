import { FactorDbCol, FactorDbTable } from '@factor/api/plugin-db'

import type { CreateObjectType } from '@factor/api/tbl'
import { standardTable } from '@factor/api/tbl'

interface st { updatedAt?: string, createdAt?: string }

export type TableUsageConfig = CreateObjectType<typeof usageTableColumns> & st

export const usageTableColumns = [
  new FactorDbCol({
    key: 'usageId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`object_id('usage')`))
    },
    default: () => '',
  }),
  new FactorDbCol({
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
  new FactorDbCol({
    key: 'credits',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    default: () => 0,
  }),
  new FactorDbCol({
    key: 'startedAt',
    create: ({ schema, column }) => schema.datetime(column.pgKey),
    default: () => 0,
  }),
  new FactorDbCol({
    key: 'endedAt',
    create: ({ schema, column }) => schema.datetime(column.pgKey),
    default: () => 0,
  }),
  new FactorDbCol({
    key: 'userId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`${standardTable.user}.user_id`)
        .onUpdate('CASCADE')
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'meta',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    default: () => ({}),
  }),
] as const

export const tables = [
  new FactorDbTable({
    tableKey: standardTable.usage,
    timestamps: true,
    columns: usageTableColumns,
  }),
]
