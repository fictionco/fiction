import type { FictionPluginSettings } from '../plugin'
import type { FictionApp } from '../plugin-app'
import type { FictionDb } from '../plugin-db'
import type { FictionEnv } from '../plugin-env'
import type { FictionRouter } from '../plugin-router'
import type { FictionServer } from '../plugin-server'
import type { FictionUser } from '../plugin-user'
import { FictionPlugin } from '../plugin'
import { FictionLinkedIn } from './linkedin'

export type AccountsPluginSettings = {
  fictionEnv: FictionEnv
  fictionApp: FictionApp
  fictionServer: FictionServer
  fictionUser: FictionUser
  fictionRouter: FictionRouter
  fictionDb: FictionDb
} & FictionPluginSettings

export class FictionAccounts extends FictionPlugin<AccountsPluginSettings> {
  linkedIn = new FictionLinkedIn(this.settings)

  constructor(settings: AccountsPluginSettings) {
    super('FictionAccounts', settings)
  }

  getLinkedInAuthUrl(redirectUrl: string): string {
    return this.linkedIn.getAuthUrl(redirectUrl)
  }
}
