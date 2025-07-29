type BrowserEventMap = {
  load: Event
  mousemove: MouseEvent
  mousedown: MouseEvent
  touchstart: TouchEvent
  click: MouseEvent
  keypress: KeyboardEvent
  keydown: KeyboardEvent
  keyup: KeyboardEvent
  scroll: Event
  init: Event // Note: 'init' is not a standard DOM event, so using Event as a fallback
  blur: FocusEvent
  focus: FocusEvent
  pagehide: PageTransitionEvent
  beforeunload: BeforeUnloadEvent
  visibilitychange: Event
  dragstart: DragEvent
  error: ErrorEvent
}

export type BrowserEvent = keyof BrowserEventMap

export type BrowserEventObject<T extends BrowserEvent> = BrowserEventMap[T]

/**
 * Helper that adds a remover callback and sets options for listeners
 */
export function onBrowserEvent<T extends BrowserEvent>(type: T, fn: (e: BrowserEventObject<typeof type>) => void, target?: HTMLElement | Window | Document): (() => void) {
  if (typeof window === 'undefined' || typeof document === 'undefined')
    return (): void => {}

  const defaultTarget = type === 'scroll' ? document : window

  target = target || defaultTarget

  const options = { capture: true, passive: true }

  if (!target.addEventListener) {
    throw new Error(`${type}: target does not have addEventListener method`)
  }

  target.addEventListener(type, fn as EventListenerOrEventListenerObject, options)
  return (): void => {
    return target?.removeEventListener(type, fn as EventListenerOrEventListenerObject, options)
  }
}
