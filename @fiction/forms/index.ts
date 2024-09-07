import { FictionPlugin, safeDirname } from '@fiction/core/index.js'
import type { FictionAdmin } from '@fiction/admin/index.js'

import type { FictionApp, FictionDb, FictionEmail, FictionEnv, FictionPluginSettings, FictionRouter, FictionServer, FictionUser } from '@fiction/core/index.js'
import type { FictionMonitor } from '@fiction/plugin-monitor/index.js'
import type { FictionSites } from '@fiction/site/index.js'
import { QueryManageForm, QueryManageSubmission } from './endpoint.js'
import { tables } from './schema.js'

export * from './schema.js'

export type FormPluginSettings = {
  fictionEnv: FictionEnv
  fictionDb: FictionDb
  fictionUser?: FictionUser
  fictionEmail: FictionEmail
  fictionServer: FictionServer
  fictionApp: FictionApp
  fictionRouter: FictionRouter
  fictionAdmin: FictionAdmin
  fictionMonitor?: FictionMonitor
  fictionSites: FictionSites
} & FictionPluginSettings

export class FictionForms extends FictionPlugin<FormPluginSettings> {
  constructor(settings: FormPluginSettings) {
    super('FictionForms', { root: safeDirname(import.meta.url), ...settings })
    this.settings.fictionDb.addTables(tables)
  }

  queries = {
    ManageForm: new QueryManageForm({ fictionForms: this, ...this.settings }),
    ManageSubmission: new QueryManageSubmission({ fictionForms: this, ...this.settings }),
  }

  requests = this.createRequests({
    queries: this.queries,
    fictionServer: this.settings.fictionServer,
    fictionUser: this.settings.fictionUser,
    basePath: '/forms',
  })
}
