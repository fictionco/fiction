// postLike.ts
import type { Post } from '../post'
import { localRef, vue } from '@fiction/core'

/**
 * Minimal post like manager with optimistic updates
 */
export class PostLike {
  private post: Post
  likedPosts = localRef<string[]>({ key: 'fiction_liked_posts', def: [] })
  isLiked = vue.computed(() => this.likedPosts.value.includes(this.post.postId))

  constructor(post: Post) {
    this.post = post
  }

  async toggle(): Promise<boolean> {
    const fictionPosts = this.post.settings.fictionPosts
    const { fictionAdmin } = fictionPosts?.settings || {}

    const loggedIn = await fictionAdmin?.redirectIfLoggedOut()

    if (!loggedIn) {
      return false
    }

    const currentLiked = this.isLiked.value
    const origLikes = [...this.likedPosts.value]
    const origCount = this.post.likeCount.value
    const newLiked = !currentLiked

    this.post.likeCount.value = newLiked
      ? origCount + 1
      : Math.max(0, origCount - 1)

    try {
      // Skip API call if not available
      if (!fictionPosts || !this.post.settings.orgId) {
        throw new Error('API not available')
      }

      // Call API
      const response = await fictionPosts.requests.PostLikes.request({
        _action: currentLiked ? 'unlike' : 'like',
        where: {
          postId: this.post.postId,
          orgId: this.post.settings.orgId,
        },
      })

      // Revert on error status
      if (response.status === 'error') {
        this.post.likeCount.value = origCount
        return currentLiked
      }
      else {
        // Apply optimistic update
        this.likedPosts.value = newLiked
          ? [...origLikes, this.post.postId]
          : origLikes.filter(id => id !== this.post.postId)
      }

      return newLiked
    }
    catch (error) {
      this.post.likeCount.value = origCount
      console.error('Error toggling like:', error)
      throw error
    }
  }
}
