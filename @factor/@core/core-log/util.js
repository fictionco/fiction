import consola from "consola"

const logger = consola.create({
  level: 5,
  defaults: {
    additionalColor: "white"
  }
})

export function logError() {
  Reflect.apply(logger.error, null, arguments)
}
