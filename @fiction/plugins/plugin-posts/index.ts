import type { FictionDb, FictionPluginSettings, FictionServer, FictionUser } from '@fiction/core'

import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import { CardTemplate, createCard } from '@fiction/site'
import { FictionEditor } from '@fiction/plugin-editor'
import type { ExtensionManifest } from '../plugin-extend'
import { tables } from './schema'
import { QueryManagePost } from './endpoint'

type FictionPostsSettings = { fictionUser: FictionUser, fictionServer: FictionServer, fictionDb: FictionDb } & FictionPluginSettings

export class FictionPosts extends FictionPlugin<FictionPostsSettings> {
  editor = new FictionEditor(this.settings)
  queries = {
    ManagePost: new QueryManagePost({ fictionPosts: this, ...this.settings }),
  }

  requests = this.createRequests({
    queries: this.queries,
    fictionServer: this.settings.fictionServer,
    fictionUser: this.settings.fictionUser,
  })

  constructor(settings: FictionPostsSettings) {
    super('FictionPosts', { ...settings, root: safeDirname(import.meta.url) })

    this.settings.fictionDb.addTables(tables)

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

  override async setup() {
    console.warn('------------------------------------SETUP WORLD------------------------------------')
  }
}

export const plugin: ExtensionManifest<FictionPostsSettings> = {
  extensionId: 'fictionPosts',
  name: 'Post and Blog System',
  desc: 'Adds posts and blog functionality to Fiction',
  setup: async settings => new FictionPosts(settings),
}
