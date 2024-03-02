import type { CreateObjectType, ProgressStatus } from '@fiction/core'
import { FictionDbCol, FictionDbTable } from '@fiction/core/plugin-db'
import type { EditorState } from './site'

export const tableNames = { sites: 'fiction_site', pages: 'fiction_site_pages', domains: 'fiction_site_domains' }

type st = { updatedAt?: string, createdAt?: string }

export const pageRegionIds = ['header', 'main', 'footer', 'aside', 'article', 'section'] as const
export type PageRegion = typeof pageRegionIds[number] | string

export type TableSiteConfig = CreateObjectType<typeof siteCols> & st & { pages: Partial<TableCardConfig>[] }

export type SiteUserConfig = Partial<{
  faviconUrl: string
  robotsTxt: string
  locale: string
  baseInstruction: string
  objectives: Record<string, string>
  isDarkMode: boolean
}>

export type TableCardConfig<T extends Record<string, unknown> = Record<string, unknown> > = Omit<CreateObjectType<typeof pageCols>, 'cards' | 'userConfig'> & st & {
  parentId?: string
  depth?: number
  index?: number
  userConfig?: T
  cards?: TableCardConfig[]
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
    prepare: ({ value }) => (value as string).replaceAll(/[^\dA-Za-z-_]+/g, '').toLowerCase(),
    zodSchema: ({ z }) => z.string().min(1), // Adapt the schema as needed
  }),
  new FictionDbCol({
    key: 'customDomains',
    create: ({ schema, column }) => schema.jsonb(column.pgKey).defaultTo(column.default()),
    prepare: ({ value }) => JSON.stringify(value),
    default: () => ([] as Partial<TableDomainConfig>[]),
    isSetting: true,
    zodSchema: ({ z }) => z.array(z.any()), // Adapt the schema as needed
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
    prepare: ({ value }) => (value as string).replaceAll(/[\s]+/g, '-').replaceAll(/[^\dA-Za-z-_]+/g, '').toLowerCase(),
  }),

  new FictionDbCol({
    key: 'title',
    create: ({ schema, column }) => schema.string(column.pgKey).defaultTo(column.default()),
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
    key: 'isDefault',
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
  // new FictionDbCol({
  //   key: 'editor',
  //   create: ({ schema, column }) => schema.jsonb(column.pgKey).defaultTo(column.default()),
  //   prepare: ({ value }) => JSON.stringify(value),
  //   isSetting: true,
  //   default: () => ({} as Record<string, unknown>),
  // }),
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
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable(),
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
    create: ({ schema, column }) => schema.string(column.pgKey).defaultTo(column.default),
    isSetting: true,
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'dnsValidationTarget',
    create: ({ schema, column }) => schema.string(column.pgKey).defaultTo(column.default),
    isSetting: true,
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'isConfigured',
    create: ({ schema, column }) => schema.string(column.pgKey).defaultTo(column.default),
    isSetting: true,
    default: () => false as boolean,
  }),
  new FictionDbCol({
    key: 'certificateAuthority',
    create: ({ schema, column }) => schema.string(column.pgKey).defaultTo(column.default),
    isSetting: true,
    default: () => '' as string,
  }),
] as const

export const tables = [
  new FictionDbTable({ tableKey: tableNames.sites, timestamps: true, columns: siteCols }),
  new FictionDbTable({ tableKey: tableNames.pages, timestamps: true, columns: pageCols, onCreate: t => t.unique(['site_id', 'slug', 'region_id']) }),
  new FictionDbTable({ tableKey: tableNames.domains, timestamps: true, columns: domainCols }),
]