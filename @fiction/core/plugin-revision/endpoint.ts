import type { ComplexDataFilter, EndpointResponse } from '../types/endpoint.js'
import type { EndpointMeta } from '../utils/endpoint.js'
import type { FictionRevision, FictionRevisionSettings } from './index.js'
import type { TableRevisionConfig } from './tables.js'
import { Query } from '../query.js'
import { standardTable as t } from '../tbl.js'
import { applyComplexFilters } from '../utils/db.js'
import { abort } from '../utils/error.js'

type RevisionStandardFields = {
  orgId: string
  userId: string
  caller: string
  successMessage?: string
}

export type RevisionQuerySettings = {
  fictionRevision: FictionRevision
} & FictionRevisionSettings

type WhereRevision = { itemId: string } | { revisionId: string }

export type ManageRevisionRequestParams
  = | { _action: 'create', fields: TableRevisionConfig & { itemId: string, itemType: string, itemData: Record<string, unknown> } }
    | { _action: 'delete', where: WhereRevision }
    | { _action: 'retrieve', where: WhereRevision }
    | { _action: 'list', where: WhereRevision, limit?: number, offset?: number, filters?: ComplexDataFilter[] }

export type ManageRevisionParams = ManageRevisionRequestParams & RevisionStandardFields

export class ManageRevision extends Query<RevisionQuerySettings> {
  limit = 20
  offset = 0

  async run(params: ManageRevisionParams, meta: EndpointMeta): Promise<EndpointResponse<TableRevisionConfig[]>> {
    const { _action, caller = 'unknown', successMessage } = params

    if (!_action)
      throw abort('_action required', { data: { caller } })

    let result: EndpointResponse<TableRevisionConfig[]>

    switch (_action) {
      case 'create':
        result = await this.createRevision(params, meta)
        break
      case 'delete':
        result = await this.deleteRevisions(params, meta)
        break
      case 'retrieve':
        result = await this.retrieveRevision(params, meta)
        break
      case 'list':
        result = await this.listRevisions(params, meta)
        break
      default:
        throw abort('Invalid action')
    }

    // Add index metadata for list actions
    if (_action === 'list') {
      result = await this.addIndexMeta(params, result)
    }

    return { ...result, message: successMessage ?? result.message }
  }

  private async createRevision(params: ManageRevisionParams & { _action: 'create' }, meta: EndpointMeta): Promise<EndpointResponse<TableRevisionConfig[]>> {
    const { orgId, userId, fields } = params
    const db = this.settings.fictionDb.client()
    const limit = this.settings.fictionRevision.revisionLimitPerItem

    const prepped = this.settings.fictionDb.prep({ type: 'insert', fields, meta, table: t.revisions })
    const { itemId } = prepped

    const description = `Revision for ${fields.itemType} saved at ${new Date().toISOString()}`

    return db.transaction(async (trx) => {
      // Get ALL versions (even deleted ones) for this item to maintain sequential version numbers
      const maxVersion = await trx(t.revisions)
        .where({ itemId, orgId })
        .max('version as maxVersion')
        .first()

      const nextVersion = (maxVersion?.maxVersion || 0) + 1

      // Get current revisions for limit checking
      const revisions = await trx(t.revisions)
        .where({ itemId, orgId })
        .orderBy([
          { column: 'version', order: 'desc' },
        ])
        .forUpdate()
        .select('*')

      // Calculate next priority (1-10) cyclically based on version
      const nextPriority = ((nextVersion - 1) % 10) + 1

      // If we exceed limit, delete oldest low-priority revisions
      if (revisions.length >= limit) {
        // Sort by priority ascending, then version ascending
        const sortedRevisions = [...revisions].sort((a, b) => {
          if (a.priority !== b.priority)
            return a.priority - b.priority
          return a.version - b.version
        })

        // Delete oldest revision with lowest priority
        const toDelete = sortedRevisions[0]
        if (toDelete) {
          await trx(t.revisions)
            .where({ revisionId: toDelete.revisionId })
            .delete()
        }
      }

      // Create new revision
      const [revision] = await trx(t.revisions)
        .insert({
          description,
          ...prepped,
          orgId,
          userId,
          version: nextVersion,
          priority: nextPriority,
        })
        .returning('*')

      return { status: 'success', data: [revision] }
    })
  }

  private async deleteRevisions(params: ManageRevisionParams & { _action: 'delete' }, _meta: EndpointMeta): Promise<EndpointResponse<TableRevisionConfig[]>> {
    const { where, orgId } = params
    const db = this.settings.fictionDb.client()

    const deleted = await db(t.revisions)
      .where({ ...where, orgId })
      .delete()
      .returning('*')

    return { status: 'success', data: deleted }
  }

  private async retrieveRevision(params: ManageRevisionParams & { _action: 'retrieve' }, _meta: EndpointMeta): Promise<EndpointResponse<TableRevisionConfig[]>> {
    const { where, orgId } = params
    const db = this.settings.fictionDb.client()

    const revisions = await db(t.revisions)
      .where({ ...where, orgId })
      .orderBy('createdAt', 'desc')
      .limit(1)

    return { status: 'success', data: revisions }
  }

  private async listRevisions(params: ManageRevisionParams & { _action: 'list' }, _meta: EndpointMeta): Promise<EndpointResponse<TableRevisionConfig[]>> {
    const { where, orgId, limit = this.limit, offset = this.offset, filters = [] } = params
    const db = this.settings.fictionDb.client()

    let query = db(t.revisions)
      .where({ orgId, ...where })
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset(offset)

    query = applyComplexFilters(query, filters)

    const revisions = await query

    return { status: 'success', data: revisions }
  }

  private async addIndexMeta(params: ManageRevisionParams, result: EndpointResponse<TableRevisionConfig[]>): Promise<EndpointResponse<TableRevisionConfig[]>> {
    const { where, orgId, limit = this.limit, offset = this.offset, filters = [] } = params as ManageRevisionParams & { _action: 'list' }
    const db = this.settings.fictionDb.client()

    const query = db(t.revisions)
      .where({ ...where, orgId })
      .count()
      .first<{ count: string }>()

    // query = applyComplexFilters(query, filters)

    const { count } = await query

    return {
      ...result,
      indexMeta: { limit, offset, count: +count },
    }
  }
}
