import {
  EVENT_RESOLUTION_SECONDS,
  onBrowserEvent,
} from '@kaption/browser-utils/utils'

interface ScrollMetrics {
  scrollDepth: number
  scrollTotal: number
}

/**
 * @singleton
 * - remember max page scroll depth
 * - remember number of scrolls
 */
let __pageScrollDepth = 0
let __pageTotalScrolls = 0
let __removers: (() => void)[] = []

/**
 * Get the current scroll depth on the page as a percent
 */
export function getScrollDepth(): number {
  const winScroll
    = document.body.scrollTop || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight
  const viewportHeight = document.documentElement.clientHeight

  if (scrollHeight === 0)
    return 0

  const scrolled = ((viewportHeight + winScroll) / scrollHeight) * 100

  return Math.min(Math.round(scrolled), 100)
}
/**
 * Watch scroll events and set scroll depth accordingly
 */
export function scrollMetrics(action?: 'start'): ScrollMetrics {
  if (action === 'start') {
    __pageScrollDepth = getScrollDepth()
    __pageTotalScrolls = 0

    // if no page height, wait a bit
    if (__pageScrollDepth === 0) {
      setTimeout(() => scrollMetrics('start'), 500)
    }
    else {
      let trackNewScroll = true
      let trackPageDepth = true

      if (__removers.length > 0)
        __removers.forEach(_ => _())

      const r = onBrowserEvent('scroll', () => {
        if (trackPageDepth) {
          trackPageDepth = false

          setTimeout(() => {
            trackPageDepth = true

            const currentDepth = getScrollDepth()

            if (currentDepth > __pageScrollDepth)
              __pageScrollDepth = currentDepth
          }, 300)
        }

        if (trackNewScroll) {
          trackNewScroll = false
          __pageTotalScrolls += 1
          setTimeout(() => {
            trackNewScroll = true
          }, EVENT_RESOLUTION_SECONDS() * 1000)
        }
      })
      __removers = [r]
    }
  }

  return {
    scrollDepth: __pageScrollDepth,
    scrollTotal: __pageTotalScrolls,
  }
}
