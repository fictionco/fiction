import type { EndpointMeta } from '@fiction/core'
import type { TablePostConfig } from '../schema'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, describe, expect, it } from 'vitest'
import { FictionPosts } from '..'

describe('post revision tests', async () => {
  const testUtils = await createSiteTestUtils()
  const { orgId, user } = await testUtils.init()
  const userId = user.userId || ''
  const fictionPosts = new FictionPosts(testUtils)
  const meta = { bearer: user } as EndpointMeta

  afterAll(async () => {
    await testUtils.close()
  })

  const getRevisions = async (itemId: string) => {
    return testUtils.fictionRevision.queries.ManageRevision.serve({
      _action: 'list',
      where: { itemId },
      orgId,
      userId,
      caller: 'test-get-revisions',
    }, meta)
  }

  const createTestPost = async (config: Partial<TablePostConfig> = {}) => {
    const create = {
      _action: 'create' as const,
      fields: {
        title: 'Test Post',
        content: 'Initial content',
        ...config,
      },
      orgId,
      userId,
    }

    const result = await fictionPosts.queries.ManagePost.serve(create, { ...meta, caller: 'createTestPost' })
    return result.data?.[0]
  }

  // Test creation of revision on post publish
  it('should create revision when publishing post', async () => {
    const post = await createTestPost()
    if (!post?.postId)
      throw new Error('no post')

    // Update to published state
    const updateResult = await fictionPosts.queries.ManagePost.serve({
      _action: 'update',
      where: { postId: post.postId },
      fields: { status: 'published' },
      orgId,
      userId,
    }, meta)

    expect(updateResult.status).toBe('success')

    const revisions = await getRevisions(post.postId)
    expect(revisions.data?.length).toBeGreaterThan(0)
    expect(revisions.data?.[0].itemType).toBe('post')
  })

  // Test draft revision timing window
  it('should respect draft revision timing window', async () => {
    const post = await createTestPost()
    if (!post?.postId)
      throw new Error('no post')

    // First draft save
    const firstDraft = await fictionPosts.queries.ManagePost.serve({
      _action: 'saveDraft',
      where: { postId: post.postId },
      fields: { content: 'Updated content' },
      orgId,
      userId,
    }, meta)

    expect(firstDraft.status).toBe('success')

    // Immediate second draft save should not create new revision
    const secondDraft = await fictionPosts.queries.ManagePost.serve({
      _action: 'saveDraft',
      where: { postId: post.postId },
      fields: { content: 'Another update' },
      orgId,
      userId,
    }, meta)

    const revisions = await getRevisions(post.postId)
    expect(revisions.data?.length).toBe(1) // Only one revision despite two saves
  })

  // Test revision restoration
  it('should restore post from revision', async () => {
    const post = await createTestPost()

    if (!post?.postId)
      throw new Error('no post')

    // Create initial revision by publishing
    await fictionPosts.queries.ManagePost.serve({
      _action: 'update',
      where: { postId: post.postId },
      fields: { status: 'published' },
      orgId,
      userId,
    }, meta)

    // Get initial revision
    const initialRevisions = await getRevisions(post.postId)
    const initialRevisionId = initialRevisions.data?.[0].revisionId

    if (!initialRevisionId)
      throw new Error('no initial revision')

    // Make an update
    await fictionPosts.queries.ManagePost.serve({
      _action: 'update',
      where: { postId: post.postId },
      fields: { content: 'Updated content' },
      orgId,
      userId,
    }, meta)

    // Restore from initial revision
    const restoreResult = await fictionPosts.queries.ManagePost.serve({
      _action: 'restoreFromRevision',
      where: { postId: post.postId },
      revisionId: initialRevisionId,
      orgId,
      userId,
    }, meta)

    expect(restoreResult.status).toBe('success')
    expect(restoreResult.data?.[0].content).toBe('Initial content')
  })

  // Test revision data integrity
  it('should maintain correct data in revisions', async () => {
    const post = await createTestPost()

    if (!post?.postId)
      throw new Error('no post')

    const updateData = {
      title: 'Updated Title',
      content: 'Updated content',
      status: 'published' as const,
    }

    // Make the update
    await fictionPosts.queries.ManagePost.serve({
      _action: 'update',
      where: { postId: post.postId },
      fields: updateData,
      orgId,
      userId,
    }, meta)

    // Get revisions and check the data
    const revisions = await getRevisions(post.postId)
    const revisionData = revisions.data?.[0].itemData as TablePostConfig

    // Check each field individually
    expect(revisionData.title).toBe(updateData.title)
    expect(revisionData.content).toBe(updateData.content)
    expect(revisionData.status).toBe(updateData.status)
  })
})
