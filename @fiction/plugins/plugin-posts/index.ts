import type { FictionPluginSettings } from '@fiction/core'

import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import { CardTemplate, type FictionSites, createCard } from '@fiction/site'
import type { ExtensionManifest } from '../plugin-extend'

 type FictionPostsSettings = { fictionSites: FictionSites } & FictionPluginSettings
class FictionPosts extends FictionPlugin<FictionPostsSettings> {
  constructor(settings: FictionPostsSettings) {
    super('FictionPosts', { ...settings, root: safeDirname(import.meta.url) })

    this.settings.fictionEnv.addHook({ hook: 'adminPages', callback: async (pages, meta) => {
      const { templates } = meta
      return [
        ...pages,
        createCard({
          templates,
          regionId: 'main',
          templateId: 'dash',
          slug: 'posts',
          title: 'Posts',
          cards: [
            createCard({
              tpl: new CardTemplate({
                templateId: 'sites',
                el: vue.defineAsyncComponent(() => import('./ViewPosts.vue')),
              }),
            }),
          ],
          userConfig: {
            isNavItem: true,
            navIcon: 'i-tabler-pin',
            navIconAlt: 'i-tabler-pin-filled',
          },
        }),
      ]
    } })
  }

  async setup() {
    console.warn('------------------------------------SETUP WORLD------------------------------------')
  }
}

export const plugin: ExtensionManifest<FictionPostsSettings> = {
  extensionId: 'fictionPosts',
  name: 'Post and Blog System',
  desc: 'Adds posts and blog functionality to Fiction',
  setup: async settings => new FictionPosts(settings),
}
