import type { FictionUser } from '..'
import type { FictionPluginSettings } from '../../plugin'
import type { FictionDb } from '../../plugin-db'
import type { FictionEmail } from '../../plugin-email'
import type { FictionRouter } from '../../plugin-router'
import type { FictionServer } from '../../plugin-server'
import { FictionPlugin } from '../../plugin'
import { EnrichUser } from './endpoint'

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
