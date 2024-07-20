import { validHost } from '@fiction/core'
import type { BackgroundDisplayObject, ColType, ColorScheme, MediaDisplayObject } from '@fiction/core'
import { Col, FictionDbTable } from '@fiction/core/plugin-db'
import { z } from 'zod'
import type { FontConfig } from './utils/fonts.js'
import type { CardGenerationConfig } from './generation.js'
import type { EditorState } from './site.js'

export const tableNames = { sites: 'fiction_site', pages: 'fiction_site_pages', domains: 'fiction_site_domains' }

type st = { updatedAt?: string, createdAt?: string }

export const pageRegionIds = ['header', 'main', 'footer', 'aside', 'article', 'section'] as const
export type PageRegion = typeof pageRegionIds[number] | string

export type TableSiteConfig = ColType<typeof siteCols> & st & { pages: CardConfigPortable[] }

export type ThemeUiSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

export type SiteUserConfig = Partial<{
  favicon: MediaDisplayObject
  shareImage: MediaDisplayObject
  branding: {
    logo: MediaDisplayObject
  }
  bg: BackgroundDisplayObject
  robotsTxt: string
  locale: string
  titleTemplate: string
  customCode: {
    gtmContainerId: string
  }
  ai: {
    baseInstruction?: string
    objectives?: { about?: string, targetCustomer?: string, imageStyle?: string }
  }
  isDarkMode?: boolean
  colors: {
    colorPrimary?: ColorScheme
    colorTheme?: ColorScheme
  }
  fonts: FontConfig
  spacing: {
    contentWidthClass?: string
    spacingClass?: string
    contentWidthSize?: ThemeUiSize
    spacingSize?: ThemeUiSize
    spacingSizeBottom?: ThemeUiSize
  }
  seo: {
    title?: string
    description?: string
    keywords?: string
  }
}>

type TablePageCardConfig = Partial<ColType<typeof pageCols>>

export type TableCardConfig<T extends Record<string, unknown> = Record<string, unknown> > = Omit<TablePageCardConfig, 'cards' | 'userConfig'> & st & {
  parentId?: string
  depth?: number
  index?: number
  userConfig?: T & SiteUserConfig
  cards?: TableCardConfig[]
  scope?: string
  isSystem?: boolean
}

export type CardConfigPortable<T extends Record<string, unknown> = Record<string, unknown>> = Omit<Partial<TableCardConfig<T>>, 'cards'> & {
  cards?: CardConfigPortable[]
}

export type TableDomainConfig = Partial<ColType<typeof domainCols>> & { hostname: string }

export const siteCols = [
  new Col({ key: 'siteId', sec: 'permanent', sch: () => z.string().min(1), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('site')`)).index() }),
  new Col({ key: 'userId', sec: 'permanent', sch: () => z.string().length(50), make: ({ s, col }) => s.string(col.k, 50).references(`fiction_user.user_id`) }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string().length(50), make: ({ s, col }) => s.string(col.k, 50).references(`fiction_org.org_id`).onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'title', sec: 'setting', sch: () => z.string().min(1), make: ({ s, col }) => s.string(col.k).defaultTo('') }),
  new Col({ key: 'themeId', sec: 'setting', sch: () => z.string().min(1), make: ({ s, col }) => s.string(col.k).notNullable() }),
  new Col({ key: 'subDomain', sec: 'setting', sch: () => z.string().min(1), make: ({ s, col, db }) => s.string(col.k).unique().notNullable().defaultTo(db.raw(`short_id(9)`)).index(), prepare: ({ value }) => (value).replaceAll(/[^\w-]+/g, '').toLowerCase() }),
  new Col({ key: 'customDomains', sec: 'setting', sch: () => z.array(z.any()), make: ({ s, col }) => s.jsonb(col.k).defaultTo([]), prepare: ({ value }) => JSON.stringify((value || []).map(_ => ({ ..._, hostname: validHost(_.hostname) })).filter(_ => _.hostname)) }),
  new Col({ key: 'status', sec: 'setting', sch: () => z.enum(['pending', 'active', 'inactive']), make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('pending') }),
  new Col({ key: 'userConfig', sec: 'setting', sch: () => z.record(z.unknown()) as z.Schema<SiteUserConfig>, make: ({ s, col }) => s.jsonb(col.k).defaultTo({}), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'userConfigPrivate', sec: 'setting', sch: () => z.record(z.unknown()), make: ({ s, col }) => s.jsonb(col.k).defaultTo({}), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'editor', sec: 'setting', sch: () => z.record(z.unknown()) as z.Schema<Partial<EditorState>>, make: ({ s, col }) => s.jsonb(col.k).defaultTo({}), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'sections', sec: 'setting', sch: () => z.record(z.unknown()) as z.Schema<Record<string, CardConfigPortable>>, make: ({ s, col }) => s.jsonb(col.k).defaultTo({}), prepare: ({ value }) => JSON.stringify(value) }),
] as const

export const pageCols = [
  new Col({ key: 'cardId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('card')`)).index() }),
  new Col({ key: 'siteId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`${tableNames.sites}.site_id`).onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'userId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`fiction_user.user_id`) }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`fiction_org.org_id`).onUpdate('CASCADE').notNullable() }),
  new Col({ key: 'regionId', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('main') }),
  new Col({ key: 'layoutId', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('default') }),
  new Col({ key: 'templateId', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).notNullable() }),
  new Col({ key: 'slug', sec: 'setting', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).defaultTo(db.raw(`short_id(5)`)).index(), prepare: ({ value }) => (value).replaceAll(/\s+/g, '-').replaceAll(/[^\w-]+/g, '').toLowerCase() }),
  new Col({ key: 'title', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).defaultTo('') }),
  new Col({ key: 'description', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k).defaultTo('') }),
  new Col({ key: 'cards', sec: 'setting', sch: () => z.array(z.unknown()), make: ({ s, col }) => s.jsonb(col.k).defaultTo([]), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'userConfig', sec: 'setting', sch: () => z.record(z.unknown()), make: ({ s, col }) => s.jsonb(col.k).defaultTo({}), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'isHome', sec: 'setting', sch: () => z.boolean(), make: ({ s, col }) => s.boolean(col.k).defaultTo(false) }),
  new Col({ key: 'is404', sec: 'setting', sch: () => z.boolean(), make: ({ s, col }) => s.boolean(col.k).defaultTo(false) }),
  new Col({ key: 'editor', sec: 'setting', sch: () => z.record(z.unknown()), make: ({ s, col }) => s.jsonb(col.k).defaultTo({}), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'generation', sec: 'setting', sch: () => z.record(z.unknown()) as z.Schema<CardGenerationConfig>, make: ({ s, col }) => s.jsonb(col.k).defaultTo({}), prepare: ({ value }) => JSON.stringify(value) }),
] as const

export const domainCols = [
  new Col({ key: 'domainId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('dmn')`)).index() }),
  new Col({ key: 'siteId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`${tableNames.sites}.site_id`).onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'hostname', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k).notNullable().index() }),
  new Col({ key: 'isPrimary', sec: 'setting', sch: ({ z }) => z.boolean(), make: ({ s, col }) => s.boolean(col.k).defaultTo(false) }),
  new Col({ key: 'dnsValidationHostname', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k).defaultTo('') }),
  new Col({ key: 'dnsValidationTarget', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k).defaultTo('') }),
  new Col({ key: 'dnsValidationInstructions', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k).defaultTo('') }),
  new Col({ key: 'check', sec: 'setting', sch: ({ z }) => z.boolean(), make: ({ s, col }) => s.string(col.k).defaultTo(false) }),
  new Col({ key: 'configured', sec: 'setting', sch: ({ z }) => z.boolean(), make: ({ s, col }) => s.string(col.k).defaultTo(false) }),
  new Col({ key: 'certificateAuthority', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k).defaultTo('') }),
] as const

export const tables = [
  new FictionDbTable({ tableKey: tableNames.sites, timestamps: true, cols: siteCols }),
  new FictionDbTable({ tableKey: tableNames.pages, timestamps: true, cols: pageCols, onCreate: t => t.unique(['site_id', 'slug']) }),
  new FictionDbTable({ tableKey: tableNames.domains, timestamps: true, cols: domainCols, onCreate: t => t.unique(['site_id', 'hostname']) }),
]
