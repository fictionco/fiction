import type { EndpointMeta, EndpointResponse, FictionDb, FictionPluginSettings, FictionUser } from '@fiction/core'
import { Query, abort } from '@fiction/core'
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

export type ManagePostParams =
  | {
    _action: 'create'
    fields: Partial<TablePostConfig>
    orgId: string
    userId: string
  }
  | {
    _action: 'update'
    postId: string
    fields: Partial<TablePostConfig>
  }
  | {
    _action: 'get'
    postId: string
    select?: (keyof TablePostConfig)[] | ['*']
  }
  | {
    _action: 'delete'
    postId: string
  }

type ManagePostResponse = EndpointResponse<TablePostConfig> & {
  isNew?: boolean
}

export class QueryManagePost extends PostsQuery {
  async run(params: ManagePostParams, _meta: EndpointMeta): Promise<ManagePostResponse> {
    let post: TablePostConfig | undefined
    let message = ''

    switch (params._action) {
      case 'get':
        post = await this.getPost(params.postId, params.select)
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
      default:
        return { status: 'error', message: 'Invalid action' }
    }

    return { status: 'success', data: post, message }
  }

  private async getPost(postId: string, select: (keyof TablePostConfig)[] | ['*'] = ['*']): Promise<TablePostConfig | undefined> {
    const db = this.db()
    const query = db.select(select).from(tableNames.posts).where({ postId })
    const post = await query.first<TablePostConfig>()

    if (!post)
      throw this.abort('Post not found')

    return post
  }

  private async updatePost(params: ManagePostParams & { _action: 'update' }): Promise<TablePostConfig | undefined> {
    const db = this.db()
    const { postId, fields } = params

    fields.updatedAt = new Date().toISOString()

    // Retrieve current post details
    const currentPost = await this.getPost(postId, ['status', 'date'])
    if (!currentPost)
      throw this.abort('Post not found')

    // Set date to current time if status changes and date is still empty
    if (!fields.date && fields.status && fields.status !== 'draft' && currentPost.status === 'draft' && !currentPost.date)
      fields.date = fields.updatedAt

    // Update the post and return the updated post details
    await db(tableNames.posts).update(fields).where({ postId })
    return this.getPost(postId)
  }

  private async createPost(params: ManagePostParams & { _action: 'create' }): Promise<TablePostConfig | undefined> {
    const db = this.db()
    const { fields, orgId, userId } = params
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
}
