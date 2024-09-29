import type { DataFilter, EndpointMeta, EndpointResponse, FictionDb, FictionPluginSettings, FictionUser, IndexMeta, IndexQuery, TableTaxonomyConfig } from '@fiction/core'
import type { FictionPosts } from '.'
import type { TablePostConfig } from './schema'
import { abort, applyComplexFilters, deepMerge, incrementSlugId, objectId, Query, standardTable, toLabel, toSlug } from '@fiction/core'
import { t } from './schema'

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

export type ManageIndexParamsRequest = {
  _action: 'delete' | 'list'
  selectedIds?: string[]
  loadDraft?: boolean
  type?: string
} & IndexQuery

export type ManageIndexParams = ManageIndexParamsRequest & { userId?: string, orgId?: string }

type ManageIndexResponse = EndpointResponse<TablePostConfig[]> & { indexMeta?: IndexMeta }

export class ManagePostIndex extends PostsQuery {
  async run(params: ManageIndexParams, _meta: EndpointMeta): Promise<ManageIndexResponse> {
    if (!params._action)
      throw abort('Action parameter is required.')

    switch (params._action) {
      case 'list':
        return this.list(params)
      case 'delete':
        return this.deletePosts(params.selectedIds)
      default:
        throw abort(`Unsupported action '${params._action as string}'`)
    }
  }

  private async list(args: ManageIndexParams): Promise<ManageIndexResponse> {
    const { orgId, limit = 10, offset = 0, filters = [], loadDraft = false, type = 'post' } = args

    if (!orgId)
      throw abort('orgId is required to list posts')

    let posts = await this.fetchPosts({ orgId, limit, offset, filters, type })

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

    const count = await this.fetchCount({ orgId, type })

    return {
      status: 'success',
      data: postsWithAuthors,
      indexMeta: { ...args, count, limit, offset },
    }
  }

  private async fetchPosts(args: { orgId: string, type: string } & IndexQuery) {
    const { orgId, limit = 20, offset = 0, filters = [], orderBy = 'updatedAt', order = 'desc', type = 'post', taxonomy } = args
    let baseQuery = this.db()
      .select<TablePostConfig[]>('*')
      .from(t.posts)
      .where({ orgId, type })
      .limit(limit)
      .offset(offset)
      .orderBy(orderBy, order)

    baseQuery = applyComplexFilters(baseQuery, filters)

    if (taxonomy) {
      baseQuery.join(t.taxonomy, `${t.taxonomy}.taxonomyId`, '=', `${t.posts}.taxonomyId`)

      if ('taxonomyId' in taxonomy) {
        baseQuery.where(`${t.taxonomy}.taxonomyId`, taxonomy.taxonomyId)
      }
      else if ('type' in taxonomy && 'slug' in taxonomy) {
        baseQuery.where(`${t.taxonomy}.type`, taxonomy.type)
          .where(`${t.taxonomy}.slug`, taxonomy.slug)
      }
    }

    return baseQuery
  }

  private async fetchCount(args: { orgId: string, type: string }): Promise<number> {
    const { orgId, type = 'post' } = args
    const result = await this.db()
      .count<{ count: string }>('*')
      .from(t.posts)
      .where({ orgId, type })
      .first()

    return Number.parseInt(result?.count || '0', 10)
  }

  private async deletePosts(selectedIds?: string[]): Promise<ManageIndexResponse> {
    if (!selectedIds || selectedIds.length === 0)
      throw abort('No posts selected for deletion')

    await this.db()(t.posts).whereIn('post_id', selectedIds).delete()

    return { status: 'success', message: 'Deleted successfully' }
  }
}

export type WherePost = { postId?: string, slug?: string } & ({ postId: string } | { slug: string })

export type ManagePostParamsRequest =
  | { _action: 'create', fields: Partial<TablePostConfig>, defaultTitle?: string }
  | { _action: 'update', where: WherePost, fields: Partial<TablePostConfig>, loadDraft?: boolean }
  | { _action: 'get', where: WherePost, select?: (keyof TablePostConfig | '*')[], loadDraft?: boolean }
  | { _action: 'delete', where: WherePost }
  | { _action: 'saveDraft', where: WherePost, fields: Partial<TablePostConfig> }
  | { _action: 'revertDraft', where: WherePost }
  | { _action: 'list', type?: string }

export type ManagePostParams = ManagePostParamsRequest & { userId?: string, orgId: string } & IndexQuery

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
      default:
        return { status: 'error', message: 'Invalid action' }
    }

    return r
  }

  private async listPosts(params: ManagePostParams & { _action: 'list' }, _meta: EndpointMeta): Promise<ManagePostResponse> {
    const {
      orgId,
      filters = [],
      limit = 10,
      offset = 0,
      orderBy = 'updatedAt',
      order = 'desc',
      type = 'post',
      taxonomy,
    } = params
    const db = this.db()

    let query = db
      .select<TablePostConfig[]>('*')
      .from(t.posts)
      .where({ orgId, type })
      .limit(limit)
      .offset(offset)
      .orderBy(orderBy, order)

    query = applyComplexFilters(query, filters)

    if (taxonomy) {
      query = query.join(t.taxonomy, `${t.taxonomy}.taxonomyId`, '=', `${t.posts}.taxonomyId`)
      if ('taxonomyId' in taxonomy) {
        query = query.where(`${t.taxonomy}.taxonomyId`, taxonomy.taxonomyId)
      }
      else if ('type' in taxonomy && 'slug' in taxonomy) {
        query = query.where(`${t.taxonomy}.type`, taxonomy.type)
          .where(`${t.taxonomy}.slug`, taxonomy.slug)
      }
    }

    const posts = await query

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

  private async countPosts(params: ManagePostParams & { _action: 'list' }, _meta: EndpointMeta): Promise<number> {
    const { orgId, filters = [], type = 'post', taxonomy } = params
    const db = this.db()

    let query = db
      .count<{ count: string }>('*')
      .from(t.posts)
      .where({ orgId, type })

    query = applyComplexFilters(query, filters)

    if (taxonomy) {
      query = query.join(t.taxonomy, `${t.taxonomy}.taxonomyId`, '=', `${t.posts}.taxonomyId`)
      if ('taxonomyId' in taxonomy) {
        query = query.where(`${t.taxonomy}.taxonomyId`, taxonomy.taxonomyId)
      }
      else if ('type' in taxonomy && 'slug' in taxonomy) {
        query = query.where(`${t.taxonomy}.type`, taxonomy.type)
          .where(`${t.taxonomy}.slug`, taxonomy.slug)
      }
    }

    const result = await query.first()

    const count = Number.parseInt(result?.count || '0', 10)

    return count
  }

  private async getPost(params: ManagePostParams & { _action: 'get' }, _meta: EndpointMeta): Promise<EndpointResponse<TablePostConfig[]>> {
    const { where, select = ['*'], loadDraft = false, orgId } = params
    const db = this.db()

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
      post.sites = await db.select([`${t.site}.siteId`, `${t.site}.title`]).from(t.postSite).join(t.site, `${t.site}.site_id`, `=`, `${t.postSite}.site_id`).where(`${t.postSite}.post_id`, post.postId)

      const q = db
        .select([`${t.taxonomy}.*`, `${t.postTaxonomies}.priority`])
        .from(t.postTaxonomies)
        .join(t.taxonomy, `${t.taxonomy}.taxonomy_id`, `=`, `${t.postTaxonomies}.taxonomy_id`)
        .where(`${t.postTaxonomies}.post_id`, post.postId)
        .orderBy(`${t.postTaxonomies}.priority`, 'asc')

      post.taxonomy = await q
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
    const r = await this.getPost({ _action: 'get', where, orgId, select: ['status', 'dateAt', 'slug'] }, { ...meta, caller: 'updatePostGetExisting' })

    const currentPost = r.data?.[0]
    if (!currentPost?.postId)
      throw abort('Post not found')

    const postId = currentPost.postId

    if (fields.slug && fields.slug !== currentPost.slug)
      fields.slug = await this.getSlugId({ orgId, postId, fields })

    const prepped = this.settings.fictionDb.prep({ type: 'insert', fields, meta, table: t.posts })

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
      this.updatePostTaxonomies({ postId, fields, orgId }),
      this.updateAssociations({ type: 'authors', postId, fields, orgId }),
      this.updateAssociations({ type: 'sites', postId, fields, orgId }),
    ])

    const final = await this.getPost({ ...params, _action: 'get' }, { ...meta, caller: 'updatePostEnd' })

    return { status: 'success', data: final.data, message: 'Post updated' }
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

      const uniqueOn = this.settings.fictionDb.getTable(t.taxonomy)?.uniqueOn || []

      // Insert new taxonomies and get their IDs
      const r = await db(t.taxonomy)
        .insert(insertItems)
        .onConflict(uniqueOn)
        .merge(['slug']) // return without changing anything (ignore wont return existing)
        .returning<{ taxonomyId: string }[]>('taxonomyId')

      insertedTaxonomyIds = r.map(t => t.taxonomyId)
    }

    return insertedTaxonomyIds
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

  // Handle the association between post and taxonomies
  private async updatePostTaxonomies(args: { postId: string, fields: TablePostConfig, orgId: string }) {
    const { postId, fields: { taxonomy = [] }, orgId } = args
    const db = this.db()

    const insertedTaxonomyIds = await this.insertNewTaxonomies({ taxonomy, orgId })

    const existingTaxonomies = await db.select('taxonomyId').from(t.postTaxonomies).where({ postId })
    const existingTaxonomyIds = existingTaxonomies.map(t => t.taxonomyId)

    const oldTaxonomiesIds = taxonomy.filter(tax => tax.taxonomyId).map(tax => tax.taxonomyId)
    const passedInTaxonomyIds = [...oldTaxonomiesIds, ...insertedTaxonomyIds]

    const toRemoveFromPost = existingTaxonomyIds.filter(id => !passedInTaxonomyIds.includes(id))

    // Remove old associations
    if (toRemoveFromPost.length > 0)
      await db.table(t.postTaxonomies).where({ postId }).whereIn('taxonomyId', toRemoveFromPost).delete()

    // Add new associations
    if (passedInTaxonomyIds.length > 0) {
      const newTaxonomies = passedInTaxonomyIds.map((taxonomyId, index) => ({ postId, taxonomyId, orgId, priority: index }))
      await db.table(t.postTaxonomies).insert(newTaxonomies).onConflict(['postId', 'taxonomyId']).merge(['priority'])
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

    const prepped = this.settings.fictionDb.prep({ type: 'insert', fields, meta, table: t.posts })

    const fieldsWithOrg = { type: 'post', status: 'draft', ...prepped, orgId, userId } as const
    const [{ postId }] = await db(t.posts).insert(fieldsWithOrg).returning('postId')

    const authors = fields.authors?.length ? fields.authors : [{ userId }]

    const associationFields = { ...fieldsWithOrg, taxonomy: fields.taxonomy, postId, authors } as const

    const associationParams = { ...params, fields: associationFields, postId, _action: 'update' } as const
    await Promise.all([
      this.updatePostTaxonomies(associationParams),
      this.updateAssociations({ type: 'authors', postId, orgId, fields: associationFields }),
      this.updateAssociations({ type: 'sites', postId, orgId, fields: associationFields }),
    ])

    const final = await this.getPost({ _action: 'get', where: { postId }, orgId }, { ...meta, caller: 'createPost' })

    return { status: 'success', data: final.data, message: 'Post created', isNew: true }
  }

  private async deletePost(args: ManagePostParams & { _action: 'delete' }, _meta: EndpointMeta): Promise<EndpointResponse<TablePostConfig[]>> {
    const { where, orgId } = args

    if (!orgId)
      throw abort('orgId is required to delete a post')

    const db = this.db()
    // Ensure the post exists before deleting it, error if it doesn't
    const r = await this.getPost({ _action: 'get', where, orgId }, { ..._meta, caller: 'deletePost' })

    const post = r.data?.[0]

    if (!post)
      throw abort('Post not found')

    await db(t.posts).where({ ...where, orgId }).delete()

    return { status: 'success', data: [post], message: 'Post deleted' }
  }

  private async saveDraft(params: ManagePostParams & { _action: 'saveDraft' }, meta: EndpointMeta): Promise<EndpointResponse<TablePostConfig[]>> {
    const db = this.db()
    const { where, fields, orgId } = params

    // Get current date and format
    const now = new Date()
    fields.updatedAt = now.toISOString()

    const currentDrafts = await db.select<TablePostConfig>('draft')
      .from(t.posts)
      .where(where)
      .first()

    const draft = (currentDrafts?.draft || {}) as TablePostConfig

    const keysToRemove = ['draft', 'postId', 'userId', 'orgId']

    keysToRemove.forEach((key) => {
      delete fields[key as keyof typeof fields]
    })

    // taxonomies are removed by prepare, due to joined table, saved directly in draft
    const taxonomy = fields.taxonomy || []
    const authors = fields.authors || []
    const sites = fields.sites || []
    const newDraft = { draftId: objectId({ prefix: 'dft' }), ...draft, ...fields, taxonomy, sites, authors, updatedAt: now, createdAt: draft.createdAt }

    // Persist the updated draft and history
    await db(t.posts)
      .where(where)
      .update({ draft: newDraft })

    // save any new taxonomies that are not already in the database
    if (fields.taxonomy?.length)
      await this.insertNewTaxonomies({ orgId, taxonomy: fields.taxonomy })

    const r = await this.getPost({ _action: 'get', where, orgId, loadDraft: true }, { ...meta, caller: 'saveDraft' })

    return { status: 'success', data: r.data }
  }

  private async revertDraft(params: ManagePostParams & { _action: 'revertDraft' }, meta: EndpointMeta): Promise<EndpointResponse<TablePostConfig[]>> {
    const { where, orgId } = params
    const db = this.db()

    await db(t.posts).where({ orgId, ...where }).update({ draft: '{}' })

    const r = await this.getPost({ _action: 'get', where, orgId, loadDraft: false }, { ...meta, caller: 'revertDraft' })

    return { status: 'success', message: 'Reverted to published version', data: r.data }
  }
}

export type ManageTaxonomyParamsRequest =
  | { _action: 'create', items: TableTaxonomyConfig[] | readonly TableTaxonomyConfig[] }
  | { _action: 'update', items: TableTaxonomyConfig[] | readonly TableTaxonomyConfig[] }
  | { _action: 'get', select?: (keyof TableTaxonomyConfig)[] | ['*'], selectors: { taxonomyId?: string, slug?: string }[] }
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
    const tbl = this.settings.fictionDb.getTable(t.taxonomy)
    const uniqueOn = tbl?.uniqueOn || []

    const results = await db(t.taxonomy).insert(refined).onConflict(uniqueOn).merge(['slug']).returning('*')

    return results
  }

  private async getTaxonomies(params: ManageTaxonomyParams & { _action: 'get' }, _meta: EndpointMeta): Promise<TableTaxonomyConfig[]> {
    const { selectors, select = ['*'], orgId } = params
    const db = this.db()

    if (!selectors || selectors.length === 0)
      throw abort('No selectors provided')

    const results = await Promise.all(selectors.map((s) => {
      const { slug, taxonomyId } = s
      const whereQuery = slug ? { slug, orgId } : { taxonomyId, orgId }

      const r = db.select(select)
        .from(t.taxonomy)
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
          `${t.taxonomy}.*`,
          db.raw('CAST(COUNT(DISTINCT ??) AS INTEGER) as usage_count', `${t.postTaxonomies}.post_id`),
        ])
          .from(t.taxonomy)
          .leftJoin(t.postTaxonomies, `${t.postTaxonomies}.taxonomy_id`, `${t.taxonomy}.taxonomy_id`)
          .where(`${t.taxonomy}.orgId`, '=', orgId)
          .groupBy(`${t.taxonomy}.taxonomy_id`)
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
      const r = await db(t.taxonomy)
        .where({ ...whereQuery, orgId })
        .update(item)
        .returning('*')

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
      const r = await db(t.taxonomy)
        .where({ ...whereQuery, orgId })
        .delete()
        .returning('*')

      return r[0]
    }))

    return results
  }
}
