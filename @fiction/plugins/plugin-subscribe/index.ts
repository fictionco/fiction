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
  root = this.utils.safeDirname(import.meta.url)
  fictionDb = this.settings.fictionDb
  fictionServer = this.settings.fictionServer
  fictionUser = this.settings.fictionUser
  fictionRouter = this.settings.fictionRouter
  fictionApp = this.settings.fictionApp
  fictionEnv = this.settings.fictionEnv
  fictionMonitor = this.settings.fictionMonitor
  fictionEmail = this.settings.fictionEmail
  queries = this.createQueries()
  requests = this.createRequests({
    queries: this.queries,
    fictionServer: this.fictionServer,
    fictionUser: this.fictionUser,
  })

  constructor(settings: FictionSubscribeSettings) {
    super('FictionSubscribe', settings)
    settings.fictionEnv?.uiPaths.push(`${this.root}/*.vue`)
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

  protected createQueries() {
    const deps = {
      fictionUser: this.fictionUser,
      fictionSubscribe: this,
      fictionDb: this.fictionDb,
      fictionEnv: this.fictionEnv,
      fictionMonitor: this.fictionMonitor,
      fictionEmail: this.fictionEmail,
    }
    return {
      ManageSubscribe: new QueryManageSubscribe(deps),
    } as const
  }
}
