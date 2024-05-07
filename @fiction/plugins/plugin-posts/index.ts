import type { FictionDb, FictionPluginSettings, FictionServer, FictionUser } from '@fiction/core'

import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import { CardTemplate, createCard } from '@fiction/site'
import { FictionEditor } from '@fiction/plugin-editor'
import type { ExtensionManifest } from '../plugin-extend'
import { tables } from './schema'
import { ManagePostIndex, QueryManagePost } from './endpoint'

type FictionPostsSettings = { fictionUser: FictionUser, fictionServer: FictionServer, fictionDb: FictionDb } & FictionPluginSettings

export * from './schema'
export * from './utils'
export * from './post'

export class FictionPosts extends FictionPlugin<FictionPostsSettings> {
  editor = new FictionEditor(this.settings)
  queries = {
    ManagePost: new QueryManagePost({ fictionPosts: this, ...this.settings }),
    ManagePostIndex: new ManagePostIndex({ fictionPosts: this, ...this.settings }),
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
                templateId: 'postIndex',
                el: vue.defineAsyncComponent(() => import('./el/PagePostIndex.vue')),
              }),
            }),
          ],
          userConfig: {
            isNavItem: true,
            navIcon: 'i-tabler-pin',
            navIconAlt: 'i-tabler-pin-filled',
          },
        }),
        createCard({
          templates,
          regionId: 'main',
          templateId: 'dash',
          slug: 'post-edit',
          title: 'Edit Post',
          cards: [
            createCard({
              tpl: new CardTemplate({
                templateId: 'postEdit',
                el: vue.defineAsyncComponent(() => import('./el/PagePostEdit.vue')),
              }),
            }),
          ],
          userConfig: { layoutFormat: 'full' },
        }),
      ]
    } })
  }

  override async setup() {
    if (!this.settings.fictionEnv.isApp.value) {
      const { CronJob } = await import('cron')
      const job = new CronJob(
        '0 */1 * * * *', // cronTime: At minute 0 past every 5th hour
        () => {
          this.log.info('RUN ----> job scheduler (5 minutes)')
        },
      )

      job.start()
    }
  }
}

export const plugin: ExtensionManifest<FictionPostsSettings> = {
  extensionId: 'fictionPosts',
  name: 'Post and Blog System',
  desc: 'Adds posts and blog functionality to Fiction',
  setup: async settings => new FictionPosts(settings),
}
