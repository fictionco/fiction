// @unocss-include
import type {
  EngineSectionEntry,
  EngineViewEntry,
  FictionApp,
  FictionDb,
  FictionEmail,
  FictionEnv,
  FictionPluginSettings,
  FictionRouter,
  FictionServer,
  FictionUser,
  PluginSetupArgs,
  ServiceList,
} from '@fiction/core'
import type { FictionMonitor } from '@fiction/plugin-monitor'
import { FictionPlugin, Query, safeDirname, vue } from '@fiction/core'
import type { FictionAdminPluginIndex } from '@fiction/plugin-admin-index'
import type { FictionAi } from '@fiction/plugin-ai'

export type AdminEngineViewEntry = EngineViewEntry<{
  layoutFormat?: 'full' | 'standard'
  isNavItem?: boolean
}>

export type FictionAdminSettings = {
  fictionEnv: FictionEnv
  fictionDb: FictionDb
  fictionUser?: FictionUser
  fictionEmail: FictionEmail
  fictionServer: FictionServer
  fictionApp: FictionApp
  fictionRouter: FictionRouter
  fictionMonitor?: FictionMonitor
  fictionAi?: FictionAi
  pluginIndex?: FictionAdminPluginIndex
  settingsViews?: EngineViewEntry[]
  views?: AdminEngineViewEntry[]
  widgets?: EngineSectionEntry[]
  ui?: { AuthLogo?: vue.Component, IconDashboard?: vue.Component }
} & FictionPluginSettings

export abstract class AdminQuery<T extends FictionAdminSettings = FictionAdminSettings> extends Query<T> {
  constructor(settings: T) {
    super(settings)
  }
}

export class FictionAdmin extends FictionPlugin<FictionAdminSettings> {
  adminBaseRoute = '/admin'
  adminBaseOrgPath = vue.computed(() => `${this.adminBaseRoute}/${this.settings.fictionUser?.activeOrgId.value}`)
  adminBaseUrl = vue.computed(() => `${this.settings.fictionApp.appUrl.value}${this.adminBaseOrgPath.value}`)

  services: ServiceList = {}

  constructor(settings: FictionAdminSettings) {
    super('FictionAdmin', { ...settings, root: safeDirname(import.meta.url) })
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

    await Promise.all(plugins.map(async ({ load, settings = () => undefined }) => {
      const { setup } = await load()

      const pluginConfig = setup()

      const service = await pluginConfig.createPlugin({ ...this.settings, ...settings(), fictionAdmin: this })

      this.services[pluginConfig.serviceId] = service
    }))

    const s = this.settings.fictionEnv.service.value
    this.settings.fictionEnv.service.value = { ...s, ...this.services }

    if (context === 'node')
      this.log.info('Added plugins', { data: Object.keys(this.services) })
  }
}
