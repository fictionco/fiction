/**
 * @vitest-environment happy-dom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AnalyticsTag } from '../tagAnalytics' // Replace with the actual file name
import { FictionPageStats } from '../../utils/pageStats'
import { UnloadUtility } from '../../utils/tracking'
import { historyUtil } from '../../utils/history'
import { FictionClient } from '../client'

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
    if (analyticsTag) {
      analyticsTag.close()
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
    const historyChangeSpy = vi.spyOn(historyUtil, 'onHistoryChange')
    const unloadSpy = vi.spyOn(UnloadUtility, 'onUnload')

    await analyticsTag.init()

    expect(pageViewSpy).toHaveBeenCalled()
    expect(trackErrorsSpy).toHaveBeenCalled()
    expect(trackRageClickSpy).toHaveBeenCalled()
    expect(trackBotSpy).toHaveBeenCalled()
    expect(trackClicksSpy).toHaveBeenCalled()
    expect(statLoopSpy).toHaveBeenCalled()

    expect(historyChangeSpy).toHaveBeenCalled()
    expect(unloadSpy).toHaveBeenCalled()
  })

  it('should get correct page', () => {
    window.location.href = `${window.location.href}test?query=1`
    expect(analyticsTag.getPage()).toBe('/test?query=1')
  })

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
})
