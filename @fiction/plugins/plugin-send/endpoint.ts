import type { EndpointMeta, EndpointResponse, IndexQuery } from '@fiction/core'
import { Query, prepareFields } from '@fiction/core'
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

export type WhereSend = { sendId?: string }
type StandardFields = { orgId: string, userId: string }

export type ManageEmailSendParams =
  | { _action: 'create', fields: EmailSendConfig } & StandardFields
  | { _action: 'update', where: WhereSend[], fields: Partial<EmailSendConfig> } & StandardFields
  | { _action: 'delete', where: WhereSend[] } & StandardFields
  | { _action: 'list' } & StandardFields & IndexQuery

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
      default:
        r = { status: 'error', message: 'Invalid action' }
    }

    if (!r) {
      return { status: 'error', message: 'Invalid action' }
    }

    return await this.refineResponse(params, r, meta)
  }

  private async refineResponse(params: ManageEmailSendParams, r: ManageSendResponse, _meta: EndpointMeta): Promise<ManageSendResponse> {
    const { orgId } = params
    const { limit = this.limit, offset = this.offset } = params as { limit?: number, offset?: number }

    const { count } = await this.db().table(t.send).where({ orgId }).count().first<{ count: string }>()

    r.indexMeta = { limit, offset, count: +count, ...r.indexMeta }

    if (r.data) {
      const promises = r.data.map(async (row) => {
        if (!row.postId || row.post) {
          return row
        }

        const post = await this.settings.fictionPosts.queries.ManagePost.serve({ _action: 'get', orgId, postId: row.postId }, _meta)
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

    const sendFields: Partial<EmailSendConfig> = { orgId, ...fields }
    const postFields = { type: 'email' as const, orgId, userId, ...fields.post }
    const r = await this.settings.fictionPosts.queries.ManagePost.serve({ _action: 'create', orgId, userId, fields: postFields }, meta)

    const post = r.data

    if (!post) {
      throw new Error('Post not created')
    }

    const insertFields = prepareFields({ type: 'create', fields: sendFields, meta, fictionDb, table: t.send })
    const insertData: EmailSendConfig = { orgId, userId, postId: post?.postId, ...insertFields }

    const [row] = await this.db().table(t.send).insert(insertData).returning('*')

    row.post = post

    return { status: 'success', data: [row], indexMeta: { changedCount: 1 } }
  }

  private async list(params: ManageEmailSendParams & { _action: 'list' }, _meta: EndpointMeta): Promise<ManageSendResponse> {
    const { orgId, limit = this.limit, offset = this.offset } = params
    const r = await this.db().select('*').from(t.send).where({ orgId }).orderBy('updatedAt', 'desc').limit(limit).offset(offset)
    return { status: 'success', data: r }
  }
}
