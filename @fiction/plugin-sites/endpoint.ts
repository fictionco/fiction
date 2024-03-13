import type { DataFilter, EndpointMeta, EndpointResponse } from '@fiction/core'
import { AdminQuery } from '@fiction/plugin-admin'
import { deepMerge } from '@fiction/core'
import type { Knex } from 'knex'
import type { CardConfigPortable, TableCardConfig, TableSiteConfig } from './tables'
import { tableNames } from './tables'
import { incrementSlugId } from './util'
import { Card } from './card'
import type { FictionSites, SitesPluginSettings } from '.'

export type SitesQuerySettings = SitesPluginSettings & {
  fictionSites: FictionSites
}
export abstract class SitesQuery extends AdminQuery<SitesQuerySettings> {
  constructor(settings: SitesQuerySettings) {
    super(settings)
  }
}

type ManagePageParams = {
  siteId: string
  userId: string
  orgId: string
  successMessage?: string
  caller: string
} & ({ _action: 'upsert', fields: CardConfigPortable } | { _action: 'retrieve' | 'delete', fields: CardConfigPortable })

export class ManagePage extends SitesQuery {
  private async handleUpsert(args: {
    fields: CardConfigPortable
    siteId: string
    orgId: string
    userId: string
    caller: string
  }, meta: EndpointMeta): Promise<TableCardConfig> {
    const { siteId, orgId, userId, caller } = args

    const fields = new Card(args.fields).toConfig()

    if (!siteId)
      throw this.stop(`UPSERT: siteId field required from ${caller}`, { data: { fields } })

    const db = this.settings.fictionDb?.client()
    if (!db)
      throw this.stop('no db')

    const prepped = this.utils.prepareFields({
      type: 'create',
      fields,
      table: tableNames.pages,
      meta,
      fictionDb: this.settings.fictionDb,
    })

    await this.specialSlugConflicts({ slug: prepped.slug, cardId: fields.cardId, siteId, db })

    // all are needed to do propper recursion, without slug it infintely loops
    const where = { siteId, slug: prepped.slug }

    for (const key in where) {
      if (!where[key as keyof typeof where])
        throw this.stop(`UPSERT(where clause): '${key}' required from ${caller}`, { data: { fields } })
    }

    const insertFields = { ...prepped, orgId, userId, siteId }

    this.log.info(`ENDPOINT: upserting region [${caller}]`, { data: { insertFields, where } })

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

    return await updateExistingSlug(slug)
  }

  async run(
    params: ManagePageParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<TableCardConfig>> {
    const db = this.settings.fictionDb?.client()
    if (!db)
      throw this.stop('no db')

    const { _action, fields, siteId, orgId, userId, successMessage = '', caller } = params

    const message = successMessage
    let data: TableCardConfig | undefined

    if (_action === 'upsert') {
      data = await this.handleUpsert({ fields, siteId, orgId, userId, caller }, meta)
    }
    else if (_action === 'retrieve') {
      const { cardId, slug } = fields

      if (!cardId && !slug)
        throw this.stop('cardId or slug required to retrieve page')

      const where = cardId ? { orgId, cardId } : { siteId, slug }
      this.log.info('RETREIVE', { data: { where } })
      data = await db
        .select()
        .from(tableNames.pages)
        .where(where)
        .first()

      if (!data) {
        this.log.info('Page not found', { data: { where, cardId, _action, caller } })
        throw new Error('Page not found')
      }
    }
    else if (_action === 'delete') {
      const { cardId } = fields

      if (!cardId)
        throw this.stop('cardId required')

      await db
        .delete()
        .from(tableNames.pages)
        .where({ orgId, cardId })

      data = undefined
    }

    return { status: 'success', data, message }
  }
}

type CreateManageSiteParams = { _action: 'create', fields: Partial<TableSiteConfig>, userId: string, orgId: string }
type EditManageSiteParams = { _action: 'update' | 'delete', fields: Partial<TableSiteConfig>, where: { siteId?: string, subDomain?: string }, userId: string, orgId: string }
type GetManageSiteParams = { _action: 'retrieve', where: { siteId?: string, subDomain?: string }, userId?: string, orgId?: string }

type ManageSiteParams = (CreateManageSiteParams | EditManageSiteParams | GetManageSiteParams) & { caller?: string, successMessage?: string }

export class ManageSite extends SitesQuery {
  async createSiteFromTheme(params: CreateManageSiteParams, _meta: EndpointMeta): Promise<Partial<TableSiteConfig>> {
    const { fields, userId, orgId } = params
    const { themeId } = fields

    if (!userId || !orgId)
      throw this.stop('userId and orgId required')

    const themes = this.settings.fictionSites.themes.value
    const theme = themes.find(t => t.themeId === themeId)
    if (!theme)
      throw this.stop(`theme not found - themeId: ${themeId} - available: ${themes.map(t => t.themeId).join(', ')}`)

    const processedConfig = await theme.processToSite({ ...this.settings, userId, orgId })

    return processedConfig
  }

  async run(
    params: ManageSiteParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<TableSiteConfig>> {
    const fictionDb = this.settings.fictionDb
    if (!fictionDb)
      throw this.stop('no fictionDb')

    const { _action, orgId, userId, caller = 'unknown', successMessage } = params

    if (!_action)
      throw this.stop('_action required')

    const db = fictionDb.client()

    let message = ''
    let data: TableSiteConfig | undefined
    let siteId: string | undefined = undefined

    if (_action === 'create') {
      const { fields } = params
      if (!userId || !orgId)
        throw this.stop('orgId required')

      this.log.info(`creating site: ${fields.title}`, { data: { userId, orgId, fields } })

      const themeSite = await this.createSiteFromTheme(params, meta)

      const f = deepMerge([themeSite, fields])

      const prepped = this.utils.prepareFields({
        type: 'settings',
        fields: f,
        table: tableNames.sites,
        meta,
        fictionDb,
      })

      /**
       * save the site
       */
      const [site] = await db
        .insert({ orgId, userId, ...prepped })
        .into(tableNames.sites)
        .returning<TableSiteConfig[]>('*')

      siteId = site.siteId
      if (!siteId)
        throw this.stop('site not created')

      /**
       * Handle pages
       */
      const _promises = (themeSite.pages || []).map(async (region) => {
        if (!siteId)
          throw this.stop('ENDPOINT: siteId missing')

        const fields = { ...region, siteId } as const

        return await this.settings.fictionSites.queries.ManagePage.serve({
          siteId,
          _action: 'upsert',
          fields,
          userId,
          orgId,
          caller: 'createSite',
        }, meta)
      })

      await Promise.all(_promises)

      message = 'site created'

      await this.settings.fictionMonitor?.slackNotify({ message: '*New Site Created*', data })
    }
    else if (_action === 'retrieve') {
      const { where } = params
      this.log.info('retrieving site', { data: { where, caller } })

      if (Object.keys(where).length !== 1)
        throw this.stop('WHERE -> siteId or subDomain required )')

      const site = await db
        .select<TableSiteConfig>('*')
        .from(tableNames.sites)
        .where(where)
        .first()

      if (!site?.siteId)
        throw this.stop('Site not found', { data: { where } })

      siteId = site.siteId

      // Retrieve all pages associated with the siteId
      const pages = await db
        .select()
        .from(tableNames.pages)
        .where({ siteId })

      // Assign the pages to the site object
      site.pages = pages

      data = site
    }
    else if (_action === 'update') {
      const { fields, where } = params
      if (!userId || !orgId)
        throw this.stop('orgId required')

      const { siteId: _siteId, subDomain } = where

      if (!_siteId && !subDomain)
        throw this.stop('siteId or subDomain required')

      const prepped = this.utils.prepareFields({
        type: 'settings',
        fields,
        table: tableNames.sites,
        meta,
        fictionDb,
      })

      ;[data] = await db
        .update({ orgId, userId, ...prepped })
        .where({ orgId, ...where })
        .into(tableNames.sites)
        .returning<TableSiteConfig[]>('*')

      siteId = data.siteId

      if (fields.pages && fields.pages.length) {
        const upsertPromises = fields.pages.map(async (page) => {
          if (!siteId)
            return

          return await this.settings.fictionSites.queries.ManagePage.serve({
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

      message = 'site saved'
    }

    /**
     * Return full site via action when creating or updating
     */

    if ((_action === 'update' || _action === 'create') && siteId) {
      const r = await this.run({ _action: 'retrieve', where: { siteId }, userId, orgId }, { ...meta, caller: 'endManageSite' })

      data = r.data

      if (_action === 'create')
        this.log.info('SITE CREATED: returning', { data })
    }

    return { status: 'success', data, message: successMessage ?? message }
  }
}

interface ManageIndexParams {
  _action: 'delete' | 'list'
  userId?: string
  orgId: string
  limit?: number
  offset?: number
  selectedIds?: string[]
  filters?: DataFilter[]
}
export class ManageIndex extends SitesQuery {
  async run(
    params: ManageIndexParams,
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<TableSiteConfig[]>> {
    const {
      _action,
      orgId,
      limit = 10,
      offset = 0,
      filters = [],
    } = params

    if (!_action)
      throw this.stop('action required')

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

    this.log.info('running query', { data: { params, data, count } })

    return {
      status: 'success',
      data,
      message,
      indexMeta: { count, limit, offset },
      params,
    }
  }
}
