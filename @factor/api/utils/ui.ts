import type { FactorRouter } from "../plugin-router"
import { vue } from "./libraries"
import { emitEvent, onEvent } from "./event"

type ResetUiScope = "all" | "inputs" | "iframe"
/**
 * Emits an event that will reset ui on all dynamic UI components
 */
export const resetUi = (scope: ResetUiScope = "all"): void => {
  emitEvent("resetUi", scope)
}
/**
 * Make a single listener to prevent large numbers of listeners across many looped components
 * Large amount of listeners triggers memory leak warnings, etc.
 */
let __listener = false
const __callbacks: { (scope: ResetUiScope): void }[] = []
export const onResetUi = (cb: (scope: ResetUiScope) => void): void => {
  __callbacks.push(cb)
  if (!__listener) {
    __listener = true
    onEvent("resetUi", (scope: ResetUiScope) => {
      __callbacks.forEach((cb) => cb(scope))
    })
  }
}

export const initializeResetUi = async (
  factorRouter: FactorRouter,
): Promise<void> => {
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape" || e.key == "Tab") resetUi()
  })
  window.addEventListener("click", () => {
    resetUi()
  })
  vue.watch(
    () => factorRouter.router.currentRoute.value.path,
    (r, old) => {
      if (r != old) resetUi()
    },
  )
}

type WindowSize = {
  width: number
  height: number
  breakpoint: Record<"sm" | "md" | "lg" | "xl" | "2xl", boolean>
}
export const getWindowSize = (): vue.Ref<WindowSize> => {
  const windowSize = vue.ref<WindowSize>({
    height: 0,
    width: 0,
    breakpoint: {
      sm: true,
      md: false,
      lg: false,
      xl: false,
      "2xl": false,
    },
  })

  if (typeof window !== "undefined") {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect

        windowSize.value = {
          width,
          height,
          breakpoint: {
            sm: true,
            md: width > 640,
            lg: width > 768,
            xl: width > 1024,
            "2xl": width > 1280,
          },
        }
      }
    })

    resizeObserver.observe(document.body)
  }

  return windowSize
}

export const windowSize = getWindowSize()
