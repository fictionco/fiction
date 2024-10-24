import type { FictionAdmin } from '@fiction/admin'

import type { FictionDb, FictionPluginSettings, FictionServer, FictionUser } from '@fiction/core'
import type { Card } from '@fiction/site'
import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import { QueryManagePost, type WherePost } from './endpoint'
import { Post } from './post'
import { tables } from './schema'
import { getWidgets } from './widgets'

type FictionPostsSettings = {
  fictionUser: FictionUser
  fictionServer: FictionServer
  fictionDb: FictionDb
  fictionAdmin: FictionAdmin
} & FictionPluginSettings

export * from './post'
export * from './schema'
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
  }

  adminUi() {
    const { fictionAdmin } = this.settings
    const w = Object.values(this.widgets)
    fictionAdmin.widgetRegister.value.push(...w)
    fictionAdmin.addToWidgetArea('homeMain', w.map(widget => widget.key))

    fictionAdmin.addAdminPages({ key: 'posts', loader: async ({ factory }) => [
      await factory.create({
        regionId: 'main',
        templateId: 'dash',
        slug: 'posts',
        title: 'Posts',
        cards: [await factory.create({ el: vue.defineAsyncComponent(async () => import('./el/PagePostIndex.vue')) })],
        userConfig: { isNavItem: true, navIcon: 'i-tabler-pin', navIconAlt: 'i-tabler-pin-filled' },
      }),
      await factory.create({
        regionId: 'main',
        templateId: 'dash',
        slug: 'edit-post',
        title: 'Edit Post',
        cards: [await factory.create({
          el: vue.defineAsyncComponent(async () => import('./el/PagePostEdit.vue')),
          userConfig: { standard: { spacing: { verticalSpacing: 'none' } }, isNavItem: false },
        })],
        userConfig: { layoutFormat: 'full' },

      }),
    ] })
  }

  async runScheduler() {
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

  async getPost(args: { orgId: string, where: WherePost, card: Card }) {
    const { orgId, where, card } = args

    const r = await this.requests.ManagePost.request({ _action: 'get', orgId, where: { orgId, ...where } })

    const postConfig = r.data?.[0]

    return r.data ? new Post({ card, fictionPosts: this, sourceMode: 'standard', ...postConfig }) : undefined
  }

  async getPostIndex(args: { orgId: string, limit?: number, offset?: number, card: Card }) {
    const { orgId, limit, offset, card } = args

    const r = await this.requests.ManagePost.request({ _action: 'list', where: { orgId }, limit, offset })

    const posts = r.data?.length ? r.data.map(p => new Post({ card, fictionPosts: this, sourceMode: 'standard', ...p })) : []

    return { posts, indexMeta: r.indexMeta }
  }
}
