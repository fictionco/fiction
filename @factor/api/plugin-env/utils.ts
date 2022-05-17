import { log } from "@factor/api"

export const done = (code: 0 | 1, message = `exited process`): never => {
  if (message) {
    log.info("CLI", `${message} (${code})`)
  }

  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(code)
}
