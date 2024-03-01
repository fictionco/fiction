import { CliCommand } from '@factor/api/plugin-env'

export const commands = [
  new CliCommand({
    command: 'beacon',
    options: { exit: false, mode: 'production' },
  }),
  new CliCommand({
    command: 'session',
    options: { exit: false, mode: 'production' },
  }),
  new CliCommand({
    command: 'tag',
    options: { exit: false, mode: 'production' },
  }),

  new CliCommand({
    command: 'dev',
    options: { exit: false, mode: 'development' },
  }),
  new CliCommand({
    command: 'rdev',
    description: 'runs dev with nodemon',
    options: { mode: 'development', exit: false },
  }),
]
