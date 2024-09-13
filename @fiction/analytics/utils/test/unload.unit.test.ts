/**
 * @vitest-environment happy-dom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { UnloadHandler } from '../tracking'

describe('unloadHandler', () => {
  let handler: UnloadHandler
  let mockWindow: Window
  let mockDocument: Document

  beforeEach(() => {
    vi.useFakeTimers()
    mockWindow = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as Window
    mockDocument = {
      visibilityState: 'visible',
    } as unknown as Document
    handler = new UnloadHandler(mockWindow, mockDocument)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.resetAllMocks()
  })

  it('should set up event listeners when onUnload is called', () => {
    const callback = vi.fn()
    handler.onUnload(callback)

    // eslint-disable-next-line ts/unbound-method
    expect(mockWindow.addEventListener).toHaveBeenCalledTimes(6)
  })

  it('should initialize with correct default values', () => {
    expect(handler.unloaded).toBe(false)
    expect(handler.focused).toBe(true)
  })

  it('should call unload callbacks when unload is triggered', () => {
    const callback1 = vi.fn()
    const callback2 = vi.fn()
    handler.onUnload(callback1)
    handler.onUnload(callback2)
    handler.unload('pagehide')
    expect(callback1).toHaveBeenCalledWith('pagehide')
    expect(callback2).toHaveBeenCalledWith('pagehide')
    expect(handler.unloaded).toBe(true)
  })

  it('should not call unload callbacks more than once', () => {
    const callback = vi.fn()
    handler.onUnload(callback)
    handler.unload('pagehide')
    handler.unload('unload')
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should set up timed unload correctly', () => {
    const callback = vi.fn()
    handler.onUnload(callback)
    handler.timedUnload({ reason: 'windowBlur', wait: 1000 })
    expect(handler.focused).toBe(false)
    vi.advanceTimersByTime(999)
    expect(callback).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(callback).toHaveBeenCalledWith('windowBlur')
  })

  it('should cancel timed unload if refocused', () => {
    const callback = vi.fn()
    handler.onUnload(callback)
    handler.timedUnload({ reason: 'windowBlur', wait: 1000 })
    vi.advanceTimersByTime(500)
    handler.setFocused(true)
    vi.advanceTimersByTime(500)
    expect(callback).not.toHaveBeenCalled()
  })

  it('should handle visibility change correctly', () => {
    const callback = vi.fn()
    handler.onUnload(callback)

    // Simulate visibility change to hidden
    Object.defineProperty(mockDocument, 'visibilityState', { value: 'hidden', configurable: true })
    handler.handleVisibilityChange()

    expect(handler.focused).toBe(false)
    vi.advanceTimersByTime(30000)
    expect(callback).toHaveBeenCalledWith('visibilitychange')

    // Simulate visibility change back to visible
    Object.defineProperty(mockDocument, 'visibilityState', { value: 'visible', configurable: true })
    handler.handleVisibilityChange()

    expect(handler.focused).toBe(true)
  })

  it('should clear all watchers and reset state', () => {
    const callback = vi.fn()
    handler.onUnload(callback)
    handler.unload('pagehide')
    handler.clear()
    expect(handler.unloaded).toBe(false)
    expect(handler.focused).toBe(true)
    // eslint-disable-next-line ts/unbound-method
    expect(mockWindow.removeEventListener).toHaveBeenCalledTimes(6)
  })

  it('should handle multiple timed unloads correctly', () => {
    const callback = vi.fn()
    handler.onUnload(callback)
    handler.timedUnload({ reason: 'windowBlur', wait: 1000 })
    vi.advanceTimersByTime(500)
    handler.timedUnload({ reason: 'visibilitychange', wait: 1000 })
    vi.advanceTimersByTime(999)
    expect(callback).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(callback).toHaveBeenCalledWith('visibilitychange')
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should not set up event listeners in non-client environment', () => {
    const nonClientHandler = new UnloadHandler()
    const callback = vi.fn()
    nonClientHandler.onUnload(callback)
    // eslint-disable-next-line ts/unbound-method
    expect(mockWindow.addEventListener).not.toHaveBeenCalled()
  })
})
