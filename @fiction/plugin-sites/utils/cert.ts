import { type EndpointMeta, type FictionDb, _stop, prepareFields } from '@fiction/core'
import type { TableDomainConfig, TableSiteConfig } from '../tables'
import { tableNames } from '../tables'
import type { FictionSites } from '..'

export async function updateSiteCerts(args: { site: Partial<TableSiteConfig>, fictionSites: FictionSites, fictionDb: FictionDb, flyIoAppId: string }, meta: EndpointMeta) {
  const { site, fictionSites, fictionDb, flyIoAppId } = args
  const { siteId, customDomains } = site

  const db = fictionDb.client()

  const existingDomains = await db(tableNames.domains).select<TableDomainConfig[]>('*').where({ siteId })

  await Promise.all(existingDomains.map(async (domain) => {
    if (!customDomains?.some(d => d.hostname === domain.hostname)) {
      const result = await fictionSites.queries.ManageCert.serve({ _action: 'delete', hostname: domain.hostname }, { caller: 'updateSiteCerts' })
      if (result.status !== 'success')
        throw _stop('cert not deleted', { data: { domain, result } })

      await db(tableNames.domains).delete().where({ hostname: domain.hostname, siteId })
    }
  }))

  const domains = (await Promise.all(customDomains?.map(async (domain) => {
    if (!domain.hostname || existingDomains.some(d => d.hostname === domain.hostname))
      return

    const result = await fictionSites.queries.ManageCert.serve({
      _action: 'create',
      hostname: domain.hostname,
      siteId,
      appId: flyIoAppId,
    }, { caller: 'updateSiteCerts' })

    if (result.status !== 'success')
      throw _stop('cert not created', { data: { domain, result } })

    if (result.data) {
      const prepped = prepareFields({ type: 'internal', fields: { ...domain, ...result.data }, table: tableNames.domains, meta, fictionDb })
      return (await db(tableNames.domains)
        .insert({ siteId, hostname: domain.hostname, ...prepped })
        .onConflict(['hostname', 'site_id'])
        .merge()
        .returning<TableDomainConfig[]>('*'))[0]
    }
  }) || []) || []).filter(Boolean) as TableDomainConfig[]

  return domains
}
