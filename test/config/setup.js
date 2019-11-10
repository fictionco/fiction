import consola from "consola"
import chalk from "chalk"
import env from "std-env"
import exit from "exit"
import Factor from "vue"

// Import this to resolve any dependency cycle issues
import "@factor/tools"
process.env.FACTOR_ENV = "test"
process.env.FACTOR_CWD = process.cwd()

Factor.config.devtools = false

const isWin = env.windows

describe.win = isWin ? describe : describe.skip
test.win = isWin ? test : test.skip

describe.posix = !isWin ? describe : describe.skip
test.posix = !isWin ? test : test.skip

chalk.enabled = false

jest.setTimeout(60000)

consola.mockTypes(() => jest.fn())

function errorTrap(error, data) {
  if (error && error.stack) {
    process.stderr.write(`\n${error.stack}\n`)
  } else {
    process.stderr.write(require("util").inspect(data))
  }

  exit(1)
}

process.on("unhandledRejection", error =>
  errorTrap(error, { context: "unhandledRejection" })
)
process.on("uncaughtException", error =>
  errorTrap(error, { context: "uncaughtException" })
)

if (typeof window !== "undefined") {
  const noop = () => {}
  Object.defineProperty(window, "scrollTo", { value: noop, writable: true })
}

// EXTEND
expect.extend({
  toContainObject(received, argument) {
    const pass = this.equals(
      received,
      expect.arrayContaining([expect.objectContaining(argument)])
    )

    if (pass) {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            received
          )} not to contain object ${this.utils.printExpected(argument)}`,
        pass: true
      }
    } else {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            received
          )} to contain object ${this.utils.printExpected(argument)}`,
        pass: false
      }
    }
  }
})
