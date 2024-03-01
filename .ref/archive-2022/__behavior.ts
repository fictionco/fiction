import type { BrowserEvent } from '@factor/api/activity'
import { onBrowserEvent } from '@factor/api/activity'
import { getLocal, setLocal } from '@factor/api/local'

/**
 * Watches browser activity and calls functions based on
 * changes of state or idle time (no interactions)
 */
export function activityTrigger({
  onIdle = (): void => {},
  onActive = (): void => {},
  onEngage = (): void => {},
  idleSeconds = 5,
}: {
  onIdle?: (t: number) => void
  onActive?: (b: BrowserEvent) => void
  onEngage?: (b: BrowserEvent) => void
  idleSeconds?: number
}): (() => void) {
  let __timer: NodeJS.Timeout | undefined
  let __isIdle = false
  let __lastEngage: number
  let __activeStart: number = +Date.now()
  const __timeWindow: number = idleSeconds * 1000

  const setIdle = (timeIdle = 0): void => {
    __isIdle = true
    onIdle(timeIdle)
  }

  const setActive = (browserEvent: BrowserEvent): void => {
    __activeStart = +Date.now()
    __isIdle = false
    onActive(browserEvent)
  }

  const setEngage = (browserEvent: BrowserEvent): void => {
    __lastEngage = +Date.now()

    // user has gone from idle to active
    if (__isIdle)
      setActive(browserEvent)

    if (onEngage)
      onEngage(browserEvent)
  }

  __timer = setInterval(() => {
    if (!__isIdle) {
      const now = +Date.now()
      if (now > __lastEngage + __timeWindow) {
        const secondsActive = Math.round((__lastEngage - __activeStart) / 1000)
        setIdle(secondsActive + 5) // 5 seconds grace period
      }
    }
  }, 1000)

  setEngage('init')

  const clearWatchers = [
    onBrowserEvent('load', () => setEngage('load')),
    onBrowserEvent('mousemove', () => setEngage('mousemove')),
    onBrowserEvent('mousedown', () => setEngage('mousedown')),
    onBrowserEvent('touchstart', () => setEngage('touchstart')),
    onBrowserEvent('click', () => setEngage('click')),
    onBrowserEvent('keypress', () => setEngage('keypress')),
    onBrowserEvent('scroll', () => setEngage('scroll')),
  ]

  return (): void => {
    if (__timer)
      clearTimeout(__timer)
    clearWatchers.forEach(clearWatcher => clearWatcher())
  }
}

/**
 * Detects multiple clicks within a radius within a time frame
 */

const RETURNING_KEY = '__kReturning'

export function setReturningSession(): void {
  const returningSet = getLocal<string>({
    key: RETURNING_KEY,
    raw: true,
  })
  if (!returningSet) {
    const isReturn = !!getLocal({ key: 'daConfig' })
    setLocal<string>({
      key: RETURNING_KEY,
      value: isReturn ? '1' : '0',
      scope: 'tracking',
      type: 'session',
      raw: true,
    })
  }
}
/**
 * Used for rules and ab testing
 * Don't use for tracking since its not usable with GDPR
 */
export function isReturningSession(): boolean {
  const isReturn = getLocal<string>({ key: RETURNING_KEY, raw: true })

  return !!(isReturn && isReturn === '1')
}

/**
 * Callback on a standard JS error
 */
const errorList: string[] = []
export function onNewError(cb: (data: ErrorEvent) => void): void {
  onBrowserEvent('error', (errorEvent: ErrorEvent): void => {
    if (!errorList.includes(errorEvent.message)) {
      errorList.push(errorEvent.message)
      cb(errorEvent)
    }
  })
}
/**
 * Callback a function when a view or history change occurs
 */
export function onHistoryView(cb: () => void): void {
  window.addEventListener('pushState', (): void => cb())

  window.onpopstate = ({ state }: PopStateEvent): void => {
    if (state)
      cb()
  }
}
