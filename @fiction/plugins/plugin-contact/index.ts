import type { FictionAdmin } from '@fiction/admin'
import type { dashTemplate } from '@fiction/admin/dashboard/templates'
import type { FictionAnalytics } from '@fiction/analytics'
import type { FictionDb, FictionEmail, FictionEnv, FictionPluginSettings, FictionServer, FictionUser } from '@fiction/core'
import type { FictionTransactions } from '@fiction/plugin-transactions'
import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card.js'
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

    // fictionAdmin.widgetRegister.value.push(...Object.values(this.widgets))

    // fictionAdmin.addToWidgetArea('subscriberIndex', [{ key: 'subscribers' }, { key: 'unsubscribes' }, { key: 'cleaned' }])

    fictionAdmin.addFeature({
      key: 'audience',
      getPages: async ({ factory }) => [
        await factory.fromTemplate<typeof dashTemplate>({
          templateId: 'dash',
          slug: 'subscriber-view',
          title: 'Connection Profile',
          description: 'View and manage individual contact details',
          cards: [await factory.fromTemplate({ templateId: 'tplContactSingle' })],
          userConfig: { navIcon: 'i-tabler-user', parentNavItemSlug: 'audience' },
        }),
        await factory.fromTemplate<typeof dashTemplate>({
          templateId: 'dash',
          slug: 'audience',
          title: 'Audience',
          description: 'Your subscribers, followers, and contacts',
          userConfig: { isNavItem: true, navIcon: 'i-tabler-users', navIconAlt: 'i-tabler-users-plus', priority: 50 },
          cards: [await factory.fromTemplate({ templateId: 'tplContactManage' })],
        }),
      ],
      getTemplates: async () => [
        cardTemplate({
          templateId: 'tplContactSingle',
          el: vue.defineAsyncComponent(async () => import('./admin/ViewSingle.vue')),
        }),
        cardTemplate({
          templateId: 'tplContactManage',
          el: vue.defineAsyncComponent(async () => import('./admin/ViewManage.vue')),
        }),
      ],
    })
  }

  async createSubscription(args: { email: string, tags?: string[], orgId: string }) {
    const { email, tags, orgId } = args
    const queryVars = { orgId, tags }
    const r = await this.transactions.subscribe.requestSend({
      to: email,
      queryVars,
    })

    return r
  }
}
