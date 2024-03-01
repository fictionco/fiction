import type { EventConfig, OffloadEvent, PageLoadType } from '@kaption/types'
import {
  activityTrigger,
  clickId,
  getLastClick,
  getPageStats,
  initializePageMetrics,
  isHeadlessBrowser,
  isUnloaded,
  onHistoryView,
  onNewError,
  onRageClick,
  onServerNotify,
  onThrottledClick,
  onUnload,
  resetCompiledMetrics,
  setUnloaded,
} from '@kaption/browser-utils'

import { emitEvent, fastHash, logger } from '@factor/api'
import { client } from '@kaption/client-tag/client'
import { patchBrowser } from './__patch'

let __pageLoad: PageLoadType = 'hard'

function getPage(): string {
  const { pathname: page, search: query } = location
  return `${page}${query}`
}

let __statsHash = ''

function statEvent(stats: Partial<EventConfig>): void {
  client
    .track('stat', stats)
    .catch(error =>
      logger.log({ level: 'error', description: 'stat event', data: error }),
    )
}
let __loopCount = 1
function statLoop(): void {
  /**
   * Send events on a throttled based each PING ms
   */
  setInterval(() => {
    if (__loopCount % 4 === 0 && !isUnloaded()) {
      const stats = getPageStats()

      const { engageDuration: _ignore, ...interactions } = stats
      const statsHash = fastHash(interactions)
      if (statsHash !== __statsHash) {
        __statsHash = statsHash

        statEvent(stats)
      }
    }
    __loopCount++
  }, 3000)
}

function exitEvent(offloadType: OffloadEvent): void {
  if (isUnloaded())
    return

  if (__pageLoad === 'hard') {
    // trackEvent({
    //   eventName: "vitals",
    //   ...pageVitals(),
    // })
    client()
      .track('vitals', pageVitals())
      .catch(error =>
        logger.log({
          level: 'error',
          description: 'vitals track event',
          data: error,
        }),
      )
  }

  const pageStats = getPageStats('exit')

  // trackEvent({
  //   eventName: "stat",
  //   eventType: offloadType,
  //   ...pageStats,
  // })

  statEvent({ eventType: offloadType, ...pageStats })

  client().unload()

  sendBeacon()

  // any following exit events are soft page loads
  // no additional vitals should be taken
  __pageLoad = 'soft'

  setUnloaded(true)
}

export async function startPageView(): Promise<void> {
  try {
    initializePageMetrics()

    const experiments = await getExperimentDataTag()
    await client().page({ experiments })
  }
  catch (error) {
    logger.log({ level: 'error', description: 'page view error', data: error })
  }
}

/**
 * Initialize event handling
 */
export async function initializeEvents(): Promise<void> {
  patchBrowser()

  statLoop()

  startPageView().catch((error) => {
    logger.log({
      level: 'error',
      description: 'page view track event',
      data: error,
    })
  })

  onHistoryView(() => {
    exitEvent('historyChange')
    startPageView().catch((error) => {
      logger.log({
        level: 'error',
        description: 'history view track event',
        data: error,
      })
    })
  })

  onNewError(async (errorEvent: ErrorEvent) => {
    // If recent click, then associate it with the error
    const { clickEvent, time } = getLastClick()
    let selector
    let position
    if (clickEvent && time && time - +Date.now() < 1000) {
      const clk = clickId(clickEvent)
      selector = clk.selector
      position = clk.position
    }

    const { message } = errorEvent

    let trace
    if (errorEvent.error) {
      const { default: stackTrackJs } = await import('stacktrace-js')
      const traceResult = await stackTrackJs.fromError(
        errorEvent.error as Error,
      )
      trace = JSON.stringify(traceResult)
    }

    client()
      .track('error', {
        label: message,
        selector,
        meta: { ...errorEvent, position },
        trace,
      })
      .catch(error =>
        logger.log({
          level: 'error',
          description: 'ERROR track event',
          data: error,
        }),
      )
  })

  onRageClick((event: MouseEvent) => {
    const { selector, position } = clickId(event)

    client()
      .track('rageClick', {
        selector,
        label: getPage(),
        meta: { position },
      })
      .catch(error =>
        logger.log({
          level: 'error',
          description: 'rageClick track event',
          data: error,
        }),
      )
  })

  onThrottledClick((event: MouseEvent) => {
    const { selector, position } = clickId(event)

    // trackEvent({ eventName: "click", selector, meta: { position } })
    client()
      .track('click', {
        selector,
        meta: { position },
      })
      .catch(error =>
        logger.log({
          level: 'error',
          description: 'click track event',
          data: error,
        }),
      )
  })

  onUnload((unloadType: OffloadEvent) => {
    exitEvent(unloadType)
  })

  const headlessCheck = await isHeadlessBrowser()

  if (headlessCheck.status === 'error') {
    client()
      .track('bot', {
        label: `Bot(${headlessCheck.failed.join(', ')})`,
      })
      .catch(error =>
        logger.log({
          level: 'error',
          description: 'bot track event',
          data: error,
        }),
      )

    flagClient()
  }
  /**
   * Reset metrics on expired session notification from server
   * once this is served we should start fresh
   * @note don't throw an exit event though, or it will start a new session
   */
  onServerNotify('expireSession', (): void => {
    setUnloaded(true)
    resetCompiledMetrics()
  })
  onServerNotify('beginConnection', ({ data }): void => {
    if (data?.sessionStatus === 'begin')
      resetCompiledMetrics()
  })

  activityTrigger({
    onIdle: (_) => {
      emitEvent('activity:idle', _)
    },
    onActive: (_) => {
      emitEvent('activity:active', _)
    },
    onEngage: (_) => {
      emitEvent('activity:engage', _)
    },
    idleSeconds: 180,
  })
}
