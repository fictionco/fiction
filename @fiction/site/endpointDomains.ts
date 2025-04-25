import type { ComplexDataFilter, EndpointMeta, EndpointResponse } from '@fiction/core'
import type { SitesQuerySettings } from './endpoint.js'
import type { TableDomainConfig } from './tables.js'
import { abort, objectId, Query, validHost } from '@fiction/core'
import { t } from './tables.js'

type DomainStandardFields = {
  orgId: string
  userId?: string
  caller: string
  successMessage?: string
}

type WhereDomain = {
  domainId?: string
  hostname?: string
  orgId?: string
} & ({ domainId: string } | { hostname: string } | { orgId: string })

export type ManageDomainRequestParams =
  | { _action: 'create', fields: Partial<TableDomainConfig> }
  | { _action: 'retrieve', where: WhereDomain }
  | { _action: 'update', where: WhereDomain, fields: Partial<TableDomainConfig> }
  | { _action: 'delete', where: WhereDomain }
  | { _action: 'list', where?: Partial<TableDomainConfig>, limit?: number, offset?: number }
  | { _action: 'count', filters?: ComplexDataFilter[] }

export type ManageDomainParams = ManageDomainRequestParams & DomainStandardFields

export class ManageDomain extends Query<SitesQuerySettings> {
  limit = 20
  offset = 0

  constructor(settings: SitesQuerySettings) {
    super(settings)
  }

  async run(params: ManageDomainParams, meta: EndpointMeta): Promise<EndpointResponse<TableDomainConfig[]>> {
    const { _action, caller = 'unknown', successMessage, orgId } = params

    if (!_action)
      throw abort('_action required', { data: { caller } })
    if (!orgId)
      throw abort('orgId required', { data: { caller } })

    switch (_action) {
      case 'create': return this.createDomain(params, meta)
      case 'retrieve': return this.retrieveDomain(params, meta)
      case 'update': return this.updateDomain(params, meta)
      case 'delete': return this.deleteDomain(params, meta)
      case 'list': return this.listDomains(params, meta)
      case 'count': return { status: 'success', data: [], message: successMessage || 'Count successful' }
      default: throw abort('Invalid action')
    }
  }

  private async createDomain(params: ManageDomainParams & { _action: 'create' }, meta: EndpointMeta): Promise<EndpointResponse<TableDomainConfig[]>> {
    const { fields, orgId } = params
    const db = this.settings.fictionDb.client()

    if (!fields.hostname)
      throw abort('hostname required')

    // Validate hostname
    const hostname = validHost(fields.hostname)
    if (!hostname)
      throw abort('Invalid hostname')

    // Prepare domain for insertion
    const domainId = fields.domainId || objectId({ prefix: 'dmn' })
    const prepped = this.settings.fictionDb.prep({
      type: 'insert',
      fields: { ...fields, hostname, domainId },
      table: t.domains,
      meta,
    })

    // Process in transaction for data integrity
    const [domain] = await db.transaction(async (trx) => {
      // Handle primary domain setting if needed
      if (fields.isPrimary) {
        await trx(t.domains)
          .where({ orgId, isPrimary: true })
          .update({ isPrimary: false })
      }

      // Insert domain
      return trx
        .insert({ ...prepped, orgId })
        .into(t.domains)
        .onConflict(['hostname', 'org_id'])
        .merge()
        .returning<TableDomainConfig[]>('*')
    })

    return {
      status: 'success',
      data: [domain],
      message: params.successMessage || 'Domain created successfully',
    }
  }

  private async retrieveDomain(params: ManageDomainParams & { _action: 'retrieve' }, _meta: EndpointMeta): Promise<EndpointResponse<TableDomainConfig[]>> {
    const { where, orgId } = params
    const db = this.settings.fictionDb.client()

    // Add orgId to where clause for security
    const secureWhere = { ...where, orgId }

    // If only orgId is provided, get the primary domain
    if (Object.keys(secureWhere).length === 1 && secureWhere.orgId) {
      const domains = await db
        .select<TableDomainConfig[]>('*')
        .from(t.domains)
        .where({ orgId, isPrimary: true })
        .limit(1)

      if (domains.length > 0) {
        return { status: 'success', data: domains }
      }

      // Fallback to any domain if no primary exists
      const anyDomains = await db
        .select<TableDomainConfig[]>('*')
        .from(t.domains)
        .where({ orgId })
        .limit(1)

      return {
        status: anyDomains.length ? 'success' : 'error',
        data: anyDomains,
        message: anyDomains.length ? undefined : 'No domains found',
      }
    }

    // Standard retrieval
    const domains = await db
      .select<TableDomainConfig[]>('*')
      .from(t.domains)
      .where(secureWhere)

    return {
      status: domains.length ? 'success' : 'error',
      data: domains,
      message: domains.length ? undefined : 'Domain not found',
    }
  }

  private async updateDomain(params: ManageDomainParams & { _action: 'update' }, meta: EndpointMeta): Promise<EndpointResponse<TableDomainConfig[]>> {
    const { where, fields, orgId } = params
    const db = this.settings.fictionDb.client()

    // Validate hostname if provided
    if (fields.hostname) {
      const hostname = validHost(fields.hostname)
      if (!hostname)
        throw abort('Invalid hostname')
      fields.hostname = hostname
    }

    // Prepare fields for update
    const prepped = this.settings.fictionDb.prep({
      type: 'update',
      fields,
      table: t.domains,
      meta,
    })

    // Process in transaction for data integrity
    const updatedDomains = await db.transaction(async (trx) => {
      // Handle primary domain setting if needed
      if (fields.isPrimary) {
        await trx(t.domains)
          .where({ orgId, isPrimary: true })
          .update({ isPrimary: false })
      }

      // Execute update with security scope (orgId)
      return trx(t.domains)
        .update({ ...prepped, updatedAt: new Date().toISOString() })
        .where({ ...where, orgId })
        .returning<TableDomainConfig[]>('*')
    })

    return {
      status: 'success',
      data: updatedDomains,
      message: params.successMessage || 'Domain updated successfully',
    }
  }

  private async deleteDomain(params: ManageDomainParams & { _action: 'delete' }, _meta: EndpointMeta): Promise<EndpointResponse<TableDomainConfig[]>> {
    const { where, orgId } = params
    const db = this.settings.fictionDb.client()

    // Execute delete with security scope (orgId)
    const deletedDomains = await db(t.domains)
      .delete()
      .where({ ...where, orgId })
      .returning<TableDomainConfig[]>('*')

    return {
      status: 'success',
      data: deletedDomains,
      message: params.successMessage || 'Domain deleted successfully',
    }
  }

  private async listDomains(params: ManageDomainParams & { _action: 'list' }, _meta: EndpointMeta): Promise<EndpointResponse<TableDomainConfig[]>> {
    const { where = {}, orgId, limit = this.limit, offset = this.offset } = params
    const db = this.settings.fictionDb.client()

    // Add orgId to where clause for security
    const secureWhere = { ...where, orgId }

    // Execute query
    const domains = await db
      .select<TableDomainConfig[]>('*')
      .from(t.domains)
      .where(secureWhere)
      .orderBy('isPrimary', 'desc')
      .orderBy('updatedAt', 'desc')
      .limit(limit)
      .offset(offset)

    // Get total count
    const { count } = await db(t.domains)
      .where(secureWhere)
      .count('* as count')
      .first<{ count: string }>()

    return {
      status: 'success',
      data: domains,
      indexMeta: {
        count: +count,
        limit,
        offset,
      },
      message: params.successMessage,
    }
  }
}
