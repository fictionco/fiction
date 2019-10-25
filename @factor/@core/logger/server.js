import consola from "consola"
import { logFormatted } from "@factor/logger/util"
export default () => {
  return new (class {
    constructor() {
      this.logger = consola.create({
        level: 5,
        defaults: {
          additionalColor: "white"
        }
      })
    }

    util(type, _arguments) {
      this.logger[type].apply(null, _arguments)

      return _arguments
    }

    custom({ type, params, target }) {
      this.util(type, params, target)
    }

    log() {
      this.util("log", arguments)
    }

    info() {
      this.util("info", arguments)
    }

    success() {
      this.util("success", arguments)
    }

    error() {
      this.util("error", arguments)
    }

    warn() {
      this.util("warn", arguments)
    }

    formatted(_arguments) {
      return logFormatted(_arguments)
    }
  })()
}
