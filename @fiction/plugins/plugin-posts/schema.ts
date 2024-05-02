import type { CreateObjectType, PostStatus, User } from '@fiction/core'
import { FictionDbCol, FictionDbTable } from '@fiction/core/plugin-db'

export const tableNames = {
  posts: 'fiction_posts',
  taxonomies: 'fiction_taxonomies',
  postTaxonomies: 'fiction_post_taxonomies',
}

type PostUserConfig = Record<string, any>
type PostMeta = Record<string, any>

export type TablePostConfig = CreateObjectType<typeof postCols> & { authors?: User[] }

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
    zodSchema: ({ z }) => z.string().length(50),
  }),
  new FictionDbCol({
    key: 'orgId',
    create: ({ schema, column }) => schema.string(column.pgKey, 50).references(`fiction_org.org_id`).onUpdate('CASCADE').notNullable().index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string().length(50),
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
    key: 'content',
    create: ({ schema, column }) => schema.text(column.pgKey).defaultTo(column.default()),
    default: () => '' as string,
    isSetting: true,
    zodSchema: ({ z }) => z.string().min(1),
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
    create: ({ schema, column }) => schema.jsonb(column.pgKey).defaultTo({}),
    prepare: ({ value }) => JSON.stringify(value),
    isSetting: true,
    default: () => ({} as PostUserConfig),
    zodSchema: ({ z }) => z.record(z.unknown()),
  }),
  new FictionDbCol({
    key: 'meta',
    create: ({ schema, column }) => schema.jsonb(column.pgKey).defaultTo({}),
    prepare: ({ value }) => JSON.stringify(value),
    isSetting: true,
    default: () => ({} as PostMeta),
    zodSchema: ({ z }) => z.record(z.unknown()),
  }),
  new FictionDbCol({
    key: 'date',
    create: ({ schema, column }) => schema.timestamp(column.pgKey),
    default: () => '' as string,
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
    key: 'type',
    create: ({ schema, column }) => schema.string(column.pgKey).notNullable().defaultTo(column.default()).index(),
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
    create: ({ schema, column }) => schema.string(column.pgKey).references(`${tableNames.taxonomies}.taxonomy_id`).onDelete('SET NULL'),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string().optional(),
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
    create: ({ schema, column }) => schema.string(column.pgKey).references(`${tableNames.posts}.postId`).onDelete('CASCADE'),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'taxonomyId',
    create: ({ schema, column }) => schema.string(column.pgKey).references(`${tableNames.taxonomies}.taxonomyId`).onDelete('CASCADE'),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
] as const

export const tables = [
  new FictionDbTable({ tableKey: tableNames.posts, timestamps: true, columns: postCols }),
  new FictionDbTable({ tableKey: tableNames.taxonomies, columns: taxonomyCols, timestamps: true, onCreate: t => t.unique(['org_id', 'slug']) }),
  new FictionDbTable({ tableKey: tableNames.postTaxonomies, columns: postTaxonomyCols, timestamps: true }),
]
