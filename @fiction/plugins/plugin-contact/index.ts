import type { FictionAdmin } from '@fiction/admin'
import type { dashTemplate } from '@fiction/admin/dashboard/templates'
import type { FictionAnalytics } from '@fiction/analytics'
import type { FictionDb, FictionEmail, FictionEnv, FictionPluginSettings, FictionServer, FictionUser, User } from '@fiction/core'
import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card.js'
import { ManageContactQuery, SubscriptionAnalytics } from './endpoint'
import { t, tables } from './schema'

export * from './schema'

export type FictionContactSettings = {
  fictionDb: FictionDb
  fictionServer: FictionServer
  fictionEmail: FictionEmail
  fictionEnv: FictionEnv
  fictionUser: FictionUser
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
        cardTemplate({ templateId: 'tplContactSingle', el: vue.defineAsyncComponent(async () => import('./admin/ViewSingle.vue')) }),
        cardTemplate({ templateId: 'tplContactManage', el: vue.defineAsyncComponent(async () => import('./admin/ViewManage.vue')) }),
      ],
    })
  }

  async requestSubscription(args: { email: string, tags?: string[], targetOrgId: string, createUserFields?: Partial<User> }) {
    const { email, tags, targetOrgId } = args
    const fictionUser = this.settings.fictionUser
    const r = await fictionUser.requests.ManageUserEmail.request({ _action: 'verifySubscribe', email, targetOrgId, tags, caller: 'requestSubscription' })

    return r
  }
}
