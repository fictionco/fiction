/**
 * @vitest-environment happy-dom
 */
import { createTestUtils, snap } from '@fiction/core/test-utils'
import { afterAll, describe, expect, it } from 'vitest'
import { FictionPosts } from '..'
import { managePost, managePostIndex } from '../utils'

describe('post utils', async () => {
  const testUtils = createTestUtils()

  const fictionPosts = new FictionPosts(testUtils)
  const initialized = await testUtils.init()
  afterAll(async () => {
    await testUtils.close()
  })

  it('managePost', async () => {
    const post = await managePost({ fictionPosts, params: { _action: 'create', fields: { title: 'test', content: 'hello world' } } })
    expect(post).toBeDefined()
    expect(post?.settings.title).toBe('test')
    expect(post?.postId).toBeTruthy()

    expect(snap(post?.toConfig())).toMatchInlineSnapshot(`
      {
        "archiveAt": null,
        "authors": "[object Object]",
        "categories": "",
        "content": "hello world",
        "createdAt": "[dateTime:]",
        "dateAt": "[dateTime:]",
        "draft": {},
        "draftHistory": "",
        "excerpt": "",
        "hasChanges": false,
        "image": {},
        "isSyndicated": null,
        "meta": {},
        "orgId": "[id:***************************]",
        "postId": "[id:***************************]",
        "publishAt": null,
        "sites": "",
        "slug": "test",
        "status": "draft",
        "subTitle": "",
        "tags": "",
        "taxonomy": "",
        "title": "test",
        "type": "post",
        "updatedAt": "[dateTime:]",
        "userConfig": {},
        "userId": "[id:***************************]",
      }
    `)
  })

  it('managePostIndex', async () => {
    const postIndex = await managePostIndex({ fictionPosts, params: { _action: 'list' } })
    expect(postIndex.length).toBe(1)
  })
})