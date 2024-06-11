import type { EndpointMeta, EndpointResponse, FictionDb, FictionEmail, FictionEnv, FictionUser, User } from '@fiction/core'
import { Query, prepareFields } from '@fiction/core'

import type { Subscriber, TableSubscribeConfig } from './schema'
import { t } from './schema'
import type { FictionSubscribe } from '.'

interface SubscriberEndpointSettings {
  fictionSubscribe: FictionSubscribe
  fictionDb: FictionDb
  fictionEnv: FictionEnv
  fictionEmail: FictionEmail
  fictionUser: FictionUser
}

abstract class SubscribeEndpoint extends Query<SubscriberEndpointSettings> {
  db = () => this.settings.fictionDb.client()
  constructor(settings: SubscriberEndpointSettings) {
    super(settings)
  }
}

export type WhereSubscription = { subscriptionId: string } | { publisherId: string, subscriberId: string }

export type ManageSubscriptionParams =
  | { _action: 'create', publisherId: string, fields?: Partial<TableSubscribeConfig> } & ({ subscriberId: string } | { email: string })
  | { _action: 'list', where: Partial<TableSubscribeConfig>, limit?: number, offset?: number }
  | { _action: 'count', where: Partial<TableSubscribeConfig> }
  | { _action: 'update', where: WhereSubscription, fields: Partial<TableSubscribeConfig> }
  | { _action: 'delete', where: WhereSubscription }

export type ManageSubscriptionResponse = EndpointResponse<Subscriber[]>

export class ManageSubscriptionQuery extends SubscribeEndpoint {
  async run(params: ManageSubscriptionParams, meta: EndpointMeta): Promise<ManageSubscriptionResponse> {
    const { _action } = params

    let r: ManageSubscriptionResponse | undefined
    switch (_action) {
      case 'create':
        r = await this.create(params, meta)
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

  private async create(params: ManageSubscriptionParams & { _action: 'create' }, meta: EndpointMeta): Promise<ManageSubscriptionResponse> {
    const { publisherId, fields } = params

    const { fictionDb } = this.settings
    let { email, subscriberId } = params as { email?: string, subscriberId?: string }

    if (email && !subscriberId) {
      const user = await this.db().table(t.user).where({ email }).first<User>()

      if (user) {
        subscriberId = user.userId
      }
      else {
        const [newUser] = await this.db().insert({ email }).into(t.user).returning<User[]>('*')

        if (!newUser.userId) {
          return { status: 'error', message: 'Failed to create user' }
        }

        subscriberId = newUser.userId
      }
    }

    const subscriptionFields: Partial<TableSubscribeConfig> = { publisherId, subscriberId, ...fields, status: fields?.status || 'active' }

    const insertData = prepareFields({ type: 'create', fields: subscriptionFields, meta, fictionDb, table: t.subscribe })

    this.log.info('createSubscription', { data: insertData, caller: meta.caller })

    const result = await this.db().table(t.subscribe)
      .insert(insertData)
      .onConflict(['subscriber_id', 'publisher_id'])
      .merge()
      .returning('*')

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
