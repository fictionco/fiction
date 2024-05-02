import type { CreateObjectType, PostStatus, User } from '@fiction/core'
import { FictionDbCol, FictionDbTable } from '@fiction/core/plugin-db'

export const tableNames = { posts: 'fiction_posts' }

type PostUserConfig = Record<string, any>
type PostMeta = Record<string, any>

export type TablePostConfig = CreateObjectType<typeof postCols> & { authors?: User[] }

const postCols = [
  new FictionDbCol({
    key: 'postId',
    create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`object_id('post')`)).index(),
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

export const tables = [
  new FictionDbTable({ tableKey: tableNames.posts, timestamps: true, columns: postCols }),
]
