import { CliCommand } from '@factor/api/plugin-env'

export const commands = [
  new CliCommand({
    command: 'render',
    type: 'build',
  }),
  new CliCommand({
    command: 'www',
    type: 'service',
    port: 2525,
  }),
  new CliCommand({
    command: 'server',
    type: 'service',
    port: 3636,
  }),
  new CliCommand({
    command: 'dev',
    description: 'dev server',
    options: { exit: false },
    type: 'dev',
  }),
  new CliCommand({
    command: 'r-dev',
    description: 'runs dev and restarts server on changes',
    options: { exit: false },
    type: 'dev',
  }),
]
