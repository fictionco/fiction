import type { FictionRouter } from '../plugin-router'
import { vue } from './libraries'
import { emitEvent, onEvent } from './event'

type ResetUiScope = 'all' | 'inputs' | 'iframe'
interface ResetUiDetail {
  scope: ResetUiScope
  cause: string
}
/**
 * Emits an event that will reset ui on all dynamic UI components
 */
export function resetUi(args?: ResetUiDetail): void {
  args = { scope: 'all', cause: 'unknown', ...args }
  emitEvent('resetUi', args)
}
/**
 * Make a single listener to prevent large numbers of listeners across many looped components
 * Large amount of listeners triggers memory leak warnings, etc.
 */
let __listener = false
const __callbacks: { (args: ResetUiDetail): void }[] = []
export function onResetUi(cb: (args: ResetUiDetail) => void, _args: { location?: string } = {}): void {
  __callbacks.push(cb)

  if (!__listener) {
    __listener = true
    onEvent('resetUi', (args: ResetUiDetail) => {
      __callbacks.forEach(cb => cb(args || {}))
    })
  }
}

export async function initializeResetUi(fictionRouter: FictionRouter): Promise<void> {
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Tab')
      resetUi({ scope: 'all', cause: 'escape' })
  })

  window.addEventListener('click', () => {
    resetUi({ scope: 'all', cause: 'windowClick' })
  })
  vue.watch(
    () => fictionRouter.current.value.path,
    (r, old) => {
      if (r !== old)
        resetUi({ scope: 'all', cause: 'routeChange' })
    },
  )
}

interface WindowSize {
  width: number
  height: number
  breakpoint: Record<'sm' | 'md' | 'lg' | 'xl' | '2xl', boolean>
}
export function getWindowSize(): vue.Ref<WindowSize> {
  const windowSize = vue.ref<WindowSize>({
    height: 0,
    width: 0,
    breakpoint: {
      'sm': true,
      'md': false,
      'lg': false,
      'xl': false,
      '2xl': false,
    },
  })

  if (typeof window !== 'undefined' && typeof ResizeObserver !== 'undefined') {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect

        windowSize.value = {
          width,
          height,
          breakpoint: {
            'sm': true,
            'md': width > 640,
            'lg': width > 768,
            'xl': width > 1024,
            '2xl': width > 1280,
          },
        }
      }
    })

    resizeObserver.observe(document.body)
  }

  return windowSize
}

export const windowSize = getWindowSize()
