export type BrowserEvent =
  | "load"
  | "mousemove"
  | "mousedown"
  | "touchstart"
  | "click"
  | "keypress"
  | "scroll"
  | "init"
  | "blur"
  | "focus"
  | "pagehide"
  | "beforeunload"
  | "visibilitychange"
  | "dragstart"

type BrowserEventObject<T> = T extends "mousemove" | "mousedown" | "click"
  ? MouseEvent
  : T extends "touchstart"
  ? TouchEvent
  : T extends "keypress"
  ? KeyboardEvent
  : T extends "dragstart"
  ? DragEvent
  : Event

/**
 * Helper that adds a remover callback and sets options for listeners
 */
export const onBrowserEvent = <T extends BrowserEvent>(
  type: T,
  fn: (e: BrowserEventObject<typeof type>) => void,
  target?: HTMLElement | Window | Document,
): (() => void) => {
  // in case on server
  if (typeof window == "undefined") {
    return (): void => {}
  }

  target = target || window

  if (type == "scroll") {
    target = document
  } else {
    target = window
  }

  const options = { capture: true, passive: true }
  target.addEventListener(
    type,
    fn as EventListenerOrEventListenerObject,
    options,
  )
  return (): void => {
    return target?.removeEventListener(
      type,
      fn as EventListenerOrEventListenerObject,
      options,
    )
  }
}
/**
 * Watches browser activity and calls functions based on
 * changes of state or idle time (no interactions)
 */
export const activityTrigger = ({
  onIdle = (): void => {},
  onActive = (): void => {},
  onEngage = (): void => {},
  idleSeconds = 5,
}: {
  onIdle?: (t: number) => void
  onActive?: (b: BrowserEvent) => void
  onEngage?: (b: BrowserEvent) => void
  idleSeconds?: number
}): (() => void) => {
  let __timer: NodeJS.Timeout | undefined = undefined
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
    if (__isIdle) {
      setActive(browserEvent)
    }

    if (onEngage) onEngage(browserEvent)
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

  setEngage("init")

  const clearWatchers = [
    onBrowserEvent("load", () => setEngage("load")),
    onBrowserEvent("mousemove", () => setEngage("mousemove")),
    onBrowserEvent("mousedown", () => setEngage("mousedown")),
    onBrowserEvent("touchstart", () => setEngage("touchstart")),
    onBrowserEvent("click", () => setEngage("click")),
    onBrowserEvent("keypress", () => setEngage("keypress")),
    onBrowserEvent("scroll", () => setEngage("scroll")),
  ]

  return (): void => {
    if (__timer) clearTimeout(__timer)
    clearWatchers.forEach((clearWatcher) => clearWatcher())
  }
}
