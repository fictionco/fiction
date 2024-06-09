import { Readable } from 'node:stream'
import type { EndpointMeta, EndpointResponse, FictionDb, FictionEmail, FictionEnv } from '@fiction/core'
import { Query, abort, prepareFields, validateEmail } from '@fiction/core'

import fs from 'fs-extra'
import type { Subscriber, TableSubscribeConfig } from './schema'
import { t } from './schema'
import type { FictionSubscribe } from '.'

interface SaveMediaSettings {
  fictionSubscribe: FictionSubscribe
  fictionDb: FictionDb
  fictionEnv: FictionEnv
  fictionEmail: FictionEmail
}

abstract class SubscribeEndpoint extends Query<SaveMediaSettings> {
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

export type ManageSubscriptionResponse = EndpointResponse<Subscriber[]>

export class ManageSubscriptionQuery extends SubscribeEndpoint {
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

export type ManageSubscriberAdd =
  | { _action: 'uploadCsv', orgId: string, userId: string, test: number }

export class UploadCSVEndpoint extends SubscribeEndpoint {
  async run(params: ManageSubscriberAdd, meta: EndpointMeta): Promise<EndpointResponse<any>> {
    const { _action } = params

    let r: EndpointResponse | undefined
    switch (_action) {
      case 'uploadCsv':
        r = await this.uploadCsv(params, meta)
        break
      default:
        r = { status: 'error', message: 'Invalid action' }
    }

    return r || { status: 'error', message: 'Invalid action' }
  }

  async uploadCsv(params: ManageSubscriberAdd & { _action: 'uploadCsv' }, meta: EndpointMeta): Promise<EndpointResponse> {
    const file = meta.request?.file

    if (!file)
      throw abort('no file provided to endpoint by request')

    const { parseStream } = await import('@fast-csv/parse')

    const fileReadableStream = Readable.from(file.buffer)

    type CsvRow = {
      email: string
      tags: string
      [key: string]: string
    }

    const transformFunction = (data: CsvRow): CsvRow => {
      return Object.entries(data)
        .filter(([key, value]) => {
          return ['email', 'tags'].includes(key) && value.trim().length > 0
        })
        .reduce((acc: CsvRow, [key, value]) => {
          acc[key] = value.trim().toLowerCase()

          if (key === 'tags')
            acc[key] = value.split(/[;,|]/).map(tag => tag.trim().toLowerCase()).join(',')

          return acc
        }, {} as CsvRow)
    }

    const rows: CsvRow[] = []

    const isValidEmail = (email?: string) => email ? /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email) : false

    let resolvePromise: (value?: unknown) => void

    const myPromise = new Promise(resolve => (resolvePromise = resolve))

    parseStream<CsvRow, CsvRow>(fileReadableStream, { headers: headers => headers.map(h => h?.toLowerCase()) })
      .transform(transformFunction)
      .validate((data: CsvRow): boolean => isValidEmail(data.email))
      .on('error', error => console.error(error))
      .on('data', (row: CsvRow) => { rows.push(row) })
      .on('data-invalid', (row, rowNumber) => this.log.warn(`Invalid: rowNo(${rowNumber}) - ${JSON.stringify(row)}`))
      .on('end', (rowCount: number) => {
        this.log.info(`Parsed ${rowCount} rows`)
        resolvePromise()
      })

    await myPromise

    const message = 'uploaded successfully'

    return { status: 'success', data: { rows }, message }
  }
}
