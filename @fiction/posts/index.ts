import type { FictionAdmin } from '@fiction/admin'

import type {  dashTemplate  } from '@fiction/admin/dashboard/templates'
import type { FictionAnalytics } from '@fiction/analytics'
import type { FictionDb, FictionEmail, FictionMedia, FictionPluginSettings, FictionRevision, FictionRouter, FictionServer, FictionUser } from '@fiction/core'
import type { FictionContact } from '@fiction/plugin-contact'
import { cardTemplate, type FictionSites } from '@fiction/site'
import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import { QueryManagePost } from './endpoint'
import { FictionPublish } from './publish'
import { getRoutes } from './routes'
import { tables } from './schema'
import { createHelloWorldPost } from './utils/index.js'
import { getWidgets } from './widgets'

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
} & FictionPluginSettings

export * from './schema'
export * from './types'
export * from './utils/index.js'
export * from './utils/links.js'

export class FictionPosts extends FictionPlugin<FictionPostsSettings> {
  widgets = getWidgets({ fictionPosts: this, ...this.settings })
  queries = {
    ManagePost: new QueryManagePost({ fictionPosts: this, ...this.settings }),
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

    this.hooks()
  }

  hooks() {
    this.fictionEnv.events.on('onNewOrganization', async (event) => {
      const { org: { orgId }, userId, withDefaults } = event.detail

      if (!withDefaults) { return }

      if (!orgId)
        throw new Error('orgId not found')

      await createHelloWorldPost({ orgId, fictionPosts: this, userId })
    })
  }

  adminUi() {
    const { fictionAdmin } = this.settings
    const w = Object.values(this.widgets)
    fictionAdmin.widgetRegister.value.push(...w)
    fictionAdmin.addToWidgetArea('homeMain', w.map(widget => ({ key: widget.key })))

    fictionAdmin.addFeature({
      key: 'posts',
      getTemplates: async () => {
        return [
          cardTemplate({templateId: 'tplManagePost', el: vue.defineAsyncComponent(() => import('./admin/ViewManage.vue'))}),
          cardTemplate({templateId: 'tplManagePostEdit', el: vue.defineAsyncComponent(() => import('./admin/PagePostEdit.vue'))}),
          cardTemplate({templateId: 'tplManagePostPreview', el: vue.defineAsyncComponent(() => import('./admin/ViewPreview.vue'))}),
        ]
      },
      getPages: async ({ factory }) => [

        await factory.fromTemplate<typeof dashTemplate>({
          templateId: 'dash',
          slug: 'posts',
          title: 'Posts',
          description: 'Create, manage, and schedule your content',
          cards: [
            await factory.fromTemplate({ templateId: 'tplManagePost' }),
          ],
          userConfig: { isNavItem: true, navIcon: 'i-tabler-file-description', navIconAlt: 'i-tabler-file-spark' },
        }),
        await factory.fromTemplate<typeof dashTemplate>({
          regionId: 'main',
          templateId: 'dash',
          slug: 'edit-post',
          title: 'Post Editor',
          description: 'Create and edit your content with our full-featured editor',
          cards: [
            await factory.fromTemplate({
              templateId: 'tplManagePostEdit',
              userConfig: { standard: { spaceSize: 'none' }},
            }),
          ],
          userConfig: { layoutFormat: 'full' },
        }),
        await factory.fromTemplate<typeof dashTemplate>({
          templateId: 'dash',
          userConfig: { layoutFormat: 'full' },
          slug: 'preview-post-browser',
          title: 'Post Preview (Browser)',
          cards: [
            await factory.fromTemplate({
              templateId: 'tplManagePostPreview',
              userConfig: { standard: { spaceSize: 'none' } },
            }),
          ],
        }),
        await factory.fromTemplate<typeof dashTemplate>({
          templateId: 'dash',
          userConfig: { layoutFormat: 'full' },
          slug: 'preview-post-email',
          title: 'Post Preview (Email)',
          cards: [
            await factory.fromTemplate({
              templateId: 'tplManagePostPreview',
              userConfig: { standard: { spaceSize: 'none' } },
            }),
          ],
        }),
      ],
    })
  }
}
