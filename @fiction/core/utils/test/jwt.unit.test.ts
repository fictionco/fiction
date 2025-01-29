/**
 * @vitest-environment happy-dom
 */
import jwt from 'jsonwebtoken'
import { afterAll, describe, expect, it, vi } from 'vitest'

import { createTestUtils } from '../../test-utils/init'
import { getCookie, getNakedDomain } from '../cookie'
import { createUserToken, decodeUserToken, manageClientUserToken } from '../jwt'

describe('user token', async () => {
  const testUtils = createTestUtils()
  await testUtils.init()

  afterAll(() => testUtils.close())

  it('saves the token in a parent domain cookie', () => {
    manageClientUserToken({ key: 'test123', _action: 'set', token: 'test' })
    const cookieToken = getCookie('test123')

    expect(cookieToken).toEqual('test')
    expect(getNakedDomain()).toEqual('localhost')
  })

  it('gets token', () => {
    const token = manageClientUserToken({ key: 'test123', _action: 'get' })
    expect(token).toEqual('test')
  })

  it('removes the token', () => {
    manageClientUserToken({ key: 'test123', _action: 'destroy' })
    const cookieToken = getCookie('test123')

    expect(cookieToken).toBeFalsy()
  })
})

describe('jWT Functions with Expiration', () => {
  const tokenSecret = 'my_super_secret'
  const user = {
    userId: '12345',
    email: 'test@example.com',
    systemRole: 'admin' as const,
  }

  afterAll(() => {
    vi.useRealTimers()
  })

  it('creates a token with a specific expiration time', () => {
    // Creating a token that expires in 1 second for testing
    const token = createUserToken({ user, tokenSecret, expiresIn: 1 })
    expect(token).toBeDefined()

    // Wait for the token to expire
    vi.useFakeTimers()
    vi.advanceTimersByTime(1000)

    // Decoding the token after expiration should fail
    const action = () => decodeUserToken({ token, tokenSecret })
    expect(action).toThrowErrorMatchingInlineSnapshot(`[EndpointError: token verification failed (jwt expired)]`)
  })

  it('successfully decodes a token before it expires', () => {
    // Creating a token with short but valid expiration
    const token = createUserToken({ user, tokenSecret, expiresIn: 5 })
    const decoded = decodeUserToken({ token, tokenSecret })
    expect(decoded).toEqual({
      userId: user.userId,
      email: user.email,
      systemRole: user.systemRole,
      iat: expect.any(Number),
      exp: expect.any(Number),
      verifyEmail: false,
    })
  })

  it('throws an error if the token has expired', () => {
    // Creating a token that expires almost immediately
    const token = createUserToken({ user, tokenSecret, expiresIn: 0 })

    // Function to advance time and decode token
    const decodeExpiredToken = () => {
      vi.advanceTimersByTime(1) // Advance the timers to ensure the token is expired
      return decodeUserToken({ token, tokenSecret })
    }

    // Checking if the error for expired token is thrown
    expect(decodeExpiredToken).toThrowErrorMatchingInlineSnapshot(`[EndpointError: token verification failed (jwt expired)]`)
  })
})

describe('jwt Functions', () => {
  const tokenSecret = 'my_super_secret'
  const user = {
    userId: '12345',
    email: 'test@example.com',
    systemRole: 'admin' as const,
  }

  it('successfully creates and decodes a token', () => {
    const token = createUserToken({ user, tokenSecret })
    expect(token).toBeDefined()

    const decoded = decodeUserToken({ token, tokenSecret })
    expect(decoded).toEqual({
      userId: user.userId,
      exp: expect.any(Number),
      email: user.email,
      systemRole: user.systemRole,
      iat: expect.any(Number),
      verifyEmail: false,
    })
  })

  it('throws an error when tokenSecret is not provided for creating a token', () => {
    const action = () => createUserToken({ user, tokenSecret: '' })
    expect(action).toThrowErrorMatchingInlineSnapshot(`[EndpointError: tokenSecret is not set]`)
  })

  it('throws an error when tokenSecret is not provided for decoding a token', () => {
    const token = createUserToken({ user, tokenSecret })
    const action = () => decodeUserToken({ token, tokenSecret: '' })
    expect(action).toThrowErrorMatchingInlineSnapshot(`[EndpointError: tokenSecret is not set]`)
  })

  it('throws an error when the token is missing userId or email', () => {
    // Create a malformed token manually
    const malformedToken = jwt.sign({ role: 'admin' }, tokenSecret)
    const action = () => decodeUserToken({ token: malformedToken, tokenSecret })
    expect(action).toThrowErrorMatchingInlineSnapshot(`[EndpointError: token missing userId or email]`)
  })
})

describe('manageClientUserToken', () => {
  const key = 'testTokenKey'
  const tokenValue = 'testTokenValue'

  it('sets a cookie and retrieves it correctly', () => {
    manageClientUserToken({ _action: 'set', key, token: tokenValue })
    const retrievedToken = manageClientUserToken({ _action: 'get', key })
    expect(retrievedToken).toBe(tokenValue)
  })

  it('removes a cookie correctly', () => {
    // First set a cookie
    manageClientUserToken({ _action: 'set', key, token: tokenValue })

    // Now destroy it
    manageClientUserToken({ _action: 'destroy', key })

    // Attempt to retrieve the now-deleted cookie
    const retrievedToken = manageClientUserToken({ _action: 'get', key })
    expect(retrievedToken).toBe('')
  })

  it('returns undefined if trying to get a non-existent cookie', () => {
    const retrievedToken = manageClientUserToken({ _action: 'get', key: 'nonexistent' })
    expect(retrievedToken).toBe('')
  })
})
