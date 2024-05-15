import type { FictionDb, FictionEmail, FictionEnv, FictionPluginSettings, FictionServer, FictionUser } from '@fiction/core'
import { FictionPlugin, safeDirname } from '@fiction/core'
import type { FictionMonitor } from '@fiction/plugin-monitor'
import { tables } from './schema'
import { ManageSubscriptionQuery } from './endpoint'

export * from './schema'

type FictionSubscribeSettings = {
  fictionDb: FictionDb
  fictionServer: FictionServer
  fictionEmail: FictionEmail
  fictionEnv: FictionEnv
  fictionUser: FictionUser
  fictionMonitor: FictionMonitor
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

  constructor(settings: FictionSubscribeSettings) {
    super('FictionSubscribe', { root: safeDirname(import.meta.url), ...settings })
    this.settings.fictionDb?.addTables(tables)
  }

  async subscribeEmail(args: { email: string, publicationId: string }) {
    const { email, publicationId } = args

    const result = await this.requests.ManageSubscription.request({ _action: 'create', email, publicationId })

    return result
  }
}
