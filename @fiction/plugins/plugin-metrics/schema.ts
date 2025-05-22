import type { ColType } from '@fiction/core'
import { standardTable } from '@fiction/core'
import { Col, FictionDbTable } from '@fiction/core/plugin-db'
import { z } from 'zod/v4'

export const t = {
  metrics: 'fiction_metrics',
  ...standardTable,
}

const MetricNameEnum = z.enum(['pageView', 'click', 'conversion', 'purchase'])

export type TableMetricConfig = Partial<ColType<typeof metricColumns>>

export const metricColumns = [
  new Col({ key: 'snapshotId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('snp')`)).index() }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.org}.org_id`).onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'metric', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).notNullable().index() }),
  new Col({ key: 'timestamp', sch: () => z.number(), make: ({ s, col }) => s.timestamp(col.k).notNullable().index() }),
  new Col({ key: 'count', sch: () => z.number(), make: ({ s, col }) => s.decimal(col.k, 20, 2).notNullable() }),
  new Col({ key: 'handling', sch: () => z.enum(['snapshot', 'increment']), make: ({ s, col }) => s.string(col.k, 10) }),
] as const

export const tables = [
  new FictionDbTable({ tableKey: t.metrics, timestamps: true, cols: metricColumns }),
]
