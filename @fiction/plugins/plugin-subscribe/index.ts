import type { FictionAdmin } from '@fiction/admin'
import type { template as dashTemplate, panelTemplate } from '@fiction/admin/dashboard/cardDash'
import type { FictionAnalytics } from '@fiction/analytics'
import type { FictionDb, FictionEmail, FictionEnv, FictionPluginSettings, FictionServer, FictionUser } from '@fiction/core'
import type { FictionTransactions } from '@fiction/plugin-transactions'
import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import { getWidgets } from './admin/widgets'
import { getEmails } from './email'
import { ManageSubscriptionQuery, SubscriptionAnalytics } from './endpoint'
import { tables } from './schema'

export * from './schema'

export type FictionSubscribeSettings = {
  fictionDb: FictionDb
  fictionServer: FictionServer
  fictionEmail: FictionEmail
  fictionEnv: FictionEnv
  fictionUser: FictionUser
  fictionTransactions: FictionTransactions
  fictionAdmin: FictionAdmin
  fictionAnalytics: FictionAnalytics
} & FictionPluginSettings

export class FictionSubscribe extends FictionPlugin<FictionSubscribeSettings> {
  widgets = getWidgets({ fictionSubscribe: this, ...this.settings })
  queries = {
    ManageSubscription: new ManageSubscriptionQuery({ fictionSubscribe: this, ...this.settings }),
    SubscriptionAnalytics: new SubscriptionAnalytics({ fictionSubscribe: this, ...this.settings }),
  }

  requests = this.createRequests({
    queries: this.queries,
    fictionServer: this.settings.fictionServer,
    fictionUser: this.settings.fictionUser,
    basePath: '/subscribe',
  })

  transactions = getEmails({ fictionSubscribe: this })

  cacheKey = vue.ref(0)

  constructor(settings: FictionSubscribeSettings) {
    super('FictionSubscribe', { root: safeDirname(import.meta.url), ...settings })
    this.settings.fictionDb?.addTables(tables)

    this.admin()
  }

  admin() {
    const { fictionAdmin } = this.settings

    fictionAdmin.widgetRegister.value.push(...Object.values(this.widgets))

    fictionAdmin.addToWidgetArea('homeSecondary', [])
    fictionAdmin.addToWidgetArea('subscriberIndex', [{ key: 'subscribers' }, { key: 'unsubscribes' }, { key: 'cleaned' }])

    fictionAdmin.addAdminPages({
      key: 'audience',
      loader: async ({ factory }) => [

        await factory.fromTemplate<typeof dashTemplate>({
          templateId: 'dash',
          slug: 'subscriber-view',
          title: 'Connection Profile',
          description: 'View and manage individual subscriber details',
          cards: [await factory.fromTemplate({ el: vue.defineAsyncComponent(async () => import('./admin/ViewSingle.vue')) })],
          userConfig: { navIcon: 'i-tabler-user', parentNavItemSlug: 'audience' },
        }),
        await factory.fromTemplate<typeof dashTemplate>({
          templateId: 'dash',
          slug: 'audience',
          title: 'Network',
          description: 'Manage your subscriber database and engagement',
          userConfig: { isNavItem: true, navIcon: 'i-tabler-users', navIconAlt: 'i-tabler-users-plus', priority: 50 },
          cards: [
            await factory.fromTemplate({
              el: vue.defineAsyncComponent(async () => import('./admin/ViewManage.vue')),
              cards: [
                await factory.fromTemplate<typeof panelTemplate>({
                  slug: 'subscribers',
                  title: 'Your Audience',
                  description: 'View, filter, and manage your complete subscriber list',
                  el: vue.defineAsyncComponent(async () => import('./admin/ViewIndex.vue')),
                  userConfig: { isNavItem: true, navIcon: 'i-tabler-users', navIconAlt: 'i-tabler-users-plus' },
                }),
                await factory.fromTemplate<typeof panelTemplate>({
                  slug: 'view',
                  title: 'Connection Details',
                  description: 'View individual subscriber information and history',
                  el: vue.defineAsyncComponent(async () => import('./admin/ViewSingle.vue')),
                  userConfig: { navIcon: 'i-tabler-user' },
                }),
              ],
            }),
          ],
        }),
      ],
    })
  }
}
