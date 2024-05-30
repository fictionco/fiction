import { FictionAws, FictionMedia, abort } from '@fiction/core'
import { describe, expect, it } from 'vitest'
import { createTestUser } from '@fiction/core/test-utils'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { FictionSubscribe } from '..'

describe('createEmailVars', async () => {
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

  it('create', async () => {
    console.warn('c1')
    const r = await fictionSubscribe.queries.ManageSubscription.serve({
      _action: 'create',
      fields: { orgId, userId: userId2 },
    }, { server: true })

    const r2 = await fictionSubscribe.queries.ManageSubscription.serve({
      _action: 'create',
      fields: { orgId, userId: userId3 },
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)

    expect(r.data?.[0].orgId).toBe(orgId)
    expect(r.data?.[0].userId).toBe(userId2)
    console.warn('c2')

    expect(r2.status).toBe('success')
  })

  it('list', async () => {
    const r = await fictionSubscribe.queries.ManageSubscription.serve({
      _action: 'list',
      where: { orgId },
    }, { server: true })

    expect(r.status).toBe('success')

    expect(r.data?.length).toBe(2)
    expect(r.data?.map(_ => _.userId)).toStrictEqual([userId2, userId3])
    expect(r.data?.map(_ => _.status)).toStrictEqual(['active', 'active'])
  })

  it('update', async () => {
    const r = await fictionSubscribe.queries.ManageSubscription.serve({
      _action: 'update',
      where: { orgId, userId: userId2 },
      fields: { status: 'unsubscribed' },
    }, { server: true })
    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.data?.map(_ => _.userId)).toStrictEqual([userId2])
    expect(r.data?.map(_ => _.status)).toStrictEqual(['unsubscribed'])
  })

  it('delete', async () => {
    const r = await fictionSubscribe.queries.ManageSubscription.serve({
      _action: 'update',
      where: { orgId, userId: userId2 },
      fields: { status: 'unsubscribed' },
    }, { server: true })
    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
  })
})
