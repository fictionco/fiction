/**
 * @vitest-environment happy-dom
 */
import { createTestUtils } from '@fiction/core/test-utils/init'
import { afterAll, describe, expect, it } from 'vitest'
import { decodeUserToken } from '@fiction/core/utils/jwt'
import { getTestEmail, snap } from '../../test-utils'
import type { User } from '../types'

let user: Partial<User> | undefined
let token: string | undefined
const email = getTestEmail()

describe('user tests', async () => {
  const testUtils = createTestUtils()
  await testUtils.init()

  afterAll(async () => testUtils.close())

  it('creates user', async () => {
    const { fictionUser } = testUtils ?? {}
    const response = await fictionUser?.requests.ManageUser.request({
      _action: 'create',
      fields: { fullName: 'test', email },
    })

    expect(response?.data).toBeTruthy()

    user = response?.user
    token = response?.token

    // expect(spy).toHaveBeenCalled()

    delete user?.geo

    expect(snap(user, { maskedKeys: ['cityName', 'timezone', 'ipOrganization', 'latitude', 'longitude', 'regionName'] })).toMatchInlineSnapshot(`
      {
        "createdAt": "[dateTime:]",
        "email": "[email:********+**********@*****.***]",
        "fullName": "[name:****]",
        "ip": "[geo:::****:****:***]",
        "lastSeenAt": "[dateTime:]",
        "orgs": "[object Object]",
        "role": "subscriber",
        "status": "active",
        "updatedAt": "[dateTime:]",
        "userId": "[id:***************************]",
      }
    `)

    expect(user?.userId).toBeTruthy()
    expect(user?.fullName).toBe('test')
    expect(token).toBeTruthy()
    expect(user?.verify).toBeFalsy()
    expect(user?.emailVerified).toBeFalsy()

    if (!token)
      throw new Error('token not returned')

    const fields = decodeUserToken({ token, tokenSecret: testUtils?.fictionUser.settings.tokenSecret })

    expect(fields).toBeTruthy()
  }, 20000)

  it('verifies with code', async () => {
    const { fictionUser } = testUtils ?? {}
    const response = await fictionUser?.requests.ManageUser.request({
      _action: 'verifyEmail',
      email,
      code: 'test',
    })

    if (!response?.data) {
      console.warn(response)
      throw new Error('problem verifying user')
    }

    user = response.data

    expect(response.message).toMatchInlineSnapshot(`"email verified"`)
    expect(user?.emailVerified).toBeTruthy()
  })

  it('sets the fallback organization', async () => {
    const { fictionUser } = testUtils ?? {}

    expect(fictionUser.fallbackOrgId.value).toBeTruthy()
    expect(fictionUser.activeOrgId.value).toBeTruthy()
  })

  it('handles route organization', async () => {
    const { fictionUser } = testUtils ?? {}

    expect(fictionUser.fallbackOrgId.value).toBeTruthy()
    expect(fictionUser.activeOrgId.value).toBeTruthy()
  })
})
