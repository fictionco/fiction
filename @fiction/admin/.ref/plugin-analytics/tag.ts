import { onHistoryChange } from '@factor/api/utils-analytics'
import type {
  OffloadEvent,
} from '@factor/api'
import {
  UnloadUtility,
  clickId,
  fastHash,
  isBot,
  onBrowserEvent,
  onRageClick,
} from '@factor/api'
import type { TrackingProperties } from '@kaption/client'
import { ClientTag, KaptionPageStats } from '../tag-utils'
import type { TagEntryPoint, TagSettings } from '../plugin-tag/types'

type AnalyticsTagSettings = {
  throttleMs: number
} & TagSettings
export class AnalyticsTag extends ClientTag<AnalyticsTagSettings> {
  pageLoad: 'soft' | 'hard' = 'hard'
  errorList: string[] = []
  statLoopCount = 0
  statLoopTimer: NodeJS.Timeout | undefined = undefined
  statHash = ''
  throttleMs = this.settings.throttleMs || 5000
  throttleWait = false
  kaptionPageStats = new KaptionPageStats({ key: 'analytics' })
  constructor(settings: AnalyticsTagSettings) {
    super({ gen: 'core', ...settings })
  }

  async init() {
    /**
     * Page Views
     */
    await this.pageView()
    onHistoryChange(async () => {
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
        const pageStats = this.kaptionPageStats.getPageStats()

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
    if (window.kaptionIsFake)
      return

    const botChecked = this.stored('botChecked')

    if (!botChecked) {
      const { result, failed } = isBot()

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
      if (this.throttleWait) {}
      else {
        this.throttleWait = true
        setTimeout(() => (this.throttleWait = false), this.throttleMs)
        const { selector, position } = clickId(event)
        this.client
          .track('click', {
            selector,
            meta: { position },
          })
          .catch((error: unknown) =>
            this.log.error('click track event', { error }),
          )
      }
    })
  }

  trackRageClick(): void {
    onRageClick((event: MouseEvent) => {
      const { selector, position } = clickId(event)

      void this.client.track('rageClick', {
        selector,
        label: this.getPage(),
        meta: { position },
      })
    })
  }

  trackErrors(): void {
    onBrowserEvent('error', async (errorEvent: ErrorEvent): Promise<void> => {
      const { message = 'network error' } = errorEvent
      if (!this.errorList.includes(message)) {
        this.errorList.push(errorEvent.message)

        // If is a 404 error on img, we can log target/src
        const target = errorEvent.target as HTMLImageElement | undefined
        const statMap = this.kaptionPageStats.map
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
          trace = JSON.stringify({
            target: target?.className,
            src: target?.currentSrc,
          })
        }

        await this.client.track('error', {
          label: message,
          selector,
          meta: {
            ...errorEvent,
            position,
            target: target?.className,
            src: target?.currentSrc,
          },
          trace,
        })
      }
    })
  }

  async pageView(): Promise<void> {
    this.kaptionPageStats.start()
    UnloadUtility.unloaded = false
    await this.client.page()
  }

  statEvent(type: 'loop' | 'exit', ev: Partial<TrackingProperties>): void {
    void this.client.event({ event: 'stat', type, properties: ev })
  }

  async exitEvent(unloadType: OffloadEvent): Promise<void> {
    if (UnloadUtility.unloaded)
      return

    const pageStats = this.kaptionPageStats.getPageStats()

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
