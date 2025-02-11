import type { template as dashTemplate, panelTemplate } from '@fiction/admin/dashboard/cardDash.js'
import type { FictionAdmin } from '@fiction/admin/index.js'
import type { FictionAnalytics } from '@fiction/analytics/index.js'
import type { FictionApp, FictionDb, FictionEmail, FictionEnv, FictionMedia, FictionPluginSettings, FictionRevision, FictionRouter, FictionServer, FictionUser } from '@fiction/core'
import type { FictionAi } from '@fiction/plugin-ai'
import type { FictionMonitor } from '@fiction/plugin-monitor'
import type { Site } from './site.js'
import type { TableSiteConfig } from './tables.js'
import { initializeClientTag } from '@fiction/analytics/tag/entry.js'
import { crossVar, FictionPlugin, getAnonymousId, isNode, safeDirname, vue } from '@fiction/core'
import { EnvVar, vars } from '@fiction/core/plugin-env'
import { getWidgets } from './admin/widgets.js'
import { CardQueryHandler } from './cardQuery.js'
import { ManageDomain } from './endpoint-domains.js'
import { ManagePage, ManageSite, ManageSites } from './endpoint.js'
import { loadSitemap } from './load.js'
import { FictionSiteBuilder } from './plugin-builder/index.js'
import { getRoutes } from './routes.js'
import { tables } from './tables.js'
import { Theme } from './theme.js'
import { generateThemeStructure } from './utils/themeStructure.js'

export * from './card.js'
export * from './site.js'
export * from './tables.js'
export * from './theme.js'

vars.register(() => [new EnvVar({ name: 'FLY_API_TOKEN' })])

export type SitesPluginSettings = {
  fictionEnv: FictionEnv
  fictionDb: FictionDb
  fictionRevision: FictionRevision
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
    ManageDomain: new ManageDomain({ ...this.settings, fictionSites: this }),
  }

  requests = this.createRequests({ queries: this.queries, fictionServer: this.settings.fictionServer, fictionUser: this.settings.fictionUser })

  constructor(settings: SitesPluginSettings) {
    const s = { ...settings, root: safeDirname(import.meta.url) }

    super('FictionSites', s)

    this.settings.fictionDb.addTables(tables)
    this.settings.fictionRouter?.update(getRoutes({ ...this.settings, fictionSites: this }))

    this.addSitemaps()
    this.admin()
    this.addStructureFile()
  }

  addStructureFile() {
    this.fictionEnv.generators.push(async () => {
      const themes = await this.settings.themes()

      const results = await generateThemeStructure({
        fictionSites: this,
        fictionRouterSites: this.settings.fictionRouterSites,
        themes,
      })

      return { fileName: 'themeStructure.json', content: results.json }
    })
  }

  admin() {
    const widgets = getWidgets(this.settings)
    this.settings.fictionAdmin.widgetRegister.value.push(...Object.values(widgets))
    this.settings.fictionAdmin.addToWidgetArea('homeSecondary', [])
    this.settings.fictionAdmin.addToWidgetArea('sitesIndex', [{ key: 'sitesWelcome' }, { key: 'siteVisitors' }])

    this.settings.fictionAdmin.addAdminPages({ key: 'sites', loader: async ({ factory }) => [
      await factory.fromTemplate<typeof dashTemplate>({
        templateId: 'dash',
        slug: 'sites',
        title: 'Websites',
        cards: [
          await factory.fromTemplate<typeof panelTemplate>({
            el: vue.defineAsyncComponent(async () => import('./admin/ViewManage.vue')),
            cards: [
              await factory.fromTemplate<typeof panelTemplate>({
                slug: 'list',
                title: 'Websites',
                description: 'View and manage all your websites, domains, and site configurations',
                el: vue.defineAsyncComponent(async () => import('./admin/ManageIndex.vue')),
                userConfig: {
                  isNavItem: true,
                  navIcon: 'i-tabler-browser',
                  navIconAlt: 'i-tabler-browser-plus',
                },
              }),
              await factory.fromTemplate<typeof panelTemplate>({
                slug: 'analytics',
                title: 'Performance Analytics',
                description: 'Monitor visitor engagement, traffic patterns, and user behavior across all sites',
                el: vue.defineAsyncComponent(async () => import('./admin/ManageAnalytics.vue')),
                userConfig: {
                  isNavItem: true,
                  navIcon: 'i-tabler-chart-dots',
                  navIconAlt: 'i-tabler-chart-line',
                },
              }),
            ],
          }),
        ],
        userConfig: {
          isNavItem: true,
          navIcon: 'i-tabler-browser',
          navIconAlt: 'i-tabler-browser-plus',
        },
      }),
      await factory.fromTemplate<typeof dashTemplate>({
        regionId: 'main',
        templateId: 'dash',
        slug: 'edit-site',
        title: 'Website Editor',
        description: 'Customize and configure your website settings',
        cards: [
          await factory.fromTemplate<typeof panelTemplate>({
            el: vue.defineAsyncComponent(async () => import('./plugin-builder/SiteEditor.vue')),
            userConfig: {
              isNavItem: false,
              standard: {
                spaceSize: 'none' as const,
              },
            },
          }),
        ],
        userConfig: {
          isNavItem: false,
          layoutFormat: 'full',
          navIcon: 'i-tabler-home-plus',
        },
      }),
    ] })
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
    })

    const addedThemes = await this.settings.themes()

    addedThemes.forEach(theme => this.fictionEnv.addUiRoot(theme.settings.root))

    this.themes.value = [defaultTheme, ...addedThemes]
  }

  getQueryItemPreviewPath = vue.computed(() => {
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

    if (this.fictionEnv.isTest.value) {
      return
    }

    if (!fictionAnalytics)
      return this.log.warn('trackWebsiteEvents: Analytics not enabled')

    if (!site)
      return

    const { siteId, settings: { orgId } } = site

    if (!beaconUrl)
      throw new Error('trackWebsiteEvents: Beacon URL not found')
    if (!orgId)
      throw new Error('trackWebsiteEvents: Org ID not found')

    const { anonymousId } = getAnonymousId({ caller: 'trackWebsiteEvents' })
    await initializeClientTag({ siteId, orgId, beaconUrl, anonymousId })
  }

  async ensureSiteForOrg({ orgId, siteId }: { orgId: string, siteId: string }) {
    if (!isNode()) {
      throw new Error('ensureSiteForOrg is only available on the server')
    }

    if (!orgId)
      throw new Error('Org ID not found')

    const r = await this.queries.ManageSites.serve({ _action: 'list', orgId }, { server: true })

    let site: TableSiteConfig
    if (!r.data?.length) {
      const r2 = await this.queries.ManageSite.serve({ _action: 'create', orgId, fields: { title: 'Default Site', themeId: 'empty', siteId }, caller: 'ensure' }, { server: true })

      if (!r2.data)
        throw new Error('Site not created')

      site = r2.data
    }
    else {
      site = r.data[0]
    }

    return site
  }

  async ensureAppDefaults(args: { context?: 'node' | 'app', defaultId?: string }) {
    const { context = 'node', defaultId = 'admin' } = args

    const envId = 'FICTION_SITE_ID'

    if (context === 'node' && !crossVar.has(envId)) {
      const { fictionUser, fictionEnv } = this.settings

      if (!fictionUser)
        throw new Error('No fictionUser')

      const appOrgId = await fictionUser.ensureAppOrgId(args)

      if (!appOrgId) {
        throw new Error('No appOrgId')
      }

      const site = await this.ensureSiteForOrg({ orgId: appOrgId, siteId: defaultId })

      if (!crossVar.has(envId)) {
        crossVar.set(envId, site.siteId)
      }
      fictionEnv.log.info(`Setting app ${envId} to '${site.siteId}'`)
    }

    return crossVar.get(envId)
  }
}
