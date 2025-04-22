import type { EndpointMeta } from '@fiction/core'
import type { TableCommentConfig, TableLikeConfig, TablePostConfig } from '../schema'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { FictionPosts } from '..'

describe('post likes and comments tests', async () => {
  const testUtils = await createSiteTestUtils()
  const { orgId, user } = await testUtils.init()
  const { userId = '' } = user
  const meta = { bearer: user } as EndpointMeta
  const fictionPosts = new FictionPosts(testUtils)
  let post: TablePostConfig | undefined

  // Setup - create a test post for all tests
  beforeAll(async () => {
    const createPostParams = {
      _action: 'create' as const,
      fields: {
        title: 'Test Post for Likes and Comments',
        content: 'This is a test post that will receive likes and comments',
        status: 'published' as const,
      },
      orgId,
      userId,
    }

    const result = await fictionPosts.queries.ManagePost.serve(createPostParams, meta)
    post = result.data?.[0]

    if (!post?.postId) {
      throw new Error('Failed to create test post')
    }
  })

  afterAll(async () => {
    // Clean up the test post
    if (post?.postId) {
      await fictionPosts.queries.ManagePost.serve({
        _action: 'delete',
        where: { postId: post.postId },
        orgId,
      }, meta)
    }

    await testUtils.close()
  })

  describe('likes functionality', () => {
    it('allows a user to like a post', async () => {
      const likeParams = {
        _action: 'like' as const,
        where: {
          postId: post!.postId!,
          orgId,
        },
        userId,
      }

      const result = await fictionPosts.queries.PostLikes.serve(likeParams, meta)

      expect(result.status).toBe('success')
      expect(result.message).toBe('Post liked')
      expect(result.data).toHaveLength(1)
      expect(result.data?.[0].postId).toBe(post!.postId)
      expect(result.data?.[0].userId).toBe(userId)
      expect(result.meta?.likeCount).toBe(1)
    })

    it('prevents duplicate likes from the same user', async () => {
      const likeParams = {
        _action: 'like' as const,
        where: {
          postId: post!.postId!,
          orgId,
        },
        userId,
      }

      const result = await fictionPosts.queries.PostLikes.serve(likeParams, meta)

      expect(result.status).toBe('success')
      expect(result.message).toBe('Post already liked')
      expect(result.data).toHaveLength(0)
    })

    it('retrieves likes for a post', async () => {
      const getParams = {
        _action: 'getLikes' as const,
        where: {
          postId: post!.postId!,
          orgId,
        },
        limit: 10,
        offset: 0,
      }

      const result = await fictionPosts.queries.PostLikes.serve(getParams, meta)

      expect(result.status).toBe('success')
      expect(result.data).toHaveLength(1)

      const like = result.data?.[0] as TableLikeConfig
      expect(like.postId).toBe(post!.postId)
      expect(like.userId).toBe(userId)
      expect(like.user).toBeDefined()
      expect(like.user?.userId).toBe(userId)
      expect(like.user?.fullName).toBeDefined()
      expect(like.user?.email).toBeDefined()

      expect(result.indexMeta?.count).toBe(1)
      expect(result.indexMeta?.limit).toBe(10)
      expect(result.indexMeta?.offset).toBe(0)
    })

    it('allows a user to unlike a post', async () => {
      const unlikeParams = {
        _action: 'unlike' as const,
        where: {
          postId: post!.postId!,
          orgId,
        },
        userId,
      }

      const result = await fictionPosts.queries.PostLikes.serve(unlikeParams, meta)

      expect(result.status).toBe('success')
      expect(result.message).toBe('Post unliked')
      expect(result.data).toHaveLength(1)
      expect(result.data?.[0].postId).toBe(post!.postId)
      expect(result.data?.[0].userId).toBe(userId)
      expect(result.meta?.likeCount).toBe(0)
    })

    it('returns error when trying to unlike a post that was not liked', async () => {
      const unlikeParams = {
        _action: 'unlike' as const,
        where: {
          postId: post!.postId!,
          orgId,
        },
        userId,
      }

      const result = await fictionPosts.queries.PostLikes.serve(unlikeParams, meta)

      expect(result.status).toBe('error')
      expect(result.message).toBe('Like not found')
    })

    it('returns error when trying to like a non-existent post', async () => {
      const likeParams = {
        _action: 'like' as const,
        where: {
          postId: 'nonexistent-post-id',
          orgId,
        },
        userId,
      }

      const result = await fictionPosts.queries.PostLikes.serve(likeParams, meta)

      expect(result.status).toBe('error')
      expect(result.message).toBe('Post not found')
    })

    it('verifies like count is reflected in post data', async () => {
      // First, add a like
      await fictionPosts.queries.PostLikes.serve({
        _action: 'like',
        where: {
          postId: post!.postId!,
          orgId,
        },
        userId,
      }, meta)

      // Then check post data to ensure like count is included
      const getPostParams = {
        _action: 'get' as const,
        where: {
          postId: post!.postId!,
          orgId,
        },
      }

      const result = await fictionPosts.queries.ManagePost.serve(getPostParams, meta)

      expect(result.status).toBe('success')
      expect(result.data).toBeTruthy()
      expect(result.data).toHaveLength(1)
      expect(result.data?.[0].likeCount).toBe(1)
    })
  })

  describe('comments functionality', () => {
    let commentId: string | undefined
    let replyId: string | undefined

    it('allows a user to add a comment to a post', async () => {
      const commentParams = {
        _action: 'addComment' as const,
        where: {
          postId: post!.postId!,
          orgId,
        },
        userId,
        content: 'This is a test comment on the post.',
      }

      const result = await fictionPosts.queries.PostComments.serve(commentParams, meta)

      expect(result.status).toBe('success')
      expect(result.message).toBe('Comment added') // As org member, it should be auto-approved
      expect(result.data).toHaveLength(1)

      const comment = result.data?.[0] as TableCommentConfig
      expect(comment.postId).toBe(post!.postId)
      expect(comment.userId).toBe(userId)
      expect(comment.content).toBe(commentParams.content)
      expect(comment.status).toBe('approved')
      expect(comment.parentId).toBeNull()
      expect(comment.user).toBeDefined()
      expect(comment.user?.userId).toBe(userId)

      // Store the comment ID for subsequent tests
      commentId = comment.commentId

      expect(result.meta?.commentCount).toBe(1)
    })

    it('allows a user to add a reply to an existing comment', async () => {
      if (!commentId) {
        throw new Error('Comment ID not set from previous test')
      }

      const replyParams = {
        _action: 'addComment' as const,
        where: {
          postId: post!.postId!,
          orgId,
        },
        userId,
        content: 'This is a reply to the comment.',
        parentId: commentId,
      }

      const result = await fictionPosts.queries.PostComments.serve(replyParams, meta)

      expect(result.status).toBe('success')
      expect(result.message).toBe('Comment added')
      expect(result.data).toHaveLength(1)

      const reply = result.data?.[0] as TableCommentConfig
      expect(reply.postId).toBe(post!.postId)
      expect(reply.userId).toBe(userId)
      expect(reply.content).toBe(replyParams.content)
      expect(reply.status).toBe('approved')
      expect(reply.parentId).toBe(commentId)

      // Store the reply ID for subsequent tests
      replyId = reply.commentId

      expect(result.meta?.commentCount).toBe(2) // Total approved comments is now 2
    })

    it('retrieves top-level comments with reply counts', async () => {
      const getParams = {
        _action: 'getComments' as const,
        where: {
          postId: post!.postId!,
          orgId,
        },
        parentId: null, // Only get top-level comments
        limit: 10,
        offset: 0,
      }

      const result = await fictionPosts.queries.PostComments.serve(getParams, meta)

      expect(result.status).toBe('success')
      expect(result.data).toHaveLength(1) // Only one top-level comment

      const comment = result.data?.[0] as TableCommentConfig
      expect(comment.commentId).toBe(commentId)
      expect(comment.replyCount).toBe(1) // Should have one reply
      expect(comment.user).toBeDefined()
      expect(comment.user?.userId).toBe(userId)

      expect(result.indexMeta?.count).toBe(1) // Only one top-level comment
    })

    it('retrieves replies to a specific comment', async () => {
      if (!commentId) {
        throw new Error('Comment ID not set from previous test')
      }

      const getParams = {
        _action: 'getComments' as const,
        where: {
          postId: post!.postId!,
          orgId,
        },
        parentId: commentId, // Get replies to this comment
        limit: 10,
        offset: 0,
      }

      const result = await fictionPosts.queries.PostComments.serve(getParams, meta)

      expect(result.status).toBe('success')
      expect(result.data).toHaveLength(1) // One reply to the comment

      const reply = result.data?.[0] as TableCommentConfig
      expect(reply.commentId).toBe(replyId)
      expect(reply.parentId).toBe(commentId)
      expect(reply.user).toBeDefined()

      expect(result.indexMeta?.count).toBe(1) // One reply
    })

    it('allows a user to update their own comment', async () => {
      if (!commentId) {
        throw new Error('Comment ID not set from previous test')
      }

      const updateParams = {
        _action: 'updateComment' as const,
        where: {
          commentId,
          orgId,
        },
        userId,
        content: 'This is an updated comment content.',
      }

      const result = await fictionPosts.queries.PostComments.serve(updateParams, meta)

      expect(result.status).toBe('success')
      expect(result.message).toBe('Comment updated')
      expect(result.data).toHaveLength(1)

      const updatedComment = result.data?.[0] as TableCommentConfig
      expect(updatedComment.commentId).toBe(commentId)
      expect(updatedComment.content).toBe(updateParams.content)
      expect(updatedComment.user).toBeDefined()
    })

    it('allows a user to delete their own comment', async () => {
      if (!replyId) {
        throw new Error('Reply ID not set from previous test')
      }

      const deleteParams = {
        _action: 'deleteComment' as const,
        where: {
          commentId: replyId,
          orgId,
        },
        userId,
      }

      const result = await fictionPosts.queries.PostComments.serve(deleteParams, meta)

      expect(result.status).toBe('success')
      expect(result.message).toBe('Comment deleted')
      expect(result.data).toHaveLength(1)
      expect(result.meta?.commentCount).toBe(1) // Back to just one approved comment

      // Verify the comment is no longer retrievable (marked as trash, not physically deleted)
      const getParams = {
        _action: 'getComments' as const,
        where: {
          postId: post!.postId!,
          orgId,
        },
        parentId: commentId,
      }

      const checkResult = await fictionPosts.queries.PostComments.serve(getParams, meta)
      expect(checkResult.data).toHaveLength(0) // No approved replies
    })

    it('allows reporting a comment for moderation', async () => {
      if (!commentId) {
        throw new Error('Comment ID not set from previous test')
      }

      const reportParams = {
        _action: 'reportComment' as const,
        where: {
          commentId,
          orgId,
        },
        userId,
        reason: 'This comment is inappropriate.',
      }

      const result = await fictionPosts.queries.PostComments.serve(reportParams, meta)

      expect(result.status).toBe('success')
      expect(result.message).toBe('Comment reported and will be reviewed')

      // Verify the comment is no longer retrievable (marked as pending, not approved)
      const getParams = {
        _action: 'getComments' as const,
        where: {
          postId: post!.postId!,
          orgId,
        },
        parentId: null,
      }

      const checkResult = await fictionPosts.queries.PostComments.serve(getParams, meta)
      expect(checkResult.data).toHaveLength(0) // No approved comments
    })

    it('verifies comment count is reflected in post data', async () => {
      // Add a new comment to ensure there's an approved comment
      const commentParams = {
        _action: 'addComment' as const,
        where: {
          postId: post!.postId!,
          orgId,
        },
        userId,
        content: 'Another test comment for count verification.',
      }

      await fictionPosts.queries.PostComments.serve(commentParams, meta)

      // Then check post data to ensure comment count is included
      const getPostParams = {
        _action: 'get' as const,
        where: {
          postId: post!.postId!,
          orgId,
        },
      }

      const result = await fictionPosts.queries.ManagePost.serve(getPostParams, meta)

      expect(result.status).toBe('success')
      expect(result.data).toHaveLength(1)
      expect(result.data?.[0].commentCount).toBe(1) // The one new approved comment
    })
  })
})
