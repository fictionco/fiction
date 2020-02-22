import { emitEvent, onEvent, pushToFilter, log } from "@factor/api"
import { Component } from "vue"
import { waitFor } from "@factor/api/utils"
interface NotificationInfo {
  type: "notify" | "error";
  message: string;
  duration?: number;
}

/**
 * Emits a notification event
 * Waits for 50ms to ensure listeners are ready
 * @param info - notification config
 */
const emitNotification = async (info: NotificationInfo): Promise<void> => {
  await waitFor(50)
  emitEvent("notify-toast", info)
}

const toasterNotification = (
  obj: string | { message: string; duration: number }
): void => {
  let message
  let duration
  if (typeof obj == "string") {
    message = obj
  } else {
    ({ message = "", duration = 3000 } = obj)
  }

  emitNotification({ type: "notify", message, duration })
}

const toasterError = (obj: Error | string): void => {
  const duration = 5000
  if (typeof obj == "string") {
    emitNotification({ type: "error", message: obj, duration })
  } else {
    if (obj instanceof Error) log.error(obj)

    if (obj.message) {
      emitNotification({ type: "error", message: obj.message, duration })
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
