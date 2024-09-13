import type { EmailCampaignConfig } from '../schema'
import { abort, dayjs } from '@fiction/core'
import { createTestUser, getTestEmail } from '@fiction/core/test-utils'
import { FictionPosts } from '@fiction/posts'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { FictionSend } from '..'
import { ManageSend } from '../endpoint.js'

describe('email send endpoint', async () => {
  const testUtils = await createSiteTestUtils()
  const fictionPosts = new FictionPosts(testUtils)
  const fictionSend = new FictionSend({ fictionPosts, ...testUtils })

  const initialized = await testUtils.init()

  const manageSend = new ManageSend({ ...testUtils, fictionPosts, fictionSend })

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

  await testUtils.fictionSubscribe.queries.ManageSubscription.serve({ _action: 'create', orgId, email: subscriberEmail }, { server: true })

  if (!orgId || !userId || !userId2 || !userId3) {
    throw abort('missing orgId or userId')
  }

  let workingCampaigns: EmailCampaignConfig[] = []

  it('create', async () => {
    const r = await fictionSend.queries.ManageCampaign.serve({
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
    const r = await fictionSend.queries.ManageCampaign.serve({ _action: 'list', orgId, userId }, { server: true })

    expect(r.status).toBe('success')

    expect(r.data?.length).toBe(2)
    const email = r.data?.[0]
    const p = email?.post
    expect(p?.postId).toBeTruthy()
    expect(r.indexMeta?.count).toBe(2)

    const r2 = await fictionSend.queries.ManageCampaign.serve({ _action: 'get', orgId, userId, where: { campaignId: email?.campaignId } }, { server: true })

    expect(r2.status).toBe('success')
    expect(r2.data?.length).toBe(1)
    expect(r2.data?.[0].campaignId).toBe(email?.campaignId)
  })

  it('update', async () => {
    const em = workingCampaigns[0]
    const d = dayjs('2025-06-07T23:59:59Z')
    const r = await fictionSend.queries.ManageCampaign.serve({
      _action: 'update',
      orgId,
      userId,
      where: [{ campaignId: em.campaignId }],
      fields: { scheduledAt: d.toISOString(), subject: 'Hello World', preview: 'Preview text' },
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.indexMeta?.changedCount).toBe(1)
    expect(r.data?.[0].scheduledAt).toStrictEqual(d.toDate())
    expect(r.message).toBeTruthy()
  })

  it('sends', async () => {
    const em = workingCampaigns[0]
    const r = await fictionSend.queries.ManageCampaign.serve({ _action: 'send', orgId, userId, where: { campaignId: em.campaignId } }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.data?.[0].campaignId).toBe(workingCampaigns[0].campaignId)
    expect(r.message).toMatchInlineSnapshot(`"Email scheduled Jun 07, 2025 at 11:59 PM UTC"`)
    const em2 = workingCampaigns[1]

    await fictionSend.queries.ManageCampaign.serve({ _action: 'update', orgId, userId, where: [{ campaignId: em2.campaignId }], fields: { scheduleMode: 'now', title: 'internal', subject: 'HELLO', preview: 'WORLD', post: { title: 'YO', content: 'LOREM' } } }, { server: true })

    const r3 = await fictionSend.queries.ManageCampaign.serve({ _action: 'send', orgId, userId, where: { campaignId: em2.campaignId } }, { server: true })

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
    const r = await fictionSend.queries.ManageCampaign.serve({
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
