import { CliCommand } from '@factor/api/plugin-env'

export const commands = [
  new CliCommand({
    command: 'app',
    description: 'serves static app',
    type: 'service',
    port: 3434,
  }),
  new CliCommand({
    command: 'server',
    description: 'runs primary endpoint server',
    type: 'service',
    port: 7777,
  }),
  new CliCommand({
    command: 'tag',
    description: 'runs website static (cached) tag server',
    type: 'service',
    port: 2222,
  }),
  new CliCommand({
    command: 'embed',
    description: 'runs embedded apps',
    type: 'service',
    port: 12_321,
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

export function envVars() {
  return [
  // new EnvVar({ name: "WIDGET_PORT", isOptional: true }),
  ]
}
