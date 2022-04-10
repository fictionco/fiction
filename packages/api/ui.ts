import { watch } from "vue"
import { emitEvent, onEvent } from "./event"
import { getRouter } from "./router"

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
const __callbacks: { (scope: ResetUiScope): any }[] = []
export const onResetUi = (cb: (scope: ResetUiScope) => void): void => {
  __callbacks.push(cb)

  if (!__listener) {
    __listener = true
    onEvent("resetUi", (scope) => {
      __callbacks.forEach((cb) => cb(scope))
    })
  }
}

export const initializeResetUi = async (): Promise<void> => {
  const router = getRouter()
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") resetUi()
  })
  window.addEventListener("click", () => resetUi())
  watch(
    () => router.currentRoute.value.path,
    (r, old) => {
      if (r != old) resetUi()
    },
  )
}
