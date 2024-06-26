import type { FictionDb, FictionEmail, FictionEnv, FictionMedia, FictionPluginSettings, FictionRouter, FictionServer, FictionUser } from '@fiction/core'
import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import type { FictionTransactions } from '@fiction/plugin-transactions'
import { createCard } from '@fiction/site'
import type { FictionAdmin } from '@fiction/admin'
import type { FictionPosts } from '@fiction/posts'
import type { FictionSubscribe } from '@fiction/plugin-subscribe'
import type { ExtensionManifest } from '../plugin-extend'
import { ManageCampaign, ManageSend } from './endpoint'
import { sendTable } from './schema.js'

export type FictionSendSettings = {
  fictionDb: FictionDb
  fictionServer: FictionServer
  fictionEmail: FictionEmail
  fictionEnv: FictionEnv
  fictionUser: FictionUser
  fictionTransactions: FictionTransactions
  fictionAdmin: FictionAdmin
  fictionPosts: FictionPosts
  fictionRouter: FictionRouter
  fictionSubscribe: FictionSubscribe
  fictionMedia: FictionMedia
} & FictionPluginSettings

export class FictionSend extends FictionPlugin<FictionSendSettings> {
  queries = {
    ManageCampaign: new ManageCampaign({ fictionSend: this, ...this.settings }),
    ManageSend: new ManageSend({ fictionSend: this, ...this.settings }),
  }

  requests = this.createRequests({ queries: this.queries, fictionServer: this.settings.fictionServer, fictionUser: this.settings.fictionUser, basePath: '/send' })
  cacheKey = vue.ref(0)
  constructor(settings: FictionSendSettings) {
    super('FictionSend', { root: safeDirname(import.meta.url), ...settings })

    this.settings.fictionDb.addTables([sendTable])
    this.admin()
  }

  async initEmailSendLoop(args: { crontab?: string } = {}) {
    await this.queries.ManageSend.init(args)
  }

  close() {
    this.queries.ManageSend.close()
  }

  admin() {
    const { fictionAdmin } = this.settings

    fictionAdmin.addAdminPages(({ templates }) => [
      createCard({
        templates,
        templateId: 'dash',
        slug: 'send',
        title: 'Emails',
        cards: [createCard({ el: vue.defineAsyncComponent(() => import('./admin/ViewIndex.vue')) })],
        userConfig: { isNavItem: true, navTitle: 'Send', navIcon: 'i-tabler-mail', navIconAlt: 'i-tabler-mail-share', priority: 50 },
      }),

      createCard({
        templates,
        templateId: 'dash',
        slug: 'campaign-edit',
        title: 'Edit Email',
        cards: [createCard({ el: vue.defineAsyncComponent(() => import('./admin/ViewSingle.vue')) })],
        userConfig: { navIcon: 'i-tabler-send', parentNavItemSlug: 'send', layoutFormat: 'full' },
      }),

      createCard({
        templates,
        templateId: 'dash',
        slug: 'campaign-manage',
        title: 'Manage Email',
        cards: [createCard({ el: vue.defineAsyncComponent(() => import('./admin/ViewManage.vue')) })],
        userConfig: { navIcon: 'i-tabler-send', parentNavItemSlug: 'send' },
      }),
    ])
  }
}

export const plugin: ExtensionManifest<FictionSendSettings> = {
  extensionId: 'fictionSend',
  name: 'Email Send System',
  desc: 'Create and send emails to users.',
  setup: async settings => new FictionSend(settings),
  installStatus: 'installed',
}
