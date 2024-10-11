import type { ColType, TableTaxonomyConfig, User } from '@fiction/core'
import type { TableSiteConfig } from '@fiction/site'
import type { SiteUserConfig } from '@fiction/site/schema'
import { MediaDisplaySchema, PostStatusSchema, standardTable, toSlug } from '@fiction/core'
import { Col, FictionDbTable } from '@fiction/core/plugin-db'
import { z } from 'zod'

export const t = {
  posts: 'fiction_post',
  postTaxonomies: 'fiction_post_taxonomy',
  postAuthor: 'fiction_post_author',
  postSite: 'fiction_post_site',
  ...standardTable,
}

export type TablePostConfig = Partial<ColType<typeof postCols>> & {
  authors?: User[]
  sites?: Partial<TableSiteConfig>[]
  taxonomy?: TableTaxonomyConfig[]
  tags?: TableTaxonomyConfig[]
  categories?: TableTaxonomyConfig[]
  draftId?: string
}

export type PostUserConfig = {
  isContentCompletionDisabled?: boolean
} & SiteUserConfig

export type PostDraft = Partial<{ draftId: string, title: string, content: string, userConfig: PostUserConfig, createdAt: string, updatedAt: string }>

export const postCols = [
  new Col({ key: 'postId', sec: 'permanent', sch: () => z.string().min(1), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('pst')`)).index() }),
  new Col({ key: 'userId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`fiction_user.user_id`).onDelete('SET NULL').onUpdate('CASCADE').index() }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`fiction_org.org_id`).onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'slug', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).index(), prepare: ({ value }) => toSlug(value) }),
  new Col({ key: 'type', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('post') }),
  new Col({ key: 'title', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k).defaultTo('') }),
  new Col({ key: 'subTitle', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k).defaultTo('') }),
  new Col({ key: 'excerpt', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k).defaultTo('') }),
  new Col({ key: 'content', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k).defaultTo('') }),
  new Col({ key: 'media', sec: 'setting', sch: () => MediaDisplaySchema, make: ({ s, col }) => s.jsonb(col.k).defaultTo({}) }),
  new Col({ key: 'status', sec: 'setting', sch: () => PostStatusSchema, make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('draft') }),
  new Col({ key: 'userConfig', sec: 'setting', sch: () => z.record(z.unknown()) as z.Schema<PostUserConfig>, make: ({ s, col }) => s.jsonb(col.k).defaultTo({}) }),
  new Col({ key: 'isSyndicated', sec: 'setting', sch: () => z.boolean(), make: ({ s, col }) => s.boolean(col.k).defaultTo(false) }),
  new Col({ key: 'hasChanges', sec: 'setting', sch: () => z.boolean(), make: ({ s, col }) => s.boolean(col.k).defaultTo(false) }),
  new Col({ key: 'publishAt', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.timestamp(col.k) }),
  new Col({ key: 'dateAt', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.timestamp(col.k) }),
  new Col({ key: 'draft', sec: 'setting', sch: () => z.record(z.unknown()), make: ({ s, col }) => s.jsonb(col.k).defaultTo({}), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'archiveAt', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.timestamp(col.k) }),
] as const

export const postTaxonomyCols = [
  new Col({ key: 'postTaxonomyId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id()`)) }),
  new Col({ key: 'postId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.posts}.postId`).onDelete('CASCADE') }),
  new Col({ key: 'taxonomyId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.taxonomy}.taxonomyId`).onDelete('CASCADE') }),
  new Col({ key: 'orgId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`${t.org}.org_id`).onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'priority', sch: ({ z }) => z.number().int().optional(), make: ({ s, col }) => s.integer(col.k).defaultTo(0) }),
] as const

export const postAuthorCols = [
  new Col({ key: 'postAuthorId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id()`)) }),
  new Col({ key: 'postId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.posts}.postId`).onDelete('CASCADE') }),
  new Col({ key: 'userId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.user}.userId`).onDelete('CASCADE') }),
  new Col({ key: 'orgId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`${t.org}.orgId`).onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'priority', sch: ({ z }) => z.number().int().optional(), make: ({ s, col }) => s.integer(col.k).defaultTo(0) }),
] as const

export const postSiteCols = [
  new Col({ key: 'postSiteId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id()`)) }),
  new Col({ key: 'postId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.posts}.postId`).onDelete('CASCADE') }),
  new Col({ key: 'siteId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.site}.siteId`).onDelete('CASCADE') }),
  new Col({ key: 'orgId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`${t.org}.orgId`).onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'priority', sch: ({ z }) => z.number().int().optional(), make: ({ s, col }) => s.integer(col.k).defaultTo(0) }),
] as const

export const tables = [
  new FictionDbTable({ tableKey: t.posts, cols: postCols }),
  new FictionDbTable({ tableKey: t.postTaxonomies, cols: postTaxonomyCols, uniqueOn: ['post_id', 'taxonomy_id'] }),
  new FictionDbTable({ tableKey: t.postAuthor, cols: postAuthorCols, uniqueOn: ['post_id', 'user_id'] }),
  new FictionDbTable({ tableKey: t.postSite, cols: postSiteCols, uniqueOn: ['post_id', 'site_id'] }),
]
