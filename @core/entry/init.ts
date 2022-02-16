import { resetUi } from "@factor/api"
import { getRouter } from "@factor/api/router"
import { watch } from "vue"
export const initializeWindow = async (): Promise<void> => {
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
