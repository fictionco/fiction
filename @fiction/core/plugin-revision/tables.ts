import type { ColType } from '../tbl.js'
import { z } from 'zod/v4'
import { Col, FictionDbTable } from '../plugin-db/objects.js'
import { standardTable as t } from '../tbl.js'

// Define supported revision types
export const revisionTypes = [
  'site',
  'page',
  'post',
  'form',
  'campaign',
  'brand',
] as const

export type RevisionType = typeof revisionTypes[number]

export const revisionCols = [
  new Col({ key: 'revisionId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('rev')`)).index() }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`fiction_org.org_id`).onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'userId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`fiction_user.user_id`).notNullable() }),
  new Col({ key: 'title', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).defaultTo('') }),
  new Col({ key: 'description', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k).defaultTo('') }),
  new Col({ key: 'version', sec: 'setting', sch: () => z.number(), make: ({ s, col }) => s.integer(col.k).defaultTo(1) }),
  new Col({ key: 'itemType', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).notNullable().index() }),
  new Col({ key: 'itemId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).notNullable().index() }),
  new Col({ key: 'itemData', sec: 'setting', sch: () => z.record(z.string(), z.unknown()), make: ({ s, col }) => s.jsonb(col.k).notNullable(), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'priority', sec: 'setting', sch: () => z.number(), make: ({ s, col }) => s.integer(col.k).defaultTo(0) }),
] as const

export type TableRevisionConfig = Partial<ColType<typeof revisionCols>> & { itemId: string, itemType: string, itemData: Record<string, unknown> }

export type FullRevisionConfig = TableRevisionConfig & { orgId: string, userId: string }

export const tables = [
  new FictionDbTable({
    tableKey: t.revisions,
    timestamps: true,
    cols: revisionCols,
  }),
]
