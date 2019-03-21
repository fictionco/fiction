export default Factor => {
  return new class {
    constructor() {
      Factor.$filters.add("site-components", (_ = {}) => {
        _["plugin-notify"] = () => import("./toaster")

        return _
      })
      Factor.$events.$on("notify", this.toasterNotification)
      Factor.$events.$on("error", this.toasterError)
    }

    toasterNotification(obj) {
      let message
      let duration
      if (typeof obj == "string") {
        message = obj
      } else {
        ;({ message = "", duration = 4000 } = obj)
      }

      Factor.$events.$emit("notify-toast", { type: "notify", message, duration })
    }

    toasterError(obj) {
      if (typeof obj == "string") {
        Factor.$events.$emit("notify-toast", { type: "error", message: obj })
      } else {
        if (obj instanceof Error) {
          console.error(obj)
        }

        if (obj.message) {
          Factor.$events.$emit("notify-toast", { type: "error", message: obj.message })
        }
      }
    }
  }()
}
