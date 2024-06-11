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

export type WhereSubscription = { userId?: string, email?: string } & ({ userId: string } | { email: string })

export type SubscriberCreate = { email?: string, userId?: string, fields?: Partial<TableSubscribeConfig> } & ({ userId: string } | { email: string })
export type ManageSubscriptionParams =
  | { _action: 'create', publisherId: string } & SubscriberCreate
  | { _action: 'bulkCreate', publisherId: string, subscribers: SubscriberCreate[] }
  | { _action: 'list', publisherId: string, where?: Partial<TableSubscribeConfig>, limit?: number, offset?: number, page?: number }
  | { _action: 'count', publisherId: string, where: Partial<TableSubscribeConfig> }
  | { _action: 'update', publisherId: string, where: WhereSubscription[], fields: Partial<TableSubscribeConfig> }
  | { _action: 'delete', publisherId: string, where: WhereSubscription[] }

export type ManageSubscriptionResponse = EndpointResponse<Subscriber[]>

export class ManageSubscriptionQuery extends SubscribeEndpoint {
  limit = 40
  offset = 0

  async run(params: ManageSubscriptionParams, meta: EndpointMeta): Promise<ManageSubscriptionResponse> {
    const { _action } = params

    let r: ManageSubscriptionResponse | undefined
    switch (_action) {
      case 'create':
        r = await this.create(params, meta)
        break
      case 'bulkCreate':
        r = await this.bulkCreate(params, meta)
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

    if (!r) {
      return { status: 'error', message: 'Invalid action' }
    }

    return await this.addIndexMeta(params, r, meta)
  }

  private async addIndexMeta(params: ManageSubscriptionParams, r: ManageSubscriptionResponse, _meta?: EndpointMeta): Promise<ManageSubscriptionResponse> {
    const { publisherId } = params
    const { limit = this.limit, offset = this.offset } = params as { limit?: number, offset?: number }

    const { count } = await this.db().table(t.subscribe).where({ publisherId }).count().first<{ count: string }>()

    r.indexMeta = { limit, offset, count: +count, ...r.indexMeta }

    return r
  }

  // Helper function to resolve userId from email
  private async resolveUserId(email?: string, _meta?: EndpointMeta): Promise<string | undefined> {
    if (!email)
      return undefined

    const user = await this.db().table(t.user).where({ email }).first<User>()

    return user?.userId
  }

  private async create(params: ManageSubscriptionParams & { _action: 'create' }, meta: EndpointMeta): Promise<ManageSubscriptionResponse> {
    const { publisherId, fields } = params

    const { fictionDb } = this.settings
    const { email, userId } = params as { email?: string, userId?: string }

    if (!email && !userId) {
      return { status: 'error', message: 'Missing both email and userId' }
    }

    const resolvedUserId = userId || await this.resolveUserId(email, meta)

    const subscriptionFields: Partial<TableSubscribeConfig> = { publisherId, userId: resolvedUserId, email, ...fields, status: fields?.status || 'active' }

    const insertData = prepareFields({ type: 'create', fields: subscriptionFields, meta, fictionDb, table: t.subscribe })

    this.log.info('createSubscription', { data: insertData, caller: meta.caller })

    const conflictTarget = resolvedUserId ? ['user_id', 'publisher_id'] : ['email', 'publisher_id']

    const result = await this.db().table(t.subscribe)
      .insert(insertData)
      .onConflict(conflictTarget)
      .merge()
      .returning('*')

    return { status: 'success', data: result, indexMeta: { changedCount: 1 } }
  }

  // Bulk create subscriptions
  private async bulkCreate(params: ManageSubscriptionParams & { _action: 'bulkCreate' }, meta: EndpointMeta): Promise<ManageSubscriptionResponse> {
    const { publisherId, subscribers } = params
    const results: Subscriber[] = []

    // Process subscribers in batches
    for (const subscriber of subscribers) {
      const createParams: ManageSubscriptionParams & { _action: 'create' } = { _action: 'create', publisherId, ...subscriber }

      const result = await this.create(createParams, meta)
      if (result.status === 'success' && result.data) {
        results.push(...result.data)
      }
      else {
        this.log.error('Failed to create subscription for subscriber', subscriber)
      }
    }

    return { status: 'success', data: results, indexMeta: { changedCount: subscribers.length } }
  }

  private async listSubscriptions(params: ManageSubscriptionParams & { _action: 'list' }, _meta: EndpointMeta): Promise<ManageSubscriptionResponse> {
    const { where, publisherId } = params
    let { limit = this.limit, offset = this.offset, page } = params

    if (page && page > 0) {
      offset = (page - 1) * limit
    }

    const subscriptions = await this.db().select('*').from(t.subscribe).where({ publisherId, ...where }).limit(limit).offset(offset)
    return { status: 'success', data: subscriptions }
  }

  private async updateSubscription(params: ManageSubscriptionParams & { _action: 'update' }, _meta: EndpointMeta): Promise<ManageSubscriptionResponse> {
    const { where, fields, publisherId } = params

    if (!Array.isArray(where)) {
      return { status: 'error', message: 'where must be an array of conditions' }
    }

    const results: Subscriber[] = []
    for (const condition of where) {
      const { userId, email } = condition
      if ((!userId && !email)) {
        return { status: 'error', message: 'publisherId and either userId or email must be provided' }
      }

      const result = await this.db().table(t.subscribe).where({ publisherId, ...condition }).update(fields).returning('*')
      results.push(...result)
    }

    return { status: 'success', data: results, indexMeta: { changedCount: results.length } }
  }

  private async deleteSubscription(params: ManageSubscriptionParams & { _action: 'delete' }, _meta: EndpointMeta): Promise<ManageSubscriptionResponse> {
    const { where, publisherId } = params

    if (!Array.isArray(where)) {
      return { status: 'error', message: 'where must be an array of conditions' }
    }

    const results: Subscriber[] = []
    for (const condition of where) {
      const { userId, email } = condition
      if ((!userId && !email)) {
        return { status: 'error', message: 'publisherId and either userId or email must be provided' }
      }

      const result = await this.db().table(t.subscribe).where({ publisherId, ...condition }).delete().returning('*')
      results.push(...result)
    }

    return { status: 'success', message: 'Subscriptions deleted', data: results, indexMeta: { changedCount: results.length } }
  }
}
