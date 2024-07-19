/**
 * @vitest-environment happy-dom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { onBrowserEvent } from '@fiction/core/utils/eventBrowser'
import { AnalyticsTag } from '../tagAnalytics' // Replace with the actual file name
import { FictionPageStats } from '../../utils/pageStats'
import { UnloadUtility } from '../../utils/tracking'
import { historyUtil } from '../../utils/history'
import { isBot } from '../../utils/bot'
import { FictionClient } from '../client'

// Minimal mocks for browser environment
globalThis.window = {
  navigator: {},
  location: { pathname: '/test', search: '?query=1' },
} as any
globalThis.document = {} as any

describe('analyticsTag', () => {
  let analyticsTag: AnalyticsTag
  let mockSettings: any

  beforeEach(() => {
    mockSettings = {
      orgId: 'test-org',
      siteId: 'test-site',
      beaconUrl: 'https://example.com/beacon',
      anonymousId: 'test-anonymous-id',
      throttleMs: 1000,
    }
    analyticsTag = new AnalyticsTag(mockSettings)

    // Spy on methods
    vi.spyOn(analyticsTag.client, 'track')
    vi.spyOn(analyticsTag.client, 'page')
    vi.spyOn(analyticsTag.client, 'event')
    vi.spyOn(analyticsTag.client, 'unload')
    vi.spyOn(analyticsTag.fictionPageStats, 'start')
    vi.spyOn(analyticsTag.fictionPageStats, 'getPageStats')
    vi.spyOn(analyticsTag, 'storeItem')
    vi.spyOn(analyticsTag, 'stored')
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.clearAllMocks()
    if (analyticsTag.statLoopTimer) {
      clearInterval(analyticsTag.statLoopTimer)
    }
  })

  it('should initialize with correct settings', () => {
    expect(analyticsTag.client).toBeInstanceOf(FictionClient)
    expect(analyticsTag.throttleMs).toBe(1000)
    expect(analyticsTag.fictionPageStats).toBeInstanceOf(FictionPageStats)
  })

  it('should call necessary methods on init', async () => {
    const pageViewSpy = vi.spyOn(analyticsTag, 'pageView')
    const trackErrorsSpy = vi.spyOn(analyticsTag, 'trackErrors')
    const trackRageClickSpy = vi.spyOn(analyticsTag, 'trackRageClick')
    const trackBotSpy = vi.spyOn(analyticsTag, 'trackBot')
    const trackClicksSpy = vi.spyOn(analyticsTag, 'trackClicks')
    const statLoopSpy = vi.spyOn(analyticsTag, 'statLoop')

    await analyticsTag.init()

    expect(pageViewSpy).toHaveBeenCalled()
    expect(trackErrorsSpy).toHaveBeenCalled()
    expect(trackRageClickSpy).toHaveBeenCalled()
    expect(trackBotSpy).toHaveBeenCalled()
    expect(trackClicksSpy).toHaveBeenCalled()
    expect(statLoopSpy).toHaveBeenCalled()
    expect(historyUtil.onHistoryChange).toHaveBeenCalled()
    expect(UnloadUtility.onUnload).toHaveBeenCalled()
  })

  it('should get correct page', () => {
    expect(analyticsTag.getPage()).toBe('/test?query=1')
  })

  // it('should track bot visits', async () => {
  //   vi.spyOn(isBot, 'isBot').mockReturnValue({ result: true, failed: ['test'] })
  //   analyticsTag.stored = vi.fn().mockReturnValue(false)

  //   await analyticsTag.trackBot()

  //   expect(analyticsTag.client.track).toHaveBeenCalledWith('bot', {
  //     label: 'Bot(test)',
  //   })
  //   expect(analyticsTag.storeItem).toHaveBeenCalledWith('botChecked', 'yes')
  // })

  it('should handle pageView', async () => {
    await analyticsTag.pageView()
    expect(analyticsTag.fictionPageStats.start).toHaveBeenCalled()
    expect(analyticsTag.client.page).toHaveBeenCalled()
    expect(UnloadUtility.unloaded).toBe(false)
  })

  it('should handle exitEvent', async () => {
    vi.spyOn(analyticsTag.fictionPageStats, 'getPageStats').mockReturnValue({
      engageDuration: 10,
      clicks: 5,
      scrollDepth: 0.5,
    } as any)

    await analyticsTag.exitEvent('pagehide')

    expect(analyticsTag.client.event).toHaveBeenCalledWith({
      event: 'stat',
      type: 'exit',
      properties: expect.objectContaining({
        reason: 'pagehide',
        engageDuration: 10,
        clicks: 5,
        scrollDepth: 0.5,
      }),
    })
    expect(analyticsTag.client.unload).toHaveBeenCalled()
    expect(analyticsTag.pageLoad).toBe('soft')
    expect(UnloadUtility.unloaded).toBe(true)
  })

  it('should handle statEvent', () => {
    analyticsTag.statEvent('loop', { reason: 'test' })
    expect(analyticsTag.client.event).toHaveBeenCalledWith({
      event: 'stat',
      type: 'loop',
      properties: { reason: 'test' },
    })
  })

  // it('should track clicks with throttling', async () => {
  //   const mockEvent = new MouseEvent('click')
  //   vi.spyOn(global, 'setTimeout')

  //   analyticsTag.trackClicks()

  //   // Simulate click event
  //   await onBrowserEvent('click', mockEvent)

  //   expect(analyticsTag.client.track).toHaveBeenCalledWith('click', expect.any(Object))
  //   expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), analyticsTag.throttleMs)

  //   // Simulate another click immediately (should be throttled)
  //   await onBrowserEvent('click', mockEvent)
  //   expect(analyticsTag.client.track).toHaveBeenCalledTimes(1)
  // })

  // Add more tests for other methods like trackRageClick, trackErrors, etc.
})
