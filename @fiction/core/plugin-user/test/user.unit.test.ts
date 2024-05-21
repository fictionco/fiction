import { createTestUtils } from '@fiction/core/test-utils/init'
import { describe, expect, it, vi } from 'vitest'
import type { User } from '../types'
import { getTestEmail } from '../../test-utils'

vi.mock('../serverEmail', async () => {
  const actual = (await vi.importActual('../serverEmail'))
  return {
    ...actual,
    getEmailSMTPService: vi.fn(() => {
      return { sendEmail: vi.fn() }
    }),
  }
})

let user: User

describe('user tests', async () => {
  const testUtils = createTestUtils()
  await testUtils.fictionDb.init()

  it('creates user', async () => {
    const email = getTestEmail()
    const response = await testUtils?.fictionUser?.queries.ManageUser.serve(
      {
        _action: 'create',
        fields: { email, fullName: 'test' },
      },
      {},
    )

    if (!response?.data)
      throw new Error('problem creating user')

    user = response?.data

    expect(user?.userId).toBeTruthy()
    expect(user?.fullName).toBe('test')
    expect(user?.verify).toBeFalsy()
    expect(user?.emailVerified).toBeFalsy()
    expect(user?.email).toBe(email)
  })

  it('verifies account email', async () => {
    if (!user.email)
      throw new Error('email required')
    const response = await testUtils?.fictionUser?.queries.ManageUser.serve({ _action: 'verifyEmail', email: user.email, code: 'test' }, {})
    expect(response?.status).toMatchInlineSnapshot(`"success"`)
    expect(response?.message).toMatchInlineSnapshot(`"verification successful"`)
    expect(response?.data).toBeTruthy()
    expect(response?.status).toBe('success')
    expect(response?.message).toBe('verification successful')

    user = response?.data as User

    expect(user?.emailVerified).toBeTruthy()
    expect(user?.verify).toBeFalsy()
  })

  it('logs in with password', async () => {
    if (!user.email)
      throw new Error('email required')
    const response = await testUtils?.fictionUser?.queries.ManageUser.serve(
      { _action: 'login', where: { email: user.email }, password: 'test' },
      {},
    )
    expect(response?.status).toMatchInlineSnapshot(`"success"`)
    expect(response?.message).toMatchInlineSnapshot(`"successfully logged in"`)
    expect(response?.token).toBeTruthy()
    expect(response?.message).toContain('success')

    expect(response?.message).toMatchInlineSnapshot('"successfully logged in"')
    user = response?.data as User

    expect(user).toBeTruthy()
  })

  it('resets password', async () => {
    if (!user.email)
      throw new Error('email required')

    let triggered = false

    testUtils.fictionUser.events.on('resetPassword', async (args) => {
      triggered = true
    })

    await testUtils?.fictionUser?.queries.ManageUser.serve(
      { _action: 'event', eventName: 'resetPassword', where: { email: user.email } },
      {},
    )

    expect(triggered).toBeTruthy()
  })
})
