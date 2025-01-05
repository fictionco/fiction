import type { ComplexDataFilter, EndpointMeta, EndpointResponse, IndexQuery } from '@fiction/core'
import type { FictionBrand, FictionBrandSettings } from './index'
import type { TableBrand } from './schema'
import { abort, applyComplexFilters, Query } from '@fiction/core'
import { t } from './schema'

type BrandQuerySettings = {
  fictionBrand: FictionBrand
} & FictionBrandSettings

abstract class BrandGuideEndpoint extends Query<BrandQuerySettings> {
  db = () => this.settings.fictionDb.client()
  constructor(settings: BrandQuerySettings) {
    super(settings)
  }
}

export type WhereBrandGuide = {
  brandId?: string
}

export type ManageBrandGuideRequest =
  | { _action: 'create', fields: Partial<TableBrand> }
  | { _action: 'retrieve', where: WhereBrandGuide }
  | { _action: 'list', orgId: string, where?: Partial<TableBrand>, limit?: number, offset?: number, page?: number }
  | { _action: 'count', orgId: string, filters?: ComplexDataFilter[] }
  | { _action: 'update', where: WhereBrandGuide, fields: Partial<TableBrand> }
  | { _action: 'delete', where: WhereBrandGuide }
  | { _action: 'setPrimary', where: WhereBrandGuide }

export type ManageBrandGuideParams = ManageBrandGuideRequest & IndexQuery & { orgId: string }

export type ManageBrandGuideResponse = EndpointResponse<TableBrand[]>

export class ManageBrandGuideQuery extends BrandGuideEndpoint {
  limit = 20
  offset = 0

  async run(params: ManageBrandGuideParams, meta: EndpointMeta): Promise<ManageBrandGuideResponse> {
    const { _action } = params

    let r: ManageBrandGuideResponse | undefined

    switch (_action) {
      case 'create':
        r = await this.create(params, meta)
        break
      case 'retrieve':
        r = await this.retrieve(params, meta)
        break
      case 'list':
        r = await this.list(params, meta)
        break
      case 'update':
        r = await this.update(params, meta)
        break
      case 'count':
        r = { status: 'success', data: [] } // Added in indexMeta
        break
      case 'delete':
        r = await this.delete(params, meta)
        break
      case 'setPrimary':
        r = await this.setPrimary(params, meta)
        break
      default:
        r = { status: 'error', message: 'Invalid action' }
    }

    if (!r) {
      return { status: 'error', message: 'Invalid action' }
    }

    return this.addIndexMeta(params, r, meta)
  }

  private async addIndexMeta(params: ManageBrandGuideParams, r: ManageBrandGuideResponse, _meta?: EndpointMeta): Promise<ManageBrandGuideResponse> {
    if (params._action === 'retrieve')
      return r

    const { orgId } = 'orgId' in params ? params : { orgId: '' }
    if (!orgId)
      return r

    const { limit = this.limit, offset = this.offset, filters = [] } = params

    let baseQuery = this.db().table(t.brand).where({ orgId }).count().first<{ count: string }>()
    baseQuery = applyComplexFilters(baseQuery, filters)
    const { count } = await baseQuery

    r.indexMeta = { limit, offset, count: +count, ...r.indexMeta }
    return r
  }

  private async create(params: ManageBrandGuideParams & { _action: 'create' }, meta: EndpointMeta): Promise<ManageBrandGuideResponse> {
    const { fields, orgId } = params
    const { fictionDb } = this.settings

    if (!orgId) {
      throw abort('orgId is required to create brand guide', meta)
    }

    if (!fields.title) {
      throw abort('title is required to create brand guide', meta)
    }

    // Start a transaction since we'll potentially need to check and update isPrimary
    const trx = await this.db().transaction()

    try {
      // Check if any primary brand guide exists
      const existingPrimary = await trx(t.brand)
        .where({ orgId, isPrimary: true })
        .first()

      // Prepare insert data with isPrimary set if no existing primary
      const insertData = fictionDb.prep({
        type: 'insert',
        fields: {
          ...fields,
          isPrimary: !existingPrimary && fields.isPrimary !== false,
        },
        meta,
        table: t.brand,
      })

      this.log.info('createBrandGuide', { data: insertData, caller: meta.caller })

      const result = await trx(t.brand)
        .insert({ orgId, ...insertData })
        .returning('*')

      await trx.commit()

      return { status: 'success', data: result, indexMeta: { changedCount: 1 } }
    }
    catch (error) {
      await trx.rollback()
      throw error
    }
  }

  private async retrieve(params: ManageBrandGuideParams & { _action: 'retrieve' }, _meta: EndpointMeta): Promise<ManageBrandGuideResponse> {
    const { where, orgId } = params

    let query = this.db().table(t.brand).where({ orgId })

    if (where.brandId) {
      query = query.where('brandId', where.brandId)
    }
    else {
      query = query.where('isPrimary', true)
    }

    let result = await query.first()

    if (!result && !where.brandId) {
      // If no primary found, get the first brand guide
      result = await this.db()
        .table(t.brand)
        .where({ orgId })
        .first()
    }

    if (!result && !where.brandId) {
      return this.create({ _action: 'create', orgId, fields: { title: 'Default Brand Guide' } }, _meta)
    }
    else if (!result) {
      return { status: 'error', message: 'Brand guide not found', data: [] }
    }

    return { status: 'success', data: [result] }
  }

  private async list(params: ManageBrandGuideParams & { _action: 'list' }, _meta: EndpointMeta): Promise<ManageBrandGuideResponse> {
    const { where, orgId } = params
    let { limit = this.limit, offset = this.offset, page } = params

    if (page && page > 0) {
      offset = (page - 1) * limit
    }

    const results = await this.db()
      .select('*')
      .from(t.brand)
      .where({ orgId, ...where })
      .limit(limit)
      .offset(offset)
      .orderBy('updated_at', 'desc')

    return { status: 'success', data: results }
  }

  private async update(params: ManageBrandGuideParams & { _action: 'update' }, meta: EndpointMeta): Promise<ManageBrandGuideResponse> {
    const { where, fields, orgId } = params
    const { fictionDb } = this.settings

    const prepped = fictionDb.prep({ type: 'update', fields, meta, table: t.brand })

    delete prepped.isPrimary // Remove from regular update

    // Regular update for all other cases
    const result = await this.db()
      .table(t.brand)
      .where({ orgId, ...where })
      .update({ ...prepped, updatedAt: new Date().toISOString() })
      .returning('*')

    if (!result.length) {
      return { status: 'error', message: 'Brand guide not found', data: [] }
    }

    return { status: 'success', data: result, indexMeta: { changedCount: result.length } }
  }

  private async delete(params: ManageBrandGuideParams & { _action: 'delete' }, _meta: EndpointMeta): Promise<ManageBrandGuideResponse> {
    const { where, orgId } = params

    const result = await this.db()
      .table(t.brand)
      .where({ orgId, ...where })
      .delete()
      .returning('*')

    if (!result.length) {
      return { status: 'error', message: 'Brand guide not found', data: [] }
    }

    return { status: 'success', data: result, indexMeta: { changedCount: result.length } }
  }

  private async setPrimary(params: ManageBrandGuideParams & { _action: 'setPrimary' }, _meta: EndpointMeta): Promise<ManageBrandGuideResponse> {
    const { where, orgId } = params

    // Start a transaction to ensure atomicity
    const trx = await this.db().transaction()

    try {
      // First, unset any existing primary
      await trx(t.brand)
        .where({ orgId, isPrimary: true })
        .update({ isPrimary: false })

      // Then set the new primary
      const result = await trx(t.brand)
        .where({ orgId, ...where })
        .update({ isPrimary: true })
        .returning('*')

      await trx.commit()

      if (!result.length) {
        return { status: 'error', message: 'Brand guide not found', data: [] }
      }

      return { status: 'success', data: result, indexMeta: { changedCount: result.length } }
    }
    catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
