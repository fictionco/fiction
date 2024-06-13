import type { FictionDb, FictionEmail, FictionEnv, FictionPluginSettings, FictionServer, FictionUser, TableMediaConfig } from '@fiction/core'
import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import type { FictionTransactions } from '@fiction/plugin-transactions'
import { createCard } from '@fiction/site'
import multer from 'multer'
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
    SubscriptionAnalytics: new SubscriptionAnalytics({ fictionSubscribe: this, ...this.settings, key: 'subscriptionAnalytics' }),
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

    this.addAdminPages()
  }

  addAdminPages() {
    const basic = { caller: 'FictionSubscribe', context: 'app' } as const
    this.settings.fictionEnv.addHook({
      hook: 'widgetMap',
      ...basic,
      callback: (w) => {
        const widgetList = Object.values(this.widgets)
        w.homeMain = [...(w.homeMain || []), ...widgetList]
        return w
      },
    })

    this.settings.fictionEnv.addHook({
      hook: 'adminPages',
      ...basic,
      callback: async (pages, meta) => {
        const { templates } = meta
        return [
          ...pages,
          createCard({
            templates,
            templateId: 'dash',
            slug: 'subscriber',
            title: 'Subscribers',
            cards: [
              createCard({ el: vue.defineAsyncComponent(() => import('./admin/ViewIndex.vue')) }),
            ],
            userConfig: {
              isNavItem: true,
              navIcon: 'i-tabler-users',
              navIconAlt: 'i-tabler-users-plus',
              priority: 50,
            },
          }),
          createCard({
            templates,
            templateId: 'dash',
            slug: 'subscriber-view',
            title: 'Subscriber',
            cards: [
              createCard({ el: vue.defineAsyncComponent(() => import('./admin/ViewSingle.vue')) }),
            ],
            userConfig: {
              navIcon: 'i-tabler-user',
              parentNavItemSlug: 'subscriber',
            },
          }),
          createCard({
            templates,
            templateId: 'dash',
            slug: 'subscriber-manage',
            title: 'Manage Subscribers',
            cards: [
              createCard({ el: vue.defineAsyncComponent(() => import('./admin/ViewManage.vue')) }),
            ],
            userConfig: {
              navIcon: 'i-tabler-users-group',
              parentNavItemSlug: 'subscriber',
            },
          }),
        ]
      },
    })
  }
}
