import type { FictionSites, TableSiteConfig } from '..'
import { Site } from '..'

export async function getPrimarySite<T extends boolean = false>(
  args: { orgId?: string, fictionSites: FictionSites, configOnly?: T },
): Promise<T extends true ? TableSiteConfig : Site> {
  const { orgId, fictionSites, configOnly = false as T } = args

  if (!orgId) {
    throw new Error('No orgId provided')
  }

  const r = await fictionSites.requests.ManageSites.request({
    _action: 'list',
    limit: 1,
    orgId,
  })

  const siteConfig = r.data?.[0]
  if (!siteConfig) {
    throw new Error('No site found')
  }

  // Type assertion needed here since TypeScript can't infer the conditional return
  return (configOnly
    ? siteConfig
    : Site.create({ ...siteConfig, fictionSites, isEditable: false })
  ) as any
}
