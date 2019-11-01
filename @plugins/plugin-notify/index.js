import { emitEvent, onEvent, addFilter, log } from "@factor/tools"

addFilter("site-components", _ => {
  _["plugin-notify"] = () => import("./toaster.vue")

  return _
})
onEvent("notify", toasterNotification)
onEvent("error", toasterError)

function toasterNotification(obj) {
  let message
  let duration
  if (typeof obj == "string") {
    message = obj
  } else {
    ({ message = "", duration = 2000 } = obj)
  }

  emitEvent("notify-toast", { type: "notify", message, duration })
}

function toasterError(obj) {
  if (typeof obj == "string") {
    emitEvent("notify-toast", { type: "error", message: obj })
  } else {
    if (obj instanceof Error) log.error(obj)

    if (obj.message) {
      emitEvent("notify-toast", { type: "error", message: obj.message })
    }
  }
}
