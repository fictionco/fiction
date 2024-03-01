import type {
  EndpointMeta,
  EndpointResponse,
  FactorAws,
  FactorDb,
  FactorUser,
} from '@factor/api'
import {
  Query,
} from '@factor/api'
import type { FictionInstance } from '../plugin-instance'
import type { CurrentInstanceDescription } from './types'

interface InstanceQuerySettings {
  factorUser?: FactorUser
  factorDb: FactorDb
  factorAws: FactorAws
  fictionInstance: FictionInstance
}

export abstract class QueryInstance extends Query<InstanceQuerySettings> {
  factorUser = this.settings.factorUser
  factorDb = this.settings.factorDb
  factorAws = this.settings.factorAws
  fictionInstance = this.settings.fictionInstance

  constructor(settings: InstanceQuerySettings) {
    super(settings)
  }
}

interface ManageModelParams {
  _action: 'create' | 'retrieve' | 'delete' | 'stop' | 'cancel'
  organizationId?: string
  organizationName?: string
  fullName?: string
  reason?: string
  userId?: string
}
export class QueryManageInstance extends QueryInstance {
  async run(
    params: ManageModelParams,
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<Partial<CurrentInstanceDescription>>> {
    if (!params._action)
      throw this.stop('_action required')

    const message = ''

    const { _action, userId, organizationId, organizationName } = params

    if (!userId || !organizationId)
      throw this.stop('userId and organizationId required')

    let instanceDetails: Partial<CurrentInstanceDescription> | undefined

    if (_action === 'cancel') {
      await this.fictionInstance.instanceServerRequest({
        organizationId,
        endpoint: '/cancel',
        data: {},
      })
    }
    else if (_action === 'create') {
      const result = await this.fictionInstance.startServer({
        userId,
        organizationId,
        organizationName,
      })

      return result
    }
    else if (_action === 'retrieve') {
      instanceDetails = await this.fictionInstance.handleandReportServers({
        organizationId,
      })
    }
    else if (_action === 'delete') {
      instanceDetails = await this.fictionInstance.ec2ExpireInstance({
        _action: 'terminate',
        organizationId,
        message: 'Removed Server (Manual)',
        reason: 'terminated by _action === \'delete\'',
      })
    }
    else if (_action === 'stop') {
      instanceDetails = await this.fictionInstance.ec2ExpireInstance({
        _action: 'stop',
        organizationId,
        message: 'Stopped Server (Manual)',
        reason: 'stopped by _action === \'stop\'',
      })
    }

    return { status: 'success', data: instanceDetails, message, params }
  }
}
