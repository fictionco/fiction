import type { FictionAdmin } from '@fiction/admin/index.js'
import type { FictionApp, FictionEmail, FictionMedia, FictionRouter, FictionServer, FictionUser } from '@fiction/core'
import type { FictionPluginSettings } from '@fiction/core/plugin.js'
import type { FictionTransactions } from '@fiction/plugin-transactions'
import type { FictionAi } from '@fiction/plugins/plugin-ai/index.js'
import type { FictionPosts } from '@fiction/posts/index.js'
import type { FictionSites } from '@fiction/site/index.js'
import { cardConfig } from '@fiction/cards/index.js'
import { EnvVar, vars } from '@fiction/core'
import { FictionPlugin } from '@fiction/core/plugin.js'
import { safeDirname, vue } from '@fiction/core/utils'
import { cardTemplate } from '@fiction/site/index.js'
import { QueryManageOnboard } from './endpoint.js'

vars.register(() => [
  new EnvVar({ name: 'PROXYCURL_API_KEY' }),
])

export type FictionOnboardSettings = {
  fictionAdmin: FictionAdmin
  fictionEmail: FictionEmail
  fictionTransactions: FictionTransactions
  fictionUser: FictionUser
  fictionMedia: FictionMedia
  fictionApp: FictionApp
  fictionRouter: FictionRouter
  fictionServer: FictionServer
  fictionAi: FictionAi
  fictionPosts: FictionPosts
  fictionSites: FictionSites
  proxycurlApiKey?: string
} & FictionPluginSettings

export class FictionOnboard extends FictionPlugin<FictionOnboardSettings> {
  queries = {
    ManageOnboard: new QueryManageOnboard({ ...this.settings }),
  }

  requests = this.createRequests({
    queries: this.queries,
    basePath: '/onboard',
    fictionServer: this.settings.fictionServer,
    fictionUser: this.settings.fictionUser,
  })

  constructor(settings: FictionOnboardSettings) {
    super('FictionOnboard', { root: safeDirname(import.meta.url), ...settings })

    this.admin()
  }

  admin() {
    this.settings.fictionAdmin.addFeature({
      key: 'onboard',
      getPages: async () => {
        return [
          await cardConfig({
            templateId: 'cardTransactionViewV1',
            slug: 'onboard',
            title: 'Onboard Survey',
            cards: [
              await cardConfig<any>({ templateId: 'tplOnboardSurvey' }),
            ],
          }),
        ]
      },
      getTemplates: async () => {
        return [
          cardTemplate({
            templateId: 'tplOnboardSurvey',
            el: vue.defineAsyncComponent(() => import('./OnboardSurvey.vue')),
          }),
        ]
      },
    })
  }
}
