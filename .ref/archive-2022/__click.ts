import { EVENT_RESOLUTION_SECONDS, onBrowserEvent } from './__utils'
import { getLocal, setLocal } from './local'

interface ClickMetrics {
  clickTotal: number
  touchTotal: number
  lastClick: MouseEvent | undefined
  lastClickTime: number
  lastTouch: TouchEvent | undefined
  lastTouchTime: number
}

/**
 * @singleton saves the last click event
 */
let __lastClickEvent: MouseEvent | undefined
let __lastClickTime: number
let __lastTouchEvent: TouchEvent | undefined
let __lastTouchTime: number
let __waiting: boolean
let __pageClickTotal = 0
let __pageTouchTotal = 0
let __removers: (() => void)[] = []

const COMPILED_KEY = '__kTotalClicks'

/**
 * Used as a goal metric
 */
export function compiledTotalClicks(): number {
  const existing = getLocal<string>({ key: COMPILED_KEY, raw: true }) ?? '0'
  return Number.parseInt(existing)
}

function addToTotalSessionClicks(amount: number): void {
  const compiled = amount + compiledTotalClicks()

  setLocal({
    key: COMPILED_KEY,
    value: compiled.toString(),
    raw: true,
    scope: 'session',
    type: 'session',
  })
}

function handleClick(cb: (event: MouseEvent) => void, event: MouseEvent): void {
  if (!__waiting) {
    __waiting = true

    cb(event)
    setTimeout(() => {
      __waiting = false
    }, EVENT_RESOLUTION_SECONDS() * 1000)
  }
}
/**
 * Trigger a callback on throttled click events preventing too many clicks
 */
let __stopClick: (() => void)[] = []
export function onThrottledClick(cb: (event: MouseEvent) => void): void {
  if (__stopClick)
    __stopClick.forEach(_ => _())

  __stopClick = [
    onBrowserEvent('click', (event: MouseEvent) => {
      handleClick(_ => cb(_), event)
    }),
  ]
}
/**
 * Gets the last click
 */
export function getLastClick(): {
  clickEvent: MouseEvent | undefined
  time: number | undefined
} {
  return { clickEvent: __lastClickEvent, time: __lastClickTime }
}

export function clickMetrics(action?: 'start' | 'compile'): ClickMetrics {
  if (action === 'start') {
    __pageClickTotal = 0
    __pageTouchTotal = 0
    if (__removers.length > 0)
      __removers.forEach(_ => _())

    const r = onBrowserEvent('click', (event: MouseEvent) => {
      __pageClickTotal += 1
      __lastClickEvent = event
      __lastClickTime = +Date.now()
      addToTotalSessionClicks(1)
    })
    const r2 = onBrowserEvent('touchstart', (event: TouchEvent) => {
      __pageTouchTotal += 1
      __lastTouchEvent = event
      __lastTouchTime = +Date.now()
      addToTotalSessionClicks(1)
    })

    __removers = [r, r2]
  }

  return {
    clickTotal: __pageClickTotal,
    touchTotal: __pageTouchTotal,
    lastClick: __lastClickEvent,
    lastClickTime: __lastClickTime,
    lastTouch: __lastTouchEvent,
    lastTouchTime: __lastTouchTime,
  }
}
