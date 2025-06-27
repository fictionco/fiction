import type { FictionAdmin } from '@fiction/admin'
import type { FictionAnalytics } from '@fiction/analytics'
import type { FictionDb, FictionEmail, FictionEnv, FictionPluginSettings, FictionServer, FictionUser, User } from '@fiction/core'

import type { WhereSubscription } from './endpoint'
import { cardConfigCustom } from '@fiction/cards'
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

  async deleteContacts(args: { where: WhereSubscription[] }) {
    const { where } = args
    const confirmed = confirm(`Are you sure? This action cannot be undone.`)

    if (!confirmed) {
      return
    }

    await this.requests.ManageContact.projectRequest({ _action: 'delete', where })

    this.cacheKey.value += 1 // Trigger UI update
  }

  admin() {
    const { fictionAdmin } = this.settings

    fictionAdmin.addFeature({
      key: 'audience',
      getPages: async () => [
        cardConfigCustom({
          templateId: 'dash',
          slug: 'audience',
          title: 'Audience',
          description: 'Your subscribers, followers, and contacts',
          userConfig: { isNavItem: true, navIcon: 'i-tabler-users', navIconAlt: 'i-tabler-users-plus', priority: 50 },
          cards: [
            cardConfigCustom({
              templateId: 'tplContactManage',
              userConfig: {},
            }),
          ],
        }),
        cardConfigCustom({
          templateId: 'dash',
          slug: 'edit-contact',
          title: 'Connection Profile',
          description: 'View and manage individual contact details',
          userConfig: { navIcon: 'i-tabler-user', parentNavItemSlug: 'audience' },
          cards: [
            cardConfigCustom({
              templateId: 'tplContactSingle',
              userConfig: {},
            }),
          ],
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
