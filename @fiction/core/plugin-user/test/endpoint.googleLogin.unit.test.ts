import { beforeEach, describe, expect, it, vi } from 'vitest'

import { objectId } from '../..'
import { getTestEmail } from '../../test-utils'
import { createTestUtils } from '../../test-utils/init'

const email = getTestEmail()
const googleId = objectId()
const email2 = getTestEmail()
const googleId2 = objectId()
const basicCredentialData = {
  email_verified: true,
  iss: 'https://accounts.google.com',
  nbf: 1_647_376_804,
  aud: 'not an id',
  azp: 'not an id',
  name: 'test test',
  picture: 'https://lh3.googleusercontent.com/a-/AOh14GhI8nBQQUi1e3yVZt76sMwxw_PNfaHNxCBxK0R2Occ=s96-c',
  given_name: 'test',
  family_name: 'test',
  iat: 1_647_377_104,
  exp: 1_647_377_104,
  jti: 'c09e27fb6971eeefae223d5764cb806b00f56e6',
}

describe('google auth', async () => {
  const testUtils = createTestUtils()
  await testUtils.fictionDb.init()

  testUtils.fictionUser.googleClientId = 'mocked_id'
  testUtils.fictionUser.googleClientSecret = 'mocked_secret'

  beforeEach(async () => {
    vi.resetModules()
    vi.restoreAllMocks()
  })

  vi.mock('google-auth-library', () => {
    return {
      OAuth2Client: vi.fn(() => ({
        verifyIdToken: vi.fn(() => {
          return {
            getPayload: vi
              .fn()
              .mockReturnValueOnce({ sub: googleId, email, ...basicCredentialData })
              .mockReturnValueOnce({ sub: googleId2, email: email2, ...basicCredentialData }),
          }
        }),
      })),
    }
  })

  it('if no user exists, creates one with isNew = true, returns token', async () => {
    const response = await testUtils?.fictionUser?.queries.ManageUser.serve(
      { credential: 'not a token', _action: 'loginGoogle' },
      { server: true },
    )

    expect(response?.status).toMatchInlineSnapshot(`"success"`)
    expect(response?.status).toBe('success')
    expect(response?.isNew).toBe(true)
    expect(response?.token).toBeTruthy()

    const user = response.data

    expect(user?.userId).toBeTruthy()
    expect(user?.email).toBe(email)
    expect(user?.googleId).toBe(googleId)
    expect(user?.fullName).toBe('test test')
    expect(response?.user?.userId).toBe(user?.userId)
    expect(user?.orgs?.length).toBe(1)
  })

  it('if user exists, returns login token, isNew = false', async () => {
    const response = await testUtils?.fictionUser?.queries.ManageUser.serve(
      { credential: 'not a token', _action: 'loginGoogle' },
      { server: true },
    )

    expect(response?.status).toBe('success')
    expect(response?.isNew).toBe(false)
    expect(response?.token).toBeTruthy()
    expect(response?.data?.userId).toBeTruthy()
    expect(response?.data?.fullName).toBe('test test')
    expect(response?.data?.email).toBeTruthy()
    expect(response?.data?.googleId).toBe(googleId)
    expect(response?.user?.userId).toBeTruthy()
  })

  it('if google login user exists with email and no googleId, if email is verified it links the googleId to the user', async () => {
    const responseCreate = await testUtils?.fictionUser?.queries.ManageUser.serve({
      _action: 'create',
      fields: { email: email2, fullName: 'test', password: 'test' },
    }, {})

    expect(responseCreate?.status).toBe('success')

    const responseLoginGoogle = await testUtils?.fictionUser?.queries.ManageUser.serve(
      { credential: 'not a token', _action: 'loginGoogle' },
      { server: true },
    )

    expect(responseLoginGoogle?.status).toBe('success')
    expect(responseLoginGoogle?.isNew).toBe(false)
    expect(responseLoginGoogle?.token).toBeTruthy()
    expect(responseLoginGoogle?.message).toMatchInlineSnapshot(
      '"login successful"',
    )
    expect(responseLoginGoogle?.user?.userId).toBeTruthy()
  })
})
