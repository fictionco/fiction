import { abort, type EndpointMeta, type EndpointResponse, Query } from '@fiction/core'
import { SitesQuery, type SitesQuerySettings } from './endpoint'
import type { Site } from './site'

export type CardQuerySettings = {
  site: Site
} & SitesQuerySettings

export abstract class CardQuery extends Query<CardQuerySettings> {
  constructor(settings: CardQuerySettings) {
    super(settings)
  }
}

export class CardQueryHandler extends SitesQuery {
  async run(params: { themeId?: string, siteId?: string, templateId: string, queryId: string, args: Record<string, any> }, meta: EndpointMeta): Promise<EndpointResponse> {
    const { siteId, themeId, queryId } = params

    let site: Site | undefined = undefined
    if (siteId && !siteId.includes('static')) {
      const { ManageSite } = this.settings.fictionSites.queries
      const r = await ManageSite.serve({ _action: 'retrieve', where: { siteId }, caller: 'CardQuery' }, { ...meta })

      if (!r.data)
        throw abort('site not found', { data: { siteId } })

      site = await this.siteFromConfig({ fields: r.data }, meta)
    }
    else if (themeId) {
      const fictionEnv = this.settings.fictionEnv
      const { orgId, siteId } = fictionEnv.meta.app || {}
      site = await this.siteFromConfig({ fields: { themeId, siteId, orgId } }, meta)
    }

    if (!site)
      throw abort('site not found', { data: { siteId, themeId } })

    const template = site?.theme.value?.templates?.find(t => t.settings.templateId === params.templateId)

    const queries = await template?.settings.getQueries?.({ ...this.settings, site })

    const q = queries?.[queryId]

    if (!q)
      throw abort('query not found', { data: { queryId, templateId: params.templateId } })

    const result = await q.serve(params.args, meta)

    return result || { status: 'error', message: 'no result', expose: false }
  }
}
