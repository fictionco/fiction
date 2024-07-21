// @vitest-environment happy-dom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type BrowserEvent, type BrowserEventObject, onBrowserEvent } from '@fiction/core/utils/eventBrowser'
import { ClickHandler, ScrollHandler } from '../pageStats'

describe('scrollHandler', () => {
  let scrollHandler: ScrollHandler

  beforeEach(() => {
    scrollHandler = new ScrollHandler({ key: 'test' })
    vi.useFakeTimers()

    // Mock document properties
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1000, configurable: true })
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 500, configurable: true })
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, configurable: true })
  })

  afterEach(() => {
    scrollHandler.close()
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should initialize with zero scroll depth and total scrolls', () => {
    expect(scrollHandler.scrollDepth).toBe(0)
    expect(scrollHandler.totalScrolls).toBe(0)
  })

  it('should calculate scroll depth correctly', () => {
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 250 })
    expect(scrollHandler.getScrollDepth()).toBe(75)
  })

  it('should return 0 scroll depth when scrollHeight is 0', () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 0 })
    expect(scrollHandler.getScrollDepth()).toBe(0)
  })

  it('should cap scroll depth at 100', () => {
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 1000 })
    expect(scrollHandler.getScrollDepth()).toBe(100)
  })

  it('should reset scroll depth and total scrolls', () => {
    scrollHandler.scrollDepth = 50
    scrollHandler.totalScrolls = 10
    scrollHandler.reset()
    expect(scrollHandler.scrollDepth).toBe(scrollHandler.getScrollDepth())
    expect(scrollHandler.totalScrolls).toBe(0)
  })

  it('should delay start if initial scroll depth is 0', () => {
    const startSpy = vi.spyOn(scrollHandler, 'start')
    scrollHandler.watch()
    expect(startSpy).not.toHaveBeenCalled()
    vi.advanceTimersByTime(500)
    expect(startSpy).toHaveBeenCalled()
  })

  it('should update scroll depth and total scrolls on scroll event', () => {
    vi.spyOn({ onBrowserEvent }, 'onBrowserEvent').mockImplementation(
      <T extends BrowserEvent>(event: T, callback: (e: BrowserEventObject<T>) => void) => {
        if (event === 'scroll') {
          callback(new Event('scroll') as BrowserEventObject<T>)
        }
        return vi.fn()
      },
    )

    scrollHandler.scrollDepth = 50
    scrollHandler.watch()

    expect(scrollHandler.scrollDepth).toBe(50)
    expect(scrollHandler.totalScrolls).toBe(0)

    Object.defineProperty(document.documentElement, 'scrollTop', { value: 400 })
    document.dispatchEvent(new Event('scroll'))

    // Advance timers to trigger debounced functions
    vi.advanceTimersByTime(300) // For scroll depth update
    vi.advanceTimersByTime(scrollHandler.resolutionMs) // For total scrolls update

    expect(scrollHandler.scrollDepth).toBe(90)
    expect(scrollHandler.totalScrolls).toBe(1)
  })

  it('should not update scroll depth if new depth is lower', () => {
    vi.spyOn({ onBrowserEvent }, 'onBrowserEvent').mockImplementation(
      <T extends BrowserEvent>(event: T, callback: (e: BrowserEventObject<T>) => void) => {
        if (event === 'scroll') {
          callback(new Event('scroll') as BrowserEventObject<T>)
        }
        return vi.fn()
      },
    )

    scrollHandler.scrollDepth = 75
    scrollHandler.watch()

    Object.defineProperty(document.documentElement, 'scrollTop', { value: 200 })
    scrollHandler.getScrollDepth() // Simulate scroll event
    vi.advanceTimersByTime(300)

    expect(scrollHandler.scrollDepth).toBe(75)
  })

  it('should throttle scroll depth updates and total scrolls', () => {
    vi.spyOn({ onBrowserEvent }, 'onBrowserEvent').mockImplementation(
      <T extends BrowserEvent>(event: T, callback: (e: BrowserEventObject<T>) => void) => {
        if (event === 'scroll') {
          callback(new Event('scroll') as BrowserEventObject<T>)
        }
        return vi.fn()
      },
    )

    scrollHandler.watch()

    expect(scrollHandler.scrollDepth).toBe(0)
    expect(scrollHandler.totalScrolls).toBe(0)

    for (let i = 0; i < 10; i++) {
      document.dispatchEvent(new Event('scroll'))
      vi.advanceTimersByTime(scrollHandler.resolutionMs / 2)
    }

    expect(scrollHandler.scrollDepth).toBe(50)
    expect(scrollHandler.totalScrolls).toBe(5)

    vi.advanceTimersByTime(scrollHandler.resolutionMs)

    expect(scrollHandler.scrollDepth).toBe(50)
    expect(scrollHandler.totalScrolls).toBe(6)

    document.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(scrollHandler.resolutionMs)

    expect(scrollHandler.scrollDepth).toBe(50)
    expect(scrollHandler.totalScrolls).toBe(7)
  })
})

describe('clickHandler', () => {
  let clickHandler: ClickHandler

  beforeEach(() => {
    clickHandler = new ClickHandler({ key: 'test' })
    vi.useFakeTimers()
  })

  afterEach(() => {
    clickHandler.close()
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should initialize with zero counts', () => {
    expect(clickHandler.clickTotal).toBe(0)
    expect(clickHandler.touchTotal).toBe(0)
  })

  it('should increment clickTotal on click event', () => {
    clickHandler.start()
    document.dispatchEvent(new MouseEvent('click'))
    expect(clickHandler.clickTotal).toBe(1)
  })

  it('should increment touchTotal on touchstart event', () => {
    clickHandler.start()
    document.dispatchEvent(new TouchEvent('touchstart'))
    expect(clickHandler.touchTotal).toBe(1)
  })

  it('should update lastClick and lastClickTime on click event', () => {
    clickHandler.start()
    const clickEvent = new MouseEvent('click')
    document.dispatchEvent(clickEvent)
    expect(clickHandler.lastClick).toBe(clickEvent)
    expect(clickHandler.lastClickTime).toBeDefined()
  })

  it('should update lastTouch and lastTouchTime on touchstart event', () => {
    clickHandler.start()
    const touchEvent = new TouchEvent('touchstart')
    document.dispatchEvent(touchEvent)
    expect(clickHandler.lastTouch).toBe(touchEvent)
    expect(clickHandler.lastTouchTime).toBeDefined()
  })

  it('should reset all values when reset is called', () => {
    clickHandler.start()
    document.dispatchEvent(new MouseEvent('click'))
    document.dispatchEvent(new TouchEvent('touchstart'))
    clickHandler.reset()
    expect(clickHandler.clickTotal).toBe(0)
    expect(clickHandler.touchTotal).toBe(0)
    expect(clickHandler.lastClick).toBeUndefined()
    expect(clickHandler.lastTouch).toBeUndefined()
    expect(clickHandler.lastClickTime).toBeUndefined()
    expect(clickHandler.lastTouchTime).toBeUndefined()
  })

  it('should debounce addToTotalSessionClicks calls', async () => {
    clickHandler.reset()
    clickHandler.start()
    const addToTotalSessionClicksSpy = vi.spyOn(clickHandler as any, 'addToTotalSessionClicks')

    expect(clickHandler.compiledTotalClicks.value).toBe(0)

    for (let i = 0; i < 5; i++) {
      document.dispatchEvent(new MouseEvent('click'))
    }

    expect(addToTotalSessionClicksSpy).toHaveBeenCalledTimes(5)

    vi.advanceTimersByTime(300)

    expect(clickHandler.compiledTotalClicks.value).toBe(1)
  })
})
