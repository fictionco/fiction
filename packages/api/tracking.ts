import { finder } from "@medv/finder"
import { fastHash, isNode } from "./utils"
import { logger } from "./logger"

export interface ClickOffsetPosition {
  targetWidth: number
  targetHeight: number
  offsetX: number
  offsetY: number
  xPercent: number
  yPercent: number
}

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
  | "error"

type BrowserEventObject<T> = T extends "mousemove" | "mousedown" | "click"
  ? MouseEvent
  : T extends "touchstart"
  ? TouchEvent
  : T extends "keypress"
  ? KeyboardEvent
  : T extends "dragstart"
  ? DragEvent
  : T extends "error"
  ? ErrorEvent
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
  if (isNode) {
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
export class ActivityTrigger {
  private onIdle: (t: number) => void
  private onActive: (ev: BrowserEvent) => void
  private onEngage: (ev: BrowserEvent) => void
  private idleSeconds: number
  private timer: NodeJS.Timeout | undefined = undefined
  private lastEngage: number
  private activeStart: number
  private isIdle = false
  private clear: (() => void)[] = []
  constructor({
    onIdle = (): void => {},
    onActive = (): void => {},
    onEngage = (): void => {},
    idleSeconds = 5,
  }: {
    onIdle?: (t: number) => void
    onActive?: (b: BrowserEvent) => void
    onEngage?: (b: BrowserEvent) => void
    idleSeconds?: number
  }) {
    this.onIdle = onIdle
    this.onActive = onActive
    this.onEngage = onEngage
    this.idleSeconds = idleSeconds
    this.activeStart = +Date.now()
    this.lastEngage = +Date.now()
    this.watch()
  }

  public reset(): void {
    if (this.clear.length > 0) {
      this.clear.forEach((cb) => cb())
    }
  }

  private timeWindow(): number {
    return this.idleSeconds * 1000
  }

  private setIdle(timeIdle = 0): void {
    this.isIdle = true
    this.onIdle(timeIdle)
  }

  private setActive(browserEvent: BrowserEvent): void {
    this.activeStart = +Date.now()
    this.isIdle = false
    this.onActive(browserEvent)
  }

  private setEngage(browserEvent: BrowserEvent): void {
    this.lastEngage = +Date.now()
    if (this.isIdle) {
      this.setActive(browserEvent)
    }

    this.onEngage(browserEvent)
  }

  private watch(): void {
    this.setEngage("init")

    const clearWatchers = [
      onBrowserEvent("load", () => this.setEngage("load")),
      onBrowserEvent("mousemove", () => this.setEngage("mousemove")),
      onBrowserEvent("mousedown", () => this.setEngage("mousedown")),
      onBrowserEvent("touchstart", () => this.setEngage("touchstart")),
      onBrowserEvent("click", () => this.setEngage("click")),
      onBrowserEvent("keypress", () => this.setEngage("keypress")),
      onBrowserEvent("scroll", () => this.setEngage("scroll")),
    ]

    this.timer = setInterval(() => {
      if (!this.isIdle) {
        const now = +Date.now()
        if (now > this.lastEngage + this.timeWindow()) {
          const secondsActive = Math.round(
            (this.lastEngage - this.activeStart) / 1000,
          )
          this.setIdle(secondsActive + 5) // 5 seconds grace period
        }
      }
    }, 1000)

    this.clear = [
      () => {
        if (this.timer) clearInterval(this.timer)
      },
      ...clearWatchers,
    ]
  }
}
/**
 * Gets the URL if set by <link ref="canonical"> tag
 */
export const canonicalUrlFromTag = (): string | undefined => {
  if (isNode) return

  const tags = document.querySelectorAll("link")
  for (let i = 0, tag; (tag = tags[i]); i++) {
    if (tag.getAttribute("rel") === "canonical") {
      return tag.getAttribute("href") ?? undefined
    }
  }
  return undefined
}
/**
 * Return the canonical URL and remove the hash.
 */
export const getCanonicalUrl = (): string | undefined => {
  if (isNode) return

  const { search = "" } = location
  const canonical = canonicalUrlFromTag()
  let url
  if (!canonical) {
    url = window.location.href.replace(/#.*$/, "")
  } else if (/\?/.test(canonical)) {
    url = canonical
  } else {
    url = canonical + search
  }
  return url
}

interface ClickTime {
  event: MouseEvent
  time: Date
}

export const detectMultiClick = ({
  count,
  interval,
  clicks,
  radius,
}: {
  count: number
  interval: number
  clicks: ClickTime[]
  radius: number
}): boolean => {
  if (clicks.length < count) {
    return false
  }

  const last = clicks.length - 1
  const lastClickTime = clicks[last].time.getTime()
  const firstClickTime = clicks[0].time.getTime()
  const timeDiff = (lastClickTime - firstClickTime) / 1000
  //returns false if it event period is longer than interval
  if (timeDiff > interval) return false

  //check click distance
  const radiusSquare = Math.pow(radius, 2)
  let maxDistanceSquare = 0
  for (let i = last - count + 1; i < last; i++) {
    for (let j = i + 1; j <= last; j++) {
      const distanceSquare =
        Math.pow(clicks[i].event.clientX - clicks[j].event.clientX, 2) +
        Math.pow(clicks[i].event.clientY - clicks[j].event.clientY, 2)
      if (distanceSquare > maxDistanceSquare) maxDistanceSquare = distanceSquare
      if (distanceSquare > radiusSquare) return false
    }
  }
  return true
}
/**
 * Triggers a callback when a rage click occurs
 * A "rage click" is when a user clicks three times on the same things out of frustration
 */
export const onRageClick = (cb: (event: MouseEvent) => void): void => {
  let clicks: ClickTime[] = []
  const radius = 50 //certain circle area
  const possible = 3
  onBrowserEvent(
    "click",
    (event: MouseEvent) => {
      clicks.push({ event, time: new Date() })

      //remain only required number of click events and remove left of them.
      if (clicks.length > possible) {
        clicks.splice(0, clicks.length - possible)
      }

      //detect 3 click in .5 sec
      if (clicks.length >= 3) {
        const result = detectMultiClick({
          count: possible,
          interval: 0.5,
          clicks,
          radius,
        })
        if (result) {
          cb(event)
          clicks = []
        }
      }
    },
    document,
  )
}

/**
 * Get the selector of an element from its DOM element
 * https://github.com/antonmedv/finder
 */
export const cssPath = (el?: HTMLElement | null): string => {
  if (!el) return ""

  return finder(el, {
    idName: () => true,
    tagName: () => true,

    seedMinLength: 3,
  })
}
/**
 * Get identifying information from an HTMLElement
 */
export const elementId = (
  el: HTMLElement,
): { selector: string; hash: string } => {
  const selector = el.dataset.selector || cssPath(el)
  const pathname = location.pathname
  return {
    selector,
    hash: el.dataset.hash || fastHash([pathname, selector, el.innerHTML]),
  }
}
/**
 * Get analytics information for click events
 */
export const clickId = (
  event: MouseEvent,
): {
  selector: string
  hash: string
  position: ClickOffsetPosition
} => {
  const target = event.target as HTMLElement
  const { hash, selector } = elementId(target)

  // left/top are relative to viewport
  const {
    width: targetWidth,
    height: targetHeight,
    left,
    top,
  } = target.getBoundingClientRect()

  // clientX, clientY are relative to viewport

  const clientX = event.clientX
  const clientY = event.clientY

  // offset within the target
  const offsetX = clientX - left
  const offsetY = clientY - top

  const xPercentFloat = offsetX / targetWidth
  const xPercent = Math.round(xPercentFloat * 10_000) / 10_000

  const yPercentFloat = offsetY / targetHeight
  const yPercent = Math.round(yPercentFloat * 10_000) / 10_000

  const position: ClickOffsetPosition = {
    targetWidth,
    targetHeight,
    offsetX,
    offsetY,
    xPercent,
    yPercent,
  }

  return { hash, selector, position }
}

export const getDeviceType = (
  width: number,
): "mobile" | "tablet" | "laptop" | "desktop" => {
  if (width < 600) return "mobile"
  else if (width < 950) return "tablet"
  else if (width <= 1550) return "laptop"
  else return "desktop"
}

export type OffloadEvent =
  | "pagehide"
  | "unload"
  | "visibilitychange"
  | "historyChange"
  | "leftIdle"
  | "windowBlur"
  | "expireSession"

type EventCallback = (offloadType: OffloadEvent) => void

class UnloadHandler {
  private unloadCallbacks: EventCallback[] = []
  private unloadWatchers: (() => void)[] = []
  public unloaded = false
  focused = true
  private timer: NodeJS.Timeout | undefined = undefined

  public clear(): void {
    this.unloadWatchers.forEach((clearWatcher) => clearWatcher())
    this.unloadWatchers = []
    this.unloadCallbacks = []
  }

  private unload(offloadType: OffloadEvent): void {
    logger.log({
      level: "info",
      context: "unload",
      description: `maybe unload: ${this.unloaded}`,
    })
    if (!this.unloaded) {
      this.unloadCallbacks.forEach((cb) => cb(offloadType))
      this.unloaded = true
    }
  }

  private timedUnload(args: { reason: OffloadEvent; wait?: number }): void {
    const { reason, wait = 30_000 } = args
    if (this.timer) clearTimeout(this.timer)

    this.focused = true
    this.timer = setTimeout(() => {
      if (!this.focused) {
        this.unload(reason)
      }
    }, wait)
  }

  public onUnload(cb: EventCallback): void {
    this.unloadCallbacks.push(cb)
    if (!isNode && this.unloadWatchers.length == 0) {
      this.unloadWatchers = [
        onBrowserEvent("pagehide", () => this.unload("pagehide")),
        onBrowserEvent("beforeunload", () => this.unload("unload")),
        onBrowserEvent(
          "visibilitychange",
          () => {
            const v = document.visibilityState
            if (v === "hidden") {
              this.timedUnload({ reason: "visibilitychange" })
            } else if (v == "visible") {
              this.focused = true
            }
          },
          document,
        ),
        // blur events should only trigger exit if the window isn't
        // refocused within 60s
        onBrowserEvent("blur", () => {
          this.timedUnload({ reason: "windowBlur", wait: 120_000 })
        }),
        onBrowserEvent("focus", () => (this.focused = true)),
        onBrowserEvent("mousemove", () => (this.focused = true)),
      ]
    }
  }
}

export const UnloadUtility = new UnloadHandler()
