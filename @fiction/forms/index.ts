import { FictionPlugin, safeDirname } from '@fiction/core'
import type { FictionApp, FictionDb, FictionEmail, FictionEnv, FictionPluginSettings, FictionRouter, FictionServer, FictionUser } from '@fiction/core'

import type { FictionMonitor } from '@fiction/plugin-monitor'
import type { FictionAdmin } from '@fiction/admin/index.js'
import type { FictionSites } from '@fiction/site/index.js'
import { tables } from './schema.js'
import { QueryManageForm, QueryManageSubmission } from './endpoint.js'

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
}
