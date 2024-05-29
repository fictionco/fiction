import type { FictionDb, FictionEmail, FictionEnv, FictionPluginSettings, FictionServer, FictionUser } from '@fiction/core'
import { FictionPlugin, safeDirname } from '@fiction/core'
import type { FictionMonitor } from '@fiction/plugin-monitor'
import type { FictionEmailActions } from '@fiction/plugin-email-actions'
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
  fictionMonitor: FictionMonitor
  fictionEmailActions: FictionEmailActions
} & FictionPluginSettings

export class FictionSubscribe extends FictionPlugin<FictionSubscribeSettings> {
  queries = {
    ManageSubscription: new ManageSubscriptionQuery({ fictionSubscribe: this, ...this.settings }),
  }

  requests = this.createRequests({
    queries: this.queries,
    fictionServer: this.settings.fictionServer,
    fictionUser: this.settings.fictionUser,
  })

  emailActions = getEmails({ fictionSubscribe: this })

  constructor(settings: FictionSubscribeSettings) {
    super('FictionSubscribe', { root: safeDirname(import.meta.url), ...settings })
    this.settings.fictionDb?.addTables(tables)
  }
}
