// @unocss-include
import type {
  EngineSectionEntry,
  EngineViewEntry,
  FactorApp,
  FactorDb,
  FactorEmail,
  FactorEnv,
  FactorPluginSettings,
  FactorRouter,
  FactorServer,
  FactorUser,
  PluginSetupArgs,
  ServiceList,
} from '@fiction/core'
import type { FactorMonitor } from '@fiction/plugin-monitor'
import { FactorPlugin, Query, safeDirname, vue } from '@fiction/core'
import type { FactorAdminPluginIndex } from '@fiction/plugin-admin-index'
import type { FactorAi } from '@fiction/plugin-ai'

export type AdminEngineViewEntry = EngineViewEntry<{
  layoutFormat?: 'full' | 'standard'
  isNavItem?: boolean
}>

export type FactorAdminSettings = {
  factorEnv: FactorEnv
  factorDb: FactorDb
  factorUser?: FactorUser
  factorEmail: FactorEmail
  factorServer: FactorServer
  factorApp: FactorApp
  factorRouter: FactorRouter
  factorMonitor?: FactorMonitor
  factorAi?: FactorAi
  pluginIndex?: FactorAdminPluginIndex
  settingsViews?: EngineViewEntry[]
  views?: AdminEngineViewEntry[]
  widgets?: EngineSectionEntry[]
  ui?: { AuthLogo?: vue.Component, IconDashboard?: vue.Component }
} & FactorPluginSettings

export abstract class AdminQuery<T extends FactorAdminSettings = FactorAdminSettings> extends Query<T> {
  constructor(settings: T) {
    super(settings)
  }
}

export class FactorAdmin extends FactorPlugin<FactorAdminSettings> {
  adminBaseRoute = '/admin'
  adminBaseOrgPath = vue.computed(() => `${this.adminBaseRoute}/${this.settings.factorUser?.activeOrgId.value}`)
  adminBaseUrl = vue.computed(() => `${this.settings.factorApp.appUrl.value}${this.adminBaseOrgPath.value}`)

  services: ServiceList = {}

  constructor(settings: FactorAdminSettings) {
    super('FactorAdmin', { ...settings, root: safeDirname(import.meta.url) })
  }

  async setup(args: PluginSetupArgs) {
    await this.addPlugins(args)
  }

  async addPlugins(args: PluginSetupArgs) {
    const { context } = args
    await this.utils.waitFor(300)

    const plugins = this.settings.pluginIndex?.plugins

    if (!plugins)
      return

    await Promise.all(plugins.map(async ({ load, settings }) => {
      const { setup } = await load()

      const pluginConfig = setup()

      const service = await pluginConfig.createPlugin({ ...this.settings, ...settings, factorAdmin: this })

      this.services[pluginConfig.serviceId] = service
    }))

    const s = this.settings.factorEnv.service.value
    this.settings.factorEnv.service.value = { ...s, ...this.services }

    if (context === 'node')
      this.log.info('Added plugins', { data: Object.keys(this.services) })
  }
}
