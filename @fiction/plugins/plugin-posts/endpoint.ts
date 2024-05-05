import type { DataFilter, EndpointMeta, EndpointResponse, FictionDb, FictionPluginSettings, FictionUser } from '@fiction/core'
import { Query, objectId, standardTable } from '@fiction/core'
import type { TablePostConfig } from './schema'
import { tableNames } from './schema'
import type { FictionPosts } from '.'

export type PostsQuerySettings = FictionPluginSettings & {
  fictionPosts: FictionPosts
  fictionUser: FictionUser
  fictionDb: FictionDb
}
export abstract class PostsQuery extends Query<PostsQuerySettings> {
  db = () => this.settings.fictionDb.client()
  constructor(settings: PostsQuerySettings) {
    super(settings)
  }
}

export type ManagePostParamsRequest =
  | {
    _action: 'create'
    fields: Partial<TablePostConfig>
  }
  | {
    _action: 'update'
    postId: string
    fields: Partial<TablePostConfig>
    loadDraft?: boolean
  }
  | {
    _action: 'get'
    postId: string
    select?: (keyof TablePostConfig)[] | ['*']
    loadDraft?: boolean
  }
  | {
    _action: 'delete'
    postId: string
  }
  | {
    _action: 'saveDraft'
    postId: string
    fields: Partial<TablePostConfig>
  }

export type ManagePostParams = ManagePostParamsRequest & { userId?: string, orgId?: string }

type ManagePostResponse = EndpointResponse<TablePostConfig> & {
  isNew?: boolean
}

export class QueryManagePost extends PostsQuery {
  async run(params: ManagePostParams, _meta: EndpointMeta): Promise<ManagePostResponse> {
    let post: TablePostConfig | undefined
    let message = ''

    switch (params._action) {
      case 'get':
        post = await this.getPost(params.postId, params)
        break
      case 'update':
        post = await this.updatePost(params)
        message = 'Post updated'
        break
      case 'create':
        post = await this.createPost(params)
        message = 'Post created'
        break
      case 'delete':
        await this.deletePost(params.postId)
        message = 'Post deleted'
        break
      case 'saveDraft':
        post = await this.saveDraft(params)
        break
      default:
        return { status: 'error', message: 'Invalid action' }
    }

    return { status: 'success', data: post, message }
  }

  private async getPost(postId: string, options: { loadDraft?: boolean, select?: (keyof TablePostConfig)[] | ['*'] } = {}): Promise<TablePostConfig | undefined> {
    const { select = ['*'], loadDraft = false } = options
    const db = this.db()
    const query = db.select(select).from(tableNames.posts).where({ postId })

    let post = await query.first<TablePostConfig>()

    if (!post)
      throw this.abort('Post not found', { data: { _action: 'get', postId } })

    if (loadDraft && post.draft)
      post = { ...post, ...post.draft }

    return post
  }

  private async updatePost(params: ManagePostParams & { _action: 'update' }): Promise<TablePostConfig | undefined> {
    const db = this.db()
    const { postId, fields } = params

    fields.updatedAt = new Date().toISOString()

    // Retrieve current post details
    const currentPost = await this.getPost(postId, { select: ['status', 'dateAt'] })
    if (!currentPost)
      throw this.abort('Post not found', { data: params })

    // Set date to current time if status changes and date is still empty
    if (!fields.dateAt && fields.status && fields.status !== 'draft' && currentPost.status === 'draft' && !currentPost.dateAt)
      fields.dateAt = fields.updatedAt

    // Update the post and return the updated post details
    await db(tableNames.posts).update(fields).where({ postId })
    return this.getPost(postId, params)
  }

  private async createPost(params: ManagePostParams & { _action: 'create' }): Promise<TablePostConfig | undefined> {
    const db = this.db()
    const { fields, orgId, userId } = params

    if (!orgId || !userId)
      throw this.abort('userId and orgId are required to create a post')

    const fieldsWithOrg = { type: 'post', status: 'draft', ...fields, orgId, userId }
    const [{ postId }] = await db(tableNames.posts).insert(fieldsWithOrg).returning('postId')

    return this.getPost(postId)
  }

  private async deletePost(postId: string): Promise<TablePostConfig | undefined> {
    const db = this.db()
    // Ensure the post exists before deleting it, error if it doesn't
    const post = await this.getPost(postId)
    await db(tableNames.posts).where({ postId }).delete()

    return post
  }

  private async saveDraft(params: ManagePostParams & { _action: 'saveDraft' }): Promise<TablePostConfig | undefined> {
    const db = this.db()
    const { postId, fields } = params

    // Get current date and format
    const now = new Date()
    fields.updatedAt = now.toISOString()

    const currentDrafts = await db.select<TablePostConfig>('draft', 'draft_history')
      .from(tableNames.posts)
      .where({ postId })
      .first()

    const draft = (currentDrafts?.draft || {}) as TablePostConfig
    const draftHistory = (currentDrafts?.draftHistory || []) as TablePostConfig[]
    const TEN_MINUTES = 600000
    // Create or update draft
    const isNewDraftNeeded = draft.createdAt && (now.getTime() - new Date(draft.createdAt).getTime()) > TEN_MINUTES
    if (isNewDraftNeeded) {
      draftHistory.push({ ...draft, archiveAt: now.toISOString() }) // Archive the current draft
      draft.createdAt = now.toISOString() // Reset creation time for a new draft
    }

    const newDraft = { draftId: objectId({ prefix: 'dft' }), ...draft, ...fields, updatedAt: now, createdAt: draft.createdAt }

    // Persist the updated draft and history
    await db(tableNames.posts)
      .where({ postId })
      .update({
        draft: newDraft,
        draft_history: draftHistory,
      })

    return this.getPost(postId)
  }
}

export type ManageIndexParamsRequest = {
  _action: 'delete' | 'list'
  limit?: number
  offset?: number
  selectedIds?: string[]
  filters?: DataFilter[]
}

export type ManageIndexParams = ManageIndexParamsRequest & { userId?: string, orgId?: string }

type ManageIndexResponse = EndpointResponse<TablePostConfig[]> & {
  indexMeta?: { count: number, limit: number, offset: number }
}

export class ManagePostIndex extends PostsQuery {
  async run(params: ManageIndexParams, _meta: EndpointMeta): Promise<ManageIndexResponse> {
    if (!params._action)
      throw this.abort('Action parameter is required.')

    switch (params._action) {
      case 'list':
        return this.list(params)
      case 'delete':
        return this.deletePosts(params.selectedIds)
      default:
        throw this.abort(`Unsupported action '${params._action as string}'`)
    }
  }

  private async list({ orgId, limit = 10, offset = 0, filters = [] }: ManageIndexParams): Promise<ManageIndexResponse> {
    if (!orgId)
      throw this.abort('orgId is required to list posts')

    const posts = await this.fetchPosts(orgId, limit, offset, filters)
    const allAuthorIds = posts.map(post => post.userId).filter(Boolean) as string[]
    const allAuthors = await this.fetchAuthors(allAuthorIds)

    const postsWithAuthors = posts.map(post => ({
      ...post,
      authors: [post.userId].filter(Boolean).map(userId => allAuthors.find(author => author.userId === userId)),
    })) as TablePostConfig[]

    const count = await this.fetchCount(orgId)

    return {
      status: 'success',
      data: postsWithAuthors,
      indexMeta: { count, limit, offset },
    }
  }

  private async fetchPosts(orgId: string, limit: number, offset: number, filters: DataFilter[]) {
    const query = this.db()
      .select<TablePostConfig[]>('*')
      .from(tableNames.posts)
      .where('org_id', orgId)
      .limit(limit)
      .offset(offset)
      .orderBy('updatedAt', 'desc')

    filters.forEach((filter) => {
      if (filter.field && filter.operator && filter.value)
        void query.where(filter.field, filter.operator, filter.value)
    })

    return query
  }

  private async fetchAuthors(userIds: string[]) {
    if (userIds.length === 0)
      return []

    return this.db()
      .select('*')
      .from(standardTable.user)
      .whereIn('userId', userIds)
  }

  private async fetchCount(orgId: string): Promise<number> {
    const result = await this.db()
      .count<{ count: string }>('*')
      .from(tableNames.posts)
      .where({ orgId })
      .first()

    return Number.parseInt(result?.count || '0', 10)
  }

  private async deletePosts(selectedIds?: string[]): Promise<ManageIndexResponse> {
    if (!selectedIds || selectedIds.length === 0)
      throw this.abort('No posts selected for deletion')

    await this.db()(tableNames.posts)
      .whereIn('post_id', selectedIds)
      .delete()

    return {
      status: 'success',
      message: 'Deleted successfully',
    }
  }
}
