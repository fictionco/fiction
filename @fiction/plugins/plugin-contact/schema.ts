import type { ColType, MediaObject, SyndicateStatus, User } from '@fiction/core'
import { standardTable } from '@fiction/core'
import { Col, FictionDbTable } from '@fiction/core/plugin-db'
import { z } from 'zod/v4'

export const t = {
  contact: 'fiction_contact',
  ...standardTable,
}

export type Contact = Partial<TableContactConfig> & {
  user?: User
  avatar?: MediaObject
}

export type TableContactConfig = ColType<typeof contactColumns>

export type ImportDetail = {
  importId?: string
  importedAt?: string
  tags?: string[]
  count?: number
}

export const SourceCategorySchema = z.enum(['', 'site', 'list', 'invited', 'import', 'manual', 'api', 'other'])

export const contactColumns = [
  new Col({ key: 'contactId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('sub')`)).index() }),
  new Col({ key: 'userId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.user}.user_id`).onUpdate('CASCADE').index() }),
  new Col({ key: 'email', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).index() }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`${t.org}.orgId`).onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'level', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).defaultTo('standard') }),
  new Col({ key: 'status', sec: 'setting', sch: () => z.string() as z.Schema<SyndicateStatus>, make: ({ s, col }) => s.string(col.k, 50).defaultTo('active') }),
  new Col({ key: 'previousStatus', sch: () => z.string() as z.Schema<SyndicateStatus>, make: ({ s, col }) => s.string(col.k, 50).defaultTo('active') }),
  new Col({ key: 'tags', sec: 'setting', sch: () => z.array(z.string()), make: ({ s, col }) => s.specificType(col.k, 'text[]') }),
  new Col({ key: 'sourceCategory', sec: 'setting', sch: () => SourceCategorySchema, make: ({ s, col }) => s.string(col.k).defaultTo('') }),
  new Col({ key: 'sourceId', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).defaultTo('') }),
  new Col({ key: 'inlineUser', sec: 'setting', sch: () => z.record(z.string(), z.unknown()).optional() as z.Schema<Partial<User>>, make: ({ s, col }) => s.jsonb(col.k), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'importDetail', sec: 'setting' as const, sch: () => z.record(z.string(), z.unknown()).optional() as z.Schema<ImportDetail>, make: ({ s, col }) => s.jsonb(col.k), prepare: ({ value }) => JSON.stringify(value) }),
] as const

export const tables = [
  new FictionDbTable({
    tableKey: t.contact,
    timestamps: true,
    cols: contactColumns,
    constraints: [
      { type: 'unique', columns: ['userId', 'orgId'] },
      { type: 'unique', columns: ['email', 'orgId'] },
    ],
  }),

]
