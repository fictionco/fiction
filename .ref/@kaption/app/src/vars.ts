import { CliCommand, EnvVar } from '@factor/api/plugin-env'

export const commands = [
  new CliCommand({
    command: 'server',
    description: 'runs primary endpoint server',
    type: 'service',
    port: 7777,
  }),
  new CliCommand({
    command: 'widget',
    description: 'runs widget socket server for analytics queries',
    type: 'service',
    port: 5555,
  }),
  new CliCommand({
    command: 'render',
    description: 'renders the application and optionally serves it',
    type: 'build',
  }),
  new CliCommand({
    command: 'app',
    description: 'serves static app',
    type: 'service',
    port: 3434,
  }),
  new CliCommand({
    command: 'build',
    description: 'builds apps and bundles distributed modules',
    type: 'build',
  }),
  new CliCommand({
    command: 'proxy',
    description: 'runs the CORS proxy server for websites',
    type: 'service',
    port: 2233,
  }),
  new CliCommand({
    command: 'beacon',
    description: 'runs beacon for analytics data',
    type: 'service',
    port: 2121,
  }),
  new CliCommand({
    command: 'session',
    description: 'runs session manager for processing analytics data',
    type: 'service',
    port: 3232,
  }),
  new CliCommand({
    command: 'tag',
    description: 'runs website static (cached) tag server',
    type: 'service',
    port: 2222,
  }),
  new CliCommand({
    command: 'forms',
    description: 'runs form server',
    type: 'service',
    port: 12_321,
  }),
  new CliCommand({
    command: 'rec',
    description: 'runs replay stream server',
    type: 'service',
    port: 7827,
  }),
  new CliCommand({
    command: 'generate',
    description: 'generate schema and db tables',
    type: 'util',
  }),
  new CliCommand({
    command: 'example',
    description: 'generates testing website and traffic with playwright',
    type: 'service',
    port: 1111,
  }),

  new CliCommand({
    command: 'dev',
    description: 'app/ui dev server',
    options: { exit: false },
    type: 'dev',
  }),
  new CliCommand({
    command: 'ddev',
    description: 'data pipeline dev',
    options: { exit: false },
    type: 'dev',
  }),
  new CliCommand({
    command: 'r-dev',
    description: 'app dev server, restarts on changes',
    options: { exit: false },
    type: 'dev',
  }),
  new CliCommand({
    command: 'r-ddev',
    description: 'data pipeline dev server, restarts on changes',
    options: { exit: false },
    type: 'dev',
  }),
]

export function envVars() {
  return [
    new EnvVar({ name: 'WIDGET_PORT', isOptional: true }),
  ]
}
