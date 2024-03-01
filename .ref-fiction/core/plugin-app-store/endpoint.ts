import type {
  EndpointMeta,
  EndpointResponse,
  FactorDb,
  FactorEmail,
  FactorUser,
  PushSubscriptionDetail,
} from '@factor/api'
import {
  Query,
} from '@factor/api'

interface UsageQuerySettings {
  factorUser?: FactorUser
  factorDb: FactorDb
  factorEmail: FactorEmail
}

export abstract class QueryPush extends Query<UsageQuerySettings> {
  factorUser = this.settings.factorUser
  factorDb = this.settings.factorDb
  factorEmail = this.settings.factorEmail
  constructor(settings: UsageQuerySettings) {
    super(settings)
  }
}

interface ManageAppParams {
  _action: 'store' | 'send' | 'remove'
  userId: string
  pushSubscription?: PushSubscriptionDetail
}
export class QueryManageApps extends QueryPush {
  async run(
    params: ManageAppParams,
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<unknown>> {
    const { _action, userId } = params

    if (!_action)
      throw this.stop('action required')
    if (!userId)
      throw this.stop('userId required')

    const message = ''

    return {
      status: 'success',
      data: undefined,
      message,
      params,
    }
  }
}
