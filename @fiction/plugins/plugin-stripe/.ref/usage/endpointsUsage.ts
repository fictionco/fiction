import type { EndpointMeta, EndpointResponse, FictionDb, FictionUser } from '@fiction/core'
import type { TableUsageConfig } from '../tables'
import { abort, Query } from '@fiction/core'
import { tableNames } from '../tables'

interface UsageQuerySettings {
  fictionUser?: FictionUser
  fictionDb: FictionDb
}

export abstract class QueryUsage extends Query<UsageQuerySettings> {
  fictionUser = this.settings.fictionUser
  fictionDb = this.settings.fictionDb
  constructor(settings: UsageQuerySettings) {
    super(settings)
  }
}

interface ManageUsageParams {
  _action: 'addNew' | 'getUsage'
  orgId: string
  userId: string
  usageConfig?: Partial<TableUsageConfig>
  cycleStartAtIso?: string
  cycleEndAtIso?: string
}
export class QueryManageUsage extends QueryUsage {
  async run(
    params: ManageUsageParams,
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<TableUsageConfig>> {
    const { _action, orgId, userId, usageConfig } = params

    if (!_action)
      throw abort('_action required')
    if (!_action)
      throw abort('orgId required')

    const db = this.fictionDb.client()

    let queryResponse: TableUsageConfig | undefined
    let message: string | undefined

    if (_action === 'addNew') {
      const formattedData = {
        ...usageConfig,
        orgId,
        userId,
      }

      ;[queryResponse] = await db
        .insert(formattedData)
        .table(tableNames.usage)
        .returning<TableUsageConfig[]>('*')
      message = 'usage added'
    }
    else if (_action === 'getUsage') {
      const { cycleStartAtIso, cycleEndAtIso } = params

      if (!cycleStartAtIso || !cycleEndAtIso)
        throw abort('cycle dates required')

      const select = [`sum(credits) as credits`]
      const usage = await db
        .select(db.raw(select.join(', ')))
        .from(tableNames.usage)
        .where({ orgId })
        .whereBetween('createdAt', [cycleStartAtIso, cycleEndAtIso])
        .first()

      queryResponse = usage
    }

    this.log.info('manageUsage', { data: { ...params, queryResponse } })

    return { status: 'success', data: queryResponse, message, params }
  }
}
