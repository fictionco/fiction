import { createCard } from '@fiction/site'

import type { FictionMonitor } from '@fiction/plugins/plugin-monitor'
import type { FictionApp, FictionDb, FictionEmail, FictionMedia, FictionPluginSettings, FictionRouter, FictionServer, FictionUser } from '@fiction/core'
import { AppRoute, FictionPlugin, safeDirname, vue } from '@fiction/core'

import type { EmailAction } from './action'
import { EndpointEmailAction } from './endpoint'

export * from './action'

type FictionEmailActionsSettings = {
  fictionEmail: FictionEmail
  fictionUser: FictionUser
  fictionServer: FictionServer
  fictionMedia: FictionMedia
  fictionApp: FictionApp
  fictionRouter: FictionRouter
  fictionMonitor?: FictionMonitor
  fictionDb: FictionDb
} & FictionPluginSettings

export class FictionEmailActions extends FictionPlugin<FictionEmailActionsSettings> {
  queries = {
    EmailAction: new EndpointEmailAction({ fictionEmailActions: this, ...this.settings }),
  }

  requests = this.createRequests({
    queries: this.queries,
    fictionServer: this.settings.fictionServer,
    fictionUser: this.settings.fictionUser,
  })

  constructor(settings: FictionEmailActionsSettings) {
    super('FictionEmailActions', { root: safeDirname(import.meta.url), ...settings })

    this.settings.fictionEnv.addHook({
      hook: 'setPages',
      callback: (pages, site) => {
        const theme = site?.theme.value
        const transactionTemplateId = theme?.templateDefaults.value.transactional || 'wrap'
        return [
          ...pages,
          createCard({
            slug: '_action',
            isSystem: true,
            templates: theme?.templates,
            templateId: transactionTemplateId,
            cards: [
              createCard({
                templateId: 'emailAction',
                el: vue.defineAsyncComponent(() => import('./ElEmailAction.vue')),
              }),
            ],
          }),
        ]
      },
    })

    this.settings.fictionRouter.update([
      new AppRoute({ name: 'emailTransaction', path: '/_transaction/:itemId', component: (): Promise<any> => import('./ElEmailAction.vue') }),
    ])
  }

  emailActions: Record<string, EmailAction> = {}
}
