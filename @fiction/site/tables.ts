import type { ColType, Organization } from '@fiction/core'
import type { CardGenerationConfig } from './generation.js'
import type { SiteGlobalUserConfig, SiteNav, StandardUserConfig } from './schema.js'
import type { EditorState } from './site.js'
import { createTableSchema, standardTable } from '@fiction/core'
import { Col, FictionDbTable } from '@fiction/core/plugin-db'
import { z } from 'zod/v4'

export const t = {
  sites: 'fiction_site',
  pages: 'fiction_site_pages',
  domains: 'fiction_site_domains',
  ...standardTable,
}

type st = { updatedAt?: string, createdAt?: string }

export const pageRegionIds = ['header', 'main', 'footer', 'aside', 'article', 'section'] as const
export type PageRegion = typeof pageRegionIds[number] | string

export type TableCardConfig<T extends Record<string, unknown> = Record<string, unknown>> = Omit<TablePageCardConfig, 'cards' | 'single' | 'userConfig' | 'draft'> & st & {
  parentId?: string
  depth?: number
  index?: number
  userConfig?: T & StandardUserConfig
  cards?: TableCardConfig[]
  single?: TableCardConfig
  draft?: CardConfigPortable
  scope?: string
  isSystem?: boolean
  isSingle?: boolean
  isArchive?: boolean
}

export type CardConfigPortable<T extends Record<string, unknown> = Record<string, unknown>> = Omit<Partial<TableCardConfig<T>>, 'cards'> & {
  cards?: CardConfigPortable[]
}

export const domainCols = [
  new Col({ key: 'domainId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('dmn')`)).index() }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.org}.org_id`).onDelete('CASCADE').onUpdate('CASCADE').index() }),
  new Col({ key: 'hostname', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).notNullable().index() }),
  new Col({ key: 'isPrimary', sec: 'setting', sch: () => z.boolean(), make: ({ s, col }) => s.boolean(col.k).defaultTo(false) }),
  new Col({ key: 'isVerified', sec: 'setting', sch: () => z.boolean(), make: ({ s, col }) => s.boolean(col.k).defaultTo(false) }),
] as const

export const TableDomainSchema = createTableSchema(domainCols)
export type TableDomainConfig = Partial<ColType<typeof domainCols>>

export const siteCols = [
  new Col({ key: 'siteId', sec: 'permanent', sch: () => z.string().min(1), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('site')`)).index() }),
  new Col({ key: 'userId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`fiction_user.user_id`) }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`fiction_org.org_id`).onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'title', sec: 'setting', sch: () => z.string().min(1), make: ({ s, col }) => s.string(col.k).defaultTo('') }),
  new Col({ key: 'themeId', sec: 'setting', sch: () => z.string().min(1), make: ({ s, col }) => s.string(col.k).notNullable() }),
  new Col({ key: 'isPrimary', sec: 'setting', sch: () => z.boolean(), make: ({ s, col }) => s.boolean(col.k).defaultTo(false) }),
  new Col({ key: 'subDomain', sec: 'setting', sch: () => z.string().min(1), make: ({ s, col, db }) => s.string(col.k).unique().notNullable().defaultTo(db.raw(`short_id(9)`)).index(), prepare: ({ value }) => (value).replaceAll(/[^\w-]+/g, '').toLowerCase() }),
  new Col({ key: 'handle', sec: 'setting', sch: () => z.string().min(1), make: ({ s, col, db }) => s.string(col.k).unique().notNullable().defaultTo(db.raw(`short_id(9)`)).index(), prepare: ({ value }) => (value).replaceAll(/[^\w-]+/g, '').toLowerCase() }),
  new Col({ key: 'status', sec: 'setting', sch: () => z.enum(['pending', 'active', 'inactive']), make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('pending') }),
  new Col({ key: 'userConfig', sec: 'setting', sch: () => z.record(z.string(), z.unknown()) as z.ZodType<SiteGlobalUserConfig & Record<string, unknown>>, make: ({ s, col }) => s.jsonb(col.k).defaultTo({}), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'userPrivate', sec: 'settingPrivate', sch: () => z.record(z.string(), z.unknown()), make: ({ s, col }) => s.jsonb(col.k).defaultTo({}), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'nav', sec: 'setting', sch: () => z.record(z.string(), z.unknown()) as z.ZodType<SiteNav>, make: ({ s, col }) => s.jsonb(col.k).defaultTo([]), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'editor', sec: 'setting', sch: () => z.record(z.string(), z.unknown()) as z.ZodType<Partial<EditorState>>, make: ({ s, col }) => s.jsonb(col.k).defaultTo({}), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'sections', sec: 'setting', sch: () => z.record(z.string(), z.unknown()) as z.ZodType<Record<string, CardConfigPortable>>, make: ({ s, col }) => s.jsonb(col.k).defaultTo({}), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'draft', sec: 'setting', sch: () => z.record(z.string(), z.unknown()), make: ({ s, col }) => s.jsonb(col.k).defaultTo({}), prepare: ({ value }) => JSON.stringify(value) }),
] as const

export const TableSiteSchema = createTableSchema(siteCols)

export type TableSiteConfig = Omit<ColType<typeof siteCols>, 'draft'> & st & {
  pages: CardConfigPortable[]
  draft?: TableSiteConfig
  org: Organization
}

export const pageCols = [
  new Col({ key: 'cardId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('card')`)).index() }),
  new Col({ key: 'siteId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`${t.sites}.site_id`).onDelete('CASCADE').onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'userId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`fiction_user.user_id`) }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`fiction_org.org_id`).onDelete('CASCADE').onUpdate('CASCADE').notNullable() }),
  new Col({ key: 'regionId', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('main') }),
  new Col({ key: 'layoutId', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('default') }),
  new Col({ key: 'templateId', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).notNullable() }),
  new Col({ key: 'pageTemplateId', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'slug', sec: 'setting', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).defaultTo(db.raw(`short_id(5)`)).index(), prepare: ({ value }) => (value).replaceAll(/\s+/g, '-').replaceAll(/[^\w-]+/g, '').toLowerCase() }),
  new Col({ key: 'title', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).defaultTo('') }),
  new Col({ key: 'description', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k).defaultTo('') }),
  new Col({ key: 'cards', sec: 'setting', sch: () => z.array(z.unknown()), make: ({ s, col }) => s.jsonb(col.k).defaultTo([]), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'userConfig', sec: 'setting', sch: () => z.record(z.string(), z.unknown()), make: ({ s, col }) => s.jsonb(col.k).defaultTo({}), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'isHome', sec: 'setting', sch: () => z.boolean(), make: ({ s, col }) => s.boolean(col.k).defaultTo(false) }),
  new Col({ key: 'nav', sec: 'setting', sch: () => z.enum(['show', 'hide']), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'editor', sec: 'setting', sch: () => z.record(z.string(), z.unknown()), make: ({ s, col }) => s.jsonb(col.k).defaultTo({}), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'generation', sec: 'setting', sch: () => z.record(z.string(), z.unknown()) as z.Schema<CardGenerationConfig>, make: ({ s, col }) => s.jsonb(col.k).defaultTo({}), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'draft', sec: 'setting', sch: () => z.record(z.string(), z.unknown()), make: ({ s, col }) => s.jsonb(col.k).defaultTo({}) }),
  new Col({ key: 'wordCount', sec: 'setting', sch: () => z.number(), make: ({ s, col }) => s.integer(col.k).defaultTo(0) }),
] as const

export const TablePageSchema = createTableSchema(pageCols)
export type TablePageCardConfig = z.infer<typeof TablePageSchema>

export const tables = [
  new FictionDbTable({
    tableKey: t.sites,
    timestamps: true,
    cols: siteCols,
  }),
  new FictionDbTable({
    tableKey: t.pages,
    timestamps: true,
    cols: pageCols,
    constraints: [{ type: 'unique', columns: ['site_id', 'slug'] }],
  }),
  new FictionDbTable({
    tableKey: t.domains,
    timestamps: true,
    cols: domainCols,
    constraints: [{ type: 'unique', columns: ['org_id', 'hostname'] }],
  }),
]
