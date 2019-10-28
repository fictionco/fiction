import { emitEvent, onEvent } from "@factor/tools"
export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.add("site-components", _ => {
        _["plugin-notify"] = () => import("./toaster")

        return _
      })
      onEvent("notify", this.toasterNotification)
      onEvent("error", this.toasterError)
      onEvent("email", this.sendEmail)
    }

    async sendEmail(obj) {}

    toasterNotification(obj) {
      let message
      let duration
      if (typeof obj == "string") {
        message = obj
      } else {
        ;({ message = "", duration = 2000 } = obj)
      }

      emitEvent("notify-toast", { type: "notify", message, duration })
    }

    toasterError(obj) {
      if (typeof obj == "string") {
        emitEvent("notify-toast", { type: "error", message: obj })
      } else {
        if (obj instanceof Error) {
          console.error(obj)
        }

        if (obj.message) {
          emitEvent("notify-toast", { type: "error", message: obj.message })
        }
      }
    }
  })()
}
