import { onBrowserEvent } from '@kaption/browser-utils/utils'

interface KeyMetrics {
  keypressTotal: number
  lastKey: KeyboardEvent | undefined
  lastKeyTime: number
}

/**
 * @singleton saves the last click event
 */
let __lastKey: KeyboardEvent | undefined
let __lastKeyTime: number

let __pageKeypressTotal = 0
let __removers: (() => void)[] = []

export function keyMetrics(action?: 'start'): KeyMetrics {
  if (action === 'start') {
    __pageKeypressTotal = 0

    if (__removers.length > 0)
      __removers.forEach(_ => _())

    const r = onBrowserEvent('keypress', (event: KeyboardEvent) => {
      __pageKeypressTotal += 1
      __lastKey = event
      __lastKeyTime = +Date.now()
    })

    __removers = [r]
  }

  return {
    keypressTotal: __pageKeypressTotal,
    lastKey: __lastKey,
    lastKeyTime: __lastKeyTime,
  }
}
