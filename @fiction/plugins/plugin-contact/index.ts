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
import type { TableSubmissionConfig } from './tables'
import { table } from './tables'
import { QueryManageSubmission } from './endpoint'

export * from './tables'
type FictionContactSettings = {
  fictionDb: FictionDb
  fictionServer: FictionServer
  fictionEmail: FictionEmail
  fictionEnv: FictionEnv
  fictionApp: FictionApp
  fictionUser: FictionUser
  fictionRouter: FictionRouter
  fictionMonitor: FictionMonitor
} & FictionPluginSettings

export class FictionContact extends FictionPlugin<FictionContactSettings> {
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

  constructor(settings: FictionContactSettings) {
    super('FictionContact', { root: safeDirname(import.meta.url), ...settings })
    this.fictionDb?.addTables([table])
  }

  async submitForm(args: { submission: Partial<TableSubmissionConfig> }) {
    const { submission } = args
    const s: Partial<TableSubmissionConfig> = {
      appUrl: this.fictionRouter.current.value.fullPath,
      appName: this.fictionApp.appName,
      notificationEmail: this.fictionApp.appEmail,
      ...submission,
    }

    const result = await this.requests.ManageSubmission.request({
      _action: 'create',
      submission: s,
    })

    return result
  }

  protected createQueries() {
    const deps = {
      fictionUser: this.fictionUser,
      fictionContact: this,
      fictionDb: this.fictionDb,
      fictionEnv: this.fictionEnv,
      fictionMonitor: this.fictionMonitor,
      fictionEmail: this.fictionEmail,
    }
    return {
      ManageSubmission: new QueryManageSubmission(deps),
    } as const
  }
}
