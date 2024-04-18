import type { FictionPluginSettings, PluginSetupArgs } from '../plugin'
import { FictionPlugin } from '../plugin'
import type { FictionUser } from '../plugin-user'
import { safeDirname } from '../utils'
import type { ExtensionLoader } from './utils'
import { loadAndInitializeExtensions } from './utils'

export * from './utils'

type PluginIndexSettings = { extensions: ExtensionLoader<Record<string, any>>[], fictionUser: FictionUser } & FictionPluginSettings

export class FictionExtend<T extends PluginIndexSettings = PluginIndexSettings> extends FictionPlugin<T> {
  constructor(settings: T) {
    super('FictionExtend', { root: safeDirname(import.meta.url), ...settings })
  }

  async setup(args: PluginSetupArgs) {
    await this.addPlugins(args)
  }

  async addPlugins(args: PluginSetupArgs) {
    const { context } = args

    const extensions = this.settings.extensions

    if (!extensions)
      return

    let installIds: string[] | undefined = undefined
    if (context === 'app') {
      await this.settings.fictionUser.userInitialized()
      // const extend = this.settings.fictionUser.activeOrganization?.value?.extend || {}
      const extend = [{ extensionId: 'fictionPosts', isActive: false }]
      installIds = extend.map(v => v?.isActive && v?.extensionId ? v.extensionId : undefined).filter(Boolean) as string[] || []
    }

    const service = await loadAndInitializeExtensions({ extensions, settings: this.settings, installIds })

    const s = this.settings.fictionEnv.service.value
    this.settings.fictionEnv.service.value = { ...s, ...service }

    this.log.info(`added plugins - context:${context}`, { data: Object.keys(service) })
  }
}
