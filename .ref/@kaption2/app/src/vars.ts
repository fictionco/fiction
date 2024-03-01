import { CliCommand } from '@factor/api/plugin-env'

export const commands = [
  new CliCommand({
    command: 'server',
    description: 'runs primary endpoint server',
    type: 'service',
    port: 6464,
  }),
  new CliCommand({
    command: 'app',
    description: 'serves static app',
    type: 'service',
    port: 7474,
  }),
  new CliCommand({
    command: 'render',
    description: 'renders the application and optionally serves it',
    type: 'build',
    clientCommand: 'app',
  }),

  new CliCommand({
    command: 'build',
    description: 'builds apps and bundles distributed modules',
    type: 'build',
  }),
  new CliCommand({
    command: 'generate',
    description: 'generate schema and db tables',
    type: 'util',
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
