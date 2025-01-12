import type { FictionDb } from '../plugin-db/index.js'
import { FictionPlugin, type FictionPluginSettings } from '../plugin.js'
import { safeDirname } from '../utils/utils.js'
import { ManageRevision } from './endpoint.js'
import { tables } from './tables.js'

export type FictionRevisionSettings = {
  fictionDb: FictionDb
} & FictionPluginSettings

export class FictionRevision extends FictionPlugin<FictionRevisionSettings> {
  revisionLimitPerItem = 50
  queries = {
    ManageRevision: new ManageRevision({ fictionRevision: this, ...this.settings }),
  }

  constructor(settings: FictionRevisionSettings) {
    super('FictionRevision', { root: safeDirname(import.meta.url), ...settings })

    this.settings.fictionDb.addTables(tables)
  }
}
