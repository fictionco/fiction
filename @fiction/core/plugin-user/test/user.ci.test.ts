import bcrypt from 'bcrypt'
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
  const testUtils = await createTestUtils()
  await testUtils.factorDb.init()

  it('creates user', async () => {
    const email = getTestEmail()
    const response = await testUtils?.factorUser?.queries.ManageUser.serve(
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
    expect(user?.verificationCode).toBeFalsy()
    expect(user?.emailVerified).toBeFalsy()
    expect(user?.email).toBe(email)
  })

  it('verifies account email', async () => {
    if (!user.email)
      throw new Error('email required')
    const response = await testUtils?.factorUser?.queries.VerifyAccountEmail.serve({ email: user.email, verificationCode: 'test' }, undefined)
    expect(response?.status).toMatchInlineSnapshot(`"success"`)
    expect(response?.message).toMatchInlineSnapshot(`"verification successful"`)
    expect(response?.data).toBeTruthy()
    expect(response?.status).toBe('success')
    expect(response?.message).toBe('verification successful')

    user = response?.data as User

    expect(user?.emailVerified).toBeTruthy()
    expect(user?.verificationCode).toBeFalsy()
  })

  it('sets password', async () => {
    if (!user.email)
      throw new Error('email required')
    const response = await testUtils?.factorUser?.queries.SetPassword.serve(
      {
        email: user.email,
        verificationCode: 'test',
        password: 'test',
      },
      { bearer: user },
    )
    expect(response?.message).toMatchInlineSnapshot(`"new password created"`)
    expect(response?.message).toContain('password created')
    user = response?.data as User

    expect(bcrypt.compare('test', user?.hashedPassword ?? '')).toBeTruthy()
    expect(response?.token).toBeTruthy()

    const result = testUtils?.factorUser.decodeClientToken(
      response?.token,
    )

    expect(result?.email).toBe(user.email)
  })

  it('logs in with password', async () => {
    if (!user.email)
      throw new Error('email required')
    const response = await testUtils?.factorUser?.queries.Login.serve(
      {
        email: user.email,
        password: 'test',
      },
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
    const response = await testUtils?.factorUser?.queries.ResetPassword.serve(
      {
        email: user.email,
      },
      undefined,
    )

    expect(response?.status).toBe('success')

    if (!response?.internal)
      throw new Error('code required')

    const response2 = await testUtils?.factorUser?.queries.SetPassword.serve(
      {
        email: user.email,
        verificationCode: response?.internal,
        password: 'test',
      },
      { bearer: user },
    )

    expect(response2?.status).toBe('success')
  })

  it('updates the user', async () => {
    if (!user.email)
      throw new Error('email required')
    const response = await testUtils?.factorUser?.queries.ManageUser.serve(
      {
        _action: 'update',
        email: user.email,
        fields: {
          fullName: 'testUpdate',
          facebook: 'https://www.facebook.com/apowers',
        },
      },
      { bearer: user },
    )

    expect(response?.status).toBe('success')
    expect(response?.data?.fullName).toBe('testUpdate')
    expect(response?.data?.facebook).toBe('https://www.facebook.com/apowers')
  })

  it('retrieves public user information', async () => {
    if (!user.email)
      throw new Error('email required')

    // Assuming there's a setup to have a user created before this test runs
    const response = await testUtils?.factorUser?.queries.ManageUser.serve({
      _action: 'getPublic',
      email: user.email,
    }, {})

    expect(response?.status).toBe('success')
    // Validate that only public information is returned
    expect(response?.data?.email).toBe(user.email)
    // Ensure no sensitive information is exposed
    expect(response?.data?.hashedPassword).toBeFalsy()
  })

  // Testing retrieval of private user information
  it('retrieves private user information', async () => {
    if (!user.userId)
      throw new Error('userId required')

    // Assuming authentication setup correctly in tests
    const response = await testUtils?.factorUser?.queries.ManageUser.serve({
      _action: 'getPrivate',
      userId: user.userId,
    }, { bearer: user })

    expect(response?.status).toBe('success')
    // Validate retrieval of more detailed information
    expect(response?.data?.fullName).toBe('testUpdate')
  })

  // Testing error handling for invalid action
  it('handles invalid action error', async () => {
    // @ts-expect-error test
    const response = await testUtils?.factorUser?.queries.ManageUser.serve({
      _action: 'invalidAction' as any, // Forcing TypeScript to allow an invalid action for the test
    }, {})

    expect(response?.status).toBe('error')
    expect(response?.message).toContain('Invalid action')
  })
})
