import type { EndpointMeta, EndpointResponse } from '@fiction/core'
import { Query, prepareFields } from '@fiction/core'
import { t } from './schema'
import type { SendConfig } from './schema.js'
import type { FictionSend, FictionSendSettings } from '.'

export type SendEndpointSettings = {
  fictionSend: FictionSend
} & FictionSendSettings

abstract class SendEndpoint extends Query<SendEndpointSettings> {
  db = () => this.settings.fictionDb.client()
  constructor(settings: SendEndpointSettings) {
    super(settings)
  }
}

export type WhereSend = { sendId?: string }

export type ManageSubscriptionParams =
  | { _action: 'create', orgId: string, fields: SendConfig }
  | { _action: 'update', where: WhereSend, fields: Partial<SendConfig> }
  | { _action: 'delete', where: WhereSend }
  | { _action: 'get', where: WhereSend }

export type ManageSendResponse = EndpointResponse<SendConfig>

export class ManageSend extends SendEndpoint {
  async run(params: ManageSubscriptionParams, meta: EndpointMeta): Promise<ManageSendResponse> {
    const { _action } = params

    let r: ManageSendResponse | undefined
    switch (_action) {
      case 'create':
        r = await this.create(params, meta)
        break
      default:
        r = { status: 'error', message: 'Invalid action' }
    }

    if (!r) {
      return { status: 'error', message: 'Invalid action' }
    }

    return r
  }

  private async create(params: ManageSubscriptionParams & { _action: 'create' }, meta: EndpointMeta): Promise<ManageSendResponse> {
    const { orgId, fields } = params

    const { fictionDb } = this.settings
    const { email, userId } = params as { email?: string, userId?: string }

    if (!email && !userId) {
      return { status: 'error', message: 'Missing both email and userId' }
    }

    const sendFields: Partial<SendConfig> = { orgId, ...fields }

    const insertData = prepareFields({ type: 'create', fields: sendFields, meta, fictionDb, table: t.send })

    this.log.info('createSubscription', { data: insertData, caller: meta.caller })

    const result = await this.db().table(t.send).insert(insertData).returning('*').first()

    return { status: 'success', data: result }
  }
}
