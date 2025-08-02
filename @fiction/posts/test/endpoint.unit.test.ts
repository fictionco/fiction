import type { TrackEventTypes } from '@fiction/analytics'
import type { ComplexDataFilter, DataFilter, EndpointMeta } from '@fiction/core'
import type { TablePostConfig } from '../schema'
import { dayjs } from '@fiction/core'
import { snap } from '@fiction/core/test-utils'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { FictionPosts } from '..'
import { getPostMetrics } from '../utils/analytics'

describe('post analytics tests', async () => {
  const testUtils = await createSiteTestUtils()
  const r = await testUtils.init()
  const userId = r?.user?.userId ?? ''
  const orgId = r?.org?.orgId ?? ''

  const fictionPosts = new FictionPosts(testUtils)

  afterAll(async () => {
    await testUtils.close()
  })

  it('tracks post analytics metrics correctly', async () => {
    // Create test posts
    const createPosts = async () => {
      const posts = [
        { title: 'title words', content: 'just three words', status: 'published' },
        { title: 'title words', content: 'just three words', status: 'published' },
      ] as const

      for (const post of posts) {
        await fictionPosts.queries.ManagePost.serve(
          { _action: 'create', fields: post, orgId, userId },
          { server: true },
        )
      }
    }

    await createPosts()

    const metrics = await getPostMetrics({ orgId, fictionPosts })

    expect(metrics.totalWords).toBe(10)
    expect(metrics).toMatchInlineSnapshot(`
      {
        "totalPostsCount": 2,
        "totalWords": 10,
      }
    `)

    const event = ['contentTotalWordsPosts'] satisfies (keyof TrackEventTypes)[]

    // Query analytics for post metrics
    const result = await testUtils.fictionAnalytics.queries.MetricAnalytics.serve({
      orgId,
      event,
      timeStartAtIso: dayjs().subtract(1, 'day').toISOString(),
      timeEndAtIso: dayjs().add(1, 'day').toISOString(),
      interval: 'day',
      handling: 'snapshot',
    }, { server: true })

    expect(result.status).toBe('success')

    expect(snap(result.data || {})).toMatchInlineSnapshot(`
      {
        "compare": [
          {
            "date": "[datetime:TRUTHY]",
            "value": "10",
          },
        ],
        "compareTotals": {
          "date": "[datetime:FALSY]",
          "value": "10",
        },
        "main": [
          {
            "date": "[datetime:TRUTHY]",
            "value": "10",
          },
        ],
        "mainTotals": {
          "date": "[datetime:FALSY]",
          "value": "10",
        },
        "params": {
          "compareEndAtIso": "[datetime:TRUTHY]",
          "compareStartAtIso": "[datetime:TRUTHY]",
          "event": [
            "contentTotalWordsPosts",
          ],
          "handling": "snapshot",
          "interval": "day",
          "nowIso": "[datetime:TRUTHY]",
          "orgId": "[id:TRUTHY]",
          "timeEndAtIso": "[datetime:TRUTHY]",
          "timeStartAtIso": "[datetime:TRUTHY]",
          "timeZone": "UTC",
        },
      }
    `)

    expect(result.data?.main?.[0].value).toBe(10)

    const posts = await fictionPosts.queries.ManagePost.serve({
      _action: 'list',
      where: { orgId },
      limit: 10,
    }, { server: true })

    const firstPost = posts.data?.[0]
    if (firstPost?.postId) {
      await fictionPosts.queries.ManagePost.serve({
        _action: 'update',
        where: { postId: firstPost.postId },
        fields: {
          content: 'Updated content with just six words',
        },
        orgId,
        userId,
      }, { server: true })
    }

    const metrics2 = await getPostMetrics({ orgId, fictionPosts })

    expect(metrics2).toMatchInlineSnapshot(`
      {
        "totalPostsCount": 2,
        "totalWords": 13,
      }
    `)

    // Query updated metrics
    const updatedResult = await testUtils.fictionAnalytics.queries.MetricAnalytics.serve({
      orgId,
      event: 'contentTotalWordsPosts' satisfies keyof TrackEventTypes,
      timeStartAtIso: dayjs().subtract(1, 'day').toISOString(),
      timeEndAtIso: dayjs().add(1, 'day').toISOString(),
      interval: 'day',
      handling: 'snapshot',
    }, { server: true })

    expect(updatedResult.status).toBe('success')

    expect(updatedResult.data?.main?.[0].value, 'analytics after updated').toBe(13)
  })

  it('handles deleted posts in analytics', async () => {
    // Create and then delete a post
    const createResponse = await fictionPosts.queries.ManagePost.serve({
      _action: 'create',
      fields: {
        title: 'Post Another',
        content: 'Just three words',
        status: 'published',
      },
      orgId,
      userId,
    }, { server: true })

    const postId = createResponse.data?.[0]?.postId
    if (!postId)
      throw new Error('Post creation failed')

    const metrics3 = await getPostMetrics({ orgId, fictionPosts })

    expect(metrics3).toMatchInlineSnapshot(`
      {
        "totalPostsCount": 3,
        "totalWords": 18,
      }
    `)

    const event = ['contentTotalWordsPosts'] satisfies (keyof TrackEventTypes)[]

    const initialMetrics = await testUtils.fictionAnalytics.queries.MetricAnalytics.serve({
      orgId,
      event,
      timeStartAtIso: dayjs().subtract(1, 'day').toISOString(),
      timeEndAtIso: dayjs().add(1, 'day').toISOString(),
      interval: 'day',
      handling: 'snapshot',
    }, { server: true })

    expect(initialMetrics.data?.main?.[0].value, 'added post to delete').toBe(18)

    // Delete the post
    await fictionPosts.queries.ManagePost.serve({
      _action: 'delete',
      where: { postId },
      orgId,
    }, { server: true })

    const metrics4 = await getPostMetrics({ orgId, fictionPosts })

    expect(metrics4).toMatchInlineSnapshot(`
      {
        "totalPostsCount": 2,
        "totalWords": 13,
      }
    `)

    const event2 = ['contentTotalWordsPosts'] satisfies (keyof TrackEventTypes)[]

    // Get updated metrics
    const updatedMetrics = await testUtils.fictionAnalytics.queries.MetricAnalytics.serve({
      orgId,
      event: event2,
      timeStartAtIso: dayjs().subtract(1, 'day').toISOString(),
      timeEndAtIso: dayjs().add(1, 'day').toISOString(),
      interval: 'day',
      handling: 'snapshot',
    }, { server: true })

    expect(updatedMetrics.data?.main?.[0].value, 'deleted added post').toBe(13)
  })
})

describe('post tests', async () => {
  const testUtils = await createSiteTestUtils()
  const { orgId, user } = await testUtils.init()
  const { userId = '' } = user
  const meta = { bearer: user } as EndpointMeta
  const fictionPosts = new FictionPosts(testUtils)
  let createdPost: TablePostConfig | undefined
  let secondPost: TablePostConfig | undefined

  beforeAll(async () => {
    // Create two posts for testing
    const createFirst = {
      _action: 'create' as const,
      fields: {
        title: 'First Test Post',
        content: 'Content of the first test post',
        status: 'published' as const,
      },
      orgId,
      userId,
    }
    const createSecond = {
      _action: 'create' as const,
      fields: {
        title: 'Second Test Post',
        content: 'Content of the second test post',
        status: 'draft' as const,
      },
      orgId,
      userId,
    }

    const resultFirst = await fictionPosts.queries.ManagePost.serve(createFirst, meta)
    const resultSecond = await fictionPosts.queries.ManagePost.serve(createSecond, meta)

    createdPost = resultFirst.data?.[0]
    secondPost = resultSecond.data?.[0]
  })

  afterAll(async () => {
    await testUtils.close()
  })

  it('lists posts correctly', async () => {
    const listParams = {
      _action: 'list' as const,
      where: { orgId },
      limit: 10,
      offset: 0,
      filters: [] as ComplexDataFilter[],
    }

    const result = await fictionPosts.queries.ManagePost.serve(listParams, { caller: 'testPostEndpointList' })

    expect(result.status).toBe('success')
    expect(result.data).toBeInstanceOf(Array)
    expect(result.data?.length).toBe(2)
    expect(result.indexMeta).toHaveProperty('count')
    expect(result.indexMeta?.count).toBe(2)
    expect(result.message).toBeFalsy()

    const [secondPost, firstPost] = result.data || []

    expect(firstPost?.title).toBe('First Test Post')
    expect(firstPost?.status).toBe('published')
    expect(secondPost?.title).toBe('Second Test Post')
    expect(secondPost?.status).toBe('draft')
  })

  it('filters posts correctly', async () => {
    const listParams = {
      _action: 'list' as const,
      limit: 10,
      offset: 0,
      filters: [[{ field: 'status', operator: '=', value: 'published' }]] as ComplexDataFilter[],
      where: { orgId },
    }

    const result = await fictionPosts.queries.ManagePost.serve(listParams, {})

    expect(result.status).toBe('success')
    expect(result.data).toBeInstanceOf(Array)
    expect(result.data?.length).toBe(1)
    expect(result.indexMeta?.count).toBe(1)

    const [publicPost] = result.data || []

    expect(publicPost?.title).toBe('First Test Post')
    expect(publicPost?.status).toBe('published')
  })

  it('sorts posts correctly', async () => {
    const listParams = {
      _action: 'list' as const,
      limit: 10,
      offset: 0,
      orderBy: 'title',
      order: 'desc' as const,
      where: { orgId },
    }

    const result = await fictionPosts.queries.ManagePost.serve(listParams, {})

    expect(result.status).toBe('success')
    expect(result.data).toBeInstanceOf(Array)
    expect(result.data?.length).toBe(2)

    const [firstPost, secondPost] = result.data || []

    expect(firstPost?.title).toBe('Second Test Post')
    expect(secondPost?.title).toBe('First Test Post')
  })

  it('paginates posts correctly', async () => {
    const listParamsFirstPage = {
      _action: 'list' as const,
      limit: 1,
      offset: 0,
      where: { orgId },
    }

    const resultFirstPage = await fictionPosts.queries.ManagePost.serve(listParamsFirstPage, {})

    expect(resultFirstPage.status).toBe('success')
    expect(resultFirstPage.data?.length).toBe(1)
    expect(resultFirstPage.indexMeta?.count).toBe(2)

    const listParamsSecondPage = {
      _action: 'list' as const,
      limit: 1,
      offset: 1,
      where: { orgId },
    }

    const resultSecondPage = await fictionPosts.queries.ManagePost.serve(listParamsSecondPage, {})

    expect(resultSecondPage.status).toBe('success')
    expect(resultSecondPage.data?.length).toBe(1)
    expect(resultSecondPage.indexMeta?.count).toBe(2)

    expect(resultFirstPage.data?.[0]?.postId).not.toBe(resultSecondPage.data?.[0]?.postId)
  })

  it('updates a post and reflects in list', async () => {
    const updateParams = {
      _action: 'update' as const,
      orgId,
      userId,
      where: { postId: createdPost?.postId || '' },
      fields: {
        title: 'Updated First Post',
        content: 'Updated content of the first post',
      },
    }

    await fictionPosts.queries.ManagePost.serve(updateParams, { ...meta, caller: 'testPostEndpointUpdate' })

    const listParams = {
      _action: 'list' as const,
      limit: 10,
      offset: 0,
      where: { orgId },
    }

    const result = await fictionPosts.queries.ManagePost.serve(listParams, {})

    expect(result.status).toBe('success')
    const updatedPost = result.data?.find(post => post.postId === createdPost?.postId)
    expect(updatedPost?.title).toBe('Updated First Post')
    expect(updatedPost?.content).toBe('Updated content of the first post')

    expect(updatedPost?.wordCount).toBe(9)
  })

  it('deletes a post and reflects in list', async () => {
    const deleteParams = {
      _action: 'delete' as const,
      where: { postId: secondPost?.postId || '' },
      orgId,
    }

    await fictionPosts.queries.ManagePost.serve(deleteParams, { ...meta, caller: 'testPostEndpointDelete' })

    const listParams = {
      _action: 'list' as const,
      limit: 10,
      offset: 0,
      where: { orgId },
    }

    const result = await fictionPosts.queries.ManagePost.serve(listParams, {})

    expect(result.status).toBe('success')
    expect(result.data?.length).toBe(1)
    expect(result.indexMeta?.count).toBe(1)
    expect(result.data?.[0]?.postId).toBe(createdPost?.postId)
  })

  // Add more tests here for other scenarios...
})

describe('post index tests', async () => {
  const testUtils = await createSiteTestUtils()
  const { orgId, user } = await testUtils.init()
  const meta = { bearer: user } as EndpointMeta
  const { userId = '' } = user
  const fictionPosts = new FictionPosts(testUtils)
  let createdPost: TablePostConfig | undefined
  afterAll(async () => {
    await testUtils.close()
  })

  it('lists posts correctly', async () => {
    const create = {
      _action: 'create',
      fields: {
        title: 'New Post',
        content: 'Content of the new post',
      },
      orgId,
      userId,
    } as const

    const r = await fictionPosts.queries.ManagePost.serve(create, { ...meta, caller: 'testListPostIndex' })
    createdPost = r.data?.[0]

    const listParams = {
      _action: 'list',
      where: { orgId },
      limit: 10,
      offset: 0,
      filters: [] as DataFilter[][],
    } as const

    const result = await fictionPosts.queries.ManagePost.serve(listParams, {})

    expect(result.status).toBe('success')
    expect(result.data).toBeInstanceOf(Array)
    expect(result.data?.length).toBe(1)
    expect(result.indexMeta).toHaveProperty('count')
    expect(result.indexMeta?.count).toBe(1)
    expect(result.message).toBeFalsy()

    const post = result.data?.[0]

    expect(post?.postId).toBe(createdPost?.postId)

    expect(post?.title).toBe(createdPost?.title)
    expect(post?.content).toBe(createdPost?.content)
    expect(post?.authors?.[0].userId).toBe(userId)
  })

  it('lists sites correctly with draft', async () => {
    const draftTitle = 'Draft Post'
    const update = {
      where: { postId: createdPost?.postId || '' },
      _action: 'saveDraft',
      fields: { title: draftTitle },
      orgId,
      userId,
    } as const

    await fictionPosts.queries.ManagePost.serve(update, { ...meta, caller: 'testListPostIndexDraft' })

    const listParams = { _action: 'list', where: { orgId }, loadDraft: true } as const

    const result = await fictionPosts.queries.ManagePost.serve(listParams, {})

    expect(result.status).toBe('success')
    expect(result.data).toBeInstanceOf(Array)
    expect(result.data?.length).toBe(1)

    const post = result.data?.[0]

    expect(post?.title).toBe(draftTitle)

    const listParams2 = { _action: 'list', where: { orgId }, loadDraft: false } as const

    const result2 = await fictionPosts.queries.ManagePost.serve(listParams2, { ...meta, caller: 'testListPostIndexDraft2' })

    const post2 = result2.data?.[0]

    expect(post2?.title).toBe(createdPost?.title)
  })

  it('deletes selected posts', async () => {
    const deleteParams = {
      _action: 'deletePosts' as const,
      selectedIds: [createdPost?.postId || ''],
      orgId,
      userId,
    }

    const deleteResult = await fictionPosts.queries.ManagePost.serve(deleteParams, { ...meta, caller: 'testDeleteSelectedPosts' })

    expect(deleteResult.status).toBe('success')
    expect(deleteResult.message).toMatchInlineSnapshot(`"Deleted 1 posts"`)
  })
})

describe('post crud tests', async () => {
  const testUtils = await createSiteTestUtils()
  const { orgId, user } = await testUtils.init()
  const meta = { bearer: user } as EndpointMeta
  const fictionPosts = new FictionPosts(testUtils)
  const userId = user.userId || ''
  let createdPost: TablePostConfig | undefined
  afterAll(async () => {
    await testUtils.close()
  })

  it('creates a post', async () => {
    const create = {
      _action: 'create',
      fields: {
        title: 'New Post',
        content: 'Content of the new post',
        // @ts-expect-error test
        media: { format: 'image', url: 'https://example.com/image.jpg', alt: null as undefined },
      },
      orgId,
      userId,
    } as const

    const result = await fictionPosts.queries.ManagePost.serve(create, { ...meta, caller: 'testCreatePost' })

    expect(result.status).toBe('success')
    createdPost = result.data?.[0]
    expect(createdPost?.title).toBe(create.fields.title)
    expect(createdPost?.content).toBe(create.fields.content)
    expect(createdPost?.status).toBe('draft')
    expect(createdPost?.orgId).toBe(orgId)
    expect(createdPost?.userId).toBe(userId)
    expect(createdPost?.postId).toBeTruthy()
    expect(createdPost?.createdAt).toBeTruthy()
    expect(createdPost?.updatedAt).toBeTruthy()
    expect(createdPost?.media?.format).toBe('image')
    expect(createdPost?.media?.url).toBe('https://example.com/image.jpg')
    expect(createdPost?.dateAt).toBeFalsy()
    expect(createdPost?.slug).toBe('new-post')

    expect(result.message).toBe('Post created')

    const create2 = {
      _action: 'create',
      fields: { title: 'New Post' },
      orgId,
      userId,
    } as const

    const result2 = await fictionPosts.queries.ManagePost.serve(create2, { ...meta, caller: 'testCreatePost2' })

    const createdPost2 = result2.data?.[0]

    expect(createdPost2?.slug).toBe(`new-post-1`)
  })

  it('updates a post', async () => {
    const update = {
      _action: 'update',
      orgId,
      userId,
      where: { postId: createdPost?.postId || '' },
      fields: {
        title: 'Updated Post',
        content: 'Updated content of the post',
        status: 'published',
        media: { format: 'video', url: 'https://example.com/video.mp4', alt: 'Image alt text' },
      },
    } as const

    const updateResult = await fictionPosts.queries.ManagePost.serve(update, { ...meta, caller: 'testUpdatePost' })

    const updatedPost = updateResult.data?.[0]

    expect(updateResult.status).toBe('success')
    expect(updatedPost?.title).toBe(update.fields.title)
    expect(updatedPost?.content).toBe(update.fields.content)
    expect(updateResult.message).toBe('Post updated')
    expect(updatedPost?.status).toBe('published')
    expect(updatedPost?.media?.format).toBe('video')
    expect(updatedPost?.media?.url).toBe('https://example.com/video.mp4')
    expect(updatedPost?.postId).toBe(update.where.postId)
    expect(dayjs(updatedPost?.dateAt).toISOString()).toStrictEqual(dayjs(updatedPost?.updatedAt).toISOString())
  })

  it('retrieves a post', async () => {
    const retrieve = {
      _action: 'get',
      where: {
        postId: createdPost?.postId || '',
        orgId: createdPost?.orgId || '',
      },

    } as const

    const retrieveResult = await fictionPosts.queries.ManagePost.serve(retrieve, {})

    expect(retrieveResult.status).toBe('success')

    const retrievedPost = retrieveResult.data?.[0]
    expect(retrievedPost?.postId).toBe(createdPost?.postId)
    expect(retrievedPost?.title).toBe('Updated Post')
    expect(retrieveResult.message).toBeFalsy()
  })

  it('saves draft', async () => {
    const newTitle = 'Draft Saved'
    const draftParams = {
      _action: 'saveDraft',
      where: { postId: createdPost?.postId || '' },
      fields: { ...createdPost, title: newTitle },
      orgId,
      userId,
    } as const

    const r = await fictionPosts.queries.ManagePost.serve(draftParams, { ...meta, caller: 'testSaveDraft' })
    const post = r.data?.[0]

    expect(r.status).toBe('success')
    expect(post?.title).toBe(newTitle)
  })

  it('deletes a post', async () => {
    const deleteAction = {
      _action: 'delete',
      where: { postId: createdPost?.postId || '' },
      orgId,
    } as const

    const deleteResult = await fictionPosts.queries.ManagePost.serve(deleteAction, { ...meta, caller: 'testDeletePost' })

    expect(deleteResult.status).toBe('success')
    expect(deleteResult.message).toBe('Post deleted')
  })

  it('tries to retrieve a non-existent post', async () => {
    const retrieve = {
      _action: 'get',
      where: { postId: 'nonexistent', orgId },
    } as const

    const retrieveResult = await fictionPosts.queries.ManagePost.serve(retrieve, {})

    const retrievedPost = retrieveResult.data?.[0]

    expect(retrieveResult).toMatchInlineSnapshot(`
      {
        "data": undefined,
        "status": "error",
      }
    `)
    expect(retrieveResult.status).toBe('error')
    expect(retrievedPost).toBe(undefined)
  })

  it('checks deletion of already deleted post', async () => {
    const deleteAgain = {
      _action: 'delete',
      where: { postId: createdPost?.postId || '' },
      orgId,
    } as const

    const deleteResult = await fictionPosts.queries.ManagePost.serve(deleteAgain, { ...meta, caller: 'testDeletePostAgain' })
    expect(deleteResult.status).toBe('error')
    expect(deleteResult.message).toBe('Post not found')
  })

  it('returns related posts when fetching a single post', async () => {
    // Create multiple posts with different dates to test navigation
    const posts = [
      {
        title: 'First Post',
        content: 'This is the first post content',
        status: 'published',
        dateAt: dayjs().subtract(2, 'days').toISOString(),
        categories: ['tech', 'news'],
      },
      {
        title: 'Second Post',
        content: 'This is the second post content',
        status: 'published',
        dateAt: dayjs().subtract(1, 'days').toISOString(),
        categories: ['tech', 'tutorial'],
      },
      {
        title: 'Third Post',
        content: 'This is the third post content',
        status: 'published',
        dateAt: dayjs().toISOString(),
        categories: ['tech', 'news'],
      },
    ] as Partial<TablePostConfig>[]

    const createdPosts: TablePostConfig[] = []

    // Create all posts
    for (const postData of posts) {
      const result = await fictionPosts.queries.ManagePost.serve({
        _action: 'create',
        fields: postData,
        orgId,
        userId,
      }, { ...meta, caller: 'testRelatedPosts' })
      expect(result.status).toBe('success')

      if (result.data?.[0]) {
        createdPosts.push(result.data[0])
      }
    }

    expect(createdPosts.length).toBe(3)

    // Get the middle post with related posts
    const retrieve = {
      _action: 'get',
      where: {
        postId: createdPosts[1].postId || '',
        orgId,
      },
    } as const

    const retrieveResult = await fictionPosts.queries.ManagePost.serve(retrieve, { ...meta, caller: 'testGetRelatedPosts' })
    expect(retrieveResult.status).toBe('success')

    const post = retrieveResult.data?.[0]
    expect(post).toBeTruthy()

    // Check related posts
    expect(post?.relatedPosts).toBeTruthy()

    // Next post should be the third one
    expect(post?.relatedPosts?.next?.postId).toBe(createdPosts[2].postId)
    expect(post?.relatedPosts?.next?.title).toBe('Third Post')

    // Previous post should be the first one
    expect(post?.relatedPosts?.prev?.postId).toBe(createdPosts[0].postId)
    expect(post?.relatedPosts?.prev?.title).toBe('First Post')

    // Similar posts should contain posts with matching categories
    expect(post?.relatedPosts?.similar?.length).toBeGreaterThan(0)

    // Verify that content is not included in related posts
    expect(post?.relatedPosts?.next?.content).toBeUndefined()
    expect(post?.relatedPosts?.prev?.content).toBeUndefined()

    // Clean up
    for (const post of createdPosts) {
      if (post.postId) {
        await fictionPosts.queries.ManagePost.serve({
          _action: 'delete',
          where: { postId: post.postId },
          orgId,
        }, { ...meta, caller: 'testCleanupRelatedPosts' })
      }
    }
  })
})
