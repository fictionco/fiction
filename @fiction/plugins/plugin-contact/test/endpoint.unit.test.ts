import { abort } from '@fiction/core'
import { createTestUser } from '@fiction/core/test-utils'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, describe, expect, it } from 'vitest'
import { FictionContact } from '..'

describe('subscription endpoint', async () => {
  const testUtils = await createSiteTestUtils()

  const fictionContact = new FictionContact(testUtils)

  const initialized = await testUtils.init()

  afterAll(() => testUtils.close())

  const orgId = initialized.orgId
  const userId = initialized.user.userId

  const { user: user2 } = await createTestUser({ ...testUtils, caller: 'subscriptionTest1' })
  const userId2 = user2?.userId

  const { user: user3 } = await createTestUser({ ...testUtils, caller: 'subscriptionTest2' })
  const userId3 = user3?.userId

  if (!orgId || !userId || !userId2 || !userId3) {
    throw abort('missing orgId or userId')
  }

  it('bulk create subscriptions', async () => {
    const { user: bulkUser1 } = await createTestUser({ ...testUtils, caller: 'subscriptionTest3' })
    const { user: bulkUser2 } = await createTestUser({ ...testUtils, caller: 'subscriptionTest4' })

    if (!bulkUser2.email || !bulkUser1.userId)
      throw abort('missing bulkUser info')

    const bulkSubscribers = [
      { userId: bulkUser1.userId },
      { email: 'randomEmail@example.com' },
      { email: bulkUser2.email, fields: { level: 'test' } },
    ]

    const r = await fictionContact.queries.ManageContact.serve({
      _action: 'bulkCreate',
      orgId,
      contacts: bulkSubscribers,
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(3)

    const contactIds = r.data?.map(sub => sub.userId)
    expect(contactIds).toContain(bulkUser1.userId)
    expect(contactIds).toContain(bulkUser2.userId)

    await fictionContact.queries.ManageContact.serve({
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
    const r = await fictionContact.queries.ManageContact.serve({
      _action: 'create',
      orgId,
      contact: { userId: userId2 },
    }, { server: true })

    const r2 = await fictionContact.queries.ManageContact.serve({
      _action: 'create',
      orgId,
      contact: { userId: userId3 },
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)

    expect(r.data?.[0].orgId).toBe(orgId)
    expect(r.data?.[0].userId).toBe(userId2)

    expect(r2.status).toBe('success')
  })

  it('list', async () => {
    const r = await fictionContact.queries.ManageContact.serve({ _action: 'list', orgId }, { server: true })

    expect(r.status).toBe('success')

    expect(r.data?.length).toBe(2)
    expect(r.data?.map(_ => _.userId)).toStrictEqual([userId3, userId2])
    expect(r.data?.map(_ => _.status)).toStrictEqual(['active', 'active'])
    expect(r.indexMeta?.count).toBe(2)

    const returnUser3 = r.data?.[0]

    expect(returnUser3?.user?.fullName).toBe(user3.fullName)
  })

  it('update', async () => {
    const r = await fictionContact.queries.ManageContact.serve({
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
    const r = await fictionContact.queries.ManageContact.serve({
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

  it('current contact without update', async () => {
    const r = await fictionContact.queries.ManageContact.serve({
      _action: 'current',
      targetOrgId: orgId,
      userId: userId3,
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.data?.[0]?.userId).toBe(userId3)
    expect(r.data?.[0]?.status).toBe('active')
  })

  it('current contact with update fields', async () => {
    // Update contact through current action (self-service)
    const r = await fictionContact.queries.ManageContact.serve({
      _action: 'current',
      targetOrgId: orgId,
      userId: userId3,
      fields: { status: 'unsubscribed', level: 'premium' },
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.data?.[0]?.userId).toBe(userId3)
    expect(r.data?.[0]?.status).toBe('unsubscribed')
    expect(r.data?.[0]?.level).toBe('premium')

    // Verify the update persisted
    const r2 = await fictionContact.queries.ManageContact.serve({
      _action: 'current',
      targetOrgId: orgId,
      userId: userId3,
    }, { server: true })

    expect(r2.status).toBe('success')
    expect(r2.data?.[0]?.status).toBe('unsubscribed')
    expect(r2.data?.[0]?.level).toBe('premium')
  })

  it('current contact resubscribe', async () => {
    // Contact can resubscribe themselves
    const r = await fictionContact.queries.ManageContact.serve({
      _action: 'current',
      targetOrgId: orgId,
      userId: userId3,
      fields: { status: 'active' },
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.[0]?.status).toBe('active')
  })

  it('current contact with missing targetOrgId', async () => {
    // @ts-expect-error test
    const r = await fictionContact.queries.ManageContact.serve({
      _action: 'current',
      userId: userId3,
    }, { server: true })

    expect(r.status).toBe('error')
    expect(r.message).toBe('Missing targetOrgId')
  })

  it('current contact with no userId', async () => {
    const r = await fictionContact.queries.ManageContact.serve({
      _action: 'current',
      targetOrgId: orgId,
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data).toBeUndefined()
  })

  it('delete one', async () => {
    const r = await fictionContact.queries.ManageContact.serve({
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
