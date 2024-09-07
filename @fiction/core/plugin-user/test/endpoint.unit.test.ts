import { standardTable } from '@fiction/core/tbl'
import { describe, expect, it } from 'vitest'
import type { Request } from 'express'
import { createTestUtils, getTestEmail } from '../../test-utils'
import { dayjs } from '../../utils/libraries'
import { comparePassword } from '../utils'
import type { User } from '..'
import type { ManageUserParams } from '../endpoint'

describe('user endpoint tests', async () => {
  const testUtils = createTestUtils()

  await testUtils.init()

  let workingUser: User | undefined

  it('creates a new user', async () => {
    const fictionUser = testUtils.fictionUser
    const email = getTestEmail()
    // Prepare the parameters for the 'create' action
    const params = {
      _action: 'create',
      fields: {
        email,
        password: 'password123',
        orgName: 'Test Org',
      },
      isVerifyEmail: false,
    } as const

    // Meta information required for the endpoint
    const meta = {
      request: { ip: '192.168.1.1' } as Request, // Add necessary request meta data here
    }

    // Execute the query to create the user
    const response = await fictionUser.queries.ManageUser.serve(params, meta)

    workingUser = response.user

    // Check if the response indicates a successful user creation
    expect(response.status).toBe('success')
    expect(response.isNew).toBe(true)
    expect(response.user).toBeDefined()
    expect(response.user?.email).toBe(params.fields.email.toLowerCase().trim())
    expect(response.user?.orgs?.length).toBe(1)
    expect(response.user?.userId).toBe(response.data?.userId)
    expect(response.token?.length).toBeGreaterThan(10)
    expect(response.message).toMatchInlineSnapshot(`"user created"`)
    expect(response.user?.hashedPassword).toBeFalsy()
    expect(response.user?.verify?.code).toBeFalsy()
  })

  it('handles code and no create user on getCreate', async () => {
    const fictionUser = testUtils.fictionUser

    const email = workingUser?.email
    const userId = workingUser?.userId

    if (!email || !userId)
      throw new Error('No email / userId')

    const workingUserVerify = await fictionUser.queries.ManageUser.serve({ _action: 'retrieve', where: { userId } }, { server: true, isTest: true, returnAuthority: ['verify'] })

    expect(workingUserVerify.status).toBe('success')
    expect(workingUserVerify.data?.verify?.code).toBeTruthy()
    expect(workingUserVerify.data?.verify?.expiresAt).toBeTruthy()

    // Prepare the parameters for the 'create' action
    const params: ManageUserParams & { _action: 'getCreate' } = {
      _action: 'getCreate',
      where: { email },
      refreshCode: true,
    } as const

    const response = await fictionUser.queries.ManageUser.serve(params, { server: true, isTest: true, returnAuthority: ['verify'] })

    expect(response.status).toBe('success')
    expect(response.data?.email).toBe(email)
    expect(response.data?.userId).toBe(workingUser?.userId)
    expect(response.data?.verify?.code).not.toBe(workingUserVerify.data?.verify?.code)
    expect(response.data?.verify?.expiresAt).not.toBe(workingUserVerify.data?.verify?.expiresAt)
  })

  it('updates user password', async () => {
    const fictionUser = testUtils.fictionUser
    const fictionDb = testUtils.fictionDb
    const pw = 'newPassword123'
    const updateParams = {
      _action: 'update',
      fields: { password: pw },
      where: { userId: workingUser?.userId || '' },
    } as const
    const meta = {
      request: { ip: '192.168.1.1' } as Request,
      bearer: workingUser,
    }
    const updateResponse = await fictionUser.queries.ManageUser.serve(updateParams, meta)

    // Verify the updated password is hashed and not returned in response
    expect(updateResponse.status).toBe('success')
    expect(updateResponse.user?.hashedPassword).toBeFalsy()
    expect(updateResponse.message).toMatchInlineSnapshot(`"updated"`)

    const db = fictionDb.client()

    const dbUser = await db.select<User>('*').from(standardTable.user).where({ userId: workingUser?.userId }).first()

    expect(dbUser?.email).toBe(workingUser?.email)

    if (!dbUser?.hashedPassword)
      throw new Error('No hashed password')

    const isMatch = await comparePassword(pw, dbUser?.hashedPassword)

    expect(isMatch).toBe(true)
  })

  it('updates an existing user', async () => {
    const fictionUser = testUtils.fictionUser

    // Assuming a user has been created already and we know their ID
    const existingUserId = workingUser?.userId

    // Prepare the parameters for the 'update' action
    const updateParams = {
      _action: 'update',
      fields: {
        fullName: 'John Lennon',
      },
      where: {
        userId: existingUserId!,
      },
    } as const

    // Meta information required for the endpoint
    const meta = {
      request: { ip: '192.168.1.1' } as Request,
      bearer: workingUser,
    }

    // Execute the query to update the user
    const updateResponse = await fictionUser.queries.ManageUser.serve(updateParams, meta)

    workingUser = updateResponse.user

    // Check if the response indicates a successful user update
    expect(updateResponse.status).toBe('success')
    expect(updateResponse.user).toBeDefined()
    expect(updateResponse.user?.fullName).toBe('John Lennon')
    expect(updateResponse.message).toMatchInlineSnapshot(`"updated"`)
    expect(updateResponse.user?.orgs?.length).toBe(1)
    expect(updateResponse.user?.userId).toBe(existingUserId)
    expect(updateResponse?.token).toBeFalsy()

    expect(Object.keys(workingUser?.geo || {})).toMatchInlineSnapshot(`
      [
        "ip",
        "cityName",
        "latitude",
        "timezone",
        "longitude",
        "regionName",
        "countryCode",
        "ipOrganization",
      ]
    `)
  })

  it('retrieves an existing user by email', async () => {
    const fictionUser = testUtils.fictionUser

    // Assuming the user's email is known (from previous tests or setup)
    const userEmail = workingUser?.email

    // Prepare the parameters for the 'retrieve' action
    const retrieveParams = {
      _action: 'retrieve',
      where: {
        email: userEmail!,
      },
    } as const

    // Meta information required for the endpoint
    const meta = {
      request: { ip: '192.168.1.1' } as Request,
    }

    // Execute the query to retrieve the user
    const retrieveResponse = await fictionUser.queries.ManageUser.serve(retrieveParams, meta)

    // Check if the response has successfully retrieved the user
    expect(retrieveResponse.status).toBe('success')
    expect(retrieveResponse.user).toBeDefined()
    expect(retrieveResponse.user?.email).toBe(userEmail)
    expect(retrieveResponse.user?.userId).toBe(workingUser?.userId)
  })

  it('verifies a user email', async () => {
    const fictionUser = testUtils.fictionUser
    const fictionDb = testUtils.fictionDb

    const db = fictionDb.client()

    await db
      .table(standardTable.user)
      .where({ userId: workingUser?.userId })
      .update({ emailVerified: false, verify: { code: '123456', expiresAt: dayjs().add(1, 'day').toISOString(), context: 'verifyEmail' } })

    const pw = 'anotherPassword'
    const verifyEmailParams = {
      _action: 'verifyEmail',
      email: workingUser?.email || '',
      code: '123456', // This should be the code generated during the user creation or set up for the test
      password: pw, // Optional, only if updating the password
    } as const

    // Execute the query to verify the user's email
    const verifyEmailResponse = await fictionUser.queries.ManageUser.serve(verifyEmailParams, { server: true })

    // Check if the email verification was successful
    expect(verifyEmailResponse.status).toBe('success')
    expect(verifyEmailResponse.user).toBeDefined()
    expect(verifyEmailResponse.user?.emailVerified).toBe(true)
    expect(verifyEmailResponse.message).toMatchInlineSnapshot(`"email verified"`)

    const dbUser = await db.select<User>('*').from(standardTable.user).where({ email: workingUser?.email }).first()

    expect(dbUser?.email).toBe(workingUser?.email)

    if (!dbUser?.hashedPassword)
      throw new Error('No hashed password')

    const isMatch = await comparePassword(pw, dbUser?.hashedPassword)

    expect(isMatch).toBe(true)
  })

  it('updates user email and requires verification', async () => {
    const fictionUser = testUtils.fictionUser
    const newEmail = getTestEmail()
    const updateParams = {
      _action: 'update',
      fields: { email: newEmail },
      code: '123456',
      where: { userId: workingUser?.userId || '' },
    } as const
    const meta = {
      request: { ip: '192.168.1.1' } as Request,
      bearer: workingUser,
    }
    const updateResponse = await fictionUser.queries.ManageUser.serve(updateParams, meta)

    expect(updateResponse.status).toBe('success')
    expect(updateResponse.user?.email).toBe(newEmail)
    expect(updateResponse.user?.emailVerified).toBeTruthy()
    expect(updateResponse.message).toBe('updated')
  })

  it('fails to update email without bearer', async () => {
    const fictionUser = testUtils.fictionUser
    const newEmail = getTestEmail()
    const updateParams = {
      _action: 'update',
      fields: { email: newEmail },
      where: { userId: workingUser?.userId || '' },
    } as const
    const meta = {
      request: { ip: '192.168.1.1' } as Request,
      bearer: null, // No bearer passed intentionally
    }

    // @ts-expect-error test
    await expect(fictionUser.queries.ManageUser.run(updateParams, meta)).rejects.toThrow('bearer required')
  })
})
