import type { ClickOffsetPosition, CustomTrackEvent, Project } from '@kaption/types'

import { finder } from '@medv/finder'
import { fastHash } from '@factor/api'

export const EVENT_RESOLUTION_SECONDS = (): number => 4

// export type BrowserEvent =
//   | "load"
//   | "mousemove"
//   | "mousedown"
//   | "touchstart"
//   | "click"
//   | "keypress"
//   | "scroll"
//   | "init"
//   | "blur"
//   | "focus"
//   | "pagehide"
//   | "beforeunload"
//   | "visibilitychange"
//   | "error"

// type BrowserEventObject<T> = T extends "mousemove" | "mousedown" | "click"
//   ? MouseEvent
//   : T extends "touchstart"
//   ? TouchEvent
//   : T extends "keypress"
//   ? KeyboardEvent
//   : T extends "error"
//   ? ErrorEvent
//   : Event

export function onBrowserEvent<T extends BrowserEvent>(type: T, fn: (e: BrowserEventObject<typeof type>) => void, target?: HTMLElement | Window | Document): (() => void) {
  // in case on server
  if (typeof window === 'undefined')
    return (): void => {}

  if (!target && type === 'scroll')
    target = document
  else
    target = window

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
 * Gets a tracker setting
 */
export function getCustomEvents(): CustomTrackEvent[] {
  const webprojectSettings: Project | undefined = window.__kaption?.project

  const { projectEvents } = webprojectSettings ?? {}

  if (!projectEvents)
    return []

  return Object.values(projectEvents).filter(
    _ => _ && _.eventName,
  ) as CustomTrackEvent[]
}

/**
 * Get the selector of an element from its DOM element
 * https://github.com/antonmedv/finder
 */
export function cssPath(el?: HTMLElement | null): string {
  if (!el)
    return ''

  return finder(el, {
    idName: () => true,
    tagName: () => true,

    seedMinLength: 3,
  })
}
/**
 * Get identifying information from an HTMLElement
 */
export function elementId(el: HTMLElement): { selector: string, hash: string } {
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
export function clickId(event: MouseEvent): {
  selector: string
  hash: string
  position: ClickOffsetPosition
} {
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

/**
 * In an iFrame?
 * https://stackoverflow.com/a/326076/1858322
 */
export function inIFrame(): boolean {
  try {
    return window.self !== window.top
  }
  catch {
    return true
  }
}
/**
 * group array into elements by key
 */
export function groupBy<
  T extends Record<string, any[]> = Record<string, any[]>,
>(items: any[], key: string): T {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return items.reduce(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    (result, item) => ({
      ...result,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,  @typescript-eslint/no-unsafe-assignment
      [item[key]]: [...(result[item[key]] || []), item],
    }),
    {},
  )
}

// export const slugify = (text?: string): string => {
//   if (!text) return ""

//   return text
//     .toString()
//     .toLowerCase()
//     .replace(/\s+/g, "-") // Replace spaces with -
//     .replace(/--+/g, "-") // Replace multiple - with single -
//     .replace(/^-+/, "") // Trim - from start of text
//     .replace(/-+$/, "") // Trim - from end of text
// }
/**
 * Is a string valid parsable json
 */
// export const isValidJson = (str?: string): undefined | unknown => {
//   if (!str) return undefined
//   try {
//     const r = JSON.parse(str) as unknown
//     return r
//   } catch {
//     return undefined
//   }
// }

// export const getDeviceType = (): "mobile" | "tablet" | "laptop" | "desktop" => {
//   const width = screen.width
//   if (width < 600) return "mobile"
//   else if (width < 950) return "tablet"
//   else if (width <= 1550) return "laptop"
//   else return "desktop"
// }
