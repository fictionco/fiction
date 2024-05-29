import { FictionPlugin, type FictionPluginSettings } from '@fiction/core/plugin'
import { safeDirname } from '@fiction/core/utils'
import type { FictionEmail } from '@fiction/core/plugin-email'
import type { FictionMedia } from '@fiction/core/plugin-media'
import type { FictionUser } from '@fiction/core/plugin-user'
import type { FictionApp } from '@fiction/core/plugin-app'
import type { FictionRouter } from '@fiction/core/plugin-router'
import type { FictionEmailActions } from '@fiction/plugin-email-actions'
import { envConfig } from '@fiction/core'
import { getEmails } from './emails'

export * from './tools/tools'

envConfig.register({ name: 'ADMIN_UI_ROOT', onLoad: ({ fictionEnv }) => { fictionEnv.addUiRoot(safeDirname(import.meta.url)) } })

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

      if (params.isVerifyEmail) {
        await this.emailActions.verifyEmailAction.serveSend({
          recipient: user,
          queryVars: { code: user.verify?.code || '', email: user.email || '' },
        })
      }
    })
  }
}
