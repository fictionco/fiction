import { CliCommand } from '@factor/api/plugin-env'

export const commands = [
  new CliCommand({
    command: 'app',
    description: 'runs form server',
    type: 'service',
    port: 12_321,
  }),
  new CliCommand({
    command: 'server',
    description: 'runs primary endpoint server',
    type: 'service',
    port: 8888,
  }),
  new CliCommand({
    command: 'render',
    description: 'renders the application and optionally serves it',
    type: 'build',
  }),
  new CliCommand({
    command: 'build',
    description: 'builds apps and bundles distributed modules',
    type: 'build',
  }),

  new CliCommand({
    command: 'dev',
    description: 'app/ui dev server',
    options: { exit: false },
    type: 'dev',
  }),
  new CliCommand({
    command: 'r-dev',
    description: 'app dev server, restarts on changes',
    options: { exit: false },
    type: 'dev',
  }),
]
