import type { TableRevisionConfig } from './tables'
import { afterAll, describe, expect, it } from 'vitest'
import { createTestUtils, testEnvFile } from '../test-utils'
import { shortId } from '../utils'

// Test data
const mockItemData = {
  title: 'Test Page',
  content: 'Test content',
}

function getMockRevision(): TableRevisionConfig {
  return {
    itemType: 'page',
    itemId: `page-${shortId()}`,
    itemData: mockItemData,
    title: 'Initial revision',
    description: 'First test revision',
  }
}

describe('fictionRevision core methods', async () => {
  const testUtils = createTestUtils({ envFiles: [testEnvFile] })
  const fictionRevision = testUtils.fictionRevision

  const init = await testUtils.init()
  const orgId = init.orgId
  const userId = init.user.userId

  if (!orgId || !userId) {
    throw new Error('Failed to initialize test environment')
  }

  describe('createRevision', () => {
    it('creates a new revision with valid data', async () => {
      const rev = getMockRevision()
      const result = await fictionRevision.createRevision({ ...rev, orgId, userId }, { skipTimeCheck: true })

      expect(result.status).toBe('success')
      expect(result.data?.[0]).toMatchObject({
        ...rev,
        version: 1,
        revisionId: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it('enforces minimum time interval between revisions', async () => {
      const rev = getMockRevision()
      // Create initial revision
      await fictionRevision.createRevision({ ...rev, orgId, userId }, { skipTimeCheck: true })

      // Attempt to create another revision immediately
      const result = await fictionRevision.createRevision({ ...rev, orgId, userId }, { skipTimeCheck: false })

      expect(result.status).toBe('error')
      expect(result.message).toBe('Too soon to create a new revision')
    })

    it('allows bypass of time check with skipTimeCheck option', async () => {
      const rev = getMockRevision()
      const fullRev = { ...rev, orgId, userId }
      // Create initial revision
      await fictionRevision.createRevision(fullRev, { skipTimeCheck: true })

      // Create another revision immediately with skipTimeCheck
      const result = await fictionRevision.createRevision(fullRev, { skipTimeCheck: true })

      expect(result.status).toBe('success')
      expect(result.data).toHaveLength(1)
    })

    it('increments version number for consecutive revisions', async () => {
      const rev = getMockRevision()
      const fullRev = { ...rev, orgId, userId }
      // Create first revision
      const result1 = await fictionRevision.createRevision(fullRev, { skipTimeCheck: true })
      const firstVersion = result1.data?.[0].version

      // Create second revision
      const result2 = await fictionRevision.createRevision(fullRev, { skipTimeCheck: true })
      const secondVersion = result2.data?.[0].version

      expect(firstVersion).toBe(1)
      expect(secondVersion).toBe(2)
    })

    it('respects revision limit per item', async () => {
      const rev = getMockRevision()
      const fullRev = { ...rev, orgId, userId }
      const defaultLimit = fictionRevision.revisionLimitPerItem
      fictionRevision.revisionLimitPerItem = 5
      const limit = fictionRevision.revisionLimitPerItem

      // Create more revisions than the limit
      for (let i = 0; i < limit + 2; i++) {
        await fictionRevision.createRevision(fullRev, { skipTimeCheck: true })
      }

      // Check total revisions
      const result = await fictionRevision.queries.ManageRevision.serve({
        _action: 'list',
        where: { itemId: fullRev.itemId },
        limit: limit + 2,
        orgId,
        userId,
        caller: 'test',
      }, { server: true })

      expect(result.data).toHaveLength(limit)
      expect(result.data?.map(r => r.version)).toEqual(
        expect.arrayContaining([limit + 1, limit + 2]), // Should contain latest versions
      )

      fictionRevision.revisionLimitPerItem = defaultLimit
    })
  })

  describe('getRevisionData', () => {
    it('retrieves correct revision data', async () => {
      const rev = getMockRevision()
      const fullRev = { ...rev, orgId, userId }
      // Create a revision first
      const createResult = await fictionRevision.createRevision(fullRev, { skipTimeCheck: true })
      const revisionId = createResult.data?.[0].revisionId

      if (!revisionId) {
        throw new Error('Failed to create test revision')
      }

      const r = await fictionRevision.getRevisionData({
        revisionId,
        orgId,
        userId,
      })

      expect(r.data).toMatchObject({
        ...fullRev,
        revisionId,
        version: 1,
      })
    })

    it('throws error for non-existent revision', async () => {
      const r = await fictionRevision.getRevisionData({
        revisionId: 'non-existent',
        orgId,
        userId,
      })

      expect(r.status).toBe('error')
      expect(r.message).toMatchInlineSnapshot(`"Revision not found"`)
    })

    it('respects organization boundaries', async () => {
      const rev = getMockRevision()
      const fullRev = { ...rev, orgId, userId }
      // Create a revision
      const createResult = await fictionRevision.createRevision(fullRev, { skipTimeCheck: true })
      const revisionId = createResult.data?.[0].revisionId

      if (!revisionId) {
        throw new Error('Failed to create test revision')
      }

      const r = await fictionRevision.getRevisionData({
        revisionId,
        orgId: 'different-org',
        userId,
      })

      expect(r.status).toBe('error')
      expect(r.message).toMatchInlineSnapshot(`"Revision not found"`)
    })

    it('includes all expected fields in revision data', async () => {
      const rev = getMockRevision()
      const fullRev = { ...rev, orgId, userId }
      const createResult = await fictionRevision.createRevision(fullRev, { skipTimeCheck: true })
      const revisionId = createResult.data?.[0].revisionId

      if (!revisionId) {
        throw new Error('Failed to create test revision')
      }

      const r = await fictionRevision.getRevisionData({
        revisionId,
        orgId,
        userId,
      })

      expect(r.data).toMatchObject({
        revisionId: expect.any(String),
        orgId: expect.any(String),
        userId: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        version: expect.any(Number),
        itemType: expect.any(String),
        itemId: expect.any(String),
        itemData: expect.any(Object),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })
  })

  afterAll(async () => {
    await testUtils.close()
  })
})

describe('revision endpoint', async () => {
  const testUtils = createTestUtils({ envFiles: [testEnvFile] })
  const fictionRevision = testUtils.fictionRevision
  const { orgId, user } = await testUtils.init()
  const userId = user.userId

  if (!orgId)
    throw new Error('orgId not found')
  if (!userId)
    throw new Error('userId not found')

  afterAll(async () => {
    await testUtils.close()
  })

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

    // Create revisions sequentially
    for (let i = 1; i <= total; i++) {
      await fictionRevision.queries.ManageRevision.serve({
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

    // Versions should be strictly increasing, even with deletions
    const versions = li.reverse().map(r => r.version) as number[]
    expect(versions).toHaveLength(limit)

    expect(versions).toMatchInlineSnapshot(`
      [
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        13,
        14,
        15,
      ]
    `)

    // Each version should be greater than the previous
    for (let i = 1; i < versions.length; i++) {
      expect(versions[i]).toBeGreaterThan(versions[i - 1] || 0)
    }

    // Last version should match total number of revisions created
    expect(Math.max(...versions)).toBe(total)

    fictionRevision.revisionLimitPerItem = defaultLimit
  })

  it('increments version number correctly after deletions', async () => {
    const rev = getMockRevision()

    // Create first revision
    const result1 = await fictionRevision.queries.ManageRevision.serve({
      _action: 'create',
      fields: rev,
      orgId,
      userId,
      caller: 'test',
    }, { server: true })

    const result2 = await fictionRevision.queries.ManageRevision.serve({
      _action: 'create',
      fields: rev,
      orgId,
      userId,
      caller: 'test',
    }, { server: true })

    // Delete it
    await fictionRevision.queries.ManageRevision.serve({
      _action: 'delete',
      where: { revisionId: result1.data?.[0].revisionId || '' },
      orgId,
      userId,
      caller: 'test',
    }, { server: true })

    // Create new revision
    const result3 = await fictionRevision.queries.ManageRevision.serve({
      _action: 'create',
      fields: rev,
      orgId,
      userId,
      caller: 'test',
    }, { server: true })

    expect(result1.data?.[0].version).toBe(1)
    expect(result2.data?.[0].version).toBe(2)
    expect(result3.data?.[0].version).toBe(3)
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
      _action: 'delete',
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
