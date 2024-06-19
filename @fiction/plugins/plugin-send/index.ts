import type { FictionDb, FictionEmail, FictionEnv, FictionPluginSettings, FictionServer, FictionUser } from '@fiction/core'
import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import type { FictionTransactions } from '@fiction/plugin-transactions'
import { createCard } from '@fiction/site'
import type { FictionAdmin } from '@fiction/admin'
import type { FictionPosts } from '@fiction/plugin-posts'
import { ManageSend } from './endpoint'
import { tables } from './schema.js'

export type FictionSendSettings = {
  fictionDb: FictionDb
  fictionServer: FictionServer
  fictionEmail: FictionEmail
  fictionEnv: FictionEnv
  fictionUser: FictionUser
  fictionTransactions: FictionTransactions
  fictionAdmin: FictionAdmin
  fictionPosts: FictionPosts
} & FictionPluginSettings

export class FictionSend extends FictionPlugin<FictionSendSettings> {
  queries = {
    ManageSubscription: new ManageSend({ fictionSend: this, ...this.settings }),
  }

  requests = this.createRequests({ queries: this.queries, fictionServer: this.settings.fictionServer, fictionUser: this.settings.fictionUser, basePath: '/send' })

  constructor(settings: FictionSendSettings) {
    super('FictionSend', { root: safeDirname(import.meta.url), ...settings })

    this.settings.fictionDb.addTables(tables)
    this.admin()
  }

  admin() {
    const { fictionAdmin } = this.settings

    fictionAdmin.addAdminPages(({ templates }) => [
      createCard({
        templates,
        templateId: 'dash',
        slug: 'send',
        title: 'Send',
        cards: [createCard({ el: vue.defineAsyncComponent(() => import('./admin/ViewIndex.vue')) })],
        userConfig: { isNavItem: true, navIcon: 'i-tabler-users', navIconAlt: 'i-tabler-users-plus', priority: 50 },
      }),
      createCard({
        templates,
        templateId: 'dash',
        slug: 'subscriber-view',
        title: 'View Subscriber',
        cards: [createCard({ el: vue.defineAsyncComponent(() => import('./admin/ViewSingle.vue')) })],
        userConfig: { navIcon: 'i-tabler-user', parentNavItemSlug: 'subscriber' },
      }),
    ])
  }
}
