import type { ColType, ComplexDataFilter, Organization, User } from '@fiction/core'
import type { StandardUserConfig } from '@fiction/site/schema'
import { ColorThemeUserSchema, MediaSchema, OrFilterGroupSchema, PostStatusSchema, standardTable, toSlug } from '@fiction/core'
import { Col, FictionDbTable } from '@fiction/core/plugin-db'
import { t as siteTables } from '@fiction/site/tables'
import { z } from 'zod/v4'

export const t = {
  posts: 'fiction_post',
  postAuthor: 'fiction_post_author',
  postSite: 'fiction_post_site',
  email: 'fiction_email',
  postLikes: 'fiction_post_likes',
  postComments: 'fiction_post_comments',
  ...siteTables,
  ...standardTable,
}

export type TableEmailConfig = Partial<ColType<typeof emailCols>>

export type TablePostConfig = Partial<ColType<typeof postCols>> & {
  authors?: User[]
  likeCount?: number
  commentCount?: number
  draftId?: string
  org?: Organization
  relatedPosts?: {
    next?: TablePostConfig
    prev?: TablePostConfig
    similar?: TablePostConfig[]
  }
}

export const TablePostSchema = z.object() as z.ZodType<TablePostConfig>

export type TableCommentConfig = Partial<ColType<typeof postCommentCols>> & {
  user?: User
  replies?: TableCommentConfig[]
  replyCount?: number
}

export type TableLikeConfig = Partial<ColType<typeof postLikeCols>> & {
  user?: User
}

export type PostUserConfig = {
  contentCompletion?: {
    enabled?: boolean
    prompt?: string
  }
} & StandardUserConfig

export type PostDraft = Partial<{ draftId: string, title: string, content: string, userConfig: PostUserConfig, createdAt: string, updatedAt: string }>

export const EmailConfigSchema = z.object({
  // Basic email settings
  subject: z.string().optional(),
  preview: z.string().optional(),

  // Audience settings
  target: z.enum(['all', 'filtered', 'nobody']).default('all'),
  filters: z.array(z.custom<ComplexDataFilter>()).optional(),
  testEmails: z.array(z.string()).optional(),

  // Results
  sentAt: z.string().optional(),
  sentCount: z.number().int().optional(),
  failedCount: z.number().int().optional(),
  skippedCount: z.number().int().optional(),
  progress: z.number().int().optional(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  error: z.string().optional(),
  failedAt: z.string().optional(),
})

export const GlobalQuerySchema = z.object({
  filters: z.array(OrFilterGroupSchema).optional().describe('OR-based filter groups [@ai]'),
  sortBy: z.string().optional().describe('Field to sort by'),
  sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort direction'),
  search: z.string().optional().describe('Search query [@ai]'),
  dateRange: z.object({
    start: z.date().optional(),
    end: z.date().optional(),
  }).optional().describe('Date filter range'),
})

export type EmailConfig = z.infer<typeof EmailConfigSchema>

const VisibilitySchema = z.enum([
  'public', // Anyone can view
  'subscribers', // Only subscribers can view
  'private', // Password protected + only org members
  'unlisted', // Only with direct link
])

export const postCols = [
  new Col({ key: 'postId', sec: 'permanent', sch: () => z.string().min(1), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('pst')`)).index() }),
  new Col({ key: 'userId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`fiction_user.user_id`).onDelete('SET NULL').onUpdate('CASCADE').index() }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`fiction_org.org_id`).onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'type', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('post') }),
  new Col({ key: 'status', sec: 'setting', sch: () => PostStatusSchema, make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('draft') }),

  new Col({ key: 'slug', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).index(), prepare: ({ value }) => toSlug(value) }),
  new Col({ key: 'title', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k).defaultTo('') }),
  new Col({ key: 'subTitle', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k).defaultTo('') }),
  new Col({ key: 'content', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k).defaultTo('') }),
  new Col({ key: 'media', sec: 'setting', sch: () => MediaSchema, make: ({ s, col }) => s.jsonb(col.k).defaultTo({}) }),
  new Col({ key: 'theme', sec: 'setting', sch: () => ColorThemeUserSchema, make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'userConfig', sec: 'setting', sch: () => z.record(z.string(), z.unknown()) as z.Schema<PostUserConfig>, make: ({ s, col }) => s.jsonb(col.k).defaultTo({}) }),
  new Col({ key: 'hasChanges', sec: 'setting', sch: () => z.boolean(), make: ({ s, col }) => s.boolean(col.k).defaultTo(false) }),
  new Col({ key: 'draft', sec: 'setting', sch: () => z.record(z.string(), z.unknown()), make: ({ s, col }) => s.jsonb(col.k).defaultTo({}), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'tags', sec: 'setting', sch: () => z.array(z.string()), make: ({ s, col }) => s.specificType(col.k, 'text[]') }),
  new Col({ key: 'categories', sec: 'setting', sch: () => z.array(z.string()), make: ({ s, col }) => s.specificType(col.k, 'text[]') }),
  new Col({ key: 'visibility', sec: 'setting', sch: () => VisibilitySchema, make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('public') }),
  new Col({ key: 'isFeatured', sec: 'setting', sch: () => z.boolean(), make: ({ s, col }) => s.boolean(col.k).defaultTo(false) }),
  new Col({ key: 'priority', sec: 'setting', sch: () => z.number().int(), make: ({ s, col }) => s.integer(col.k).defaultTo(0) }),

  // email
  new Col({ key: 'subject', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).defaultTo('') }),
  new Col({ key: 'preview', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).defaultTo('') }),
  new Col({ key: 'audience', sec: 'setting', sch: () => z.enum(['all', 'filtered', 'nobody']), make: ({ s, col }) => s.string(col.k).defaultTo('all') }),
  new Col({ key: 'testEmails', sec: 'setting', sch: () => z.array(z.string()), make: ({ s, col }) => s.specificType(col.k, 'text[]') }),
  new Col({ key: 'audienceFilters', sec: 'setting', sch: () => z.array(OrFilterGroupSchema), make: ({ s, col }) => s.jsonb(col.k).defaultTo([]) }),

  new Col({ key: 'emailStatus', sec: 'setting', sch: () => PostStatusSchema, make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('draft') }),
  new Col({ key: 'emailConfig', sec: 'setting', sch: () => EmailConfigSchema, make: ({ s, col }) => s.jsonb(col.k).defaultTo({}) }),

  // dates
  new Col({ key: 'dateAt', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.timestamp(col.k) }),
  new Col({ key: 'publishMode', sec: 'setting', sch: () => z.enum(['now', 'schedule']), make: ({ s, col }) => s.string(col.k).defaultTo('now') }),
  new Col({ key: 'publishAt', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.timestamp(col.k) }),
  new Col({ key: 'publishedAt', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.timestamp(col.k) }),
  new Col({ key: 'archiveAt', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.timestamp(col.k) }),

  // stats
  new Col({ key: 'wordCount', sec: 'setting', sch: () => z.number().int(), make: ({ s, col }) => s.integer(col.k).defaultTo(0) }),
  new Col({ key: 'likeCount', sec: 'setting', sch: () => z.number().int(), make: ({ s, col }) => s.integer(col.k).defaultTo(0) }),
  new Col({ key: 'commentCount', sec: 'setting', sch: () => z.number().int(), make: ({ s, col }) => s.integer(col.k).defaultTo(0) }),
] as const

export const postAuthorCols = [
  new Col({ key: 'postAuthorId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id()`)) }),
  new Col({ key: 'postId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.posts}.postId`).onDelete('CASCADE') }),
  new Col({ key: 'userId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.user}.userId`).onDelete('CASCADE') }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`${t.org}.orgId`).onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'priority', sch: () => z.number().int().optional(), make: ({ s, col }) => s.integer(col.k).defaultTo(0) }),
] as const

export const postSiteCols = [
  new Col({ key: 'postSiteId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id()`)) }),
  new Col({ key: 'postId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.posts}.postId`).onDelete('CASCADE') }),
  new Col({ key: 'siteId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.sites}.siteId`).onDelete('CASCADE') }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`${t.org}.orgId`).onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'priority', sch: () => z.number().int().optional(), make: ({ s, col }) => s.integer(col.k).defaultTo(0) }),
] as const

export const emailCols = [
  new Col({ key: 'emailId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('cem')`)) }),
  new Col({ key: 'postId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.posts}.postId`).onDelete('CASCADE') }),
  new Col({ key: 'contactId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`fiction_contact.contact_id`).onDelete('CASCADE') }),
  new Col({ key: 'email', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).index() }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.org}.orgId`).onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'status', sec: 'setting', sch: () => z.enum(['queued', 'sent', 'failed', 'delivered', 'opened', 'clicked', 'bounced', 'complained']), make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('queued') }),
  new Col({ key: 'error', sec: 'setting', sch: () => z.string().optional(), make: ({ s, col }) => s.text(col.k) }),
  new Col({ key: 'attempts', sec: 'setting', sch: () => z.number().int(), make: ({ s, col }) => s.integer(col.k).defaultTo(0) }),
  new Col({ key: 'lastAttemptAt', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.timestamp(col.k) }),
  new Col({ key: 'sentAt', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.timestamp(col.k) }),
  new Col({ key: 'openedAt', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.timestamp(col.k) }),
  new Col({ key: 'clickedAt', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.timestamp(col.k) }),
  new Col({ key: 'deliveredAt', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.timestamp(col.k) }),
  new Col({ key: 'metadata', sec: 'setting', sch: () => z.record(z.string(), z.unknown()), make: ({ s, col }) => s.jsonb(col.k).defaultTo({}) }),
] as const

export const postLikeCols = [
  new Col({ key: 'likeId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('lke')`)) }),
  new Col({ key: 'postId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.posts}.postId`).onDelete('CASCADE').index() }),
  new Col({ key: 'userId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.user}.userId`).onDelete('CASCADE').index() }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`${t.org}.orgId`).onUpdate('CASCADE').notNullable().index() }),
] as const

export const postCommentCols = [
  new Col({ key: 'commentId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('cmt')`)) }),
  new Col({ key: 'postId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.posts}.postId`).onDelete('CASCADE').index() }),
  new Col({ key: 'userId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.user}.userId`).onDelete('CASCADE').index() }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`${t.org}.orgId`).onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'parentId', sec: 'setting', sch: () => z.string().optional(), make: ({ s, col }) => s.string(col.k).references(`${t.postComments}.commentId`).onDelete('CASCADE').nullable().index() }),
  new Col({ key: 'content', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k).notNullable() }),
  new Col({ key: 'status', sec: 'setting', sch: () => z.enum(['pending', 'approved', 'spam', 'trash']), make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('approved') }),
] as const

export const tables = [
  new FictionDbTable({ tableKey: t.posts, cols: postCols }),
  new FictionDbTable({
    tableKey: t.postAuthor,
    cols: postAuthorCols,
    constraints: [{ type: 'unique', columns: ['post_id', 'user_id'] }],
  }),
  new FictionDbTable({
    tableKey: t.postSite,
    cols: postSiteCols,
    constraints: [{ type: 'unique', columns: ['post_id', 'site_id'] }],
  }),
  new FictionDbTable({
    tableKey: t.email,
    cols: emailCols,
    constraints: [{ type: 'unique', columns: ['post_id', 'contact_id'] }],
  }),
  new FictionDbTable({
    tableKey: t.postLikes,
    cols: postLikeCols,
    constraints: [{ type: 'unique', columns: ['post_id', 'user_id'] }],
  }),
  new FictionDbTable({
    tableKey: t.postComments,
    cols: postCommentCols,
  }),
]

export const PostHandlingSchema = z.object({
  format: z.enum(['standard', 'local']).optional().describe('Global or inline posts source'),
  limit: z.number().optional().describe('Max posts to show'),
  offset: z.number().optional().describe('Number of posts to skip'),
  entries: z.array(z.object() as z.ZodType<TablePostConfig>).optional().describe('Local post entries [@ai]'),
  query: GlobalQuerySchema.optional().describe('Filter and sort options [@ai]'),
  viewSlug: z.string().optional().describe('Base URL for posts'),
})

export type PostHandlingObject = z.infer<typeof PostHandlingSchema>
