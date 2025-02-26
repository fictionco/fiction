import type { EmailSendConfig } from '@fiction/core'
import type express from 'express'
import type { CampaignStats } from '../send'
import { dayjs, objectId, shortId } from '@fiction/core'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { FictionPosts } from '..'
import { t } from '../schema'
import { FictionSend } from '../send'

describe('fictionSend', async () => {
  // Create test utils once at the beginning
  const testUtils = await createSiteTestUtils()

  // Initialize test environment and services
  const initialized = await testUtils.init()
  const orgId = initialized.orgId
  const userId = initialized.user.userId

  // Create required service instances that aren't included in testUtils
  const fictionPosts = new FictionPosts(testUtils)

  // Set up FictionSend instance
  const fictionSend = new FictionSend({ ...testUtils, fictionPosts })

  const db = () => testUtils.fictionDb.client()

  const getTestPost = async () => {
    const testPost = {
      postId: objectId({ prefix: 'pst' }),
      title: 'Test Campaign Email',
      content: '<p>Hello, this is a test email campaign!</p>',
      orgId,
      userId,
      status: 'draft',
      slug: 'test-campaign',
      emailConfig: {
        subject: 'Test Email Subject',
        preview: 'Test preview text',
      },
    }

    // Insert the test post into the database
    await db()
      .table(t.posts)
      .insert(testPost)

    return testPost
  }

  const createContact = async () => {
    const contactId = objectId({ prefix: 'cnt' })
    const contact = {
      contactId,
      email: `test-${shortId()}@example.com`,
      orgId,
      status: 'active',
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
    await fictionSend.queueCampaignEmails({
      postId: testPost.postId,
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

  it('should process queued emails and update stats', async () => {
    const testPost = await getTestPost()
    // Mock email sending
    const sendEmailMock = vi.fn().mockResolvedValue(undefined)
    fictionSend.settings.fictionEmail.sendEmail = sendEmailMock

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
    await fictionSend.processQueuedEmail({
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
    fictionSend.settings.fictionEmail.sendEmail = sendEmailMock

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
    await fictionSend.processQueuedEmail({
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
    const stats = await fictionSend.getCampaignStats({
      postId: testPost.postId,
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
    fictionSend.settings.fictionAnalytics.track = trackMock

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
      fictionSend,
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
})
