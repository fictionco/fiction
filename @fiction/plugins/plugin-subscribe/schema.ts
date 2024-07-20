import { type ColType, type ListItem, type MediaDisplayObject, type SyndicateStatus, type User, standardTable } from '@fiction/core'
import { Col, FictionDbTable } from '@fiction/core/plugin-db'
import type { TableTaxonomyConfig } from '@fiction/core/plugin-user/types'
import { z } from 'zod'

export const t = {
  subscribe: 'fiction_subscribe',
  subscribeTaxonomy: 'fiction_subscribe_taxonomy',
  ...standardTable,
}

export type Subscriber = Partial<TableSubscribeConfig> & {
  tags?: TableTaxonomyConfig[]
  user?: User
  avatar?: MediaDisplayObject
}

export type TableSubscribeConfig = ColType<typeof subscribeColumns>

export const subscribeColumns = [
  new Col({ key: 'subscriptionId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('sub')`)).index() }),
  new Col({ key: 'userId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.user}.user_id`).onUpdate('CASCADE').index() }),
  new Col({ key: 'email', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).index() }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`${t.org}.orgId`).onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'level', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).defaultTo('standard') }),
  new Col({ key: 'status', sec: 'setting', sch: () => z.string() as z.Schema<SyndicateStatus>, make: ({ s, col }) => s.string(col.k, 50).defaultTo('active') }),
  new Col({ key: 'previousStatus', sch: () => z.string() as z.Schema<SyndicateStatus>, make: ({ s, col }) => s.string(col.k, 50).defaultTo('active') }),
  new Col({ key: 'inlineTags', sec: 'setting', sch: () => z.array(z.record(z.unknown())) as z.Schema<ListItem[]>, make: ({ s, col }) => s.jsonb(col.k) }),
  new Col({ key: 'inlineUser', sec: 'setting', sch: () => z.record(z.unknown()).optional() as z.Schema<Partial<User>>, make: ({ s, col }) => s.jsonb(col.k) }),
] as const

export const subscribeTaxonomyCols = [
  new Col({ key: 'subscriptionTaxonomyId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id()`)).index() }),
  new Col({ key: 'subscriptionId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.subscribe}.subscriptionId`).onDelete('CASCADE') }),
  new Col({ key: 'taxonomyId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.taxonomy}.taxonomyId`).onDelete('CASCADE') }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`${t.org}.org_id`).onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'priority', sch: () => z.number().int().optional(), make: ({ s, col }) => s.integer(col.k).defaultTo(0) }),
] as const

// const subscribeColumns = [
//   new FictionDbCol({
//     key: 'subscriptionId',
//     create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`object_id('sub')`)).index(),
//     default: () => '' as string,
//     zodSchema: ({ z }) => z.string(),
//   }),
//   new FictionDbCol({
//     key: 'userId',
//     create: ({ schema, column }) => schema.string(column.pgKey).references(`${t.user}.user_id`).onUpdate('CASCADE').index(),
//     default: () => '' as string,
//     zodSchema: ({ z }) => z.string(),
//   }),
//   new FictionDbCol({
//     key: 'email',
//     create: ({ schema, column }) => schema.string(column.pgKey).index(),
//     default: () => '' as string,
//     zodSchema: ({ z }) => z.string(),
//   }),
//   new FictionDbCol({
//     key: 'orgId',
//     create: ({ schema, column }) => schema.string(column.pgKey, 50).references(`${t.org}.orgId`).onUpdate('CASCADE').notNullable().index(),
//     default: () => '' as string,
//     zodSchema: ({ z }) => z.string(),
//   }),
//   new FictionDbCol({
//     key: 'level',
//     create: ({ schema, column }) => schema.string(column.pgKey).defaultTo('standard'),
//     default: () => '' as string,
//     zodSchema: ({ z }) => z.string(),
//     isSetting: true,
//   }),
//   new FictionDbCol({
//     key: 'status',
//     create: ({ schema, column }) => schema.string(column.pgKey, 50).defaultTo('active'),
//     default: () => '' as SyndicateStatus,
//     zodSchema: ({ z }) => z.string(),
//     isSetting: true,
//   }),
//   new FictionDbCol({
//     key: 'previousStatus',
//     create: ({ schema, column }) => schema.string(column.pgKey, 50).defaultTo('active'),
//     default: () => '' as SyndicateStatus,
//     zodSchema: ({ z }) => z.string(),
//   }),
//   // jsonb array of markdown strings
//   new FictionDbCol({
//     key: 'inlineTags',
//     create: ({ schema, column }) => schema.jsonb(column.pgKey),
//     default: () => [] as ListItem[],
//     zodSchema: ({ z }) => z.array(z.string()).optional(),
//     isSetting: true,
//   }),
//   // publication user data overrides modifications that will be merged into subscriber user
//   new FictionDbCol({
//     key: 'inlineUser',
//     create: ({ schema, column }) => schema.jsonb(column.pgKey),
//     default: () => ({} as Partial<User>),
//     zodSchema: ({ z }) => z.record(z.unknown()).optional(),
//     isSetting: true,
//   }),
// ] as const

// const subscribeTaxonomyCols = [
//   new FictionDbCol({
//     key: 'subscriptionTaxonomyId',
//     create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`object_id()`)).index(),
//     default: () => '' as string,
//   }),
//   new FictionDbCol({
//     key: 'subscriptionId',
//     create: ({ schema, column }) => schema.string(column.pgKey).references(`${t.subscribe}.subscriptionId`).onDelete('CASCADE'),
//     default: () => '' as string,
//     zodSchema: ({ z }) => z.string(),
//   }),
//   new FictionDbCol({
//     key: 'taxonomyId',
//     create: ({ schema, column }) => schema.string(column.pgKey).references(`${t.taxonomy}.taxonomyId`).onDelete('CASCADE'),
//     default: () => '' as string,
//     zodSchema: ({ z }) => z.string(),
//   }),
//   new FictionDbCol({
//     key: 'orgId',
//     create: ({ schema, column }) => schema.string(column.pgKey, 50).references(`${t.org}.org_id`).onUpdate('CASCADE').notNullable().index(),
//     default: () => '' as string,
//     zodSchema: ({ z }) => z.string(),
//   }),
//   new FictionDbCol({
//     key: 'priority',
//     create: ({ schema, column }) => schema.integer(column.pgKey).defaultTo(0),
//     default: () => 0 as number,
//     zodSchema: ({ z }) => z.number().int().optional(),
//   }),
// ] as const

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
