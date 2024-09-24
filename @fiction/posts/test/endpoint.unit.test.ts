import type { title } from 'node:process'
import type { TablePostConfig } from '../schema'
import { type DataFilter, dayjs } from '@fiction/core'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, describe, expect, it } from 'vitest'
import { FictionPosts } from '..'

describe('post index tests', async () => {
  const testUtils = await createSiteTestUtils()
  const { orgId, user } = await testUtils.init()
  const { userId = '' } = user
  const fictionPosts = new FictionPosts(testUtils)
  let createdPost: TablePostConfig | undefined
  afterAll(async () => {
    await testUtils.close()
  })

  it('lists sites correctly', async () => {
    const create = {
      _action: 'create',
      fields: {
        title: 'New Post',
        content: 'Content of the new post',
      },
      orgId,
      userId,
    } as const

    const r = await fictionPosts.queries.ManagePost.serve(create, {})
    createdPost = r.data?.[0]

    const listParams = {
      _action: 'list',
      orgId,
      limit: 10,
      offset: 0,
      filters: [] as DataFilter[][],
    } as const

    const result = await fictionPosts.queries.ManagePostIndex.serve(listParams, {})

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

    await fictionPosts.queries.ManagePost.serve(update, {})

    const listParams = { _action: 'list', orgId, loadDraft: true } as const

    const result = await fictionPosts.queries.ManagePostIndex.serve(listParams, {})

    expect(result.status).toBe('success')
    expect(result.data).toBeInstanceOf(Array)
    expect(result.data?.length).toBe(1)

    const post = result.data?.[0]

    expect(post?.title).toBe(draftTitle)

    const listParams2 = { _action: 'list', orgId, loadDraft: false } as const

    const result2 = await fictionPosts.queries.ManagePostIndex.serve(listParams2, {})

    const post2 = result2.data?.[0]

    expect(post2?.title).toBe(createdPost?.title)
  })

  it('deletes selected posts', async () => {
    const deleteParams = {
      _action: 'delete' as const,
      selectedIds: [createdPost?.postId || ''],
      orgId,
    }

    const deleteResult = await fictionPosts.queries.ManagePostIndex.serve(deleteParams, {})

    expect(deleteResult.status).toBe('success')
    expect(deleteResult.message).toBe('Deleted successfully')
  })
})

describe('post crud tests', async () => {
  const testUtils = await createSiteTestUtils()
  const { orgId, user: { userId = '' } } = await testUtils.init()
  const fictionPosts = new FictionPosts(testUtils)
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
      },
      orgId,
      userId,
    } as const

    const result = await fictionPosts.queries.ManagePost.serve(create, {})

    expect(result.status).toBe('success')
    createdPost = result.data?.[0]
    expect(createdPost?.title).toBe(create.fields.title)
    expect(createdPost?.content).toBe(create.fields.content)
    expect(createdPost?.status).toBe('draft')
    expect(createdPost?.orgId).toBe(orgId)
    expect(createdPost?.userId).toBe(userId)
    expect(createdPost?.postId).toBeTruthy()
    expect(createdPost?.createdAt).toBeTruthy()
    expect(createdPost?.dateAt).toBeFalsy()
    expect(createdPost?.slug).toBe('new-post')

    expect(result.message).toBe('Post created')

    const create2 = {
      _action: 'create',
      fields: { title: 'New Post' },
      orgId,
      userId,
    } as const

    const result2 = await fictionPosts.queries.ManagePost.serve(create2, {})

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
      },
    } as const

    const updateResult = await fictionPosts.queries.ManagePost.serve(update, {})

    const updatedPost = updateResult.data?.[0]

    expect(updateResult.status).toBe('success')
    expect(updatedPost?.title).toBe(update.fields.title)
    expect(updatedPost?.content).toBe(update.fields.content)
    expect(updateResult.message).toBe('Post updated')
    expect(updatedPost?.status).toBe('published')
    expect(updatedPost?.postId).toBe(update.where.postId)
    expect(dayjs(updatedPost?.dateAt).toISOString()).toStrictEqual(dayjs(updatedPost?.updatedAt).toISOString())
  })

  it('retrieves a post', async () => {
    const retrieve = {
      _action: 'get',
      where: { postId: createdPost?.postId || '' },
      orgId: createdPost?.orgId || '',
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

    const r = await fictionPosts.queries.ManagePost.serve(draftParams, {})
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

    const deleteResult = await fictionPosts.queries.ManagePost.serve(deleteAction, {})

    expect(deleteResult.status).toBe('success')
    expect(deleteResult.message).toBe('Post deleted')
  })

  it('tries to retrieve a non-existent post', async () => {
    const retrieve = {
      _action: 'get',
      where: { postId: 'nonexistent' },
      orgId,
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

    const deleteResult = await fictionPosts.queries.ManagePost.serve(deleteAgain, {})
    expect(deleteResult.status).toBe('error')
    expect(deleteResult.message).toBe('Post not found')
  })
})
