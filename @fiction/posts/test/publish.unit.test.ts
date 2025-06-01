import type { ComplexDataFilter, EmailSendConfig } from '@fiction/core'
import type { Contact } from '@fiction/plugins/plugin-contact'
import type express from 'express'
import type { CampaignStats } from '../publish'
import type { TablePostConfig } from '../schema'
import { dayjs, objectId, shortId } from '@fiction/core'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { FictionPosts } from '..'
import { FictionPublish } from '../publish'
import { t } from '../schema'

describe('fictionPublish', async () => {
  // Create test utils once at the beginning
  const testUtils = await createSiteTestUtils()

  // Initialize test environment and services
  const initialized = await testUtils.init()
  const orgId = initialized.orgId
  const userId = initialized.user.userId

  // Create required service instances that aren't included in testUtils
  const fictionPosts = new FictionPosts(testUtils)

  // Set up FictionPublish instance
  const fictionPublish = new FictionPublish({ ...testUtils, fictionPosts })

  const db = () => testUtils.fictionDb.client()

  const getTestPost = async (config = {}): Promise<TablePostConfig> => {
    const testPost: TablePostConfig = {
      postId: objectId({ prefix: 'pst' }),
      title: 'Test Campaign Email',
      content: '<p>Hello, this is a test email campaign!</p>',
      orgId,
      userId,
      status: 'draft' as const,
      emailStatus: 'draft' as const,
      slug: 'test-campaign',
      emailConfig: {
        subject: 'Test Email Subject',
        preview: 'Test preview text',
        ...config,
      },
    }

    // Insert the test post into the database
    await db()
      .table(t.posts)
      .insert(testPost)

    return testPost
  }

  const createContact = async (tags: string[] = []) => {
    const contactId = objectId({ prefix: 'cnt' })
    const contact = {
      contactId,
      email: `test-${shortId()}@example.com`,
      orgId,
      status: 'active',
      tags,
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
    }

    await db()
      .table('fiction_contact')
      .insert(contact)

    return contact
  }

  afterAll(async () => testUtils.close())

  it('should queue campaign emails for contacts', async () => {
    const testPost = await getTestPost()
    const testContact = await createContact()

    // Queue emails for campaign
    await fictionPublish.queueCampaignEmails({
      postId: testPost.postId as string,
      orgId,
    })

    // Verify email was queued
    const queuedEmails = await db()
      .table(t.email)
      .where({
        postId: testPost.postId,
        orgId,
      })
      .select('*')

    expect(queuedEmails.length).toBe(1)
    expect(queuedEmails[0].email).toBe(testContact.email)
    expect(queuedEmails[0].status).toBe('queued')
  })

  it('should filter contacts by tags when queueing emails', async () => {
    // Create a post with filtered targeting and tag filters
    const filters: ComplexDataFilter[] = [
      [{
        field: 'tags',
        operator: 'in',
        value: ['newsletter'],
      }],
    ]

    const testPost = await getTestPost({
      target: 'filtered',
      filters,
    })

    // Create contacts with different tags
    const taggedContact = await createContact(['newsletter', 'customer'])
    const untaggedContact = await createContact(['customer'])

    // Mock ManageContact.run to return filtered contacts
    const originalRun = fictionPublish.settings.fictionContact.queries.ManageContact.run
    fictionPublish.settings.fictionContact.queries.ManageContact.run = vi.fn(async (params, meta) => {
      if (params._action === 'list') {
        // Filter contacts based on filters parameter
        if (params.filters && params.filters.length > 0) {
          // Simple mock implementation that returns only tagged contacts
          return {
            status: 'success' as const,
            data: [taggedContact] as Contact[],
            indexMeta: { count: 1 },
          }
        }
        return {
          status: 'success' as const,
          data: [taggedContact, untaggedContact] as Contact[],
          indexMeta: { count: 2 },
        }
      }
      if (params._action === 'count') {
        if (params.filters && params.filters.length > 0) {
          return {
            status: 'success' as const,
            data: [] as Contact[],
            indexMeta: { count: 1 },
          }
        }
        return {
          status: 'success' as const,
          data: [] as Contact[],
          indexMeta: { count: 2 },
        }
      }
      return originalRun(params, meta)
    })

    // Queue emails for filtered campaign
    await fictionPublish.queueCampaignEmails({
      postId: testPost.postId as string,
      orgId,
      filters,
    })

    // Verify only filtered contacts received the email
    const queuedEmails = await db()
      .table(t.email)
      .where({
        postId: testPost.postId,
        orgId,
      })
      .select('*')

    expect(queuedEmails.length).toBe(1)
    expect(queuedEmails[0].email).toBe(taggedContact.email)
    expect(queuedEmails[0].contactId).toBe(taggedContact.contactId)

    // Restore original function
    fictionPublish.settings.fictionContact.queries.ManageContact.run = originalRun
  })

  it('should handle target="nobody" mode and skip sending', async () => {
    // Create a post with 'nobody' targeting
    const testPost = await getTestPost({
      target: 'nobody',
    })
    await createContact() // Create a contact that should be ignored

    // Process campaign with 'nobody' target
    const result = await fictionPublish.processCampaign(testPost, { server: true })

    // Check that no emails were queued
    const queuedEmails = await db()
      .table(t.email)
      .where({
        postId: testPost.postId,
        orgId,
      })
      .select('*')

    expect(queuedEmails.length).toBe(0)
    expect(result.emailStats.skipped).toBeGreaterThan(0)
    expect(result.emailStats.inProgress).toBe(false)
  })

  it('should process a campaign end-to-end with filtered contacts', async () => {
    // Create a post with filtered targeting
    const filters = [
      [{ field: 'tags', operator: 'in', value: ['vip'] }],
    ]

    const testPost = await getTestPost({
      target: 'filtered',
      filters,
    })

    // Create VIP and non-VIP contacts
    const vipContact = await createContact(['vip'])
    const regularContact = await createContact(['regular'])

    // Mock ManageContact and email sending
    const originalRun = fictionPublish.settings.fictionContact.queries.ManageContact.run
    fictionPublish.settings.fictionContact.queries.ManageContact.run = vi.fn(async (params, meta) => {
      if (params._action === 'list') {
        if (params.filters && params.filters.length > 0) {
          return {
            status: 'success' as const,
            data: [vipContact] as Contact[],
            indexMeta: { count: 1 },
          }
        }
        return {
          status: 'success' as const,
          data: [vipContact, regularContact] as Contact[],
          indexMeta: { count: 2 },
        }
      }
      if (params._action === 'count') {
        if (params.filters && params.filters.length > 0) {
          return {
            status: 'success' as const,
            data: [] as Contact[],
            indexMeta: { count: 1 },
          }
        }
        return {
          status: 'success' as const,
          data: [] as Contact[],
          indexMeta: { count: 2 },
        }
      }
      return originalRun(params, meta)
    })

    // Mock email sending
    const sendEmailMock = vi.fn().mockResolvedValue(undefined)
    fictionPublish.settings.fictionEmail.sendEmail = sendEmailMock

    // Mock ManagePost serve
    const originalServe = fictionPosts.queries.ManagePost.serve
    fictionPosts.queries.ManagePost.serve = vi.fn().mockResolvedValue({
      status: 'success',
      data: [testPost],
    })

    // Process the campaign
    const result = await fictionPublish.processCampaign({
      postId: testPost.postId,
      orgId,
      userId,
    }, { server: true })

    // Verify only VIP contact was processed
    expect(fictionPublish.settings.fictionContact.queries.ManageContact.run).toHaveBeenCalledWith(
      expect.objectContaining({
        _action: 'list',
        filters,
      }),
      expect.anything(),
    )

    // Verify email sending
    expect(sendEmailMock).toHaveBeenCalledTimes(1)

    // Verify stats in result
    expect(result.emailStats.total).toBeGreaterThan(0)
    expect(result.emailStats.sent).toBeGreaterThan(0)

    // Restore original functions
    fictionPublish.settings.fictionContact.queries.ManageContact.run = originalRun
    fictionPosts.queries.ManagePost.serve = originalServe
  })

  it('should handle large contact lists with pagination', async () => {
    const testPost = await getTestPost()

    // Mock a large contact list that requires pagination
    const originalRun = fictionPublish.settings.fictionContact.queries.ManageContact.run

    // Create mock contacts for first and second page
    const firstPageContacts = await Promise.all(Array.from({ length: 3 }).fill(0).map(_ => createContact())) as Contact[]

    const secondPageContacts = await Promise.all(Array.from({ length: 2 }).fill(0).map(_ => createContact())) as Contact[]

    let callCount = 0
    fictionPublish.settings.fictionContact.queries.ManageContact.run = vi.fn(async (params, meta) => {
      if (params._action === 'list') {
        callCount++
        // First page
        if (params.offset === 0) {
          return {
            status: 'success' as const,
            data: firstPageContacts,
            indexMeta: { count: 5 },
          }
        }
        // Second page
        return {
          status: 'success' as const,
          data: secondPageContacts,
          indexMeta: { count: 5 },
        }
      }
      if (params._action === 'count') {
        return {
          status: 'success' as const,
          data: [],
          indexMeta: { count: 5 },
        }
      }
      return originalRun(params, meta)
    })

    // Queue emails
    await fictionPublish.queueCampaignEmails({
      postId: testPost.postId || '',
      orgId,
      pageSize: 3,
    })

    // Verify pagination was used
    expect(callCount).toBe(2) // Called twice for pagination

    // Verify all contacts were queued
    const queuedEmails = await db()
      .table(t.email)
      .where({
        postId: testPost.postId,
        orgId,
      })
      .select('*')

    expect(queuedEmails.length).toBe(5) // Total from both pages

    // Restore original function
    fictionPublish.settings.fictionContact.queries.ManageContact.run = originalRun
  })

  it('should update campaign progress during batch processing', async () => {
    const testPost = await getTestPost()

    // Create multiple contacts
    const contacts = []
    for (let i = 0; i < 3; i++) {
      contacts.push(await createContact())
    }

    // Queue emails
    await fictionPublish.queueCampaignEmails({
      postId: testPost.postId || '',
      orgId,
    })

    // Mock email sending
    const sendEmailMock = vi.fn().mockResolvedValue(undefined)
    fictionPublish.settings.fictionEmail.sendEmail = sendEmailMock

    // Mock ManagePost serve to capture progress updates
    const progressUpdates: number[] = []
    const originalServe = fictionPosts.queries.ManagePost.serve
    fictionPosts.queries.ManagePost.serve = vi.fn(async (params) => {
      if (params._action === 'update' && params.fields.emailConfig?.progress !== undefined) {
        progressUpdates.push(params.fields.emailConfig.progress)
      }
      return {
        status: 'success' as const,
        data: [testPost] as TablePostConfig[],
      }
    })

    // Process the campaign
    await fictionPublish.processCampaign({
      postId: testPost.postId,
      orgId,
      userId,
    }, { server: true })

    // Verify progress updates were made
    expect(progressUpdates.length).toBeGreaterThan(0)

    // Last progress should be 100%
    expect(progressUpdates[progressUpdates.length - 1]).toBe(100)

    // Restore original function
    fictionPosts.queries.ManagePost.serve = originalServe
  })

  it('should process a queued email', async () => {
    const testPost = await getTestPost()
    // Mock email sending
    const sendEmailMock = vi.fn().mockResolvedValue(undefined)
    fictionPublish.settings.fictionEmail.sendEmail = sendEmailMock

    const testContact = await createContact()

    // Create a test queued email
    const emailId = objectId({ prefix: 'cem' })
    const emailRecord = {
      emailId,
      postId: testPost.postId,
      orgId,
      contactId: testContact.contactId,
      email: 'test@example.com',
      status: 'queued' as const,
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
    }
    await db()
      .table(t.email)
      .insert(emailRecord)

    // Setup campaign stats tracker
    const campaignStats: CampaignStats = {
      total: 1,
      sent: 0,
      failed: 0,
      queued: 1,
      skipped: 0,
      inProgress: true,
    }

    // Process the email
    await fictionPublish.processQueuedEmail({
      emailRecord,
      emailConfig: {
        subject: 'Test Email',
        content: '<p>Test content</p>',
        preview: 'Test preview',
      } as EmailSendConfig,
      campaignStats,
    })

    // Verify email was sent and status updated
    expect(sendEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'test@example.com',
        subject: 'Test Email',
      }),
      expect.objectContaining({
        server: true,
        emailMode: 'sendInProd',
      }),
    )

    // Check campaign stats updated correctly
    expect(campaignStats.sent).toBe(1)

    // Check database record updated
    const updatedEmail = await db()
      .table(t.email)
      .where({ emailId })
      .first()

    expect(updatedEmail.status).toBe('sent')
    expect(updatedEmail.sentAt).toBeDefined()
  })

  it('should handle email sending failures', async () => {
    const testPost = await getTestPost()
    // Mock email sending failure
    const sendError = new Error('SMTP error')
    const sendEmailMock = vi.fn().mockRejectedValue(sendError)
    fictionPublish.settings.fictionEmail.sendEmail = sendEmailMock

    // Create a test queued email
    const emailId = objectId({ prefix: 'cem' })
    const testContact = await createContact()
    const emailRecord = {
      emailId,
      postId: testPost.postId,
      orgId,
      contactId: testContact.contactId,
      email: testContact.email,
      status: 'queued',
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
    }
    await db()
      .table(t.email)
      .insert(emailRecord)

    // Setup campaign stats tracker
    const campaignStats: CampaignStats = {
      total: 1,
      sent: 0,
      failed: 0,
      queued: 1,
      skipped: 0,
      inProgress: true,
    }

    // Process the email that will fail
    await fictionPublish.processQueuedEmail({
      emailRecord: {
        emailId,
        postId: testPost.postId,
        orgId,
        email: testContact.email,
        status: 'queued',
      },
      emailConfig: {
        subject: 'Test Email',
        content: '<p>Test content</p>',
        preview: 'Test preview',
      } as EmailSendConfig,
      campaignStats,
    })

    // Verify error handling
    expect(campaignStats.failed).toBe(1)
    expect(campaignStats.sent).toBe(0)

    // Check database status update
    const updatedEmail = await db()
      .table(t.email)
      .where({ emailId })
      .first()

    expect(updatedEmail.status).toBe('failed')
    expect(updatedEmail.error).toBe('SMTP error')
  })

  it('should calculate campaign statistics accurately', async () => {
    const testPost = await getTestPost()
    // Insert test emails with different statuses
    const emailStatuses = ['sent', 'sent', 'failed', 'queued']

    for (let i = 0; i < emailStatuses.length; i++) {
      const testContact = await createContact()
      const emailRecord = {
        emailId: objectId({ prefix: 'cem' }),
        postId: testPost.postId,
        orgId,
        contactId: testContact.contactId,
        email: testContact.email,
        status: emailStatuses[i],
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
      }
      await db()
        .table(t.email)
        .insert(emailRecord)
    }

    // Get campaign stats
    const stats = await fictionPublish.getCampaignStats({
      postId: testPost.postId || '',
      orgId,
    })

    // Verify stats
    expect(stats.total).toBe(4)
    expect(stats.sent).toBe(2)
    expect(stats.failed).toBe(1)
    expect(stats.queued).toBe(1)
    expect(stats.inProgress).toBe(true)
  })

  it('should track email events from webhook', async () => {
    const testPost = await getTestPost()
    // Mock analytics tracking
    const trackMock = vi.fn()
    fictionPublish.settings.fictionAnalytics.track = trackMock

    // Create mock request with webhook data
    const mockRequest = {
      query: {},
      params: {},
      body: {
        signature: {
          token: 'test-token',
          timestamp: Date.now() / 1000,
          signature: 'test-signature',
        },
        eventData: {
          id: 'event123',
          timestamp: Date.now() / 1000,
          event: 'opened',
          recipient: 'recipient@example.com',
          recipientDomain: 'example.com',
          userVariables: {
            fromOrgId: orgId,
            postId: testPost.postId,
            contactId: objectId({ prefix: 'cnt' }),
            env: testUtils.fictionEnv.isProd.value ? 'prod' : 'dev',
            caller: 'campaign',
          },
          logLevel: 'info',
          deliveryStatus: { attemptNo: 1 },
          envelope: {
            sender: 'sender@fiction.com',
            transport: 'smtp',
            targets: ['recipient@example.com'],
            sendingIp: '127.0.0.1',
          },
          message: {
            headers: {
              to: 'recipient@example.com',
              from: 'sender@fiction.com',
              subject: 'Test Subject',
              messageId: 'message123',
            },
            size: 1024,
          },
          geolocation: {
            country: 'US',
            region: 'CA',
            city: 'San Francisco',
          },
        },
      },
    } as unknown as express.Request

    const mockResponse = {
      send: vi.fn().mockReturnThis(),
      end: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as unknown as express.Response

    // Process webhook event
    const { trackingEndpointHandler } = await import('../utils/tracking')
    await trackingEndpointHandler({
      fictionPublish,
      request: mockRequest,
      response: mockResponse,
    })

    // Verify tracking event was recorded
    expect(trackMock).toHaveBeenCalledWith(expect.objectContaining({
      orgId,
      event: 'emailOpened',
      value: 1,
      postId: testPost.postId,
      email: 'recipient@example.com',
      countryCode: 'US',
      regionName: 'CA',
      cityName: 'San Francisco',
    }))
  })

  it('should update email record with appropriate timestamps based on event type', async () => {
    const testPost = await getTestPost()
    const testContact = await createContact()

    // Create test email record
    const emailId = objectId({ prefix: 'cem' })
    await db().table(t.email).insert({
      emailId,
      postId: testPost.postId,
      orgId,
      contactId: testContact.contactId,
      email: testContact.email,
      status: 'sent',
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
    })

    // Create mock webhook requests for different event types
    const createWebhookRequest = (eventType: 'delivered' | 'opened' | 'clicked') => ({
      query: {},
      params: {},
      body: {
        signature: { token: 'test', timestamp: Date.now() / 1000, signature: 'test' },
        eventData: {
          id: `event-${eventType}`,
          timestamp: Date.now() / 1000,
          event: eventType,
          recipient: testContact.email,
          recipientDomain: 'example.com',
          userVariables: {
            fromOrgId: orgId,
            postId: testPost.postId,
            contactId: testContact.contactId,
            emailId, // Include emailId to target specific email record
            env: testUtils.fictionEnv.isProd.value ? 'prod' : 'dev',
          },
          logLevel: 'info',
          deliveryStatus: { attemptNo: 1 },
          envelope: {
            sender: 'sender@fiction.com',
            transport: 'smtp',
            targets: [testContact.email],
            sendingIp: '127.0.0.1',
          },
          message: {
            headers: {
              to: testContact.email,
              from: 'sender@fiction.com',
              subject: 'Test Subject',
              messageId: `message-${eventType}`,
            },
            size: 1024,
          },
        },
      },
    } as unknown as express.Request)

    const mockResponse = {
      send: vi.fn().mockReturnThis(),
      end: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as unknown as express.Response

    const { trackingEndpointHandler } = await import('../utils/tracking')

    // Process 'delivered' event
    await trackingEndpointHandler({
      fictionPublish,
      request: createWebhookRequest('delivered'),
      response: mockResponse,
    })

    // Verify email record updated with delivered timestamp
    let email = await db().table(t.email).where({ emailId }).first()
    expect(email.status).toBe('delivered')
    expect(email.deliveredAt).toBeTruthy()
    expect(email.openedAt).toBeFalsy()
    expect(email.clickedAt).toBeFalsy()

    // Process 'opened' event
    await trackingEndpointHandler({
      fictionPublish,
      request: createWebhookRequest('opened'),
      response: mockResponse,
    })

    // Verify email record updated with opened timestamp
    email = await db().table(t.email).where({ emailId }).first()
    expect(email.status).toBe('opened')
    expect(email.deliveredAt).toBeTruthy()
    expect(email.openedAt).toBeTruthy()
    expect(email.clickedAt).toBeFalsy()

    // Process 'clicked' event
    await trackingEndpointHandler({
      fictionPublish,
      request: createWebhookRequest('clicked'),
      response: mockResponse,
    })

    // Verify email record updated with clicked timestamp
    email = await db().table(t.email).where({ emailId }).first()
    expect(email.status).toBe('clicked')
    expect(email.deliveredAt).toBeTruthy()
    expect(email.openedAt).toBeTruthy()
    expect(email.clickedAt).toBeTruthy()
  })
})
