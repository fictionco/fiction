class FactorError extends Error {
  constructor({ message, statusCode, properties = {} }) {
    super(message)

    this.statusCode = statusCode && !isNaN(statusCode) ? statusCode : 500

    this.description = message
    this.stackTrace = properties.stackTrace || new Error(message).stack
    this.properties = properties
  }
}

module.exports.default = Factor => {
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
      throw this.create.apply(this, arguments)
    }

    notify() {
      const err = this.create.apply(this, arguments)
      const { stackTrace, statusCode, description } = err
      if (statusCode < 500 && statusCode >= 400) {
        Factor.$events.$emit("error", { message: description })
      } else {
        console.error(description, stackTrace)
      }
    }
  })()
}
