import { validHost } from '@fiction/core'
import type { BackgroundDisplayObject, ColorScheme, CreateObjectType, MediaDisplayObject, ProgressStatus } from '@fiction/core'
import { FictionDbCol, FictionDbTable } from '@fiction/core/plugin-db'
import type { FontConfig } from '@fiction/core/utils/fonts.js'
import type { UiElementSize } from '@fiction/ui/utils.js'
import type { CardGenerationConfig } from './generation.js'
import type { EditorState } from './site.js'

export const tableNames = { sites: 'fiction_site', pages: 'fiction_site_pages', domains: 'fiction_site_domains' }

type st = { updatedAt?: string, createdAt?: string }

export const pageRegionIds = ['header', 'main', 'footer', 'aside', 'article', 'section'] as const
export type PageRegion = typeof pageRegionIds[number] | string

export type TableSiteConfig = CreateObjectType<typeof siteCols> & st & { pages: CardConfigPortable[] }

export type ThemeUiSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

export type SiteUserConfig = Partial<{
  favicon: MediaDisplayObject
  shareImage: MediaDisplayObject
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
  branding: {
    logo: MediaDisplayObject
  }
  seo: {
    title?: string
    description?: string
    keywords?: string
  }
  bg: BackgroundDisplayObject
}>

type TablePageCardConfig = Partial<CreateObjectType<typeof pageCols>>

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

export type TableDomainConfig = Partial<CreateObjectType<typeof domainCols>> & { hostname: string }

const siteCols = [
  new FictionDbCol({
    key: 'siteId',
    create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`object_id('site')`)).index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string().min(1),
  }),
  new FictionDbCol({
    key: 'userId',
    create: ({ schema, column }) => schema.string(column.pgKey, 50).references(`fiction_user.user_id`),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string().length(50),
  }),
  new FictionDbCol({
    key: 'orgId',
    create: ({ schema, column }) => schema.string(column.pgKey, 50).references(`fiction_org.org_id`).onUpdate('CASCADE').notNullable().index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string().length(50),
  }),
  new FictionDbCol({
    key: 'title',
    create: ({ schema, column }) => schema.string(column.pgKey).defaultTo(column.default()),
    default: () => '' as string,
    isSetting: true,
    zodSchema: ({ z }) => z.string().min(1),
  }),
  new FictionDbCol({
    key: 'themeId',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable(),
    default: () => '' as string,
    isSetting: true,
    zodSchema: ({ z }) => z.string().min(1),
  }),
  new FictionDbCol({
    key: 'subDomain',
    create: ({ schema, column, db }) => schema.string(column.pgKey).unique().notNullable().defaultTo(db.raw(`short_id(9)`)).index(),
    default: () => '' as string,
    isSetting: true,
    prepare: ({ value }) => (value).replaceAll(/[^\w-]+/g, '').toLowerCase(),
    zodSchema: ({ z }) => z.string().min(1), // Adapt the schema as needed
  }),
  new FictionDbCol({
    key: 'customDomains',
    create: ({ schema, column }) => schema.jsonb(column.pgKey).defaultTo(column.default()),
    prepare: ({ value }) => {
      const validated = (value || []).map(_ => ({ ..._, hostname: validHost(_.hostname) })).filter(_ => _.hostname)
      return JSON.stringify(validated)
    },
    default: () => ([] as Partial<TableDomainConfig>[]),
    isSetting: true,
    zodSchema: ({ z }) => z.array(z.any()),
  }),
  new FictionDbCol({
    key: 'status',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable().defaultTo(column.default()),
    default: () => 'pending' as ProgressStatus,
    zodSchema: ({ z }) => z.enum(['pending', 'active', 'inactive']), // Adapt the schema as needed
  }),
  new FictionDbCol({
    key: 'userConfig',
    create: ({ schema, column }) => schema.jsonb(column.pgKey).defaultTo({}),
    prepare: ({ value }) => JSON.stringify(value),
    isSetting: true,
    default: () => ({} as SiteUserConfig),
    zodSchema: ({ z }) => z.record(z.unknown()), // Adapt the schema as needed
  }),
  new FictionDbCol({
    key: 'editor',
    create: ({ schema, column }) => schema.jsonb(column.pgKey).defaultTo({}),
    prepare: ({ value }) => JSON.stringify(value),
    isSetting: true,
    default: () => ({} as EditorState),
    zodSchema: ({ z }) => z.record(z.unknown()), // Adapt the schema as needed
  }),
  new FictionDbCol({
    key: 'sections',
    create: ({ schema, column }) => schema.jsonb(column.pgKey).defaultTo({}),
    prepare: ({ value }) => JSON.stringify(value),
    isSetting: true,
    default: () => ({} as Record<string, CardConfigPortable>),
    zodSchema: ({ z }) => z.record(z.unknown()),
  }),
] as const

const pageCols = [
  new FictionDbCol({
    key: 'cardId',
    create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`object_id('card')`)).index(),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'siteId',
    create: ({ schema, column }) => schema.string(column.pgKey, 50).references(`${tableNames.sites}.site_id`).onUpdate('CASCADE').notNullable().index(),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'userId',
    create: ({ schema, column }) => {
      schema.string(column.pgKey, 50).references(`fiction_user.user_id`)
    },
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'orgId',
    create: ({ schema, column }) => schema.string(column.pgKey, 50).references(`fiction_org.org_id`).onUpdate('CASCADE').notNullable(),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'regionId',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable().defaultTo(column.default()),
    default: () => 'main' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'layoutId',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable().defaultTo(column.default()),
    default: () => 'default' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'templateId',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable(),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'slug',
    create: ({ schema, column, db }) => schema.string(column.pgKey).defaultTo(db.raw(`short_id(5)`)).index(),
    default: () => '' as string,
    isSetting: true,
    prepare: ({ value }) => (value).replaceAll(/\s+/g, '-').replaceAll(/[^\w-]+/g, '').toLowerCase(),
  }),

  new FictionDbCol({
    key: 'title',
    create: ({ schema, column }) => schema.string(column.pgKey).defaultTo(column.default()),
    default: () => '' as string,
    isSetting: true,
  }),

  new FictionDbCol({
    key: 'description',
    create: ({ schema, column }) => schema.text(column.pgKey).defaultTo(column.default()),
    default: () => '' as string,
    isSetting: true,
  }),

  new FictionDbCol({
    key: 'cards',
    create: ({ schema, column }) => schema.jsonb(column.pgKey).defaultTo(column.default()),
    prepare: ({ value }) => JSON.stringify(value),
    isSetting: true,
    default: () => ([]),
  }),
  new FictionDbCol({
    key: 'userConfig',
    create: ({ schema, column }) => schema.jsonb(column.pgKey).defaultTo(column.default()),
    prepare: ({ value }) => JSON.stringify(value),
    isSetting: true,
    default: () => ({} as Record<string, unknown>),
  }),
  new FictionDbCol({
    key: 'isHome',
    create: ({ schema, column }) => schema.boolean(column.pgKey).defaultTo(column.default()),
    isSetting: true,
    default: () => false as boolean,
  }),
  new FictionDbCol({
    key: 'is404',
    create: ({ schema, column }) => schema.boolean(column.pgKey).defaultTo(column.default()),
    isSetting: true,
    default: () => false as boolean,
  }),
  new FictionDbCol({
    key: 'editor',
    create: ({ schema, column }) => schema.jsonb(column.pgKey).defaultTo(column.default()),
    prepare: ({ value }) => JSON.stringify(value),
    isSetting: true,
    default: () => ({} as Record<string, unknown>),
  }),
  new FictionDbCol({
    key: 'generation',
    create: ({ schema, column }) => schema.jsonb(column.pgKey).defaultTo(column.default()),
    prepare: ({ value }) => JSON.stringify(value),
    isSetting: true,
    default: () => ({} as CardGenerationConfig),
  }),
] as const

const domainCols = [
  new FictionDbCol({
    key: 'domainId',
    create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`object_id('dmn')`)).index(),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'siteId',
    create: ({ schema, column }) => {
      schema.string(column.pgKey, 50).references(`${tableNames.sites}.site_id`).onUpdate('CASCADE').notNullable().index()
    },
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'hostname',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable().index(),
    isSetting: true,
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'isPrimary',
    create: ({ schema, column }) => schema.boolean(column.pgKey).defaultTo(column.default()),
    isSetting: true,
    default: () => false as boolean,
  }),
  new FictionDbCol({
    key: 'dnsValidationHostname',
    create: ({ schema, column }) => schema.string(column.pgKey).defaultTo(column.default()),
    isSetting: true,
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'dnsValidationTarget',
    create: ({ schema, column }) => schema.string(column.pgKey).defaultTo(column.default()),
    isSetting: true,
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'dnsValidationInstructions',
    create: ({ schema, column }) => schema.string(column.pgKey).defaultTo(column.default()),
    isSetting: true,
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'check',
    create: ({ schema, column }) => schema.string(column.pgKey).defaultTo(column.default()),
    isSetting: true,
    default: () => false as boolean,
  }),
  new FictionDbCol({
    key: 'configured',
    create: ({ schema, column }) => schema.string(column.pgKey).defaultTo(column.default()),
    isSetting: true,
    default: () => false as boolean,
  }),
  new FictionDbCol({
    key: 'certificateAuthority',
    create: ({ schema, column }) => schema.string(column.pgKey).defaultTo(column.default()),
    isSetting: true,
    default: () => '' as string,
  }),
] as const

export const tables = [
  new FictionDbTable({ tableKey: tableNames.sites, timestamps: true, columns: siteCols }),
  new FictionDbTable({ tableKey: tableNames.pages, timestamps: true, columns: pageCols, onCreate: t => t.unique(['site_id', 'slug']) }),
  new FictionDbTable({ tableKey: tableNames.domains, timestamps: true, columns: domainCols, onCreate: t => t.unique(['site_id', 'hostname']) }),
]
