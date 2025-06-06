import type { ComplexDataFilter, EndpointMeta, EndpointResponse } from '@fiction/core'
import type { Knex } from 'knex'
import type { FictionSites, Site, SitesPluginSettings } from './index.js'
import type { WhereSite } from './load.js'
import type { CardConfigPortable, TableCardConfig, TableSiteConfig } from './tables.js'
import { applyComplexFilters, dayjs, deepMerge, incrementSlugId, objectId, omit, Query, shortId } from '@fiction/core'
import { abort } from '@fiction/core/utils/error.js'
import { Card } from './card.js'
import { t } from './tables.js'
import { getPageWordCount } from './utils/page.js'
import { trackSiteMetrics } from './utils/site.js'

export type SitesQuerySettings = SitesPluginSettings & {
  fictionSites: FictionSites
}
export abstract class SitesQuery extends Query<SitesQuerySettings> {
  db = () => this.settings.fictionDb.client()
  constructor(settings: SitesQuerySettings) {
    super(settings)
  }

  getThemeById(themeId = 'base') {
    if (!themeId)
      throw abort('themeId required')

    const themes = this.settings.fictionSites.themes.value
    const theme = themes.find(t => t.themeId === themeId)

    if (!theme)
      throw abort(`theme not found - themeId: ${themeId} - available: ${themes.map(t => t.themeId).join(', ')}`)

    return theme
  }

  async siteFromConfig(params: { fields: Partial<TableSiteConfig> }, _meta: EndpointMeta): Promise<Site> {
    const { fields } = params
    const { themeId, siteId = objectId({ prefix: 'sit' }), orgId } = fields

    const { fictionSites, fictionRouterSites: siteRouter } = this.settings

    if (!orgId)
      throw abort('orgId required')

    const theme = this.getThemeById(themeId)

    const site = await theme.toSite({ siteRouter, fictionSites, ...fields, siteId })

    return site
  }

  async getOrg(args: { orgId?: string }) {
    const { orgId } = args

    if (!orgId)
      throw abort('orgId required')

    const orgResponse = await this.settings.fictionUser?.queries.ManageOrganization.serve(
      {
        _action: 'read',
        where: { orgId },
      },
      { server: true },
    )

    const org = orgResponse?.data

    if (!org) {
      throw new Error('Organization data not found for site')
    }

    return org
  }
}

type PageStandardFields = {
  orgId: string
  userId?: string
  siteId: string
  caller: string
  successMessage?: string
  scope: 'draft' | 'publish'
}

type WherePage = { cardId?: string, slug?: string } & ({ cardId: string } | { slug: string })

export type ManagePageRequestParams =
  | { _action: 'upsert', fields: CardConfigPortable[] }
  | { _action: 'retrieve', where: WherePage[] }
  | { _action: 'update', where: WherePage[], fields: Partial<CardConfigPortable> }
  | { _action: 'delete', where: WherePage[] }
  | { _action: 'list', where?: Partial<TableCardConfig>, limit?: number, offset?: number, page?: number }
  | { _action: 'count', filters?: ComplexDataFilter[] }
  | { _action: 'saveDraft', fields: CardConfigPortable[] }

export type ManagePageParams = ManagePageRequestParams & PageStandardFields

export class ManagePage extends Query<SitesQuerySettings> {
  limit = 40
  offset = 0

  constructor(settings: SitesQuerySettings) {
    super(settings)
  }

  async run(params: ManagePageParams, meta: EndpointMeta): Promise<EndpointResponse<TableCardConfig[]>> {
    const { _action, caller = 'unknown', successMessage } = params

    if (!_action)
      throw abort('_action required', { data: { caller } })

    let result: EndpointResponse<TableCardConfig[]>

    switch (_action) {
      case 'upsert':
        result = await this.upsertPages(params, meta)
        break
      case 'retrieve':
        result = await this.retrievePages(params, meta)
        break
      case 'update':
        result = await this.updatePages(params, meta)
        break
      case 'saveDraft':
        result = await this.saveDraft(params, meta)
        break
      case 'delete':
        result = await this.deletePages(params, meta)
        break
      case 'list':
        result = await this.listPages(params, meta)
        break
      case 'count':
        result = { status: 'success', data: [] } // added in addIndexMeta
        break
      default:
        throw abort('Invalid action')
    }

    result = await this.addIndexMeta(params, result, meta)
    return { ...result, message: successMessage ?? result.message }
  }

  private async addIndexMeta(params: ManagePageParams, r: EndpointResponse<TableCardConfig[]>, _meta?: EndpointMeta): Promise<EndpointResponse<TableCardConfig[]>> {
    const { siteId, orgId } = params
    const { limit = this.limit, offset = this.offset, filters = [] } = params as { limit?: number, offset?: number, filters?: ComplexDataFilter[] }

    let baseQuery = this.settings.fictionDb.client().table(t.pages).where({ siteId, orgId }).count().first<{ count: string }>()

    baseQuery = applyComplexFilters(baseQuery, filters)

    const { count } = await baseQuery

    r.indexMeta = { limit, offset, count: +count, ...r.indexMeta }

    return r
  }

  private async upsertPages(params: ManagePageParams & { _action: 'upsert' }, meta: EndpointMeta): Promise<EndpointResponse<TableCardConfig[]>> {
    const { fields, siteId, orgId, caller } = params
    const db = this.settings.fictionDb?.client()
    if (!db)
      throw abort('no db')

    const upsertedPages: TableCardConfig[] = []

    for (const field of fields) {
      // Calculate total word count including nested cards
      const wordCount = await getPageWordCount({ page: field })

      const card = new Card(field)
      const preparedFields = this.settings.fictionDb.prep({
        type: 'insert',
        fields: { ...card.toConfig(), wordCount },
        table: t.pages,
        meta,
      })

      await this.handleSpecialSlugConflicts({ slug: preparedFields.slug, cardId: card.cardId, siteId, db })

      const where = { siteId, slug: preparedFields.slug || 'page' }
      if (!where.slug)
        throw abort(`UPSERT(where clause): 'slug' required from ${caller}`, { data: { field, caller } })

      const insertFields = { ...preparedFields, orgId, siteId }

      const anotherExistingPage = await db
        .select('*')
        .from(t.pages)
        .where(where)
        .whereNot({ card_id: card.cardId })
        .first()

      if (anotherExistingPage) {
        insertFields.slug = incrementSlugId(preparedFields.slug)
      }

      const [upsertedPage] = await db
        .insert(insertFields)
        .into(t.pages)
        .onConflict(['card_id'])
        .merge()
        .returning<TableCardConfig[]>('*')

      upsertedPages.push(upsertedPage)
    }

    return { status: 'success', data: upsertedPages, message: 'Pages upserted successfully', indexMeta: { changedCount: upsertedPages.length } }
  }

  private async retrievePages(params: ManagePageParams & { _action: 'retrieve', where: WherePage[] }, _meta: EndpointMeta): Promise<EndpointResponse<TableCardConfig[]>> {
    const { where, siteId, orgId, scope = 'publish' } = params
    const db = this.settings.fictionDb?.client()
    if (!db)
      throw abort('no db')

    if (!Array.isArray(where) || where.length === 0)
      throw abort('where must be a non-empty array of conditions')

    // Create a query builder
    const query = db.select<TableCardConfig[]>().from(t.pages).where({ siteId, orgId })

    // Build the WHERE clause using OR conditions for each item in the where array
    query.where(function () {
      where.forEach((condition, _index) => {
        this.orWhere(function () {
          if (condition.cardId)
            this.where('card_id', condition.cardId)
          if (condition.slug)
            this.where('slug', condition.slug)
        })
      })
    })

    // Execute the query
    let pages = await query

    if (pages.length === 0) {
      this.log.info('No pages found', { data: { where, siteId, orgId } })
      return { status: 'error', data: [] }
    }

    if (scope === 'draft') {
      pages = pages.map((page) => {
        const p = page.draft ? deepMerge<TableCardConfig>([page, page.draft as TableCardConfig]) : page

        // Remove draft from the response
        const { draft, ...rest } = p

        return rest
      })
    }

    return { status: 'success', data: pages }
  }

  private async updatePages(params: ManagePageParams & { _action: 'update' }, meta: EndpointMeta): Promise<EndpointResponse<TableCardConfig[]>> {
    const { where, fields, siteId, orgId } = params
    const db = this.settings.fictionDb?.client()
    if (!db)
      throw abort('no db')

    if (!Array.isArray(where)) {
      return { status: 'error', message: 'where must be an array of conditions' }
    }

    const prepped = this.settings.fictionDb.prep({ type: 'update', fields, meta, table: t.pages })

    const updatedPages: TableCardConfig[] = []
    for (const condition of where) {
      const result = await db
        .table(t.pages)
        .where({ siteId, orgId, ...condition })
        .update({ ...prepped, updatedAt: new Date().toISOString() })
        .returning('*')

      updatedPages.push(...result)
    }

    return { status: 'success', data: updatedPages, message: 'Pages updated successfully', indexMeta: { changedCount: updatedPages.length } }
  }

  private async deletePages(params: ManagePageParams & { _action: 'delete' }, _meta: EndpointMeta): Promise<EndpointResponse<TableCardConfig[]>> {
    const { where, siteId, orgId } = params
    const db = this.settings.fictionDb?.client()
    if (!db)
      throw abort('no db')

    if (!Array.isArray(where)) {
      return { status: 'error', message: 'where must be an array of conditions' }
    }

    const deletedPages: TableCardConfig[] = []
    for (const condition of where) {
      const result = await db
        .table(t.pages)
        .where({ siteId, orgId, ...condition })
        .delete()
        .returning('*')

      deletedPages.push(...result)
    }

    return { status: 'success', data: deletedPages, message: 'Pages deleted successfully', indexMeta: { changedCount: deletedPages.length } }
  }

  private async listPages(params: ManagePageParams & { _action: 'list' }, _meta: EndpointMeta): Promise<EndpointResponse<TableCardConfig[]>> {
    const { where, siteId, orgId, scope = 'publish' } = params
    let { limit = this.limit, offset = this.offset, page } = params
    const db = this.settings.fictionDb?.client()
    if (!db)
      throw abort('no db')

    if (page && page > 0) {
      offset = (page - 1) * limit
    }

    let pages = await db
      .select<TableCardConfig[]>('*')
      .from(t.pages)
      .where({ siteId, orgId, ...where })
      .limit(limit)
      .offset(offset)
      .orderBy('updated_at', 'desc')

    if (scope === 'draft') {
      pages = pages.map((page) => {
        return page.draft ? deepMerge<TableCardConfig>([page, page.draft as TableCardConfig]) : page
      })
    }

    return { status: 'success', data: pages }
  }

  private async handleSpecialSlugConflicts(args: { slug?: string, cardId?: string, siteId: string, db: Knex }): Promise<void> {
    const { slug, siteId, db, cardId } = args
    if (!slug?.startsWith('_') || !cardId)
      return

    const updateExistingSlug = async (loopSlug: string): Promise<void> => {
      const newSlug = incrementSlugId(loopSlug)

      const existingNewSlug = await db.select('slug')
        .from(t.pages)
        .where({ slug: newSlug, siteId })
        .first()

      if (!existingNewSlug) {
        await db.table(t.pages)
          .where({ slug, siteId })
          .whereNot({ card_id: cardId })
          .update({ slug: newSlug })
      }
      else {
        await updateExistingSlug(newSlug)
      }
    }

    return updateExistingSlug(slug)
  }

  private async saveDraft(params: ManagePageParams & { _action: 'saveDraft' }, meta: EndpointMeta): Promise<EndpointResponse<TableCardConfig[]>> {
    const { siteId, orgId, fields } = params
    const db = this.settings.fictionDb.client()

    const now = new Date()

    const saveDraftPromises = fields.map(async (cardConfig) => {
      const card = new Card(cardConfig)
      const cardId = card.cardId

      const currentDraft = await db
        .select<TableCardConfig[]>('draft')
        .from(t.pages)
        .where({ siteId, orgId, card_id: cardId })
        .first()

      const draft = (currentDraft?.draft || {}) as TableCardConfig

      const fields = card.toConfig()

      const keysToRemove = ['draft', 'cardId', 'userId', 'orgId']
      keysToRemove.forEach((key) => {
        delete fields[key as keyof typeof fields]
      })

      const newDraft = {
        draftId: objectId({ prefix: 'drf' }),
        ...fields,
        updatedAt: now.toISOString(),
        createdAt: draft.createdAt || now.toISOString(),
      }

      await db(t.pages)
        .where({ siteId, orgId, card_id: cardId })
        .update({ draft: JSON.stringify(newDraft) })
        .returning('*')

      const r = await this.retrievePages({ _action: 'retrieve', where: [{ cardId }], siteId, orgId, scope: 'draft', caller: 'endOfSaveDraft' }, meta)
      const pg = r.data?.[0]

      if (!pg) {
        throw new Error('Page not found after saving draft')
      }
      return pg
    })

    const updatedDrafts = await Promise.all(saveDraftPromises)

    return { status: 'success', data: updatedDrafts }
  }
}

type SiteStandardFields = {
  orgId?: string
  userId?: string
  isPublishingDomains?: boolean
  caller: string
  successMessage?: string
  fields?: Partial<TableSiteConfig>
  where?: WhereSite
  scope?: 'draft' | 'publish'
  revisionId?: string
}

export type ManageSiteRequestParams =
  | { _action: 'create', fields: Partial<TableSiteConfig> }
  | { _action: 'update', where: WhereSite, fields: Partial<TableSiteConfig> }
  | { _action: 'saveDraft', where: WhereSite, fields: Partial<TableSiteConfig> }
  | { _action: 'revertDraft', where: WhereSite }
  | { _action: 'delete', where: WhereSite }
  | { _action: 'retrieve', where: WhereSite }
  | { _action: 'restoreFromRevision', where: WhereSite, revisionId: string }

export type ManageSiteParams = ManageSiteRequestParams & SiteStandardFields

export class ManageSite extends SitesQuery {
  async run(params: ManageSiteParams, meta: EndpointMeta): Promise<EndpointResponse<TableSiteConfig>> {
    const { _action, caller = 'unknown', successMessage } = params

    if (!_action)
      throw abort('_action required', { data: { caller } })

    let result: EndpointResponse<TableSiteConfig>

    switch (_action) {
      case 'create':
        result = await this.createSite(params as ManageSiteParams & { _action: 'create' }, meta)
        break
      case 'retrieve':
        result = await this.retrieveSite(params as ManageSiteParams & { _action: 'retrieve' }, meta)
        break
      case 'update':
        result = await this.updateSite(params as ManageSiteParams & { _action: 'update' }, meta)
        break
      case 'saveDraft':
        result = await this.saveDraft(params, meta)
        break
      case 'revertDraft':
        result = await this.revertDraft(params as ManageSiteParams & { _action: 'revertDraft' }, meta)
        break
      case 'delete':
        result = await this.deleteSite(params as ManageSiteParams & { _action: 'delete' }, meta)
        break
      case 'restoreFromRevision':
        result = await this.restoreFromRevision(params as ManageSiteParams & { _action: 'restore' }, meta)
        break
      default:
        throw abort('Invalid action')
    }

    if ((_action === 'update' || _action === 'create') && result.data?.siteId) {
      result = await this.finalizeSiteAction(params, result, meta)
    }

    return { ...result, message: successMessage ?? result.message }
  }

  private async createSite(params: ManageSiteParams & { _action: 'create' }, meta: EndpointMeta): Promise<EndpointResponse<TableSiteConfig>> {
    const { fields, userId, orgId } = params
    if (!orgId)
      throw abort('orgId required')

    const themeSite = await this.createSiteFromTheme(params, meta)

    const db = this.db()

    // Check if this organization has any sites
    const existingSites = await db(t.sites)
      .where({ orgId })
      .count<{ count: string }>('* as count')
      .first()

    const isFirstSite = existingSites?.count === '0'

    // Set isPrimary if it's the first site or explicitly requested
    const isPrimary = isFirstSite || fields.isPrimary

    const scope = 'publish'

    const defaultSubDomain = meta.bearer?.email?.split('@')[0] || 'site'
    const mergedFields = deepMerge([themeSite, { subDomain: `${defaultSubDomain}-${shortId({ len: 4 })}`, isPrimary }, fields])

    // If this site should be primary, unset primary on other sites
    if (isPrimary) {
      await db(t.sites)
        .where({ orgId, isPrimary: true })
        .update({ isPrimary: false })
    }

    const prepped = this.settings.fictionDb.prep({ type: 'insert', fields: mergedFields, table: t.sites, meta })

    const [site] = await this.settings.fictionDb.client().insert({ orgId, userId, ...prepped }).into(t.sites).onConflict('site_id').ignore().returning<TableSiteConfig[]>('*')

    if (!site?.siteId)
      throw abort('site not created')

    await this.updateSitePages({ siteId: site.siteId, fields: themeSite.pages || [], userId, orgId, scope }, meta)

    const finalSite = await this.fetchSiteWithDetails({ selector: { siteId: site.siteId }, scope })

    return { status: 'success', data: finalSite, message: 'site created' }
  }

  private async retrieveSite(params: ManageSiteParams & { _action: 'retrieve' }, _meta: EndpointMeta): Promise<EndpointResponse<TableSiteConfig>> {
    const { where, scope = 'publish' } = params
    const selector = await this.getSiteSelector(where)

    this.log.debug('retrieving site', { data: { selector, caller: `retrieve:${params.caller}` } })

    const site = await this.fetchSiteWithDetails({ selector, scope })

    if (!site?.siteId) {
      this.log.debug('ManageSite: Site not found', { data: { where, caller: params.caller } })
      return { status: 'error', message: 'Site not found', meta: { where, caller: params.caller }, expose: false }
    }

    return { status: 'success', data: site }
  }

  private async updateSite(params: ManageSiteParams & { _action: 'update' }, meta: EndpointMeta): Promise<EndpointResponse<TableSiteConfig>> {
    const { fields, where, userId, orgId, scope = 'publish' } = params
    if (!userId || !orgId)
      throw abort('orgId required')

    if (scope === 'draft') {
      return this.saveDraft({ ...params, _action: 'saveDraft' }, meta)
    }

    const selector = await this.getSiteSelector(where)

    const prepped = this.settings.fictionDb.prep({ type: 'update', fields, table: t.sites, meta })

    const db = this.settings.fictionDb.client()

    if (fields.isPrimary) {
      await db(t.sites)
        .where({ orgId })
        .whereNot(selector)
        .update({ isPrimary: false })
    }

    let updatedSite: TableSiteConfig | undefined

    await db.transaction(async (trx) => {
      [updatedSite] = await trx(t.sites)
        .update({ orgId, userId, ...prepped, draft: {} })
        .where({ orgId, ...selector })
        .returning('*')

      if (!updatedSite)
        throw abort('site not found')

      // If updating in publish mode, clear all drafts
      if (scope === 'publish') {
        await this.clearSiteDrafts(trx, { siteId: updatedSite.siteId }, orgId)
      }
    })

    if (!updatedSite)
      throw abort('updated site not found')

    if (fields.pages && fields.pages.length) {
      await this.updateSitePages({ siteId: updatedSite.siteId, fields: fields.pages, userId, orgId, scope }, meta)
    }

    const finalSite = await this.fetchSiteWithDetails({ selector, scope })

    if (updatedSite && scope === 'publish') {
      // Create revision when publishing
      await this.settings.fictionRevision.createRevision({
        itemId: updatedSite.siteId,
        itemType: 'site',
        itemData: omit(updatedSite, 'draft'),
        title: 'Published version',
        description: 'Site update published',
        orgId,
        userId,
      }, { skipTimeCheck: true })
    }

    return { status: 'success', data: finalSite, message: 'site saved' }
  }

  private async saveDraft(params: ManageSiteParams & { _action: 'saveDraft' }, meta: EndpointMeta): Promise<EndpointResponse<TableSiteConfig>> {
    const db = this.settings.fictionDb.client()
    const { where, fields, orgId, userId } = params

    if (!orgId)
      throw abort('orgId required', meta)

    if (!userId)
      throw abort('userId required', meta)

    // Get current date and format
    const now = new Date()
    fields.updatedAt = now.toISOString()

    const currentDrafts = await db.select<TableSiteConfig>('draft')
      .from(t.sites)
      .where(where)
      .first()

    const draft = (currentDrafts?.draft || {}) as TableSiteConfig

    const draftPages = fields.pages || []

    const keysToRemove = ['draft', 'siteId', 'userId', 'orgId', 'pages']

    keysToRemove.forEach((key) => {
      delete fields[key as keyof typeof fields]
    })

    // taxonomies are removed by prepare, due to joined table, saved directly in draft
    const newDraft = { draftId: objectId({ prefix: 'sdf' }), ...fields, updatedAt: now, createdAt: draft.createdAt }

    // Persist the updated draft and history
    const [site] = await db(t.sites)
      .where(where)
      .update({ draft: JSON.stringify(newDraft) })
      .returning<TableSiteConfig[]>('*')

    if (draftPages && draftPages.length) {
      await this.updateSitePages({ siteId: site.siteId, orgId, fields: draftPages, userId, scope: 'draft' }, meta)
    }

    const r = await this.retrieveSite({ _action: 'retrieve', scope: 'draft', caller: 'saveDraft', where }, meta)

    const finalSite = r.data
    if (finalSite) {
      await this.settings.fictionRevision.createRevision({
        itemId: finalSite.siteId,
        itemType: 'site',
        itemData: omit(finalSite, 'draft'),
        title: 'Draft autosave',
        description: `Revision saved at ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
        orgId,
        userId,
      }, { skipTimeCheck: false }) // Use time limit for drafts
    }

    return { status: 'success', data: finalSite }
  }

  async clearSiteDrafts(db: Knex, selector: WhereSite, orgId: string): Promise<TableSiteConfig | null> {
    return db.transaction(async (trx) => {
      // Clear site draft
      const [updatedSite] = await trx(t.sites)
        .where({ orgId, ...selector })
        .update({ draft: '{}' })
        .returning('*')

      if (!updatedSite) {
        return null
      }

      // Clear page drafts
      await trx(t.pages)
        .where({ siteId: updatedSite.siteId })
        .update({ draft: '{}' })

      return updatedSite
    })
  }

  private async revertDraft(params: ManageSiteParams & { _action: 'revertDraft' }, meta: EndpointMeta): Promise<EndpointResponse<TableSiteConfig>> {
    const { where, orgId } = params

    if (!orgId)
      throw abort('orgId required')

    const selector = await this.getSiteSelector(where)

    const db = this.settings.fictionDb.client()

    const updatedSite = await this.clearSiteDrafts(db, selector, orgId)

    if (!updatedSite) {
      throw abort('Site not found')
    }

    // Fetch the updated site with reverted drafts
    const result = await this.retrieveSite({
      _action: 'retrieve',
      where: { siteId: updatedSite.siteId },
      orgId,
      caller: 'revertDraft',
      scope: 'publish', // Use 'publish' to get the site without draft data
    }, meta)

    return {
      ...result,
      message: 'Site reverted successfully',
    }
  }

  private async deleteSite(params: ManageSiteParams & { _action: 'delete' }, _meta: EndpointMeta): Promise<EndpointResponse<TableSiteConfig>> {
    const { where, orgId } = params
    const db = this.settings.fictionDb.client()
    if (!db)
      throw abort('no db')

    const selector = await this.getSiteSelector(where)

    // Use a transaction to ensure both operations succeed or fail together
    const deletedSite = await db.transaction(async (trx) => {
      // First delete all pages associated with the site
      await trx(t.pages)
        .where({
          siteId: selector.siteId,
          orgId,
        })
        .delete()

      // Then delete the site itself
      const [site] = await trx(t.sites)
        .where({
          orgId,
          ...selector,
        })
        .delete()
        .returning<TableSiteConfig[]>('*')

      return site
    })

    if (!deletedSite)
      throw abort('site not found')

    return { status: 'success', data: deletedSite, message: 'site deleted' }
  }

  private async finalizeSiteAction(params: ManageSiteParams, result: EndpointResponse<TableSiteConfig>, meta: EndpointMeta): Promise<EndpointResponse<TableSiteConfig>> {
    const { siteId } = result.data!

    const updatedResult = await this.run({
      _action: 'retrieve',
      where: { siteId },
      userId: params.userId,
      orgId: params.orgId,
      caller: 'finalizeSiteAction',
    }, { ...meta, caller: 'endManageSite' })

    if (params._action === 'create') {
      this.log.info('SITE CREATED', { data: params })
    }

    return updatedResult
  }

  private async updateSitePages(args: { siteId: string, fields: CardConfigPortable[], userId?: string, orgId: string, scope: 'draft' | 'publish' }, meta: EndpointMeta) {
    const { siteId, fields, userId, orgId, scope } = args
    const result = this.settings.fictionSites.queries.ManagePage.serve({
      siteId,
      scope,
      _action: scope === 'draft' ? 'saveDraft' : 'upsert',
      fields,
      userId,
      orgId,
      caller: 'updateSite',
    }, meta)

    await trackSiteMetrics({ orgId, fictionSites: this.settings.fictionSites })

    return result
  }

  private async fetchSiteWithDetails(args: { selector: WhereSite, scope: 'draft' | 'publish' }): Promise<TableSiteConfig | undefined> {
    const { selector, scope = 'publish' } = args
    const db = this.settings.fictionDb.client()

    // Get base site data
    let site = await db
      .select<TableSiteConfig>('*')
      .from(t.sites)
      .where(selector)
      .first()

    if (!site?.siteId) {
      return undefined
    }

    try {
      const siteOrg = await this.getOrg({ orgId: site.orgId })

      // Apply draft changes if needed
      if (scope === 'draft') {
        site = deepMerge([site, site.draft as TableSiteConfig])
      }

      // Get pages
      const pagesResponse = await this.settings.fictionSites.queries.ManagePage.serve({
        _action: 'list',
        orgId: site.orgId,
        siteId: site.siteId,
        limit: 200,
        offset: 0,
        caller: 'fetchSiteWithDetails',
        scope,
      }, { server: true })

      // Assemble final site object
      const siteData = {
        ...omit(site, 'draft'), // Remove draft from base
        pages: pagesResponse.data || [],
        org: siteOrg, // Always include org, even if empty object
      }

      return siteData
    }
    catch (error) {
      this.log.error('Error fetching site details', {
        error,
        data: { siteId: site.siteId, orgId: site.orgId },
      })

      // Return basic site data with empty org object if error occurs
      return {
        ...omit(site, 'draft'),
        pages: [],
        org: {},
      }
    }
  }

  async createSiteFromTheme(params: ManageSiteParams & { _action: 'create' }, _meta: EndpointMeta): Promise<Partial<TableSiteConfig>> {
    const { fields, userId, orgId } = params
    const { themeId } = fields

    if (!orgId)
      throw abort('orgId required')

    const fictionSites = this.settings.fictionSites
    const siteRouter = this.settings.fictionRouterSites

    const theme = this.getThemeById(themeId)
    const siteId = objectId({ prefix: 'sit' })

    const site = await theme.toSite({ siteRouter, fictionSites, ...fields, userId, orgId, siteId })

    return site.toConfig()
  }

  async getSiteSelector(where: WhereSite) {
    const db = this.settings.fictionDb.client()

    // If siteId is already provided, return immediately
    if (!where.hostname && !where.orgId && !where.subDomain) {
      return where
    }

    // If hostname is provided, find the orgId first
    if (where.hostname) {
      const { hostname } = where
      const rootDomain = hostname.split('.').slice(1).join('.')
      const shouldCheckRoot = rootDomain !== hostname

      // Find domain to get the orgId
      const domain = await db
        .select('*')
        .from(t.domains)
        .where((builder) => {
          builder.where({ hostname })
          if (shouldCheckRoot) {
            builder.orWhere({ hostname: rootDomain })
          }
        })
      // Prioritize verified primary domains, then verified, then exact matches
        .orderByRaw(`
        is_verified DESC,
        is_primary DESC,
        hostname = ? DESC
      `, [hostname])
        .first()

      // If we have a direct site match, return it
      if (domain?.siteId) {
        return { siteId: domain.site_id }
      }

      if (!domain?.orgId) {
        this.log.error('Error Loading Site', { data: { where, domain } })
        throw new Error(`Site not found (where:${JSON.stringify(where)})`)
      }

      // Use the orgId to find the site
      where = { orgId: domain.orgId }
    }
    else if (where.subDomain) {
      const org = await db
        .select('org_id')
        .from(t.org)
        .where({ handle: where.subDomain })
        .first()

      if (!org?.orgId) {
        this.log.error('Error Loading Site', { data: { where, org } })
        throw new Error(`Site not found (where:${JSON.stringify(where)})`)
      }
      where = { orgId: org.orgId }
    }

    // Handle orgId case (which now includes hostname lookups)
    if (where.orgId) {
      // First try to find a primary site
      let site = await db
        .select('site_id')
        .from(t.sites)
        .where({
          orgId: where.orgId,
          isPrimary: true,
        })
        .first()

      // If no primary site, fall back to most recently updated
      if (!site?.siteId) {
        site = await db
          .select('*')
          .from(t.sites)
          .where({ orgId: where.orgId })
          .orderBy('updated_at', 'desc')
          .first()
      }

      if (!site?.siteId) {
        this.log.error('No site found for organization', { data: where })
        throw new Error(`No site found for organization: ${where.orgId}`)
      }

      return { siteId: site.siteId }
    }

    throw new Error(`Invalid selector: ${JSON.stringify(where)}`)
  }

  private async restoreFromRevision(params: ManageSiteParams & { _action: 'restore' }, meta: EndpointMeta): Promise<EndpointResponse<TableSiteConfig>> {
    const { where, orgId, userId, revisionId } = params

    if (!userId || !orgId)
      throw abort('orgId and userId required', meta)

    if (!revisionId)
      throw abort('revisionId required', meta)

    const selector = await this.getSiteSelector(where)

    const r = await this.settings.fictionRevision.getRevisionData({
      revisionId,
      orgId,
      userId,
      meta,
    })

    const revision = r.data

    if (!revision)
      return { status: 'error', message: 'Revision not found' }

    // Validate revision matches site
    if (revision.itemType !== 'site' || revision.itemId !== selector.siteId) {
      throw abort('Invalid revision for this site', meta)
    }

    // Create backup revision of current state
    const currentSite = await this.retrieveSite({
      _action: 'retrieve',
      where: selector,
      orgId,
      userId,
      caller: 'restoreBackup',
    }, meta)

    if (currentSite.data) {
      await this.settings.fictionRevision.createRevision({
        itemId: selector.siteId,
        itemType: 'site',
        itemData: currentSite.data,
        title: 'Pre-restore backup',
        description: `Auto-created before restoring to revision ${revisionId}`,
        orgId,
        userId,
      }, { skipTimeCheck: true })
    }

    // Restore site data
    return this.updateSite({
      _action: 'update',
      where: selector,
      fields: revision.itemData as Partial<TableSiteConfig>,
      orgId,
      userId,
      caller: 'restoreRevision',
    }, meta)
  }
}

interface ManageSitesParams {
  _action: 'delete' | 'list'
  userId?: string
  orgId: string
  limit?: number
  offset?: number
  selectedIds?: string[]
  filters?: ComplexDataFilter[]
}
export class ManageSites extends SitesQuery {
  async run(
    params: ManageSitesParams,
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<TableSiteConfig[]>> {
    const { _action, orgId, limit = 10, offset = 0, filters = [] } = params

    if (!_action)
      throw abort('action required')

    const db = this.settings.fictionDb.client()

    const message: string | undefined = undefined
    let sites: TableSiteConfig[] | undefined

    let count = 0
    if (_action === 'list') {
      let baseQuery = db
        .select([
          `${t.sites}.*`,
        ])
        .from(t.sites)
        .where(`${t.sites}.org_id`, orgId)
        .limit(limit)
        .offset(offset)
        .orderBy('is_primary', 'desc') // Order by primary status first
        .orderBy('updatedAt', 'desc')
        .groupBy(`${t.sites}.site_id`)

      baseQuery = applyComplexFilters(baseQuery, filters)

      const rows = await baseQuery

      sites = rows

      const r = await db
        .count<{ count: string }>('*')
        .from(t.sites)
        .where({ orgId })
        .first()

      count = +(r?.count || 0)
    }

    const org = await this.getOrg({ orgId })

    const data = sites?.map(site => ({ ...omit(site, 'draft'), org }))

    return {
      status: 'success',
      data,
      message,
      indexMeta: { count, limit, offset },
      params,
    }
  }
}
