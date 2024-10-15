import type { EndpointMeta, EndpointResponse, IndexQuery, TransactionalEmailConfig } from '@fiction/core'
import type { Subscriber } from '@fiction/plugin-subscribe'
import type { ManageSubscriptionParams } from '@fiction/plugin-subscribe/endpoint'
import type { FictionSend, FictionSendSettings } from '.'
import type { EmailCampaignConfig } from './schema.js'
import { applyComplexFilters, dayjs, deepMerge, objectId, Query } from '@fiction/core'
import { CronTool } from '@fiction/core/utils/cron'
import { t } from './schema'
import { getEmailForCampaign } from './utils'

export type SendEndpointSettings = {
  fictionSend: FictionSend
} & FictionSendSettings

abstract class SendEndpoint extends Query<SendEndpointSettings> {
  db = () => this.settings.fictionDb.client()
  constructor(settings: SendEndpointSettings) {
    super(settings)
  }
}

export type WhereSend = { campaignId?: string }
type StandardFields = { orgId: string, userId?: string, loadDraft?: boolean }

export type ManageCampaignRequestParams =
  | { _action: 'create', fields: EmailCampaignConfig[] }
  | { _action: 'update', where: WhereSend[], fields: Partial<EmailCampaignConfig> }
  | { _action: 'delete', where: WhereSend[] }
  | { _action: 'list' } & IndexQuery
  | { _action: 'get', where: WhereSend, loadDraft?: boolean }
  | { _action: 'send', where: WhereSend }
  | { _action: 'saveDraft', where: WhereSend, fields: Partial<EmailCampaignConfig> }
  | { _action: 'revertDraft', where: WhereSend }
  | { _action: 'sendTest', where: WhereSend, testEmails: string, maxEmails?: number }

export type ManageCampaignParams = ManageCampaignRequestParams & StandardFields

export type ManageCampaignResponse = EndpointResponse<EmailCampaignConfig[]>

export class ManageCampaign extends SendEndpoint {
  limit = 10
  offset = 0
  async run(params: ManageCampaignParams, meta: EndpointMeta): Promise<ManageCampaignResponse> {
    const { _action } = params

    let r: ManageCampaignResponse | undefined
    switch (_action) {
      case 'create':
        r = await this.create(params, meta)
        break
      case 'list':
        r = await this.list(params, meta)
        break
      case 'get':
        r = await this.get(params, meta)
        break
      case 'update':
        r = await this.update(params, meta)
        break
      case 'delete':
        r = await this.delete(params, meta)
        break
      case 'send':
        r = await this.send(params, meta)
        break
      case 'saveDraft':
        r = await this.saveDraft(params, meta)
        break
      case 'revertDraft':
        r = await this.revertDraft(params, meta)
        break
      case 'sendTest':
        r = await this.sendTest(params as ManageCampaignParams & { _action: 'sendTest' }, meta)
        break
      default:
        r = { status: 'error', message: 'Invalid action' }
    }

    if (!r) {
      return { status: 'error', message: 'Invalid action' }
    }

    return r
  }

  private async refineResponse(params: ManageCampaignParams, r: ManageCampaignResponse, _meta: EndpointMeta): Promise<ManageCampaignResponse> {
    const { orgId, loadDraft } = params
    const { limit = this.limit, offset = this.offset } = params as { limit?: number, offset?: number }

    const { count } = await this.db().table(t.campaign).where({ orgId }).count().first<{ count: string }>()

    r.indexMeta = { limit, offset, count: +count, ...r.indexMeta }

    if (r.data) {
      const promises = r.data.map(async (row) => {
        if (!row.postId || row.post) {
          return row
        }

        const r = await this.settings.fictionPosts.queries.ManagePost.serve({ _action: 'get', orgId, where: { postId: row.postId }, loadDraft }, _meta)
        row.post = r.data?.[0]
        return row
      })

      r.data = await Promise.all(promises)
    }

    return r
  }

  private async send(params: ManageCampaignParams & { _action: 'send' }, meta: EndpointMeta): Promise<ManageCampaignResponse> {
    const { orgId, where, userId } = params
    const { timeZone = 'UTC' } = meta

    const r = await this.get({ _action: 'get', orgId, where, userId, loadDraft: true }, meta)

    const campaign = r.data?.[0]

    if (!campaign) {
      throw new Error('Campaign not found')
    }

    const now = dayjs().toISOString()
    const scheduledAt = campaign.scheduleMode === 'now' ? now : campaign.scheduledAt

    if (!scheduledAt) {
      throw new Error('No scheduled date available')
    }
    else if (dayjs(scheduledAt).add(1, 'hour').isBefore(now)) {
      throw new Error('Scheduled date is in the past')
    }
    else {
      this.log.info('Sending email', { data: { campaignId: campaign.campaignId, scheduledAt } })
    }

    const r2 = await this.update({ _action: 'update', orgId, userId, where: [where], fields: { status: 'requested', scheduledAt } }, meta)

    const message = campaign.scheduleMode === 'now' ? `Email is being sent, check back soon.` : `Email scheduled ${dayjs(scheduledAt).tz(timeZone).format(`MMM DD, YYYY [at] h:mm A [${timeZone}]`)}`

    return this.refineResponse(params, { status: 'success', message, data: r2.data }, meta)
  }

  private async create(params: ManageCampaignParams & { _action: 'create' }, meta: EndpointMeta): Promise<ManageCampaignResponse> {
    const { orgId, fields, userId } = params

    const { fictionDb } = this.settings

    const promises = fields.map(async (f) => {
      const sendFields: Partial<EmailCampaignConfig> = { orgId, ...f }
      const postFields = { type: 'email' as const, orgId, userId, ...f.post }

      this.log.info('creating email', { data: postFields })
      const r = await this.settings.fictionPosts.queries.ManagePost.serve({ _action: 'create', orgId, userId, fields: postFields }, meta)

      const post = r.data?.[0]

      if (!post?.postId) {
        throw new Error('Post not created')
      }

      const insertFields = fictionDb.prep({ type: 'insert', fields: sendFields, meta, table: t.campaign })
      const insertData: EmailCampaignConfig = { orgId, userId, postId: post.postId, ...insertFields }

      const [row] = await this.db().table(t.campaign).insert(insertData).returning('*')

      const r2 = await this.get({ _action: 'get', orgId, where: { campaignId: row.campaignId } }, meta)

      const campaign = r2.data?.[0]

      if (!campaign) {
        throw new Error('Campaign not created')
      }

      return campaign
    })

    const data = await Promise.all(promises)

    return this.refineResponse(params, { status: 'success', message: 'created successfully', data, indexMeta: { changedCount: fields.length } }, meta)
  }

  private async list(params: ManageCampaignParams & { _action: 'list' }, _meta: EndpointMeta): Promise<ManageCampaignResponse> {
    const { orgId, limit = this.limit, offset = this.offset, filters = [], loadDraft = false } = params
    let baseQuery = this.db().select('*').from(t.campaign).where({ orgId }).orderBy('updatedAt', 'desc').limit(limit).offset(offset)

    baseQuery = applyComplexFilters(baseQuery, filters)

    let campaigns = await baseQuery

    if (loadDraft) {
      campaigns = campaigns.map((campaign) => {
        if (campaign.draft) {
          const mergedCampaign = deepMerge([campaign, campaign.draft])
          delete mergedCampaign.draft
          return mergedCampaign
        }
        return campaign
      })
    }
    else {
      campaigns = campaigns.map((campaign) => {
        const { draft, ...rest } = campaign
        return rest
      })
    }

    return this.refineResponse(params, { status: 'success', data: campaigns }, _meta)
  }

  private async get(params: ManageCampaignParams & { _action: 'get' }, meta: EndpointMeta): Promise<ManageCampaignResponse> {
    const r = await this.list({ ...params, _action: 'list', filters: [[{ field: 'campaignId', operator: '=', value: params.where.campaignId || '' }]] }, meta)

    const ManageSubscription = this.settings.fictionSubscribe.queries.ManageSubscription
    const sub = await ManageSubscription.serve({ _action: 'count', orgId: params.orgId }, meta)

    if (r.data?.[0]) {
      r.data[0].subscriberCount = sub.indexMeta?.count || 0
    }

    return this.refineResponse(params, r, meta)
  }

  private async update(params: ManageCampaignParams & { _action: 'update' }, meta: EndpointMeta): Promise<ManageCampaignResponse> {
    const { where, fields, orgId, userId, loadDraft = false } = params

    if (!Array.isArray(where)) {
      return { status: 'error', message: 'where must be an array of conditions' }
    }

    const prepped = this.settings.fictionDb.prep({ type: 'update', fields, meta, table: t.campaign })

    const promises = where.map(async (w) => {
      let updateFields = prepped
      if (loadDraft) {
        const currentCampaign = await this.db().table(t.campaign).where({ orgId, ...w }).first()
        updateFields = { draft: deepMerge([currentCampaign.draft || {}, prepped]) }
      }
      else {
        updateFields.draft = {}
      }

      const result = await this.db().table(t.campaign).where({ orgId, ...w }).update({ ...updateFields, updatedAt: new Date().toISOString() }).returning('*')

      const row = result[0]
      if (row?.postId) {
        const r = await this.settings.fictionPosts.queries.ManagePost.serve({
          _action: 'update',
          orgId,
          userId,
          where: { postId: row.postId },
          fields: { ...fields.post },
          loadDraft,
        }, meta)
        row.post = r.data?.[0]
      }

      if (loadDraft && row.draft) {
        const mergedRow = deepMerge([row, row.draft])
        delete mergedRow.draft
        return mergedRow
      }

      const { draft, ...restRow } = row
      return restRow
    })

    const data = await Promise.all(promises)

    return this.refineResponse(params, { status: 'success', data, indexMeta: { changedCount: data.length }, message: 'Updated Successfully' }, meta)
  }

  private async delete(params: ManageCampaignParams & { _action: 'delete' }, _meta: EndpointMeta): Promise<ManageCampaignResponse> {
    const { where, orgId } = params

    if (!Array.isArray(where)) {
      return { status: 'error', message: 'where must be an array of conditions' }
    }

    const promises = where.map(async (w) => {
      const row = await this.db().select('*').table(t.campaign).where({ orgId, ...w }).first<EmailCampaignConfig>()
      if (!row) {
        return
      }

      const postId = row.postId

      // foreign key constraint will delete post and email row if post is deleted
      if (postId) {
        const r = await this.settings.fictionPosts.queries.ManagePost.serve({ _action: 'delete', orgId, where: { postId } }, _meta)
        row.post = r.data?.[0]
      }
      else {
        await this.db().table(t.campaign).where({ orgId, ...w }).delete()
      }

      return row
    })

    const data = (await Promise.all(promises)).filter(Boolean) as EmailCampaignConfig[]

    return this.refineResponse(params, { status: 'success', message: `${data.length} items deleted`, data, indexMeta: { changedCount: data.length } }, _meta)
  }

  private async saveDraft(params: ManageCampaignParams & { _action: 'saveDraft' }, meta: EndpointMeta): Promise<ManageCampaignResponse> {
    const { where, fields, orgId, userId } = params
    const db = this.db()

    if (!where.campaignId) {
      return { status: 'error', message: 'campaignId is required to save a draft' }
    }

    const now = new Date()
    fields.updatedAt = now.toISOString()

    const campaign = await db(t.campaign).where({ orgId, ...where }).first()
    if (!campaign) {
      return { status: 'error', message: 'Campaign not found' }
    }

    const currentDraft = campaign.draft || {}
    const newDraft = {
      draftId: objectId({ prefix: 'dft' }),
      ...currentDraft,
      ...fields,
      updatedAt: now,
      createdAt: currentDraft.createdAt || now,
    }

    // Update campaign draft
    await db(t.campaign)
      .where({ orgId, ...where })
      .update({ draft: newDraft })

    // Save post draft if postId exists
    if (campaign.postId) {
      await this.settings.fictionPosts.queries.ManagePost.serve({
        _action: 'saveDraft',
        orgId,
        userId,
        where: { postId: campaign.postId },
        fields: fields.post || {},
      }, meta)
    }

    const updatedCampaign = await this.get({ _action: 'get', orgId, where, userId, loadDraft: true }, meta)

    return this.refineResponse(params, { status: 'success', data: updatedCampaign.data }, meta)
  }

  private async revertDraft(params: ManageCampaignParams & { _action: 'revertDraft' }, meta: EndpointMeta): Promise<ManageCampaignResponse> {
    const { where, orgId, userId } = params
    const db = this.db()

    if (!where.campaignId) {
      return { status: 'error', message: 'campaignId is required to revert a draft' }
    }

    const campaign = await db(t.campaign).where({ orgId, ...where }).first()
    if (!campaign) {
      return { status: 'error', message: 'Campaign not found' }
    }

    // Revert campaign draft
    await db(t.campaign)
      .where({ orgId, ...where })
      .update({ draft: {} })

    // Revert post draft if postId exists
    if (campaign.postId) {
      await this.settings.fictionPosts.queries.ManagePost.serve({
        _action: 'revertDraft',
        orgId,
        userId,
        where: { postId: campaign.postId },
      }, meta)
    }

    const updatedCampaign = await this.get({ _action: 'get', orgId, where, userId, loadDraft: false }, meta)

    return this.refineResponse(params, { status: 'success', data: updatedCampaign.data, message: 'Draft reverted successfully' }, meta)
  }

  private async sendTest(params: ManageCampaignParams & { _action: 'sendTest' }, meta: EndpointMeta): Promise<ManageCampaignResponse> {
    const { orgId, where, testEmails, maxEmails = 10 } = params
    const { fictionUser, fictionEmail } = this.settings

    if (!where.campaignId) {
      return { status: 'error', message: 'campaignId is required' }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const allEmails = testEmails.split(',').map(email => email.trim())
    const validEmails = allEmails.filter(email => emailRegex.test(email))
    const badlyFormattedEmails = allEmails.filter(email => !emailRegex.test(email))

    if (validEmails.length === 0) {
      return { status: 'error', message: 'No valid email addresses provided' }
    }

    if (validEmails.length > maxEmails) {
      return { status: 'error', message: `Too many email addresses. Maximum allowed: ${maxEmails}` }
    }

    const [campaign, org] = await Promise.all([
      this.get({ _action: 'get', orgId, where }, meta).then(r => r.data?.[0]),
      fictionUser.queries.ManageOrganization.serve({ _action: 'retrieve', where: { orgId } }, { server: true }).then(r => r.data),
    ])

    if (!campaign || !org) {
      return { status: 'error', message: 'Campaign or organization not found' }
    }

    const emailConfig = await getEmailForCampaign({
      org,
      campaignConfig: campaign,
      fictionSend: this.settings.fictionSend,
      withDefaults: false,
    })

    const results = await Promise.all(validEmails.map(async (email) => {
      try {
        await fictionEmail.sendEmail(
          { ...emailConfig, to: email, subject: `[TEST] ${emailConfig.subject}` },
          { server: true },
        )
        return { email, success: true }
      }
      catch (error) {
        this.log.error(`Failed to send test email to ${email}`, { error })
        return { email, success: false }
      }
    }))

    const sentEmails = results.filter(r => r.success).map(r => r.email)
    const failedToSendEmails = results.filter(r => !r.success).map(r => r.email)

    const message = [
      `Test emails sent.`,
      failedToSendEmails.length > 0 ? `${failedToSendEmails.length} failed to send.` : '',
      badlyFormattedEmails.length > 0 ? `${badlyFormattedEmails.length} had invalid format.` : '',
    ].filter(Boolean).join(' ')

    return this.refineResponse(params, {
      status: 'success',
      message,
      data: [campaign],
      meta: {
        sentEmails,
        failedToSendEmails,
        badlyFormattedEmails,
      },
    }, meta)
  }
}

export class ManageSend extends SendEndpoint {
  cronTool?: CronTool
  async init(args: { crontab?: string } = {}) {
    const { crontab = '*/2 * * * *' } = args
    await this.startCronJob({ crontab })
  }

  async run(_params: ManageCampaignParams, _meta: EndpointMeta): Promise<EndpointResponse> {
    return { status: 'success' }
  }

  // Method to scan and send scheduled emails
  private async scanAndSendrequestedCampaigns(): Promise<void> {
    const now = dayjs().toISOString()

    // Find emails with status 'scheduled' and scheduledAt in the past
    const requestedCampaigns = await this.db()
      .table(t.campaign)
      .where('status', 'requested')
      .where('scheduledAt', '<=', now)
      .select<{ campaignId: string, orgId: string }[]>('*')

    await Promise.all(requestedCampaigns.map(async c => this.processCampaign(c)))
  }

  // Method to process each email
  async processCampaign(c: { campaignId?: string, orgId?: string }): Promise<ManageCampaignResponse & { emailsSent?: number }> {
    const fictionUser = this.settings.fictionUser
    const fictionSend = this.settings.fictionSend
    const ManageCampaign = fictionSend.queries.ManageCampaign
    const { orgId, campaignId } = c
    if (!orgId || !campaignId) {
      throw new Error('Invalid campaign')
    }

    let emailsSent = 0
    try {
      // Update email status to 'processing'
      const r = await ManageCampaign.serve({ _action: 'update', where: [{ campaignId }], orgId, fields: { status: 'processing' } }, { server: true })

      const campaignConfig = r.data?.[0]

      if (!campaignConfig) {
        throw new Error('Campaign not found')
      }

      const r2 = await fictionUser.queries.ManageOrganization.serve({ _action: 'retrieve', where: { orgId } }, { server: true })

      const org = r2.data

      if (!org) {
        throw new Error('Organization not found')
      }

      // Process subscribers in batches to prevent blocking
      const limit = 100 // Define subscriber batch size
      let offset = 0
      let hasMoreSubscribers = true

      const emailConfig = await getEmailForCampaign({ org, campaignConfig, fictionSend, withDefaults: false })

      while (hasMoreSubscribers) {
        const subscribers = await this.getSubscribers({ orgId, limit, offset })

        if (subscribers.length < limit) {
          hasMoreSubscribers = false
        }

        await Promise.all(subscribers.map(async (subscriber) => {
          const email = subscriber.email

          if (!email) {
            this.log.error('Subscriber has no email', { subscriber })
            return
          }

          await this.sendEmailToSubscriber({ email, emailConfig })

          emailsSent++
        }))
        offset += limit
      }

      // Update email status to 'ready'

      const r3 = await ManageCampaign.serve({ _action: 'update', orgId, where: [{ campaignId }], fields: { status: 'ready' } }, { server: true })

      return { ...r3, emailsSent }
    }
    catch (error) {
      // Handle errors and retries
      this.log.error(`Error processing campaign ${campaignId}:`, { error })
      // Optionally update status to 'failed' or handle retries

      const r4 = await ManageCampaign.serve({ _action: 'update', where: [{ campaignId }], orgId, fields: { status: 'error' } }, { server: true })

      return { ...r4, emailsSent }
    }
  }

  // Method to get subscribers with limit and offset
  private async getSubscribers(args: { orgId: string, limit: number, offset: number }): Promise<Subscriber[]> {
    const { orgId, limit, offset } = args
    const params: ManageSubscriptionParams = { _action: 'list', orgId, limit, offset, where: { status: 'active' } }
    const result = await this.settings.fictionSubscribe.queries.ManageSubscription.run(params, { server: true })
    return result.data || []
  }

  async sendEmailToSubscriber(args: { email: string, emailConfig: TransactionalEmailConfig }): Promise<void> {
    const { email, emailConfig } = args
    const fictionEmail = this.settings.fictionEmail

    await fictionEmail.sendEmail({ ...emailConfig, to: email }, { server: true, emailMode: 'sendInProd' })
  }

  // Method to start the cron job
  private async startCronJob(args: { crontab: string }) {
    const { crontab } = args
    this.cronTool = new CronTool(crontab, () => {
      this.scanAndSendrequestedCampaigns().catch(console.error)
    })
  }

  close() {
    this.cronTool?.close()
  }
}
