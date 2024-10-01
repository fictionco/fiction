import type { FictionAdmin } from '@fiction/admin'
import type { FictionDb, FictionEmail, FictionEnv, FictionPluginSettings, FictionServer, FictionUser } from '@fiction/core'
import type { FictionTransactions } from '@fiction/plugin-transactions'
import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import { getWidgets } from './admin/widgets'
import { getEmails } from './email'
import { ManageSubscriptionQuery, SubscriptionAnalytics } from './endpoint'
import { tables } from './schema'

export * from './schema'

type FictionSubscribeSettings = {
  fictionDb: FictionDb
  fictionServer: FictionServer
  fictionEmail: FictionEmail
  fictionEnv: FictionEnv
  fictionUser: FictionUser
  fictionTransactions: FictionTransactions
  fictionAdmin: FictionAdmin
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

    fictionAdmin.addToWidgetArea('homeSecondary', ['subscribers', 'unsubscribes'])
    fictionAdmin.addToWidgetArea('subscriberIndex', ['subscribers', 'unsubscribes', 'cleaned'])

    fictionAdmin.addAdminPages({
      key: 'audience',
      loader: async ({ factory }) => [
      // await factory.create({
      //   templateId: 'dash',
      //   slug: 'audience',
      //   title: 'Audience',
      //   cards: [await factory.create({ el: vue.defineAsyncComponent(async () => import('./admin/ViewIndex.vue')) })],
      //   userConfig: { isNavItem: true, navIcon: 'i-tabler-users', navIconAlt: 'i-tabler-users-plus', priority: 50 },
      // }),
        await factory.create({
          templateId: 'dash',
          slug: 'subscriber-view',
          title: 'View Subscriber',
          cards: [await factory.create({ el: vue.defineAsyncComponent(async () => import('./admin/ViewSingle.vue')) })],
          userConfig: { navIcon: 'i-tabler-user', parentNavItemSlug: 'subscriber' },
        }),
        await factory.create({
          templateId: 'dash',
          slug: 'audience',
          title: 'Audience',
          userConfig: { isNavItem: true, navIcon: 'i-tabler-users', navIconAlt: 'i-tabler-users-plus', priority: 50 },
          cards: [
            await factory.create({
              el: vue.defineAsyncComponent(async () => import('./admin/ViewManage.vue')),
              cards: [
                await factory.create({
                  slug: '_home',
                  title: 'Subscribers',
                  description: 'Manage your subscribers',
                  el: vue.defineAsyncComponent(async () => import('./admin/ViewIndex.vue')),
                  userConfig: { isNavItem: true, navIcon: 'i-tabler-users', navIconAlt: 'i-tabler-users-plus' },
                }),
                await factory.create({
                  slug: 'add',
                  title: 'Add Subscribers',
                  description: 'Import from a CSV or Cut / Paste',
                  el: vue.defineAsyncComponent(async () => import('./admin/ElImportFile.vue')),
                  userConfig: { isNavItem: true, navIcon: 'i-tabler-table-share', navIconAlt: 'i-tabler-table-plus' },
                }),
                await factory.create({
                  slug: 'view',
                  title: 'View Subscriber',
                  el: vue.defineAsyncComponent(async () => import('./admin/ViewSingle.vue')),
                  userConfig: { navIcon: 'i-tabler-user' },
                }),
                await factory.create({
                  slug: 'analytics',
                  title: 'Subscriber Analytics',
                  description: 'Total subscribers and more',
                  el: vue.defineAsyncComponent(async () => import('./admin/ViewAnalytics.vue')),
                  userConfig: { isNavItem: true, navIcon: 'i-tabler-user' },
                }),
              ],
            }),
          ],
        }),
      ],
    })
  }
}
