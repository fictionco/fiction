import type { DataCompared, DataPointChart, QueryParamsRefined } from '@fiction/analytics/types'
import type { ComplexDataFilter, EndpointMeta, EndpointResponse, FictionDb, IndexQuery, SyndicateStatus, User } from '@fiction/core'
import type { FictionContact } from '.'
import type { FictionContactSettings } from './index'
import type { Contact, TableContactConfig } from './schema'
import { refineParams, refineTimelineData } from '@fiction/analytics/utils/refine'
import { abort, applyComplexFilters, dayjs, deepMerge, Query, vue } from '@fiction/core'
import { t } from './schema'
import { trackContactMetrics } from './utils/analytics'

export type ContactEndpointSettings = {
  fictionContact: FictionContact
} & FictionContactSettings

abstract class SubscribeEndpoint extends Query<ContactEndpointSettings> {
  db = () => this.settings.fictionDb.client()
  constructor(settings: ContactEndpointSettings) {
    super(settings)
  }
}

export type WhereSubscription = { userId?: string, email?: string, contactId?: string } & ({ userId: string } | { email: string } | { contactId: string })

export type ContactCreate = { email?: string, userId?: string } & Partial<TableContactConfig> & ({ userId: string } | { email: string })
export type ManageContactRequest =
  | { _action: 'create', orgId: string, contact: ContactCreate }
  | { _action: 'bulkCreate', orgId: string, contacts: ContactCreate[] }
  | { _action: 'list', orgId: string, where?: Partial<TableContactConfig>, limit?: number, offset?: number, page?: number }
  | { _action: 'count', orgId: string, filters?: ComplexDataFilter[] }
  | { _action: 'update', orgId: string, where: WhereSubscription[], fields: Partial<TableContactConfig> }
  | { _action: 'delete', orgId: string, where: WhereSubscription[] }
  | { _action: 'current', targetOrgId: string, userId?: string }

export type ManageContactParams = ManageContactRequest & IndexQuery

export type ManageContactResponse = EndpointResponse<Contact[]>

export class ManageContactQuery extends SubscribeEndpoint {
  limit = 40
  offset = 0

  async run(params: ManageContactParams, meta: EndpointMeta): Promise<ManageContactResponse> {
    const { _action } = params

    let r: ManageContactResponse | undefined
    switch (_action) {
      case 'create':
        r = await this.create(params, meta)
        break
      case 'bulkCreate':
        r = await this.bulkCreate(params, meta)
        break
      case 'list':
        r = await this.listContacts(params, meta)
        break
      case 'update':
        r = await this.updateContact(params, meta)
        break
      case 'count':
        r = { status: 'success', data: [] } // added in indexMeta
        break
      case 'delete':
        r = await this.deleteContact(params, meta)
        break
      case 'current':
        r = await this.getCurrentContact(params, meta)
        break
      default:
        r = { status: 'error', message: 'Invalid action' }
    }

    if (!r) {
      return { status: 'error', message: 'Invalid action' }
    }


    return this.addIndexMeta(params, r, meta)
  }

  private async addIndexMeta(params: ManageContactParams, r: ManageContactResponse, _meta?: EndpointMeta): Promise<ManageContactResponse> {

    const { _action } = params

    if(_action === 'current') {
      return r
    }

    const { orgId } = params
    const { limit = this.limit, offset = this.offset, filters = [] } = params

    let baseQuery = this.db().table(t.contact).where({ orgId }).count().first<{ count: string }>()

    baseQuery = applyComplexFilters(baseQuery, filters)

    const { count } = await baseQuery

    r.indexMeta = { limit, offset, count: +count, ...r.indexMeta }

    return r
  }

  private async getCurrentContact(params: ManageContactParams & { _action: 'current' }, meta: EndpointMeta): Promise<ManageContactResponse> {
    const { targetOrgId, userId = meta.bearer?.userId } = params

    if (!targetOrgId)
      return { status: 'error', message: 'Missing targetOrgId' }
    if (!userId)
      return { status: 'success', data: undefined }

    const data = await this.db().table(t.contact).select('*').where({ orgId: targetOrgId, userId })

    return { status: 'success', data }
  }

  // Helper function to resolve userId from email
  private async resolveUserId(email?: string, _meta?: EndpointMeta): Promise<string | undefined> {
    if (!email)
      return undefined

    const user = await this.db().table(t.user).where({ email }).first<User>()

    return user?.userId
  }

  private async create(params: ManageContactParams & { _action: 'create' }, meta: EndpointMeta): Promise<ManageContactResponse> {
    const { orgId, contact } = params

    const { fictionDb } = this.settings
    const { email, userId } = contact as { email?: string, userId?: string }

    if (!email && !userId) {
      throw abort('need an email or userId to create contact')
    }
    else if (email && userId) {
      throw abort('Provide either email or userId, not both')
    }

    const resolvedUserId = userId || await this.resolveUserId(email, meta)

    const fields: Partial<TableContactConfig> = { orgId, userId: resolvedUserId, email, ...contact, status: contact?.status || 'active' }

    const insertData = fictionDb.prep({ type: 'insert', fields, meta, table: t.contact })

    this.log.info('createSubscription', { data: insertData, caller: meta.caller })

    const conflictTarget = resolvedUserId ? ['user_id', 'org_id'] : ['email', 'org_id']

    const result = await this.db().table(t.contact).insert(insertData).onConflict(conflictTarget).merge().returning('*')

    await trackContactMetrics({ orgId, fictionContact: this.settings.fictionContact, contact: result[0] }, meta)

    return { status: 'success', data: result, indexMeta: { changedCount: 1 } }
  }

  private async bulkCreate(params: ManageContactParams & { _action: 'bulkCreate' }, meta: EndpointMeta): Promise<ManageContactResponse> {
    const { orgId, contacts } = params
    const { fictionDb } = this.settings

    // Pre-fetch all user IDs for emails in one query
    const emails = contacts
      .filter(s => s.email && !s.userId)
      .map(s => s.email) as string[]

    const userIdMap = new Map<string, string>()
    if (emails.length) {
      const users = await this.db()
        .table(t.user)
        .whereIn('email', emails)
        .select(['email', 'userId'])

      users.forEach((user) => {
        userIdMap.set(user.email, user.userId)
      })
    }

    // Prepare all insert records
    const insertRecords = contacts.map((contact) => {
      const { email, userId } = contact
      const resolvedUserId = userId || (email ? userIdMap.get(email) : undefined)

      return fictionDb.prep({
        type: 'insert',
        fields: {
          orgId,
          userId: resolvedUserId,
          email,
          ...contact,
          status: contact.status || 'active',
        },
        meta,
        table: t.contact,
      })
    })

    // Batch insert with conflict resolution
    const results = await this.db()
      .table(t.contact)
      .insert(insertRecords)
      .onConflict(['email', 'org_id'])
      .merge()
      .returning('*')

    // Track metrics in parallel
    trackContactMetrics({
      orgId,
      fictionContact: this.settings.fictionContact,
    }, meta)

    return {
      status: 'success',
      data: results,
      indexMeta: { changedCount: results.length },
    }
  }

  private async listContacts(params: ManageContactParams & { _action: 'list' }, _meta: EndpointMeta): Promise<ManageContactResponse> {
    const { where, orgId } = params
    let { limit = this.limit, offset = this.offset, page } = params

    if (page && page > 0) {
      offset = (page - 1) * limit
    }

    const contacts = await this.db().select('*').from(t.contact).where({ orgId, ...where }).limit(limit).offset(offset).orderBy('updated_at', 'desc')

    // Create an array of promises to fetch user data concurrently
    await Promise.all(contacts.map(async (contact) => {
      let user: User | undefined
      if (contact.userId) {
        const userResponse = await this.settings.fictionUser.queries.ManageUser.serve({ _action: 'retrieve', where: { userId: contact.userId } }, _meta)
        if (userResponse.status === 'success' && userResponse.data) {
          user = userResponse.data
        }
      }
      contact.user = deepMerge([user, contact.inlineUser])
    }))

    return { status: 'success', data: contacts }
  }

  private async updateContact(params: ManageContactParams & { _action: 'update' }, meta: EndpointMeta): Promise<ManageContactResponse> {
    const { where, fields, orgId } = params

    if (!Array.isArray(where)) {
      return { status: 'error', message: 'where must be an array of conditions' }
    }

    const prepped = this.settings.fictionDb.prep({ type: 'update', fields, meta, table: t.contact })

    const results: Contact[] = []
    for (const condition of where) {
      if (Object.values(condition).length !== 1) {
        return { status: 'error', message: 'one and only one where condition should be set' }
      }
      const updatedAt = new Date().toISOString()

      const { status: previousStatus } = await this.db().table(t.contact).where({ orgId, ...condition }).select<{ status: SyndicateStatus }>('status').first() || { }

      const result = await this.db().table(t.contact).where({ orgId, ...condition }).update({ ...prepped, updatedAt }).returning<TableContactConfig[]>('*')
      const contact = result[0]
      results.push(contact)

      await trackContactMetrics({ fictionContact: this.settings.fictionContact, orgId, previousStatus, contact }, meta)
    }

    return { status: 'success', message: 'Contact Updated', data: results, indexMeta: { changedCount: results.length } }
  }

  private async deleteContact(params: ManageContactParams & { _action: 'delete' }, meta: EndpointMeta): Promise<ManageContactResponse> {
    const { where, orgId } = params

    if (!Array.isArray(where)) {
      return { status: 'error', message: 'where must be an array of conditions' }
    }

    const results: Contact[] = []
    for (const condition of where) {
      const { userId, email, contactId } = condition
      if ((!userId && !email && !contactId)) {
        return { status: 'error', message: 'delete contact missing specifier' }
      }

      const result = await this.db().table(t.contact).where({ orgId, ...condition }).delete().returning('*')
      const contact = result[0]
      const previousStatus = contact.status
      contact.status = 'deleted'
      results.push(contact)

      await trackContactMetrics({ fictionContact: this.settings.fictionContact, orgId, previousStatus, contact }, meta)
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
  fictionContact: FictionContact
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
    const results = await db(t.contact)
      .select(
        db.raw(`DATE_TRUNC(?, to_date(updated_at::TEXT, 'YYYY-MM-DD') AT TIME ZONE ?) AS date`, [interval, timeZone]),
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
    const rollupTotals = await db(t.contact)
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
