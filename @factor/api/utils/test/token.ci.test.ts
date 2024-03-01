/**
 * @vitest-environment happy-dom
 * https://vitest.dev/config/#environment
 */
import { beforeAll, describe, expect, it } from 'vitest'
import type { TestUtils } from '../../test-utils/init'
import { createTestUtils } from '../../test-utils/init'
import { getCookie, getNakedDomain } from '../cookie'

let testUtils: TestUtils | undefined
describe('user token', () => {
  beforeAll(async () => {
    testUtils = await createTestUtils()
    testUtils.initialized = await testUtils.init()
  })

  it('saves the token in a parent domain cookie', () => {
    testUtils?.factorUser.clientToken({ action: 'set', token: 'test' })
    const cookieToken = getCookie(testUtils?.factorUser.clientTokenKey ?? '')

    expect(cookieToken).toEqual('test')
    expect(getNakedDomain()).toEqual('localhost')
  })

  it('gets token', () => {
    const token = testUtils?.factorUser.clientToken({ action: 'get' })
    expect(token).toEqual('test')
  })

  it('removes the token', () => {
    testUtils?.factorUser.clientToken({ action: 'destroy' })
    const cookieToken = getCookie(testUtils?.factorUser.clientTokenKey ?? '')

    expect(cookieToken).toBeFalsy()
  })
})
