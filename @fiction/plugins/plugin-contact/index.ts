import type { FictionAdmin } from '@fiction/admin'
import type { template as dashTemplate, panelTemplate } from '@fiction/admin/dashboard/cardDash'
import type { FictionAnalytics } from '@fiction/analytics'
import type { FictionDb, FictionEmail, FictionEnv, FictionPluginSettings, FictionServer, FictionUser } from '@fiction/core'
import type { FictionTransactions } from '@fiction/plugin-transactions'
import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import { getWidgets } from './admin/widgets'
import { getEmails } from './email'
import { ManageContactQuery, SubscriptionAnalytics } from './endpoint'
import { t, tables } from './schema'

export * from './schema'

export type FictionContactSettings = {
  fictionDb: FictionDb
  fictionServer: FictionServer
  fictionEmail: FictionEmail
  fictionEnv: FictionEnv
  fictionUser: FictionUser
  fictionTransactions: FictionTransactions
  fictionAdmin: FictionAdmin
  fictionAnalytics: FictionAnalytics
} & FictionPluginSettings

export class FictionContact extends FictionPlugin<FictionContactSettings> {
  widgets = getWidgets({ fictionContact: this, ...this.settings })
  queries = {
    ManageContact: new ManageContactQuery({ fictionContact: this, ...this.settings }),
    SubscriptionAnalytics: new SubscriptionAnalytics({ fictionContact: this, ...this.settings }),
  }

  requests = this.createRequests({
    queries: this.queries,
    fictionServer: this.settings.fictionServer,
    fictionUser: this.settings.fictionUser,
    basePath: '/subscribe',
  })

  transactions = getEmails({ fictionContact: this })

  cacheKey = vue.ref(0)

  constructor(settings: FictionContactSettings) {
    super('FictionContact', { root: safeDirname(import.meta.url), ...settings })
    this.settings.fictionDb?.addTables(tables)

    this.admin()
  }

  async getTags(args: { search?: string, limit?: number } = {}) {
    const { search, limit = 20 } = args
    const response = await this.settings.fictionUser.requests.GetTopValues.projectRequest({
      table: t.contact,
      column: 'tags',
      search,
      arrayColumn: true,
      limit,
    })

    return response
  }

  admin() {
    const { fictionAdmin } = this.settings

    fictionAdmin.widgetRegister.value.push(...Object.values(this.widgets))

    fictionAdmin.addToWidgetArea('subscriberIndex', [{ key: 'subscribers' }, { key: 'unsubscribes' }, { key: 'cleaned' }])

    fictionAdmin.addAdminPages({
      key: 'audience',
      loader: async ({ factory }) => [

        await factory.fromTemplate<typeof dashTemplate>({
          templateId: 'dash',
          slug: 'subscriber-view',
          title: 'Connection Profile',
          description: 'View and manage individual contact details',
          cards: [await factory.fromTemplate({ el: vue.defineAsyncComponent(async () => import('./admin/ViewSingle.vue')) })],
          userConfig: { navIcon: 'i-tabler-user', parentNavItemSlug: 'audience' },
        }),
        await factory.fromTemplate<typeof dashTemplate>({
          templateId: 'dash',
          slug: 'audience',
          title: 'Audience',
          description: 'Your subscribers, followers, and contacts',
          userConfig: { isNavItem: true, navIcon: 'i-tabler-users', navIconAlt: 'i-tabler-users-plus', priority: 50 },
          cards: [
            await factory.fromTemplate({
              el: vue.defineAsyncComponent(async () => import('./admin/ViewManage.vue')),
              cards: [
                await factory.fromTemplate<typeof panelTemplate>({
                  slug: 'subscribers',
                  title: 'Contact List',
                  description: 'View, filter, and manage your complete list',
                  el: vue.defineAsyncComponent(async () => import('./admin/ViewIndex.vue')),
                  userConfig: { isNavItem: true, navIcon: 'i-tabler-users', navIconAlt: 'i-tabler-users-plus' },
                }),
                await factory.fromTemplate<typeof panelTemplate>({
                  slug: 'view',
                  title: 'Contact Details',
                  description: 'View individual subscriber information and history',
                  el: vue.defineAsyncComponent(async () => import('./admin/ViewSingle.vue')),
                  userConfig: { navIcon: 'i-tabler-user', parentItemId: 'subscribers' },
                }),
              ],
            }),
          ],
        }),
      ],
    })
  }
}
