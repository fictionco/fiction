import { Endpoint, type EndpointMeta, objectId, standardTable } from '@fiction/core'
import { createTestUtils, getTestEmail } from '@fiction/core/test-utils'
import { afterAll, describe, expect, it } from 'vitest'

describe('get top values', async () => {
  const testUtils = createTestUtils()
  const fictionUser = testUtils.fictionUser
  const initialized = await testUtils.init()
  const meta = { bearer: initialized.user } as EndpointMeta
  const orgId = initialized.org.orgId || ''
  const table = standardTable.member

  if (!orgId)
    throw new Error('orgId is undefined')

  const where = { orgId }

  afterAll(async () => {
    await testUtils.close()
  })

  // Helper to create test users with tags
  async function createUserWithTags(tags: string[]) {
    const r = await testUtils.fictionUser.queries.ManageUser.serve({
      _action: 'create',
      fields: {
        email: getTestEmail(),
        username: objectId({ prefix: 'test' }),
      },
    }, { server: true })

    const user = r.data

    if (!user?.userId)
      throw new Error('user is undefined')

    await testUtils.fictionUser.queries.ManageMemberRelation.serve(
      {
        memberId: user.userId,
        orgId,
        memberAccess: 'admin',
        _action: 'create',
        tags,
      },
      { server: true },
    )

    return r
  }

  it('should return empty array for table with no records', async () => {
    const response = await fictionUser.queries.GetTopValues.serve({
      table: 'emptyTableTest',
      column: 'tags',
      arrayColumn: true,
      where,
    }, {})

    expect(response.status).toBe('error')
    expect(response.data).toEqual([])
  })

  it('should return top tags from array column', async () => {
    // Create test users with overlapping tags
    await createUserWithTags(['developer', 'writer'])
    await createUserWithTags(['developer', 'artist'])
    await createUserWithTags(['writer', 'editor'])

    const response = await fictionUser.queries.GetTopValues.serve({
      table,
      column: 'tags',
      arrayColumn: true,
      where,
    }, {})

    expect(response.data).toMatchInlineSnapshot(`
      [
        {
          "count": 2,
          "value": "developer",
        },
        {
          "count": 2,
          "value": "writer",
        },
        {
          "count": 1,
          "value": "artist",
        },
        {
          "count": 1,
          "value": "editor",
        },
      ]
    `)

    expect(response.status).toBe('success')
    expect(response.data).toMatchObject([
      { value: 'developer', count: 2 },
      { value: 'writer', count: 2 },
      { value: 'artist', count: 1 },
      { value: 'editor', count: 1 },
    ])
  })

  it('should respect limit parameter', async () => {
    const response = await fictionUser.queries.GetTopValues.serve({
      table,
      column: 'tags',
      arrayColumn: true,
      limit: 2,
      where,
    }, {})

    expect(response.status).toBe('success')
    if (!response.data?.length) {
      throw new Error('response.data is empty')
    }

    expect(response.data).toHaveLength(2)
    expect(response.data[0].count).toBeGreaterThanOrEqual(response.data[1].count)
  })

  it('should filter by minimum count', async () => {
    const response = await fictionUser.queries.GetTopValues.serve({
      table,
      column: 'tags',
      arrayColumn: true,
      minCount: 2,
      where,
    }, {})

    expect(response.status).toBe('success')
    if (!response.data?.length) {
      throw new Error('response.data is empty')
    }
    expect(response.data.every(item => item.count >= 2)).toBe(true)
  })

  it('should filter by search term', async () => {
    // Create user with specific tag for search
    await createUserWithTags(['frontend-developer', 'backend-developer'])

    const response = await fictionUser.queries.GetTopValues.serve({
      table,
      column: 'tags',
      arrayColumn: true,
      search: 'developer',
      where,
    }, {})

    expect(response.status).toBe('success')
    if (!response.data?.length) {
      throw new Error('response.data is empty')
    }
    expect(response.data.every(item => item.value.includes('developer'))).toBe(true)
  })

  it('should handle non-array columns', async () => {
    // Test with regular column like 'username'
    const response = await fictionUser.queries.GetTopValues.serve({
      table,
      column: 'memberAccess',
      arrayColumn: false,
      where,
    }, {})

    if (!response.data?.length) {
      throw new Error('response.data is empty')
    }

    expect(response.status).toBe('success')
    expect(Array.isArray(response.data)).toBe(true)
    expect(response.data[0]).toHaveProperty('value')
    expect(response.data[0]).toHaveProperty('count')
  })

  it('should return error for invalid table', async () => {
    const response = await fictionUser.queries.GetTopValues.serve({
      table: 'nonexistentTable',
      column: 'tags',
      arrayColumn: true,
      where,
    }, {})

    expect(response.status).toBe('error')
    expect(response.data).toEqual([])
  })

  it('should return error for invalid column', async () => {
    const response = await fictionUser.queries.GetTopValues.serve({
      table,
      column: 'nonexistentColumn',
      arrayColumn: true,
      where,
    }, {})

    expect(response.status).toBe('error')
    expect(response.data).toEqual([])
  })

  it('should handle case-insensitive search', async () => {
    await createUserWithTags(['JavaScript', 'javascript'])

    const response = await fictionUser.queries.GetTopValues.serve({
      table,
      column: 'tags',
      arrayColumn: true,
      search: 'javascript',
      where,
    }, {})

    expect(response.status).toBe('success')
    if (!response.data?.length) {
      throw new Error('response.data is empty')
    }
    expect(response.data.some(item =>
      item.value.toLowerCase() === 'javascript',
    )).toBe(true)
  })
})
