import type { FictionAdmin } from '@fiction/admin'
import type { template as dashTemplate, panelTemplate } from '@fiction/admin/dashboard/cardDash'
import type { FictionAnalytics } from '@fiction/analytics'
import type { FictionDb, FictionEmail, FictionEnv, FictionMedia, FictionPluginSettings, FictionRouter, FictionServer, FictionUser } from '@fiction/core'
import type { FictionSubscribe } from '@fiction/plugin-subscribe'
import type { FictionTransactions } from '@fiction/plugin-transactions'
import type { FictionPosts } from '@fiction/posts'
import type { ExtensionManifest } from '../plugin-extend'
import { Endpoint, FictionPlugin, safeDirname, vue } from '@fiction/core'
import { ManageCampaign, ManageSend } from './endpoint'
import { sendTable } from './schema.js'
import { trackingEndpointHandler } from './utils'

export type FictionNewsletterSettings = {
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
  fictionAnalytics: FictionAnalytics
} & FictionPluginSettings

export class FictionNewsletter extends FictionPlugin<FictionNewsletterSettings> {
  queries = {
    ManageCampaign: new ManageCampaign({ fictionNewsletter: this, ...this.settings }),
    ManageSend: new ManageSend({ fictionNewsletter: this, ...this.settings }),
  }

  requests = this.createRequests({ queries: this.queries, fictionServer: this.settings.fictionServer, fictionUser: this.settings.fictionUser, basePath: '/send' })
  cacheKey = vue.ref(0)
  constructor(settings: FictionNewsletterSettings) {
    super('FictionNewsletter', { root: safeDirname(import.meta.url), ...settings })

    this.settings.fictionDb.addTables([sendTable])
    this.admin()
    this.trackingWebhookEndpoint()
  }

  private trackingWebhookEndpoint() {
    if (this.fictionEnv.isApp.value) {
      return
    }

    const checkoutEndpoint = new Endpoint({
      requestHandler: async (...r) => trackingEndpointHandler({ request: r[0], response: r[1], fictionNewsletter: this }),
      key: 'emailTrackingEndpoint',
      basePath: '/email-tracking/:action?',
      serverUrl: this.settings.fictionServer.serverUrl.value,
      fictionUser: this.settings.fictionUser,
      fictionEnv: this.settings.fictionEnv,
      useNaked: true,
    })

    this.settings.fictionServer.addEndpoints([checkoutEndpoint])
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

      await factory.fromTemplate<typeof dashTemplate>({
        templateId: 'dash',
        slug: 'newsletter',
        title: 'Send Email',
        description: 'Create and manage your email marketing campaigns',
        cards: [
          await factory.fromTemplate<typeof panelTemplate>({
            el: vue.defineAsyncComponent(async () => import('./admin/ViewManageIndex.vue')),
            cards: [
              await factory.fromTemplate<typeof panelTemplate>({
                slug: 'campaigns',
                title: 'Campaign Library',
                description: 'View, track, and manage all your email campaigns in one place',
                el: vue.defineAsyncComponent(async () => import('./admin/ViewIndex.vue')),
                userConfig: { isNavItem: true, navIcon: 'i-tabler-mail', navIconAlt: 'i-tabler-mail-share' },
              }),
            ],
          }),
        ],
        userConfig: { isNavItem: true, navIcon: 'i-tabler-mail', navIconAlt: 'i-tabler-mail-share' },
      }),
      await factory.fromTemplate<typeof dashTemplate>({
        templateId: 'dash',
        slug: 'manage-newsletter',
        title: 'Manage Campaign',
        cards: [
          await factory.fromTemplate<typeof panelTemplate>({
            el: vue.defineAsyncComponent(async () => import('./admin/ViewManageCampaign.vue')),
            cards: [
              await factory.fromTemplate<typeof panelTemplate>({
                slug: 'summary',
                title: 'Campaign Summary',
                description: 'Track delivery status, engagement metrics, and campaign performance',
                el: vue.defineAsyncComponent(async () => import('./admin/ManageOverview.vue')),
                userConfig: { isNavItem: true, navIcon: 'i-tabler-dashboard', navIconAlt: 'i-tabler-dashboard' },
              }),
            ],
          }),
        ],
        userConfig: { parentNavItemSlug: 'newsletter' },
      }),

      await factory.fromTemplate<typeof dashTemplate>({
        templateId: 'dash',
        slug: 'newsletter-composer',
        title: 'Campaign Editor',
        description: 'Design and customize your email campaign',
        cards: [
          await factory.fromTemplate<typeof panelTemplate>({
            el: vue.defineAsyncComponent(async () => import('./admin/EmailEditor.vue')),
            userConfig: { standard: { spaceSize: 'none' } },
          }),
        ],
        userConfig: { navIcon: 'i-tabler-send', parentNavItemSlug: 'send', layoutFormat: 'full' },
      }),

    ] })
  }
}

export const plugin: ExtensionManifest<FictionNewsletterSettings> = {
  extensionId: 'fictionNewsletter',
  label: 'Email Send System',
  description: 'Create and send emails to users.',
  setup: async settings => new FictionNewsletter(settings),
  installStatus: 'installed',
}
