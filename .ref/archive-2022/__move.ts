import {
  EVENT_RESOLUTION_SECONDS,
  onBrowserEvent,
} from '@kaption/browser-utils/utils'

interface MoveMetrics {
  moveTotal: number
}

/**
 * @singleton
 * - remember number of mouse moves
 */
let __pageTotalMoves = 0
let __clear: (() => void) | undefined
/**
 * Watch scroll events and set scroll depth accordingly
 */
export function moveMetrics(action?: 'start'): MoveMetrics {
  if (action === 'start') {
    __pageTotalMoves = 0

    let trackNewMove = true

    if (__clear)
      __clear()

    __clear = onBrowserEvent('mousemove', () => {
      if (trackNewMove) {
        trackNewMove = false
        __pageTotalMoves += 1

        setTimeout(() => {
          trackNewMove = true
        }, EVENT_RESOLUTION_SECONDS() * 1000)
      }
    })
  }

  return {
    moveTotal: __pageTotalMoves,
  }
}
