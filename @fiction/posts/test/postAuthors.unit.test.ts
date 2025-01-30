import type { EndpointMeta } from '@fiction/core'
import type { ManagePostParams } from '../endpoint'
import { createTestUser } from '@fiction/core/test-utils/init'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, describe, expect, it } from 'vitest'
import { FictionPosts } from '..'

describe('taxonomy management tests', async () => {
  const testUtils = await createSiteTestUtils()
  const { orgId, user } = await testUtils.init()
  const { userId = '' } = user
  const fictionPosts = new FictionPosts(testUtils)

  const meta = { bearer: user } as EndpointMeta

  afterAll(async () => {
    await testUtils.close()
  })

  it('handles authors on a post', async () => {
    const createNoAuthors: ManagePostParams = {
      _action: 'create',
      fields: {
        title: 'Author Post',
        content: 'Content of the new post',
      },
      orgId,
      userId,
    } as const

    const res = await fictionPosts.queries.ManagePost.serve(createNoAuthors, meta)

    const post1 = res.data?.[0]
    expect(post1?.authors?.length).toBe(1)
    expect(post1?.authors?.[0].userId).toBe(userId)

    const { user: { userId: userId2 } = {} } = await createTestUser({ ...testUtils, caller: 'postAuthors' })

    const passedAuthors = [{ userId }, { userId: userId2 }]
    const create: ManagePostParams = {
      _action: 'create',
      fields: {
        title: 'Author Post',
        content: 'Content of the new post',
        authors: passedAuthors,
      },
      orgId,
      userId,
    } as const

    const r = await fictionPosts.queries.ManagePost.serve(create, meta)

    const post2 = r.data?.[0]

    expect(r.status).toBe('success')
    expect(post2).toBeInstanceOf(Object)
    expect(post2?.authors).toBeInstanceOf(Array)
    expect(post2?.authors?.length).toBe(2)
    expect(post2?.authors?.map(_ => _.userId).sort()).toStrictEqual([userId, userId2].sort())
  })
})
