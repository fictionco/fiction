import { createCard } from '@fiction/site'

import { FictionPlugin, type FictionPluginSettings } from '../plugin'
import { safeDirname, vue } from '../utils'
import type { FictionEmail } from '../plugin-email'
import type { FictionMedia } from '../plugin-media'
import type { FictionUser } from '../plugin-user'
import type { FictionApp } from '../plugin-app'
import type { FictionRouter } from '../plugin-router'

import type { EmailAction } from './action'

export * from './action'

type FictionEmailActionsSettings = {
  fictionEmail: FictionEmail
  fictionUser: FictionUser
  fictionMedia: FictionMedia
  fictionApp: FictionApp
  fictionRouter: FictionRouter
} & FictionPluginSettings

export class FictionEmailActions extends FictionPlugin<FictionEmailActionsSettings> {
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
