import { describe, expect, it, vi } from 'vitest'
import { debounce, throttle } from '../_'

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

vi.useFakeTimers()
