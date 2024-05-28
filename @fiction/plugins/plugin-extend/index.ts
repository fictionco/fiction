import { CardTemplate, createCard } from '@fiction/site'
import { FictionPlugin } from '@fiction/core/plugin'
import type { FictionUser } from '@fiction/core/plugin-user'
import { safeDirname, vue } from '@fiction/core/utils'
import type { FictionPluginSettings, PluginSetupArgs } from '@fiction/core/plugin'
import { runServicesSetup } from '@fiction/core'
import type { ExtensionLoader, ExtensionManifest } from './utils'
import { loadAndInitializeExtensions } from './utils'

export * from './utils'

type PluginIndexSettings = { extensionIndex: ExtensionLoader<Record<string, any>>[], fictionUser: FictionUser } & FictionPluginSettings

export class FictionExtend<T extends PluginIndexSettings = PluginIndexSettings> extends FictionPlugin<T> {
  extensions = vue.shallowRef<ExtensionManifest[]>([])
  constructor(settings: T) {
    super('FictionExtend', { root: safeDirname(import.meta.url), ...settings })

    this.settings.fictionEnv.addHook({
      hook: 'adminPages',
      caller: 'extendConfig',
        context: 'app',
      callback: async (pages, meta) => {
      const { templates } = meta
      return [
        ...pages,
        createCard({
          templates,
          regionId: 'main',
          templateId: 'dash',
          slug: 'extend',
          title: 'Plugins',
          cards: [
            createCard({
              tpl: new CardTemplate({
                templateId: 'extend',
                el: vue.defineAsyncComponent(() => import('./ViewExtend.vue')),
              }),
            }),
          ],
          userConfig: {
            isNavItem: true,
            navIcon: 'i-tabler-plug',
            navIconAlt: 'i-tabler-plug-x',
            priority: 100,
          },
        }),
      ]
    } })
  }

  override async beforeSetup(args: PluginSetupArgs) {
    await this.addPlugins(args)
  }

  async addPlugins(args: PluginSetupArgs) {
    const { context } = args

    const extensionIndex = this.settings.extensionIndex

    if (!extensionIndex)
      return

    this.extensions.value = await Promise.all(extensionIndex.map(async (e) => {
      const { plugin } = await e.load()
      return { ...e, ...plugin }
    }))

    let installIds: string[] | undefined = undefined
    if (context === 'app' && !this.settings.fictionEnv.isNode) {
      await this.settings.fictionUser.userInitialized({ caller: 'extend' })
      // const extend = this.settings.fictionUser.activeOrganization?.value?.extend || {}
      const extend = [{ extensionId: 'fictionPosts', isActive: true }]
      installIds = extend.map(v => v?.isActive && v?.extensionId ? v.extensionId : undefined).filter(Boolean) as string[] || []
    }

    const service = await loadAndInitializeExtensions({ extensions: this.extensions.value, settings: this.settings, installIds })

    await runServicesSetup(service, { context })

    const s = this.settings.fictionEnv.service.value
    this.settings.fictionEnv.service.value = { ...s, ...service }

    if (context === 'node')
      this.log.info(`added plugins - context:${context}`, { data: Object.keys(service) })
  }
}
