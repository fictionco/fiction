import { abort } from '@fiction/core'
import { describe, expect, it } from 'vitest'
import { createTestUser } from '@fiction/core/test-utils'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { FictionSubscribe } from '..'

describe('subscriptione endpoint', async () => {
  const testUtils = await createSiteTestUtils()

  const fictionSubscribe = new FictionSubscribe(testUtils)

  const initialized = await testUtils.init()

  const orgId = initialized.orgId
  const userId = initialized.user.userId

  const { user: user2 } = await createTestUser(testUtils.fictionUser)
  const userId2 = user2?.userId

  const { user: user3 } = await createTestUser(testUtils.fictionUser)
  const userId3 = user3?.userId

  if (!orgId || !userId || !userId2 || !userId3) {
    throw abort('missing orgId or userId')
  }

  it('bulk create subscriptions', async () => {
    const { user: bulkUser1 } = await createTestUser(testUtils.fictionUser)
    const { user: bulkUser2 } = await createTestUser(testUtils.fictionUser)

    if (!bulkUser2.email || !bulkUser1.userId)
      throw abort('missing bulkUser info')

    const bulkSubscribers = [
      { userId: bulkUser1.userId },
      { email: 'randomEmail@example.com' },
      { email: bulkUser2.email, fields: { level: 'test' } },
    ]

    const r = await fictionSubscribe.queries.ManageSubscription.serve({
      _action: 'bulkCreate',
      orgId,
      subscribers: bulkSubscribers,
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(3)

    const subscriberIds = r.data?.map(sub => sub.userId)
    expect(subscriberIds).toContain(bulkUser1.userId)
    expect(subscriberIds).toContain(bulkUser2.userId)

    await fictionSubscribe.queries.ManageSubscription.serve({
      _action: 'delete',
      orgId,
      where: [
        { userId: bulkUser1.userId },
        { email: 'randomEmail@example.com' },
        { email: bulkUser2.email },
      ],
    }, { server: true })
  })

  it('create', async () => {
    const r = await fictionSubscribe.queries.ManageSubscription.serve({
      _action: 'create',
      orgId,
      userId: userId2,
    }, { server: true })

    const r2 = await fictionSubscribe.queries.ManageSubscription.serve({
      _action: 'create',
      orgId,
      userId: userId3,
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)

    expect(r.data?.[0].orgId).toBe(orgId)
    expect(r.data?.[0].userId).toBe(userId2)

    expect(r2.status).toBe('success')
  })

  it('list', async () => {
    const r = await fictionSubscribe.queries.ManageSubscription.serve({ _action: 'list', orgId }, { server: true })

    expect(r.status).toBe('success')

    expect(r.data?.length).toBe(2)
    expect(r.data?.map(_ => _.userId)).toStrictEqual([userId3, userId2])
    expect(r.data?.map(_ => _.status)).toStrictEqual(['active', 'active'])
    expect(r.indexMeta?.count).toBe(2)

    const returnUser3 = r.data?.[0]

    expect(returnUser3?.user?.fullName).toBe(user3.fullName)
  })

  it('update', async () => {
    const r = await fictionSubscribe.queries.ManageSubscription.serve({
      _action: 'update',
      orgId,
      where: [{ userId: userId2 }],
      fields: { status: 'unsubscribed' },
    }, { server: true })
    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.data?.map(_ => _.userId)).toStrictEqual([userId2])
    expect(r.data?.map(_ => _.status)).toStrictEqual(['unsubscribed'])
    expect(r.indexMeta?.changedCount).toBe(1)
  })

  it('unsubscribe status', async () => {
    const r = await fictionSubscribe.queries.ManageSubscription.serve({
      _action: 'update',
      orgId,
      where: [{ userId: userId2 }],
      fields: { status: 'unsubscribed' },
    }, { server: true })
    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.indexMeta?.changedCount).toBe(1)
    expect(r.indexMeta?.count).toBe(2)
  })

  it('delete one', async () => {
    const r = await fictionSubscribe.queries.ManageSubscription.serve({
      _action: 'delete',
      orgId,
      where: [{ userId: userId2 }],
    }, { server: true })
    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.indexMeta?.changedCount).toBe(1)
    expect(r.indexMeta?.count).toBe(1)
  })
})
