import type { EndpointMeta, EndpointResponse, IndexMeta, IndexQuery } from '@fiction/core'
import type { FictionPosts } from '.'
import type { FictionPostsSettings } from './index'
import type { TablePostConfig } from './schema'
import { abort, applyComplexFilters, dayjs, deepMerge, incrementSlugId, objectId, omit, Query, standardTable, toSlug } from '@fiction/core'

import { t } from './schema'
import { trackPostMetrics } from './utils/analytics'
import { getEmailForPost } from './utils/email'

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
  | { _action: 'update', where: WherePost, fields: Partial<TablePostConfig>, isAutosave?: boolean, loadDraft?: boolean, orgId: string, userId: string }
  | { _action: 'get', select?: (keyof TablePostConfig | '*')[], loadDraft?: boolean } & ({ orgId: string, where: WherePost & { orgId?: string } } | { where: WherePost & { orgId: string } })
  | { _action: 'delete', where: WherePost }
  | { _action: 'saveDraft', where: WherePost, fields: Partial<TablePostConfig>, userId: string, orgId: string }
  | { _action: 'revertDraft', where: WherePost }
  | { _action: 'list', type?: string, loadDraft?: boolean } & IndexQuery & ({ orgId: string, where?: { orgId?: string } } | { where: { orgId: string } })
  | { _action: 'deletePosts', selectedIds?: string[], orgId: string, userId: string }
  | { _action: 'restoreFromRevision', where: WherePost, revisionId: string }
  | { _action: 'emailSendTest', where: WherePost, testEmails: string[], maxEmails?: number }
  | { _action: 'generate', where?: WherePost, mode: 'outline' | 'full', fields: Partial<TablePostConfig>, orgId: string }

export type ManagePostParams = ManagePostParamsRequest & {
  userId?: string
  orgId?: string
  caller?: string
  scope?: 'draft' | 'publish'
}

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
      case 'restoreFromRevision':
        r = await this.restoreFromRevision(params, meta)
        break
      case 'emailSendTest':
        r = await this.emailSendTest(params, meta)
        break
      case 'generate':
        r = await this.generatePostContent(params, meta)
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

  private async getRelatedPosts(post: TablePostConfig, orgId: string): Promise<TablePostConfig['relatedPosts']> {
    if (!post.postId)
      return undefined

    const db = this.db()
    const { postId, dateAt, type = 'post', categories, tags } = post
    const baseQuery = { orgId, status: 'published', type }

    // Skip date-based queries if no dateAt exists
    const [nextPost, prevPost, similarPosts] = await Promise.all([
      dateAt
        ? db.select('*').from(t.posts).where(baseQuery).where('dateAt', '>', dateAt).orderBy('dateAt', 'asc').first<TablePostConfig>()
        : null,

      dateAt
        ? db.select('*').from(t.posts).where(baseQuery).where('dateAt', '<', dateAt).orderBy('dateAt', 'desc').first<TablePostConfig>()
        : null,

      db.select('*').from(t.posts).where(baseQuery).whereNot('postId', postId).where((builder) => {
        if (categories?.length) {
          builder.whereRaw('categories && ?', [categories])
        }
        else if (tags?.length) {
          builder.whereRaw('tags && ?', [tags])
        }
      }).orderBy('dateAt', 'desc').limit(3),
    ])

    // Sanitize function to remove sensitive fields
    const sanitize = (p?: TablePostConfig) => p ? omit(p, ['draft', 'content']) as TablePostConfig : undefined

    return {
      next: sanitize(nextPost as TablePostConfig | undefined),
      prev: sanitize(prevPost as TablePostConfig | undefined),
      similar: (similarPosts?.map(sanitize).filter(Boolean) || []) as TablePostConfig[],
    }
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
      post.authors = await db.select([
        `${t.user}.userId`,
        `${t.user}.email`,
        `${t.user}.fullName`,
        `${t.user}.avatar`,
        `${t.postAuthor}.priority`,
      ]).from(t.postAuthor).join(t.user, `${t.user}.user_id`, `=`, `${t.postAuthor}.user_id`).where(`${t.postAuthor}.post_id`, post.postId).orderBy(`${t.postAuthor}.priority`, 'asc')
    }

    if (loadDraft && post.draft)
      post = deepMerge([post, post.draft as TablePostConfig])

    if (post.postId && post.status === 'published') {
      post.relatedPosts = await this.getRelatedPosts(post, orgId)
    }

    return { status: 'success', data: [post] }
  }

  private async updatePost(params: ManagePostParams & { _action: 'update' }, meta: EndpointMeta): Promise<EndpointResponse<TablePostConfig[]>> {
    const db = this.db()
    const { where, fields, orgId, userId, scope = 'publish', isAutosave } = params

    if (!where.postId && !where.slug)
      throw abort('postId or slug is required to get a post', meta)

    if (!orgId)
      throw abort('orgId is required to update a post', meta)

    if (!userId)
      throw abort('userId is required to update a post', meta)

    if (scope === 'draft') {
      return this.saveDraft({ _action: 'saveDraft', where, fields, userId, orgId }, meta)
    }

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
    ])

    const result = await this.getPost({ ...params, where: { orgId, ...where }, _action: 'get' }, { ...meta, caller: 'updatePostEnd' })

    const finalPost = result.data?.[0]

    if (!finalPost?.postId)
      throw abort('Post not found', meta)

    // Create revision when publishing
    await this.settings.fictionRevision.createRevision({
      itemId: finalPost.postId,
      itemType: 'post',
      itemData: omit(finalPost, 'draft'),
      title: isAutosave ? 'Autosave Checkpoint' : 'Post updated',
      description: isAutosave ? 'Autosave checkpoint reached' : 'Post updated',
      orgId,
      userId,
    }, { skipTimeCheck: !isAutosave })

    await trackPostMetrics({ orgId, fictionPosts: this.settings.fictionPosts, post: finalPost }, meta)

    return { status: 'success', data: [finalPost], message: 'Post updated' }
  }

  private async updateAssociations(args: { type: 'authors', fields: TablePostConfig, postId: string, orgId: string }) {
    const db = this.db()
    const { type, fields, postId, orgId } = args

    const tableName = type === 'authors' ? t.postAuthor : t.postSite
    const foreignKey = type === 'authors' ? 'userId' : 'siteId'

    const items = fields[type] || []
    const newIds = items.map((item) => {
      if (type === 'authors' && 'userId' in item)
        return item.userId
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
    const { fields, orgId, userId } = params

    if (!orgId)
      throw abort('orgId is required to save a draft', meta)

    if (!userId) {
      throw abort('userId is required to save a draft', meta)
    }

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
    const newDraft = {
      draftId: objectId({ prefix: 'dft' }),
      ...draft,
      ...fields,
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

    const finalPost = r.data?.[0]

    if (!finalPost?.postId)
      throw abort('Post not found', meta)

    await this.settings.fictionRevision.createRevision({
      itemId: finalPost.postId,
      itemType: 'post',
      itemData: finalPost,
      title: 'Draft autosave',
      description: `Revision saved at ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
      orgId,
      userId,
    }, { skipTimeCheck: false }) // Use time limit for drafts

    return { status: 'success', data: [finalPost] }
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

  // Add restore from revision functionality
  private async restoreFromRevision(params: ManagePostParams & { _action: 'restoreFromRevision' }, meta: EndpointMeta): Promise<ManagePostResponse> {
    const { where, orgId, userId, revisionId } = params

    if (!userId || !orgId)
      throw abort('orgId and userId required', meta)

    if (!revisionId)
      throw abort('revisionId required', meta)

    // Get revision data
    const r = await this.settings.fictionRevision.getRevisionData({
      revisionId,
      orgId,
      userId,
      meta,
    })

    const revision = r.data
    if (!revision)
      return { status: 'error', message: 'Revision not found' }

    // Validate revision matches post
    const postId = where.postId
    if (revision.itemType !== 'post' || revision.itemId !== postId) {
      throw abort('Invalid revision for this post', meta)
    }

    // Create backup revision of current state
    const currentPost = await this.getPost({
      _action: 'get',
      where,
      orgId,
      caller: 'restoreBackup',
      loadDraft: false,
    }, meta)

    if (currentPost.data?.[0]) {
      await this.settings.fictionRevision.createRevision({
        itemId: postId,
        itemType: 'post',
        itemData: currentPost.data[0],
        title: 'Pre-restore backup',
        description: `Auto-created before restoring to revision ${revisionId}`,
        orgId,
        userId,
      }, { skipTimeCheck: true })
    }

    // Restore post data
    return this.updatePost({
      _action: 'update',
      where,
      fields: revision.itemData as TablePostConfig,
      orgId,
      userId,
      caller: 'restoreRevision',
    }, meta)
  }

  private async generatePostContent(params: ManagePostParams & { _action: 'generate' }, meta: EndpointMeta): Promise<EndpointResponse<TablePostConfig[]>> {
    const { where, mode, fields, orgId, userId } = params

    // Get org data and existing post if applicable
    const [org, existingPost] = await Promise.all([
      this.settings.fictionUser.queries.ManageOrganization.serve({ _action: 'read', where: { orgId } }, { server: true }).then(r => r.data),
      where?.postId || where?.slug ? this.getPost({ _action: 'get', where, orgId }, meta).then(r => r.data?.[0]) : null,
    ])

    // Check if this is a test organization or user
    const isTestRun = org?.orgName?.toLowerCase().includes('testing')

    if (!userId)
      throw abort('userId required for new post', meta)
    if (!org)
      throw abort('org not found', meta)
    if (where && !existingPost)
      throw abort('Post not found', meta)

    try {
      const { getGenerationParams, getSamplePost } = await import('./utils/generation')
      let generatedFields: Partial<TablePostConfig>

      if (isTestRun) {
        generatedFields = getSamplePost({ mode, prefix: org.orgName || 'Test' })
      }
      else {
        const generationParams = getGenerationParams({ org, mode, post: fields })
        generatedFields = await this.settings.fictionAi.queries.QueryAi.serve({
          orgId,
          userId,
          _action: 'completion',
          ...generationParams,
        }, { server: true }).then(r => (r.data?.completion || {}) as TablePostConfig)
      }

      // Create new post or update existing one
      if (existingPost && where) {
        const content = existingPost?.content ? `${existingPost?.content || ''}\n\n${generatedFields.content}` : generatedFields.content
        const f = { ...fields, ...generatedFields, content }
        return await this.updatePost({ _action: 'update', where, orgId, userId, fields: f }, meta)
      }
      else {
        const f = { ...fields, ...generatedFields }
        return await this.createPost({ _action: 'create', fields: f, orgId, userId }, meta)
      }
    }
    catch (error) {
      return { status: 'error', message: `Generation failed: ${(error as Error).message}` }
    }
  }

  private async emailSendTest(params: ManagePostParams & { _action: 'emailSendTest' }, meta: EndpointMeta): Promise<ManagePostResponse> {
    const { orgId, userId, where, testEmails, maxEmails = 10 } = params
    const { fictionUser, fictionEmail } = this.settings

    if (!orgId) {
      return { status: 'error', message: 'orgId is required' }
    }

    if (!where.postId) {
      return { status: 'error', message: 'postId is required' }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const allEmails = testEmails.map(email => email.trim())
    const validEmails = allEmails.filter(email => emailRegex.test(email))
    const badlyFormattedEmails = allEmails.filter(email => !emailRegex.test(email))

    if (validEmails.length === 0) {
      return { status: 'error', message: 'No valid email addresses provided' }
    }

    if (validEmails.length > maxEmails) {
      return { status: 'error', message: `Too many email addresses. Maximum allowed: ${maxEmails}` }
    }

    const [post, org] = await Promise.all([
      this.getPost({ _action: 'get', orgId, userId, where }, meta).then(r => r.data?.[0]),
      fictionUser.queries.ManageOrganization.serve({ _action: 'read', where: { orgId } }, { server: true }).then(r => r.data),
    ])

    if (!post || !org) {
      return { status: 'error', message: 'Post or organization not found' }
    }

    const emailConfig = await getEmailForPost({
      org,
      postConfig: post,
      fictionPosts: this.settings.fictionPosts,
      withDefaults: false,
    })

    const results = await Promise.all(validEmails.map(async (email) => {
      try {
        await fictionEmail.sendEmail(
          {
            ...emailConfig,
            to: email,
            subject: `[TEST] ${emailConfig.subject}`,
            caller: 'sendTestEmail',
          },
          { server: true },
        )
        return { email, success: true }
      }
      catch (error) {
        this.log.error(`Failed to send test email to ${email}`, { error })
        return { email, success: false }
      }
    }))

    const sentEmails = results.filter(r => r.success).map(r => r.email)
    const failedToSendEmails = results.filter(r => !r.success).map(r => r.email)

    const message = [
      `Test emails sent.`,
      failedToSendEmails.length > 0 ? `${failedToSendEmails.length} failed to send.` : '',
      badlyFormattedEmails.length > 0 ? `${badlyFormattedEmails.length} had invalid format.` : '',
    ].filter(Boolean).join(' ')

    return {
      status: 'success',
      message,
      data: [post],
      meta: {
        sentEmails,
        failedToSendEmails,
        badlyFormattedEmails,
      },
    }
  }
}
