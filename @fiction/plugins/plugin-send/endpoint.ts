import type { EndpointMeta, EndpointResponse, IndexQuery } from '@fiction/core'
import { Query } from '@fiction/core'
import { t } from './schema'
import type { EmailSendConfig } from './schema.js'
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

export type WhereSend = { emailId?: string }
type StandardFields = { orgId: string, userId?: string, loadDraft?: boolean }

export type ManageEmailSendActionParams =
  | { _action: 'create', fields: EmailSendConfig[] }
  | { _action: 'update', where: WhereSend[], fields: Partial<EmailSendConfig> }
  | { _action: 'delete', where: WhereSend[] }
  | { _action: 'list' } & IndexQuery
  | { _action: 'get', where: WhereSend, loadDraft?: boolean }

export type ManageEmailSendParams = ManageEmailSendActionParams & StandardFields

export type ManageSendResponse = EndpointResponse<EmailSendConfig[]>

export class ManageSend extends SendEndpoint {
  limit = 10
  offset = 0
  async run(params: ManageEmailSendParams, meta: EndpointMeta): Promise<ManageSendResponse> {
    const { _action } = params

    let r: ManageSendResponse | undefined
    switch (_action) {
      case 'create':
        r = await this.create(params, meta)
        break
      case 'list':
        r = await this.list(params, meta)
        break
      case 'get':
        r = await this.list({ ...params, _action: 'list', filters: [{ field: 'emailId', operator: '=', value: params.where.emailId || '' }] }, meta)
        break
      case 'update':
        r = await this.update(params, meta)
        break
      case 'delete':
        r = await this.delete(params, meta)
        break
      default:
        r = { status: 'error', message: 'Invalid action' }
    }

    if (!r) {
      return { status: 'error', message: 'Invalid action' }
    }

    return await this.refineResponse(params, r, meta)
  }

  private async refineResponse(params: ManageEmailSendParams, r: ManageSendResponse, _meta: EndpointMeta): Promise<ManageSendResponse> {
    const { orgId, loadDraft } = params
    const { limit = this.limit, offset = this.offset } = params as { limit?: number, offset?: number }

    const { count } = await this.db().table(t.send).where({ orgId }).count().first<{ count: string }>()

    r.indexMeta = { limit, offset, count: +count, ...r.indexMeta }

    if (r.data) {
      const promises = r.data.map(async (row) => {
        if (!row.postId || row.post) {
          return row
        }

        const post = await this.settings.fictionPosts.queries.ManagePost.serve({ _action: 'get', orgId, postId: row.postId, loadDraft }, _meta)
        row.post = post.data
        return row
      })

      r.data = await Promise.all(promises)
    }

    return r
  }

  private async create(params: ManageEmailSendParams & { _action: 'create' }, meta: EndpointMeta): Promise<ManageSendResponse> {
    const { orgId, fields, userId } = params

    const { fictionDb } = this.settings

    const promises = fields.map(async (f) => {
      const sendFields: Partial<EmailSendConfig> = { orgId, ...f }
      const postFields = { type: 'email' as const, orgId, userId, ...f.post }

      this.log.info('creating email', { data: postFields })
      const r = await this.settings.fictionPosts.queries.ManagePost.serve({ _action: 'create', orgId, userId, fields: postFields }, meta)

      const post = r.data

      if (!post?.postId) {
        throw new Error('Post not created')
      }

      const insertFields = fictionDb.prep({ type: 'insert', fields: sendFields, meta, table: t.send })
      const insertData: EmailSendConfig = { orgId, userId, postId: post.postId, ...insertFields }

      const [row] = await this.db().table(t.send).insert(insertData).returning('*')

      row.post = post

      return row
    })

    const data = await Promise.all(promises)

    return { status: 'success', data, indexMeta: { changedCount: fields.length } }
  }

  private async list(params: ManageEmailSendParams & { _action: 'list' }, _meta: EndpointMeta): Promise<ManageSendResponse> {
    const { orgId, limit = this.limit, offset = this.offset, filters = [] } = params
    const query = this.db().select('*').from(t.send).where({ orgId }).orderBy('updatedAt', 'desc').limit(limit).offset(offset)

    filters.forEach((filter) => {
      if (filter.field && filter.operator && filter.value)
        void query.where(filter.field, filter.operator, filter.value)
      else
        throw new Error('Invalid filter')
    })

    const r = await query

    return { status: 'success', data: r }
  }

  private async update(params: ManageEmailSendParams & { _action: 'update' }, meta: EndpointMeta): Promise<ManageSendResponse> {
    const { where, fields, orgId, userId } = params

    if (!Array.isArray(where)) {
      return { status: 'error', message: 'where must be an array of conditions' }
    }

    const prepped = this.settings.fictionDb.prep({ type: 'update', fields, meta, table: t.send })

    const promises = where.map(async (w) => {
      const result = await this.db().table(t.send).where({ orgId, ...w }).update({ ...prepped, updatedAt: new Date().toISOString() }).limit(1).returning<EmailSendConfig[]>('*')
      const row = result[0]
      const postId = row?.postId

      if (!postId) {
        this.log.error('No postId found for email send', { orgId, userId, emailId: row?.emailId })
        return row
      }

      const r = await this.settings.fictionPosts.queries.ManagePost.serve({ _action: 'update', orgId, userId, postId, fields: { ...fields.post } }, meta)

      row.post = r.data

      return row
    })

    const data = (await Promise.all(promises)).filter(Boolean)

    return { status: 'success', data, indexMeta: { changedCount: data.length } }
  }

  private async delete(params: ManageEmailSendParams & { _action: 'delete' }, _meta: EndpointMeta): Promise<ManageSendResponse> {
    const { where, orgId } = params

    if (!Array.isArray(where)) {
      return { status: 'error', message: 'where must be an array of conditions' }
    }

    const promises = where.map(async (w) => {
      const row = await this.db().select('*').table(t.send).where({ orgId, ...w }).first<EmailSendConfig>()
      if (!row) {
        return
      }

      const postId = row.postId

      // foreign key constraint will delete post and email row if post is deleted
      if (postId) {
        const r = await this.settings.fictionPosts.queries.ManagePost.serve({ _action: 'delete', orgId, postId }, _meta)
        row.post = r.data
      }
      else {
        await this.db().table(t.send).where({ orgId, ...w }).delete()
      }

      return row
    })

    const data = (await Promise.all(promises)).filter(Boolean) as EmailSendConfig[]

    return { status: 'success', message: `${data.length} items deleted`, data, indexMeta: { changedCount: data.length } }
  }
}
