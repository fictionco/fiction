import { abort, dayjs } from '@fiction/core'
import { describe, expect, it } from 'vitest'
import { createTestUser } from '@fiction/core/test-utils'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { FictionPosts } from '@fiction/plugin-posts'
import { FictionSend } from '..'
import type { EmailSendConfig } from '../schema'

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

  let workingEmails: EmailSendConfig[] = []

  it('create', async () => {
    const r = await fictionSend.queries.ManageSend.serve({
      _action: 'create',
      orgId,
      userId,
      fields: [{}, {}],
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(2)

    workingEmails = r.data as EmailSendConfig[]

    const p = r.data?.[0].post
    expect(r.data?.[0].orgId, 'orgId').toBe(orgId)
    expect(r.data?.[0].userId).toBe(userId)
    expect(r.indexMeta?.changedCount).toBe(2)
    expect(r.indexMeta?.count).toBe(2)
    expect(p?.postId).toBeTruthy()
    expect(p?.type).toBe('email')
    expect(p?.userId).toBe(userId)
  })

  it('list/get', async () => {
    const r = await fictionSend.queries.ManageSend.serve({ _action: 'list', orgId, userId }, { server: true })

    expect(r.status).toBe('success')

    expect(r.data?.length).toBe(2)
    const email = r.data?.[0]
    const p = email?.post
    expect(p?.postId).toBeTruthy()
    expect(r.indexMeta?.count).toBe(2)

    const r2 = await fictionSend.queries.ManageSend.serve({ _action: 'get', orgId, userId, where: { emailId: email?.emailId } }, { server: true })

    expect(r2.status).toBe('success')
    expect(r2.data?.length).toBe(1)
    expect(r2.data?.[0].emailId).toBe(email?.emailId)
  })

  it('update', async () => {
    const em = workingEmails[0]
    const d = dayjs('2025-06-07T23:59:59Z')
    const r = await fictionSend.queries.ManageSend.serve({
      _action: 'update',
      orgId,
      userId,
      where: [{ emailId: em.emailId }],
      fields: { scheduledAt: d.toISOString() },
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.indexMeta?.changedCount).toBe(1)
    expect(r.data?.[0].scheduledAt).toStrictEqual(d.toDate())
  })

  it('delete', async () => {
    const em = workingEmails[0]
    const r = await fictionSend.queries.ManageSend.serve({
      _action: 'delete',
      orgId,
      userId,
      where: [{ emailId: em.emailId }],
    }, { server: true })
    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.indexMeta?.changedCount).toBe(1)
    expect(r.indexMeta?.count).toBe(1)
  })
})
