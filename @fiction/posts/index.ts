import type { FictionAdmin } from '@fiction/admin'

import type { template as dashTemplate, panelTemplate } from '@fiction/admin/dashboard/cardDash'
import type { FictionAnalytics } from '@fiction/analytics'
import type { ComplexDataFilter, FictionDb, FictionEmail, FictionMedia, FictionPluginSettings, FictionRevision, FictionServer, FictionUser } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { WherePost } from './endpoint'
import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import { QueryManagePost } from './endpoint'
import { Post } from './post'
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

  constructor(settings: FictionPostsSettings) {
    super('FictionPosts', { ...settings, root: safeDirname(import.meta.url) })

    const { fictionDb } = this.settings

    fictionDb.addTables(tables)

    this.adminUi()

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
                userConfig: { isNavItem: true, navIcon: 'i-tabler-stack-push', navIconAlt: 'i-tabler-stack' },
              }),
            ],
          }),
        ],
        userConfig: { isNavItem: true, navIcon: 'i-tabler-stack-push', navIconAlt: 'i-tabler-stack' },
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
    ] })
  }

  async runScheduler() {
    if (!this.settings.fictionEnv.isApp.value) {
      const { CronJob } = await import('cron')
      const job = new CronJob(
        '0 */1 * * * *',
        () => {
          this.log.info('RUN ----> job scheduler (5 minutes)')
        },
      )

      job.start()
    }
  }

  async getPost(args: { orgId: string, where: WherePost, card: Card }) {
    const { orgId, where, card } = args

    const r = await this.requests.ManagePost.request({ _action: 'get', orgId, where: { orgId, ...where } })

    const postConfig = r.data?.[0]

    return r.data ? new Post({ card, fictionPosts: this, sourceMode: 'standard', ...postConfig }) : undefined
  }

  async getPostIndex(args: {
    orgId: string
    limit?: number
    offset?: number
    filters?: ComplexDataFilter[]
    card: Card
    viewSlug?: string
    caller: string
  }) {
    const { orgId, limit = 20, offset, card, caller = 'unknown', viewSlug, filters = [] } = args

    const r = await this.requests.ManagePost.request({ _action: 'list', where: { orgId }, limit, offset, filters }, { caller: `getPostIndex-${caller}` })

    const posts = r.data?.length ? r.data.map(p => new Post({ card, fictionPosts: this, sourceMode: 'standard', viewSlug, ...p })) : []

    return { posts, indexMeta: r.indexMeta }
  }
}
