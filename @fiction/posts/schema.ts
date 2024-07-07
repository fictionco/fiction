import type { CreateObjectType, MediaDisplayObject, PostStatus, TableTaxonomyConfig, User } from '@fiction/core'
import { standardTable, toSlug } from '@fiction/core'
import { FictionDbCol, FictionDbTable } from '@fiction/core/plugin-db'
import type { SiteUserConfig, TableSiteConfig } from '@fiction/site'

export const t = {
  posts: 'fiction_post',
  postTaxonomies: 'fiction_post_taxonomy',
  postAuthor: 'fiction_post_author',
  postSite: 'fiction_post_site',
  ...standardTable,
}

export type TablePostConfig = Partial<CreateObjectType<typeof postCols>> & {
  authors?: User[]
  sites?: Partial<TableSiteConfig>[]
  taxonomy?: TableTaxonomyConfig[]
  tags?: TableTaxonomyConfig[]
  categories?: TableTaxonomyConfig[]
  draftId?: string
}

export type PostDraft = Partial<{ draftId: string, title: string, content: string, userConfig: SiteUserConfig, createdAt: string, updatedAt: string }>

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
    default: () => 'post' as 'post' | 'email',
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
    default: () => ({} as SiteUserConfig),
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
] as const

// const taxonomyCols = [
//   new FictionDbCol({
//     key: 'taxonomyId',
//     create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`object_id('tax')`)),
//     default: () => '' as string,
//     zodSchema: ({ z }) => z.string().min(1),
//   }),
//   new FictionDbCol({
//     key: 'userId',
//     create: ({ schema, column }) => schema.string(column.pgKey, 50).references(`fiction_user.user_id`).onDelete('SET NULL').onUpdate('CASCADE').index(),
//     default: () => '' as string,
//     zodSchema: ({ z }) => z.string().length(50),
//   }),
//   new FictionDbCol({
//     key: 'orgId',
//     create: ({ schema, column }) => schema.string(column.pgKey, 50).references(`fiction_org.org_id`).onUpdate('CASCADE').notNullable().index(),
//     default: () => '' as string,
//     zodSchema: ({ z }) => z.string().length(50),
//   }),
//   new FictionDbCol({
//     key: 'title',
//     create: ({ schema, column }) => schema.string(column.pgKey),
//     default: () => '' as string,
//     zodSchema: ({ z }) => z.string().min(1),
//   }),
//   new FictionDbCol({
//     key: 'slug',
//     create: ({ schema, column }) => schema.string(column.pgKey).index(),
//     default: () => '' as string,
//     zodSchema: ({ z }) => z.string().min(1),
//   }),
//   new FictionDbCol({
//     key: 'type',
//     create: ({ schema, column }) => schema.string(column.pgKey).notNullable().index(),
//     default: () => '' as 'tag' | 'category',
//     zodSchema: ({ z }) => z.enum(['tag', 'category']),
//   }),
//   new FictionDbCol({
//     key: 'description',
//     create: ({ schema, column }) => schema.text(column.pgKey),
//     default: () => '' as string,
//     zodSchema: ({ z }) => z.string().optional(),
//   }),
//   new FictionDbCol({
//     key: 'parentId',
//     create: ({ schema, column }) => schema.string(column.pgKey).references(`${t.taxonomies}.taxonomy_id`).onDelete('SET NULL'),
//     default: () => '' as string,
//     zodSchema: ({ z }) => z.string().optional(),
//   }),
//   new FictionDbCol({
//     key: 'priority',
//     create: ({ schema, column }) => schema.integer(column.pgKey).defaultTo(0),
//     default: () => 0 as number,
//     zodSchema: ({ z }) => z.number().int().optional(),
//   }),
// ] as const

// Post-Taxonomies join table columns
const postTaxonomyCols = [
  new FictionDbCol({
    key: 'postTaxonomyId',
    create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`object_id()`)),
    // create: ({ schema }) => schema.primary(['post_id', 'taxonomy_id']),
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
    create: ({ schema, column }) => schema.string(column.pgKey).references(`${t.taxonomy}.taxonomyId`).onDelete('CASCADE'),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'orgId',
    create: ({ schema, column }) => schema.string(column.pgKey, 50).references(`${t.org}.org_id`).onUpdate('CASCADE').notNullable().index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'priority',
    create: ({ schema, column }) => schema.integer(column.pgKey).defaultTo(0),
    default: () => 0 as number,
    zodSchema: ({ z }) => z.number().int().optional(),
  }),
] as const

// Post-Author join table columns
const postAuthorCols = [
  new FictionDbCol({
    key: 'postAuthorId',
    create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`object_id()`)),
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
  new FictionDbCol({
    key: 'priority',
    create: ({ schema, column }) => schema.integer(column.pgKey).defaultTo(0),
    default: () => 0 as number,
    zodSchema: ({ z }) => z.number().int().optional(),
  }),
] as const

const postSiteCols = [
  new FictionDbCol({
    key: 'postSiteId',
    create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`object_id()`)),
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
  new FictionDbCol({
    key: 'priority',
    create: ({ schema, column }) => schema.integer(column.pgKey).defaultTo(0),
    default: () => 0 as number,
    zodSchema: ({ z }) => z.number().int().optional(),
  }),
] as const

export const tables = [
  new FictionDbTable({ tableKey: t.posts, columns: postCols }),
  new FictionDbTable({ tableKey: t.postTaxonomies, columns: postTaxonomyCols, uniqueOn: ['post_id', 'taxonomy_id'] }),
  new FictionDbTable({ tableKey: t.postAuthor, columns: postAuthorCols, uniqueOn: ['post_id', 'user_id'] }),
  new FictionDbTable({ tableKey: t.postSite, columns: postSiteCols, uniqueOn: ['post_id', 'site_id'] }),
]
