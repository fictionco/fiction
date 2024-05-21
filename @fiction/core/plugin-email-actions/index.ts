import { createCard } from '@fiction/site'

import type { FictionMonitor } from '@fiction/plugins/plugin-monitor'
import { FictionPlugin, type FictionPluginSettings } from '../plugin'
import { safeDirname, vue } from '../utils'
import type { FictionEmail } from '../plugin-email'
import type { FictionMedia } from '../plugin-media'
import type { FictionUser } from '../plugin-user'
import type { FictionApp } from '../plugin-app'
import type { FictionRouter } from '../plugin-router'

import type { FictionServer } from '../plugin-server'
import type { FictionDb } from '../plugin-db'
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
      callback: (pages) => {
        return [
          ...pages,
          createCard({
            slug: '_action',
            isSystem: true,
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
  }

  emailActions: Record<string, EmailAction> = {}
}
