import { CliCommand } from '@factor/api'

const comboPort = 3000

export const commands = [
  new CliCommand({
    command: 'render',
    description: 'renders app',
    options: { mode: 'production', exit: true },
    type: 'build',
  }),
  new CliCommand({
    command: 'build',
    description: 'renders app',
    options: { mode: 'production', exit: true },
    type: 'build',
  }),
  new CliCommand({
    command: 'server',
    description: 'runs endpoint server',
    options: { mode: 'production', exit: false },
    type: 'service',
    port: comboPort,
  }),
  new CliCommand({
    command: 'app',
    description: 'serves static app',
    options: { mode: 'production', exit: false },
    type: 'service',
    port: comboPort,
  }),
  new CliCommand({
    command: 'dev',
    description: 'runs services in dev mode',
    options: { mode: 'development', exit: false },
    type: 'dev',
  }),
  new CliCommand({
    command: 'r-dev',
    description: 'runs dev with nodemon',
    options: { mode: 'development', exit: false },
    type: 'dev',
  }),
  new CliCommand({
    command: 'generate',
    description: 'generate schema and db tables',
    type: 'util',
  }),
]
