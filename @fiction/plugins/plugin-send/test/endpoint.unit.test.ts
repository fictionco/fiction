import { abort } from '@fiction/core'
import { describe, expect, it } from 'vitest'
import { createTestUser } from '@fiction/core/test-utils'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { FictionPosts } from '@fiction/plugin-posts'
import { FictionSend } from '..'

describe('email send endpoint', async () => {
  const testUtils = await createSiteTestUtils()
  const fictionPosts = new FictionPosts(testUtils)
  const fictionSend = new FictionSend({ fictionPosts, ...testUtils })

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
    const r = await fictionSend.queries.ManageSend.serve({
      _action: 'create',
      orgId,
      userId,
      fields: { },
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)

    const p = r.data?.[0].post
    expect(r.data?.[0].orgId, 'orgId').toBe(orgId)
    expect(r.data?.[0].userId).toBe(userId)
    expect(r.indexMeta?.changedCount).toBe(1)
    expect(r.indexMeta?.count).toBe(1)
    expect(p?.postId).toBeTruthy()
    expect(p?.type).toBe('email')
    expect(p?.userId).toBe(userId)
  })

  it('list', async () => {
    const r = await fictionSend.queries.ManageSend.serve({ _action: 'list', orgId, userId }, { server: true })

    expect(r.status).toBe('success')

    expect(r.data?.length).toBe(1)
    const p = r.data?.[0].post
    expect(p?.postId).toBeTruthy()
    expect(r.indexMeta?.count).toBe(1)
  })

  // it('update', async () => {
  //   const r = await fictionSubscribe.queries.ManageSubscription.serve({
  //     _action: 'update',
  //     orgId,
  //     where: [{ userId: userId2 }],
  //     fields: { status: 'unsubscribed' },
  //   }, { server: true })
  //   expect(r.status).toBe('success')
  //   expect(r.data?.length).toBe(1)
  //   expect(r.data?.map(_ => _.userId)).toStrictEqual([userId2])
  //   expect(r.data?.map(_ => _.status)).toStrictEqual(['unsubscribed'])
  //   expect(r.indexMeta?.changedCount).toBe(1)
  // })

  // it('unsubscribe status', async () => {
  //   const r = await fictionSubscribe.queries.ManageSubscription.serve({
  //     _action: 'update',
  //     orgId,
  //     where: [{ userId: userId2 }],
  //     fields: { status: 'unsubscribed' },
  //   }, { server: true })
  //   expect(r.status).toBe('success')
  //   expect(r.data?.length).toBe(1)
  //   expect(r.indexMeta?.changedCount).toBe(1)
  //   expect(r.indexMeta?.count).toBe(2)
  // })

  // it('delete one', async () => {
  //   const r = await fictionSubscribe.queries.ManageSubscription.serve({
  //     _action: 'delete',
  //     orgId,
  //     where: [{ userId: userId2 }],
  //   }, { server: true })
  //   expect(r.status).toBe('success')
  //   expect(r.data?.length).toBe(1)
  //   expect(r.indexMeta?.changedCount).toBe(1)
  //   expect(r.indexMeta?.count).toBe(1)
  // })
})
