import type { FictionDb, FictionEmail, FictionEnv, FictionPluginSettings, FictionServer, FictionUser, TableMediaConfig } from '@fiction/core'
import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import type { FictionTransactions } from '@fiction/plugin-transactions'
import { createCard } from '@fiction/site'
import multer from 'multer'
import { tables } from './schema'
import { ManageSubscriptionQuery } from './endpoint'
import { getEmails } from './email'

export * from './schema'

type FictionSubscribeSettings = {
  fictionDb: FictionDb
  fictionServer: FictionServer
  fictionEmail: FictionEmail
  fictionEnv: FictionEnv
  fictionUser: FictionUser
  fictionTransactions: FictionTransactions
} & FictionPluginSettings

export class FictionSubscribe extends FictionPlugin<FictionSubscribeSettings> {
  csvFileName = 'csvFile'
  queries = {
    ManageSubscription: new ManageSubscriptionQuery({ fictionSubscribe: this, ...this.settings }),
  }

  requests = this.createRequests({
    queries: this.queries,
    fictionServer: this.settings.fictionServer,
    fictionUser: this.settings.fictionUser,
    basePath: '/subscribe',
    middleware: () => [multer().single(this.csvFileName)],
  })

  transactions = getEmails({ fictionSubscribe: this })

  cacheKey = vue.ref(0)

  constructor(settings: FictionSubscribeSettings) {
    super('FictionSubscribe', { root: safeDirname(import.meta.url), ...settings })
    this.settings.fictionDb?.addTables(tables)

    this.addAdminPages()
  }

  addAdminPages() {
    this.settings.fictionEnv.addHook({
      hook: 'adminPages',
      caller: 'FictionSubscribe',
      context: 'app',
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
