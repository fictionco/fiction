import { createTestUtils } from '@fiction/core/test-utils/init'

import { afterAll, describe, expect, it } from 'vitest'
import type { DataFilter } from '@fiction/core'
import type { TablePostConfig, TableTaxonomyConfig } from '../schema'
import { FictionPosts } from '..'

describe('taxonomy management tests', async () => {
  const testUtils = createTestUtils()
  const { orgId, user } = await testUtils.init()
  const { userId = '' } = user
  const fictionPosts = new FictionPosts(testUtils)

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

  it('lists taxonomies', async () => {
    const listParams = {
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
