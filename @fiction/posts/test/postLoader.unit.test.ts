import type { Card } from '@fiction/site'
import type { TablePostConfig } from '../schema'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { FictionPosts } from '..'
import { PostLoader } from '../postLoader'

describe('postLoader Integration Tests', async () => {
  const testUtils = await createSiteTestUtils()

  const fictionPosts = new FictionPosts(testUtils)

  const { orgId, user } = await testUtils.init()
  const userId = user.userId || ''

  let postLoader: PostLoader
  let mockCard: Card
  const createdPosts: TablePostConfig[] = []

  beforeAll(async () => {
    // Create some test posts
    const postData = [
      { title: 'Test Post 1', content: 'Content 1' },
      { title: 'Test Post 2', content: 'Content 2' },
      { title: 'Test Post 3', content: 'Content 3' },
    ]

    for (const data of postData) {
      const result = await fictionPosts.queries.ManagePost.serve({
        _action: 'create',
        fields: data,
        orgId,
        userId,
      }, {})

      const createdPost = result.data?.[0]

      if (createdPost)
        createdPosts.push(createdPost)
    }

    mockCard = {
      userConfig: {
        value: {
          posts: {
            format: 'standard',
            limit: 10,
          },
        },
      },
      site: {
        settings: {
          orgId,
        },
      },
    } as unknown as Card

    postLoader = new PostLoader({
      fictionPosts,
      card: mockCard,
      rootKey: 'posts',
    })
  })

  afterAll(async () => {
    // Clean up created posts
    for (const post of createdPosts) {
      await fictionPosts.queries.ManagePost.serve({
        _action: 'delete',
        where: { postId: post.postId || '' },
        orgId,
      }, {})
    }
    await testUtils.close()
  })

  describe('loadPosts', () => {
    it('should load global posts correctly', async () => {
      const { posts, indexMeta } = await postLoader.loadPosts()

      expect(posts).toHaveLength(3)
      expect(posts[0].title.value).toBe('Test Post 3')
      expect(indexMeta?.count).toBe(3)
    })

    it('should handle pagination for global posts', async () => {
      const { posts, indexMeta } = await postLoader.loadPosts({ offset: 1, limit: 2 })

      expect(posts).toHaveLength(2)
      expect(posts[0].title.value).toBe('Test Post 2')
      expect(indexMeta?.count).toBe(3)
    })

    it('should load local posts correctly', async () => {
      const localMockCard = {
        ...mockCard,
        userConfig: {
          value: {
            posts: {
              format: 'local',
              entries: createdPosts,
            },
          },
        },
      } as unknown as Card

      const localPostLoader = new PostLoader({
        fictionPosts,
        card: localMockCard,
        rootKey: 'posts',
      })

      const { posts, indexMeta } = await localPostLoader.loadPosts()

      expect(posts).toHaveLength(3)
      expect(posts[0].title.value).toBe('Test Post 1')
      expect(indexMeta?.count).toBe(3)
    })
  })

  describe('loadSinglePost', () => {
    it('should load a single global post correctly', async () => {
      const post = await postLoader.loadSinglePost(createdPosts[1].slug || '')

      expect(post.title.value).toBe('Test Post 2')
      expect(post.content.value).toBe('Content 2')
    })

    it('should load a single local post correctly', async () => {
      const localMockCard = {
        ...mockCard,
        userConfig: {
          value: {
            posts: {
              format: 'local',
              entries: createdPosts,
            },
          },
        },
      } as unknown as Card

      const localPostLoader = new PostLoader({
        fictionPosts,
        card: localMockCard,
        rootKey: 'posts',
      })

      const post = await localPostLoader.loadSinglePost(createdPosts[1].slug || '')

      expect(post.title.value).toBe('Test Post 2')
      expect(post.content.value).toBe('Content 2')
    })

    it('should throw an error for non-existent post', async () => {
      await expect(postLoader.loadSinglePost('non-existent')).rejects.toThrow('Post not found')
    })
  })

  describe('error handling', () => {
    it('should throw an error when orgId is missing for global posts', async () => {
      const invalidMockCard = {
        ...mockCard,
        site: {
          settings: {},
        },
      } as unknown as Card

      const invalidPostLoader = new PostLoader({
        fictionPosts,
        card: invalidMockCard,
        rootKey: 'posts',
      })

      await expect(invalidPostLoader.loadPosts()).rejects.toThrow('No fiction orgId found')
    })
  })
})
