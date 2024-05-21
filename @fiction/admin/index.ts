import { FictionPlugin, type FictionPluginSettings } from '@fiction/core/plugin'
import { safeDirname, vue } from '@fiction/core/utils'
import type { FictionEmail } from '@fiction/core/plugin-email'
import type { FictionMedia } from '@fiction/core/plugin-media'
import type { FictionUser } from '@fiction/core/plugin-user'
import type { FictionApp } from '@fiction/core/plugin-app'
import type { FictionRouter } from '@fiction/core/plugin-router'
import type { EmailAction, FictionEmailActions } from '@fiction/core/plugin-email-actions'
import { getEmails } from './emails'

export * from './tools/tools'

type FictionAdminSettings = {
  fictionEmail: FictionEmail
  fictionEmailActions: FictionEmailActions
  fictionUser: FictionUser
  fictionMedia: FictionMedia
  fictionApp: FictionApp
  fictionRouter: FictionRouter
} & FictionPluginSettings

export class FictionAdmin extends FictionPlugin<FictionAdminSettings> {
  constructor(settings: FictionAdminSettings) {
    super('FictionAdmin', { root: safeDirname(import.meta.url), ...settings })
  }

  emailActions = getEmails({ fictionAdmin: this })

  hooks() {
    const fictionUser = this.settings.fictionUser

    fictionUser.events.on('newUser', async (event) => {
      const { user, params } = event.detail

      if (params.doVerification) {
        await this.emailActions.verifyEmailAction.send({
          user,
          vars: { code: user.verificationCode },
        })
      }
    })
  }
}
