import type { DataFilter } from '@fiction/core'

import type { ManagePostParams, ManageTaxonomyParams } from '../endpoint'
import { createTestUser } from '@fiction/core/test-utils/init'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, describe, expect, it } from 'vitest'
import { FictionPosts } from '..'

describe('taxonomy management tests', async () => {
  const testUtils = await createSiteTestUtils()
  const { orgId, user } = await testUtils.init()
  const { userId = '' } = user
  const fictionPosts = new FictionPosts(testUtils)

  afterAll(async () => {
    await testUtils.close()
  })

  it('handles authors on a post', async () => {
    const createNoAuthors: ManagePostParams = {
      _action: 'create',
      fields: {
        title: 'Author Post',
        content: 'Content of the new post',
      },
      orgId,
      userId,
    } as const

    const res = await fictionPosts.queries.ManagePost.serve(createNoAuthors, {})

    const post1 = res.data?.[0]
    expect(post1?.authors?.length).toBe(1)
    expect(post1?.authors?.[0].userId).toBe(userId)

    const { user: { userId: userId2 } = {} } = await createTestUser(testUtils.fictionUser)

    const passedAuthors = [{ userId }, { userId: userId2 }]
    const create: ManagePostParams = {
      _action: 'create',
      fields: {
        title: 'Author Post',
        content: 'Content of the new post',
        authors: passedAuthors,
      },
      orgId,
      userId,
    } as const

    const r = await fictionPosts.queries.ManagePost.serve(create, {})

    const post2 = r.data?.[0]

    expect(r.status).toBe('success')
    expect(post2).toBeInstanceOf(Object)
    expect(post2?.authors).toBeInstanceOf(Array)
    expect(post2?.authors?.length).toBe(2)
    expect(post2?.authors?.map(_ => _.userId).sort()).toStrictEqual([userId, userId2].sort())
  })

  // it('creates a taxonomy', async () => {
  //   const createParams = {
  //     _action: 'create' as const,
  //     items: [
  //       { title: 'Fishing', description: 'A general category', type: 'category' },
  //       { slug: 'hiking', description: 'Second category', type: 'category' },
  //     ] as const,
  //     orgId,
  //     userId,
  //   }

  //   const createResult = await fictionPosts.queries.ManageTaxonomy.serve(createParams, {})

  //   expect(createResult.status).toBe('success')
  //   expect(createResult.data).toBeInstanceOf(Array)

  //   expect(createResult.data?.length).toBe(2)
  //   expect(createResult.data?.[0]?.title).toBe('Fishing')
  //   expect(createResult.data?.[0]?.slug).toBe('fishing')
  //   expect(createResult.data?.[0]?.description).toBe('A general category')
  //   expect(createResult.data?.[1]?.title).toBe('Hiking')
  //   expect(createResult.data?.[1]?.slug).toBe('hiking')
  //   expect(createResult.data?.[1]?.description).toBe('Second category')
  // })

  // it('adds taxonomies to a post', async () => {
  //   const create: ManagePostParams = {
  //     _action: 'create',
  //     fields: {
  //       title: 'New Post',
  //       content: 'Content of the new post',
  //       taxonomy: [
  //         { slug: 'fishing' },
  //         { slug: 'hiking' },
  //         { type: 'category', slug: 'non-existent', isNew: true },
  //       ],
  //     },
  //     orgId,
  //     userId,
  //   } as const

  //   const r = await fictionPosts.queries.ManagePost.serve(create, {})

  //   expect(r.status).toBe('success')

  //   const post = r.data?.[0]

  //   const postId = post?.postId

  //   if (!postId) {
  //     throw new Error('No postId returned')
  //   }

  //   expect(post).toBeInstanceOf(Object)
  //   const tax = (post?.taxonomy || [])
  //   expect(tax).toBeInstanceOf(Array)
  //   expect(tax?.length).toBe(3)
  //   expect(tax.map(_ => _.title).sort()).toStrictEqual([
  //     'Fishing',
  //     'Hiking',
  //     'Non Existent',
  //   ])
  //   expect(postId.length).toBeGreaterThan(10)

  //   const update: ManagePostParams = {
  //     _action: 'update',
  //     where: { postId },
  //     orgId,
  //     fields: {
  //       taxonomy: [
  //         { slug: 'fishing' },
  //       ],
  //     },
  //   }

  //   const r2 = await fictionPosts.queries.ManagePost.serve(update, {})

  //   expect(r2.status).toBe('success')

  //   const post2 = r2.data?.[0]
  //   expect(post2).toBeInstanceOf(Object)
  //   expect(post2?.taxonomy).toBeInstanceOf(Array)
  //   expect(post2?.taxonomy?.length).toBe(1)
  // })

  // it('lists taxonomies', async () => {
  //   const listParams: ManageTaxonomyParams = {
  //     _action: 'list',
  //     limit: 10,
  //     offset: 0,
  //     filters: [
  //       { field: 'type', operator: '=', value: 'category' },
  //       { field: 'slug', operator: 'like', value: '%king%' },
  //     ] as DataFilter[],
  //     orgId,
  //   } as const

  //   const listResult = await fictionPosts.queries.ManageTaxonomy.serve(listParams, {})

  //   expect(listResult.status).toBe('success')
  //   expect(listResult.data).toBeInstanceOf(Array)
  //   expect(listResult.data?.length).toBe(1)
  // })

  // it('lists taxonomies by popularity', async () => {
  //   const listParams: ManageTaxonomyParams = {
  //     _action: 'list',
  //     limit: 2,
  //     offset: 0,
  //     filters: [] as DataFilter[],
  //     orgId,
  //     orderMode: 'popularity',
  //   } as const

  //   const listResult = await fictionPosts.queries.ManageTaxonomy.serve(listParams, {})

  //   expect(listResult.status).toBe('success')
  //   expect(listResult.data).toBeInstanceOf(Array)
  //   expect(listResult.data?.map(d => d.usageCount)).toMatchInlineSnapshot(`
  //     [
  //       1,
  //       0,
  //     ]
  //   `)
  //   expect(listResult.data?.map(d => d.usageCount)).toStrictEqual([1, 0])
  // })

  // it('lists with search and type', async () => {
  //   const create: ManagePostParams = {
  //     _action: 'create',
  //     fields: {
  //       title: 'Another New Post',
  //       content: 'Content of the new post',
  //       taxonomy: [
  //         { slug: 'camping' },
  //         { slug: 'rock-climbing' },
  //         { type: 'tag', slug: 'diving' },
  //         { type: 'category', slug: 'scuba-diving' },
  //         { type: 'tag', slug: 'skydiving' },
  //         { type: 'tag', slug: 'parachuting' },
  //         { type: 'tag', slug: 'base-jumping' },
  //         { type: 'tag', slug: 'bungee-jumping' },
  //         { type: 'tag', slug: 'cliff-diving' },

  //       ],
  //     },
  //     orgId,
  //     userId,
  //   } as const

  //   await fictionPosts.queries.ManagePost.serve(create, {})

  //   const listParams: ManageTaxonomyParams = {
  //     _action: 'list',
  //     search: 'diving',
  //     filters: [] as DataFilter[],
  //     orgId,
  //     orderMode: 'popularity',
  //   } as const

  //   const listResult = await fictionPosts.queries.ManageTaxonomy.serve(listParams, {})

  //   expect(listResult.status).toBe('success')
  //   expect(listResult.data?.map(d => d.slug).sort()).toStrictEqual([
  //     'cliff-diving',
  //     'diving',
  //     'scuba-diving',
  //     'skydiving',
  //   ])

  //   const listParams2: ManageTaxonomyParams = {
  //     _action: 'list',
  //     search: 'diving',
  //     type: 'category',
  //     filters: [] as DataFilter[],
  //     orgId,
  //     orderMode: 'popularity',
  //   } as const

  //   const listResult2 = await fictionPosts.queries.ManageTaxonomy.serve(listParams2, {})

  //   expect(listResult2.data?.map(d => d.slug)).toStrictEqual([
  //     'scuba-diving',
  //   ])
  // })

  // it('updates a taxonomy', async () => {
  //   const updateParams = {
  //     _action: 'update',
  //     items: [
  //       { slug: 'hiking', title: 'Updated Hiking' },
  //     ],
  //     orgId,
  //   } as const

  //   const r = await fictionPosts.queries.ManageTaxonomy.serve(updateParams, {})

  //   const updatedTaxonomy = r.data?.[0]

  //   expect(r.status).toBe('success')
  //   expect(updatedTaxonomy?.title).toBe('Updated Hiking')
  // })

  // it('deletes a taxonomy', async () => {
  //   const deleteParams = {
  //     _action: 'delete',
  //     items: [{ slug: 'hiking' }],
  //     orgId,
  //   } as const

  //   const deleteResult = await fictionPosts.queries.ManageTaxonomy.serve(deleteParams, {})

  //   expect(deleteResult.status).toBe('success')
  //   expect(deleteResult.data?.length).toBe(1)

  //   // Attempt to fetch the deleted taxonomy to confirm deletion
  //   const getResult = await fictionPosts.queries.ManageTaxonomy.serve({
  //     _action: 'get',
  //     selectors: [{ taxonomyId: deleteResult.data?.[0]?.taxonomyId }],
  //     orgId,
  //   }, {})

  //   expect(getResult.data).toBeInstanceOf(Array)
  //   expect(getResult.data?.length).toBe(0) // Should find no entries
  // })
})
