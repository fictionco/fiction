import { type CreateObjectType, type MediaDisplayObject, type PostStatus, type User, standardTable, toSlug } from '@fiction/core'
import { FictionDbCol, FictionDbTable } from '@fiction/core/plugin-db'
import type { TableSiteConfig } from '@fiction/site'

export const t = {
  posts: 'fiction_post',
  taxonomies: 'fiction_taxonomy',
  postTaxonomies: 'fiction_post_taxonomy',
  postAuthor: 'fiction_post_author',
  postSite: 'fiction_post_site',
  ...standardTable,
}

type PostUserConfig = Record<string, any>
type PostMeta = { seoTitle: string, seoDescription: string, seoKeywords: string }

export type TablePostConfig = Partial<CreateObjectType<typeof postCols>> & {
  authors?: User[]
  sites?: Partial<TableSiteConfig>[]
  taxonomy?: TableTaxonomyConfig[]
  tags?: TableTaxonomyConfig[]
  categories: TableTaxonomyConfig[]
  draftId?: string
}
export type TableTaxonomyConfig = Partial<CreateObjectType<typeof taxonomyCols>> & { isNew?: boolean, usageCount?: number }

export type PostDraft = Partial<{ draftId: string, title: string, content: string, userConfig: PostUserConfig, createdAt: string, updatedAt: string }>

const postCols = [
  new FictionDbCol({
    key: 'postId',
    create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`object_id('pst')`)).index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string().min(1),
  }),
  new FictionDbCol({
    key: 'userId',
    create: ({ schema, column }) => schema.string(column.pgKey, 50).references(`fiction_user.user_id`).onDelete('SET NULL').onUpdate('CASCADE').index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'orgId',
    create: ({ schema, column }) => schema.string(column.pgKey, 50).references(`fiction_org.org_id`).onUpdate('CASCADE').notNullable().index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'slug',
    create: ({ schema, column }) => schema.string(column.pgKey).index(),
    default: () => '' as string,
    isSetting: true,
    prepare: ({ value }) => toSlug(value),
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'type',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable().defaultTo('post'),
    default: () => 'post' as string,
    isSetting: true,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'title',
    create: ({ schema, column }) => schema.text(column.pgKey).defaultTo(column.default()),
    default: () => '' as string,
    isSetting: true,
    zodSchema: ({ z }) => z.string().min(1),
  }),
  new FictionDbCol({
    key: 'subTitle',
    create: ({ schema, column }) => schema.text(column.pgKey).defaultTo(column.default()),
    default: () => '' as string,
    isSetting: true,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'excerpt',
    create: ({ schema, column }) => schema.text(column.pgKey).defaultTo(column.default()),
    default: () => '' as string,
    isSetting: true,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'content',
    create: ({ schema, column }) => schema.text(column.pgKey).defaultTo(column.default()),
    default: () => '' as string,
    isSetting: true,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'image',
    create: ({ schema, column }) => schema.jsonb(column.pgKey).defaultTo(column.default()),
    default: () => ({} as MediaDisplayObject),
    // prepare: ({ value }) => JSON.stringify(value),
    isSetting: true,
    zodSchema: ({ z }) => z.record(z.unknown()),
  }),
  new FictionDbCol({
    key: 'status',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable().defaultTo(column.default()),
    default: () => 'draft' as PostStatus,
    isSetting: true,
    zodSchema: ({ z }) => z.enum(['draft', 'published', 'hidden', 'protected']),
  }),
  new FictionDbCol({
    key: 'userConfig',
    create: ({ schema, column }) => schema.jsonb(column.pgKey).defaultTo(column.default()),
    // prepare: ({ value }) => JSON.stringify(value),
    isSetting: true,
    default: () => ({} as PostUserConfig),
    zodSchema: ({ z }) => z.record(z.unknown()),
  }),
  new FictionDbCol({
    key: 'isSyndicated',
    create: ({ schema, column }) => schema.boolean(column.pgKey).defaultTo(column.default()),
    default: () => false as boolean,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'hasChanges',
    create: ({ schema, column }) => schema.boolean(column.pgKey).defaultTo(column.default()),
    default: () => false as boolean,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'publishAt',
    create: ({ schema, column }) => schema.timestamp(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'dateAt',
    create: ({ schema, column }) => schema.timestamp(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'draft',
    create: ({ schema, column }) => schema.jsonb(column.pgKey).defaultTo(column.default()),
    prepare: ({ value }) => JSON.stringify(value),
    isSetting: true,
    default: () => ({} as PostDraft),
    zodSchema: ({ z }) => z.record(z.unknown()),
  }),
  new FictionDbCol({
    key: 'draftHistory',
    create: ({ schema, column }) => schema.jsonb(column.pgKey).defaultTo(column.default()),
    // prepare: ({ value }) => JSON.stringify(value),
    isSetting: true,
    default: () => ([] as PostDraft[]),
    zodSchema: ({ z }) => z.array(z.record(z.unknown())),
  }),
  new FictionDbCol({
    key: 'archiveAt',
    create: ({ schema, column }) => schema.timestamp(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'meta',
    create: ({ schema, column }) => schema.jsonb(column.pgKey).defaultTo(column.default()),
    // prepare: ({ value }) => JSON.stringify(value),
    isSetting: true,
    default: () => ({} as PostMeta),
    zodSchema: ({ z }) => z.record(z.unknown()),
  }),
] as const

// Taxonomy table columns
const taxonomyCols = [
  new FictionDbCol({
    key: 'taxonomyId',
    create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`object_id('tax')`)),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string().min(1),
  }),
  new FictionDbCol({
    key: 'userId',
    create: ({ schema, column }) => schema.string(column.pgKey, 50).references(`fiction_user.user_id`).onDelete('SET NULL').onUpdate('CASCADE').index(),
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
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string().min(1),
  }),
  new FictionDbCol({
    key: 'slug',
    create: ({ schema, column }) => schema.string(column.pgKey).index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string().min(1),
  }),
  new FictionDbCol({
    key: 'priority',
    create: ({ schema, column }) => schema.string(column.pgKey).index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string().min(1),
  }),
  new FictionDbCol({
    key: 'type',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable().index(),
    default: () => '' as 'tag' | 'category',
    zodSchema: ({ z }) => z.enum(['tag', 'category']),
  }),
  new FictionDbCol({
    key: 'description',
    create: ({ schema, column }) => schema.text(column.pgKey),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string().optional(),
  }),
  new FictionDbCol({
    key: 'parentId',
    create: ({ schema, column }) => schema.string(column.pgKey).references(`${t.taxonomies}.taxonomy_id`).onDelete('SET NULL'),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string().optional(),
  }),
  new FictionDbCol({
    key: 'priority',
    create: ({ schema, column }) => schema.integer(column.pgKey).defaultTo(0),
    default: () => 0 as number,
    zodSchema: ({ z }) => z.number().int().optional(),
  }),
  new FictionDbCol({
    key: 'meta',
    create: ({ schema, column }) => schema.jsonb(column.pgKey).defaultTo(column.default()),
    prepare: ({ value }) => JSON.stringify(value),
    default: () => ({} as Record<string, any>),
    zodSchema: ({ z }) => z.record(z.unknown()),
  }),

] as const

// Post-Taxonomies join table columns
const postTaxonomyCols = [
  new FictionDbCol({
    key: 'postTaxonomyId',
    isComposite: true,
    create: ({ schema }) => schema.primary(['post_id', 'taxonomy_id']),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'postId',
    create: ({ schema, column }) => schema.string(column.pgKey).references(`${t.posts}.postId`).onDelete('CASCADE'),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'taxonomyId',
    create: ({ schema, column }) => schema.string(column.pgKey).references(`${t.taxonomies}.taxonomyId`).onDelete('CASCADE'),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'orgId',
    create: ({ schema, column }) => schema.string(column.pgKey, 50).references(`${t.org}.org_id`).onUpdate('CASCADE').notNullable().index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
] as const

// Post-Author join table columns
const postAuthorCols = [
  new FictionDbCol({
    key: 'postAuthorId',
    isComposite: true,
    create: ({ schema }) => schema.primary(['post_id', 'user_id']),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'postId',
    create: ({ schema, column }) => schema.string(column.pgKey).references(`${t.posts}.postId`).onDelete('CASCADE'),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'userId',
    create: ({ schema, column }) => schema.string(column.pgKey).references(`${t.user}.userId`).onDelete('CASCADE'),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'orgId',
    create: ({ schema, column }) => schema.string(column.pgKey, 50).references(`${t.org}.orgId`).onUpdate('CASCADE').notNullable().index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
] as const

const postSiteCols = [
  new FictionDbCol({
    key: 'postSiteId',
    isComposite: true,
    create: ({ schema }) => schema.primary(['post_id', 'site_id']),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'postId',
    create: ({ schema, column }) => schema.string(column.pgKey).references(`${t.posts}.postId`).onDelete('CASCADE'),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'siteId',
    create: ({ schema, column }) => schema.string(column.pgKey).references(`${t.site}.siteId`).onDelete('CASCADE'),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'orgId',
    create: ({ schema, column }) => schema.string(column.pgKey, 50).references(`${t.org}.orgId`).onUpdate('CASCADE').notNullable().index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
] as const

export const tables = [
  new FictionDbTable({ tableKey: t.posts, timestamps: true, columns: postCols }),
  new FictionDbTable({ tableKey: t.taxonomies, columns: taxonomyCols, timestamps: true, onCreate: t => t.unique(['org_id', 'slug']) }),
  new FictionDbTable({ tableKey: t.postTaxonomies, columns: postTaxonomyCols, timestamps: true }),
  new FictionDbTable({ tableKey: t.postAuthor, columns: postAuthorCols, timestamps: true }),
  new FictionDbTable({ tableKey: t.postSite, columns: postSiteCols, timestamps: true }),
]
