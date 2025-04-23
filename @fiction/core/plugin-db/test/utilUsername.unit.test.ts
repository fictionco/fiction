import { afterAll, describe, expect, it } from 'vitest'
import { standardTable } from '../../tbl'
import { createTestUtils } from '../../test-utils'
import { objectId, shortId } from '../../utils'

describe('check handle', async () => {
  const testUtils = createTestUtils()
  const fictionDb = testUtils.fictionDb
  const initialized = await testUtils.init()
  const userId = initialized.user.userId
  const table = standardTable.user

  afterAll(async () => {
    await testUtils.close()
  })

  it('should return success for a valid, non-taken handle', async () => {
    const validHandle = objectId()
    const response = await fictionDb.queries.CheckHandle.serve({ table, columns: [{ name: 'handle', value: validHandle }] }, undefined)
    expect(response.data?.available).toBe('success')
  })

  it('should return fail for a handle that is already taken', async () => {
    const validHandle = objectId({ prefix: 'test' })
    if (!userId)
      throw new Error('userId is undefined')

    const r = await testUtils.fictionUser.queries.ManageUser.serve({
      _action: 'update',
      where: { userId },
      fields: { handle: validHandle },
    }, { server: true })

    expect(r.data?.handle).toBe(validHandle)

    const response = await fictionDb.queries.CheckHandle.serve({ table, columns: [{ name: 'handle', value: validHandle }] }, undefined)

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
    const response = await fictionDb.queries.CheckHandle.serve({ table, columns: [{ name: 'handle', value: reservedWord }] }, undefined)
    expect(response.data?.available).toBe('fail')
    expect(response.data?.reason).toBe('reserved')
  })

  it('should return error for an invalid handle', async () => {
    const response = await fictionDb.queries.CheckHandle.serve({ table, columns: [{ name: 'handle', value: `invalid$user-${shortId()}` }] }, undefined)
    expect(response.data?.available).toBe('success')
    expect(response.data?.reason).toBe('success')
  })

  it('should return error on database error', async () => {
    const validHandle = objectId({ prefix: 'test' })
    const response = await fictionDb.queries.CheckHandle.serve({ table: 'missingTableFromTest', columns: [{ name: 'handle', value: validHandle }] }, undefined)
    expect(response.data?.available).toBe('error')
    expect(response.data?.reason || '').toContain('error')
  })

  it('should return success for a valid, non-taken handle within an org context', async () => {
    const validHandle = objectId()
    const response = await fictionDb.queries.CheckHandle.serve({
      table,
      columns: [
        { name: 'handle', value: validHandle },
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

  it('should return fail for a handle that is already taken within the same org', async () => {
    if (!userId)
      throw new Error('userId is undefined')

    // Simulate the handle being taken in the same organization
    await testUtils.fictionUser.queries.ManageUser.serve({
      _action: 'update',
      fields: { fullName: 'Test User' },
      where: { userId },
    }, { server: true })

    const response = await fictionDb.queries.CheckHandle.serve({
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
