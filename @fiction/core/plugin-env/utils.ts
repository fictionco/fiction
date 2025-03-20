import process from 'node:process'
import { log } from '../plugin-log/index.js'

export function done(code: 0 | 1, message = `exited process`): never {
  if (message)
    log.info('CLI', `done: ${message} (${code})`)

  process.exit(code)
}
