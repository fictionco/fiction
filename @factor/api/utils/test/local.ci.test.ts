/**
 * @vitest-environment happy-dom
 * https://vitest.dev/config/#environment
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { localRef } from '../local'
import { waitFor } from '../utils'

describe('localRef', () => {
  beforeEach(() => {
    // Clear localStorage and sessionStorage before each test
    localStorage.clear()
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it('should retrieve a string from localStorage', () => {
    const key = 'testKey'
    const defaultValue = 'default'
    localStorage.setItem(key, JSON.stringify('storedValue'))

    const result = localRef({ key, def: defaultValue, lifecycle: 'local' })
    expect(result.value).toBe('storedValue')
  })

  it('should retrieve an object from sessionStorage', async () => {
    const key = 'testObj'
    const defaultValue = {}
    const storedValue = { a: 1, b: 'test' }
    sessionStorage.setItem(key, JSON.stringify(storedValue))

    const result = localRef({ key, def: defaultValue, lifecycle: 'session' })
    expect(result.value).toEqual(storedValue)
  })

  it('should use default value if key is not in localStorage', () => {
    const key = 'nonexistentKey'
    const defaultValue = 'default'

    const result = localRef({ key, def: defaultValue, lifecycle: 'local' })
    expect(result.value).toBe(defaultValue)
  })

  it('updates localStorage when value changes', async () => {
    const key = 'updateKey'
    const defaultValue = 'initial'
    const newValue = 'updated'

    const result = localRef({ key, def: defaultValue, lifecycle: 'local' })
    result.value = newValue
    await waitFor(50) // Wait for the Vue reactivity system to update

    expect(localStorage.getItem(key)).toBe(JSON.stringify(newValue))
  })

  it('returns the same ref for the same key', () => {
    const key = 'sharedKey'
    const defaultValue = 'default'

    const firstCall = localRef({ key, def: defaultValue, lifecycle: 'local' })
    const secondCall = localRef({ key, def: defaultValue, lifecycle: 'local' })

    expect(firstCall).toBe(secondCall)
  })

  it('handles different data types correctly', () => {
    const key = 'dataTypeKey'
    const defaultValue = { number: 42, string: 'hello', array: [1, 2, 3] }
    localStorage.setItem(key, JSON.stringify(defaultValue))

    const result = localRef({ key, def: {}, lifecycle: 'local' })
    expect(result.value).toEqual(defaultValue)
  })

  it('persists and retrieves null values correctly', async () => {
    const key = 'nullKey'
    const defaultValue = 'not null'
    const newValue = null

    const result = localRef({ key, def: defaultValue, lifecycle: 'local' })
    // @ts-expect-error test
    result.value = newValue
    await waitFor(50) // Wait for the Vue reactivity system to update

    expect(localStorage.getItem(key)).toBe(JSON.stringify(newValue))
    expect(result.value).toBeNull()
  })

  it('handles undefined as a new default value on subsequent access', async () => {
    const key = 'undefinedKey'
    const defaultValue = { some: 'data' }
    const newValue = undefined

    let result = localRef({ key, def: defaultValue, lifecycle: 'local' })
    // @ts-expect-error test
    result.value = newValue
    await waitFor(50) // Wait for the Vue reactivity system to update

    // Simulate page reload by creating a new localRef with the same key but different default
    const newDefaultValue = 'new default'
    // @ts-expect-error test
    result = localRef({ key, def: newDefaultValue, lifecycle: 'local' })
    expect(result.value).toBe(newDefaultValue)
  })

  it('does not break with invalid JSON in storage', () => {
    const key = 'brokenJson'
    const defaultValue = 'default'
    localStorage.setItem(key, 'not a valid JSON')

    const result = localRef({ key, def: defaultValue, lifecycle: 'local' })
    expect(result.value).toBe(defaultValue) // Fallback to default
  })

  it('updates sessionStorage when value changes', async () => {
    const key = 'sessionUpdateKey'
    const defaultValue = [1, 2, 3]
    const newValue = [4, 5, 6]

    const result = localRef({ key, def: defaultValue, lifecycle: 'session' })
    result.value = newValue
    await waitFor(50) // Wait for the Vue reactivity system to update

    expect(sessionStorage.getItem(key)).toBe(JSON.stringify(newValue))
  })

  it('correctly handles complex nested objects', async () => {
    const key = 'complexObject'
    const defaultValue = { a: { b: [1, 2, { c: 'test' }] } }
    localStorage.setItem(key, JSON.stringify(defaultValue))

    const result = localRef({ key, def: {}, lifecycle: 'local' })
    expect(result.value).toEqual(defaultValue)

    const newValue = { a: { b: [3, 4, { c: 'changed' }] } }
    result.value = newValue
    await waitFor(50) // Wait for the Vue reactivity system to update

    expect(localStorage.getItem(key)).toBe(JSON.stringify(newValue))
  })

  // Test for handling concurrent updates and ensuring ref consistency
  it('maintains ref consistency with concurrent updates', async () => {
    const key = 'concurrentKey'
    const defaultValue = 'initial'

    const result1 = localRef({ key, def: defaultValue, lifecycle: 'local' })
    const result2 = localRef({ key, def: 'newDefault', lifecycle: 'local' })
    result1.value = 'update1'
    result2.value = 'update2'
    await waitFor(50) // Wait for the Vue reactivity system to update

    // Both refs should point to the same updated value
    expect(result1.value).toBe('update2')
    expect(result2.value).toBe(result1.value)
  })
})
