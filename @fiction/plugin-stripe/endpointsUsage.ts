import type {
  EndpointMeta,
  EndpointResponse,
  FactorDb,
  FactorUser,
} from '@fiction/core'
import {
  Query,
} from '@fiction/core'
import type { TableUsageConfig } from './tables'

interface UsageQuerySettings {
  factorUser?: FactorUser
  factorDb: FactorDb
}

export abstract class QueryUsage extends Query<UsageQuerySettings> {
  factorUser = this.settings.factorUser
  factorDb = this.settings.factorDb
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
      throw this.stop('_action required')
    if (!_action)
      throw this.stop('orgId required')

    const db = this.factorDb.client()

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
        .table(this.tbl.usage)
        .returning<TableUsageConfig[]>('*')
      message = 'usage added'
    }
    else if (_action === 'getUsage') {
      const { cycleStartAtIso, cycleEndAtIso } = params

      if (!cycleStartAtIso || !cycleEndAtIso)
        throw this.stop('cycle dates required')

      const select = [`sum(credits) as credits`]
      const usage = await db
        .select(db.raw(select.join(', ')))
        .from(this.tbl.usage)
        .where({ orgId })
        .whereBetween('createdAt', [cycleStartAtIso, cycleEndAtIso])
        .first()

      queryResponse = usage
    }

    this.log.info('manageUsage', { data: { ...params, queryResponse } })

    return { status: 'success', data: queryResponse, message, params }
  }
}
