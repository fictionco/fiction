import type { TablePostConfig } from '../schema'
import { type ComplexDataFilter, type DataFilter, dayjs, type EndpointMeta } from '@fiction/core'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { FictionPosts } from '..'

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

    const [publishedPost] = result.data || []

    expect(publishedPost?.title).toBe('First Test Post')
    expect(publishedPost?.status).toBe('published')
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
      _action: 'delete' as const,
      selectedIds: [createdPost?.postId || ''],
      orgId,
    }

    const deleteResult = await fictionPosts.queries.ManagePostIndex.serve(deleteParams, { ...meta, caller: 'testDeleteSelectedPosts' })

    expect(deleteResult.status).toBe('success')
    expect(deleteResult.message).toBe('Deleted successfully')
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
})
