import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { debounce, simpleHandlebarsParser, throttle } from '../_'

describe('simpleHandlebarsParser', () => {
  it('replaces placeholders with context values', () => {
    const template = 'Hello, {{name}}! Welcome to {{place}}.'
    const context = { name: 'Alice', place: 'Wonderland' }
    const result = simpleHandlebarsParser(template, context)
    expect(result).toBe('Hello, Alice! Welcome to Wonderland.')
  })

  it('leaves unmatched placeholders unchanged', () => {
    const template = '{{greeting}}, {{name}}! {{farewell}}'
    const context = { name: 'Bob' }
    const result = simpleHandlebarsParser(template, context)
    expect(result).toBe('{{greeting}}, Bob! {{farewell}}')
  })

  it('handles an empty template', () => {
    const template = ''
    const context = { key: 'value' }
    const result = simpleHandlebarsParser(template, context)
    expect(result).toBe('')
  })

  it('handles an empty context', () => {
    const template = 'Hello, {{name}}!'
    const context = {}
    const result = simpleHandlebarsParser(template, context)
    expect(result).toBe('Hello, {{name}}!')
  })
})

describe('time based utils', async () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('throttle', () => {
    it('should call the function immediately on first trigger', () => {
      const mockFn = vi.fn()
      const throttled = throttle(mockFn, 100)
      throttled()
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should not call the function again within the throttle period', () => {
      const mockFn = vi.fn()
      const throttled = throttle(mockFn, 100)
      throttled()
      throttled()
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should call the function again after the throttle period', async () => {
      const mockFn = vi.fn()
      const throttled = throttle(mockFn, 100)
      throttled()
      vi.advanceTimersByTime(101)
      throttled()
      expect(mockFn).toHaveBeenCalledTimes(2)
    })
  })

  describe('debounce', () => {
    it('should only execute the function once after multiple triggers', async () => {
      const mockFn = vi.fn()
      const debounced = debounce(mockFn, 100)
      debounced()
      debounced()
      debounced()
      vi.advanceTimersByTime(101)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should delay function execution until after the debounce period', async () => {
      const mockFn = vi.fn()
      const debounced = debounce(mockFn, 100)
      debounced()
      vi.advanceTimersByTime(50)
      expect(mockFn).not.toHaveBeenCalled()
      vi.advanceTimersByTime(51)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })
})
