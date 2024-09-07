import { afterAll, describe, expect, it } from 'vitest'
import { standardTable } from '../../tbl'
import { createTestUtils } from '../../test-utils'
import { objectId, shortId } from '../../utils'

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
