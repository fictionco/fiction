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
  maxDomainsPerOrg = 3

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

    // Check domain count limit
    const { count } = await db(t.domains)
      .where({ orgId })
      .count('* as count')
      .first<{ count: string }>()

    if (Number.parseInt(count, 10) >= this.maxDomainsPerOrg)
      throw abort(`Maximum of ${this.maxDomainsPerOrg} domains allowed per organization`)

    // Prepare domain for insertion
    const domainId = fields.domainId || objectId({ prefix: 'dmn' })
    const prepped = this.settings.fictionDb.prep({
      type: 'insert',
      fields: { ...fields, hostname, domainId },
      table: t.domains,
      meta,
    })

    // Process in transaction for data integrity
    await db.transaction(async (trx) => {
      // Handle primary domain setting if needed
      if (fields.isPrimary) {
        await trx(t.domains)
          .where({ orgId, isPrimary: true })
          .update({ isPrimary: false })
      }

      // Insert domain
      await trx
        .insert({ ...prepped, orgId })
        .into(t.domains)
        .onConflict(['hostname', 'org_id'])
        .merge()
    })

    // Return all domains for the organization
    return this.listAllDomains(orgId, params.successMessage || 'Domain created successfully')
  }

  private async retrieveDomain(params: ManageDomainParams & { _action: 'retrieve' }, _meta: EndpointMeta): Promise<EndpointResponse<TableDomainConfig[]>> {
    const { where, orgId } = params
    const db = this.settings.fictionDb.client()

    // Add orgId to where clause for security
    const secureWhere = { ...where, orgId }

    // If only orgId is provided, get all domains
    if (Object.keys(where).length === 1 && 'orgId' in where) {
      return this.listAllDomains(orgId, params.successMessage)
    }

    // For specific domain lookups by ID or hostname, verify existence first
    const domainExists = await db
      .select(1)
      .from(t.domains)
      .where(secureWhere)
      .first()

    if (!domainExists) {
      // If domain doesn't exist, still return all org domains (not an error)
      return this.listAllDomains(orgId, params.successMessage || 'Domain not found')
    }

    // Return all domains for consistency
    return this.listAllDomains(orgId, params.successMessage)
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

    // Check if domain exists
    const domainExists = await db
      .select(1)
      .from(t.domains)
      .where({ ...where, orgId })
      .first()

    if (!domainExists) {
      // Return all domains anyway with message
      return this.listAllDomains(orgId, 'Domain not found')
    }

    // Prepare fields for update
    const prepped = this.settings.fictionDb.prep({
      type: 'update',
      fields,
      table: t.domains,
      meta,
    })

    // Process in transaction for data integrity
    await db.transaction(async (trx) => {
      // Handle primary domain setting if needed
      if (fields.isPrimary) {
        await trx(t.domains)
          .where({ orgId, isPrimary: true })
          .update({ isPrimary: false })
      }

      // Execute update with security scope (orgId)
      await trx(t.domains)
        .update({ ...prepped, updatedAt: new Date().toISOString() })
        .where({ ...where, orgId })
    })

    // Return all domains for consistency
    return this.listAllDomains(orgId, params.successMessage || 'Domain updated successfully')
  }

  private async deleteDomain(params: ManageDomainParams & { _action: 'delete' }, _meta: EndpointMeta): Promise<EndpointResponse<TableDomainConfig[]>> {
    const { where, orgId } = params
    const db = this.settings.fictionDb.client()

    // Check if domain exists
    const domainExists = await db
      .select(1)
      .from(t.domains)
      .where({ ...where, orgId })
      .first()

    if (!domainExists) {
      // Return all domains anyway with message
      return this.listAllDomains(orgId, 'Domain not found')
    }

    // Execute delete with security scope (orgId)
    await db(t.domains)
      .delete()
      .where({ ...where, orgId })

    // Return all remaining domains
    return this.listAllDomains(orgId, params.successMessage || 'Domain deleted successfully')
  }

  private async listDomains(params: ManageDomainParams & { _action: 'list' }, _meta: EndpointMeta): Promise<EndpointResponse<TableDomainConfig[]>> {
    const { orgId } = params
    return this.listAllDomains(orgId, params.successMessage)
  }

  // Helper method to get all domains for an organization
  private async listAllDomains(orgId: string, successMessage?: string): Promise<EndpointResponse<TableDomainConfig[]>> {
    const db = this.settings.fictionDb.client()

    // Get all domains for the organization
    const domains = await db
      .select<TableDomainConfig[]>('*')
      .from(t.domains)
      .where({ orgId })
      .orderBy('isPrimary', 'desc')
      .orderBy('updatedAt', 'desc')

    // Get total count (for consistency with pagination metadata)
    const { count } = await db(t.domains)
      .where({ orgId })
      .count('* as count')
      .first<{ count: string }>()

    return {
      status: 'success',
      data: domains,
      indexMeta: {
        count: +count,
        limit: domains.length,
        offset: 0,
      },
      message: successMessage,
    }
  }
}
