import { onBrowserEvent } from '@fiction/core/utils/eventBrowser.js'
import { fastHash } from '@fiction/core/utils/utils.js'
import { isBot } from '../utils/bot.js'
import { UnloadUtility, clickId, onRageClick } from '../utils/tracking.js'
import type { TrackingProperties } from '../typesTracking.js'
import type { OffloadEvent } from '../utils/tracking.js'
import { historyUtil } from '../utils/history.js'
import { FictionPageStats } from '../utils/pageStats.js'
import { ClientTag } from './clientTag.js'
import type { TagEntryPoint, TagSettings } from './types'
import { FictionClient } from './client.js'

type AnalyticsTagSettings = { throttleMs?: number } & TagSettings

export class AnalyticsTag extends ClientTag<AnalyticsTagSettings> {
  pageLoad: 'soft' | 'hard' = 'hard'
  errorList: string[] = []
  statLoopCount = 0
  statLoopTimer: NodeJS.Timeout | undefined = undefined
  statHash = ''
  throttleMs = this.settings.throttleMs || 5000
  throttleWait = false
  fictionPageStats = new FictionPageStats({ key: 'analytics' })
  client: FictionClient
  constructor(settings: AnalyticsTagSettings) {
    super('analytics', { gen: 'core', ...settings })

    const { orgId, siteId, beaconUrl, anonymousId } = this.settings
    this.client = new FictionClient({ orgId, siteId, beaconUrl, anonymousId })
  }

  async init() {
    /**
     * Page Views
     */
    await this.pageView()
    historyUtil.onHistoryChange(async () => {
      await this.exitEvent('historyChange')
      void this.pageView()
    })

    /**
     * Exit Events
     */
    UnloadUtility.onUnload(async (unloadType: OffloadEvent) => {
      await this.exitEvent(unloadType)
    })

    /**
     * Track Errors
     */
    this.trackErrors()
    this.trackRageClick()
    this.trackBot()
    this.trackClicks()
    this.statLoop()
  }

  getPage(): string {
    const { pathname: page, search: query } = location
    return `${page}${query}`
  }

  statLoop(): void {
    if (this.statLoopTimer)
      clearInterval(this.statLoopTimer)

    this.statLoopTimer = setInterval(() => {
      if (!UnloadUtility.unloaded) {
        const pageStats = this.fictionPageStats.getPageStats()

        const { engageDuration: _ignore, ...interactions } = pageStats
        const statsHash = fastHash(interactions)
        if (statsHash !== this.statHash) {
          this.statHash = statsHash

          this.statEvent('loop', { reason: 'loop', ...pageStats })
        }
      }
      this.statLoopCount++
    }, this.statSeconds * 1000)
  }

  trackBot(): void {
    if (window.fictionIsFake)
      return

    const botChecked = this.stored('botChecked')

    if (!botChecked) {
      const { result, failed } = isBot({ clientNavigator: window.navigator })

      if (result) {
        this.client
          .track('bot', {
            label: `Bot(${failed.join(', ')})`,
          })
          .catch(console.error)
      }

      this.storeItem('botChecked', 'yes')
    }
  }

  trackClicks(): void {
    onBrowserEvent('click', (event: MouseEvent) => {
      if (!this.throttleWait) {
        this.throttleWait = true
        setTimeout(() => (this.throttleWait = false), this.throttleMs)
        const { selector, position } = clickId(event)
        this.client
          .track('click', { selector, meta: { position } })
          .catch((error: unknown) =>
            this.log.error('click track event', { error }),
          )
      }
    })
  }

  trackRageClick(): void {
    onRageClick((event: MouseEvent) => {
      const { selector, position } = clickId(event)

      void this.client.track('rageClick', { selector, label: this.getPage(), meta: { position } })
    })
  }

  trackErrors(): void {
    onBrowserEvent('error', async (errorEvent: ErrorEvent): Promise<void> => {
      const { message = 'network error' } = errorEvent
      if (!this.errorList.includes(message)) {
        this.errorList.push(errorEvent.message)

        // If is a 404 error on img, we can log target/src
        const target = errorEvent.target as HTMLImageElement | undefined
        const statMap = this.fictionPageStats.map
        const clickEvent = statMap.clicks.lastClick
        const time = statMap.clicks.lastClickTime
        let selector
        let position
        if (clickEvent && time && time - +Date.now() < 1000) {
          const clk = clickId(clickEvent)
          selector = clk.selector
          position = clk.position
        }
        else if (target) {
          selector = target.className
        }

        let trace
        if (errorEvent.error) {
          const { default: stackTrackJs } = await import('stacktrace-js')
          const traceResult = await stackTrackJs.fromError(
            errorEvent.error as Error,
          )
          trace = JSON.stringify(traceResult)
        }
        else if (target) {
          trace = JSON.stringify({ target: target?.className, src: target?.currentSrc })
        }

        await this.client.track('error', {
          label: message,
          selector,
          meta: { ...errorEvent, position, target: target?.className, src: target?.currentSrc },
          trace,
        })
      }
    })
  }

  async pageView(): Promise<void> {
    this.fictionPageStats.start()
    UnloadUtility.unloaded = false
    await this.client.page()
  }

  statEvent(type: 'loop' | 'exit', ev: Partial<TrackingProperties>): void {
    void this.client.event({ event: 'stat', type, properties: ev })
  }

  async exitEvent(unloadType: OffloadEvent): Promise<void> {
    if (UnloadUtility.unloaded)
      return

    const pageStats = this.fictionPageStats.getPageStats()

    this.log.info('exit event', { data: pageStats })

    this.statEvent('exit', { reason: unloadType, ...pageStats })

    this.client.unload()

    // any following exit events are soft page loads
    // no additional vitals should be taken
    this.pageLoad = 'soft'

    UnloadUtility.unloaded = true
  }
}

export const setup: TagEntryPoint<AnalyticsTagSettings> = async (
  tagSettings,
) => {
  return new AnalyticsTag(tagSettings)
}
