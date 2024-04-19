import type { FictionPluginSettings } from '@fiction/core'

import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import { CardTemplate, type FictionSites, createCard } from '@fiction/site'

export type FictionPostsSettings = { fictionSites: FictionSites } & FictionPluginSettings
export class FictionPosts extends FictionPlugin<FictionPostsSettings> {
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

export async function setup(settings: FictionPostsSettings) {
  return new FictionPosts(settings)
}
