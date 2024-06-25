import { type DataFilter, type EndpointMeta, type EndpointResponse, type FictionDb, type FictionEmail, type FictionEnv, type FictionUser, type IndexQuery, type User, vue } from '@fiction/core'
import { Query, dayjs, deepMerge, prepareFields } from '@fiction/core'
import { refineParams, refineTimelineData } from '@fiction/analytics/utils/refine'
import type { DataCompared, DataPointChart, QueryParamsRefined } from '@fiction/analytics/types'
import type { Subscriber, TableSubscribeConfig } from './schema'
import { t } from './schema'
import type { FictionSubscribe } from '.'

export interface SubscriberEndpointSettings {
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

export type WhereSubscription = { userId?: string, email?: string, subscriptionId?: string } & ({ userId: string } | { email: string } | { subscriptionId: string })

export type SubscriberCreate = { email?: string, userId?: string, fields?: Partial<TableSubscribeConfig> } & ({ userId: string } | { email: string })
export type ManageSubscriptionRequest =
  | { _action: 'create', orgId: string } & SubscriberCreate
  | { _action: 'bulkCreate', orgId: string, subscribers: SubscriberCreate[] }
  | { _action: 'list', orgId: string, where?: Partial<TableSubscribeConfig>, limit?: number, offset?: number, page?: number }
  | { _action: 'count', orgId: string, filters?: DataFilter[] }
  | { _action: 'update', orgId: string, where: WhereSubscription[], fields: Partial<TableSubscribeConfig> }
  | { _action: 'delete', orgId: string, where: WhereSubscription[] }

export type ManageSubscriptionParams = ManageSubscriptionRequest & IndexQuery

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
      case 'count':
        r = { status: 'success', data: [] } // added in indexMeta
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
    const { orgId } = params
    const { limit = this.limit, offset = this.offset, filters = [] } = params

    const q = this.db().table(t.subscribe).where({ orgId }).count().first<{ count: string }>()

    if (filters.length) {
      filters.forEach((filter) => {
        void q.andWhere(filter.field, filter.operator, filter.value)
      })
    }

    const { count } = await q

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
    const { orgId, fields } = params

    const { fictionDb } = this.settings
    const { email, userId } = params as { email?: string, userId?: string }

    if (!email && !userId) {
      return { status: 'error', message: 'Missing both email and userId' }
    }

    const resolvedUserId = userId || await this.resolveUserId(email, meta)

    const subscriptionFields: Partial<TableSubscribeConfig> = { orgId, userId: resolvedUserId, email, ...fields, status: fields?.status || 'active' }

    const insertData = prepareFields({ type: 'create', fields: subscriptionFields, meta, fictionDb, table: t.subscribe })

    this.log.info('createSubscription', { data: insertData, caller: meta.caller })

    const conflictTarget = resolvedUserId ? ['user_id', 'org_id'] : ['email', 'org_id']

    const result = await this.db().table(t.subscribe)
      .insert(insertData)
      .onConflict(conflictTarget)
      .merge()
      .returning('*')

    return { status: 'success', data: result, indexMeta: { changedCount: 1 } }
  }

  // Bulk create subscriptions
  private async bulkCreate(params: ManageSubscriptionParams & { _action: 'bulkCreate' }, meta: EndpointMeta): Promise<ManageSubscriptionResponse> {
    const { orgId, subscribers } = params
    const results: Subscriber[] = []

    // Process subscribers in batches
    for (const subscriber of subscribers) {
      const createParams: ManageSubscriptionParams & { _action: 'create' } = { _action: 'create', orgId, ...subscriber }

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
    const { where, orgId } = params
    let { limit = this.limit, offset = this.offset, page } = params

    if (page && page > 0) {
      offset = (page - 1) * limit
    }

    const subscriptions = await this.db().select('*').from(t.subscribe).where({ orgId, ...where }).limit(limit).offset(offset).orderBy('updated_at', 'desc')

    // Create an array of promises to fetch user data concurrently
    await Promise.all(subscriptions.map(async (subscription) => {
      let user: User | undefined
      if (subscription.userId) {
        const userResponse = await this.settings.fictionUser.queries.ManageUser.serve({ _action: 'retrieve', where: { userId: subscription.userId } }, _meta)
        if (userResponse.status === 'success' && userResponse.data) {
          user = userResponse.data
        }
      }
      subscription.user = deepMerge([user, subscription.inlineUser])
    }))

    return { status: 'success', data: subscriptions }
  }

  private async updateSubscription(params: ManageSubscriptionParams & { _action: 'update' }, _meta: EndpointMeta): Promise<ManageSubscriptionResponse> {
    const { where, fields, orgId } = params

    if (!Array.isArray(where)) {
      return { status: 'error', message: 'where must be an array of conditions' }
    }

    const prepped = prepareFields({ type: 'settings', fields, meta: _meta, fictionDb: this.settings.fictionDb, table: t.subscribe })

    const results: Subscriber[] = []
    for (const condition of where) {
      if (Object.values(condition).length !== 1) {
        return { status: 'error', message: 'one and only one where condition should be set' }
      }
      const updatedAt = new Date().toISOString()

      const result = await this.db().table(t.subscribe).where({ orgId, ...condition }).update({ ...prepped, updatedAt }).returning('*')
      results.push(...result)
    }

    return { status: 'success', data: results, indexMeta: { changedCount: results.length } }
  }

  private async deleteSubscription(params: ManageSubscriptionParams & { _action: 'delete' }, _meta: EndpointMeta): Promise<ManageSubscriptionResponse> {
    const { where, orgId } = params

    if (!Array.isArray(where)) {
      return { status: 'error', message: 'where must be an array of conditions' }
    }

    const results: Subscriber[] = []
    for (const condition of where) {
      const { userId, email } = condition
      if ((!userId && !email)) {
        return { status: 'error', message: 'orgId and either userId or email must be provided' }
      }

      const result = await this.db().table(t.subscribe).where({ orgId, ...condition }).delete().returning('*')
      results.push(...result)
    }

    return { status: 'success', message: 'Subscriptions deleted', data: results, indexMeta: { changedCount: results.length } }
  }
}

const dataKeys = ['subscriptions', 'unsubscribes', 'cleaned'] as const
type SubDataPoint = DataPointChart<typeof dataKeys[number]>
type ReturnData = DataCompared<SubDataPoint>
export type SubscriptionAnalyticsResponse = EndpointResponse<ReturnData>

type SubscriptionAnalyticsParams = {
  fictionDb: FictionDb
  fictionSubscribe: FictionSubscribe
}

export class SubscriptionAnalytics extends Query<SubscriptionAnalyticsParams> {
  override dataKeys = dataKeys
  override getParams = () => {
    return refineParams({})
  }

  override dataRef = vue.ref<ReturnData>({})

  db = () => this.settings.fictionDb.client()
  async run(params: QueryParamsRefined, _meta: EndpointMeta): Promise<SubscriptionAnalyticsResponse> {
    const db = this.db()
    const now = dayjs()
    const { timeZone = 'UTC', orgId, timeStartAtIso = now.subtract(1, 'month').toISOString(), timeEndAtIso = now.toISOString(), interval = 'day' } = params

    if (!orgId)
      return { status: 'error', message: 'Missing orgId' }
    // Query to get new subscriptions, unsubscribes, and cleaned statuses s
    const results = await db(t.subscribe)
      .select(
        db.raw(`DATE_TRUNC(?, updated_at AT TIME ZONE ?) AS date`, [interval, timeZone]),
        db.raw(`SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS subscriptions`),
        db.raw(`SUM(CASE WHEN status = 'unsubscribed' AND previous_status = 'active' THEN 1 ELSE 0 END) AS unsubscribes`),
        db.raw(`SUM(CASE WHEN status = 'bounced' AND previous_status = 'active' THEN 1 ELSE 0 END) AS cleaned`),
      )
      .where('org_id', orgId)
      .andWhere('updated_at', '>=', timeStartAtIso)
      .andWhere('updated_at', '<=', timeEndAtIso)
      .groupBy('date')
      .orderBy('date', 'asc')

    // Calculate rollup totals
    const rollupTotals = await db(t.subscribe)
      .select(
        db.raw(`SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS subscriptions`),
        db.raw(`SUM(CASE WHEN status = 'unsubscribed' AND previous_status = 'active' THEN 1 ELSE 0 END) AS unsubscribes`),
        db.raw(`SUM(CASE WHEN status = 'bounced' AND previous_status = 'active' THEN 1 ELSE 0 END) AS cleaned`),
      )
      .where('org_id', orgId)
      .andWhere('updated_at', '>=', timeStartAtIso)
      .andWhere('updated_at', '<=', timeEndAtIso)
      .first()

    // Transform results to DataPointChart format
    const mainData: SubDataPoint[] = results.map((row: any) => ({
      date: row.date.toISOString(),
      subscriptions: Number.parseInt(row.subscriptions),
      unsubscribes: Number.parseInt(row.unsubscribes),
      cleaned: Number.parseInt(row.cleaned),
    }))

    const mainTotals = {
      date: '',
      subscriptions: Number.parseInt(rollupTotals.subscriptions),
      unsubscribes: Number.parseInt(rollupTotals.unsubscribes),
      cleaned: Number.parseInt(rollupTotals.cleaned),
    }

    const main = refineTimelineData({ data: mainData, timeStartAtIso, timeEndAtIso, interval, timeZone })

    const data = { main, mainTotals, params }

    return { status: 'success', data }
  }
}
