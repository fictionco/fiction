import type { EndpointMeta, EndpointResponse } from '@fiction/core'
import type { TableCommentConfig, TableLikeConfig } from './schema'
import { abort } from '@fiction/core'
import { PostsQuery } from './endpoint'
import { t } from './schema'

export type LikePostParamsRequest =
  | { _action: 'like', where: { postId: string, orgId: string }, userId?: string }
  | { _action: 'unlike', where: { postId: string, orgId: string }, userId?: string }
  | { _action: 'getLikes', where: { postId: string, orgId: string }, limit?: number, offset?: number, userId?: string }

export class QueryPostLikes extends PostsQuery {
  async run(params: LikePostParamsRequest, meta: EndpointMeta): Promise<EndpointResponse<TableLikeConfig[]>> {
    // Get userId from bearer token if available and not explicitly provided
    const userId = params.userId || meta.bearer?.userId

    // Ensure userId exists for actions that require it
    if (['like', 'unlike'].includes(params._action) && !userId) {
      throw abort('Authentication required for this action', meta)
    }

    switch (params._action) {
      case 'like':
        return this.likePost({ ...params, userId: userId! }, meta)
      case 'unlike':
        return this.unlikePost({ ...params, userId: userId! }, meta)
      case 'getLikes':
        return this.getLikes(params, meta)
      default:
        return { status: 'error', message: 'Invalid action' }
    }
  }

  private async likePost(
    params: LikePostParamsRequest & { _action: 'like', userId: string },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<TableLikeConfig[]>> {
    const { where: { postId, orgId }, userId } = params
    const db = this.db()

    // Verify the post exists
    const post = await db.select('postId').from(t.posts).where({ postId, orgId }).first()
    if (!post) {
      return { status: 'error', message: 'Post not found' }
    }

    // Check if the user already liked this post
    const existingLike = await db
      .select('likeId')
      .from(t.postLikes)
      .where({ postId, userId })
      .first()

    if (existingLike) {
      return { status: 'success', data: [] }
    }

    // Create the like
    const [like] = await db(t.postLikes)
      .insert({ postId, userId, orgId })
      .returning('*')

    // Get updated like count
    const countResult = await db
      .count('* as count')
      .from(t.postLikes)
      .where({ postId })
      .first()

    const likeCount = Number.parseInt(countResult?.count?.toString() || '0', 10)

    // Update the post's like count
    await db(t.posts)
      .where({ postId })
      .update({ likeCount })

    return {
      status: 'success',
      message: 'Post liked',
      data: [like],
      meta: {
        likeCount,
      },
    }
  }

  private async unlikePost(
    params: LikePostParamsRequest & { _action: 'unlike', userId: string },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<TableLikeConfig[]>> {
    const { where: { postId, orgId }, userId } = params
    const db = this.db()

    // Verify the post exists
    const post = await db.select('postId').from(t.posts).where({ postId, orgId }).first()
    if (!post) {
      return { status: 'error', message: 'Post not found' }
    }

    // Delete the like if it exists
    const deleted = await db(t.postLikes)
      .where({ postId, userId })
      .delete()
      .returning('*')

    if (!deleted || deleted.length === 0) {
      return { status: 'success' }
    }

    // Get updated like count
    const countResult = await db
      .count('* as count')
      .from(t.postLikes)
      .where({ postId })
      .first()

    const likeCount = Number.parseInt(countResult?.count?.toString() || '0', 10)

    // Update the post's like count
    await db(t.posts)
      .where({ postId })
      .update({ likeCount })

    return {
      status: 'success',
      data: deleted,
      meta: {
        likeCount,
      },
    }
  }

  private async getLikes(
    params: LikePostParamsRequest & { _action: 'getLikes' },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<TableLikeConfig[]>> {
    const { where: { postId, orgId }, limit = 50, offset = 0 } = params
    const db = this.db()

    // Verify the post exists
    const post = await db.select('postId', 'visibility').from(t.posts).where({ postId, orgId }).first()
    if (!post) {
      return { status: 'error', message: 'Post not found' }
    }

    // If post is private, verify user is authorized
    if (post.visibility === 'private' && !_meta.bearer?.orgs?.some(org => org.orgId === orgId)) {
      return { status: 'error', message: 'Unauthorized access to post likes', httpStatus: 403 }
    }

    // Get likes with user data
    const likes = await db
      .select([
        `${t.postLikes}.*`,
        `${t.user}.email`,
        `${t.user}.fullName`,
        `${t.user}.avatar`,
      ])
      .from(t.postLikes)
      .join(t.user, `${t.postLikes}.userId`, '=', `${t.user}.userId`)
      .where(`${t.postLikes}.postId`, postId)
      .orderBy(`${t.postLikes}.createdAt`, 'desc')
      .limit(limit)
      .offset(offset)

    // Count total likes
    const countResult = await db
      .count('* as count')
      .from(t.postLikes)
      .where({ postId })
      .first()

    const totalCount = Number.parseInt(countResult?.count?.toString() || '0', 10)

    // Format the likes to include user data
    const formattedLikes = likes.map((like) => {
      const { email, fullName, avatar, ...likeData } = like
      return {
        ...likeData,
        user: { userId: like.userId, email, fullName, avatar },
      }
    })

    return {
      status: 'success',
      data: formattedLikes,
      indexMeta: {
        count: totalCount,
        limit,
        offset,
      },
    }
  }
}

export type CommentPostParamsRequest =
  | { _action: 'addComment', where: { postId: string, orgId: string }, userId?: string, content: string, parentId?: string }
  | { _action: 'getComments', where: { postId: string, orgId: string }, limit?: number, offset?: number, parentId?: string | null, userId?: string }
  | { _action: 'updateComment', where: { commentId: string, orgId: string }, userId?: string, content: string }
  | { _action: 'deleteComment', where: { commentId: string, orgId: string }, userId?: string }
  | { _action: 'reportComment', where: { commentId: string, orgId: string }, userId?: string, reason: string }

export class QueryPostComments extends PostsQuery {
  async run(params: CommentPostParamsRequest, meta: EndpointMeta): Promise<EndpointResponse<TableCommentConfig[]>> {
    // Get userId from bearer token if available and not explicitly provided
    const userId = params.userId || meta.bearer?.userId

    // Ensure userId exists for actions that require it
    if (['addComment', 'updateComment', 'deleteComment', 'reportComment'].includes(params._action) && !userId) {
      throw abort('Authentication required for this action', meta)
    }

    switch (params._action) {
      case 'addComment':
        return this.addComment({ ...params, userId: userId! }, meta)
      case 'getComments':
        return this.getComments(params, meta)
      case 'updateComment':
        return this.updateComment({ ...params, userId: userId! }, meta)
      case 'deleteComment':
        return this.deleteComment({ ...params, userId: userId! }, meta)
      case 'reportComment':
        return this.reportComment({ ...params, userId: userId! }, meta)
      default:
        return { status: 'error', message: 'Invalid action' }
    }
  }

  private async addComment(
    params: CommentPostParamsRequest & { _action: 'addComment', userId: string },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<TableCommentConfig[]>> {
    const { where: { postId, orgId }, userId, content, parentId } = params
    const db = this.db()

    // Validate the post exists
    const post = await db.select('postId', 'visibility').from(t.posts).where({ postId, orgId }).first()
    if (!post) {
      return { status: 'error', message: 'Post not found' }
    }

    // If post is private, verify user is authorized
    if (post.visibility === 'private' && !_meta.bearer?.orgs?.some(org => org.orgId === orgId)) {
      return { status: 'error', message: 'Unauthorized access to post', httpStatus: 403 }
    }

    // If there's a parent comment, validate it exists
    if (parentId) {
      const parentComment = await db
        .select('commentId')
        .from(t.postComments)
        .where({ commentId: parentId, postId })
        .first()

      if (!parentComment) {
        return { status: 'error', message: 'Parent comment not found' }
      }
    }

    // Determine the comment status (approved or pending based on moderation settings)
    // For simplicity, we'll auto-approve comments from org members
    const isOrgMember = _meta.bearer?.orgs?.some(org => org.orgId === orgId)
    const status = isOrgMember ? 'approved' : 'pending'

    // Create the comment
    const [comment] = await db(t.postComments)
      .insert({
        postId,
        userId,
        orgId,
        content,
        parentId: parentId || null,
        status,
      })
      .returning('*')

    // Get user data for the comment
    const user = await db
      .select(['userId', 'email', 'fullName', 'avatar'])
      .from(t.user)
      .where({ userId })
      .first()

    const commentWithUser = {
      ...comment,
      user,
    }

    const countResult = await db
      .count('* as count')
      .from(t.postComments)
      .where({ postId, status: 'approved' })
      .first()

    const commentCount = Number.parseInt(countResult?.count?.toString() || '0', 10)

    // Update the post's comment count
    await db(t.posts)
      .where({ postId })
      .update({ commentCount })

    return {
      status: 'success',
      message: status === 'approved' ? 'Comment added' : 'Comment submitted for moderation',
      data: [commentWithUser],
      meta: {
        commentCount,
        requiresModeration: status === 'pending',
      },
    }
  }

  private async getComments(
    params: CommentPostParamsRequest & { _action: 'getComments' },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<TableCommentConfig[]>> {
    const { where: { postId, orgId }, limit = 50, offset = 0, parentId } = params
    const db = this.db()

    // Validate the post exists
    const post = await db.select('postId', 'visibility').from(t.posts).where({ postId, orgId }).first()
    if (!post) {
      return { status: 'error', message: 'Post not found' }
    }

    // If post is private, verify user is authorized
    if (post.visibility === 'private' && !_meta.bearer?.orgs?.some(org => org.orgId === orgId)) {
      return { status: 'error', message: 'Unauthorized access to post', httpStatus: 403 }
    }

    // Base query for comments
    let query = db
      .select([
        `${t.postComments}.*`,
        `${t.user}.email`,
        `${t.user}.fullName`,
        `${t.user}.avatar`,
      ])
      .from(t.postComments)
      .join(t.user, `${t.postComments}.userId`, '=', `${t.user}.userId`)
      .where(`${t.postComments}.postId`, postId)
      .where(`${t.postComments}.status`, 'approved')
      .orderBy(`${t.postComments}.createdAt`, 'desc')
      .limit(limit)
      .offset(offset)

    // Filter by parent ID if specified
    if (parentId === null) {
      // Get only top-level comments
      query = query.whereNull(`${t.postComments}.parentId`)
    }
    else if (parentId !== undefined) {
      // Get replies to a specific comment
      query = query.where(`${t.postComments}.parentId`, parentId)
    }

    const comments = await query

    // Format comments with user data
    const formattedComments = comments.map((comment) => {
      const { email, fullName, avatar, ...commentData } = comment
      return {
        ...commentData,
        user: { userId: comment.userId, email, fullName, avatar },
      }
    })

    // If these are top-level comments, get reply counts
    if (parentId === null) {
      const commentIds = formattedComments.map(c => c.commentId)

      if (commentIds.length > 0) {
        const replyCounts = await db
          .select('parentId')
          .count('* as replyCount')
          .from(t.postComments)
          .whereIn('parentId', commentIds)
          .where('status', 'approved')
          .groupBy('parentId')

        // Add reply counts to comments
        formattedComments.forEach((comment) => {
          const replyData = replyCounts.find(r => r.parentId === comment.commentId)
          comment.replyCount = replyData ? Number.parseInt(replyData.replyCount.toString(), 10) : 0
        })
      }
    }

    // Get total count for pagination
    const countQuery = db
      .count('* as count')
      .from(t.postComments)
      .where({ postId, status: 'approved' })

    if (parentId === null) {
      countQuery.whereNull('parentId')
    }
    else if (parentId !== undefined) {
      countQuery.where('parentId', parentId)
    }

    const countResult = await countQuery.first()
    const totalCount = Number.parseInt(countResult?.count?.toString() || '0', 10)

    return {
      status: 'success',
      data: formattedComments,
      indexMeta: {
        count: totalCount,
        limit,
        offset,
      },
    }
  }

  private async updateComment(
    params: CommentPostParamsRequest & { _action: 'updateComment', userId: string },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<TableCommentConfig[]>> {
    const { where: { commentId, orgId }, userId, content } = params
    const db = this.db()

    // Verify the comment exists
    const existingComment = await db
      .select('*')
      .from(t.postComments)
      .where({ commentId, orgId })
      .first()

    if (!existingComment) {
      return { status: 'error', message: 'Comment not found' }
    }

    // Verify the user owns the comment
    if (existingComment.userId !== userId) {
      const isOrgAdmin = _meta.bearer?.orgs?.some(org =>
        org.orgId === orgId,
      )

      if (!isOrgAdmin) {
        return { status: 'error', message: 'You are not authorized to update this comment', httpStatus: 403 }
      }
    }

    // Update the comment
    const [updatedComment] = await db(t.postComments)
      .where({ commentId })
      .update({ content, updatedAt: new Date().toISOString() })
      .returning('*')

    // Get user data for the updated comment
    const user = await db
      .select(['userId', 'email', 'fullName', 'avatar'])
      .from(t.user)
      .where({ userId: existingComment.userId })
      .first()

    return {
      status: 'success',
      message: 'Comment updated',
      data: [{
        ...updatedComment,
        user,
      }],
    }
  }

  private async deleteComment(
    params: CommentPostParamsRequest & { _action: 'deleteComment', userId: string },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<TableCommentConfig[]>> {
    const { where: { commentId, orgId }, userId } = params
    const db = this.db()

    // Verify the comment exists
    const existingComment = await db
      .select('*')
      .from(t.postComments)
      .where({ commentId, orgId })
      .first()

    if (!existingComment) {
      return { status: 'error', message: 'Comment not found' }
    }

    // Check if user owns the comment or has admin permissions
    const isOrgAdmin = _meta.bearer?.orgs?.some(org =>
      org.orgId === orgId,
    )

    if (existingComment.userId !== userId && !isOrgAdmin) {
      return { status: 'error', message: 'You are not authorized to delete this comment', httpStatus: 403 }
    }

    // Delete the comment and any replies
    await db(t.postComments)
      .where({ commentId })
      .orWhere({ parentId: commentId })
      .update({ status: 'trash' })

    const countResult = await db
      .count('* as count')
      .from(t.postComments)
      .where({ postId: existingComment.postId, status: 'approved' })
      .first()

    const commentCount = Number.parseInt(countResult?.count?.toString() || '0', 10)

    // Update the post's comment count
    await db(t.posts)
      .where({ postId: existingComment.postId })
      .update({ commentCount })

    return {
      status: 'success',
      message: 'Comment deleted',
      data: [existingComment],
      meta: {
        commentCount,
      },
    }
  }

  private async reportComment(
    params: CommentPostParamsRequest & { _action: 'reportComment', userId: string },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<TableCommentConfig[]>> {
    const { where: { commentId, orgId }, userId, reason } = params
    const db = this.db()

    // Verify the comment exists
    const existingComment = await db
      .select('*')
      .from(t.postComments)
      .where({ commentId, orgId })
      .first()

    if (!existingComment) {
      return { status: 'error', message: 'Comment not found' }
    }

    // Create a report record (we'd need a new table for this in production)
    // For now, we'll just mark the comment as pending review
    await db(t.postComments)
      .where({ commentId })
      .update({ status: 'pending' })

    // Store the report reason in a new table or log it somewhere
    this.log.info(`Comment reported: ${commentId}`, {
      data: {
        commentId,
        reportedBy: userId,
        reason,
        postId: existingComment.postId,
        orgId,
      },
    })

    return {
      status: 'success',
      message: 'Comment reported and will be reviewed',
      data: [],
    }
  }
}
