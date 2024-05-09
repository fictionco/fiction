import type { DataFilter, EndpointMeta, EndpointResponse, FictionDb, FictionPluginSettings, FictionUser } from '@fiction/core'
import { Query, deepMerge, incrementSlugId, objectId, prepareFields, standardTable, toLabel, toSlug } from '@fiction/core'
import type { TablePostConfig, TableTaxonomyConfig } from './schema'
import { t } from './schema'
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

  protected async fetchAuthors(userIds: string[]) {
    if (userIds.length === 0)
      return []

    return this.db()
      .select('*')
      .from(standardTable.user)
      .whereIn('userId', userIds)
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
    postId?: string
    slug?: string
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

export type ManagePostParams = ManagePostParamsRequest & { userId?: string, orgId: string }

type ManagePostResponse = EndpointResponse<TablePostConfig> & {
  isNew?: boolean
}

export class QueryManagePost extends PostsQuery {
  async run(params: ManagePostParams, _meta: EndpointMeta): Promise<ManagePostResponse> {
    let post: TablePostConfig | undefined
    let message = ''

    switch (params._action) {
      case 'get':
        post = await this.getPost({ caller: 'switch', ...params }, _meta)
        break
      case 'update':
        post = await this.updatePost(params, _meta)
        message = 'Post updated'
        break
      case 'create':
        post = await this.createPost(params, _meta)
        message = 'Post created'
        break
      case 'delete':
        await this.deletePost(params, _meta)
        message = 'Post deleted'
        break
      case 'saveDraft':
        post = await this.saveDraft(params, _meta)
        break
      default:
        return { status: 'error', message: 'Invalid action' }
    }

    return { status: 'success', data: post, message }
  }

  private async getPost(options: {
    postId?: string
    orgId: string
    slug?: string
    loadDraft?: boolean
    select?: (keyof TablePostConfig)[] | ['*']
    caller?: string
  }, _meta: EndpointMeta): Promise<TablePostConfig | undefined> {
    const { postId, slug, select = ['*'], loadDraft = false, orgId, caller = 'unknown' } = options
    const db = this.db()

    if (!orgId)
      throw this.abort('orgId is required to get a post')

    if (!postId && !slug)
      throw this.abort('postId or slug is required to get a post')

    const queryKey = slug ? { slug } : { postId }

    const query = db.select(select).from(t.posts).where({ ...queryKey, orgId })

    let post = await query.first<TablePostConfig>()

    if (!post)
      throw this.abort('Post not found')

    const allAuthorIds = [post.userId].filter(Boolean) as string[]
    const allAuthors = await this.fetchAuthors(allAuthorIds)

    post.authors = allAuthorIds.map(userId => allAuthors.find(author => author.userId === userId))

    if (post.postId) {
      const q = db
        .select([`${t.taxonomies}.*`])
        .from(t.postTaxonomies)
        .join(t.taxonomies, `${t.taxonomies}.taxonomy_id`, `=`, `${t.postTaxonomies}.taxonomy_id`)
        .where(`${t.postTaxonomies}.post_id`, post.postId)

      post.taxonomy = await q
    }

    if (loadDraft && post.draft)
      post = deepMerge([post, post.draft as TablePostConfig])

    this.log.info(`getPost(${caller})`, { caller, data: { post } })

    return post
  }

  private async updatePost(params: ManagePostParams & { _action: 'update' }, _meta: EndpointMeta): Promise<TablePostConfig | undefined> {
    const db = this.db()
    const { postId, fields, orgId } = params

    if (!postId)
      throw this.abort('postId is required to update a post')

    if (!orgId)
      throw this.abort('orgId is required to update a post')

    fields.updatedAt = new Date().toISOString()

    // Retrieve current post details
    const currentPost = await this.getPost({ postId, orgId, select: ['status', 'dateAt', 'slug'], caller: 'updatePostGetExisting' }, _meta)
    if (!currentPost)
      throw this.abort('Post not found')

    if (fields.slug && fields.slug !== currentPost.slug)
      fields.slug = await this.getSlugId({ orgId, postId, fields })

    const prepped = prepareFields({
      type: 'settings',
      fields,
      table: t.posts,
      meta: _meta,
      fictionDb: this.settings.fictionDb,
    })

    // Set date to current time if status changes and date is still empty
    if (!prepped.dateAt && prepped.status && prepped.status !== 'draft' && currentPost.status === 'draft' && !currentPost.dateAt)
      prepped.dateAt = prepped.updatedAt

    const keysToRemove = ['postId', 'orgId']

    keysToRemove.forEach((key) => {
      delete prepped[key as keyof typeof prepped]
    })

    prepped.draft = {}

    this.log.info('saving post', { data: { prepped, params } })

    // Update the post and return the updated post details
    await db(t.posts).update(prepped).where({ postId })

    await this.updatePostTaxonomies(params)

    return this.getPost({ ...params, caller: 'updatePostEnd' }, _meta)
  }

  private async insertNewTaxonomies(args: { taxonomy: TableTaxonomyConfig[], orgId: string }) {
    const db = this.db()
    const { taxonomy = [], orgId } = args

    const newTaxonomies = taxonomy.filter(tax => !tax.taxonomyId)

    let insertedTaxonomyIds: string[] = []
    if (newTaxonomies.length > 0) {
      const insertItems = newTaxonomies.map((_) => {
        const { slug = toSlug(_.title), title = toLabel(_.slug), type = '', description } = _
        return { slug, title, description, type, orgId }
      })
      // Insert new taxonomies and get their IDs
      const r = await db(t.taxonomies)
        .insert(insertItems)
        .onConflict(['slug', 'org_id'])
        .merge(['slug']) // return without changing anything (ignore wont return existing)
        .returning<{ taxonomyId: string }[]>('taxonomyId')

      insertedTaxonomyIds = r.map(t => t.taxonomyId)
    }

    return insertedTaxonomyIds
  }

  // Handle the association between post and taxonomies
  private async updatePostTaxonomies(params: ManagePostParams & { _action: 'update' }) {
    const { postId, fields: { taxonomy = [] }, orgId } = params
    const db = this.db()

    const insertedTaxonomyIds = await this.insertNewTaxonomies({ taxonomy, orgId })

    const existingTaxonomies = await db.select('taxonomyId').from(t.postTaxonomies).where({ postId })
    const existingTaxonomyIds = existingTaxonomies.map(t => t.taxonomyId)

    const oldTaxonomiesIds = taxonomy.filter(tax => tax.taxonomyId).map(tax => tax.taxonomyId)
    const passedInTaxonomyIds = [...oldTaxonomiesIds, ...insertedTaxonomyIds]

    const toRemoveFromPost = existingTaxonomyIds.filter(id => !passedInTaxonomyIds.includes(id))
    const needsTaxonomies = passedInTaxonomyIds.filter(id => !existingTaxonomyIds.includes(id))

    // Remove old associations
    if (toRemoveFromPost.length > 0)
      await db.table(t.postTaxonomies).where({ postId }).whereIn('taxonomyId', toRemoveFromPost).delete()

    // Add new associations
    if (needsTaxonomies.length > 0) {
      const newTaxonomies = needsTaxonomies.map(taxonomyId => ({ postId, taxonomyId, orgId }))
      await db.table(t.postTaxonomies).insert(newTaxonomies).onConflict(['postId', 'taxonomyId']).ignore()
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
    const { orgId, postId, fields: { slug, title } } = args

    let currentSlug = slug || toSlug(title) || 'post'

    // Continuously check for uniqueness and adjust the slug if necessary
    while (await this.isSlugTaken(orgId, currentSlug, postId))
      currentSlug = incrementSlugId(currentSlug)

    return currentSlug
  }

  private async createPost(params: ManagePostParams & { _action: 'create' }, meta: EndpointMeta): Promise<TablePostConfig | undefined> {
    const db = this.db()
    const { fields, orgId, userId } = params

    if (!orgId || !userId)
      throw this.abort('userId and orgId are required to create a post')

    // Ensure the slug is unique within the organization
    fields.slug = await this.getSlugId({ orgId, fields })

    const prepped = prepareFields({ type: 'create', fields, table: t.posts, meta, fictionDb: this.settings.fictionDb })

    const fieldsWithOrg = { type: 'post', status: 'draft', ...prepped, orgId, userId }
    const [{ postId }] = await db(t.posts).insert(fieldsWithOrg).returning('postId')

    await this.updatePostTaxonomies({ ...params, postId, _action: 'update' })

    return this.getPost({ postId, orgId, caller: 'createPost' }, meta)
  }

  private async deletePost(args: { postId: string, orgId?: string }, _meta: EndpointMeta): Promise<TablePostConfig | undefined> {
    const { postId, orgId } = args

    if (!orgId)
      throw this.abort('orgId is required to delete a post')

    const db = this.db()
    // Ensure the post exists before deleting it, error if it doesn't
    const post = await this.getPost({ postId, orgId, caller: 'deletePost' }, _meta)
    await db(t.posts).where({ postId, orgId }).delete()

    return post
  }

  private async saveDraft(params: ManagePostParams & { _action: 'saveDraft' }, _meta: EndpointMeta): Promise<TablePostConfig | undefined> {
    const db = this.db()
    const { postId, fields, orgId } = params

    // Get current date and format
    const now = new Date()
    fields.updatedAt = now.toISOString()

    const currentDrafts = await db.select<TablePostConfig>('draft', 'draft_history')
      .from(t.posts)
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
    const prepped = prepareFields({ type: 'settings', fields, table: t.posts, meta: _meta, fictionDb: this.settings.fictionDb })

    const keysToRemove = ['draft', 'draftHistory', 'postId', 'userId', 'orgId']

    keysToRemove.forEach((key) => {
      delete prepped[key as keyof typeof prepped]
    })

    // taxonomies are removed by prepare, due to joined table, saved directly in draft
    const taxonomy = fields.taxonomy || []
    const newDraft = { draftId: objectId({ prefix: 'dft' }), ...draft, ...prepped, taxonomy, updatedAt: now, createdAt: draft.createdAt }

    // Persist the updated draft and history
    await db(t.posts)
      .where({ postId })
      .update({
        draft: newDraft,
        draft_history: draftHistory,
      })

    // save any new taxonomies that are not already in the database
    if (fields.taxonomy?.length)
      await this.insertNewTaxonomies({ orgId, taxonomy: fields.taxonomy })

    return this.getPost({ postId, orgId, loadDraft: true, caller: 'saveDraft' }, _meta)
  }
}

export type ManageTaxonomyParamsRequest =
  | {
    _action: 'create'
    items: TableTaxonomyConfig[] | readonly TableTaxonomyConfig[]
  }
  | {
    _action: 'update'
    items: TableTaxonomyConfig[] | readonly TableTaxonomyConfig[]
  }
  | {
    _action: 'get'
    select?: (keyof TableTaxonomyConfig)[] | ['*']
    selectors: { taxonomyId?: string, slug?: string }[]
  }
  | {
    _action: 'list'
    search?: string
    type?: 'tag' | 'category'
    limit?: number
    offset?: number
    filters?: DataFilter[]
    orderMode?: 'popularity' | 'recent'
  }
  | {
    _action: 'delete'
    items: TableTaxonomyConfig[] | readonly TableTaxonomyConfig[]
  }

export type ManageTaxonomyParams = ManageTaxonomyParamsRequest & { orgId: string, userId?: string }

type ManageTaxonomyResponse = EndpointResponse<TableTaxonomyConfig[]>

export class QueryManageTaxonomy extends PostsQuery {
  async run(params: ManageTaxonomyParams, _meta: EndpointMeta): Promise<ManageTaxonomyResponse> {
    let taxonomies: TableTaxonomyConfig[] = []

    switch (params._action) {
      case 'get':
        taxonomies = await this.getTaxonomies(params, _meta)
        break
      case 'list':
        taxonomies = await this.listTaxonomies(params, _meta)
        break
      case 'update':
        taxonomies = await this.updateTaxonomies(params, _meta)
        break
      case 'create':
        taxonomies = await this.createTaxonomies(params, _meta)
        break
      case 'delete':
        taxonomies = await this.deleteTaxonomies(params, _meta)
        break
      default:
        return { status: 'error', message: 'Invalid action' }
    }

    return { status: 'success', data: taxonomies }
  }

  private async createTaxonomies(params: ManageTaxonomyParams & { _action: 'create' }, _meta: EndpointMeta): Promise<TableTaxonomyConfig[]> {
    const { items, orgId } = params
    const db = this.db()

    const refined = items.map((item) => {
      return { orgId, title: toLabel(item.slug), slug: toSlug(item.title), ...item }
    })

    const results = await db(t.taxonomies).insert(refined).onConflict(['slug', 'orgId']).merge(['slug']).returning('*')

    return results
  }

  private async getTaxonomies(params: ManageTaxonomyParams & { _action: 'get' }, _meta: EndpointMeta): Promise<TableTaxonomyConfig[]> {
    const { selectors, select = ['*'], orgId } = params
    const db = this.db()

    if (!selectors || selectors.length === 0)
      throw this.abort('No selectors provided')

    const results = await Promise.all(selectors.map((s) => {
      const { slug, taxonomyId } = s
      const whereQuery = slug ? { slug, orgId } : { taxonomyId, orgId }

      const r = db.select(select)
        .from(t.taxonomies)
        .where(whereQuery)
        .first()

      return r
    }))

    return results.filter(Boolean) as TableTaxonomyConfig[]
  }

  private async listTaxonomies(params: ManageTaxonomyParams & { _action: 'list' }, _meta: EndpointMeta): Promise<TableTaxonomyConfig[]> {
    const { limit = 20, offset = 0, filters = [], orgId, search, type, orderMode = 'recent' } = params
    const db = this.db()

    // Define ordering logic in a dictionary for easy extension
    const orderCriteria = {
      popularity: { field: 'usage_count', direction: 'desc' },
      recent: { field: 'createdAt', direction: 'desc' },
      alphabetical: { field: 'title', direction: 'asc' },
      updated: { field: 'updatedAt', direction: 'desc' },
    }

    const query = db
      .select('*')
      .from(
        db.select([
          `${t.taxonomies}.*`,
          db.raw('CAST(COUNT(DISTINCT ??) AS INTEGER) as usage_count', `${t.postTaxonomies}.post_id`),
        ])
          .from(t.taxonomies)
          .leftJoin(t.postTaxonomies, `${t.postTaxonomies}.taxonomy_id`, `${t.taxonomies}.taxonomy_id`)
          .where(`${t.taxonomies}.orgId`, '=', orgId)
          .groupBy(`${t.taxonomies}.taxonomy_id`)
          .as('subquery'),
      ) // The results of this are treated as a table
      .offset(offset)
      .limit(limit)

    // Apply optional filters
    if (type)
      void query.andWhere({ type })

    if (search) {
      void query.andWhere(function () {
        void this.where('title', 'like', `%${search}%`).orWhere('slug', 'like', `%${search}%`)
      })
    }

    filters.forEach((filter) => {
      void query.andWhere(filter.field, filter.operator, filter.value)
    })

    // Apply ordering based on mode
    const { field, direction } = orderCriteria[orderMode]
    void query.orderBy(field, direction)

    const r = await query

    return r
  }

  private async updateTaxonomies(params: ManageTaxonomyParams & { _action: 'update' }, _meta: EndpointMeta): Promise<TableTaxonomyConfig[]> {
    const { items, orgId } = params
    const db = this.db()

    const results = await Promise.all(items.map(async (item) => {
      const { slug, taxonomyId } = item
      const whereQuery = slug ? { slug } : { taxonomyId }
      const r = await db(t.taxonomies)
        .where({ ...whereQuery, orgId })
        .update(item).returning('*')

      return r[0]
    }))

    return results
  }

  private async deleteTaxonomies(params: ManageTaxonomyParams & { _action: 'delete' }, _meta: EndpointMeta): Promise<TableTaxonomyConfig[]> {
    const { items = [], orgId } = params
    const db = this.db()

    const results = await Promise.all(items.map(async (item) => {
      const { slug, taxonomyId } = item
      const whereQuery = slug ? { slug } : { taxonomyId }
      const r = await db(t.taxonomies)
        .where({ ...whereQuery, orgId })
        .delete()
        .returning('*')

      return r[0]
    }))

    return results
  }
}

export type ManageIndexParamsRequest = {
  _action: 'delete' | 'list'
  limit?: number
  offset?: number
  selectedIds?: string[]
  filters?: DataFilter[]
  loadDraft?: boolean
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

  private async list(args: ManageIndexParams): Promise<ManageIndexResponse> {
    const { orgId, limit = 10, offset = 0, filters = [], loadDraft = false } = args

    if (!orgId)
      throw this.abort('orgId is required to list posts')

    let posts = await this.fetchPosts({ orgId, limit, offset, filters })

    if (loadDraft) {
      posts = posts.map((post) => {
        if (post.draft)
          return { ...post, ...post.draft }

        return post
      })
    }

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

  private async fetchPosts(args: { orgId: string, limit: number, offset: number, filters: DataFilter[] }) {
    const { orgId, limit, offset, filters } = args
    const query = this.db()
      .select<TablePostConfig[]>('*')
      .from(t.posts)
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

  private async fetchCount(orgId: string): Promise<number> {
    const result = await this.db()
      .count<{ count: string }>('*')
      .from(t.posts)
      .where({ orgId })
      .first()

    return Number.parseInt(result?.count || '0', 10)
  }

  private async deletePosts(selectedIds?: string[]): Promise<ManageIndexResponse> {
    if (!selectedIds || selectedIds.length === 0)
      throw this.abort('No posts selected for deletion')

    await this.db()(t.posts)
      .whereIn('post_id', selectedIds)
      .delete()

    return {
      status: 'success',
      message: 'Deleted successfully',
    }
  }
}
