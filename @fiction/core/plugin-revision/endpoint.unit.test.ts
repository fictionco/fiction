import type { TableRevisionConfig } from './tables'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createTestUtils, testEnvFile } from '../test-utils'
import { shortId } from '../utils'

describe('revision endpoint', async () => {
  const testUtils = createTestUtils({ envFiles: [testEnvFile] })
  const fictionRevision = testUtils.fictionRevision
  const { orgId, user } = await testUtils.init()
  const userId = user.userId

  if (!orgId)
    throw new Error('orgId not found')
  if (!userId)
    throw new Error('userId not found')

  // Test data
  const mockItemData = {
    title: 'Test Page',
    content: 'Test content',
  }

  const getMockRevision = (): TableRevisionConfig => {
    return {
      itemType: 'page',
      itemId: `page-${shortId()}`,
      itemData: mockItemData,
      title: 'Initial revision',
      description: 'First test revision',
    }
  }

  it('should create a revision', async () => {
    const rev = getMockRevision()
    const result = await fictionRevision.queries.ManageRevision.serve({
      _action: 'create',
      fields: rev,
      orgId,
      userId,
      caller: 'test',
    }, { server: true })

    expect(result.status).toBe('success')

    const revision = result.data?.[0]

    if (!revision) {
      throw new Error('Revision not found')
    }
    expect(revision).toMatchObject({
      ...rev,
      orgId,
      userId,
    })
    expect(revision.revisionId).toBeDefined()
    expect(revision.createdAt).toBeDefined()
    expect(revision.updatedAt).toBeDefined()
  })

  it('should retrieve a revision', async () => {
    const rev = getMockRevision()
    const result1 = await fictionRevision.queries.ManageRevision.serve({
      _action: 'create',
      fields: rev,
      orgId,
      userId,
      caller: 'test',
    }, { server: true })

    expect(result1.status).toBe('success')
    const result = await fictionRevision.queries.ManageRevision.serve({
      _action: 'retrieve',
      where: { itemId: rev.itemId },
      orgId,
      userId,
      caller: 'test',
    }, { server: true })

    expect(result.status).toBe('success')
    expect(result.data).toHaveLength(1)
    expect(result.data?.[0].itemData).toEqual(mockItemData)
  })

  it('should list revisions with pagination', async () => {
    const rev = getMockRevision()
    const createNum = 3
    await Promise.all(
      Array.from({ length: createNum }, (_, i) =>
        fictionRevision.queries.ManageRevision.serve({
          _action: 'create',
          fields: {
            ...rev,
            title: `Revision ${i + 2}`,
            itemData: mockItemData,
          },
          orgId,
          userId,
          caller: 'test',
        }, { server: true })),
    )

    // Test pagination
    const result = await fictionRevision.queries.ManageRevision.serve({
      _action: 'list',
      where: { itemId: rev.itemId },
      limit: 2,
      offset: 0,
      orgId,
      userId,
      caller: 'test',
    }, { server: true })

    expect(result.status).toBe('success')
    expect(result.data).toHaveLength(2)
    expect(result.indexMeta?.count).toBe(createNum)
    expect(result.indexMeta?.limit).toBe(2)
    expect(result.indexMeta?.offset).toBe(0)
  })

  it('should enforce revision limit and maintain versions', async () => {
    const rev = getMockRevision()
    const defaultLimit = fictionRevision.revisionLimitPerItem

    fictionRevision.revisionLimitPerItem = 10
    const limit = fictionRevision.revisionLimitPerItem
    const total = limit + 5
    const results = []

    // Create revisions sequentially
    for (let i = 1; i <= total; i++) {
      const result = await fictionRevision.queries.ManageRevision.serve({
        _action: 'create',
        fields: {
          ...rev,
          title: `Revision ${i}`,
          itemData: mockItemData,
        },
        orgId,
        userId,
        caller: 'test',
      }, { server: true })

      results.push(result.data?.[0])
    }

    // Verify final state
    const list = await fictionRevision.queries.ManageRevision.serve({
      _action: 'list',
      where: { itemId: rev.itemId },
      limit: 100,
      orgId,
      userId,
      caller: 'test',
    }, { server: true })

    const li = list.data || []

    // Should have exactly limit revisions
    expect(li.length).toBe(limit)

    // Versions should be sequential and include latest ones
    const versions = li.map(r => r.version).filter(Boolean) as number[]

    const versionsSorted = versions.sort((a, b) => a - b)

    expect(versionsSorted).toMatchInlineSnapshot(`
      [
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
      ]
    `)

    expect(versionsSorted).toEqual(
      Array.from({ length: limit }, (_, i) => total - limit + 1 + i),
    )

    fictionRevision.revisionLimitPerItem = defaultLimit
  })

  it('should delete all revisions for an item', async () => {
    const rev = getMockRevision()
    const result1 = await fictionRevision.queries.ManageRevision.serve({
      _action: 'create',
      fields: rev,
      orgId,
      userId,
      caller: 'test',
    }, { server: true })

    expect(result1.status).toBe('success')

    const result = await fictionRevision.queries.ManageRevision.serve({
      _action: 'deleteByItemId',
      where: { itemId: rev.itemId },
      orgId,
      userId,
      caller: 'test',
    }, { server: true })

    expect(result.status).toBe('success')
    expect(result.data?.length).toBeGreaterThan(0)

    // Verify deletion
    const check = await fictionRevision.queries.ManageRevision.serve({
      _action: 'list',
      where: { itemId: rev.itemId },
      orgId,
      userId,
      caller: 'test',
    }, { server: true })

    expect(check.data).toHaveLength(0)
  })

  it('should handle non-existent revisions gracefully', async () => {
    const result = await fictionRevision.queries.ManageRevision.serve({
      _action: 'retrieve',
      where: { itemId: 'nonexistent' },
      orgId,
      userId,
      caller: 'test',
    }, { server: true })

    expect(result.status).toBe('success')
    expect(result.data).toHaveLength(0)
  })
})
