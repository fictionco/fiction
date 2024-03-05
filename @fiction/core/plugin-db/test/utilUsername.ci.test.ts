import { afterAll, describe, expect, it } from 'vitest'
import type { TestUtils } from '../../test-utils'
import { createTestUtils } from '../../test-utils'
import type { FictionDb } from '..'
import { objectId, shortId } from '../../utils'
import { standardTable } from '../../tbl'

describe('check username', async () => {
  const testUtils = await createTestUtils()
  const fictionDb = testUtils.fictionDb
  const initialized = await testUtils.init()
  const userId = initialized.user.userId
  const table = standardTable.user

  afterAll(async () => {
    await testUtils.close()
  })

  it('should return success for a valid, non-taken username', async () => {
    const validUsername = objectId()
    const response = await fictionDb.queries.CheckUsername.serve({ table, column: 'username', value: validUsername }, undefined)
    expect(response.data?.available).toBe('success')
  })

  it('should return fail for a username that is already taken', async () => {
    const validUsername = objectId({ prefix: 'test' })
    if (!userId)
      throw new Error('userId is undefined')

    const r = await testUtils.fictionUser.queries.ManageUser.serve({
      _action: 'update',
      userId,
      fields: { username: validUsername },
    }, { server: true })

    expect(r.data?.username).toBe(validUsername)

    const response = await fictionDb.queries.CheckUsername.serve({ table, column: 'username', value: validUsername }, undefined)

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
    const response = await fictionDb.queries.CheckUsername.serve({ table, column: 'username', value: reservedWord }, undefined)
    expect(response.data?.available).toBe('fail')
    expect(response.data?.reason).toBe('reserved')
  })

  it('should return error for an invalid username', async () => {
    const response = await fictionDb.queries.CheckUsername.serve({ table, column: 'username', value: `invalid$user-${shortId()}` }, undefined)
    expect(response.data?.available).toBe('fail')
    expect(response.data?.reason).toBe('invalid')
  })

  it('should return error on database error', async () => {
    const validUsername = objectId({ prefix: 'test' })
    const response = await fictionDb.queries.CheckUsername.serve({ table: 'missingTableFromTest', column: 'username', value: validUsername }, undefined)
    expect(response.data?.available).toBe('error')
    expect(response.data?.reason || '').toContain('error')
  })
})
