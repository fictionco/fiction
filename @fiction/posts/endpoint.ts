import type { EndpointMeta, EndpointResponse, IndexMeta, IndexQuery } from '@fiction/core'
import type { FictionPosts } from '.'
import type { FictionPostsSettings } from './index'
import type { TablePostConfig } from './schema'
import { abort, applyComplexFilters, deepMerge, incrementSlugId, objectId, Query, standardTable, toSlug } from '@fiction/core'
import { t } from './schema'
import { trackPostMetrics } from './utils/analytics'

export type PostsQuerySettings = FictionPostsSettings & { fictionPosts: FictionPosts }
export abstract class PostsQuery extends Query<PostsQuerySettings> {
  db = () => this.settings.fictionDb.client()
  constructor(settings: PostsQuerySettings) {
    super(settings)
  }

  protected async fetchAuthors(userIds: string[]) {
    if (userIds.length === 0)
      return []

    return this.db()
      .select('*')
      .from(standardTable.user)
      .whereIn('userId', userIds)
  }
}

export type WherePost = { postId?: string, slug?: string } & ({ postId: string } | { slug: string })

export type ManagePostParamsRequest =
  | { _action: 'create', fields: Partial<TablePostConfig>, defaultTitle?: string }
  | { _action: 'update', where: WherePost, fields: Partial<TablePostConfig>, loadDraft?: boolean }
  | { _action: 'get', select?: (keyof TablePostConfig | '*')[], loadDraft?: boolean } & ({ orgId: string, where: WherePost & { orgId?: string } } | { where: WherePost & { orgId: string } })
  | { _action: 'delete', where: WherePost }
  | { _action: 'saveDraft', where: WherePost, fields: Partial<TablePostConfig> }
  | { _action: 'revertDraft', where: WherePost }
  | { _action: 'list', type?: string, loadDraft?: boolean } & IndexQuery & ({ orgId: string, where?: { orgId?: string } } | { where: { orgId: string } })
  | { _action: 'deletePosts', selectedIds?: string[], orgId: string }

export type ManagePostParams = ManagePostParamsRequest & { userId?: string, orgId?: string }

type ManagePostResponse = EndpointResponse<TablePostConfig[]> & {
  isNew?: boolean
  indexMeta?: IndexMeta
}

export class QueryManagePost extends PostsQuery {
  async run(params: ManagePostParams, meta: EndpointMeta): Promise<ManagePostResponse> {
    let r: ManagePostResponse

    switch (params._action) {
      case 'get':
        r = await this.getPost(params, meta)
        break
      case 'update':
        r = await this.updatePost(params, meta)
        break
      case 'create':
        r = await this.createPost(params, meta)
        break
      case 'delete':
        r = await this.deletePost(params, meta)
        break
      case 'saveDraft':
        r = await this.saveDraft(params, meta)
        break
      case 'revertDraft':
        r = await this.revertDraft(params, meta)
        break
      case 'list':
        r = await this.listPosts(params, meta)
        break
      case 'deletePosts':
        r = await this.deletePosts(params, meta)
        break
      default:
        return { status: 'error', message: 'Invalid action' }
    }

    return r
  }

  private async listPosts(params: ManagePostParams & { _action: 'list' }, _meta: EndpointMeta): Promise<ManagePostResponse> {
    const {
      where,
      filters = [],
      limit = 10,
      offset = 0,
      orderBy = 'updatedAt',
      order = 'desc',
      type = 'post',
      loadDraft = false,
    } = params
    const db = this.db()

    const orgId = where?.orgId || params.orgId

    if (!orgId)
      throw abort('orgId is required to list posts')

    let query = db
      .select<TablePostConfig[]>('*')
      .from(t.posts)
      .where({ orgId, type })
      .limit(limit)
      .offset(offset)
      .orderBy(orderBy, order)

    query = applyComplexFilters(query, filters)

    let posts = await query

    if (loadDraft) {
      posts = posts.map((post) => {
        if (post.draft)
          return { ...post, ...post.draft }

        delete post.draft

        return post
      })
    }

    const allAuthorIds = posts.map(post => post.userId).filter(Boolean) as string[]
    const allAuthors = await this.fetchAuthors(allAuthorIds)

    const postsWithAuthors = posts.map(post => ({
      ...post,
      authors: [post.userId].filter(Boolean).map(userId => allAuthors.find(author => author.userId === userId)),
    })) as TablePostConfig[]

    const count = await this.countPosts(params, _meta)

    return {
      status: 'success',
      data: postsWithAuthors,
      indexMeta: { ...params, count, limit, offset },
    }
  }

  private async deletePosts(params: ManagePostParams & { _action: 'deletePosts' }, _meta: EndpointMeta): Promise<ManagePostResponse> {
    const { selectedIds, orgId } = params

    if (!selectedIds || selectedIds.length === 0)
      throw abort('No posts selected for deletion')

    await this.db()(t.posts).where({ orgId }).whereIn('postId', selectedIds).delete()

    return { status: 'success', message: `Deleted ${selectedIds.length} posts` }
  }

  private async countPosts(params: ManagePostParams & { _action: 'list' }, _meta: EndpointMeta): Promise<number> {
    const { filters = [], type = 'post', where } = params
    const db = this.db()

    const orgId = where?.orgId || params.orgId

    if (!orgId)
      throw abort('orgId is required to count posts')

    let query = db
      .count<{ count: string }>('*')
      .from(t.posts)
      .where({ orgId, type })

    query = applyComplexFilters(query, filters)

    const result = await query.first()

    const count = Number.parseInt(result?.count || '0', 10)

    return count
  }

  private async getPost(params: ManagePostParams & { _action: 'get' }, _meta: EndpointMeta): Promise<EndpointResponse<TablePostConfig[]>> {
    const { where, select = ['*'], loadDraft = false } = params
    const db = this.db()

    const orgId = where.orgId || params.orgId

    if (!orgId)
      throw abort('orgId is required to get a post')

    if (!where.postId && !where.slug)
      throw abort('postId or slug is required to get a post')

    const sel = !select.includes('*') ? [...select, 'postId'] : select
    const query = db.select(sel).from(t.posts).where({ ...where, orgId })

    let post = await query.first<TablePostConfig>()

    if (!post)
      return { status: 'error', data: undefined }

    if (post.postId) {
      post.authors = await db.select([`${t.user}.userId`, `${t.user}.email`, `${t.user}.fullName`, `${t.postAuthor}.priority`]).from(t.postAuthor).join(t.user, `${t.user}.user_id`, `=`, `${t.postAuthor}.user_id`).where(`${t.postAuthor}.post_id`, post.postId).orderBy(`${t.postAuthor}.priority`, 'asc')
      post.sites = await db.select([`${t.sites}.siteId`, `${t.sites}.title`]).from(t.postSite).join(t.sites, `${t.sites}.site_id`, `=`, `${t.postSite}.site_id`).where(`${t.postSite}.post_id`, post.postId)
    }

    if (loadDraft && post.draft)
      post = deepMerge([post, post.draft as TablePostConfig])

    return { status: 'success', data: [post] }
  }

  private async updatePost(params: ManagePostParams & { _action: 'update' }, meta: EndpointMeta): Promise<EndpointResponse<TablePostConfig[]>> {
    const db = this.db()
    const { where, fields, orgId } = params

    if (!where.postId && !where.slug)
      throw abort('postId or slug is required to get a post')

    if (!orgId)
      throw abort('orgId is required to update a post')

    fields.updatedAt = new Date().toISOString()

    // Retrieve current post details
    const r = await this.getPost({
      _action: 'get',
      where: { orgId, ...where },
      select: ['status', 'dateAt', 'slug'],
    }, { ...meta, caller: 'updatePostGetExisting' })

    const currentPost = r.data?.[0]
    if (!currentPost?.postId)
      throw abort('Post not found')

    const postId = currentPost.postId

    if (fields.slug && fields.slug !== currentPost.slug)
      fields.slug = await this.getSlugId({ orgId, postId, fields })

    const prepped = this.settings.fictionDb.prep({
      type: 'insert',
      fields,
      meta,
      table: t.posts,
    })

    // Set date to current time if status changes and date is still empty
    if (!prepped.dateAt && prepped.status && prepped.status !== 'draft' && currentPost.status === 'draft' && !currentPost.dateAt)
      prepped.dateAt = prepped.updatedAt

    const keysToRemove = ['postId', 'orgId']

    keysToRemove.forEach((key) => {
      delete prepped[key as keyof typeof prepped]
    })

    prepped.draft = {}

    await Promise.all([
      db(t.posts).update(prepped).where({ postId }),
      this.updateAssociations({ type: 'authors', postId, fields, orgId }),
      this.updateAssociations({ type: 'sites', postId, fields, orgId }),
    ])

    const final = await this.getPost({ ...params, where: { orgId, ...where }, _action: 'get' }, { ...meta, caller: 'updatePostEnd' })

    await trackPostMetrics({ orgId, fictionPosts: this.settings.fictionPosts, post: final.data?.[0] }, meta)

    return { status: 'success', data: final.data, message: 'Post updated' }
  }

  private async updateAssociations(args: { type: 'authors' | 'sites', fields: TablePostConfig, postId: string, orgId: string }) {
    const db = this.db()
    const { type, fields, postId, orgId } = args

    const tableName = type === 'authors' ? t.postAuthor : t.postSite
    const foreignKey = type === 'authors' ? 'userId' : 'siteId'

    const items = fields[type] || []
    const newIds = items.map((item) => {
      if (type === 'authors' && 'userId' in item)
        return item.userId
      else if (type === 'sites' && 'siteId' in item)
        return item.siteId
      return ''
    }).filter(Boolean)

    // Fetch existing associations
    const existingAssociations = await db.select(foreignKey).from(tableName).where({ postId })
    const existingIds = existingAssociations.map(a => a[foreignKey])
    const toRemove = existingIds.filter(id => !newIds.includes(id))

    // Remove old associations
    if (toRemove.length > 0)
      await db.table(tableName).where({ postId }).whereIn(foreignKey, toRemove).delete()

    // Add new associations
    if (newIds.length > 0) {
      const newAssociations = newIds.map((id, index) => ({ postId, [foreignKey]: id, orgId, priority: index }))
      await db.table(tableName).insert(newAssociations).onConflict(['postId', foreignKey]).merge(['priority'])
    }
  }

  private async isSlugTaken(orgId: string, slug: string, postId?: string): Promise<boolean> {
    const existingPost = await this.db()(t.posts)
      .where({ orgId, slug })
      .andWhere((builder) => {
        if (postId)
          void builder.whereNot({ postId })
      })
      .first()

    return !!existingPost
  }

  private async getSlugId(args: { orgId: string, postId?: string, fields: Partial<TablePostConfig> }) {
    const { orgId, postId, fields: { slug, title, type = 'post' } } = args

    let currentSlug = slug || toSlug(title) || type

    // Continuously check for uniqueness and adjust the slug if necessary
    while (await this.isSlugTaken(orgId, currentSlug, postId))
      currentSlug = incrementSlugId(currentSlug)

    return currentSlug
  }

  private async createPost(params: ManagePostParams & { _action: 'create' }, meta: EndpointMeta): Promise<EndpointResponse<TablePostConfig[]>> {
    const db = this.db()
    const { fields, orgId, userId, defaultTitle = '' } = params

    if (!orgId || !userId)
      throw abort('userId and orgId are required to create a post')

    // Ensure the slug is unique within the organization
    fields.slug = await this.getSlugId({ orgId, fields })
    fields.title = fields.title || defaultTitle
    const prepped = this.settings.fictionDb.prep({
      type: 'insert',
      fields: { ...fields },
      meta,
      table: t.posts,
    })

    const fieldsWithOrg = { type: 'post', status: 'draft', ...prepped, orgId, userId } as const
    const [{ postId }] = await db(t.posts).insert(fieldsWithOrg).returning('postId')

    const authors = fields.authors?.length ? fields.authors : [{ userId }]

    const associationFields = { ...fieldsWithOrg, postId, authors } as const

    await Promise.all([
      this.updateAssociations({ type: 'authors', postId, orgId, fields: associationFields }),
      this.updateAssociations({ type: 'sites', postId, orgId, fields: associationFields }),

    ])

    const final = await this.getPost({ _action: 'get', where: { postId, orgId }, orgId }, { ...meta, caller: 'createPost' })

    await trackPostMetrics({ orgId, fictionPosts: this.settings.fictionPosts, post: final.data?.[0] }, meta)

    return { status: 'success', data: final.data, message: 'Post created', isNew: true }
  }

  private async deletePost(args: ManagePostParams & { _action: 'delete' }, meta: EndpointMeta): Promise<EndpointResponse<TablePostConfig[]>> {
    const { where, orgId } = args

    if (!orgId)
      throw abort('orgId is required to delete a post')

    const db = this.db()
    // Ensure the post exists before deleting it, error if it doesn't
    const r = await this.getPost({ _action: 'get', where: { ...where, orgId } }, { ...meta, caller: 'deletePost' })

    const post = r.data?.[0]

    if (!post)
      throw abort('Post not found')

    await db(t.posts).where({ ...where, orgId }).delete()

    this.log.info('Post deleted', { data: { where } })

    await trackPostMetrics({ orgId, fictionPosts: this.settings.fictionPosts }, meta)

    return { status: 'success', data: [post], message: 'Post deleted' }
  }

  private async saveDraft(params: ManagePostParams & { _action: 'saveDraft' }, meta: EndpointMeta): Promise<EndpointResponse<TablePostConfig[]>> {
    const db = this.db()
    const { fields, orgId } = params

    if (!orgId)
      throw abort('orgId is required to save a draft')

    // Get current date and format
    const now = new Date()
    fields.updatedAt = now.toISOString()

    const where = { ...params.where, orgId }

    const currentDrafts = await db.select<TablePostConfig>('draft')
      .from(t.posts)
      .where(where)
      .first()

    const draft = (currentDrafts?.draft || {}) as TablePostConfig

    const keysToRemove = ['draft', 'postId', 'userId', 'orgId']

    keysToRemove.forEach((key) => {
      delete fields[key as keyof typeof fields]
    })

    const authors = fields.authors || []
    const sites = fields.sites || []
    const newDraft = {
      draftId: objectId({ prefix: 'dft' }),
      ...draft,
      ...fields,
      sites,
      authors,
      updatedAt: now,
      createdAt: draft.createdAt,
    }

    // Persist the updated draft and history
    await db(t.posts)
      .where(where)
      .update({ draft: newDraft })

    const r = await this.getPost({
      _action: 'get',
      where: { ...where, orgId },
      loadDraft: true,
    }, { ...meta, caller: 'saveDraft' })

    return { status: 'success', data: r.data }
  }

  private async revertDraft(params: ManagePostParams & { _action: 'revertDraft' }, meta: EndpointMeta): Promise<EndpointResponse<TablePostConfig[]>> {
    const { where, orgId } = params

    if (!orgId)
      throw abort('orgId is required to revert a draft')

    const db = this.db()

    await db(t.posts).where({ orgId, ...where }).update({ draft: '{}' })

    const r = await this.getPost({ _action: 'get', where: { orgId, ...where }, loadDraft: false }, { ...meta, caller: 'revertDraft' })

    return { status: 'success', message: 'Reverted to published version', data: r.data }
  }
}
