import type { EndpointMeta, EndpointResponse, FictionDb, FictionEmail, FictionEnv } from '@fiction/core'
import { Query, prepareFields } from '@fiction/core'
import type { FictionMonitor } from '@fiction/plugin-monitor'
import type { TableSubscribeConfig } from './schema'
import { t } from './schema'
import type { FictionSubscribe } from '.'

interface SaveMediaSettings {
  fictionSubscribe: FictionSubscribe
  fictionDb: FictionDb
  fictionEnv: FictionEnv
  fictionEmail: FictionEmail
}

abstract class SubscribeQuery extends Query<SaveMediaSettings> {
  db = () => this.settings.fictionDb.client()
  constructor(settings: SaveMediaSettings) {
    super(settings)
  }
}

export type WhereSubscription = { subscribeId: string } | { orgId: string, userId: string }

export type ManageSubscriptionParams =
  | { _action: 'create', fields: Partial<TableSubscribeConfig> & { orgId: string, userId: string } }
  | { _action: 'list', where: Partial<TableSubscribeConfig>, limit?: number, offset?: number }
  | { _action: 'count', where: Partial<TableSubscribeConfig> }
  | { _action: 'update', where: WhereSubscription, fields: Partial<TableSubscribeConfig> }
  | { _action: 'delete', where: WhereSubscription }

export type ManageSubscriptionResponse = EndpointResponse<TableSubscribeConfig[]>

export class ManageSubscriptionQuery extends SubscribeQuery {
  async run(params: ManageSubscriptionParams, meta: EndpointMeta): Promise<ManageSubscriptionResponse> {
    const { _action } = params

    let r: ManageSubscriptionResponse | undefined
    switch (_action) {
      case 'create':
        r = await this.createSubscription(params, meta)
        break
      case 'list':
        r = await this.listSubscriptions(params, meta)
        break
      case 'update':
        r = await this.updateSubscription(params, meta)
        break
      case 'delete':
        r = await this.deleteSubscription(params, meta)
        break
      default:
        r = { status: 'error', message: 'Invalid action' }
    }

    return r || { status: 'error', message: 'Invalid action' }
  }

  private async createSubscription(params: ManageSubscriptionParams & { _action: 'create' }, meta: EndpointMeta): Promise<ManageSubscriptionResponse> {
    const fields: Partial<TableSubscribeConfig> = { status: 'active', ...params.fields }
    const insertData = prepareFields({ type: 'create', fields, meta, fictionDb: this.settings.fictionDb, table: t.subscribe })

    this.log.info('createSubscription', { data: insertData, caller: meta.caller })

    const result = await this.db().table(t.subscribe).insert(insertData).onConflict(['user_id', 'org_id']).merge().returning('*')
    return { status: 'success', data: result }
  }

  private async listSubscriptions(params: ManageSubscriptionParams & { _action: 'list' }, _meta: EndpointMeta): Promise<ManageSubscriptionResponse> {
    const { where } = params
    const subscriptions = await this.db().select('*')
      .from(t.subscribe)
      .where(where)
      .limit(params.limit || 20)
      .offset(params.offset || 0)
    return { status: 'success', data: subscriptions }
  }

  private async updateSubscription(params: ManageSubscriptionParams & { _action: 'update' }, _meta: EndpointMeta): Promise<ManageSubscriptionResponse> {
    const { where, fields } = params

    const result = await this.db().table(t.subscribe)
      .where(where)
      .update(fields)
      .returning('*')

    return { status: 'success', data: result }
  }

  private async deleteSubscription(params: ManageSubscriptionParams & { _action: 'delete' }, _meta: EndpointMeta): Promise<ManageSubscriptionResponse> {
    const { where } = params

    const result = await this.db().table(t.subscribe)
      .where(where)
      .delete()
      .limit(1)
      .returning('*')

    return { status: 'success', message: 'Subscription deleted', data: result }
  }
}
