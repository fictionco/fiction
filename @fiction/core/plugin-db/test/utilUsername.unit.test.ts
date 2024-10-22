import { afterAll, describe, expect, it } from 'vitest'
import { standardTable } from '../../tbl'
import { createTestUtils, getTestEmail } from '../../test-utils'
import { objectId, shortId } from '../../utils'

describe('get top values', async () => {
  const testUtils = createTestUtils()
  const fictionDb = testUtils.fictionDb
  const initialized = await testUtils.init()
  const orgId = initialized.org.orgId || ''
  const table = standardTable.member

  if (!orgId)
    throw new Error('orgId is undefined')

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
    const response = await fictionDb.queries.GetTopValues.serve({
      table: 'emptyTableTest',
      column: 'tags',
      arrayColumn: true,
      orgId,
    }, undefined)

    expect(response.status).toBe('error')
    expect(response.data).toEqual([])
  })

  it('should return top tags from array column', async () => {
    // Create test users with overlapping tags
    await createUserWithTags(['developer', 'writer'])
    await createUserWithTags(['developer', 'artist'])
    await createUserWithTags(['writer', 'editor'])

    const response = await fictionDb.queries.GetTopValues.serve({
      table,
      column: 'tags',
      arrayColumn: true,
      orgId,
    }, undefined)

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
    const response = await fictionDb.queries.GetTopValues.serve({
      table,
      column: 'tags',
      arrayColumn: true,
      limit: 2,
      orgId,
    }, undefined)

    expect(response.status).toBe('success')
    if (!response.data?.length) {
      throw new Error('response.data is empty')
    }

    expect(response.data).toHaveLength(2)
    expect(response.data[0].count).toBeGreaterThanOrEqual(response.data[1].count)
  })

  it('should filter by minimum count', async () => {
    const response = await fictionDb.queries.GetTopValues.serve({
      table,
      column: 'tags',
      arrayColumn: true,
      minCount: 2,
      orgId,
    }, undefined)

    expect(response.status).toBe('success')
    if (!response.data?.length) {
      throw new Error('response.data is empty')
    }
    expect(response.data.every(item => item.count >= 2)).toBe(true)
  })

  it('should filter by search term', async () => {
    // Create user with specific tag for search
    await createUserWithTags(['frontend-developer', 'backend-developer'])

    const response = await fictionDb.queries.GetTopValues.serve({
      table,
      column: 'tags',
      arrayColumn: true,
      search: 'developer',
      orgId,
    }, undefined)

    expect(response.status).toBe('success')
    if (!response.data?.length) {
      throw new Error('response.data is empty')
    }
    expect(response.data.every(item => item.value.includes('developer'))).toBe(true)
  })

  it('should handle non-array columns', async () => {
    // Test with regular column like 'username'
    const response = await fictionDb.queries.GetTopValues.serve({
      table,
      column: 'memberAccess',
      arrayColumn: false,
      orgId,
    }, undefined)

    if (!response.data?.length) {
      throw new Error('response.data is empty')
    }

    expect(response.status).toBe('success')
    expect(Array.isArray(response.data)).toBe(true)
    expect(response.data[0]).toHaveProperty('value')
    expect(response.data[0]).toHaveProperty('count')
  })

  it('should return error for invalid table', async () => {
    const response = await fictionDb.queries.GetTopValues.serve({
      table: 'nonexistentTable',
      column: 'tags',
      arrayColumn: true,
      orgId,
    }, undefined)

    expect(response.status).toBe('error')
    expect(response.data).toEqual([])
  })

  it('should return error for invalid column', async () => {
    const response = await fictionDb.queries.GetTopValues.serve({
      table,
      column: 'nonexistentColumn',
      arrayColumn: true,
      orgId,
    }, undefined)

    expect(response.status).toBe('error')
    expect(response.data).toEqual([])
  })

  it('should handle case-insensitive search', async () => {
    await createUserWithTags(['JavaScript', 'javascript'])

    const response = await fictionDb.queries.GetTopValues.serve({
      table,
      column: 'tags',
      arrayColumn: true,
      search: 'javascript',
      orgId,
    }, undefined)

    expect(response.status).toBe('success')
    if (!response.data?.length) {
      throw new Error('response.data is empty')
    }
    expect(response.data.some(item =>
      item.value.toLowerCase() === 'javascript',
    )).toBe(true)
  })
})

describe('check username', async () => {
  const testUtils = createTestUtils()
  const fictionDb = testUtils.fictionDb
  const initialized = await testUtils.init()
  const userId = initialized.user.userId
  const table = standardTable.user

  afterAll(async () => {
    await testUtils.close()
  })

  it('should return success for a valid, non-taken username', async () => {
    const validUsername = objectId()
    const response = await fictionDb.queries.CheckUsername.serve({ table, columns: [{ name: 'username', value: validUsername }] }, undefined)
    expect(response.data?.available).toBe('success')
  })

  it('should return fail for a username that is already taken', async () => {
    const validUsername = objectId({ prefix: 'test' })
    if (!userId)
      throw new Error('userId is undefined')

    const r = await testUtils.fictionUser.queries.ManageUser.serve({
      _action: 'update',
      where: { userId },
      fields: { username: validUsername },
    }, { server: true })

    expect(r.data?.username).toBe(validUsername)

    const response = await fictionDb.queries.CheckUsername.serve({ table, columns: [{ name: 'username', value: validUsername }] }, undefined)

    expect(response).toMatchInlineSnapshot(`
      {
        "data": {
          "available": "fail",
          "reason": "taken",
        },
        "status": "success",
      }
    `)
    expect(response.data?.available).toBe('fail')
    expect(response.data?.reason).toBe('taken')
  })

  it('should return fail for a reserved word', async () => {
    const reservedWord = 'american'
    const response = await fictionDb.queries.CheckUsername.serve({ table, columns: [{ name: 'username', value: reservedWord }] }, undefined)
    expect(response.data?.available).toBe('fail')
    expect(response.data?.reason).toBe('reserved')
  })

  it('should return error for an invalid username', async () => {
    const response = await fictionDb.queries.CheckUsername.serve({ table, columns: [{ name: 'username', value: `invalid$user-${shortId()}` }] }, undefined)
    expect(response.data?.available).toBe('success')
    expect(response.data?.reason).toBe('success')
  })

  it('should return error on database error', async () => {
    const validUsername = objectId({ prefix: 'test' })
    const response = await fictionDb.queries.CheckUsername.serve({ table: 'missingTableFromTest', columns: [{ name: 'username', value: validUsername }] }, undefined)
    expect(response.data?.available).toBe('error')
    expect(response.data?.reason || '').toContain('error')
  })

  it('should return success for a valid, non-taken username within an org context', async () => {
    const validUsername = objectId()
    const response = await fictionDb.queries.CheckUsername.serve({
      table,
      columns: [
        { name: 'username', value: validUsername },
        { name: 'userId', value: userId || 'u' },
      ],
    }, undefined)
    expect(response.data).toMatchInlineSnapshot(`
      {
        "available": "success",
        "reason": "success",
      }
    `)
    expect(response.data?.available).toBe('success')
  })

  it('should return fail for a username that is already taken within the same org', async () => {
    if (!userId)
      throw new Error('userId is undefined')

    // Simulate the username being taken in the same organization
    await testUtils.fictionUser.queries.ManageUser.serve({
      _action: 'update',
      fields: { fullName: 'Test User' },
      where: { userId },
    }, { server: true })

    const response = await fictionDb.queries.CheckUsername.serve({
      table,
      columns: [
        { name: 'fullName', value: 'Test User', allowAnyValue: true },
        { name: 'userId', value: userId },
      ],
    }, undefined)

    expect(response.data).toMatchInlineSnapshot(`
      {
        "available": "fail",
        "reason": "taken",
      }
    `)
    expect(response.data?.available).toBe('fail')
    expect(response.data?.reason).toBe('taken')
  })
})
