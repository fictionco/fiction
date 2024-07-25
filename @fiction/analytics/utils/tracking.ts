import { log } from '@fiction/core/plugin-log/index.js'
import { fastHash, inIFrame } from '@fiction/core/utils/utils.js'
import { isNode } from '@fiction/core/utils/vars.js'
import { type BrowserEvent, onBrowserEvent } from '@fiction/core/utils/eventBrowser.js'

/**
 * Establish if we should be tracking this browser
 */
export function shouldTrack(): boolean | void {
  if (typeof window === 'undefined' || isNode())
    return log.error('shouldTrack', 'not browser')

  if (inIFrame())
    return log.error('shouldTrack', 'in iFrame')

  if (navigator.doNotTrack === '1')
    return log.error('shouldTrack', 'doNotTrack is 1')

  return true
}

/**
 * Watches browser activity and calls functions based on
 * changes of state or idle time (no interactions)
 */
export class ActivityTrigger {
  private timer?: NodeJS.Timeout
  private isIdle = false
  private clear: (() => void)[] = []
  private lastEngage: number
  private activeStart: number

  constructor(private config: {
    onIdle?: (t: number) => void
    onActive?: (b: BrowserEvent) => void
    onEngage?: (b: BrowserEvent) => void
    idleSeconds?: number
    idleCheckMs?: number
    idleGraceSec?: number
  }) {
    this.lastEngage = this.activeStart = Date.now()
    this.watch()
  }

  reset(): void {
    this.clear.forEach(cb => cb())
  }

  private setIdle(timeIdle = 0): void {
    this.isIdle = true
    this.config.onIdle?.(timeIdle)
  }

  private setActive(event: BrowserEvent): void {
    this.activeStart = Date.now()
    this.isIdle = false
    this.config.onActive?.(event)
  }

  private setEngage(event: BrowserEvent): void {
    this.lastEngage = Date.now()
    if (this.isIdle)
      this.setActive(event)
    this.config.onEngage?.(event)
  }

  private watch(): void {
    this.setEngage('init')

    const events = ['load', 'mousemove', 'mousedown', 'touchstart', 'click', 'keypress', 'scroll'] as const
    this.clear = events.map(event => onBrowserEvent(event, () => this.setEngage(event as BrowserEvent)))

    this.timer = setInterval(() => {
      if (!this.isIdle && Date.now() > this.lastEngage + (this.config.idleSeconds || 5) * 1000) {
        const secondsActive = Math.round((this.lastEngage - this.activeStart) / 1000)
        this.setIdle(secondsActive + (this.config.idleGraceSec || 5))
      }
    }, this.config.idleCheckMs || 1000)

    this.clear.push(() => clearInterval(this.timer))

    this.timer.unref()
  }
}
/**
 * Gets the URL if set by <link ref="canonical"> tag
 */
export function canonicalUrlFromTag(): string | undefined {
  if (typeof document === 'undefined')
    return

  const tags = document.querySelectorAll('link')
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i]
    if (tag.getAttribute('rel') === 'canonical')
      return tag.getAttribute('href') ?? undefined
  }
  return undefined
}
/**
 * Return the canonical URL and remove the hash.
 */
export function getCanonicalUrl(): string | undefined {
  if (typeof window === 'undefined')
    return

  const { search = '' } = location
  const canonical = canonicalUrlFromTag()
  let url
  if (!canonical)
    url = window.location.href.replace(/#.*$/, '')
  else if (/\?/.test(canonical))
    url = canonical
  else
    url = canonical + search

  return url
}

interface ClickTime {
  event: MouseEvent
  time: Date
}

export function detectMultiClick({ count, interval, clicks, radius }: {
  count: number
  interval: number
  clicks: ClickTime[]
  radius: number
}): boolean {
  if (clicks.length < count)
    return false

  const last = clicks.length - 1
  const lastClickTime = clicks[last].time.getTime()
  const firstClickTime = clicks[0].time.getTime()
  const timeDiff = (lastClickTime - firstClickTime) / 1000
  // returns false if it event period is longer than interval
  if (timeDiff > interval)
    return false

  // check click distance
  const radiusSquare = radius ** 2
  let maxDistanceSquare = 0
  for (let i = last - count + 1; i < last; i++) {
    for (let j = i + 1; j <= last; j++) {
      const distanceSquare
        = (clicks[i].event.clientX - clicks[j].event.clientX) ** 2
        + (clicks[i].event.clientY - clicks[j].event.clientY) ** 2
      if (distanceSquare > maxDistanceSquare)
        maxDistanceSquare = distanceSquare
      if (distanceSquare > radiusSquare)
        return false
    }
  }
  return true
}
/**
 * Triggers a callback when a rage click occurs
 * A "rage click" is when a user clicks three times on the same things out of frustration
 */
export function onRageClick(cb: (event: MouseEvent) => void): void {
  let clicks: ClickTime[] = []
  const radius = 50 // certain circle area
  const possible = 3
  onBrowserEvent(
    'click',
    (event: MouseEvent) => {
      clicks.push({ event, time: new Date() })

      // remain only required number of click events and remove left of them.
      if (clicks.length > possible)
        clicks.splice(0, clicks.length - possible)

      // detect 3 click in .5 sec
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

interface SelectorOptions {
  idOnly?: boolean
  maxDepth?: number
  includeClasses?: boolean
  shortestPath?: boolean
  ignoreTailwindClasses?: boolean
}

export function getSelector(element: HTMLElement | null, options: SelectorOptions = {}): string {
  if (!element)
    return ''

  const {
    idOnly = false,
    maxDepth = Infinity,
    includeClasses = true,
    shortestPath = true,
    ignoreTailwindClasses = true,
  } = options

  const path: string[] = []
  let depth = 0

  while (element && element.nodeType === Node.ELEMENT_NODE && depth < maxDepth) {
    let selector = element.nodeName.toLowerCase()

    if (element.id) {
      selector = `${selector}#${element.id}`
    }
    else if (includeClasses && element.className) {
      const classNameStr = typeof element.className === 'string' ? element.className : ''
      const classes = classNameStr.trim().split(/\s+/)
      const filteredClasses = ignoreTailwindClasses
        ? classes.filter(cls => !isTailwindClass(cls))
        : classes

      if (filteredClasses.length > 0) {
        selector += `.${filteredClasses.join('.')}`
      }
    }

    if (!shortestPath || (!element.id && element !== document.body && element !== document.documentElement)) {
      let sibling = element
      let siblingIndex = 1
      while (sibling.previousElementSibling) {
        sibling = sibling.previousElementSibling as HTMLElement
        if (sibling.nodeName.toLowerCase() === selector.split(/[#.]/)[0]) {
          siblingIndex++
        }
      }
      if (siblingIndex > 1) {
        selector += `:nth-of-type(${siblingIndex})`
      }
    }

    path.unshift(selector)

    if (element.id && (idOnly || shortestPath) && element !== document.body && element !== document.documentElement) {
      break
    }

    element = element.parentElement
    depth++
  }

  if (path.length === 1 && path[0] === 'body') {
    return 'body'
  }

  return path.join(' > ')
}

function isTailwindClass(className: string): boolean {
  const tailwindPrefixes = ['sm:', 'md:', 'lg:', 'xl:', '2xl:', 'hover:', 'focus:', 'active:', 'group-hover:', 'dark:']
  const utilityPatterns = [
    /^(m|p)([trblxy])?-/, // margins and paddings
    /^(w|h)-/, // widths and heights
    /^(min|max)-(w|h)-/, // min/max widths and heights
    /^(text|bg|border)-/, // text, background, and border colors
    /^flex(-.*)?$/, // flex utilities
    /^grid(-.*)?$/, // grid utilities
    /^(rounded|shadow)-/, // border radius and shadows
    /^(items|justify)-/, // flexbox alignment
    /^font-/, // font utilities
    /^(container|mx-auto)$/, // container and auto margin
    /^[a-z]+-\[.+\]$/, // arbitrary values
    /^group$/, // group class
  ]

  return tailwindPrefixes.some(prefix => className.startsWith(prefix))
    || utilityPatterns.some(pattern => pattern.test(className))
}

interface ClickOffsetPosition {
  targetWidth: number
  targetHeight: number
  offsetX: number
  offsetY: number
  xPercent: number
  yPercent: number
}

export function elementId(el: HTMLElement): { selector: string, hash: string } {
  const selector = el.dataset.selector || getSelector(el)
  const pathname = window.location.pathname
  const innerText = el.textContent?.trim().substring(0, 50) // Use trimmed innerText instead of innerHTML
  return {
    selector,
    hash: el.dataset.hash || fastHash([pathname, selector, innerText]),
  }
}

export function clickId(event: MouseEvent): {
  selector: string
  hash: string
  position: ClickOffsetPosition
  elementType: string
  elementContent: string
} {
  const target = event.target as HTMLElement
  const { hash, selector } = elementId(target)

  const { width: targetWidth, height: targetHeight, left, top } = target.getBoundingClientRect()

  const offsetX = event.clientX - left
  const offsetY = event.clientY - top

  const xPercent = Number((offsetX / targetWidth).toFixed(4))
  const yPercent = Number((offsetY / targetHeight).toFixed(4))

  const position: ClickOffsetPosition = {
    targetWidth,
    targetHeight,
    offsetX,
    offsetY,
    xPercent,
    yPercent,
  }

  const elementType = target.tagName.toLowerCase()
  const elementContent = target.textContent?.trim().substring(0, 50) || '' // Limit content to 50 characters

  return { hash, selector, position, elementType, elementContent }
}
export function getDeviceType(width: number): 'mobile' | 'tablet' | 'laptop' | 'desktop' {
  if (width < 600)
    return 'mobile'
  else if (width < 950)
    return 'tablet'
  else if (width <= 1550)
    return 'laptop'
  else return 'desktop'
}
export type OffloadEvent =
  | 'pagehide'
  | 'unload'
  | 'visibilitychange'
  | 'historyChange'
  | 'leftIdle'
  | 'windowBlur'
  | 'expireSession'

type EventCallback = (offloadType: OffloadEvent) => void

export class UnloadHandler {
  private unloadCallbacks: EventCallback[] = []
  private unloadWatchers: (() => void)[] = []
  public unloaded = false
  public focused = true
  private timer: NodeJS.Timeout | null = null
  private isClient: boolean

  constructor(private win?: Window, private doc?: Document) {
    this.isClient = typeof window !== 'undefined'
    this.win = this.isClient ? (win || window) : undefined
    this.doc = this.isClient ? (doc || document) : undefined
  }

  public clear(): void {
    this.unloadWatchers.forEach(clearWatcher => clearWatcher())
    this.unloadWatchers = []
    this.unloadCallbacks = []
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    this.unloaded = false
    this.focused = true
  }

  public unload(offloadType: OffloadEvent): void {
    if (!this.unloaded) {
      this.unloadCallbacks.forEach(cb => cb(offloadType))
      this.unloaded = true
    }
  }

  public timedUnload(args: { reason: OffloadEvent, wait?: number }): void {
    const { reason, wait = 30_000 } = args
    if (this.timer) {
      clearTimeout(this.timer)
    }

    this.focused = false
    this.timer = setTimeout(() => {
      if (!this.focused) {
        this.unload(reason)
      }
    }, wait) as unknown as NodeJS.Timeout
  }

  public onUnload(cb: EventCallback): void {
    this.unloadCallbacks.push(cb)
    if (this.isClient && this.unloadWatchers.length === 0) {
      this.setupEventListeners()
    }
  }

  private setupEventListeners(): void {
    if (!this.win || !this.doc)
      return

    const events: Array<[string, EventListenerOrEventListenerObject]> = [
      ['pagehide', () => this.unload('pagehide')],
      ['beforeunload', () => this.unload('unload')],
      ['visibilitychange', this.handleVisibilityChange.bind(this)],
      ['blur', () => this.timedUnload({ reason: 'windowBlur', wait: 120_000 })],
      ['focus', () => this.setFocused(true)],
      ['mousemove', () => this.setFocused(true)],
    ]

    events.forEach(([event, listener]) => {
      this.win!.addEventListener(event, listener)
      this.unloadWatchers.push(() => this.win!.removeEventListener(event, listener))
    })
  }

  public handleVisibilityChange(): void {
    if (!this.doc)
      return
    if (this.doc.visibilityState === 'hidden') {
      this.timedUnload({ reason: 'visibilitychange' })
    }
    else if (this.doc.visibilityState === 'visible') {
      this.setFocused(true)
    }
  }

  public setFocused(value: boolean): void {
    this.focused = value
  }
}

export const UnloadUtility = new UnloadHandler()
