import { emitEvent, onEvent, pushToFilter, log } from "@factor/tools"
import { Component } from "vue"

const toasterNotification = (
  obj: string | { message: string; duration: number }
): void => {
  let message
  let duration
  if (typeof obj == "string") {
    message = obj
  } else {
    ({ message = "", duration = 2000 } = obj)
  }

  emitEvent("notify-toast", { type: "notify", message, duration })
}

const toasterError = (obj: Error | string): void => {
  if (typeof obj == "string") {
    emitEvent("notify-toast", { type: "error", message: obj })
  } else {
    if (obj instanceof Error) log.error(obj)

    if (obj.message) {
      emitEvent("notify-toast", { type: "error", message: obj.message })
    }
  }
}

export const setup = (): void => {
  pushToFilter({
    hook: "site-components",
    key: "notification",
    item: {
      name: "plugin-notify",
      component: (): Promise<Component> => import("./toaster.vue")
    }
  })

  onEvent("notify", toasterNotification)
  onEvent("error", toasterError)
}
setup()
