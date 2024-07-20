import { type EndpointMeta, type FictionDb, _stop, validHost } from '@fiction/core'
import type { TableDomainConfig } from '../tables'
import { tableNames } from '../tables'
import type { FictionSites } from '..'

export async function updateSiteCerts(args: { siteId: string, customDomains?: Partial<TableDomainConfig>[], fictionSites: FictionSites, fictionDb: FictionDb }, meta: EndpointMeta) {
  const { siteId, customDomains = [], fictionSites, fictionDb } = args

  const db = fictionDb.client()

  const validUserDomains = customDomains.map(d => ({ ...d, hostname: validHost(d.hostname) })).filter(Boolean) as Partial<TableDomainConfig>[]

  const existingDomains = await db(tableNames.domains).select<TableDomainConfig[]>('*').where({ siteId })

  await Promise.all(existingDomains.map(async (domain) => {
    if (validUserDomains?.some(d => d.hostname === domain.hostname))
      return

    fictionSites.log.warn('deleting domain', { data: { domain } })
    const result = await fictionSites.queries.ManageCert.serve({ _action: 'delete', hostname: domain.hostname }, { caller: 'updateSiteCerts' })
    if (result.status !== 'success')
      throw _stop('cert not deleted', { data: { domain, result } })

    await db(tableNames.domains).delete().where({ hostname: domain.hostname, siteId })
  }))

  const domains = (await Promise.all(validUserDomains?.map(async (domain) => {
    const { hostname } = domain

    if (!hostname || existingDomains.some(d => d.hostname === domain.hostname && d.configured))
      return

    fictionSites.log.warn('create/check domain', { data: { domain } })

    const result = await fictionSites.queries.ManageCert.serve({ _action: 'create', hostname, siteId }, { caller: 'updateSiteCerts' })

    if (result.status === 'success' && result.data) {
      const prepped = fictionDb.prep({ type: 'internal', fields: { ...domain, ...result.data }, table: tableNames.domains, meta })
      return (await db(tableNames.domains)
        .insert({ siteId, hostname: domain.hostname, ...prepped })
        .onConflict(['hostname', 'site_id'])
        .merge()
        .returning<TableDomainConfig[]>('*'))[0]
    }
    else {
      throw _stop('cert not created', { data: { domain, result } })
    }
  }) || []) || []).filter(Boolean) as TableDomainConfig[]

  return domains
}
