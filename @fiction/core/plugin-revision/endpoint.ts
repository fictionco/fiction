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

type WhereRevision = { itemId: string }

export type ManageRevisionRequestParams =
  | { _action: 'create', fields: TableRevisionConfig & { itemId: string, itemType: string, itemData: Record<string, unknown> } }
  | { _action: 'deleteByItemId', where: WhereRevision }
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
      case 'deleteByItemId':
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

    return db.transaction(async (trx) => {
      // Lock all rows for this item and get current state
      const revisions = await trx(t.revisions)
        .where({ itemId, orgId })
        .orderBy('createdAt', 'desc')
        .forUpdate() // Lock rows
        .select('*')

      // Calculate next version
      const currentVersion = revisions[0]?.version ?? 0
      const nextVersion = currentVersion + 1

      // If we have more than limit, delete oldest ones in bulk
      if (revisions.length >= limit) {
        const toDelete = revisions.slice(limit - 1) // Keep newest (limit - 1) items
        await trx(t.revisions)
          .where({ orgId })
          .whereIn('revisionId', toDelete.map(r => r.revisionId))
          .delete()
      }

      // Create new revision with calculated version
      const [revision] = await trx(t.revisions)
        .insert({
          ...prepped,
          orgId,
          userId,
          version: nextVersion,
        })
        .returning('*')

      this.log.info('Created revision', { data: {
        version: nextVersion,
        remaining: limit - 1,
        itemId,
        title: revision.title,
      } })

      return { status: 'success', data: [revision] }
    })
  }

  private async deleteRevisions(params: ManageRevisionParams & { _action: 'deleteByItemId' }, _meta: EndpointMeta): Promise<EndpointResponse<TableRevisionConfig[]>> {
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
