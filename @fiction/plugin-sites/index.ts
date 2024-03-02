// @unocss-include
import { FactorPlugin, safeDirname, vue } from '@fiction/core'
import type { DataFilter, FactorApp, FactorRouter, IndexMeta } from '@fiction/core'

import { EnvVar, vars } from '@fiction/core/plugin-env'
import type { FactorAdmin, FactorAdminSettings } from '@fiction/plugin-admin'
import type { PluginMain } from '@fiction/plugin-admin-index'
import { ManageIndex, ManagePage, ManageSite } from './endpoint'
import { tables } from './tables'
import { Site } from './site'
import type { ToolKeys } from './el/tools'
import { tools } from './el/tools'
import { getThemes } from './themes'
import { ManageCert } from './endpoint-certs'
import { getRoutes } from './routes'

export * from './site'

vars.register(() => [
  new EnvVar({ name: 'FLY_API_TOKEN' }),
])

export type SitesPluginSettings = {
  factorAppSites: FactorApp
  factorRouterSites: FactorRouter
  flyIoAppId: string
  flyIoApiToken: string
  factorAdmin: FactorAdmin
} & FactorAdminSettings

export class FactorSites extends FactorPlugin<SitesPluginSettings> {
  themes = vue.shallowRef(getThemes({ factorEnv: this.settings.factorEnv }))
  queries = {
    ManageSite: new ManageSite({ ...this.settings, factorSites: this }),
    ManageIndex: new ManageIndex({ ...this.settings, factorSites: this }),
    ManagePage: new ManagePage({ ...this.settings, factorSites: this }),
    ManageCert: new ManageCert({ ...this.settings, factorSites: this }),
  }

  requests = this.createRequests({
    queries: this.queries,
    factorServer: this.settings.factorServer,
    factorUser: this.settings.factorUser,
  })

  constructor(settings: SitesPluginSettings) {
    const s = { ...settings, root: safeDirname(import.meta.url) }

    super('FactorSites', s)

    this.settings.factorDb.addTables(tables)
    this.settings.factorRouter?.update(getRoutes({ ...this.settings, factorSites: this }))
  }

  activeSite = vue.shallowRef<Site | undefined>(undefined)

  activeToolId = {
    left: vue.ref<ToolKeys | ''>(),
    right: vue.ref<ToolKeys | ''>(),
  }

  activeTool = {
    left: vue.computed(() => tools().find(t => t.toolId === this.activeToolId.left.value)),
    right: vue.computed(() => tools().find(t => t.toolId === (this.activeToolId.right.value ? this.activeToolId.right.value : 'editCard'))),
  }

  useTool(args: { toolId: ToolKeys | '' }) {
    const { toolId } = args
    const t = tools().find(t => t.toolId === toolId)
    const location = t?.location || 'left'
    this.activeToolId[location].value = toolId
  }

  isUsingTool(args: { toolId?: ToolKeys | '', locations?: ('left' | 'right')[] } = {}) {
    const { toolId, locations = ['left', 'right'] } = args
    return locations.some(l => this.activeToolId[l].value === toolId)
  }

  async requestIndex(
    args: { limit?: number, offset?: number, filters?: DataFilter[], imageId?: string } = {},
  ): Promise<{ items: Site[] | undefined, indexMeta?: IndexMeta }> {
    const { limit = 10, offset = 0 } = args || {}

    const r = await this.requests.ManageIndex.projectRequest({ _action: 'list', limit, offset })

    const items = r.data
      ? r.data.map(d => new Site({
        ...d,
        factorSites: this,
        siteRouter: this.settings.factorRouterSites || this.settings.factorRouter,
        isEditable: false,
      }))
      : undefined

    return { items, indexMeta: r.indexMeta }
  }

  getPreviewPath(args: { factorAdmin: FactorAdmin }) {
    const { factorAdmin } = args
    return vue.computed(() => {
      const current = factorAdmin.settings.factorRouter.current.value
      const { selectorType, selectorId, siteId, subDomain, themeId } = { ...current.query, ...current.params } as Record<string, string>

      const finalSelectorType = selectorType || (siteId ? 'site' : subDomain ? 'domain' : themeId ? 'theme' : 'none')
      const finalSelectorId = selectorId || siteId || subDomain || themeId || 'none'

      return `${factorAdmin.adminBaseRoute}/preview/${finalSelectorType}/${finalSelectorId}`
    })
  }
}

export function setup(): PluginMain<SitesPluginSettings> {
  return {
    serviceId: 'factorSites',
    title: 'Sites',
    description: 'Create and manage websites',
    createPlugin: async (_: SitesPluginSettings) => new FactorSites(_),
  }
}
