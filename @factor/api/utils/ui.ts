import type { FactorRouter } from "../plugin-router"
import { vue } from "./libraries"
import { emitEvent, onEvent } from "./event"

type ResetUiScope = "all" | "inputs"
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
    if (e.key === "Escape") resetUi()
  })
  window.addEventListener("click", () => resetUi())
  vue.watch(
    () => factorRouter.router.currentRoute.value.path,
    (r, old) => {
      if (r != old) resetUi()
    },
  )
}
