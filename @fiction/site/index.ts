import { FictionPlugin, crossVar, getAnonymousId, isNode, safeDirname, vue } from '@fiction/core'
import type { FictionApp, FictionDb, FictionEmail, FictionEnv, FictionMedia, FictionPluginSettings, FictionRouter, FictionServer, FictionUser, Organization } from '@fiction/core'
import { EnvVar, vars } from '@fiction/core/plugin-env'
import type { FictionAi } from '@fiction/plugin-ai'
import type { FictionMonitor } from '@fiction/plugin-monitor'
import type { FictionAdmin } from '@fiction/admin/index.js'
import type { FictionAnalytics } from '@fiction/analytics/index.js'
import { initializeClientTag } from '@fiction/analytics/tag/entry.js'
import { ManagePage, ManageSite, ManageSites } from './endpoint.js'
import { CardQueryHandler } from './cardQuery.js'
import { type TableSiteConfig, tables } from './tables.js'
import { ManageCert } from './endpoint-certs.js'
import { getRoutes } from './routes.js'
import { Theme } from './theme.js'
import { FictionSiteBuilder } from './plugin-builder/index.js'
import { loadSitemap } from './load.js'
import type { Site } from './site.js'

export * from './site.js'
export * from './card.js'
export * from './theme.js'
export * from './tables.js'

vars.register(() => [new EnvVar({ name: 'FLY_API_TOKEN' })])

export type SitesPluginSettings = {
  fictionEnv: FictionEnv
  fictionDb: FictionDb
  fictionUser?: FictionUser
  fictionEmail: FictionEmail
  fictionServer: FictionServer
  fictionApp: FictionApp
  fictionRouter: FictionRouter
  fictionAdmin: FictionAdmin
  fictionMonitor?: FictionMonitor
  fictionAi?: FictionAi
  fictionAnalytics?: FictionAnalytics
  fictionMedia: FictionMedia
  fictionAppSites: FictionApp
  fictionRouterSites: FictionRouter
  flyAppId: string
  flyApiToken: string
  adminBaseRoute?: string
  themes: () => Promise<Theme[]>
} & FictionPluginSettings

export class FictionSites extends FictionPlugin<SitesPluginSettings> {
  adminBaseRoute = this.settings.adminBaseRoute || '/admin'
  themes = vue.shallowRef<Theme[]>([])

  builder = new FictionSiteBuilder({ ...this.settings, fictionSites: this })

  queries = {
    CardQuery: new CardQueryHandler({ ...this.settings, fictionSites: this }),
    ManageSite: new ManageSite({ ...this.settings, fictionSites: this }),
    ManageSites: new ManageSites({ ...this.settings, fictionSites: this }),
    ManagePage: new ManagePage({ ...this.settings, fictionSites: this }),
    ManageCert: new ManageCert({ ...this.settings, fictionSites: this }),
  }

  requests = this.createRequests({ queries: this.queries, fictionServer: this.settings.fictionServer, fictionUser: this.settings.fictionUser })

  constructor(settings: SitesPluginSettings) {
    const s = { ...settings, root: safeDirname(import.meta.url) }

    super('FictionSites', s)

    this.settings.fictionDb.addTables(tables)
    this.settings.fictionRouter?.update(getRoutes({ ...this.settings, fictionSites: this }))

    this.addSitemaps()
  }

  addSitemaps() {
    this.settings.fictionApp.fictionSitemap?.sitemapLoaders.push(async (args) => {
      const { paths, hostname } = await loadSitemap({ ...args, mode: 'static', fictionSites: this })
      return { paths, hostname, topic: 'site' }
    })

    this.settings.fictionAppSites.fictionSitemap?.sitemapLoaders.push(async (args) => {
      const { paths, hostname } = await loadSitemap({ ...args, mode: 'dynamic', fictionSites: this })
      return { paths, hostname, topic: 'site' }
    })
  }

  override async afterSetup() {
    const defaultTheme = new Theme({
      themeId: 'empty',
      root: import.meta.url,
      getConfig: async () => ({ userConfig: {}, pages: [], sections: {} }),
      fictionEnv: this.settings.fictionEnv,
    })

    const addedThemes = await this.settings.themes()

    this.themes.value = [defaultTheme, ...addedThemes]
  }

  getPreviewPath = vue.computed(() => {
    const current = this.settings.fictionRouter.current.value
    const q = { ...current.query, ...current.params } as Record<string, string>
    const { selectorType, selectorId, siteId, subDomain, themeId = q.theme, cardId = q.card } = q

    const finalSelectorType = selectorType || (siteId ? 'site' : subDomain ? 'domain' : themeId ? 'theme' : cardId ? 'card' : 'none')
    const finalSelectorId = selectorId || siteId || subDomain || themeId || cardId || 'none'

    return `${this.adminBaseRoute}/preview/${finalSelectorType}/${finalSelectorId}`
  })

  cleanup() {
    this.themes.value = []
  }

  async trackWebsiteEvents({ site }: { site?: Site }) {
    const { fictionAnalytics } = this.settings
    const beaconUrl = fictionAnalytics?.fictionBeacon?.beaconUrl.value

    if (!fictionAnalytics)
      return this.log.warn('Analytics not enabled')

    if (!site)
      throw new Error('Site not found')

    const { siteId, settings: { orgId } } = site

    if (!beaconUrl)
      throw new Error('Beacon URL not found')
    if (!orgId)
      throw new Error('Org ID not found')

    const { anonymousId } = getAnonymousId()
    await initializeClientTag({ siteId, orgId, beaconUrl, anonymousId })
  }

  async ensureSiteForOrg({ org, siteId }: { org: Organization, siteId: string }) {
    if (!isNode()) {
      throw new Error('ensureSiteForOrg is only available on the server')
    }

    const { orgId, orgName } = org

    if (!orgId)
      throw new Error('Org ID not found')

    const r = await this.queries.ManageSites.serve({ _action: 'list', orgId }, { server: true })

    let site: TableSiteConfig
    if (!r.data?.length) {
      const r2 = await this.queries.ManageSite.serve({ _action: 'create', orgId, fields: { title: orgName, themeId: 'empty', siteId }, caller: 'ensure' }, { server: true })

      if (!r2.data)
        throw new Error('Site not created')

      site = r2.data
    }
    else {
      site = r.data[0]
    }

    return site
  }

  async ensureDefaults(args: { context?: 'node' | 'app', defaultId?: string }) {
    const { context = 'node', defaultId = 'admin' } = args

    if (context === 'node') {
      const { fictionUser, fictionEnv } = this.settings
      const { email, name } = fictionEnv.meta.app || {}

      if (!email || !name)
        throw new Error('No email or name for app')

      if (!fictionUser)
        throw new Error('No fictionUser')

      const { org } = await fictionUser?.ensureUserAndOrganization({ orgName: name, email, orgId: defaultId })

      if (!org.orgId)
        throw new Error('No orgId')

      const site = await this.ensureSiteForOrg({ org, siteId: defaultId })

      if (!crossVar.has('FICTION_ORG_ID')) {
        crossVar.set('FICTION_ORG_ID', org.orgId)
      }
      fictionEnv.log.info(`Setting app FICTION_ORG_ID to '${org.orgId}'`)
      if (!crossVar.has('FICTION_SITE_ID')) {
        crossVar.set('FICTION_SITE_ID', site.siteId)
      }
      fictionEnv.log.info(`Setting app FICTION_SITE_ID to '${site.siteId}'`)
    }
  }
}
