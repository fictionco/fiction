import type { FictionAdmin } from '@fiction/admin/index.js'
import type { AdminTemplates } from '@fiction/admin/theme/index.js'
import type { FictionAnalytics } from '@fiction/analytics/index.js'
import type { FictionApp, FictionDb, FictionEmail, FictionEnv, FictionMedia, FictionPluginSettings, FictionRevision, FictionRouter, FictionServer, FictionUser } from '@fiction/core'
import type { FictionAi } from '@fiction/plugin-ai'
import type { FictionMonitor } from '@fiction/plugin-monitor'
import type { FictionContact } from '@fiction/plugins/plugin-contact/index.js'
import type { Site } from './site.js'
import type { CardConfigPortable, TableSiteConfig } from './tables.js'
import { initializeClientTag } from '@fiction/analytics/tag/entry.js'
import { cardConfigCustom } from '@fiction/cards/index.js'
import { FictionPlugin, getAnonymousId, HooksUtil, isNode, safeDirname, vue } from '@fiction/core'
import { EnvVar, vars } from '@fiction/core/plugin-env'
import { cardTemplate } from './card.js'
import { CardQueryHandler } from './cardQuery.js'
import { ManagePage, ManageSite, ManageSites } from './endpoint.js'
import { ManageDomain } from './endpointDomains.js'
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
  fictionContact?: FictionContact
  fictionMonitor?: FictionMonitor
  fictionAi?: FictionAi
  fictionAnalytics?: FictionAnalytics
  fictionMedia: FictionMedia
  fictionAppSites: FictionApp
  fictionRouterSites: FictionRouter
  themes: () => Promise<Theme[]>
  fictionOrgId?: string
} & FictionPluginSettings

export type SiteHookEvents = {
  siteCreated: (args: { site: Site }) => Promise<void>
  setPages: (args: { cards: CardConfigPortable[], site: Site | undefined }) => Promise<void>
}

function getTemplates() {
  return [
    cardTemplate({ templateId: 'tplManageSite', el: vue.defineAsyncComponent(() => import('./admin/ViewManage.vue')) }),
    cardTemplate({ templateId: 'tplSiteEditor', el: vue.defineAsyncComponent(() => import('./plugin-builder/SiteEditor.vue')) }),
  ]
}

type SiteAdminTemplates = AdminTemplates & ReturnType<typeof getTemplates>

export class FictionSites extends FictionPlugin<SitesPluginSettings> {
  themes = vue.shallowRef<Theme[]>([])
  previewRoute = '/admin/preview'

  hooks = new HooksUtil<SiteHookEvents>()

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

  hostname(args: { subDomain?: string }) {
    const { subDomain } = args
    return this.fictionEnv.isProd.value ? `${subDomain}.fiction.com` : `${subDomain}.lan.com`
  }

  getOrigin(args?: { subDomain?: string }) {
    const { subDomain } = args || {}
    const hostname = this.hostname({ subDomain })
    const port = this.settings.fictionAppSites?.port.value
    return this.fictionEnv.isProd.value ? `https://${hostname}` : `http://${hostname}:${port}`
  }

  getUrl(args?: { subDomain?: string, path?: string, scope?: 'draft' | 'publish' }) {
    const { subDomain, path = '', scope } = args || {}
    const origin = this.getOrigin({ subDomain })
    const url = new URL(path, origin)

    if (scope === 'draft') {
      url.searchParams.set('scope', 'draft')
    }

    // remove pageCardId from the URL if it exists
    url.searchParams.delete('_pageCardId')

    return url.toString()
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
    // const widgets = getWidgets()
    // this.settings.fictionAdmin.widgetRegister.value.push(...Object.values(widgets))
    // this.settings.fictionAdmin.addToWidgetArea('sitesIndex', [{ key: 'sitesWelcome' }, { key: 'siteVisitors' }])

    this.settings.fictionAdmin.addFeature({
      key: 'sites',
      getTemplates: async () => getTemplates(),
      getPages: async () => [
        cardConfigCustom<SiteAdminTemplates>({
          templateId: 'dash',
          slug: 'sites',
          title: 'Manage Websites',
          cards: [
            cardConfigCustom<SiteAdminTemplates>({ templateId: 'tplManageSite' }),
          ],
          userConfig: {
            isNavItem: false,
            navIcon: 'i-tabler-browser',
            navIconAlt: 'i-tabler-browser-plus',
          },
        }),
        cardConfigCustom<SiteAdminTemplates>({
          templateId: 'dash',
          slug: 'edit-site',
          title: 'Website',
          description: 'Customize and configure your website settings',
          cards: [
            cardConfigCustom<SiteAdminTemplates>({
              templateId: 'tplSiteEditor',
              userConfig: { standard: { spaceSize: 'none' as const } },
            }),
          ],
          userConfig: {
            isNavItem: true,
            layoutFormat: 'full',
            navIcon: 'i-tabler-browser',
          },
        }),
      ],
    })
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

    const { theme: baseTheme } = await import('@fiction/theme-base/index.js')

    const addedThemes = await this.settings.themes()

    addedThemes.forEach(theme => this.fictionEnv.addUiRoot(theme.settings.root))

    this.themes.value = [defaultTheme, baseTheme, ...addedThemes]
  }

  cleanup() { }

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

  // async ensureAppDefaults(args: { context?: 'node' | 'app', defaultId?: string }) {
  //   const { context = 'node', defaultId = 'admin' } = args

  //   const envId = 'FICTION_SITE_ID'

  //   if (context === 'node' && !crossVar.has(envId)) {
  //     const { fictionUser, fictionEnv } = this.settings

  //     if (!fictionUser)
  //       throw new Error('No fictionUser')

  //     const appOrgId = await fictionUser.ensureAppOrgId(args)

  //     if (!appOrgId) {
  //       throw new Error('No appOrgId')
  //     }

  //     const site = await this.ensureSiteForOrg({ orgId: appOrgId, siteId: defaultId })

  //     if (!crossVar.has(envId)) {
  //       crossVar.set(envId, site.siteId)
  //     }
  //     fictionEnv.log.info(`Setting app ${envId} to '${site.siteId}'`)
  //   }

  //   return crossVar.get(envId)
  // }
}
