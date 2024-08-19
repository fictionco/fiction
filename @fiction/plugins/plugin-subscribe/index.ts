import type { FictionDb, FictionEmail, FictionEnv, FictionPluginSettings, FictionServer, FictionUser } from '@fiction/core'
import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import type { FictionTransactions } from '@fiction/plugin-transactions'
import type { FictionAdmin } from '@fiction/admin'
import { tables } from './schema'
import { ManageSubscriptionQuery, SubscriptionAnalytics } from './endpoint'
import { getEmails } from './email'
import { getWidgets } from './admin/widgets'

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
    const widgetKeys = Object.values(this.widgets).map(widget => widget.key)
    fictionAdmin.addToWidgetArea('homeSecondary', widgetKeys)
    fictionAdmin.addToWidgetArea('subscriberIndex', widgetKeys)

    fictionAdmin.addAdminPages(async ({ factory }) => [
      await factory.create({
        templateId: 'dash',
        slug: 'audience',
        title: 'Audience',
        cards: [await factory.create({ el: vue.defineAsyncComponent(async () => import('./admin/ViewIndex.vue')) })],
        userConfig: { isNavItem: true, navIcon: 'i-tabler-users', navIconAlt: 'i-tabler-users-plus', priority: 50 },
      }),
      await factory.create({
        templateId: 'dash',
        slug: 'subscriber-view',
        title: 'View Subscriber',
        cards: [await factory.create({ el: vue.defineAsyncComponent(async () => import('./admin/ViewSingle.vue')) })],
        userConfig: { navIcon: 'i-tabler-user', parentNavItemSlug: 'subscriber' },
      }),
      await factory.create({
        templateId: 'dash',
        slug: 'audience-manage',
        title: 'Manage Audience',
        cards: [await factory.create({ el: vue.defineAsyncComponent(async () => import('./admin/ViewManage.vue')) })],
        userConfig: { navIcon: 'i-tabler-users-group', parentNavItemSlug: 'subscriber' },
      }),
    ])
  }
}
