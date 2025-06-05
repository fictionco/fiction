import type { FictionAdmin } from '@fiction/admin'

import type { AdminTemplates } from '@fiction/admin/theme'
import type { FictionAnalytics } from '@fiction/analytics'
import type { FictionDb, FictionEmail, FictionMedia, FictionPluginSettings, FictionRevision, FictionRouter, FictionServer, FictionUser } from '@fiction/core'
import type { FictionContact } from '@fiction/plugin-contact'
import type { FictionAi } from '@fiction/plugins/plugin-ai'
import type { FictionMonitor } from '@fiction/plugins/plugin-monitor'
import type { FictionSites } from '@fiction/site'
import { cardConfigCustom } from '@fiction/cards'
import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card.js'
import { QueryManagePost } from './endpoint'
import { QueryPostComments, QueryPostLikes } from './endpointMeta'
import { FictionPublish } from './publish'
import { getRoutes } from './routes'
import { tables } from './schema'

export * from './post'

export type FictionPostsSettings = {
  fictionUser: FictionUser
  fictionServer: FictionServer
  fictionDb: FictionDb
  fictionAdmin: FictionAdmin
  fictionEmail: FictionEmail
  fictionMedia: FictionMedia
  fictionAnalytics: FictionAnalytics
  fictionRevision: FictionRevision
  fictionRouter: FictionRouter
  fictionContact: FictionContact
  fictionSites: FictionSites
  fictionAi: FictionAi
  fictionMonitor?: FictionMonitor
} & FictionPluginSettings

export * from './schema'
export * from './types'
export * from './utils/index.js'
export * from './utils/links.js'

function getTemplates() {
  return [
    cardTemplate({ templateId: 'tplManagePost', el: vue.defineAsyncComponent(() => import('./admin/ViewManage.vue')) }),
    cardTemplate({ templateId: 'tplManagePostEdit', el: vue.defineAsyncComponent(() => import('./admin/EditorWrap.vue')) }),
    cardTemplate({ templateId: 'tplManagePostPreview', el: vue.defineAsyncComponent(() => import('./admin/ViewPreview.vue')) }),
  ]
}

type PostAdminTemplates = AdminTemplates & ReturnType<typeof getTemplates>

export class FictionPosts extends FictionPlugin<FictionPostsSettings> {
  queries = {
    ManagePost: new QueryManagePost({ fictionPosts: this, ...this.settings }),
    PostComments: new QueryPostComments({ fictionPosts: this, ...this.settings }),
    PostLikes: new QueryPostLikes({ fictionPosts: this, ...this.settings }),
  }

  requests = this.createRequests({
    queries: this.queries,
    fictionServer: this.settings.fictionServer,
    fictionUser: this.settings.fictionUser,
  })

  cacheKey = vue.ref(0)

  fictionPublish = new FictionPublish({ fictionPosts: this, ...this.settings })

  constructor(settings: FictionPostsSettings) {
    super('FictionPosts', { ...settings, root: safeDirname(import.meta.url) })

    const { fictionDb } = this.settings

    fictionDb.addTables(tables)

    this.adminUi()
    this.settings.fictionRouter?.update(getRoutes())
  }

  adminUi() {
    const { fictionAdmin } = this.settings

    fictionAdmin.addFeature({
      key: 'posts',
      getTemplates: async () => getTemplates(),
      getPages: async () => [

        cardConfigCustom<PostAdminTemplates>({
          templateId: 'dash',
          slug: 'posts',
          title: 'Posts',
          description: 'Create, manage, and schedule your content',
          cards: [
            cardConfigCustom<PostAdminTemplates>({ templateId: 'tplManagePost' }),
          ],
          userConfig: { isNavItem: true, navIcon: 'i-tabler-file-description', navIconAlt: 'i-tabler-file-spark' },
        }),
        cardConfigCustom<PostAdminTemplates>({
          regionId: 'main',
          templateId: 'dash',
          slug: 'edit-post',
          title: 'Post Editor',
          description: 'Create and edit your content with our full-featured editor',
          cards: [
            cardConfigCustom<PostAdminTemplates>({
              templateId: 'tplManagePostEdit',
              userConfig: { standard: { spaceSize: 'none' } },
            }),
          ],
          userConfig: { layoutFormat: 'full' },
        }),
        cardConfigCustom<PostAdminTemplates>({
          templateId: 'dash',
          userConfig: { layoutFormat: 'full' },
          slug: 'preview-post-browser',
          title: 'Post Preview (Browser)',
          cards: [
            cardConfigCustom<PostAdminTemplates>({
              templateId: 'tplManagePostPreview',
              userConfig: { standard: { spaceSize: 'none' } },
            }),
          ],
        }),
        cardConfigCustom<PostAdminTemplates>({
          templateId: 'dash',
          userConfig: { layoutFormat: 'full' },
          slug: 'preview-post-email',
          title: 'Post Preview (Email)',
          cards: [
            cardConfigCustom<PostAdminTemplates>({
              templateId: 'tplManagePostPreview',
              userConfig: { standard: { spaceSize: 'none' } },
            }),
          ],
        }),
      ],
    })
  }
}
