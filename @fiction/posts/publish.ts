import type { ComplexDataFilter, EmailSendConfig, EndpointMeta, EndpointResponse } from '@fiction/core'
import type { Contact } from '@fiction/plugin-contact'
import type { ManageContactParams } from '@fiction/plugin-contact/endpoint'
import type { FictionPosts, TableEmailConfig, TablePostConfig } from '@fiction/posts'
import type { FictionPostsSettings } from './index'
import { abort, dayjs, Endpoint, FictionPlugin, objectId, safeDirname, vue } from '@fiction/core'
import { t } from './schema'
import { getEmailForPost } from './utils/email'
import { trackingEndpointHandler } from './utils/tracking'

type FictionPublishSettings = FictionPostsSettings & { fictionPosts: FictionPosts }

export type CampaignStats = {
  total: number
  sent: number
  failed: number
  queued: number
  skipped: number
  inProgress: boolean
}

export class FictionPublish extends FictionPlugin<FictionPublishSettings> {
  cacheKey = vue.ref(0)
  db = () => this.settings.fictionDb.client()
  constructor(settings: FictionPublishSettings) {
    super('FictionPublish', { root: safeDirname(import.meta.url), ...settings })

    this.trackingWebhookEndpoint()
  }

  private trackingWebhookEndpoint() {
    if (this.fictionEnv.isApp.value) {
      return
    }

    const checkoutEndpoint = new Endpoint({
      requestHandler: async (...r) => trackingEndpointHandler({ request: r[0], response: r[1], fictionPublish: this }),
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
    await this.fictionEnv.events.on('fiveMinuteInterval', async () => {
      if (this.settings.fictionEnv.isApp.value) {
        return
      }
      this.publishScheduledPosts()
    })
  }

  // Method to scan and send scheduled emails
  private async publishScheduledPosts(): Promise<void> {
    try {
      const now = dayjs().toISOString()

      // Find posts with status 'scheduled' and publishAt in the past
      const publishedPosts = await this.settings.fictionDb.client()
        .table(t.posts)
        .where('status', 'scheduled')
        .where('publishAt', '<=', now)
        .update({
          status: 'published',
          dateAt: now,
          hasChanges: false,
        })
        .returning('*')

      if (publishedPosts.length > 0) {
        this.log.info(`Published ${publishedPosts.length} scheduled posts`, {
          data: { postIds: publishedPosts.map(p => p.postId) },
        })
      }

      // Find emails with status 'scheduled' and scheduledAt in the past
      const publishedCampaigns = await this.db()
        .table(t.posts)
        .where('emailStatus', 'scheduled')
        .where('publishAt', '<=', now)
        .select<TablePostConfig[]>('*')

      this.log.info(`Found ${publishedCampaigns.length} scheduled campaigns`)

      if (publishedCampaigns.length === 0)
        return

      await Promise.all(publishedCampaigns.map(async c => this.processCampaign(c, { server: true })))
    }
    catch (error) {
      this.log.error('Error in publishScheduledPosts', { error })
    }
  }

  // Method to process each email
  async processCampaign(postConfig: Partial<TablePostConfig>, meta: EndpointMeta): Promise<EndpointResponse<TablePostConfig[]> & { emailStats: CampaignStats }> {
    const fictionUser = this.settings.fictionUser
    const db = this.db()

    const { orgId, userId, postId } = postConfig
    if (!orgId || !postId || !userId) {
      throw abort('orgId, postId, and userId are required', { ...meta, data: postConfig })
    }

    const fictionPosts = this.settings.fictionPosts
    const fictionContact = this.settings.fictionContact
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
          emailStatus: 'processing',
          emailConfig: {
            ...(postConfig.emailConfig || {}),
            startedAt: new Date().toISOString(),
          },
        },
      }, { server: true })

      if (r.data?.[0]) {
        postConfig = r.data[0]
      }

      const r2 = await fictionUser.queries.ManageOrganization.serve(
        { _action: 'read', where: { orgId } },
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

      // Handle targeting - either 'all', 'filtered', or 'nobody'
      const targetMode = postConfig.emailConfig?.target || 'all'

      if (targetMode === 'nobody') {
        const now = new Date().toISOString()
        campaignStats.skipped = 1
        campaignStats.inProgress = false

        // Update post immediately to 'published' since no emails need to be sent
        const r3 = await ManagePost.serve({
          _action: 'update',
          orgId,
          userId,
          where: { postId },
          fields: {
            emailStatus: 'published',
            emailConfig: {
              ...(postConfig.emailConfig || {}),
              completedAt: now,
              sentCount: 0,
              failedCount: 0,
              skippedCount: 1,
              progress: 100,
            },
          },
        }, { server: true })

        return {
          ...r3,
          emailStats: campaignStats,
        }
      }

      // Queue emails based on target mode
      await this.queueCampaignEmails({
        postId,
        orgId,
        filters: targetMode === 'filtered' ? postConfig.emailConfig?.filters : undefined,
      })

      // Get total subscriber count for progress tracking
      let totalCount = 0

      if (targetMode === 'all') {
        // Count all active contacts
        const countResponse = await fictionContact.queries.ManageContact.run({
          _action: 'count',
          orgId,
        }, { server: true })

        totalCount = countResponse.indexMeta?.count || 0
      }
      else if (targetMode === 'filtered') {
        // Count filtered contacts
        const countResponse = await fictionContact.queries.ManageContact.run({
          _action: 'count',
          orgId,
          filters: postConfig.emailConfig?.filters,
        }, { server: true })

        totalCount = countResponse.indexMeta?.count || 0
      }

      // Count queued emails (should match filtered count)
      const queuedCount = await db(t.email)
        .where({ orgId, postId, status: 'queued' })
        .count('emailId as count')
        .first()

      campaignStats.total = Number.parseInt(`${queuedCount?.count || 0}`, 10)

      // Process in batches
      const batchSize = 100
      let processedCount = 0
      let hasMoreContacts = true

      // Now process the queue in batches
      while (hasMoreContacts) {
        // Get batch of queued emails
        const emailBatch = await db(t.email)
          .select<TableEmailConfig[]>('*')
          .where({ postId, orgId, status: 'queued' })
          .limit(batchSize)

        if (emailBatch.length === 0) {
          hasMoreContacts = false
          continue
        }

        // Process batch
        await Promise.all(emailBatch.map(emailRecord =>
          this.processQueuedEmail({ emailRecord, emailConfig, campaignStats }),
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
          emailStatus: finalStatus,
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
            emailStatus: 'failed',
            emailConfig: {
              ...(postConfig.emailConfig || {}),
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
  private async getContacts(args: { orgId: string, limit: number, offset: number, filters?: ComplexDataFilter[] }): Promise<Contact[]> {
    const { orgId, limit, offset, filters } = args
    const params: ManageContactParams = {
      _action: 'list',
      orgId,
      limit,
      offset,
      where: { status: 'active' },
      filters,
    }
    const result = await this.settings.fictionContact.queries.ManageContact.run(params, { server: true })
    return result.data || []
  }

  async sendEmailToContact(args: { email: string, emailConfig: EmailSendConfig }): Promise<void> {
    const { email, emailConfig } = args
    const fictionEmail = this.settings.fictionEmail

    await fictionEmail.sendEmail({ ...emailConfig, to: email, caller: 'sendEmailToContact' }, { server: true, emailMode: 'sendInProd' })
  }

  async queueCampaignEmails(args: { postId: string, orgId: string, filters?: ComplexDataFilter[], pageSize?: number }): Promise<void> {
    const { postId, orgId, filters, pageSize = 1000 } = args
    const db = this.db()
    const fictionContact = this.settings.fictionContact

    // Use the existing ManageContact.run method to get contacts with filters
    const response = await fictionContact.queries.ManageContact.run({
      _action: 'list',
      orgId,
      filters,
      where: { status: 'active' },
      limit: pageSize, // Use pagination for large datasets
      offset: 0,
    }, { server: true })

    const contacts = response.data || []

    // Handle pagination for large contact lists
    let allContacts = [...contacts]
    let page = 1
    let hasMorePages = contacts.length === pageSize

    while (hasMorePages) {
      const offset = page * pageSize

      // Fetch next page
      const nextPageResponse = await fictionContact.queries.ManageContact.run({
        _action: 'list',
        orgId,
        filters,
        where: { status: 'active' },
        limit: pageSize,
        offset,
      }, { server: true })

      const nextPageContacts = nextPageResponse.data || []
      if (nextPageContacts.length === 0) {
        hasMorePages = false
        break
      }
      else {
        hasMorePages = nextPageContacts.length === pageSize
      }

      allContacts = [...allContacts, ...nextPageContacts]
      page++
    }

    // Create queue entries for all filtered contacts
    if (allContacts.length > 0) {
      const queueEntries = allContacts.map(contact => ({
        emailId: objectId({ prefix: 'cem' }),
        postId,
        orgId,
        contactId: contact.contactId,
        email: contact.email,
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

      const to = emailRecord.email

      if (!to) {
        throw abort('Email address is missing')
      }

      // Send the email
      await this.settings.fictionEmail.sendEmail(
        {
          ...emailConfig,
          to,
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
