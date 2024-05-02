import { createTestUtils } from '@fiction/core/test-utils/init'

import { afterAll, describe, expect, it, vi } from 'vitest'
import type { DataFilter } from '@fiction/core'
import { FictionPosts } from '..'
import type { TablePostConfig } from '../schema'

describe('post index tests', async () => {
  const testUtils = createTestUtils()
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
    createdPost = r.data

    const listParams = {
      _action: 'list',
      orgId,
      limit: 10,
      offset: 0,
      filters: [] as DataFilter[],
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
  const testUtils = createTestUtils()
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
    createdPost = result.data
    expect(createdPost?.title).toBe(create.fields.title)
    expect(createdPost?.content).toBe(create.fields.content)
    expect(createdPost?.status).toBe('draft')
    expect(createdPost?.orgId).toBe(orgId)
    expect(createdPost?.userId).toBe(userId)
    expect(createdPost?.postId).toBeTruthy()
    expect(createdPost?.createdAt).toBeTruthy()
    expect(createdPost?.date).toBeFalsy()

    expect(result.message).toBe('Post created')
  })

  it('updates a post', async () => {
    const update = {
      _action: 'update',
      postId: createdPost?.postId || '',
      fields: {
        title: 'Updated Post',
        content: 'Updated content of the post',
        status: 'published',
      },
    } as const

    const updateResult = await fictionPosts.queries.ManagePost.serve(update, {})

    expect(updateResult.status).toBe('success')
    expect(updateResult.data?.title).toBe(update.fields.title)
    expect(updateResult.data?.content).toBe(update.fields.content)
    expect(updateResult.message).toBe('Post updated')
    expect(updateResult.data?.status).toBe('published')
    expect(updateResult.data?.postId).toBe(update.postId)
    expect(updateResult.data?.date).toStrictEqual(updateResult.data?.updatedAt)
  })

  it('retrieves a post', async () => {
    const retrieve = {
      _action: 'get',
      postId: createdPost?.postId || '',
    } as const

    const retrieveResult = await fictionPosts.queries.ManagePost.serve(retrieve, {})

    expect(retrieveResult.status).toBe('success')
    expect(retrieveResult.data?.postId).toBe(createdPost?.postId)
    expect(retrieveResult.data?.title).toBe('Updated Post')
    expect(retrieveResult.message).toBeFalsy()
  })

  it('deletes a post', async () => {
    const deleteAction = {
      _action: 'delete',
      postId: createdPost?.postId || '',
    } as const

    const deleteResult = await fictionPosts.queries.ManagePost.serve(deleteAction, {})

    expect(deleteResult.status).toBe('success')
    expect(deleteResult.message).toBe('Post deleted')
  })

  it('tries to retrieve a non-existent post', async () => {
    const retrieve = {
      _action: 'get',
      postId: 'nonexistent',
    } as const

    const retrieveResult = await fictionPosts.queries.ManagePost.serve(retrieve, {})

    expect(retrieveResult).toMatchInlineSnapshot(`
      {
        "code": "OPERATION_FAILED",
        "context": "QueryManagePost",
        "data": undefined,
        "expose": true,
        "httpStatus": 500,
        "location": undefined,
        "message": "Post not found",
        "status": "error",
      }
    `)
    expect(retrieveResult.status).toBe('error')
    expect(retrieveResult.message).toBe('Post not found')
  })

  it('checks deletion of already deleted post', async () => {
    const deleteAgain = {
      _action: 'delete',
      postId: createdPost?.postId || '',
    } as const

    const deleteResult = await fictionPosts.queries.ManagePost.serve(deleteAgain, {})
    expect(deleteResult.status).toBe('error')
    expect(deleteResult.message).toBe('Post not found')
  })
})
