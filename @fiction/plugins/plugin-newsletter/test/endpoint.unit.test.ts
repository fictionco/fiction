import type { EmailCampaignConfig } from '../schema'
import { abort, dayjs } from '@fiction/core'
import { createTestUser, getTestEmail } from '@fiction/core/test-utils'
import { FictionPosts } from '@fiction/posts'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { FictionNewsletter } from '..'
import { ManageSend } from '../endpoint.js'

describe('email send endpoint', async () => {
  const testUtils = await createSiteTestUtils()
  const fictionPosts = new FictionPosts(testUtils)
  const fictionNewsletter = new FictionNewsletter({ fictionPosts, ...testUtils })

  const initialized = await testUtils.init()

  const manageSend = new ManageSend({ ...testUtils, fictionPosts, fictionNewsletter })

  await manageSend.init({ crontab: '* * * * * *' })

  afterAll(async () => {
    await testUtils.close()
    manageSend.close()
  })

  const orgId = initialized.orgId
  const userId = initialized.user.userId

  const { user: user2 } = await createTestUser(testUtils.fictionUser)
  const userId2 = user2?.userId

  const { user: user3 } = await createTestUser(testUtils.fictionUser)
  const userId3 = user3?.userId

  const subscriberEmail = getTestEmail()

  await testUtils.fictionSubscribe.queries.ManageSubscription.serve({ _action: 'create', orgId, subscriber: { email: subscriberEmail } }, { server: true })

  if (!orgId || !userId || !userId2 || !userId3) {
    throw abort('missing orgId or userId')
  }

  let workingCampaigns: EmailCampaignConfig[] = []

  it('create', async () => {
    const r = await fictionNewsletter.queries.ManageCampaign.serve({
      _action: 'create',
      orgId,
      userId,
      fields: [{}, {}],
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(2)

    workingCampaigns = r.data as EmailCampaignConfig[]

    const p = r.data?.[0].post
    expect(r.data?.[0].orgId, 'orgId').toBe(orgId)
    expect(r.data?.[0].userId).toBe(userId)
    expect(r.indexMeta?.changedCount).toBe(2)
    expect(r.indexMeta?.count).toBe(2)
    expect(p?.postId).toBeTruthy()
    expect(p?.type).toBe('email')
    expect(p?.userId).toBe(userId)
    expect(r.message).toBeTruthy()
  })

  it('list/get', async () => {
    const r = await fictionNewsletter.queries.ManageCampaign.serve({ _action: 'list', orgId, userId }, { server: true })

    expect(r.status).toBe('success')

    expect(r.data?.length).toBe(2)
    const email = r.data?.[0]
    const p = email?.post
    expect(p?.postId).toBeTruthy()
    expect(r.indexMeta?.count).toBe(2)

    const r2 = await fictionNewsletter.queries.ManageCampaign.serve({ _action: 'get', orgId, userId, where: { campaignId: email?.campaignId } }, { server: true })

    expect(r2.status).toBe('success')
    expect(r2.data?.length).toBe(1)
    expect(r2.data?.[0].campaignId).toBe(email?.campaignId)
  })

  it('update', async () => {
    const em = workingCampaigns[0]
    const d = dayjs('2025-06-07T23:59:59Z')
    const r = await fictionNewsletter.queries.ManageCampaign.serve({
      _action: 'update',
      orgId,
      userId,
      where: [{ campaignId: em.campaignId }],
      fields: { scheduledAt: d.toISOString(), subject: 'Hello World', preview: 'Preview text' },
    }, { server: true })

    if (!r.data?.[0]) {
      throw new Error('missing data')
    }

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.indexMeta?.changedCount).toBe(1)
    expect(r.data?.[0].scheduledAt).toStrictEqual(d.toDate())
    expect(r.message).toBeTruthy()

    workingCampaigns[0] = r.data?.[0]
  })

  it('sendTest', async () => {
    const em = workingCampaigns[0]
    const validEmail1 = getTestEmail()
    const validEmail2 = getTestEmail()
    const testEmails = `${validEmail1}, ${validEmail2}, invalid-email, bad@format@test.com`

    const r = await fictionNewsletter.queries.ManageCampaign.serve({
      _action: 'sendTest',
      orgId,
      userId,
      where: { campaignId: em.campaignId },
      testEmails,
      maxEmails: 5,
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.data?.[0].campaignId).toBe(em.campaignId)
    expect(r.message).toMatchInlineSnapshot(`"Test emails sent. 2 had invalid format."`)
    expect(r.meta?.sentEmails).toEqual([validEmail1, validEmail2])
    expect(r.meta?.failedToSendEmails).toEqual([])
    expect(r.meta?.badlyFormattedEmails).toEqual(['invalid-email', 'bad@format@test.com'])

    // Test with too many emails
    const tooManyEmails = Array.from({ length: 6 }).fill(0).map(() => getTestEmail()).join(', ')
    const r2 = await fictionNewsletter.queries.ManageCampaign.serve({
      _action: 'sendTest',
      orgId,
      userId,
      where: { campaignId: em.campaignId },
      testEmails: tooManyEmails,
      maxEmails: 5,
    }, { server: true })

    expect(r2.status).toBe('error')
    expect(r2.message).toMatchInlineSnapshot('"Too many email addresses. Maximum allowed: 5"')

    // Test with all invalid emails
    const r3 = await fictionNewsletter.queries.ManageCampaign.serve({
      _action: 'sendTest',
      orgId,
      userId,
      where: { campaignId: em.campaignId },
      testEmails: 'invalid1, invalid2',
      maxEmails: 5,
    }, { server: true })

    expect(r3.status).toBe('error')
    expect(r3.message).toMatchInlineSnapshot('"No valid email addresses provided"')

    // Test with non-existent campaign
    const r4 = await fictionNewsletter.queries.ManageCampaign.serve({
      _action: 'sendTest',
      orgId,
      userId,
      where: { campaignId: 'non-existent-id' },
      testEmails: getTestEmail(),
      maxEmails: 5,
    }, { server: true })

    expect(r4.status).toBe('error')
    expect(r4.message).toMatchInlineSnapshot('"Campaign or organization not found"')
  })

  it('saveDraft', async () => {
    const em = workingCampaigns[0]
    const draftFields = {
      subject: 'Draft Subject',
      preview: 'Draft Preview',
      post: {
        title: 'Draft Post Title',
        content: 'Draft Post Content',
      },
    }

    const r = await fictionNewsletter.queries.ManageCampaign.serve({
      _action: 'saveDraft',
      orgId,
      userId,
      where: { campaignId: em.campaignId },
      fields: draftFields,
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)

    const savedCampaign = r.data?.[0]

    expect(savedCampaign?.subject).toBe(draftFields.subject)
    expect(savedCampaign?.preview).toBe(draftFields.preview)
    expect(savedCampaign?.post?.title).toBe(draftFields.post?.title)
    expect(savedCampaign?.post?.content).toBe(draftFields.post?.content)
    expect(savedCampaign?.draft).toBeUndefined()

    const r2 = await fictionNewsletter.queries.ManageCampaign.serve({
      _action: 'get',
      orgId,
      userId,
      where: { campaignId: em.campaignId },
      loadDraft: true,
    }, { server: true })

    const loadedDraft = r2.data?.[0]
    expect(loadedDraft?.subject).toBe(draftFields.subject)
    expect(loadedDraft?.preview).toBe(draftFields.preview)
    expect(loadedDraft?.post?.title).toBe(draftFields.post.title)
    expect(loadedDraft?.post?.content).toBe(draftFields.post.content)
    expect(loadedDraft?.draft).toBeUndefined()
  })

  it('revertDraft', async () => {
    const em = workingCampaigns[0]

    const r = await fictionNewsletter.queries.ManageCampaign.serve({
      _action: 'revertDraft',
      orgId,
      userId,
      where: { campaignId: em.campaignId },
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.data?.[0].draft).toBeUndefined()
    expect(r.message).toBe('Draft reverted successfully')

    // Verify that the main campaign data remains unchanged
    expect(r.data?.[0].subject).toBe(em.subject)
    expect(r.data?.[0].preview).toBe(em.preview)
    expect(r.data?.[0].post?.title).toBe(em.post?.title)
    expect(r.data?.[0].post?.content).toBe(em.post?.content)

    if (!r.data?.[0]) {
      throw new Error('missing data')
    }

    workingCampaigns[0] = r.data?.[0]
  })

  it('sends', async () => {
    const em = workingCampaigns[0]
    const r = await fictionNewsletter.queries.ManageCampaign.serve({ _action: 'send', orgId, userId, where: { campaignId: em.campaignId } }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.data?.[0].campaignId).toBe(workingCampaigns[0].campaignId)
    expect(r.message).toMatchInlineSnapshot(`"Email scheduled Jun 07, 2025 at 11:59 PM UTC"`)
    const em2 = workingCampaigns[1]

    await fictionNewsletter.queries.ManageCampaign.serve({ _action: 'update', orgId, userId, where: [{ campaignId: em2.campaignId }], fields: { scheduleMode: 'now', title: 'internal', subject: 'HELLO', preview: 'WORLD', post: { title: 'YO', content: 'LOREM' } } }, { server: true })

    const r3 = await fictionNewsletter.queries.ManageCampaign.serve({ _action: 'send', orgId, userId, where: { campaignId: em2.campaignId } }, { server: true })

    if (!r3.data?.[0])
      throw new Error('missing data')

    expect(r3.status).toBe('success')
    expect(r3.data?.length).toBe(1)
    expect(r3.data?.[0].campaignId).toBe(workingCampaigns[1].campaignId)
    expect(r3.message).toMatchInlineSnapshot(`"Email is being sent, check back soon."`)

    workingCampaigns[1] = r3.data?.[0]

    const sendEmailToSubscriberSpy = vi.spyOn(manageSend, 'sendEmailToSubscriber')

    const result = await manageSend.processCampaign(workingCampaigns[1])

    workingCampaigns[1] = result.data![0]

    expect(workingCampaigns[1].status).toBe('ready')
    expect(workingCampaigns[1].title).toMatchInlineSnapshot(`"internal"`)

    expect(sendEmailToSubscriberSpy).toHaveBeenCalledWith(expect.objectContaining({
      email: subscriberEmail,
      emailConfig: expect.objectContaining({
        subject: expect.any(String),
        bodyHtml: expect.any(String),
        fromName: expect.any(String),
        fromEmail: expect.any(String),
      }),
    }))

    expect(result.emailsSent).toBe(1)
  })

  it('delete', async () => {
    const em = workingCampaigns[0]
    const r = await fictionNewsletter.queries.ManageCampaign.serve({
      _action: 'delete',
      orgId,
      userId,
      where: [{ campaignId: em.campaignId }],
    }, { server: true })
    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.indexMeta?.changedCount).toBe(1)
    expect(r.indexMeta?.count).toBe(1)
    expect(r.message).toBeTruthy()
  })
})
