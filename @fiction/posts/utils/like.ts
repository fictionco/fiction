// postLike.ts
import type { Post } from '../post'
import { localRef, vue } from '@fiction/core'

/**
 * Utility class for managing post likes with localStorage
 */
export class PostLike {
  private post: Post
  private localStorageKey = 'fiction_liked_posts'
  likedPosts = localRef<string[]>({ key: this.localStorageKey, def: [] })

  // Reactive state for like status
  isLiked = vue.computed(() => {
    return this.likedPosts.value.includes(this.post.postId)
  })

  constructor(post: Post) {
    this.post = post
  }

  async toggle(args: { optimistic?: boolean } = {}): Promise<boolean> {
    const { optimistic = true } = args
    const currentlyLiked = this.isLiked.value
    const likedPosts = this.likedPosts.value

    // Toggle local state first
    if (currentlyLiked) {
      // Unlike: Remove from localStorage
      const newLikedPosts = likedPosts.filter(id => id !== this.post.postId)
      this.likedPosts.value = newLikedPosts

      // Update count optimistically
      if (optimistic) {
        this.post.likeCount.value = Math.max(0, this.post.likeCount.value - 1)
      }
    }
    else {
      // Like: Add to localStorage
      const newLikedPosts = [...likedPosts, this.post.postId]
      this.likedPosts.value = newLikedPosts

      // Update count optimistically
      if (optimistic) {
        this.post.likeCount.value = this.post.likeCount.value + 1
      }
    }

    // Update server if fictionPosts is available
    if (this.post.settings.fictionPosts) {
      try {
        // Get orgId from the post settings
        const orgId = this.post.settings.orgId

        if (!orgId) {
          throw new Error('Missing orgId for post like operation')
        }

        // Call the appropriate endpoint based on new like status
        const action = !currentlyLiked ? 'like' : 'unlike'

        const response = await this.post.settings.fictionPosts.requests.PostLikes.request({
          _action: action,
          where: {
            postId: this.post.postId,
            orgId,
          },
        })

        // Update like count from response if not using optimistic updates
        if (!optimistic && response.meta?.likeCount !== undefined) {
          this.post.likeCount.value = response.meta.likeCount
        }
      }
      catch (error) {
        // Revert local changes on error
        if (currentlyLiked) {
          // Revert unlike
          this.likedPosts.value = likedPosts
          if (optimistic) {
            this.post.likeCount.value = this.post.likeCount.value + 1
          }
        }
        else {
          // Revert like
          this.likedPosts.value = likedPosts.filter(id => id !== this.post.postId)
          if (optimistic) {
            this.post.likeCount.value = Math.max(0, this.post.likeCount.value - 1)
          }
        }

        console.error('Error toggling post like status:', error)
        throw error
      }
    }

    // Return new like status
    return !currentlyLiked
  }
}
