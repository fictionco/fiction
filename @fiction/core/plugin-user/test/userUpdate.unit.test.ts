import { createTestUtils } from '@fiction/core/test-utils/init'
import { afterAll, describe, expect, it } from 'vitest'
import { getTestEmail } from '../../test-utils'

describe('user settings update', async () => {
  const testUtils = createTestUtils()
  const initialized = await testUtils.init()

  afterAll(async () => {
    await testUtils.close()
  })

  it('updates settings', async () => {
    const r = await testUtils?.fictionUser.queries.UpdateCurrentUser.serve(
      {
        _action: 'updateAccountSettings',
        fields: { fullName: 'elvis' },
      },
      { bearer: initialized?.user },
    )

    expect(r?.data?.fullName).toBe('elvis')
  })

  it('updates email', async () => {
    const email = getTestEmail()

    const verificationCode = await testUtils?.fictionUser.queries.UpdateCurrentUser.sendOneTimeCode({ email, userId: initialized?.user?.userId })
    let r = await testUtils?.fictionUser.queries.UpdateCurrentUser.serve(
      {
        _action: 'updateEmail',
        fields: { password: '12345', email, verificationCode },
      },
      { bearer: initialized?.user },
    )

    expect(r).toMatchInlineSnapshot(`
      {
        "code": "STOP",
        "context": "QueryUpdateCurrentUser",
        "data": undefined,
        "expose": true,
        "httpStatus": 200,
        "location": undefined,
        "message": "incorrect password",
        "status": "error",
      }
    `)
    expect(r?.status).toBe('error')
    expect(r?.message).toBe('incorrect password')

    r = await testUtils?.fictionUser.queries.UpdateCurrentUser.serve(
      {
        _action: 'updateEmail',
        fields: { password: 'test', email, verificationCode },
      },
      { bearer: initialized?.user },
    )
    expect(r.status).toMatchInlineSnapshot(`"success"`)
    expect(r?.status).toBe('success')
    expect(r?.data?.email).toBe(email)

    r = await testUtils?.fictionUser.queries.UpdateCurrentUser.serve(
      {
        _action: 'updatePassword',
        fields: { password: 'changed', verificationCode },
      },
      { bearer: initialized?.user },
    )
    expect(r.status).toMatchInlineSnapshot(`"success"`)
    expect(r?.status).toBe('success')
    expect(r?.message).toBe('password updated')
  }, 22000)
})
