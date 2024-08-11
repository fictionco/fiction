import type { DataFilter, EndpointMeta, EndpointResponse } from '@fiction/core'
import { Query, deepMerge, incrementSlugId, objectId, shortId } from '@fiction/core'
import type { Knex } from 'knex'
import { abort } from '@fiction/core/utils/error.js'
import type { CardConfigPortable, TableCardConfig, TableDomainConfig, TableSiteConfig } from './tables.js'
import { tableNames } from './tables.js'
import { updateSiteCerts } from './utils/cert.js'
import { Card } from './card.js'
import type { WhereSite } from './load.js'
import type { FictionSites, Site, SitesPluginSettings } from './index.js'

export type SitesQuerySettings = SitesPluginSettings & {
  fictionSites: FictionSites
}
export abstract class SitesQuery extends Query<SitesQuerySettings> {
  constructor(settings: SitesQuerySettings) {
    super(settings)
  }

  getThemeById(themeId?: string) {
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
}

type ManagePageParams = {
  siteId: string
  userId?: string
  orgId: string
  successMessage?: string
  caller: string
} & ({ _action: 'upsert', fields: CardConfigPortable } | { _action: 'retrieve' | 'delete', fields: CardConfigPortable })

export class ManagePage extends SitesQuery {
  private async handleUpsert(args: {
    fields: CardConfigPortable
    siteId: string
    orgId: string
    userId?: string
    caller: string
  }, meta: EndpointMeta): Promise<TableCardConfig> {
    const { siteId, orgId, userId, caller } = args

    const fields = new Card(args.fields).toConfig()

    if (!siteId)
      throw abort(`UPSERT: siteId field required from ${caller}`, { data: { fields, caller } })

    const fictionDb = this.settings.fictionDb
    const db = fictionDb?.client()
    if (!db)
      throw abort('no db')

    const prepped = fictionDb.prep({ type: 'insert', fields, table: tableNames.pages, meta })

    await this.specialSlugConflicts({ slug: prepped.slug, cardId: fields.cardId, siteId, db })

    // all are needed to do propper recursion, without slug it infintely loops
    const where = { siteId, slug: prepped.slug || `page` }

    for (const key in where) {
      if (!where[key as keyof typeof where])
        throw abort(`UPSERT(where clause): '${key}' required from ${caller}`, { data: { fields, caller } })
    }

    const insertFields = { ...prepped, orgId, siteId }

    // Check if the combination of slug, regionId, and siteId already exists
    const query = db
      .select('*')
      .from(tableNames.pages)
      .where(where)
      .whereNot({ card_id: fields.cardId })
      .first()

    const existingPage = await query

    if (existingPage) {
      // If the combination exists, increment the slug and retry the upsert
      const incrementedSlugId = incrementSlugId(prepped.slug)
      return this.handleUpsert({ caller, fields: { ...fields, slug: incrementedSlugId }, orgId, userId, siteId }, meta)
    }

    const [region] = await db
      .insert(insertFields)
      .into(tableNames.pages)
      .onConflict(['card_id'])
      .merge()
      .returning<TableCardConfig[]>('*')

    return region
  }

  private async specialSlugConflicts(args: { slug?: string, cardId?: string, siteId: string, db: Knex }) {
    const { slug, siteId, db, cardId } = args
    if (!slug?.startsWith('_') || !cardId)
      return

    // recursively check for existing slugs, and iterate until a unique slug is found
    const updateExistingSlug = async (loopSlug: string) => {
      const newSlug = incrementSlugId(loopSlug)

      const existingNewSlug = await db.select('slug')
        .from(tableNames.pages)
        .where({ slug: newSlug, siteId })
        .first()

      if (!existingNewSlug) {
        await db.table(tableNames.pages)
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

  async run(
    params: ManagePageParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<TableCardConfig>> {
    const db = this.settings.fictionDb?.client()
    if (!db)
      throw abort('no db')

    const { _action, fields, siteId, orgId, userId, successMessage = '', caller } = params

    const message = successMessage
    let data: TableCardConfig | undefined

    if (_action === 'upsert') {
      data = await this.handleUpsert({ fields, siteId, orgId, userId, caller }, meta)
    }
    else if (_action === 'retrieve') {
      const { cardId, slug } = fields

      if (!cardId && !slug)
        throw abort('cardId or slug required to retrieve page')

      const where = cardId ? { orgId, cardId } : { siteId, slug }

      data = await db.select().from(tableNames.pages).where(where).first()

      if (!data) {
        this.log.info('Page not found', { data: { where, cardId, _action, caller } })
        throw new Error('Page not found')
      }
    }
    else if (_action === 'delete') {
      const { cardId } = fields

      if (!cardId)
        throw abort('cardId required', { data: { caller } })

      await db.delete().from(tableNames.pages).where({ orgId, cardId })

      data = undefined
    }

    return { status: 'success', data, message }
  }
}

type StandardFields = {
  orgId?: string
  userId?: string
  isPublishingDomains?: boolean
  caller: string
  successMessage?: string
  disableLog?: boolean
  fields?: Partial<TableSiteConfig>
  where?: WhereSite
}

export type ManageSiteRequestParams =
  | { _action: 'create', fields: Partial<TableSiteConfig> }
  | { _action: 'update', where: WhereSite, fields: Partial<TableSiteConfig> }
  | { _action: 'delete', where: WhereSite }
  | { _action: 'retrieve', where: WhereSite }

export type ManageSiteParams = ManageSiteRequestParams & StandardFields

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
      case 'delete':
        result = await this.deleteSite(params as ManageSiteParams & { _action: 'delete' }, meta)
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

    this.log.info(`creating site: ${fields.title}`, { data: { orgId, fields } })

    const themeSite = await this.createSiteFromTheme(params, meta)
    const defaultSubDomain = meta.bearer?.email?.split('@')[0] || 'site'
    const mergedFields = deepMerge([themeSite, { subDomain: `${defaultSubDomain}-${shortId({ len: 4 })}` }, fields])

    const prepped = this.settings.fictionDb.prep({ type: 'update', fields: mergedFields, table: tableNames.sites, meta })
    const [site] = await this.settings.fictionDb.client()
      .insert({ orgId, userId, ...prepped })
      .into(tableNames.sites)
      .returning<TableSiteConfig[]>('*')

    if (!site?.siteId)
      throw abort('site not created')

    await this.createSitePages({ siteId: site.siteId, pages: themeSite.pages, userId, orgId }, meta)
    await this.settings.fictionMonitor?.slackNotify({ message: '*New Site Created*', data: site })

    return { status: 'success', data: site, message: 'site created' }
  }

  private async retrieveSite(params: ManageSiteParams & { _action: 'retrieve' }, meta: EndpointMeta): Promise<EndpointResponse<TableSiteConfig>> {
    const { where, disableLog } = params
    const selector = await this.getSiteSelector(where)

    if (!disableLog)
      this.log.info('retrieving site', { data: { selector, caller: `retrieve:${params.caller}` } })

    const site = await this.fetchSiteWithDetails(selector)

    if (!site?.siteId) {
      this.log.warn('ManageSite: Site not found', { data: { where, caller: params.caller } })
      return { status: 'error', message: 'Site not found', meta: { where, caller: params.caller }, expose: false }
    }

    return { status: 'success', data: site }
  }

  private async updateSite(params: ManageSiteParams & { _action: 'update' }, meta: EndpointMeta): Promise<EndpointResponse<TableSiteConfig>> {
    const { fields, where, userId, orgId } = params
    if (!userId || !orgId)
      throw abort('orgId required')

    const selector = await this.getSiteSelector(where)
    const prepped = this.settings.fictionDb.prep({ type: 'update', fields, table: tableNames.sites, meta })

    const [updatedSite] = await this.settings.fictionDb.client()
      .update({ orgId, userId, ...prepped })
      .where({ orgId, ...selector })
      .into(tableNames.sites)
      .returning<TableSiteConfig[]>('*')

    if (fields.pages && fields.pages.length) {
      await this.updateSitePages(updatedSite.siteId, fields.pages, userId, orgId, meta)
    }

    return { status: 'success', data: updatedSite, message: 'site saved' }
  }

  private async deleteSite(params: ManageSiteParams & { _action: 'delete' }, meta: EndpointMeta): Promise<EndpointResponse<TableSiteConfig>> {
    // Implement delete logic here
    throw new Error('Delete action not implemented')
  }

  private async finalizeSiteAction(params: ManageSiteParams, result: EndpointResponse<TableSiteConfig>, meta: EndpointMeta): Promise<EndpointResponse<TableSiteConfig>> {
    const { isPublishingDomains, fields } = params as ManageSiteParams & ({ _action: 'update' } | { _action: 'create' })
    const { siteId } = result.data!

    if (isPublishingDomains) {
      await updateSiteCerts({ siteId, customDomains: fields.customDomains, fictionSites: this.settings.fictionSites, fictionDb: this.settings.fictionDb }, meta)
    }

    const updatedResult = await this.run({
      _action: 'retrieve',
      where: { siteId },
      userId: params.userId,
      orgId: params.orgId,
      disableLog: true,
      caller: 'finalizeSiteAction',
    }, { ...meta, caller: 'endManageSite' })

    if (params._action === 'create') {
      this.log.info('SITE CREATED', { data: params })
    }

    return updatedResult
  }

  private async createSitePages(args: { siteId: string, pages?: CardConfigPortable[], userId?: string, orgId: string }, meta: EndpointMeta): Promise<void> {
    const { siteId, pages = [], userId, orgId } = args

    const promises = (pages || []).map(async (page) => {
      if (!siteId)
        throw abort('ENDPOINT: siteId missing')

      const fields = { ...page, siteId } as const

      return this.settings.fictionSites.queries.ManagePage.serve({
        siteId,
        _action: 'upsert',
        fields,
        userId,
        orgId,
        caller: 'createSite',
      }, meta)
    })

    await Promise.all(promises)
  }

  private async fetchSiteWithDetails(selector: WhereSite): Promise<TableSiteConfig | undefined> {
    const db = this.settings.fictionDb.client()

    const site = await db
      .select<TableSiteConfig>('*')
      .from(tableNames.sites)
      .where(selector)
      .first()

    if (!site?.siteId) {
      return undefined
    }

    // Retrieve all pages associated with the siteId
    const pages = await db
      .select()
      .from(tableNames.pages)
      .where({ siteId: site.siteId })

    // Assign the pages to the site object
    site.pages = pages

    const domains = await db
      .select()
      .from(tableNames.domains)
      .where({ siteId: site.siteId })

    site.customDomains = domains

    return site
  }

  private async updateSitePages(siteId: string, pages: any[], userId: string, orgId: string, meta: EndpointMeta): Promise<void> {
    const upsertPromises = pages.map(async (page) => {
      if (!siteId)
        return

      return this.settings.fictionSites.queries.ManagePage.serve({
        siteId,
        _action: 'upsert',
        fields: { siteId, ...page },
        userId,
        orgId,
        caller: 'updateSite',
      }, meta)
    })

    await Promise.all(upsertPromises)
  }

  async createSiteFromTheme(params: ManageSiteParams & { _action: 'create' }, _meta: EndpointMeta): Promise<Partial<TableSiteConfig>> {
    const { fields, userId, orgId } = params
    const { themeId } = fields

    if (!orgId)
      throw abort('orgId required')

    const fictionSites = this.settings.fictionSites
    const siteRouter = this.settings.fictionRouterSites

    const theme = this.getThemeById(themeId)

    const site = await theme.toSite({ siteRouter, fictionSites, userId, orgId, siteId: objectId({ prefix: 'sit' }) })

    return site.toConfig()
  }

  async getSiteSelector(where: WhereSite) {
    const { hostname } = where

    let out: Partial<WhereSite> = {}
    let domain: Partial<TableDomainConfig> | undefined = undefined
    if (where.hostname) {
      const db = this.settings.fictionDb.client()
      const domains = await db
        .select<TableDomainConfig[]>('*')
        .from(tableNames.domains)
        .where({ hostname })

      if (domains && domains.length) {
        const configured = domains.filter(d => d.configured)

        domain = configured[0] || domains[0]

        const siteId = domain?.siteId
        out.siteId = siteId
      }
    }
    else {
      out = where
    }

    if (Object.values(out).filter(Boolean).length !== 1) {
      this.log.error('Error Loading Site', { data: { out, where, domain } })

      const errorMessage = 'Load Site Error'
      throw new Error(errorMessage)
    }

    return out as WhereSite
  }
}

interface ManageSitesParams {
  _action: 'delete' | 'list'
  userId?: string
  orgId: string
  limit?: number
  offset?: number
  selectedIds?: string[]
  filters?: DataFilter[]
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
    let data: TableSiteConfig[] | undefined

    let count = 0
    if (_action === 'list') {
      const base = db
        .select([
          `${tableNames.sites}.*`,
        ])
        .from(tableNames.sites)
        .where(`${tableNames.sites}.org_id`, orgId)
        .limit(limit)
        .offset(offset)
        .orderBy('updatedAt', 'desc')
        .groupBy(`${tableNames.sites}.site_id`)

      if (filters.length) {
        filters.forEach((filter) => {
          const { field, operator, value } = filter
          if (field && operator && value)
            void base.where(field, operator, value)
        })
      }

      const rows = await base

      data = rows

      const r = await db
        .count<{ count: string }>('*')
        .from(tableNames.sites)
        .where({ orgId })
        .first()

      count = +(r?.count || 0)
    }

    return {
      status: 'success',
      data,
      message,
      indexMeta: { count, limit, offset },
      params,
    }
  }
}
