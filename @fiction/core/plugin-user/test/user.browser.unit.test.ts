/**
 * @vitest-environment happy-dom
 */
import type { User } from '../types'
import { afterAll, describe, expect, it } from 'vitest'
import { getTestEmail, snap } from '../../test-utils'
import { createTestUtils } from '../../test-utils/init'
import { decodeUserToken } from '../../utils/jwt'

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
        "accounts": "null",
        "avatar": "null",
        "birthday": "null",
        "company": "null",
        "createdAt": "[datetime:TRUTHY]",
        "email": "[email:TRUTHY]",
        "emailVerified": "false",
        "fullName": "[name:TRUTHY]",
        "gender": "null",
        "googleId": "null",
        "headline": "null",
        "inviterId": "null",
        "ip": "[geo:TRUTHY]",
        "isSuperAdmin": "false",
        "lastSeenAt": "[datetime:TRUTHY]",
        "loadOrgId": "null",
        "needsOnboarding": "false",
        "onboard": "null",
        "orgs": [
          {
            "accessTokens": "null",
            "address": "null",
            "apiSecret": "null",
            "avatar": "null",
            "config": "null",
            "createdAt": "[datetime:TRUTHY]",
            "createdByUserId": "[id:TRUTHY]",
            "customer": "null",
            "customerId": "null",
            "customerIdTest": "null",
            "customerTest": "null",
            "extend": "null",
            "lastSeenAt": "[datetime:TRUTHY]",
            "legal": "null",
            "needsOnboarding": "false",
            "onboard": "null",
            "email": "[email:TRUTHY]",
            "orgId": "[id:TRUTHY]",
            "name": "[name:TRUTHY]",
            "orgPlan": "null",
            "orgStatus": "active",
            "publication": "null",
            "slug": "null",
            "specialPlan": "null",
            "timezone": "null",
            "updatedAt": "[datetime:TRUTHY]",
            "url": "null",
          },
        ],
        "phone": "null",
        "pushSubscription": "null",
        "status": "active",
        "systemRole": "subscriber",
        "tags": "null",
        "title": "null",
        "updatedAt": "[datetime:TRUTHY]",
        "userId": "[id:TRUTHY]",
        "username": "null",
        "websiteUrl": "null",
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
      code: '123456',
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
