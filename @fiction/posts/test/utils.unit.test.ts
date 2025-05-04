/**
 * @vitest-environment happy-dom
 */
import { snap } from '@fiction/core/test-utils'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, describe, expect, it } from 'vitest'
import { FictionPosts, Post } from '..'
import { managePostIndex } from '../utils'

describe('post utils', async () => {
  const testUtils = await createSiteTestUtils()

  const fictionPosts = new FictionPosts(testUtils)
  await testUtils.init()
  afterAll(async () => {
    await testUtils.close()
  })

  it('managePost', async () => {
    const r = await fictionPosts.requests.ManagePost.projectRequest({ _action: 'create', fields: { title: 'test', content: 'hello world' } }, { caller: 'managePostTest' })

    const post = new Post({ fictionPosts, ...r.data?.[0] })

    expect(snap(post?.toConfig())).toMatchInlineSnapshot(`
      {
        "archiveAt": "null",
        "authors": [
          {
            "email": "[email:TRUTHY]",
            "fullName": "[name:TRUTHY]",
            "priority": "0",
            "userId": "[id:TRUTHY]",
          },
        ],
        "categories": [],
        "content": "hello world",
        "createdAt": "[datetime:TRUTHY]",
        "dateAt": "[datetime:TRUTHY]",
        "draft": {},
        "excerpt": "",
        "hasChanges": "false",
        "isSyndicated": "false",
        "media": {},
        "orgId": "[id:TRUTHY]",
        "postId": "[id:TRUTHY]",
        "publishAt": "null",
        "sites": [],
        "slug": "test",
        "sourceMode": "standard",
        "status": "draft",
        "subTitle": "",
        "tags": [],
        "title": "test",
        "type": "post",
        "updatedAt": "[datetime:TRUTHY]",
        "userConfig": {},
        "userId": "[id:TRUTHY]",
        "wordCount": "3",
      }
    `)
    expect(post).toBeDefined()
    expect(post?.settings.title).toBe('test')
    expect(post?.postId).toBeTruthy()
  })

  it('managePostIndex', async () => {
    const postIndex = await managePostIndex({ fictionPosts, params: { _action: 'list' }, caller: 'test-managePostIndex' })
    expect(postIndex.length).toBe(2)
  })
})
