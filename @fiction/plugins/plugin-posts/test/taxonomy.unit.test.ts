import { createTestUtils } from '@fiction/core/test-utils/init'

import { afterAll, describe, expect, it } from 'vitest'
import type { DataFilter } from '@fiction/core'
import type { TablePostConfig, TableTaxonomyConfig } from '../schema'
import { FictionPosts } from '..'
import type { ManagePostParams, ManageTaxonomyParams } from '../endpoint'

describe('taxonomy management tests', async () => {
  const testUtils = createTestUtils()
  const { orgId, user } = await testUtils.init()
  const { userId = '' } = user
  const fictionPosts = new FictionPosts(testUtils)

  let workingPost: TablePostConfig | undefined

  afterAll(async () => {
    await testUtils.close()
  })

  it('creates a taxonomy', async () => {
    const createParams = {
      _action: 'create' as const,
      items: [
        { title: 'Fishing', description: 'A general category', type: 'category' },
        { slug: 'hiking', description: 'Second category', type: 'category' },
      ] as const,
      orgId,
      userId,
    }

    const createResult = await fictionPosts.queries.ManageTaxonomy.serve(createParams, {})

    expect(createResult.status).toBe('success')
    expect(createResult.data).toBeInstanceOf(Array)

    expect(createResult.data?.length).toBe(2)
    expect(createResult.data?.[0]?.title).toBe('Fishing')
    expect(createResult.data?.[0]?.slug).toBe('fishing')
    expect(createResult.data?.[0]?.description).toBe('A general category')
    expect(createResult.data?.[1]?.title).toBe('Hiking')
    expect(createResult.data?.[1]?.slug).toBe('hiking')
    expect(createResult.data?.[1]?.description).toBe('Second category')
  })

  it('adds taxonomies to a post', async () => {
    const create: ManagePostParams = {
      _action: 'create',
      fields: {
        title: 'New Post',
        content: 'Content of the new post',
        taxonomy: [
          { slug: 'fishing' },
          { slug: 'hiking' },
          { type: 'category', slug: 'non-existent', isNew: true },
        ],
      },
      orgId,
      userId,
    } as const

    const r = await fictionPosts.queries.ManagePost.serve(create, {})

    expect(r.status).toBe('success')
    expect(r.data).toBeInstanceOf(Object)
    const tax = (r.data?.taxonomy || [])
    expect(tax).toBeInstanceOf(Array)
    expect(tax?.length).toBe(3)
    expect(tax.map(_ => _.title).sort()).toStrictEqual([
      'Fishing',
      'Hiking',
      'Non Existent',
    ])
    expect(r.data?.postId?.length).toBeGreaterThan(10)

    const update: ManagePostParams = {
      _action: 'update',
      postId: r.data?.postId || '',
      orgId,
      fields: {
        taxonomy: [
          { slug: 'fishing' },
        ],
      },
    }

    const r2 = await fictionPosts.queries.ManagePost.serve(update, {})

    expect(r2.status).toBe('success')
    expect(r2.data).toBeInstanceOf(Object)
    expect(r2.data?.taxonomy).toBeInstanceOf(Array)
    expect(r2.data?.taxonomy?.length).toBe(1)
  })

  it('lists taxonomies', async () => {
    const listParams: ManageTaxonomyParams = {
      _action: 'list',
      limit: 10,
      offset: 0,
      filters: [
        { field: 'type', operator: '=', value: 'category' },
        { field: 'slug', operator: 'like', value: '%king%' },
      ] as DataFilter[],
      orgId,
    } as const

    const listResult = await fictionPosts.queries.ManageTaxonomy.serve(listParams, {})

    expect(listResult.status).toBe('success')
    expect(listResult.data).toBeInstanceOf(Array)
    expect(listResult.data?.length).toBe(1)
  })

  it('lists taxonomies by popularity', async () => {
    const listParams: ManageTaxonomyParams = {
      _action: 'list',
      limit: 2,
      offset: 0,
      filters: [] as DataFilter[],
      orgId,
      orderMode: 'popularity',
    } as const

    const listResult = await fictionPosts.queries.ManageTaxonomy.serve(listParams, {})

    expect(listResult.status).toBe('success')
    expect(listResult.data).toBeInstanceOf(Array)
    expect(listResult.data?.map(d => d.usageCount)).toMatchInlineSnapshot(`
      [
        1,
        0,
      ]
    `)
    expect(listResult.data?.map(d => d.usageCount)).toStrictEqual([1, 0])
  })

  it('lists with search and type', async () => {
    const create: ManagePostParams = {
      _action: 'create',
      fields: {
        title: 'Another New Post',
        content: 'Content of the new post',
        taxonomy: [
          { slug: 'camping' },
          { slug: 'rock-climbing' },
          { type: 'tag', slug: 'diving' },
          { type: 'category', slug: 'scuba-diving' },
          { type: 'tag', slug: 'skydiving' },
          { type: 'tag', slug: 'parachuting' },
          { type: 'tag', slug: 'base-jumping' },
          { type: 'tag', slug: 'bungee-jumping' },
          { type: 'tag', slug: 'cliff-diving' },

        ],
      },
      orgId,
      userId,
    } as const

    await fictionPosts.queries.ManagePost.serve(create, {})

    const listParams: ManageTaxonomyParams = {
      _action: 'list',
      search: 'diving',
      filters: [] as DataFilter[],
      orgId,
      orderMode: 'popularity',
    } as const

    const listResult = await fictionPosts.queries.ManageTaxonomy.serve(listParams, {})

    expect(listResult.status).toBe('success')
    expect(listResult.data?.map(d => d.slug).sort()).toStrictEqual([
      'cliff-diving',
      'diving',
      'scuba-diving',
      'skydiving',
    ])

    const listParams2: ManageTaxonomyParams = {
      _action: 'list',
      search: 'diving',
      type: 'category',
      filters: [] as DataFilter[],
      orgId,
      orderMode: 'popularity',
    } as const

    const listResult2 = await fictionPosts.queries.ManageTaxonomy.serve(listParams2, {})

    expect(listResult2.data?.map(d => d.slug)).toStrictEqual([
      'scuba-diving',
    ])
  })

  it('updates a taxonomy', async () => {
    const updateParams = {
      _action: 'update',
      items: [
        { slug: 'hiking', title: 'Updated Hiking' },
      ],
      orgId,
    } as const

    const r = await fictionPosts.queries.ManageTaxonomy.serve(updateParams, {})

    const updatedTaxonomy = r.data?.[0]

    expect(r.status).toBe('success')
    expect(updatedTaxonomy?.title).toBe('Updated Hiking')
  })

  it('deletes a taxonomy', async () => {
    const deleteParams = {
      _action: 'delete',
      items: [{ slug: 'hiking' }],
      orgId,
    } as const

    const deleteResult = await fictionPosts.queries.ManageTaxonomy.serve(deleteParams, {})

    expect(deleteResult.status).toBe('success')
    expect(deleteResult.data?.length).toBe(1)

    // Attempt to fetch the deleted taxonomy to confirm deletion
    const getResult = await fictionPosts.queries.ManageTaxonomy.serve({
      _action: 'get',
      selectors: [{ taxonomyId: deleteResult.data?.[0]?.taxonomyId }],
      orgId,
    }, {})

    expect(getResult.data).toBeInstanceOf(Array)
    expect(getResult.data?.length).toBe(0) // Should find no entries
  })
})
