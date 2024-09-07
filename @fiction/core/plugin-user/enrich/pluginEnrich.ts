import { FictionPlugin, type FictionPluginSettings } from '@fiction/core/plugin'
import type { FictionDb } from '@fiction/core/plugin-db'
import type { FictionEmail } from '@fiction/core/plugin-email'
import type { FictionRouter } from '@fiction/core/plugin-router'
import type { FictionServer } from '@fiction/core/plugin-server'
import { EnrichUser } from './endpoint'
import type { FictionUser } from '..'

export type UserPluginSettings = {
  fictionServer?: FictionServer
  fictionUser: FictionUser
  fictionDb: FictionDb
  fictionEmail?: FictionEmail
  fictionRouter?: FictionRouter
  apolloApiKey?: string
} & FictionPluginSettings

export class FictionUserEnrich extends FictionPlugin<UserPluginSettings> {
  queries = {
    EnrichUser: new EnrichUser(this.settings),
  }

  constructor(settings: UserPluginSettings) {
    super('FictionUserEnrich', settings)

    const { fictionUser, fictionEnv } = settings

    if (!fictionUser.settings.apolloApiKey) {
      this.log.error('Apollo API key is missing')
      return
    }

    fictionUser.events.on('newUserVerified', async (event) => {
      if (fictionEnv.isTest)
        return

      const { user } = event.detail

      await this.queries.EnrichUser.serve({ _action: 'enrichUser', user }, { server: true })
    })
  }
}
