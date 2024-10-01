import type { FictionAdmin } from '@fiction/admin'
import type { FictionDb, FictionEmail, FictionEnv, FictionMedia, FictionPluginSettings, FictionRouter, FictionServer, FictionUser } from '@fiction/core'
import type { FictionSubscribe } from '@fiction/plugin-subscribe'
import type { FictionTransactions } from '@fiction/plugin-transactions'
import type { FictionPosts } from '@fiction/posts'
import type { ExtensionManifest } from '../plugin-extend'
import { FictionPlugin, safeDirname, vue } from '@fiction/core'
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

    fictionAdmin.addAdminPages({ key: 'send', loader: async ({ factory }) => [
      await factory.create({
        templateId: 'dash',
        slug: 'email',
        title: 'Emails',
        cards: [await factory.create({ el: vue.defineAsyncComponent(async () => import('./admin/ViewIndex.vue')) })],
        userConfig: { isNavItem: true, navTitle: 'Email', navIcon: 'i-tabler-mail', navIconAlt: 'i-tabler-mail-share', priority: 50 },
      }),
      await factory.create({
        templateId: 'dash',
        slug: 'email-manage',
        title: 'Emails',
        cards: [
          await factory.create({
            el: vue.defineAsyncComponent(async () => import('./admin/ViewManage.vue')),
            cards: [
              await factory.create({
                slug: '_home',
                title: 'Overview',
                description: 'Overview of this campaign.',
                el: vue.defineAsyncComponent(async () => import('./admin/ManageOverview.vue')),
                userConfig: { isNavItem: true, navIcon: 'i-tabler-mail', navIconAlt: 'i-tabler-mail' },
              }),
              await factory.create({
                slug: 'settings',
                title: 'Settings',
                description: 'Settings for this campaign.',
                userConfig: { isNavItem: true, navIcon: 'i-tabler-settings', navIconAlt: 'i-tabler-settings-filled' },
              }),
              await factory.create({
                slug: 'preview',
                title: 'Preview',
                description: 'Preview the email.',
                userConfig: { isNavItem: true, navIcon: 'i-tabler-eye', navIconAlt: 'i-tabler-eye' },
              }),
            ],
          }),
        ],
      }),

      await factory.create({
        templateId: 'dash',
        slug: 'email-edit',
        title: 'Edit Email',
        cards: [
          await factory.create({
            el: vue.defineAsyncComponent(async () => import('./admin/ViewSingle.vue')),
            userConfig: { standard: { spacing: { verticalSpacing: 'none' } } },
          }),
        ],
        userConfig: { navIcon: 'i-tabler-send', parentNavItemSlug: 'send', layoutFormat: 'full' },
      }),

    ] })
  }
}

export const plugin: ExtensionManifest<FictionSendSettings> = {
  extensionId: 'fictionSend',
  name: 'Email Send System',
  desc: 'Create and send emails to users.',
  setup: async settings => new FictionSend(settings),
  installStatus: 'installed',
}
