/**
 * @vitest-environment happy-dom
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ANON_ID_KEY, getAnonymousId } from '../anon'

describe('getAnonymousId', () => {
  beforeEach(() => {
    // Clear cookies and local/session storage before each test
    document.cookie.split(';').forEach((cookie) => {
      document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`)
    })
    localStorage.clear()
    sessionStorage.clear()
  })

  it('should generate a new ID when none is present', () => {
    const result = getAnonymousId()
    expect(result.anonymousId).toMatch(/ano/) // Check if ID is generated
    expect(result.isNew).toBe(true)
  })

  it('should use existing ID from cookies', () => {
    document.cookie = `${ANON_ID_KEY}=existingAnonId; path=/`
    const result = getAnonymousId()
    expect(result.anonymousId).toBe('existingAnonId')
    expect(result.isNew).toBe(false)
  })

  it('should use existing ID from local storage', () => {
    localStorage.setItem(ANON_ID_KEY, 'existingAnonId')
    const result = getAnonymousId()
    expect(result.anonymousId).toBe('existingAnonId')
    expect(result.isNew).toBe(false)
  })

  it('should handle a server-side environment', () => {
    // Simulate server-side by temporarily removing 'window'
    const originalWindow = globalThis.window
    // @ts-expect-error - Remove 'window' from global scope
    delete globalThis.window
    const result = getAnonymousId()
    expect(result.anonymousId).toBe('')
    expect(result.isNew).toBe(false)
    globalThis.window = originalWindow // Restore 'window' after test
  })

  it('should mark user as new only on the first session', () => {
    // First call should set isNew to true
    let result = getAnonymousId()
    expect(result.isNew).toBe(true)

    // Subsequent call should see isNew as false
    result = getAnonymousId()
    expect(result.isNew).toBe(false)
  })

  afterEach(() => {
    // Clean up after each test if necessary
  })
})
