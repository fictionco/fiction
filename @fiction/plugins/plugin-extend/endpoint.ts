import type { EndpointMeta, EndpointResponse, FictionDb, FictionPluginSettings, FictionUser } from '@fiction/core'
import { Query } from '@fiction/core'
import type { TablePostConfig } from '../plugin-posts'

export type ExtendQuerySettings = FictionPluginSettings & {
  fictionUser: FictionUser
  fictionDb: FictionDb
}
export abstract class ExtendQuery extends Query<ExtendQuerySettings> {
  db = () => this.settings.fictionDb.client()
  constructor(settings: ExtendQuerySettings) {
    super(settings)
  }
}

export type ManageExtend =
  | { _action: 'update', fields: Partial<TablePostConfig> }

export type ManagePostParams = ManageExtend & { userId?: string, orgId: string }

export class QueryManageExtend extends ExtendQuery {
  async run(params: ManagePostParams, _meta: EndpointMeta): Promise<EndpointResponse> {
    return { status: 'success', data: true }
  }
}
