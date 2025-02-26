import type { EmailSendConfig, EndpointMeta, EndpointResponse } from '@fiction/core'
import type { Contact } from '@fiction/plugin-contact'
import type { ManageSubscriptionParams } from '@fiction/plugin-contact/endpoint'
import type { FictionPosts, TableEmailConfig, TablePostConfig } from '@fiction/posts'
import type { FictionPostsSettings } from './index'
import { abort, dayjs, Endpoint, FictionPlugin, objectId, safeDirname, vue } from '@fiction/core'
import { t } from './schema'
import { getEmailForPost } from './utils/email'
import { trackingEndpointHandler } from './utils/tracking'

type FictionSendSettings = FictionPostsSettings & { fictionPosts: FictionPosts }

export type CampaignStats = {
  total: number
  sent: number
  failed: number
  queued: number
  skipped: number
  inProgress: boolean
}

export class FictionSend extends FictionPlugin<FictionSendSettings> {
  cacheKey = vue.ref(0)
  db = () => this.settings.fictionDb.client()
  constructor(settings: FictionSendSettings) {
    super('FictionSend', { root: safeDirname(import.meta.url), ...settings })

    this.trackingWebhookEndpoint()
  }

  private trackingWebhookEndpoint() {
    if (this.fictionEnv.isApp.value) {
      return
    }

    const checkoutEndpoint = new Endpoint({
      requestHandler: async (...r) => trackingEndpointHandler({ request: r[0], response: r[1], fictionSend: this }),
      key: 'emailTrackingEndpoint',
      basePath: '/email-tracking/:action?',
      serverUrl: this.settings.fictionServer.serverUrl.value,
      fictionUser: this.settings.fictionUser,
      fictionEnv: this.settings.fictionEnv,
      useNaked: true,
    })

    this.settings.fictionServer.addEndpoints([checkoutEndpoint])
  }

  async init() {
    await this.fictionEnv.events.on('fiveMinuteInterval', async () => this.scanAndSendrequestedCampaigns())
  }

  // Method to scan and send scheduled emails
  private async scanAndSendrequestedCampaigns(): Promise<void> {
    const now = dayjs().toISOString()

    // Find emails with status 'scheduled' and scheduledAt in the past
    const requestedCampaigns = await this.db()
      .table(t.posts)
      .where('status', 'scheduled')
      .where('publishAt', '<=', now)
      .select<TablePostConfig[]>('*')

    await Promise.all(requestedCampaigns.map(async c => this.processCampaign(c, { server: true })))
  }

  // Method to process each email
  async processCampaign(c: Partial<TablePostConfig>, meta: EndpointMeta): Promise<EndpointResponse<TablePostConfig[]> & { emailStats: CampaignStats }> {
    const fictionUser = this.settings.fictionUser
    const db = this.db()

    const { orgId, userId, postId } = c
    if (!orgId || !postId || !userId) {
      throw abort('orgId, postId, and userId are required', { ...meta, data: c })
    }

    const fictionPosts = this.settings.fictionPosts
    const ManagePost = fictionPosts.queries.ManagePost

    // Create tracking object for this run
    const campaignStats: CampaignStats = {
      total: 0,
      sent: 0,
      failed: 0,
      queued: 0,
      skipped: 0,
      inProgress: true,
    }

    try {
      // Update post status to 'processing'
      const r = await ManagePost.serve({
        _action: 'update',
        where: { postId },
        orgId,
        userId,
        fields: {
          status: 'processing',
          emailConfig: {
            ...(c.emailConfig || {}),
            startedAt: new Date().toISOString(),
          },
        },
      }, { server: true })

      const postConfig = r.data?.[0]
      if (!postConfig) {
        throw new Error('Campaign not found')
      }

      const r2 = await fictionUser.queries.ManageOrganization.serve(
        { _action: 'retrieve', where: { orgId } },
        { server: true },
      )

      const org = r2.data
      if (!org) {
        throw new Error('Organization not found')
      }

      // Prepare the email content once
      const emailConfig = await getEmailForPost({
        org,
        postConfig,
        fictionPosts,
        withDefaults: false,
      })

      // Get total subscriber count for progress tracking
      const totalCount = await db('fiction_contact')
        .where({ orgId, status: 'active' })
        .count('contactId as count')
        .first()

      campaignStats.total = Number.parseInt(`${totalCount?.count || 0}`, 10)

      // Process in batches
      const batchSize = 100
      let processedCount = 0
      let hasMoreContacts = true

      // Create a queue of all subscribers first
      await this.queueCampaignEmails({ postId, orgId })

      // Now process the queue in batches
      while (hasMoreContacts) {
        // Get batch of queued emails
        const emailBatch = await db(t.email)
          .select<TableEmailConfig[]>('*')
          .where({
            postId,
            orgId,
            status: 'queued',
          })
          .limit(batchSize)

        if (emailBatch.length === 0) {
          hasMoreContacts = false
          continue
        }

        // Process batch
        await Promise.all(emailBatch.map(emailRecord =>
          this.processQueuedEmail({
            emailRecord,
            emailConfig,
            campaignStats,
          }),
        ))

        processedCount += emailBatch.length

        // Update campaign progress
        await ManagePost.serve({
          _action: 'update',
          where: { postId },
          orgId,
          userId,
          fields: {
            emailConfig: {
              ...(postConfig.emailConfig || {}),
              progress: Math.min(100, Math.round((processedCount / campaignStats.total) * 100)),
              sentCount: campaignStats.sent,
              failedCount: campaignStats.failed,
            },
          },
        }, { server: true, caller: 'updateProgress' })
      }

      // Campaign is complete
      const finalStats = await this.getCampaignStats({ postId, orgId })
      campaignStats.inProgress = false

      // Update post with final status and stats
      const finalStatus = finalStats.failed === finalStats.total
        ? 'failed'
        : (finalStats.sent > 0 ? 'published' : 'draft')

      const r3 = await ManagePost.serve({
        _action: 'update',
        orgId,
        userId,
        where: { postId },
        fields: {
          status: finalStatus,
          emailConfig: {
            ...(postConfig.emailConfig || {}),
            completedAt: new Date().toISOString(),
            sentCount: finalStats.sent,
            failedCount: finalStats.failed,
            progress: 100,
          },
        },
      }, { server: true })

      return { ...r3, emailStats: finalStats }
    }
    catch (err) {
      const error = err as Error
      // Handle errors
      this.log.error(`Error processing post publish ${postId}:`, { error })

      try {
        // Update to error state but don't change already sent emails
        await ManagePost.serve({
          _action: 'update',
          where: { postId },
          orgId,
          userId,
          fields: {
            status: 'failed',
            emailConfig: {
              ...(c.emailConfig || {}),
              error: error.message || 'Unknown error occurred',
              failedAt: new Date().toISOString(),
            },
          },
        }, { server: true })
      }
      catch (updateError) {
        this.log.error('Failed to update post status after error', { error: updateError })
      }

      const stats = await this.getCampaignStats({ postId, orgId })
      return {
        status: 'error',
        message: error.message || 'Failed to process campaign',
        emailStats: { ...stats, inProgress: false },
      }
    }
  }

  // Method to get subscribers with limit and offset
  private async getContacts(args: { orgId: string, limit: number, offset: number }): Promise<Contact[]> {
    const { orgId, limit, offset } = args
    const params: ManageSubscriptionParams = { _action: 'list', orgId, limit, offset, where: { status: 'active' } }
    const result = await this.settings.fictionContact.queries.ManageSubscription.run(params, { server: true })
    return result.data || []
  }

  async sendEmailToContact(args: { email: string, emailConfig: EmailSendConfig }): Promise<void> {
    const { email, emailConfig } = args
    const fictionEmail = this.settings.fictionEmail

    await fictionEmail.sendEmail({ ...emailConfig, to: email, caller: 'sendEmailToContact' }, { server: true, emailMode: 'sendInProd' })
  }

  async queueCampaignEmails({ postId, orgId }: { postId: string, orgId: string }): Promise<void> {
    const db = this.db()

    // Get all active contacts
    const contacts = await db('fiction_contact')
      .where({ orgId, status: 'active' })
      .select('contactId', 'email')

    // Create queue entries for all contacts
    if (contacts.length > 0) {
      const queueEntries = contacts.map(sub => ({
        emailId: objectId({ prefix: 'cem' }),
        postId,
        orgId,
        contactId: sub.contactId,
        email: sub.email,
        status: 'queued',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))

      // Insert in batches to prevent query size issues
      const batchSize = 500
      for (let i = 0; i < queueEntries.length; i += batchSize) {
        const batch = queueEntries.slice(i, i + batchSize)
        await db(t.email)
          .insert(batch)
          .onConflict(['post_id', 'contact_id'])
          .merge(['status', 'updated_at'])
      }
    }
  }

  // Process a single queued email
  async processQueuedEmail({
    emailRecord,
  emailConfig,
  campaignStats,
  }: {
    emailRecord: TableEmailConfig
    emailConfig: EmailSendConfig
    campaignStats: CampaignStats
  }): Promise<void> {
    const db = this.db()
    const now = new Date().toISOString()

    try {
    // Update record to 'in progress'
      await db(t.email)
        .where({ emailId: emailRecord.emailId })
        .update({
          status: 'sending',
          attempts: db.raw('attempts + 1'),
          lastAttemptAt: now,
          updatedAt: now,
        })

      // Send the email
      await this.settings.fictionEmail.sendEmail(
        {
          ...emailConfig,
          to: emailRecord.email,
          toUserId: emailRecord.contactId,
          caller: 'campaignSend',
        },
        { server: true, emailMode: 'sendInProd' },
      )

      // Update record to 'sent'
      await db(t.email)
        .where({ emailId: emailRecord.emailId })
        .update({
          status: 'sent',
          sentAt: now,
          updatedAt: now,
        })

      campaignStats.sent++
    }
    catch (err) {
      const error = err as Error
      // Update record to 'failed'
      await db(t.email)
        .where({ emailId: emailRecord.emailId })
        .update({
          status: 'failed',
          error: error.message || 'Unknown error',
          updatedAt: now,
        })

      campaignStats.failed++
      this.log.error(`Failed to send email to ${emailRecord.email}`, { error })
    }
  }

  async getCampaignStats({ postId, orgId }: { postId: string, orgId: string }): Promise<CampaignStats> {
    const db = this.db()

    // Get all counts in a single query for efficiency
    const results = await db(t.email)
      .where({ postId, orgId })
      .select(db.raw(`
        count(*) as total,
        count(case when status = 'sent' then 1 end) as sent,
        count(case when status = 'failed' then 1 end) as failed,
        count(case when status = 'queued' then 1 end) as queued,
        count(case when status = 'skipped' then 1 end) as skipped
      `))
      .first()

    return {
      total: Number(results?.total || 0),
      sent: Number(results?.sent || 0),
      failed: Number(results?.failed || 0),
      queued: Number(results?.queued || 0),
      skipped: Number(results?.skipped || 0),
      inProgress: Number(results?.queued || 0) > 0,
    }
  }
}
