import type { FictionAdmin } from '@fiction/admin'

import type { template as dashTemplate, panelTemplate } from '@fiction/admin/dashboard/cardDash'
import type { FictionAnalytics } from '@fiction/analytics'
import type { FictionDb, FictionEmail, FictionMedia, FictionPluginSettings, FictionRevision, FictionRouter, FictionServer, FictionUser } from '@fiction/core'
import type { FictionContact } from '@fiction/plugin-contact'
import type { FictionSites } from '@fiction/site'
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
    fictionAdmin.addToWidgetArea('homeSecondary', w.map(widget => ({ key: widget.key })))

    fictionAdmin.addAdminPages({ key: 'posts', loader: async ({ factory }) => [

      await factory.fromTemplate<typeof dashTemplate>({
        templateId: 'dash',
        slug: 'posts',
        title: 'Posts',
        description: 'Create, manage, and schedule your content',
        cards: [
          await factory.fromTemplate({
            el: vue.defineAsyncComponent(async () => import('./admin/ViewManage.vue')),
            cards: [
              await factory.fromTemplate<typeof panelTemplate>({
                slug: 'posts',
                title: 'Posts',
                description: 'Manage your articles, updates, and announcements',
                el: vue.defineAsyncComponent(async () => import('./admin/PagePostIndex.vue')),
                userConfig: { isNavItem: true, navIcon: 'i-tabler-file-description', navIconAlt: 'i-tabler-file-spark' },
              }),
            ],
          }),
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
          await factory.fromTemplate<typeof panelTemplate>({
            el: vue.defineAsyncComponent(async () => import('./admin/PagePostEdit.vue')),
            userConfig: { standard: { spaceSize: 'none' }, isNavItem: false },
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
            el: vue.defineAsyncComponent(async () => import('./admin/ViewPreview.vue')),
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
            el: vue.defineAsyncComponent(async () => import('./admin/ViewPreview.vue')),
            userConfig: { standard: { spaceSize: 'none' } },
          }),
        ],
      }),
    ] })
  }
}
