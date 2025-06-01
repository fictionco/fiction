import type { EndpointMeta } from '@fiction/core'
import type { TablePostConfig } from '../schema'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { FictionPosts } from '..'

describe('post view tracking tests', async () => {
  const testUtils = await createSiteTestUtils()
  const { orgId, user } = await testUtils.init()
  const { userId = '' } = user
  const meta = { bearer: user } as EndpointMeta
  const fictionPosts = new FictionPosts(testUtils)
  let post: TablePostConfig | undefined

  beforeAll(async () => {
    const result = await fictionPosts.queries.ManagePost.serve({
      _action: 'create',
      fields: {
        title: 'Test Post for Views',
        content: 'Content for view tracking test',
        status: 'published',
      },
      orgId,
      userId,
    }, meta)
    post = result.data?.[0]
  })

  afterAll(async () => {
    await testUtils.close()
  })

  it('tracks post views correctly', async () => {
    if (!post?.postId)
      throw new Error('Post not created')

    // Track a view
    const viewResult = await fictionPosts.queries.ManagePost.serve({
      _action: 'view',
      where: { postId: post.postId, orgId },
    }, meta)

    expect(viewResult.status).toBe('success')

    // Verify view count incremented
    const getResult = await fictionPosts.queries.ManagePost.serve({
      _action: 'get',
      where: { postId: post.postId, orgId },
    }, meta)

    expect(getResult.data?.[0]?.viewCount).toBe(1)

    // Track another view
    await fictionPosts.queries.ManagePost.serve({
      _action: 'view',
      where: { postId: post.postId, orgId },
    }, meta)

    // Verify count increased
    const getResult2 = await fictionPosts.queries.ManagePost.serve({
      _action: 'get',
      where: { postId: post.postId, orgId },
    }, meta)

    expect(getResult2.data?.[0]?.viewCount).toBe(2)
  })
})
