import type { TableTaxonomyConfig } from '@fiction/core/plugin-user/types'
import { type ColType, type ListItem, type MediaObject, standardTable, type SyndicateStatus, type User } from '@fiction/core'
import { Col, FictionDbTable } from '@fiction/core/plugin-db'
import { z } from 'zod'

export const t = {
  subscribe: 'fiction_subscribe',
  subscribeTaxonomy: 'fiction_subscribe_taxonomy',
  ...standardTable,
}

export type Subscriber = Partial<TableSubscribeConfig> & {
  user?: User
  avatar?: MediaObject
}

export type TableSubscribeConfig = ColType<typeof subscribeColumns>

export type ImportDetail = {
  importId?: string
  importedAt?: string
  count?: number
  tags?: string[]
}

export const subscribeColumns = [
  new Col({ key: 'subscriptionId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('sub')`)).index() }),
  new Col({ key: 'userId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.user}.user_id`).onUpdate('CASCADE').index() }),
  new Col({ key: 'email', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).index() }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`${t.org}.orgId`).onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'level', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).defaultTo('standard') }),
  new Col({ key: 'status', sec: 'setting', sch: () => z.string() as z.Schema<SyndicateStatus>, make: ({ s, col }) => s.string(col.k, 50).defaultTo('active') }),
  new Col({ key: 'previousStatus', sch: () => z.string() as z.Schema<SyndicateStatus>, make: ({ s, col }) => s.string(col.k, 50).defaultTo('active') }),
  new Col({ key: 'tags', sec: 'setting', sch: () => z.array(z.string()), make: ({ s, col }) => s.specificType(col.k, 'text[]') }),
  new Col({ key: 'inlineUser', sec: 'setting', sch: () => z.record(z.unknown()).optional() as z.Schema<Partial<User>>, make: ({ s, col }) => s.jsonb(col.k), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'importDetail', sec: 'setting' as const, sch: () => z.record(z.unknown()).optional() as z.Schema<ImportDetail>, make: ({ s, col }) => s.jsonb(col.k), prepare: ({ value }) => JSON.stringify(value) }),
] as const

export const subscribeTaxonomyCols = [
  new Col({ key: 'subscriptionTaxonomyId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id()`)).index() }),
  new Col({ key: 'subscriptionId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.subscribe}.subscriptionId`).onDelete('CASCADE') }),
  new Col({ key: 'taxonomyId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.taxonomy}.taxonomyId`).onDelete('CASCADE') }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`${t.org}.org_id`).onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'priority', sch: () => z.number().int().optional(), make: ({ s, col }) => s.integer(col.k).defaultTo(0) }),
] as const

export const tables = [
  new FictionDbTable({
    tableKey: t.subscribe,
    timestamps: true,
    cols: subscribeColumns,
    onCreate: (t) => {
      t.unique(['user_id', 'org_id'])
      t.unique(['email', 'org_id'])
    },
  }),
  new FictionDbTable({ tableKey: t.subscribeTaxonomy, cols: subscribeTaxonomyCols, uniqueOn: ['subscription_id', 'taxonomy_id'] }),
]
