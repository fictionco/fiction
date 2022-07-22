import { CliCommand } from "@factor/api/plugin-env"

export const commands = [
  new CliCommand({
    command: "build",
    description: "builds the app",
    options: { mode: "production", exit: true },
    type: "build",
  }),
  new CliCommand({
    command: "bundle",
    description: "bundles JS packages",
    options: { mode: "production", exit: true },
    type: "build",
  }),
  new CliCommand({
    command: "app",
    description: "serves a built app",
    options: { mode: "production", exit: false },
    type: "service",
    port: 3000,
  }),
  new CliCommand({
    command: "render",
    description: "renders app",
    options: { mode: "production", exit: true },
    type: "build",
  }),
  new CliCommand({
    command: "server",
    description: "runs endpoint server",
    options: { mode: "production", exit: false },
    type: "service",
    port: 3333,
  }),
  new CliCommand({
    command: "dev",
    description: "runs services in dev mode",
    options: { mode: "development", exit: false },
    type: "dev",
  }),
  new CliCommand({
    command: "r-dev",
    description: "runs dev with nodemon",
    options: { mode: "development", exit: false },
    type: "dev",
  }),
  new CliCommand({
    command: "release",
    description: "builds and releases packages on NPM",
    options: { mode: "production", exit: true },
    type: "util",
  }),
  new CliCommand({
    command: "deploy",
    description: "deploys changes to 'deploy' branch",
    options: { mode: "production", exit: true },
    type: "util",
  }),
  new CliCommand({
    command: "generate",
    description: "builds static schemas and config",
    options: { mode: "production", exit: true },
    type: "util",
  }),
]
