export type BrowserEvent =
  | 'load'
  | 'mousemove'
  | 'mousedown'
  | 'touchstart'
  | 'click'
  | 'keypress'
  | 'scroll'
  | 'init'
  | 'blur'
  | 'focus'
  | 'pagehide'
  | 'beforeunload'
  | 'visibilitychange'
  | 'dragstart'
  | 'error'

type BrowserEventObject<T> = T extends 'mousemove' | 'mousedown' | 'click'
  ? MouseEvent
  : T extends 'touchstart'
    ? TouchEvent
    : T extends 'keypress'
      ? KeyboardEvent
      : T extends 'dragstart'
        ? DragEvent
        : T extends 'error'
          ? ErrorEvent
          : Event

/**
 * Helper that adds a remover callback and sets options for listeners
 */
export function onBrowserEvent<T extends BrowserEvent>(type: T, fn: (e: BrowserEventObject<typeof type>) => void, target?: HTMLElement | Window | Document): (() => void) {
  if (typeof window === 'undefined' || typeof document === 'undefined')
    return (): void => {}

  const defaultTarget = type === 'scroll' ? document : window

  target = target || defaultTarget

  const options = { capture: true, passive: true }
  target.addEventListener(type, fn as EventListenerOrEventListenerObject, options)
  return (): void => {
    return target?.removeEventListener(type, fn as EventListenerOrEventListenerObject, options)
  }
}
