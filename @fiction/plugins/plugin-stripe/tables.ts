import { Col, FictionDbTable } from '@fiction/core/plugin-db'
import { type ColType, standardTable } from '@fiction/core/tbl'
import { z } from 'zod'

export const tableNames = {
  usage: 'fiction_usage',
}

interface st { updatedAt?: string, createdAt?: string }

export type TableUsageConfig = ColType<typeof usageTableColumns> & st

export const usageTableColumns = [
  new Col({ key: 'usageId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('usage')`)) }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 32).notNullable().references(`${standardTable.org}.org_id`).onUpdate('CASCADE') }),
  new Col({ key: 'credits', sch: () => z.number().int(), make: ({ s, col }) => s.integer(col.k) }),
  new Col({ key: 'startedAt', sch: () => z.date(), make: ({ s, col }) => s.datetime(col.k) }),
  new Col({ key: 'endedAt', sch: () => z.date(), make: ({ s, col }) => s.datetime(col.k) }),
  new Col({ key: 'userId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 32).references(`${standardTable.user}.user_id`).onUpdate('CASCADE') }),
  new Col({ key: 'meta', sec: 'setting', sch: () => z.record(z.unknown()), make: ({ s, col }) => s.jsonb(col.k) }),
] as const

export const tables = [
  new FictionDbTable({ tableKey: standardTable.usage, timestamps: true, cols: usageTableColumns }),
]
