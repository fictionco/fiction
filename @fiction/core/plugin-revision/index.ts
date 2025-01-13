import type { FictionDb } from '../plugin-db/index.js'
import type { FictionServer } from '../plugin-server/index.js'
import type { FictionUser } from '../plugin-user/index.js'
import type { EndpointResponse } from '../types/endpoint.js'
import type { EndpointMeta } from '../utils/endpoint.js'
import { FictionPlugin, type FictionPluginSettings } from '../plugin.js'
import { safeDirname } from '../utils/utils.js'
import { ManageRevision } from './endpoint.js'
import { type FullRevisionConfig, type RevisionType, type TableRevisionConfig, tables } from './tables.js'

export type FictionRevisionSettings = {
  fictionDb: FictionDb
  fictionServer: FictionServer
  fictionUser: FictionUser
} & FictionPluginSettings

export class FictionRevision extends FictionPlugin<FictionRevisionSettings> {
  revisionLimitPerItem = 50
  draftMinInterval = 5 * 60 * 1000 // 5 minutes in ms
  queries = {
    ManageRevision: new ManageRevision({ fictionRevision: this, ...this.settings }),
  }

  requests = this.createRequests({
    queries: this.queries,
    basePath: '/revision',
    fictionServer: this.settings.fictionServer,
    fictionUser: this.settings.fictionUser,
  })

  constructor(settings: FictionRevisionSettings) {
    super('FictionRevision', { root: safeDirname(import.meta.url), ...settings })

    this.settings.fictionDb.addTables(tables)
  }

  async createRevision(revision: FullRevisionConfig, options: {
    skipTimeCheck?: boolean // Allow bypassing 5-min check for important operations
  }): Promise<EndpointResponse<TableRevisionConfig[]>> {
    const {
      skipTimeCheck = false,
    } = options

    const { itemId, itemType, itemData, title, description, orgId, userId } = revision

    if (!skipTimeCheck) {
      // Check last revision time
      const lastRevision = await this.queries.ManageRevision.serve({
        _action: 'list',
        where: { itemId },
        limit: 1,
        orgId,
        userId,
        caller: 'checkLastRevision',
      }, { server: true })

      const lastTime = lastRevision.data?.[0]?.createdAt
      if (lastTime) {
        const timeSince = Date.now() - new Date(lastTime).getTime()
        if (timeSince < this.draftMinInterval) {
          return { status: 'error', message: 'Too soon to create a new revision' }
        }
      }
    }

    // Create new revision
    return this.queries.ManageRevision.serve({
      _action: 'create',
      fields: {
        itemId,
        itemType,
        itemData,
        title: title || `${itemType} revision`,
        description,
      },
      orgId,
      userId,
      caller: 'createRevision',
    }, { server: true })
  }

  async getRevisionData(args: {
    revisionId: string
    orgId: string
    userId: string
    meta?: EndpointMeta
  }) {
    const { revisionId, orgId, userId, meta } = args

    const result = await this.queries.ManageRevision.serve({
      _action: 'retrieve',
      where: { revisionId },
      orgId,
      userId,
      caller: 'getRevisionData',
    }, meta || { server: true })

    const rev = result.data?.[0]

    if (!rev) {
      return { status: 'error', message: 'Revision not found' }
    }

    return { status: 'success', data: rev }
  }
}
