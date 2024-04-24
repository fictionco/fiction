import type {
  FictionApp,
  FictionDb,
  FictionEmail,
  FictionEnv,
  FictionPluginSettings,
  FictionRouter,
  FictionServer,
  FictionUser,
} from '@fiction/core'
import {
  FictionPlugin,
  safeDirname,
} from '@fiction/core'
import type { FictionMonitor } from '@fiction/plugin-monitor'
import { table } from './tables'
import { QueryManageSubscribe } from './endpoint'

export * from './tables'

type FictionSubscribeSettings = {
  fictionDb: FictionDb
  fictionServer: FictionServer
  fictionEmail: FictionEmail
  fictionEnv: FictionEnv
  fictionApp: FictionApp
  fictionUser: FictionUser
  fictionRouter: FictionRouter
  fictionMonitor: FictionMonitor
} & FictionPluginSettings

export class FictionSubscribe extends FictionPlugin<FictionSubscribeSettings> {
  fictionDb = this.settings.fictionDb
  fictionServer = this.settings.fictionServer
  fictionUser = this.settings.fictionUser
  fictionRouter = this.settings.fictionRouter
  fictionApp = this.settings.fictionApp
  fictionMonitor = this.settings.fictionMonitor
  fictionEmail = this.settings.fictionEmail
  queries = this.createQueries()
  requests = this.createRequests({
    queries: this.queries,
    fictionServer: this.fictionServer,
    fictionUser: this.fictionUser,
  })

  constructor(settings: FictionSubscribeSettings) {
    super('FictionSubscribe', { root: safeDirname(import.meta.url), ...settings })
    this.fictionDb?.addTables([table])
  }

  async subscribeEmail(args: { email: string }) {
    const { email } = args

    const result = await this.requests.ManageSubscribe.request({
      _action: 'init',
      email,
    })

    return result
  }

  protected override createQueries() {
    return {
      ManageSubscribe: new QueryManageSubscribe({ fictionSubscribe: this, ...this.settings }),
    } as const
  }
}
