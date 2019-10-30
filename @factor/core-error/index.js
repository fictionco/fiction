import { emitEvent } from "@factor/tools"
class FactorError extends Error {
  constructor({ message, statusCode, properties = {} }) {
    super(message)

    this.statusCode = statusCode && !isNaN(statusCode) ? statusCode : 500
    this.description = message
    this.properties = properties
  }
}

export default () => {
  return new (class {
    constructor() {}

    create() {
      let args =
        arguments.length > 1
          ? {
              statusCode: arguments[0],
              message: arguments[1],
              properties: arguments[2]
            }
          : arguments[0]

      if (typeof args == "string") {
        args = { statusCode: 500, message: args }
      }

      return new FactorError(args)
    }
    throw() {
      throw Reflect.apply(this.create, this, arguments)
    }

    notify() {
      const err = Reflect.apply(this.create, this, arguments)
      const { stackTrace, statusCode, description } = err

      if (statusCode < 500 && statusCode >= 400) {
        emitEvent("error", { message: description })
      } else {
        console.error(description, stackTrace)
      }
    }
  })()
}
